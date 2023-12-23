const AppError = require('../utils/AppError.js');

const sendErrDev = (err, req, res) => {
  res.status(404).json({
    status: 'error',
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  console.log('💥💥💥');
  console.log(err);
  sendErrDev(err, req, res);
};
