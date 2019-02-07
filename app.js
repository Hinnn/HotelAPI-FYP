var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const customers = require("./routes/customers");
const bookings = require("./routes/bookings");
const admin = require("./routes/admin");
// const cookiekey = require('./models/Key');

var app = express();
var port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log("running at localhost:" + port);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(cors());
//operations on customers
app.post('/customers/signUp', customers.signUp);
app.post('/customers/login', customers.login);
app.post('/customers/verification', customers.verification);
app.get('/customers/:email', customers.findOne);
app.put('/customers/:email', customers.EditInfo);

app.post('/admin/signUp', admin.signUp);
app.post('/admin/login', admin.login);
app.post('/admin/verification/:email', admin.verification);
app.put('/admin/:email', admin.EditInfo);

app.get('/bookings/:_id', bookings.findOne);
app.post('/bookings', bookings.addBooking);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

if (process.env.NODE_ENV |= 'test') {
    app.use(logger('dev'));
}
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