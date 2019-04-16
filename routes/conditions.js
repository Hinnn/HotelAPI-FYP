let Room = require('../models/rooms');
let express = require('express');
let router = express.Router();
let Booking = require('../models/bookings');
/*
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
    //booking.checkin_date<=body.checkin_date<booking.leave_date
    // Booking.find(({"leave_date": { "$gt":  d1}, "checkin_date" : { "$lte": d1}}) || ({"leave_date": { "$gte":  d2}, "checkin_date" : { "$lt": d2}}), function (err, bookings1) {
    //     if (err)
    //         res.json({message: 'Order NOT Found!', data: null});
    //     else
    //         res.send(JSON.stringify(bookings1, null, 5));
    // });
    Booking.find({"leave_date": { "$gt":  d1}, "checkin_date" : { "$lte": d1}}, function (err, bookings1) {
        if (err)
            res.json({message: 'Order NOT Found!', data: null});
        else
        Booking.find({"leave_date": { "$gte":  d2}, "checkin_date" : { "$lt": d2}}, function (err, bookings2) {
            if (err)
                res.json({message: 'Order not found!', data: null});
            else
                res.json({ $setUnion:[bookings2+bookings1]});
        });
    });
// booking.checkin_date< body.leave_date<=booking.leave_date
//     Booking.find({"leave_date": { "$gte":  d2}, "checkin_date" : { "$lt": d2}}, function (err, bookings) {
//         if (err)
//             res.json({message: 'Order NOT Found!', data: null});
//         else
//             res.send(JSON.stringify(bookings, null, 5));
//     });
}
*/
router.getAmountByType = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let roomArray = null;
    Room.find({"roomType": req.params.roomType}, function (err, room) {
        if (err)
            res.json({message: 'Room NOT Found!', data: null});
        else
            roomArray = room;
            let totalAmount = 0;
            roomArray.forEach(function() { totalAmount +=1;});
            console.log(totalAmount);
            res.send(JSON.stringify(totalAmount, null, 5));
    })
}
router.getReserveAmount = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var d1 = req.params.checkin_date;
    var d2 = req.params.leave_date;
    // var d3 = new Date(d1);
    // var d4 = new Date(d2);
    // console.log(d3);
    // console.log(d4);
    Booking.find({"$or": [{"leave_date": { "$gt":  d1}, "checkin_date" : { "$lte": d1}},{"leave_date": { "$gte":  d2}, "checkin_date" : { "$lt": d2}}]})
    .select('amount')
        .exec()
        .then(doc => {
            console.log(d1);
            console.log("From database", doc);
            if (doc) {
                // res.json({doc});
                let totalAmount = 0;
                doc.forEach(function(obj) { totalAmount += obj.amount;});
                console.log(totalAmount);
                res.send(JSON.stringify(totalAmount, null, 5));
            } else {
                res.json({message: 'NOT Found!', data: null});
            }
        })
}

router.multipleSelect = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var d1 = req.body.checkin_date;
    var d2 = req.body.leave_date;
    var d3 = new Date(d1);
    var d4 = new Date(d2);
    console.log(d3);
    console.log(d4);
    Booking.find({"$or": [{"leave_date": { "$gt":  d1}, "checkin_date" : { "$lte": d1}},{"leave_date": { "$gte":  d2}, "checkin_date" : { "$lt": d2}}]})
        // .select('roomID', 'checkin_date','leave_date', 'roomType')
        .exec()
        .then(doc => {
        console.log("From database", doc);
        if (doc) {
                    res.json({doc});

        } else {
            res.json({message: 'Room NOT Found!', data: null});
        }
    })
}
/*
  //available的查询
  Booking.find({"leave_date": {"$lte": d1} || {"checkin_date": {"$gte": d2}}}, function (err, bookings) {
      if (err)
          res.json({message: 'Order NOT Found!', data: null});
      else
          res.send(JSON.stringify(bookings, null, 5));
  });
}*/

module.exports = router;
