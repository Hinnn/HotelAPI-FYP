let mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

let mongodbUri ='mongodb://YueWang:donations999@ds127545.mlab.com:27545/hotelbooking-fyp';

mongoose.connect(mongodbUri,{useNewUrlParser:true});

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ] ');
});



const customers = require("./routes/customers");
const bookings = require("./routes/bookings");
const admin = require("./routes/admin");

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
app.post('/customers/logout', customers.logout);
//app.get('/customers/:email', customers.findOne);
app.put('/customers/edit/:email', customers.EditInfo);
app.put('/customers/changePassword/:email', customers.changePassword);

app.post('/admin/signUp', admin.signUp);
app.post('/admin/login', admin.login);
app.post('/admin/verification/:email', admin.verification);
//app.put('/admin/:email', admin.EditInfo);

//app.get('/bookings/:_id', bookings.findOne);
app.post('/bookings', bookings.addBooking);
app.put('/bookings/:email', bookings.editBooking);
app.delete('/bookings/:email',bookings.deleteBooking);
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
