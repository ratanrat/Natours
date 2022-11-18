const express = require('express');

const AppError = require('./utils/appError');

const errorControler = require('./Controlers/errorControler');

const app = express();

// const morgan = require('morgan');
const tourroutes = require('./routes/tourroutes');
const userroutes = require('./routes/userroutes');

// middleware for post
app.use(express.json());

// middleware for protect routes fgetting hedaers 
app.use((req,res,next)=>{
  console.log(req.headers);
  next();
}); 
// third party middleware
// if (process.env.NODE_ENV === 'development') {
//   console.log(`development`);
// } else if (process.env.NODE_ENV !== 'development') {
//   console.log('PRODUCTION');
// }

// api calling
app.use('/api/v1/tours', tourroutes); // calling
app.use('/api/v1/users', userroutes); // calling user routes

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
