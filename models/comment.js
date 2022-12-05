const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: [true, 'You have to provide text of comment']
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  thread: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: false
  },
},{timestamps:true});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;