var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/admin');

router.get('/create', controller.createAdmin);
router.get('/login', controller.getLogin);
router.post('/login', controller.postLogin);

router.use(passport.authenticate('jwt', { session: false }));
router.get('/posts', controller.getAdminPosts);

// CATEGORIES
router.get('/categories', controller.getAdminAllCategories);
router.post('/categories', controller.postAdminCategory);
router.get('/categories/:id', controller.getAdminCategory);
router.put('/categories/:id', controller.updateAdminCategory);
router.delete('/categories/:id', controller.deleteAdminCategory);

// POSTS
router.get('/posts', controller.getAdminAllPosts);
router.post('/posts', controller.postAdminPost);
router.get('/posts/:id', controller.getAdminPost);
router.put('/posts/:id', controller.updateAdminPost);
router.delete('/posts/:id', controller.deleteAdminPost);

module.exports = router;