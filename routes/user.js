var express = require('express');
const passport = require('passport');
var router = express.Router();
const user = require('../controllers/user');



router.post('/register', user.createUser);
router.post('/login', user.postLogin);

router.use(passport.authenticate('jwt', { session: false }));
router.get('/',user.getUserInfo);


module.exports = router;
