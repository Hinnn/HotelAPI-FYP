let mongoose = require('mongoose');

let RoomSchema = new mongoose.Schema({
    roomID:{
        type: String,
        required: true
    },
    roomType:{
            type: String,
            required: true
        },
    bedType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'empty'
    },
    price: {
        type: Number,
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    people: {
        type: Number,
        default: null
    },
    order_id: {
        type: String
    },

    roomImage: { type: String}


    },
    { collection: 'rooms' });

module.exports = mongoose.model('Room', RoomSchema);
