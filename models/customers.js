let mongoose = require('mongoose');

let CustomerSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            match:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        password2: {
            type: String,
            required: true
        },
        phoneNum:String,
        DateOfBirth: Number,
        Gender: String,
        register_date: Date,
        verification: {
            type: Boolean,
            default: false
        },
        code: String

    },
    { collection: 'customers' });




module.exports = mongoose.model('Customer', CustomerSchema);
