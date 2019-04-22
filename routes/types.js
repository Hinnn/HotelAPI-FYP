let Type = require('../models/types');
let express = require('express');
let router = express.Router();
router.findByRoomType = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Type.find({"roomType": req.params.roomType}, function (err, roomType) {
        if (err)
            res.json({message: 'Room NOT Found!', data: null});
        else
            res.send(JSON.stringify(roomType, null, 5));
    });
}
// router.findPrice = (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     Type.find({"roomType": req.body.roomType}).select('price').exec().then(type => {
//         if (type) {
//             console.log(type)
//         }
//     })
// }

router.addType = (req, res) => {
    //Add a new room to our list
    res.setHeader('Content-Type', 'application/json')
    if (req.params.admin == null) {
        res.json({ message: 'You can not do this operation!'});
    } else if (req.body.roomType == null) {
        res.json({ message: 'Room type is required!'});
    } else if (req.body.price == null) {
        res.json({ message: 'Price is required'});
    } else if (req.body.people == null) {
        res.json({ message: 'People amount is required'});
    } else if (req.body.bedType == null) {
        res.json({ message: 'Bed type is required'});
    } else if (req.body.quantity == null) {
        res.json({message: 'Room amount is required'});
    } else {
            // console.log(token);
            Type.findOne({ roomType: req.body.roomType }, function (err, type) {
                if(type) {
                    res.json({ message : 'Room type already exists! Please change another room!', data: null });
                } else{
                    let type = new Type();
                    type.roomType = req.body.roomType;
                    type.price = req.body.price;
                    type.people = req.body.people;
                    type.bedType = req.body.bedType;
                    type.quantity = req.body.quantity;
                    type.typeImage = req.file.path;
                    type.save(function(err) {
                        if (err)
                            res.json({ message: 'Type NOT Added!', errmsg : err } );
                        else
                            res.json({ message: 'Type Successfully Added!', data: type });
                    });
                }
            });
        }
    }
module.exports = router;

