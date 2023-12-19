const cookieParser = require('cookie-parser');

const AppError = require('./utils/AppError.js');
const errorHandlerMiddleware = require('./controllers/errorController.js');

const express = require('express');
const app = express();

// Body Parsers to req.body
// "Content-Type: application/json"
app.use(
  express.json({
    limit: '10kb',
  })
);
// URL encoded form data
app.use(
  express.urlencoded({
    limit: '10kb',
    // extended: true // BY DEFAULT
  })
);

// Cookies parser to req.cookies
app.use(cookieParser());

// Serve Static Files
app.use(express.static(`${__dirname}/public`));

// Routing
// app.post('/', (req, res) => {
//   console.log(req.body);
//   res.end();
// });

app.all('*', (req, res, next) => {
  // Will implement the AppError class later to handle this
  next(new AppError('Page Not Found!', 404));
});

app.use(errorHandlerMiddleware);
module.exports = app;
