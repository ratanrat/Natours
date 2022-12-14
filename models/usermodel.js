const mongose = require('mongoose');

// const slugify = require('slugify');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const UserSchema = new mongose.Schema({
  name: {
    type: String,
    required: [true, 'plz tell us  name']
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    validate: [validator.isEmail, 'Please Provide valid email']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'lead_guide', 'guide'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'please provide a password '],
    // unique: true,
    trim: true,
    minlength: 8,
    select: false
  },
  passwordconfirm: {
    type: String,
    required: [true, 'please provide conform password '],
    validate: {
      // this wiil run on create and save user
      validator: function(el) {
        return el === this.password;
      }
    }
  },
  changePasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// this all are middle ware
// {

//<----------------------modify changepassword at  for after reset password ---------------------->
UserSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) next(); // if(this.password) is not modified and new then dont update it else update it

  this.changePasswordAt = Date.now() - 1000; // subtracting one second beacuse it modified first before token issued and when we check while login it ay problem if jwttimestamp  < iat
  next();
});

// <-----------------encrypt  the password --------------------------->

UserSchema.pre('save', async function(next) {
  // if we update all fields except  password then
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12); // 12 is cost parameter

  // now we encrypt password so no need of password confirm in db so delete
  this.passwordconfirm = undefined;
  next();
});

//   this will exicute on  every query which starts with find for  not display inactive user info
UserSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// } end of middleware104s

// this all are customize function instance function

// <----------------------for password check while login---------------------->

UserSchema.methods.correctPassword = async function(
  inputpassword,
  userpassword
) {
  return await bcrypt.compare(inputpassword, userpassword);
};

//<----------------------change password ---------------------->

UserSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.changePasswordAt) {
    // if data present in filed
    //to  get time in second so divide it by 1000

    const changetiemstmp = parseInt(this.changePasswordAt.getTime() / 1000, 10);
    return JWTTimestamp < changetiemstmp; // return true 0 that is if login time lessthan time of changepasswordat otherwise false so not chnage password
  }
  return false; // false if user not change password at the time of login with previous jwt token
};

//<---------------------- creating random string/token  for change password---------------------->

UserSchema.methods.createrandomstring = function() {
  //genrate  token
  const resetoken = crypto.randomBytes(32).toString('hex');

  // encrypt token and storing in db
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetoken)
    .digest('hex');

  console.log({ resetoken }, this.passwordResetToken);

  //  expire that token in 10minute
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetoken;
};

const User = mongose.model('User', UserSchema);
module.exports = User;
