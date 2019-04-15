let mongoose = require('mongoose');

let TypeSchema = new mongoose.Schema({
        roomType:{
            type: String,
            required: true
        },
        bedType: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        people: {
            type: Number,
            default: null
        },
        Image: { type: String}
    },
    { collection: 'types' });
module.exports = mongoose.model('Type', TypeSchema);
