var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// let jwt = require('jsonwebtoken');

let mongoose = require('mongoose');
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
const rooms = require("./routes/rooms");
const auth = require('./models/auth');
const cookiekey = require('./models/secretkey');

var app = express();
var port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log("running at localhost:" + port);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cookiekey.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:8080'
}));
app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use(cors());
//
app.use("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With, token");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Expose-Headers", "token");
    if (req.method === 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
});

//operations on customers
app.post('/customers/signUp', customers.signUp);
app.post('/customers/login', customers.login);
app.post('/customers/verification', customers.verification);
app.post('/customers/logout', customers.logout);
app.put('/customers/:customer/edit', customers.EditInfo);
app.put('/customers/changePassword/:email', customers.changePassword);
app.post('/customers/forgetPassword',customers.forgetPassword);
app.delete('/:admin/customers/:email', customers.deleteCustomer);
app.get('/customers/:email', customers.findOne);
app.get('/:admin/customers', customers.findAll);

app.post('/admin/signUp', admin.signUp);
app.post('/admin/login', admin.login);
app.post('/admin/verification', admin.verification);
app.post('/admin/logout', admin.logout);
app.put('/admin/changePassword/:email', admin.changePassword);
app.post('/admin/forgetPassword',admin.forgetPassword);
app.get('/admin/:admin', admin.findOne);

app.get('/bookings',bookings.findAll);
app.get('/bookings/byEmail/:email',bookings.findOne);
// app.get('bookings/:id',bookings.getOne);
app.post('/bookings', bookings.addBooking);
app.put('/bookings/edit/:_id', bookings.Edit);
//app.put('/:customers/bookings/:_id',auth.authCustomer,bookings.customerEdit);
app.delete('/bookings/delete/:id',bookings.deleteBooking);
app.get('/bookings/:id', bookings.getOne);

app.get('/rooms', rooms.findAll);
app.get('/rooms/:roomNum', rooms.findOne);
app.get('/rooms/:roomType', rooms.getByType);
app.put('/rooms/upvotes/:roomNum', rooms.UpVotes);
app.post('/:admin/rooms', auth.authAdmin, rooms.addRoom);
app.put('/:admin/rooms/edit/:roomNum', auth.authAdmin, rooms.edit);
//app.put('/rooms/changeStatus/:roomNum',rooms.changeStatus);
app.put('/:admin/rooms/addDiscount/:roomNum', rooms.addDiscount);
app.put('/:admin/rooms/deleteDiscount/:roomNum', rooms.deleteDiscount);
//comments
app.delete('/:admin/rooms/:roomNum', auth.authAdmin, rooms.deleteRoom);


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
