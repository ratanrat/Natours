const reviewdb = require('../models/reviewmodel');

const catchAsync = require('./../utils/catchAsync');

// const AppError = require('./../utils/appError');

exports.getallreview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.toourID) filter = { tour: req.params.tourID };
  const review = await reviewdb.find(filter);
  res.status(201).json({
    status: 'sucess',
    result: review.length,
    data: {
      review
    }
  });
});

exports.createreview = catchAsync(async (req, res, next) => {
  // allow nested routes this if condition (apilwillbelike:-> api/v1/tours/tourID/review                     )
  if (!req.body.tour) req.body.tour = req.params.toourID;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await reviewdb.create(req.body);
  res.status(201).json({
    status: 'sucess',
    data: {
      review
    }
  });
});
