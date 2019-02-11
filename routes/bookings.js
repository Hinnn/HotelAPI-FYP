let Booking = require('../models/bookings');
let express = require('express');
let router = express.Router();
/*
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');


    Booking.find(function(err, bookings) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(bookings,null,5));
    });
}
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Booking.find({ "_id" : req.params.id},function(err, booking) {
        if (err)
            res.json({ message: 'Booking NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(booking,null,5));
    });
}


function getTotalAmount(array) {
    let totalAmount = 0;
    array.forEach(function(obj) { totalAmount += obj.amount; });
    return totalAmount;
}
*/
router.addBooking = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let booking = new Booking();
    // var bookingID = Math.floor((Math.random() * 1000000) + 1);
    // booking.bookingID = req.params.bookingID;
    //booking.orderID = Math.floor((Math.random() * 1000000) + 1);
    booking.name = req.body.name;
    booking.email = req.body.email;
    booking.amount = req.body.amount;
    booking.roomType = req.body.roomType;
    booking.chackin_date = req.body.checkin_date;
    booking.leave_date = req.body.leave_date;
    booking.save(function(err) {
        if (err)
            res.json({ message: 'Booking NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Booking Successfully Added!', data: booking });
    });
}
/*router.edit = (req, res) => {

    // Find the relevant booking based on params id passed in

    res.setHeader('Content-Type', 'application/json');
    let booking = new Booking({
        //customerID: req.body.customerID,
        name: req.body.name,
        email: req.body.email,
        roomType: req.body.roomType,
        checkin_date: req.body.checkin_date,
        leave_date: req.body.leave_date,
        amount: req.body.amount,

    });
    Booking.update({"email": req.params.email},
    {
        roomType: req.body.roomType,
        checkin_date: req.body.checkin_date,
        leave_date: req.body.leave_date,
        amount: req.body.amount,
    },
    function (err, booking) {
        if (err)
            res.json({message: 'Booking Not Edited', errmsg: err});
        else
            res.json({message: 'Booking Edited successfully', data: booking});
    });
};

*/
router.deleteBooking = (req, res) => {
    Booking.findOneAndRemove({_id:req.params.id}, function (err) {
        if (!err) {
            res.json({message: 'Booking Successfully Deleted!'});
        }
        else
        //remove(req.params.customerID);
        //res.json({message: 'Booking Successfully Deleted!'});
            res.json({message: 'Booking NOT Found!', errmsg: err});
    });
}

/*router.findTotalAmount = (req, res) => {
    Booking.find(function(err, bookings) {
        if (err)
            res.send(err);
        else
            res.json({ totalamount : getTotalAmount(bookings) });
    });
}*/

module.exports = router;
