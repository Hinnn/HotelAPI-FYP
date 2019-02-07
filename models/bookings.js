/*const bookings = [
    {orderID: 1000000, customerID: 100000000, paymenttype: 'PayPal', date : 20081022, amount: 1,roomID: 101,price: 30},
    {orderID: 1000001, customerID: 100000001, paymenttype: 'Direct', date : 20181116, amount: 1,roomID: 102,price: 30},
    {orderID: 1000002, customerID: 100000002, paymenttype: 'Visa', date : 20181116, amount: 1,roomID: 103,price: 40}
];

module.exports = bookings;*/
let mongoose = require('mongoose');

let BookingSchema = new mongoose.Schema({
        customerID:{
            //required: true,
            type: String
        },
        paymenttype: {
           type: String
        },

        date:{
            type: Number,
            required: true
        },
        amount:{
                type: Number,
                required: true
        },
        roomNum : {
                type: String
        },
        price: {
            type: Number
        }
    },
    { collection: 'bookings' });

module.exports = mongoose.model('Booking', BookingSchema);
