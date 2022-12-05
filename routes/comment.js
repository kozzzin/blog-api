var express = require('express');
var router = express.Router();
const controller = require('../controllers/comment');
const passport = require('passport');

router.get('/:postId',controller.getCommentsForPost);

// REGISTERED AND ADMIN
router.use(passport.authenticate('jwt', { session: false }));
router.post('/:postId',controller.postComment);





module.exports = router;