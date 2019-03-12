let Room = require('../models/rooms');
let express = require('express');
let router = express.Router();

router.findAll = (req, res) => {
    // Return a JSON representation of room list
    res.setHeader('Content-Type', 'application/json');
    Room.find(function(err, rooms) {
        console.log(rooms);
        if (err)
            res.send(err);

        res.send(JSON.stringify(rooms,null,5));
    });
}

// function getByValue(array, roomNum) {
//     var result  = array.filter(function(obj){return obj.roomNum == roomNum;} );
//     return result ? result[0] : null; // or undefined
// }
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Room.find({ roomNum : req.params.roomNum },function(err, room) {
        if (err)
            res.json({ message: 'Room NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(room,null,5));
    });
}

router.getByType = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Room.find({"roomType": req.params.roomType}, function(err, room) {
        if (err){
            res.json({message: 'Type not found', data: null});
        } else {
            res.json({data: room});
        }
    })
};

router.UpVotes = (req, res) => {

    Room.findOne({"roomNum": req.params.roomNum}, function(err,room) {
        if (err)
            res.json({ message: 'Room NOT Found!', errmsg : err } );
        else {
            room.upvotes += 1;
            room.save(function (err) {
                if (err)
                    res.json({ message: 'Room NOT UpVoted!', errmsg : err } );
                else
                    res.json({ message: 'Room Successfully UpVoted!', data: room });
            });
        }
    });
}
router.addRoom = (req, res) => {
    //Add a new room to our list
    res.setHeader('Content-Type', 'application/json');
    let room = new Room();
    if (req.params.admin == null) {
        res.json({ message: 'You can not do this operation!'});
    } else if (req.body.roomNum == null) {
        res.json({ message: 'room number is required!'});
    } else if (req.body.roomType == null) {
        res.json({ message: 'room type is required!'});
    } else if (req.body.price == null) {
        res.json({ message: 'Price is required'});
    } else{
        room.roomNum = req.body.roomNum;
        room.roomType = req.body.roomType;
        room.price = req.body.price;
        room.isEmpty = true;
        room.save(function(err) {
            if (err)
                res.json({ message: 'Room NOT Added!', errmsg : err } );
            else
                res.json({ message: 'Room Successfully Added!', data: room });
        });
    }
};

router.edit = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.params.admin == null) {
        res.json({ message: 'You can not edit the room!'});
    } else if (req.body.price == null) {
        res.json({ message: 'Price is required'});
    } else if (req.body.roomType== null) {
        res.json({ message: 'Room type is required'});
    }  else{
        Room.updateOne({"roomNum" : req.body.roomNum},
            {admin_id: req.params.admin,
                price: req.body.price,
                roomType: req.body.roomType,
                last_edit: Date.now()}, function (err, room) {
                if (err) {
                    res.json({ message: 'Room edited failed', data: null});
                } else {
                    res.json({ message: 'Romm edited successfully', data: room});
                }
            });
    }
};

router.deleteRoom = (req, res) => {

    if (req.params.admin == null) {
        res.json({ message: 'You can not delete the room!'});
    } else {
        Room.findOneAndRemove({roomNum: req.params.roomNum}, function (err) {
            if (!err) {
                res.json({message: 'Room Successfully Deleted!'});
            }
            else

                res.json({message: 'Room NOT Found!', errmsg: err});
        });
    }
};

module.exports = router;


