let mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
let CustomerSchema = new mongoose.Schema({
        customerID: {
            type: String,
            required: true,
            unique: true
        },
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

    },
    { collection: 'customers' });

CustomerSchema.methods.generateAuthToken = function(){
    let token = jwt.sign({customerID: this.customerID}, 'customerJwtKey');
    return token;
}

module.exports = mongoose.model('Customer', CustomerSchema);