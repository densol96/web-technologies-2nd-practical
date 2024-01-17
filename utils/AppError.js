class AppError extends Error {
  constructor(message, statusCode, name) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith(`4`) ? 'fail' : 'error';
    this.isOperational = true;
    this.name = name;
    this.errors;
  }
}

module.exports = AppError;
