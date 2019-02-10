let mongoose = require('mongoose');

let RoomSchema = new mongoose.Schema({
    roomNum:{
        type: String
    },
    roomType:{
            type: String,
            required: true
        },
    ifEmpty: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        required: true
    }

    },
    { collection: 'rooms' });

module.exports = mongoose.model('Room', RoomSchema);
