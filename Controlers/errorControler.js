// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// };

const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  // console.log(err);
  const message = `Duplicate field value:' ${err.keyValue.name}.' Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handlejwterror=err=>{
  const message='Invalid token plz log in again';
  return new AppError(message, 401);

}
const handlejwtexpireerror=err=>{
  const message='Your token is expired plz log in again';
  return new AppError(message, 401);

}
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR FROM ERROR ENTROLER MSG ');
    console.log(err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: `Something went very wrong!${err}`
    });
  }
};


module.exports = (err, req, res, next) =>{
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV !== 'development') {
    // console.log(`in error controler enviroment is${process.env.NODE_ENV}`);

    let error = { ...err };

    if (error.kind === 'ObjectId') error = handleCastErrorDB(error); //this is for undefined id
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); //this insert duplicate record
    if (error._message === 'Tour validation failed')
      error = handleValidationErrorDB(error); //validation on input
    if(error.name==='JsonWebTokenError') error=handlejwterror(error);//for invalid jwt 
    if(error.name==='TokenExpiredError') error=handlejwtexpireerror(error);//for expie jwt tokens 

    sendErrorProd(error, res);//thisn is for no match found errror 
  }
};
