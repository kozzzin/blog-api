var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Admin = require('./models/admin');

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
  Admin.findOne({_id: jwt_payload.id}, function(err, user) {
    if (err) {
        return done(err, false);
    }
    if (user) {
        return done(null, user._id);
    } else {
        return done(null, false);
    }
  });
});



const mongoose = require("mongoose");
const mongoDb = process.env.DB;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

var app = express();




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

passport.use(jwtStrategy);
app.get(
  '/test',
  passport.authenticate('jwt', { session: false }),
  (req,res,next) => {
    res.send(req.user);
  }  
);



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);



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
