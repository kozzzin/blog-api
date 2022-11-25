const express = require('express');
const router = express.router();

exports.getForm = (req,res,next) => {
  res.render('post-admin');
}