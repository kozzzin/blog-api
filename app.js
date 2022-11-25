var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Admin = require('./models/admin');
const User = require('./models/user');

const dotenv = require('dotenv').config();

// Authorization stuff
//jwt stuff
const jwt = require("jsonwebtoken");
//passport stuff
const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

const jwtStrategy = new JwtStrategy(opts, (jwt_payload, done) => {
  if (jwt_payload.role === 'admin') {
    Admin.findOne({_id: jwt_payload.id}, function(err, user) {
      if (err) {
          return done(err, false);
      }
      if (user) {
          return done(null, { id: user._id, role: jwt_payload.role });
      } else {
          return done(null, false);
      }
    });
  } else {
    User.findOne({_id: jwt_payload.id}, function(err, user) {
      if (err) {
          return done(err, false);
      }
      if (user) {
          return done(null, { id: user._id, role: user.role });
      } else {
          return done(null, false);
      }
    });
  }
});
passport.use(jwtStrategy);


const mongoose = require("mongoose");
const mongoDb = process.env.DB;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

var indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

var app = express();

const cors = require('cors');
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req,res,next) => {
  console.log('middleware!');
  next();
});


app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
