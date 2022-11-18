
const {promisify} = require('util');

const bcrypt = require('bcryptjs');

const jwtoken = require('jsonwebtoken');

const Userdb = require('../models/usermodel');

const catchAsync = require('../utils/catchAsync');

const AppError = require('./../utils/appError');

const sendEmail=require('./../utils/email');

 //<----------------token creaation------------------>
const signintoken = id => {
  return jwtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
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
    changePasswordAt:req.body.changePasswordAt, 
    role:req.body.role
  });
  const token = signintoken(newuser._id);
// console.log(token);  
  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      Users: newuser
    }
  });
});

//<---------------- login details checker--------------->
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1)check email and password is input

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  checkpassword = await bcrypt.hash(password, 12); // 12 is cost parameter

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
  const token = signintoken(userdetail._id);

  res.status(200).json({
    status: 'sucess',
    token
  });
});

//<----------------- protecting routes user loged in or note----------> 

exports.protectroutes = catchAsync(async (req, res, next) => {
  // 1)checking token exist or not
    let token;

  if(req.headers.authorization  && req.headers.authorization.startsWith('Bearer')){
    
    token=req.headers.authorization.split(' ')[1];

      }

      if(!token){
        return  next(new AppError('You are not looged plz login to access ',401))
      }
  // 2)token is valid or not

  const decoded = await promisify(jwtoken.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);
  
  // 3)check if  user still exist 

  const currentuser= await Userdb.findById(decoded.id);
  if(!currentuser){
    return next(new AppError('User belong to this token no longer exist !',401));
  }
  // 4) user change password aFter jwt  was issued iat is ( )
if (currentuser.changePasswordAfter(decoded.iat)) {
  return next(new AppError('User recently change password plz login to access !',401));
  
}
// grant access to next protected route 
req.user=currentuser;// storing current user in user variable 
  next();

});

//<--------------------------------- restrict user------------------------------> 
exports.restrictuser=(...roles)=>{ // roles storing arguments in array 
      return (req,res,next)=>{
  console.log(req.user.role);
      // roles contain [admin.lead-guide] if user is no any one of them he will not able to deleterecord
     result= roles.includes(req.user.role)
     console.log(result);
          if(!roles.includes(req.user.role)){ // matching usere role with function includes
            return next(new AppError('you do not have to permisson to perform this action',401));
          }
    next();
          
        } 

}

//<----------------- password reset functionality----------------->
exports.forgotpassword=catchAsync(async(req,res,next)=>{

  // 1)get the user based on email
    const userinfo=await Userdb.findOne({email:req.body.email});
    if(!userinfo){
      return next(new AppError('user is does not exist with this email',404));
    }
// 2)genrate random token 
   const randomstring=userinfo.createrandomstring();

  //  await userinfo.save({ validationBeforeSave:false });
   await userinfo.save({ validateBeforeSave: false });

// 3)sent it to email 
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


exports.resetpassword=()=>{

}