const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  username: String,
  admin: {
    type: Boolean,
    default: true
  },
  email: String
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

module.exports = User;