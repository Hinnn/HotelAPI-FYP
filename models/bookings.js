let mongoose = require('mongoose');

let BookingSchema = new mongoose.Schema({
    // orderID:{
    //     type: String
    // },
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        roomType:{
            type: String,
            required: true
        },
        checkin_Date:{
            type: Number,
            required: true
        },
        leave_Date:{
            type: Number,
            required: true
        },
        amount:{
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        payment_status: {
            type: Boolean,
            default: false
        },
    },
    { collection: 'bookings' });

module.exports = mongoose.model('Booking', BookingSchema);
