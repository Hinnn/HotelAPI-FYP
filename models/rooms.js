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
    people: {
        type: Number,
        default: null
    },
    roomImage: { type: String}


    },
    { collection: 'rooms' });

module.exports = mongoose.model('Room', RoomSchema);
