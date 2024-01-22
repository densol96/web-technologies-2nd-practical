const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const { permittedCrossDomainPolicies } = require('helmet');

const User = require('../models/userModel.js');
const catchAssyncErr = require('../utils/catchAssyncErr.js');
const AppError = require('../utils/AppError.js');
const APIFeatures = require('../utils/APIFeatures.js');
const { request } = require('http');

exports.updateSecurity = catchAssyncErr(async (req, res, next) => {
  const { password, newPassword, confirmNewPassword } = req.body;
  // user doc from the protect middleware
  const user = await User.findOne({ _id: req.user._id }).select('+password'); // to not include the password is the expected default behaviour defined in schema

  if (!(await user.checkPassword(password, user.password))) {
    return next(
      new AppError('Provided current password is wrong', 400, 'Invalid data')
    );
  }
  user.password = newPassword;
  user.passwordConfirm = confirmNewPassword;

  await user.save(); // pre-save middleware and schema validators will run appropriate checks
  res.status(200).json({
    status: 'success',
    name: 'Changes made',
    messages: [
      'Your password has been changed succesfully',
      'You will need to log in to your account againusing your new password',
    ],
  });
});

//-------------- UPDATE SETTINGS PART ----------------------
// MULTER CONFIGURATION
// Store in buffer first, do not write to disk immediately cause I wanna process and edit the uploaded avatar
const buffer = multer.memoryStorage();
const filter = (req, file, cb) => {
  // want the uploaded file to be an image (i do a check on the client side too, but just in case)
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'The file you are trying to upload is not an image',
        400,
        'Wrong file format'
      ),
      false
    );
  }
};

const upload = multer({
  storage: buffer,
  fileFilter: filter,
});

exports.uploadAvatar = upload.single('avatar');

// then add image processing to route's middleware stack
exports.processImage = catchAssyncErr(async (req, res, next) => {
  if (!req.file) return next();
  // Else
  // If used as a part of admin panel for a different user in the list -> hits the route/admin/users/:id else will be /me-settings
  if (req.params.id) {
    const { id } = req.params;
    req.user._id = id;
  }

  const filename = `${req.user._id}.jpeg`;
  req.filename = filename; // will need this for DB reference
  await sharp(req.file.buffer)
    .resize(200, 200)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${filename}`);
  next();
});

const filteredBody = (object, ...fields) => {
  const filtered = {};
  fields.forEach((key) => {
    filtered[key] = object[key];
  });
  return filtered;
};

exports.updateSettings = catchAssyncErr(async (req, res, next) => {
  const updates = filteredBody(req.body, 'username', 'email', 'emailIsPublic');
  if (req.filename) updates.avatar = req.filename;

  await User.findByIdAndUpdate(req.user._id, updates, {
    runValidators: true, // important to run validators here to ensure username/email are free
  });

  res.status(200).json({
    status: 'success',
    name: 'Profile updated',
    message: 'Changes have been applied to your profile',
  });
});

// CMS -----------> USERS

exports.getUsers = catchAssyncErr(async (req, res, next) => {
  if (req.query.userFilter) {
    const user = await User.findOne({ username: req.query.userFilter });
    if (!user)
      throw new AppError(
        'No user with such username found',
        404,
        'Invalid input'
      );
    return res.status(200).json({
      status: 'success',
      data: [user],
    });
  }
  const query = new APIFeatures(User.find(), req.query, 'User')
    .sort()
    .paginate();
  const users = await query.mongooseQuery;
  const total = await User.countDocuments();
  const DOCS_PER_PAGE = 5;
  const pagesTotal = Math.ceil(total / DOCS_PER_PAGE);
  res.status(200).json({
    status: 'success',
    data: users,
    pagesTotal,
  });
});

exports.adminUpdateUser = catchAssyncErr(async (req, res, next) => {
  const { id } = req.params;
  const updates = filteredBody(
    req.body,
    'username',
    'email',
    'emailIsPublic',
    'emailConfirmed',
    'role',
    'ban',
    'active'
  );
  // convert strings to bool
  if (updates.emailIsPublic === 'false') {
    updates.emailIsPublic = false;
  } else {
    updates.emailIsPublic = true;
  }

  if (updates.emailConfirmed === 'false') {
    updates.emailConfirmed = false;
  } else {
    updates.emailConfirmed = true;
  }

  if (updates.ban === 'undefined') {
    updates.ban = undefined;
  }

  if (updates.active === 'false') {
    updates.active = false;
  } else {
    updates.active = true;
  }

  // req.filename comes from .processImage
  if (req.filename) updates.avatar = req.filename;

  await User.findByIdAndUpdate(id, updates, {
    runValidators: true, // important to run validators here to ensure username/email are free
  });

  res.status(200).json({
    status: 'success',
    name: 'Profile updated',
    message: 'Changes have been applied to your profile',
  });
});

exports.adminCreateUser = catchAssyncErr(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    emailConfirmed: true,
  });

  res.status(200).json({
    status: 'success',
    message: `User ${user.username} has been created`,
  });
});
