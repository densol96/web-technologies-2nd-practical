const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

const AppError = require('./utils/AppError.js');
const errorHandlerMiddleware = require('./controllers/errorController.js');

const apiRouter = require('./routers/apiRouter.js');
const viewRouter = require('./routers/viewRouter.js');

const express = require('express');
const app = express();

// CONFIGURE PUG AS A VIEW ENGINE FOR RENDERING PAGES
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: 'http://127.0.0.1:5501',
  })
);

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
app.use((req, res, next) => {
  console.log('INCOMING REQUEST!');
  console.log(req.url);
  next();
});

// Serve Static Files
app.use(express.static(`${__dirname}/public`));

// API related requests
app.use('/api/v1/', apiRouter);

// For accessing web-application directly in browser
app.use('/', viewRouter);

app.use((req, res) => {
  console.log('went through');
  res.end();
});
app.all('*', (req, res, next) => {
  // Will implement the AppError class later to handle this
  next(new AppError('Page Not Found!', 404));
});

app.use(errorHandlerMiddleware);
module.exports = app;
