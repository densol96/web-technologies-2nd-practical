const User = require('../models/userModel.js');
const catchAssyncErr = require('../utils/catchAssyncErr.js');
const AppError = require('../utils/AppError.js');
const Email = require('../utils/email.js');

const bcrypt = require('bcryptjs');
const jwt = require(`jsonwebtoken`);
const crypto = require(`crypto`);
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // expiresIn passed in as seconds
    expiresIn: +process.env.JWT_EXPIRES_IN * 24 * 60 * 60,
  });
};

const sendCookie = (user, res) => {
  const jwtToken = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + +process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // browser unable to modify/access the cookie, only auto store and send with every request
  };

  if (process.env.NODE_ENV.trim() === 'production') {
    cookieOptions.secure = true; // will be sent on HTTPS connection only
  }

  res.cookie('jwt', jwtToken, cookieOptions);

  res.status(201).json({
    status: 'success',
    jwt: jwtToken,
    data: {
      message: 'You have loggen in!',
      user: user.username,
    },
  });
};

exports.signUp = catchAssyncErr(async (req, res, next) => {
  // Create the user in DB, User model will run validators
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // Create email confirmation token and send the link via email
  const token = newUser.createEmailConfirmationToken();
  await newUser.save({ validateBeforeSave: false });
  const confirmUrl = `${req.protocol}://${req.get(
    'host'
  )}/email-confirmation/${token}`;

  // In case there were some problems with sending the email confirmation token - delete the user, because it will be imppossible for the client to activate it
  try {
    await new Email(newUser, confirmUrl).sendEmailConfirmLink();
  } catch (err) {
    await User.findOneAndDelete({ email: newUser.email });
    // Throw an error to be handled by Error Controller that will display it to the user
    throw new AppError(
      'Sign up is currently unavailable! Please try again later!',
      503
    );
  }

  res.status(201).json({
    status: 'success',
    name: 'Account has been created',
    message: 'Check your email for the activation link',
  });
});

exports.confirmEmail = catchAssyncErr(async (req, res, next) => {
  const tokenHash = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({ emailConfirmationToken: tokenHash });
  // In case it was already activated or some other error with the token, handle control to errorController
  if (!user)
    return next(
      new AppError(
        'Invalid email confirmation link! If you are unable to login, get in touch with the adminitrator!',
        404
      )
    );

  // Else if user has been activated
  user.emailConfirmed = true;
  user.emailConfirmationToken = undefined;
  await user.save({ validateBeforeSave: false });

  // All good, then next to viewer controller to render the success page for the user
  req.username = user.username;
  next();
});

exports.login = catchAssyncErr(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError(`No user with such email!`, 401));
  }
  if (!user.emailConfirmed) {
    return next(
      new AppError(
        'Email has not been confirmed yet! Please check your inbox!',
        403
      )
    );
  }
  if (user.accountLocked()) {
    return next(
      new AppError(
        'Authorisation has been disabled for this user! Please, check your email or get in touch with the administrator!',
        403
      )
    );
  }
  if (!(await user.checkPassword(password, user.password))) {
    user.loginAttempts += 1;
    let banned;
    if (user.loginAttempts === +process.env.WRONG_PASSWORD_LIMIT) {
      user.loginAttempts = 0;
      user.ban = new Date(
        Date.now() + +process.env.WRONG_PASSWORD_BAN_MIN * 60 * 1000
      );
      banned = true;
      next(
        new AppError(
          'Too many wrong login attempts! Your account has been locked!',
          401
        )
      );
      await new Email(user).frozenAccount();
    }
    if (!banned) {
      next(
        new AppError(
          `Wrong email or password! You have ${
            +process.env.WRONG_PASSWORD_LIMIT - user.loginAttempts
          } login attempts left!`,
          401
        )
      );
    }
    return await user.save({ validateBeforeSave: false });
  }
  // If all checks did not trigger, update wrong password counter and then hand out the JWT
  user.loginAttempts = 0;
  await user.save({ validateBeforeSave: false });
  sendCookie(user, res);
});

exports.forgotPassword = catchAssyncErr(async (req, res, next) => {
  // Checks first
  const { email } = req.body;
  if (!email) {
    return next(
      new AppError(
        'You need to provide an email where to send a new password!'
      ),
      400
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No user found with such email!'), 404);
  }
  // Create token for email and save encrypted version in DB
  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send the reset link to the user via email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/password-reset/${token}`;
  try {
    await new Email(user, resetUrl).sendPasswordResetLink();
  } catch (err) {
    // In case of some error, clear the fields, update the document in DB and throw an error to error controller
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError(
      'Password reset is currently unavailable! Please try again later!',
      503
    );
  }
  res.status(200).json({
    status: 'success',
    message: 'The password reset link has been sent to your email',
  });
});

exports.resetPassword = catchAssyncErr(async (req, res, next) => {
  const { token } = req.params;
  const { password, passwordConfirm } = req.body;

  const encryptedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  const user = await User.findOne({ passwordResetToken: encryptedToken });
  if (!user) {
    return next(
      new AppError(
        'Invalid reset token! If you are sure this is a mistake, get in touch with the admin!',
        404
      )
    );
  }
  if (!user.validateResetTokenExpiryDate()) {
    return next(
      new AppError(
        'Reset token has expired.. Try to use a new one (request it first!)',
        404
      )
    );
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;

  await user.save();
  res.status(200).json({
    status: 'success',
    message: 'Your password has been changed! You can now log in..',
  });
});

exports.idLoggedInSession = catchAssyncErr(async (req, res, next) => {
  if (req.cookies.jwt) {
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
    } catch (err) {
      // In case the JWT has not been verified(signatures not match or simply expired), just wanna continue as logged out user
      return next();
    }

    const user = await User.findOne({ _id: decoded.id });

    // Check if user still exists/active
    if (!user) {
      return next();
    }

    // Check if there was a password change since the issue of JWT
    if (user.passwordChangedAfter(decoded.iat)) {
      return next();
    }

    // Finally, after all checks, if we are here ==> we have a logged in user
    // Our SSR engine(pug) has access to variables inside 'locals'
    res.locals.user = user;
    console.log(user);
  }
  next();
});

exports.protect = catchAssyncErr(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token)
    throw new AppError(
      'This is a protected route! You must be logged in!',
      403
    );

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const user = await User.findOne({ _id: decoded.id });

  // Check if user still exists/active
  if (!user) {
    throw new AppError(
      'You have not passed authentication to access this resourse!',
      403
    );
  }

  if (user.passwordChangedAfter(decoded.iat)) {
    throw new AppError(
      'Your login session has expired, try to log in again!',
      403
    );
  }

  // Grant access
  req.user = user;
  next();
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedOutInvalidJwtCookie', {
    expires: new Date(Date.now() + 1000), // +1s
    httpOnly: true,
    secure: process.env.NODE_ENV.trim() === 'production',
    sameSite: 'Strict',
  });

  res.status(201).json({
    success: 'success',
    message: 'You have been logged out',
  });
};

exports.restrictTo = catchAssyncErr(async (req, res, next) => {
  console.log('Only admin should be able to access this resourse!');
  next();
});
