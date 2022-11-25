const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: [true, 'You have to provide username']
  },
  password: {
    type: String,
    required: [true, 'You have to provide password']
  },
},{timestamps:true});

const Admin = mongoose.model("Admin", AdminSchema);


module.exports = Admin;