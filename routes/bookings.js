const mongoose = require('mongoose');
let Booking = require('../models/bookings');
let express = require('express');
let router = express.Router();


let mongodbUri ='mongodb://YueWang:donations999@ds113435.mlab.com:13435/hotelapi-fyp';

mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ] ');
});


router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify(bookings,null,5));
    Booking.find(function(err, bookings) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(bookings,null,5));
    });
}
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    /* var booking = getByValue(bookings,req.params.orderID);
     // Create a donation variable and use the helper function to find req.params.id in our booking array
     if (booking != null)
         res.send(JSON.stringify(booking,null,5));//value,replacer,spacing
     else
         res.send('Booking NOT Found!!');
     // Then either return the found donation or a suitable error message*/
    Booking.find({ "_id" : req.params.id},function(err, booking) {
        // Booking.find({ "_id" : req.params._id },function(err, booking) {
        if (err)
            res.json({ message: 'Booking NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(booking,null,5));
    });
}

function getByValue(array, orderID) {
    var result  = array.filter(function(obj){return obj.orderID == orderID;} );
    return result ? result[0] : null; // or undefined
}

function getTotalAmount(array) {
    let totalAmount = 0;
    array.forEach(function(obj) { totalAmount += obj.amount; });
    return totalAmount;
}

router.addBooking = (req, res) => {
    /*Add a new booking to our list
    var orderID = Math.floor((Math.random() * 1000000) + 1); //Randomly generate an orderid
    var currentSize = bookings.length;
    //var customerID = require('../models/customers');
    //var roomID = require('../models/rooms');
    bookings.push({"orderID" : orderID, customerID: req.params.customerID, "paymenttype" : req.body.paymenttype,
        "date": req.body.date,"amount" : req.body.amount, "roomID" : req.body.roomID, "price" : req.body.price});

    if((currentSize + 1) == bookings.length)
        res.json({ message: 'Booking Added Successfully!'});
    else
        res.json({ message: 'Booking NOT Added!'});*/
    res.setHeader('Content-Type', 'application/json');
    var booking = new Booking();
    var orderID = Math.floor((Math.random() * 1000000) + 1);
    booking.customerID = req.params.customerID;

    booking.orderID = req.params.orderID;
    //booking.orderID = Math.floor((Math.random() * 1000000) + 1);
    booking.paymenttype = req.body.paymenttype;
    booking.date = req.body.date;
    booking.amount = req.body.amount;
    booking.roomNum = req.body.roomNum;
    booking.price = req.body.price;
    booking.save(function(err) {
        if (err)
            res.json({ message: 'Booking NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Booking Successfully Added!', data: booking });
    });
}

router.incrementAmount = (req, res) => {
    // Find the relevant booking based on params id passed in
    // Add 1 to orders property of the selected booking based on its id

    Booking.findById(req.params.id, function(err,booking) {
        if (err)
            res.json({ message: 'Booking NOT Found!', errmsg : err } );
        else {
            booking.amount += 1;
            booking.save(function (err) {
                if (err)
                    res.json({ message: ' Booking NOT Found -  NOT Successful!', errmsg : err } );
                else
                    res.json({ message: 'Booking Increased!', data: booking });
            });
        }
    });
}

router.deleteBooking = (req, res) => {
    /*Delete the selected booking based on its id
    var booking = getByValue(bookings,req.params.orderID);
    var index = bookings.indexOf(booking);
    var currentSize = bookings.length;
    bookings.splice(index, 1);
    if((currentSize - 1) === bookings.length)
        res.json({ message: 'Booking Deleted!'});
    else
        res.json({ message: 'Booking NOT Deleted!'});*/
    Booking.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Booking NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Booking Successfully Deleted!'});
    });
}

router.findTotalAmount = (req, res) => {
    /*
    let amount = getTotalAmount(bookings);
    res.json({totalamount : amount});*/
    Booking.find(function(err, bookings) {
        if (err)
            res.send(err);
        else
            res.json({ totalamount : getTotalAmount(bookings) });
    });
}

module.exports = router;
