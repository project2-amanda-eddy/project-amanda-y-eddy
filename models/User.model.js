const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
        type: String,
        match: [EMAIL_PATTERN, 'Email must have a valid format'],
        required: [true, 'Email is required'],
        unique: [true, 'Email is already in use'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Your password must have at least 8 characters']
    },
    googleID: {
      type: String,
    },
    hasProfileFilled: {
      type: Boolean,
      default: false,
      required: true
    },
    image: {
      type: String,
      default: "https://res.cloudinary.com/dgnace8dp/image/upload/v1676728201/profile-default_zk16xw.jpg"
    }
},
{
    timestamps: true,
}
);

userSchema.virtual('profile', {
  ref: 'Profile',
  foreignField: 'user',
  localField: '_id',
  justOne: true
})

userSchema.virtual('diary', {
  ref: 'Diary',
  foreignField: 'user',
  localField: '_id',
  justOne: true
})

userSchema.virtual('community', {
  ref: 'Community',
  foreignField: 'user',
  localField: '_id',
  justOne: true
})

userSchema.pre('save', function(next) {
  const rawPassword = this.password;
  if (this.isModified('password')) {
    bcrypt.hash(rawPassword, SALT_ROUNDS)
      .then(hash => {
        this.password = hash;
        next()
      })
      .catch(err => next(err))
  } else {
    next();
  }
})

userSchema.methods.checkPassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;