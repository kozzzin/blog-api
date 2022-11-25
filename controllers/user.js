const bcrypt = require('bcrypt');
const User = require('../models/user');
const Post = require('../models/post');
const Category = require('../models/category');
const jwt = require("jsonwebtoken");


exports.createUser = (req,res,next) => {
  const saltRounds = 10;
  const myPassword = req.body.password;
  const username = req.body.username;
  
  bcrypt.hash(
    myPassword,
    saltRounds,
    null
  ).then((hash) => {
    User.findOne({username: username}, function(err,result) {
      if (err) return res.send(err);
      if (!!result) return res.send('This name has already been taken');
      User.create({
        username: username,
        password: hash,
      }).then(
        (result) =>  {
          res.send(result);
        }
      ).catch(err => res.send(err))
    })
    
  }).catch(err => res.send(err));
}

exports.postLogin = (req,res,next) => {
  if (!req.body.username) {
    return res.send(`you have to provide username and password -- ${req.body.username}`);
  }
  User
    .findOne(
      {username: req.body.username},
      function(err,user) {
        if (!!err) return res.send(err);
        if (!user) return res.send('wrong name');
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (err) return res.send(err);
          if (result) {
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign({ id: user._id, role: 'user' }, secret, {});
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