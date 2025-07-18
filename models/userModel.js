const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "First Name is Required"],
    maxlength: 32,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 32,
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is Required"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please Enter a valid Email",
    ],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password is Required"],
    minlength: [6, "Password must have at least 6 characters"],
  },
  role: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWTPRIVATEKEY, {
    expiresIn: 3600,
  });
};

module.exports = mongoose.model("User", userSchema);
