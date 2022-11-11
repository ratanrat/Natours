const User = require('../models/usermodel');
const catchAsync = require('../utils/catchAsync');

const jwtoken = require('./jsonwebtoken ');

exports.signup = catchAsync(async (req, res) => {
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordconfirm: req.body.passwordconfirm
  });
  res.status(201).json({
    status: 'sucess',
    data: {
      Users: newuser
    }
  });
});
