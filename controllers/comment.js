const Comment = require('../models/comment');

// read
exports.getCommentsForPost = (req,res,next) => {
  Comment
    .find(
      {
        post: req.params.postId
      }
    )
    .populate('author','username')
    .then(
      (comments) => {
        return res.json(comments);
      }
    )
    .catch(err => res.json(err));
}


// IF REGISTERED || ADMIN
exports.postComment = (req,res,next) => {
  Comment.create({
    text: req.body.text,
    post: req.body.post,
    author: req.user.id,
    thread: req.body.thread,
  }).then(
    (comment) => {
      Comment.find({
        'post': req.body.post
      })
      .populate('author')
      .then(result => res.json(result))
    }
  )
  .catch((err) => res.json(err));
}

// We don't need update function to avoid extra problems! For now.
exports.editComment = (req,res,next) => {
  return false;
}

