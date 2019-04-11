let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let AdminSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            match:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
            required: true
            // unique: true
        },
        password: {
            type: String,
            required: true
        },
        password2: {
            type: String,
            required: true
        },

        register_date: Date,
        verification: {
            type: Boolean,
            default: false
        },
        admin_code: String

    },
    { collection: '  admin' });
AdminSchema.methods.generateAuthToken = function(){
    let token = jwt.sign({email: this.email}, 'AdminJwtKey');
    return token;
};


module.exports = mongoose.model('Admin', AdminSchema);
