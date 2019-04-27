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
const auth = require('./middleware/check-auth');
const conditions = require("./routes/conditions");
const types = require("./routes/types");
// const images = require("./routes/images");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
// const fileFilter = (req, file, cb) => {
//     if (file.mimeType === 'image/jpeg' || file.mimeType === 'image/png' || file.mimeType === 'image/jpg') {
//         cb(null, true);
//     } else {
//         cb(new Error('Only .jpeg or .png files are accepted'), false);
//     }
// };
const upload = multer({
    storage: storage
    // limits: {
    //     fileSize: 1024 * 1024 *5
    // },
    // fileFilter: fileFilter

});

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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
// app.use(multer({dest:'/uploads'}));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:8080'
    // origin: 'https://feellikehomehotel.firebaseapp.com'
}));
app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use(cors());
//
app.use("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With, token");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Expose-Headers", "token");
    // res.header("x-auth-token",token);
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
app.put('/customers/:customer/edit', auth.authCustomer, customers.EditInfo);
app.put('/customers/changePassword/:customer', auth.authCustomer,customers.changePassword);
app.post('/customers/forgetPassword',customers.forgetPassword);
app.delete('/:admin/customers/:email',auth.authAdmin, customers.deleteCustomer);
app.get('/customers/:email', customers.findOne);
app.get('/:admin/customers', auth.authAdmin, customers.findAll);
// app.post('/customer/:id/uploadLogo', auth.authCustomer, images.uploadImage);
app.post('/admin/signUp', admin.signUp);
app.post('/admin/login', admin.login);
app.post('/admin/verification', admin.verification);
app.post('/admin/logout', admin.logout);
app.put('/admin/changePassword/:admin', auth.authAdmin, admin.changePassword);
app.post('/admin/forgetPassword',admin.forgetPassword);
app.get('/admin/:email', admin.findOne);

app.get('/:admin/bookings',auth.authAdmin, bookings.findAll);
app.get('/bookings/byEmail/:email',auth.authCustomer, bookings.findByCusEmail);
app.get('/bookings/getByCondition/:roomType',bookings.getByCondition);
app.post('/bookings', bookings.addBooking);
app.put('/bookings/:_id/edit', bookings.Edit);
//app.put('/:customers/bookings/:_id',auth.authCustomer,bookings.customerEdit);
app.delete('/bookings/delete/:id',bookings.deleteBooking);
app.get('/bookings/:id', bookings.getOne);
// app.post('/bookings/pay', bookings.pay);
app.post('/bookings/:id/pay', bookings.pay);
app.put('/bookings/:_id/changePayment', bookings.changePayment);
app.get('/rooms', rooms.findAll);
app.get('/rooms/byNum/:roomID', rooms.findOne);
app.get('/rooms/byType/:roomType', rooms.getByType);
app.put('/:customer/rooms/upvotes/:roomID', rooms.UpVotes);
app.post('/:admin/rooms', auth.authAdmin, upload.single('roomImage'), rooms.addRoom);
app.put('/:admin/rooms/edit/:roomID', auth.authAdmin, rooms.edit);
//app.put('/rooms/changeStatus/:roomID',rooms.changeStatus);
app.put('/:admin/rooms/addDiscount/:roomID', auth.authAdmin, rooms.addDiscount);
app.put('/:admin/rooms/deleteDiscount/:roomID', auth.authAdmin, rooms.deleteDiscount);
//comments
app.delete('/:admin/rooms/:roomID', auth.authAdmin, rooms.deleteRoom);

// app.get('/conditions/searchByDate', conditions.searchByDate);
app.get('/conditions/getAmountByType/:roomType', conditions.getAmountByType);
app.get('/conditions/multipleSelect/:checkin_date/:leave_date', conditions.multipleSelect);
app.get('/conditions/getReserveAmount/:checkin_date/:leave_date', conditions.getReserveAmount);
app.get('/conditions/getAvailableRooms/:roomType', conditions.getAvailableRooms);
app.get('/types/findByRoomType/:roomType',types.findByRoomType);
// app.get('/types/getType',types.getType);
app.post('/:admin/types',auth.authAdmin, upload.single('typeImage'), types.addType);
// app.get('/getAvailableRoom', conditions.getAvailableRoom);
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
