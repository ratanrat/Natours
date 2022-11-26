const express = require('express');

const ratelimit = require('express-rate-limit');

const helmet = require('helmet');

const mongosanitize = require('express-mongo-sanitize');

const xssclean = require('xss-clean');

const hpp = require('hpp');

const AppError = require('./utils/appError');

const errorControler = require('./Controlers/errorControler');

const app = express();

// const morgan = require('morgan');

// set security http headers
app.use(helmet());

// middleware for post
app.use(express.json());

// data sanitization prevent from nosql injection
app.use(mongosanitize());
//  xss attack(cross side scripting attack)
app.use(xssclean());

// para meter polution
app.use(
  hpp({
    whitelist: ['duration', 'price']
  })
);
//custom middleware rate limiting prevent from bruteforce attack
const limiter = ratelimit({
  max: 100,
  wimdowMs: 60 * 60 * 1000,
  message: 'To many request from this Ip ,please try again i hour!'
});

// third party middleware
// if (process.env.NODE_ENV === 'development') {
//   console.log(`development`);
// } else if (process.env.NODE_ENV !== 'development') {
//   console.log('PRODUCTION');
// }
const tourroutes = require('./routes/tourroutes');
const userroutes = require('./routes/userroutes');
const reviewroutes = require('./routes/reviewroutes');
// api calling
app.use('/api', limiter); // this will apply on every api which starts with api
app.use('/api/v1/tours', tourroutes); // calling tour routes
app.use('/api/v1/users', userroutes); // calling user routes
app.use('/api/v1/review', reviewroutes);
//wrong api handller
app.all('*', (req, res, next) => {
  // const err = new Error(`can't found ${req.originalUrl},on this error `);
  // err.statusCode = 404;
  // err.status = 'fail';
  next(new AppError(`can't found ${req.originalUrl},on this sevrver `, 404));
});

// custom Error handling  midleware

// method 1
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// });

// method 2
app.use(errorControler);
module.exports = app;
