var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var authRouter = require('./routes/auth');

var app = express();
mongoose.connect("mongodb://localhost:27017/financial-advisory")
mongoose.connection.on('connected', ()=>{
  console.log("Database connected");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('dahnguy'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: '*'
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', rolesRouter);
app.use('/auth', authRouter);
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
  res.status(err.status || 500).send({
    success:false,
    message: err.message
  });
});

module.exports = app;
