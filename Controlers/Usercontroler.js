const User = require('../models/usermodel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factoryhandler = require('./allinonehandler'); //this handle all crud opration method 3 for all tout and as well as review

// <------------filter the  element form array and store itin new array--------------------->

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// this foe if user wnat to delete self
exports.deleteme = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// exports.getalluser = catchAsync(async (req, res, next) => {
//   const data = await User.find();

//   res.status(200).json({
//     status: 'sucess',
//     results: data.length,
//     data: {
//       data
//     }
//   });
// });

// exports.deleteuser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'this api not define yet '
//   });
// };

// ------------------rotes for user want to pdate self---------------
exports.upateme = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordconfirm) {
    return next(
      new AppError(
        'this is not route for password update please use changepassword',
        400
      )
    );
  }
  // 2) filter data come form req.body only we want name and emailFiltered out unwanted fields names that are not allowed to be updated
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

// get me
exports.getme = (req, res, next) => {
  // this is for geting id of loged user it comeswe whenwe  exicute this after  authcontroler.protect routes req.user.id
  req.params.id = req.user.id;
  // then next function call middleware getone and get need id from param and alredy we get it using this logic
  next();
};
// _______________________________METHOD using allinone handler---------------------------------------------
exports.getUser = factoryhandler.getone(User);

// ----------this routes for admin
exports.getalluser = factoryhandler.getall(User);
exports.updateeuser = factoryhandler.updateone(User); // do not update password with this
exports.deleteuser = factoryhandler.deleteone(User);
