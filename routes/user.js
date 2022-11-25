var express = require('express');
var router = express.Router();
const user = require('../controllers/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', user.createUser);
router.post('/login', user.postLogin);



module.exports = router;
