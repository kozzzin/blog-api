const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'You have to provide category name']
  },
  description: {
    type: String
  }
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;