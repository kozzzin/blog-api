const bcrypt = require('bcrypt');
const Admin = require('../models/admin');

exports.createAdmin = (req,res,next) => {
  const saltRounds = 10;
  const myPassword = 'admin';
  
  bcrypt.hash(
    myPassword,
    saltRounds,
    null
  ).then((hash) => {
    Admin.find({username: 'admin'}, function(err,result) {
      if (err) return res.send(err);
      if (result) return res.send('We have admin already');
      Admin.create({
        username: 'admin',
        password: hash,
      }).then(
        (result) =>  {

        }
      ).catch(err => res.send(err))
    })
    
  }).catch(err => res.send(err));
}

exports.adminLogin = (req,res,next) => {
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
            return res.send('you are logged in');
          } else {
            return res.send('wrong password');
          }
        });
    });

}




