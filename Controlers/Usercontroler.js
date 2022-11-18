const User = require('../models/usermodel');
const catchAsync = require('./../utils/catchAsync');

exports.getalluser = catchAsync(async (req, res, next) => {
  const data = await User.find();

  res.status(200).json({
    status: 'sucess',
    results: User.length,
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
