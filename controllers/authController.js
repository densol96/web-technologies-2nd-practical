const User = require('../models/userModel.js');
const catchAssyncErr = require('../utils/catchAssyncErr.js');
const AppError = require('../utils/AppError.js');
const Email = require('../utils/email.js');

const bcrypt = require('bcryptjs');
const jwt = require(`jsonwebtoken`);
const crypto = require(`crypto`);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: +process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
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
    username: user.username,
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
  )}/api/v1/users/email-confirmation/${token}`;

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
  user.emailConfirmed = true;
  user.emailConfirmationToken = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(201).json({
    status: 'success',
    message:
      'Your email has been confirmed! You can now log in using the form!',
  });
  // Redirect to the "success" page with the passed-on message for render
  // req.successText =
  //   'Your email has been confirmed! You can now log in using the form!';
  // req.redirectUrl = '/login';
  // res.redirect('/success-page');
});
// JWT for expiry time uses amount of SECONDS (num) or a special format string like 3d, 2h etc.

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
  // If all checks did not trigger, then hand out the JWT
  sendCookie(user, res);
});
