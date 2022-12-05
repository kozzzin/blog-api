const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const Post = require('../models/post');
const Category = require('../models/category');
const Comment = require('../models/comment');
const jwt = require("jsonwebtoken");
const async = require('async');


// ADD NEW ADMIN
exports.createAdmin = (req,res,next) => {
  const saltRounds = 10;
  const myPassword = 'admin';
  
  bcrypt.hash(
    myPassword,
    saltRounds,
    null
  ).then((hash) => {
    Admin.findOne({username: 'admin'}, function(err,result) {
      if (err) return res.send(err);
      if (!!result) return res.send('We have admin already');
      Admin.create({
        username: 'admin',
        password: hash,
      }).then(
        (result) =>  {
          res.send(result);
        }
      ).catch(err => res.send(err))
    })
    
  }).catch(err => res.send(err));
}

// LOGIN FRONT !
exports.getLogin = (req,res,next) => {
  res.render('adminLogin');
}


// LOGIN
exports.postLogin = (req,res,next) => {
  if (!req.body.username) {
    return res.send(`you have to provide username and password -- ${req.body.username}`);
  }
  Admin
    .findOne(
      {username: req.body.username},
      function(err,user) {
        if (!!err) return res.send(err);
        if (!user) return res.send('wrong name');
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (err) return res.send(err);
          if (result) {
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign({ id: user._id, role: 'admin' }, secret, {});
            return res.status(200).json({
                message: "Auth Passed",
                token
            })
          } else {
            return res.send('wrong password');
          }
        });
    });

}


exports.getAdminPosts = (req,res,next) => {
  Post
    .find()
    .populate('category')
    .then(
      (result) => {
        return res.json(result);
      }
    ).catch(
      err => res.json(err)
    )
}

// CATEGORIES
exports.getAdminAllCategories = (req,res,next) => {
  async.waterfall(
    [
      function(cb) {
        Category
          .find()
          .then(categories => cb(null,categories));
      },
      function(categories, cb) {
        Post
          .find()
          .populate('category')
          .then(posts => {
            const catsWithPostCount = categories.map(
              (cat) => {
                return {
                  ...cat._doc,
                  postsCount: posts.filter(
                    post => {
                      if (post.category === undefined) return false;
                      console.log(post.category._id);
                      return post.category._id.toString() === cat._doc._id.toString();
                    }
                  ).length
                }
              }
            );
            cb(null,catsWithPostCount);
          })
      }
    ],
    function(err, result) {
      console.log(result);
      return res.json(result);
    }
  );
}

// C
exports.postAdminCategory = (req,res,next) => {
  if (!req.body.name) return res.json('empty query');
  Category.create({
    name: req.body.name,
    description: req.body.description,
  }).then(
    (cat) => {
      return res.json(cat);
    }
  )
  .catch((err) => res.json(err));
} 

// R
exports.getAdminCategory = (req,res,next) => {
  Category
    .findById(req.params.id)
    .then(
      (cat) => {
        if (!cat) return res.json('not found');
        return res.json(cat);
      }
    )
    .catch((err) => res.json(err));
}

// U
exports.updateAdminCategory = (req,res,next) => {
  console.log(req.body);
  Category
  .findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description
    }
  )
  .then(
    (cat) => {
      if (!cat) return res.json('not found');
      return res.json(cat);
    }
  )
  .catch((err) => res.json(err));
} 

// D
exports.deleteAdminCategory = (req,res,next) => {
  Category
  .findByIdAndDelete(req.params.id)
  .then(
    (cat) => {
      if (!cat) return res.json('not found');
      return res.json(cat);
    }
  )
  .catch((err) => res.json(err));
}



// POSTS
exports.getAdminAllPosts = (req,res,next) => {
  Post
    .find()
    .populate(['category','author'])
    .then(
      (posts) => {
        return res.json(posts);
      }
  )
  .catch((err) => res.json(err));
} 

// C
exports.postAdminPost = (req,res,next) => {
  Post.create({
    title: req.body.title,
    teaser: req.body.teaser,
    text: req.body.text,
    category: req.body.category,
    author: req.body.author,
    visible: req.body.visible,
  }).then(
    (post) => {
      return res.json(post);
    }
  )
  .catch((err) => res.json(err));
}

// R
exports.getAdminPost = (req,res,next) => {
  Post
    .findById(req.params.id)
    .populate(['category','author'])
    .then(
      (post) => {
        if (!post) return res.json('not found');
        return res.json(post);
      }
)
.catch((err) => res.json(err));
} 

// U
exports.updateAdminPost = (req,res,next) => {
  Post.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      teaser: req.body.teaser,
      text: req.body.text,
      category: req.body.category,
      author: req.body.author,
      visible: req.body.visible,
    }).then(
    (post) => {
      return res.json(post);
    }
  )
  .catch((err) => res.json(err));
} 

// D
exports.deleteAdminPost = (req,res,next) => {
  Post
    .findByIdAndDelete(req.params.id)
    .then(
      (post) => {
        if (!post) return res.json('not found');
        return res.json(post);
      }
    )
    .catch((err) => res.json(err));  
} 


// give all comments
exports.getComments = (req,res,next) => {
  Comment
    .find()
    .populate('author','username')
    .populate('post')
    .then(
      (comments) => {
        return res.json(comments);
      }
    )
    .catch(err => res.json(err));
}

// delete cooment !
exports.deleteComment = (req,res,next) => {
  Comment
    .findByIdAndDelete(req.params.commentId)
    .then(result => res.json({status: 'deleted', details: result}))
    .catch(err => res.json(err))
}