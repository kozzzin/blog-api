var express = require('express');
var router = express.Router();
const controller = require('../controllers/blog');

router.get('/',controller.getAllPosts);
router.get('/:id',controller.getOnePost);

module.exports = router;