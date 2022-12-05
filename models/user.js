const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'You have to provide username']
  },
  password: {
    type: String,
    required: [true, 'You have to provide password']
  },
  role: {
    type: String,
    default: 'user'
  },
  banned: {
    type: Boolean,
    default: false
  },
},{timestamps:true});

const User = mongoose.model("User", UserSchema);

module.exports = User;