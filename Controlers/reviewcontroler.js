const reviewdb = require('../models/reviewmodel');

const catchAsync = require('./../utils/catchAsync');

// const AppError = require('./../utils/appError');

exports.getallreview = catchAsync(async (req, res, next) => {
  const review = await reviewdb.find();
  res.status(201).json({
    status: 'sucess',
    data: {
      review
    }
  });
});

exports.createreview = catchAsync(async (req, res, next) => {
  const review = await reviewdb.create(req.body);
  res.status(201).json({
    status: 'sucess',
    data: {
      review
    }
  });
});
