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

// function getByValue(array, roomID) {
//     var result  = array.filter(function(obj){return obj.roomID == roomID;} );
//     return result ? result[0] : null; // or undefined
// }
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Room.find({ roomID : req.params.roomID },function(err, room) {
        if (err)
            res.json({ message: 'Room NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(room,null,5));
    });
}

router.getByType = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // if (req.params.customer == null) {
    //     res.json({message: 'You can not do this operation!'});
    // } else {
    Room.find({"roomType": req.params.roomType}, function (err, room) {
        if (err)
            res.json({message: 'Room NOT Found!', data: null});
        else
            res.send(JSON.stringify(room, null, 5));
    });
}

router.UpVotes = (req, res) => {

    Room.findOne({"roomID": req.params.roomID}, function(err,room) {
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
    res.setHeader('Content-Type', 'application/json')
    // let room = new Room();
    // room.roomID = req.body.roomID;
    // room.roomType = req.body.roomType;
    // room.price = req.body.price;
    // // room.isEmpty = true;
    // room.people = req.body.people;
   // let email = req.admin.email;
    if (req.params.admin == null) {
        res.json({ message: 'You can not do this operation!'});
    } else if (req.body.roomID == null) {
        res.json({ message: 'Room number is required!'});
    } else if (req.body.roomType == null) {
        res.json({ message: 'Room type is required!'});
    } else if (req.body.price == null) {
        res.json({ message: 'Price is required'});
    } else if (req.body.people == null) {
        res.json({ message: 'People amount is required'});
    }else{
        // console.log(token);
        Room.findOne({ roomID: req.body.roomID }, function (err, room) {
            if(room) {
                res.json({ message : 'Room already exists! Please change another room!', data: null });
            } else{
                let room = new Room();
            room.roomID = req.body.roomID;
        room.roomType = req.body.roomType;
        room.price = req.body.price;
        room.isEmpty = true;
        room.people = req.body.people;
        room.save(function(err) {
            if (err)
                res.json({ message: 'Room NOT Added!', errmsg : err } );
            else
                res.json({ message: 'Room Successfully Added!', data: room });
        });
    }
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
        Room.updateOne({"roomID" : req.body.roomID},
            {admin_id: req.params.admin,
                price: req.body.price,
                roomType: req.body.roomType,
                last_edit: Date.now()}, function (err, room) {
                if (err) {
                    res.json({ message: 'Room edited failed', data: null});
                } else {
                    res.json({ message: 'Room edited successfully', data: room});
                }
            });
    }
};
router.addDiscount = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.params.admin == null) {
        res.json({ message: 'You can not edit the room!'});
    } else if (req.body.price == null) {
        res.json({ message: 'Price is required'});
    }  else{
        Room.updateOne({"roomID" : req.body.roomID},
            {admin_id: req.params.admin,
                price: req.body.price,
                last_edit: Date.now()}, function (err, room) {
                if (err) {
                    res.json({ message: 'Room edited failed', data: null});
                } else {
                    res.json({ message: 'Room edited successfully', data: room});
                }
            });
    }
};
router.deleteDiscount = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.params.admin == null) {
        res.json({ message: 'You can not edit the room!'});
    } else if (req.body.price == null) {
        res.json({ message: 'Price is required'});
    }  else{
        Room.findOneAndUpdate({"roomID" : req.body.roomID},
            {admin_id: req.params.admin,
                price: req.body.price,
                last_edit: Date.now()}, function (err, room) {
                if (err) {
                    res.json({ message: 'Fail to delete the discount', data: null});
                } else {
                    res.json({ message: 'Discount deleted successfully！', data: room});
                }
            });
    }
};
router.deleteRoom = (req, res) => {
    res.setHeader('Content-Type','application/json');
    if (req.params.admin == null) {
        res.json({ message: 'You can not delete the room!'});
    } else {
        Room.findOneAndRemove({"roomID": req.params.roomID}, function (err, room) {
            if (err) {
                res.json({message: 'Room NOT Found!', errmsg: err});
            } else {
                res.json({message: 'Room Successfully Deleted!', data: room});
            }

        });
    }
};

module.exports = router;
