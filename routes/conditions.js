// let Room = require('../models/rooms');
let express = require('express');
let router = express.Router();
let Booking = require('../models/bookings');

router.searchByDate = (req, res) => {
    // Return a JSON representation of room list
    res.setHeader('Content-Type', 'application/json');
    var d1 = req.body.checkin_date;
    var d2 = req.body.leave_date;
    var d3 = new Date(d1);
    var d4 = new Date(d2);
    console.log(d3);
    console.log(d4);
    //入住日期大于等于($gte)订单中的离店日期或者离店日期小于等于($lte)订单的入住日期就available
    // gt 大于；lt小于；lte小于等于；gte大于等于； ne不等于
    //available的查询
    // Booking.find({"leave_date": { "$lte":  d1} || {"checkin_date": {"$gte": d2}}}, function (err, bookings) {
    //booking.checkin_date<=body.checkin_date<booking.leave_date
    // Booking.find({"leave_date": { "$gt":  d1}, "checkin_date" : { "$lte": d1}}, function (err, bookings1) {
    //     if (err)
    //         res.json({message: 'Order NOT Found!', data: null});
    //     else
    //         res.send(JSON.stringify(bookings1, null, 5));
    // });
    // booking.checkin_date< body.leave_date<=booking.leave_date
    Booking.find({"leave_date": { "$gte":  d2}, "checkin_date" : { "$lt": d2}}, function (err, bookings2) {
        if (err)
            res.json({message: 'Order NOT Found!', data: null});
        else
            res.send(JSON.stringify(bookings2, null, 5));
    });
}

module.exports = router;


// else if (d3 > d4) {
//     res.json({message: 'Leaving date should be later than check in date!', data: null})
// } else if (d3 < d6) {
//     res.json({message: 'The earliest day is the next day!', data: null})
