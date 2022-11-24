var express = require('express');
var router = express.Router();
const { createAdmin, adminLogin } = require('../controllers/admin');

router.get('/', createAdmin);

router.post('/login', adminLogin)

module.exports = router;