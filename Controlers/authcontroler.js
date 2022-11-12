const bcrypt = require('bcryptjs');

const jwtoken = require('jsonwebtoken');

const User = require('../models/usermodel');

const catchAsync = require('../utils/catchAsync');

const AppError = require('./../utils/appError');

//  token creaation

const signintoken = id => {
  return jwtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
// register user
exports.signup = catchAsync(async (req, res) => {
  const newuser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordconfirm: req.body.passwordconfirm
  });
  const token = signintoken(user._id);

  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      Users: newuser
    }
  });
});

// login checker
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1)check email and password is input

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  checkpassword = await bcrypt.hash(password, 12); // 12 is cost parameter

  // get user datials on he base of only  email
  const userdetail = await User.findOne({ email }).select('+password'); //select use to getand dispaly  password of user , it set select:false

  // calling function corectpassword present in usermodel it is instance function therfore   available evryhere

  if (
    !userdetail ||
    !(await userdetail.correctPassword(password, userdetail.password))
  ) {
    return next(new AppError('Incorect email and pass', 401));
  }

  // 3) If everything ok, send token to client
  const token = signintoken(userdetail._id);

  res.status(200).json({
    status: 'sucess',
    token
  });
});

// protecting routes

exports.protectroutes = catchAsync(async (req, res, next) => {
  // 1)checking token exist or not

  // 2)token is valid or not

  // 3)check if  user still exist

  // 4) user change password ater jwt  was issued
  next();
});
