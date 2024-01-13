const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');
const crypto = require(`crypto`);
const { listen } = require('../app');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is a required field'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is a required field'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Provided email is not valid',
    },
  },
  avatar: {
    type: String,
    trim: true,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: ['Password is a required field'],
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function (password) {
        const specialCharsRegEx = /[!@#$%^&*()_+{}\[\]:;<>,.?~-]/;
        return specialCharsRegEx.test(password);
      },
      message:
        'Password must contain at least 1 special character: !@#$%^&*()_+{}[]:;<>,.?~-',
    },
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm password is a required field'],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Password and confirm password not match',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  role: {
    type: String,
    // admin will have acces to adding and editing animes + CMS over animes/reviews/users
    enum: ['user', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    // Instead of permanent delete, users will get deactivated for reference purposes
    default: true,
    select: false,
  },
  emailConfirmationToken: String,
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  ban: {
    // If exceeds 3 logging attempts or is given a temporary ban
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpiry: Date,
});

// For storing passwords, use more complicated encryption using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hash the password using the bcrypt with the CPU cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // validators in schema run before middleware => only relevant to user input sent via AJAX and handled in the controller
  this.passwordConfirm = undefined;
  next();
});

// Update password change date/time
userSchema.pre('save', function (next) {
  // If password not changed or this is a new document in DB - return
  if (!this.isModified('password') || this.isNew) return next();
  // TEST FOR ERRORS
  this.passwordChangedAt = Date.now();
  next();
});

// Exclude deactivated users from the user list
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Create random token, encryption permitted to be less complicated in these cases (will also require less resources) since we expect user to follow the confirmation/reset link shortly after it is sent out
const createRandomToken = function (docField) {
  // Will be sent to the user, therefore needs to be returned
  let randomToken = crypto.randomBytes(32).toString('hex');
  // Encrypted token stored in DB
  const encryptedToken = crypto
    .createHash('sha256')
    .update(randomToken)
    .digest('hex');
  this[docField] = encryptedToken;
  // For password resets the token will only be valid for 5 minutes since otherwise it could be a securitu issue
  if (docField === 'passwordResetToken') {
    const fiveMins = 1000 * 60 * 5;
    this['passwordResetExpiry'] = new Date(Date.now() + fiveMins);
  }
  return randomToken;
};

// Define as static methods so it is available on the user document (to be called in the auth controller)
userSchema.methods.createEmailConfirmationToken = function () {
  return createRandomToken.call(this, 'emailConfirmationToken');
};

userSchema.methods.createPasswordResetToken = function () {
  return createRandomToken.call(this, 'passwordResetToken');
};

userSchema.methods.checkPassword = async (input, password) => {
  return await bcrypt.compare(input, password);
};

userSchema.methods.accountLocked = function () {
  if (this.ban) {
    return Date.now() < this.ban;
  }
  return false;
};

userSchema.methods.validateResetTokenExpiryDate = function () {
  if (this.passwordResetExpiry) {
    return Date.now() < this.passwordResetExpiry;
  }
  return false;
};

userSchema.methods.passwordChangedAfter = function (timestampJWT) {
  if (this.passwordChangedAt) {
    const changedStampInSeconds = this.passwordChangedAt.getTime() / 1000;
    return timestampJWT < changedStampInSeconds;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
