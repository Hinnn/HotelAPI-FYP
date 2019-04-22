let mongoose = require('mongoose');

let BookingSchema = new mongoose.Schema({
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        contactNum:{
            type: Number,
            required: true
        },
        roomType:{
            type: String,
            required: true
        },
        roomID:{
            type: String
        },
        checkin_date:{
            type: Date,
            required: true
        },
        leave_date:{
            type: Date,
            required: true
        },
        days:{
            type :Number
        },
        amount:{
            type: Number,
            required: true
        },
        price: {
            type: Number
            // required: true
        },
        payment_status: {
            type: String,
            default: 'not paid'
        },
        paymentId: {
            type: String
        },
    },
    { collection: 'bookings' });

module.exports = mongoose.model('Booking', BookingSchema);
