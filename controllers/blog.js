const Post = require('../models/post');

exports.getAllPosts = (req,res,next)  => {
  Post
    .find({})
    .where('visible').ne(false)
    .populate("category")
    .then(results => {
      return res.json(results);
    })
    .catch(err => res.json(err));
}


exports.getOnePost = (req,res,next)  => {
  Post
    .findOne({
      _id: req.params.id,
    })
    .populate("category")
    .then(results => {
      return res.json(results);
    })
    .catch(err => res.json(err));
}