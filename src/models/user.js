// module imports
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    gender: { type: String, enum: ['male', 'female'] },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ _id: this._id, type: 'user' }, process.env.JWT_SECRET);
};

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', UserSchema);
