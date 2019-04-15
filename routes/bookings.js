let Booking = require('../models/bookings');
let express = require('express');
let mail = require('../models/order_mail');
let router = express.Router();
// let order = router.addBooking.booking;

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    // if (req.params.admin == null ) {
    //     res.json({ message: 'You can not do this operation!'});
    // } else {
        Booking.find(function (err, bookings) {
            if (err)
                res.send(err);
            else
            res.send(JSON.stringify(bookings, null, 5));
        });
    }
/*
router.adminFind = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.params.admin == null ) {
        res.json({ message: 'You can not do this operation!'});
    } else {
    Booking.find({ "_id" : req.params.id},function(err, booking) {
        if (err)
            res.json({ message: 'Booking NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(booking,null,5));
    });
}
*/
router.findByCusEmail= (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // if (req.params.customer == null) {
    //     res.json({message: 'You can not do this operation!'});
    // } else {
        Booking.find({"email": req.params.email}, function (err, booking) {
            if (err)
                res.json({message: 'Booking NOT Found!', errmsg: err});
            else
                res.send(JSON.stringify(booking, null, 5));
        });
    }
// }
//
// router.getOne = (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     // if (req.params.customer == null) {
//     //     res.json({message: 'You can not do this operation!'});
//     // } else {
//     Booking.find({"id": req.params._id}, function (err, booking) {
//         if (err)
//             res.json({message: 'Booking NOT Found!', errmsg: err});
//         else
//             res.send(JSON.stringify(booking, null, 5));
//     });
//     // }
// }
router.getOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Booking.findById(req.params.id, function(err, booking){
        if (err){
            res.json({message: 'Booking not found', data: null});
        } else {
            res.json({data: booking});
        }
    });
};

router.addBooking = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var d1 = req.body.checkin_date;
    var d2 = req.body.leave_date;
    var d5 = new Date();//get current date
    d5.toLocaleDateString();
    console.log(d5);
    var d3 = new Date(d1).getTime();
    var d4 = new Date(d2).getTime();
    var d6 = new Date(d5).getTime();
    let dateDiff = d4 - d3;
    let booking = new Booking();
    booking.contactNum = req.body.contactNum;
    booking.name = req.body.name;
    booking.email = req.body.email;
    booking.amount = req.body.amount;
    booking.roomType = req.body.roomType;
    booking.checkin_date = req.body.checkin_date;
    booking.leave_date = req.body.leave_date;
    booking.days =  Math.floor(dateDiff / (24 * 3600 * 1000))
    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    let email = req.body.email;
    // var d1 = req.body.checkin_date;
    // var d2 = req.body.leave_date;
    // var d5 = new Date();//get current date
    // d5.toLocaleDateString();
    // console.log(d5);
    // var d3 = new Date(d1).getTime();
    // var d4 = new Date(d2).getTime();
    // var d6 = new Date(d5).getTime();
    if (booking.name == null || booking.email == null || booking.contactNum == null || booking.amount == null || booking.roomType == null || booking.checkin_date == null || booking.leave_date == null) {
        res.json({message: 'Please complete all the information!', data: null})
    }
    else if (!checkEmail.test(booking.email)) {
        res.json({message: 'Wrong email format!'})
    }
    else if (10 !== req.body.contactNum.length) {
        res.json({message: 'Your phone number should contain 10 characters!', data: null})
    } else if (0 > req.body.amount) {
        res.json({message: 'Please choose at least one room!', data: null})
    } else if (4 < req.body.amount) {
        res.json({message: 'You can only book no more than 3 rooms!', data: null})
    } else if (d3 > d4) {
        res.json({message: 'Leaving date should be later than check in date!', data: null})
    } else if (d3 < d6) {
        res.json({message: 'The earliest day is the next day!', data: null})
    }
    else {
        booking.save(function (err) {
            if (err)
                res.json({message: 'Booking NOT Added!', errmsg: err});
            else
                mail.sendEmail(email, booking)
                res.json({message: 'Booking Successfully Added!', data: booking});
        });
    }
}

    router.Edit = (req, res) => {
        // Find the relevant booking based on params id passed in

        res.setHeader('Content-Type', 'application/json');
        let booking = new Booking();
       //  booking.contactNum = req.body.contactNum
        booking.roomID = req.body.roomID;
            if(booking.roomID == null) {
                res.json({message: 'Please choose a room!', data: null})
            // } else if (10 !== req.body.contactNum.length) {
            //     res.json({message: 'Your phone number should contain 10 characters!', data: null})
            }  else {

                Booking.findOneAndUpdate({_id: req.params._id},
                    {
                        // contactNum: req.body.contactNum,
                        roomID: req.body.roomID
                    },
                    {new: true},
                    function (err, booking) {
                        if (err)
                            res.json({message: 'Booking Not Edited', data: err});
                        else
                        // console.log(booking)
                            res.json({message: 'Booking Edited successfully', data: booking});
                    });
            }
        };
        router.deleteBooking = (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            Booking.findOneAndRemove({_id: req.params.id}, function (err, booking) {
                if (err) {
                    res.json({message: 'Booking NOT Found!', data: null});
                }
                else
                    res.json({message: 'Booking Successfully Deleted!', data: booking});
            });
        }
router.getByCondition= (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // if (req.params.customer == null) {
    //     res.json({message: 'You can not do this operation!'});
    // } else {
    Booking.find({"roomType": req.params.roomType}, function (err, booking) {
        if (err)
            res.json({message: 'Booking NOT Found!', errmsg: err});
        else
            res.send(JSON.stringify(booking, null, 5));
    });
}
/*
router.getByDate = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var d1 = req.body.checkin_date;
    var d2 = req.body.leave_date;
    var d3 = router.getByCondition.booking.checkin_date;
    var d4 = router.getByCondition.booking.leave_date;

}
*/
module.exports = router;
module.exports.booking = router.addBooking.booking;
