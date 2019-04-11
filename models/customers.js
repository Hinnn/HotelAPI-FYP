let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
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
        phoneNum: {
            type: String
            // default: "1234567891"
        },
        DateOfBirth: {
            type: Date
            // default : "1997-01-01"
        },
        Gender: {
            type: String
            // default: "Male"
        },

        register_date: Date,
        verification: {
            type: Boolean,
            default: false
        },
        code: {
            type: String,
            // required: true
        }
    },
    { collection: 'customers' });


CustomerSchema.methods.generateAuthToken = function(){
    let token = jwt.sign({email: this.email}, 'customerJwtKey');
    return token;
};

module.exports = mongoose.model('Customer', CustomerSchema);
