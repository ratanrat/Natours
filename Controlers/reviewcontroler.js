// const catchAsync = require('./../utils/catchAsync');

// const AppError = require('./../utils/appError');

const reviews = require('./../models/reviewmodel');

// const APIFeatures = require('../utils/Apifeatures');

const factoryhandler = require('./allinonehandler'); //this handle all crud opration method 3 for all tout and as well as review

// exports.getallreview = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.toourID) filter = { tour: req.params.toourID };
//   console.log(filter);
//   const review = await reviewdb.find(filter);
//   res.status(201).json({
//     status: 'sucess',
//     result: review.length,
//     data: {
//       review
//     }
//   });
// });

// //method 1
// exports.createreview = catchAsync(async (req, res, next) => {
//   // allow nested routes this if condition (apilwillbelike:-> api/v1/tours/tourID/review                     )
//   if (!req.body.tour) req.body.tour = req.params.toourID;
//   if (!req.body.user) req.body.user = req.user.id;
//   const review = await reviewdb.create(req.body);
//   res.status(201).json({
//     status: 'sucess',
//     data: {
//       review
//     }
//   });
// });

// _______________________________METHOD2 using allinone handler---------------------------------------------
exports.settouranduserids = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.toourID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createreview = factoryhandler.createone(reviews);
exports.getallreview = factoryhandler.getall(reviews);
exports.deletereview = factoryhandler.deleteone(reviews);
exports.updatereview = factoryhandler.updateone(reviews);
