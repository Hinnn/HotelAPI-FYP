let Booking = require('../models/bookings');
let Type = require('../models/types');
let express = require('express');
let mail = require('../models/order_mail');
let paypal = require('paypal-rest-sdk');
let router = express.Router();
let config = require('../middleware/config');

// let order = router.addBooking.booking;
paypal.configure({
    mode: "sandbox",
    client_id: config.PAYPAL_CLIENT_ID,
    client_secret: config.PAYPAL_CLIENT_SECRET
});
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
    // booking.price = price
    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    let email = req.body.email;
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
router.pay = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // var create_payment_json = {
    //     "intent": "sale",
    //     "payer": {
    //         "payment_method": "paypal"
    //     },
    //     "redirect_urls": {
    //         "return_url": "http://localhost:8080",
    //         "cancel_url": "http://localhost:8080/customerSearch"
    //     },
    //     "transactions": [{
    //         "item_list": {
    //             "items": [{
    //                 "name": "booking",
    //                 "sku": "101",
    //                 "price": "20.00",
    //                 "currency": "EUR",
    //                 "quantity": 1
    //             }]
    //         },
    //         "amount": {
    //             "currency": "EUR",
    //             "total": "20.00"
    //         },
    //         "description": "This is the payment description."
    //     }]
    // };


    // paypal.payment.create(create_payment_json, function (error, payment) {
    //     if (error) {
    //         throw error;
    //     } else {
    //         for (let i = 0; i < payment.links.length; i++) {
    //             if (payment.links[i].rel === 'approval_url') {
    //                 res.redirect(payment.links[i].href);
    //             }
    //         }
    //         console.log("Create Payment Response");
    //         console.log(payment);
    //         // res.send('test');
    //     }
    // });

    const payment ={};
    payment.amount = req.body.data.amount;
    const payerId = req.body.data.payerID;
    const paymentId = req.body.data.paymentId;
    var execute_payment_json = {
        "payer_id": payerId
        // "transactions": [{
        //     "amount": {
        //         "currency": "EUR",
        //         "total": "25.00"
        //     }
        // }]
    };

    // var paymentId = req.query.paymentId;

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment,null,5));
                Booking.findOneAndUpdate({_id: req.params._id},
                    {
                        payment_status: 'paid'
                    },
                    {new: true},
                    function (err, booking) {
                        if (err)
                            res.json({message: 'Unpaid', data: err});
                        else
                        // console.log(booking)
                            res.json({message: 'Booking paid successfully', data: booking});
                    });
            // console.log("Get Payment Response");
            // res.send('Success')
        }
    });
    }

module.exports = router;
module.exports.booking = router.addBooking.booking;
