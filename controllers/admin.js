const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const Post = require('../models/post');
const Category = require('../models/category');
// const dotenv = require('dotenv').config();
const jwt = require("jsonwebtoken");

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

exports.getLogin = (req,res,next) => {
  res.render('adminLogin');
}

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
            const token = jwt.sign({ id: user._id }, secret, {expiresIn:9999});
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
  Category
    .find()
    .then(
      (cat) => {
        return res.json(cat);
      }
    )
    .catch((err) => res.json(err));
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

// exports.postAdminPost = (req,res,next)  => {
  
// }



