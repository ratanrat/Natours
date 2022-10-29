const express = require('express');

const app = express();
const morgan = require('morgan');
const tourroutes = require('./routes/tourroutes');
const userroutes = require('./routes/userroutes');

// middleware for post
app.use(express.json());
// third party middleware
if (process.env.NODE_ENV === 'development') {
  console.log(app.use(morgan('dev')));
}

// api calling
app.use('/api/v1/tours', tourroutes); // calling
app.use('/api/v1/users', userroutes); // calling user routes

module.exports = app;
