const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'You have to provide title']
  },
  teaser: {
    type: String
  },
  text: {
    type: String,
    required: [true, 'You have to provide blog post text']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  author: {
    type: Schema.Types.ObjectId
  },
  visible: {
    type: Boolean,
    default: false
  }
},{timestamps:true});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;