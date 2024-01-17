const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const { permittedCrossDomainPolicies } = require('helmet');

const User = require('../models/userModel.js');
const catchAssyncErr = require('../utils/catchAssyncErr.js');
const AppError = require('../utils/AppError.js');

exports.updateSecurity = catchAssyncErr(async (req, res, next) => {
  const { password, newPassword, confirmNewPassword } = req.body;
  // user doc from the protect middleware
  const user = await User.findOne({ _id: req.user._id }).select('+password'); // to not include the password is the expected default behaviour defined in schema
  console.log(user);
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
  const updates = filteredBody(req.body, 'username', 'email');
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
