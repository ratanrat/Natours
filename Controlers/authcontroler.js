const User = require('../models/usermodel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res) => {
  const newuser = await User.create(req.body);
  res.status(201).json({
    status: 'sucess',
    data: {
      Users: newuser
    }
  });
});
