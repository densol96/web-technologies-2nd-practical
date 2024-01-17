const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/AppError.js');
const errorHandlerMiddleware = require('./controllers/errorController.js');

const apiRouter = require('./routers/apiRouter.js');
const viewRouter = require('./routers/viewRouter.js');

const express = require('express');
const app = express();

// CONFIGURE PUG AS A VIEW ENGINE FOR RENDERING PAGES
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Protection agains DDoS
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 1000, // 1000 requests per minute from the same IP
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    // running dev-data on port 5501 while developing client code
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
// URL encoded FORM DATA
app.use(
  express.urlencoded({
    limit: '10kb',
    // extended: true // BY DEFAULT
  })
);

// Cookies parser to req.cookies
app.use(cookieParser());

// Data sanitazation against NoSQL query injection (filters out $ and . in body, params, query)
app.use(mongoSanitize());

// Data sanitization against XSS (malicious scripts)
app.use(xss());

// Prevent HTTP Parameter Pollution ()
app.use(hpp());

// Serve Static Files
app.use(express.static(`${__dirname}/public`));

// API related requests
app.use('/api/v1/', apiRouter);

// For accessing web-application directly in browser
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  // Will implement the AppError class later to handle this
  next(new AppError('Page Not Found!', 404));
});

app.use(errorHandlerMiddleware);
module.exports = app;
