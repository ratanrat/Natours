const mongose = require('mongoose');
// const slugify = require('slugify');
const validator = require('validator');

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
    minlength: 8
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
UserSchema.pre('save', function(next) {});

const User = mongose.model('User', UserSchema);
module.exports = User;
