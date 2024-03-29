var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); 
const dboper = require('./operations');
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
const { errorMonitor } = require('events');





const url = 'mongodb://localhost:27017/myRestaurant'
const connect = mongoose.connect(url);

connect.then((db)=>{

  console.log('Connected correctly to server');

  Dishes.create({
    name: 'Uthappizza',
    description: 'test'
  })
    .then((dish)=>{
      console.log(dish);

      return Dishes.findByIdAndUpdate(dish._id, {$set: {description: 'Updated test'}}, {new: true}).exec();
    })
    .then((dish)=>{
      console.log(dish);

      dish.comments.push({
        rating: 5,
        comment: 'I\'m getting a sinking feeling!',
        author: 'Leonardo di Carpaccio'
      });
      
      return dish.save();
    })
    .then((dish)=>{
      console.log(dish);

      return Dishes.deleteOne({});

      
    })
    .then(()=>{
      return mongoose.connection.close();
    })
    .catch((err)=>{
      console.log(err);
    });
});

// connection a la base de donnees mongodb


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);

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
