let Room = require('../models/rooms');
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
    let condition1 = [];
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
            // condition1 = JSON.stringify(bookings1, null, 5);
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
router.getAmountByType = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let roomArray = null;
    Room.find({"roomType": req.body.roomType}, function (err, room) {
        if (err)
            res.json({message: 'Room NOT Found!', data: null});
        else
            roomArray = room;
            let totalAmount = 0;
            roomArray.forEach(function() { totalAmount +=1;});
            console.log(roomArray.length);
            console.log(roomArray);
            res.send(JSON.stringify(room, null, 5));
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
    Booking.find({"leave_date": { "$gt":  d1}, "checkin_date" : { "$lte": d1}}).select('roomID').exec().then(doc1 => {
        console.log("From database", doc1);
        if (doc1) {
            Booking.find({"leave_date": { "$gte":  d2}, "checkin_date" : { "$lt": d2}}).select('roomID').exec().then(doc2 => {
                console.log("From database", doc2);
                if (doc2)

                // res.json({ $mergeObjects:doc1,doc2});
                res.json({ $setUnion:[doc1 + doc2]});
                else
                    console.log('Room NOT Found!');
            });
        } else {
            res.json({message: 'Room NOT Found!', data: null});
        }
    })
}

// var concat = (function(){
//     // concat doc1 and doc2 without duplication.
//     var concat_ = function(doc1, doc2) {
//         for (var i=doc2.length-1;i>=0;i--) {
//             doc1.indexOf(doc2[i]) === -1 ? doc1.push(doc2[i]) : 0;
//         }
//     };
//     // concat arbitrary arrays.
//     // Instead of alter supplied arrays, return a new one.
//     return function(arr) {
//         var result = arr.slice();
//         for (var i=arguments.length-1;i>=1;i--) {
//             concat_(result, arguments[i]);
//         }
//         return result;
//     };
// });
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
