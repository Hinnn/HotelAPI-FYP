let mongoose = require('mongoose');

let RoomSchema = new mongoose.Schema({
    roomNum:{
        type: String,
        required: true
    },
    roomType:{
            type: String,
            required: true
        },
    isEmpty: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    },

    },
    { collection: 'rooms' });

module.exports = mongoose.model('Room', RoomSchema);
