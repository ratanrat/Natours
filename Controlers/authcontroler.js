const { promisify } = require('util');

// const bcrypt = require('bcryptjs');

const jwtoken = require('jsonwebtoken');

const crypto = require('crypto');

// const { get } = require('http');

const Userdb = require('../models/usermodel');

const catchAsync = require('../utils/catchAsync');

const AppError = require('./../utils/appError');

const sendEmail = require('./../utils/email');

//<----------------token creaation------------------>
const signintoken = id => {
  return jwtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

//<----------------send token coomon functionality ------------------>
const createSendToken = (user, statusCode, res) => {
  const token = signintoken(user._id);

  // sending token via cookie
  const cookieoptins = {
    expires_in: new Date(Date.now() + 90) * 24 * 60 * 1000, //24*60*100this is for conver time in milli secod
    // secure: true,
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    cookieoptins.secure = true;
  }
  res.cookie('jwt', token, cookieoptins);
  // remove password from output dont displau
  user.password = undefined;

  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      user
    }
  });
};

//<---------------- register user------------------>
exports.signup = catchAsync(async (req, res) => {
  const newuser = await Userdb.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordconfirm: req.body.passwordconfirm,
    // changePasswordAt: req.body.changePasswordAt,
    role: req.body.role
  });
  // method 1
  // const token = signintoken(newuser._id);
  // res.status(201).json({
  //   status: 'sucess',
  //   token,
  //   data: {
  //     Users: newuser
  //   }
  // });

  // method 2 calling customize function
  createSendToken(newuser, 201, res);
});

//<---------------- login details checker--------------->
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1)check email and password is input

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  // const checkpassword = await bcrypt.hash(password, 12); // 12 is cost parameter
  // get user datials on he base of only  email
  const userdetail = await Userdb.findOne({ email }).select('+password'); //select use to get and dispaly  password of user , it set select:false

  // calling function corectpassword present in usermodel it is instance function therfore   available evryhere

  if (
    !userdetail ||
    !(await userdetail.correctPassword(password, userdetail.password))
  ) {
    return next(new AppError('Incorect email and pass', 401));
  }
  // 3) If everything ok, send token to client
  // method 2 to send token
  createSendToken(userdetail, 200, res);
});

//<----------------- protecting routes user loged in or note---------->

exports.protectroutes = catchAsync(async (req, res, next) => {
  // 1)checking token exist or not
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not looged plz login to access ', 401));
  }
  // 2)token is valid or not

  const decoded = await promisify(jwtoken.verify)(
    token,
    process.env.JWT_SECRET
  );

  console.log(decoded);

  // 3)check if  user still exist

  const currentuser = await Userdb.findById(decoded.id);
  if (!currentuser) {
    return next(
      new AppError('User belong to this token no longer exist !', 401)
    );
  }
  // 4) user change password aFter jwt  was issued iat is ( )
  if (currentuser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently change password plz login to access !', 401)
    );
  }
  // grant access to next protected route
  req.user = currentuser; // storing current user in user variable
  next();
});

//<--------------------------------- restrict user------------------------------>

exports.restrictuser = (...roles) => {
  // roles storing arguments in array
  return (req, res, next) => {
    // console.log(req.user.role);
    // roles contain [admin.lead-guide] if user is no any one of them he will not able to deleterecord
    // const result = roles.includes(req.user.role);
    // console.log(result);
    if (!roles.includes(req.user.role)) {
      // matching usere role with function includes
      return next(
        new AppError('you do not have to permisson to perform this action', 401)
      );
    }
    next();
  };
};

//<--------------------------- password reset functionality------------------------------------->

//<^^^^ first forgotpassword and send email token^^^^^^6>

exports.forgotpassword = catchAsync(async (req, res, next) => {
  // 1)get the user based on email
  const userinfo = await Userdb.findOne({ email: req.body.email });
  if (!userinfo) {
    return next(new AppError('user is does not exist with this email', 404));
  }
  // 2)genrate random token
  const randomstring = userinfo.createrandomstring();

  //  await userinfo.save({ validationBeforeSave:false });
  await userinfo.save({ validateBeforeSave: false });

  // 3)sent it to email
  // this is same as http://3000//api/v1/users/resetPassword/token
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${randomstring}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: userinfo.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    userinfo.passwordResetToken = undefined;
    userinfo.passwordResetExpires = undefined;
    await userinfo.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

//<^^^^ second get user on base of enter token and genrate new password ^^^^^^6>

exports.resetpassword = catchAsync(async (req, res, next) => {
  //1)get user on the  base of token(we already send token through url in email message )

  const hashtoken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const getuser = await Userdb.findOne({
    passwordResetToken: hashtoken,
    passwordResetExpires: { $gt: Date.now() }
  });

  //2)check token is expired or not if user is there then set new password
  if (!getuser) {
    return next(new AppError('Inavalid token or has expired token', 400));
  }

  getuser.password = req.body.password;
  getuser.passwordconfirm = req.body.passwordconfirm;
  getuser.passwordResetToken = undefined;
  getuser.passwordResetExpires = undefined;
  //3)upadte changepasswordat  property
  //we do this with instance method pre('save')
  await getuser.save();

  //4)log user in,send jwt

  // method 2 to send token
  createSendToken(getuser, 200, res);
});

//<---------------- for user self change his  password functionality------------------>

exports.changepassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await Userdb.findById(req.user._id).select('+password');

  //2) checking password match if not the show error otherwise continue using instance function
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordconfirm = req.body.passwordconfirm;
  await user.save();
  // 4) send jwt and login
  // method 2 to send token
  createSendToken(user, 200, res);
});
