const User = require('../models/usermodel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// <------------filter the  element form array and store itin new array--------------------->

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.deleteme = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getalluser = catchAsync(async (req, res, next) => {
  const data = await User.find();

  res.status(200).json({
    status: 'sucess',
    results: data.length,
    data: {
      data
    }
  });
});

exports.createuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this api not define yet '
  });
};

exports.deleteuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this api not define yet '
  });
};

exports.upateme = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordconfirm) {
    return next(
      new AppError(
        'this is not route for password update please use changepassword',
        400
      )
    );
  }

  // 2)filter data come form req.body only we want name and email

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
