const mongose = require('mongoose');

// const slugify = require('slugify');

const validator = require('validator');

const bcrypt = require('bcryptjs');

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
  }
});
UserSchema.pre('save', async function(next) {
  // if we update all fields except  password then
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12); // 12 is cost parameter

  // now we encrypt password so no need of password confirm in db so delete
  this.passwordconfirm = undefined;
  next();
});

// for password check
UserSchema.methods.correctPassword = async function(
  inputpassword,
  userpassword
) {
  return await bcrypt.compare(inputpassword, userpassword);
};

const User = mongose.model('User', UserSchema);
module.exports = User;
