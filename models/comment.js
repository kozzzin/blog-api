const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  text: {
    type: String,
    required: [true, 'You have to provide text of comment']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  thread: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
},{timestamps:true});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;