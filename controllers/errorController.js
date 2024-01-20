const AppError = require('../utils/AppError.js');

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  let message = 'Invalid input data: ';
  errors.forEach((errorText, i) => {
    message += `${errorText}`;
    message += i !== errors.length - 1 ? ', ' : '.';
  });
  const validationError = new AppError(message, 400);
  validationError.name = 'Invalid input data';
  validationError.errors = errors;
  return validationError;
};

const handleDuplicateFieldsErrorDB = (err) => {
  let message = `Duplicate field/s: `;
  const errors = [];
  Object.entries(err.keyValue).forEach(([field, value], i) => {
    const pair = `${
      field.slice(0, 1).toUpperCase() + field.slice(1)
    } "${value}" already exists`;
    errors.push(pair);
    message += pair;
    message += i !== errors.length - 1 ? ', ' : '.';
  });
  const duplicateError = new AppError(message, 400);
  duplicateError.name = 'Duplicate input data';
  duplicateError.errors = errors;
  return duplicateError;
};

const sendErrDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message,
      name: err.name,
      errors: err.errors,
    });
  }
  // THE PORTAL ITSELF
  else {
    res.status(err.statusCode).render('siteFront/error', {
      errorName: err.name,
      errors: err.errors,
      message: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  console.log(err);
  console.log(err.name);
  console.log(err.code);
  if (process.env.NODE_ENV.trim() === 'development') {
    let error = err;
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    else if (err.code === 11000) error = handleDuplicateFieldsErrorDB(err);
    sendErrDev(error, req, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error;
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    else if (err.code === 11000) error = handleDuplicateFieldsErrorDB(err);
    sendErrDev(error, req, res);
  }
};
