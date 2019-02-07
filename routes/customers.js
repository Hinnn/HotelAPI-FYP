let mongoose = require('mongoose');
let Customer = require('../models/customers');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
let mailer = require('../models/nodemailer');

// encryptCode = (email) => {
//     let hmac = crypto.createHash('sha256', SECRET.CODE);
//     hmac.update(email);
//     let code = hmac.digest('hex');
//     return code;
// };

let mongodbUri ='mongodb://YueWang:donations999@ds113435.mlab.com:13435/hotelapi-fyp';

mongoose.connect(mongodbUri,{useNewUrlParser:true});

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ] ');
});

router.signUp = (req, res)=> {
    res.setHeader('Content-Type', 'application/json');
    let code =Math.floor(Math.random()*1100000-100001);
    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    let email = req.body.email;

    let customer = new Customer();
    // customer.customerID = req.body.customerID;
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.password = bcrypt.hashSync(req.body.password);
    customer.password2 = bcrypt.hashSync(req.body.password2);
    customer.phoneNumber = req.body.phoneNumber;
    customer.DateOfBirth = req.body.DateOfBirth;
    customer.Gender = req.body.Gender;
    customer.register_date = Date.now();
    customer.code = code;
        if(customer.name == null || customer.email == null || customer.password == null || customer.password2 == null){
            res.json({message: 'Name,email,password and confirm password are all required',data:null})
        }
        else if (!checkEmail.test(customer.email)){
            res.json({message: 'Wrong email format!'})
        } else if((8 > req.body.password.length) || (8 > req.body.password2)){
            res.json({message: 'Password should be more than 8 characters',data:null})
        } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))){
            res.json({ message: 'Password must has number,special character, lowercase and capital Letters!', data: null});
        } else{
            Customer.findOne({ email: req.body.email }, function (err, user) {
                if(user) {
                    res.json({ message : 'Email already exists!', data: null });
                } else {
                            customer.save(function (err) {
                                if(err) {
                                    res.json({ message: 'Fail to register!',err : err, data: null});
                                    return res.status(500).send();
                                } else {
                                    mailer.send(email);
                                    res.json({message: 'Sign Up Successfully!', data: customer});
                                    return res.status(200).send();
                                }
                            });
                        }
                    });
                }
};

router.verification = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Customer.findOne({email: req.body.email}, function (err, customer) {
        if (!customer) {
            res.json({ message: 'verification failed'});
        } else if ((Date.now() - customer.register_date) > (1000*60*10)){
            Customer.deleteOne({email: customer.email});
            res.json({ message: 'Time expired! Please sign up again!'});
        } else if (req.body.code = customer.code) {
            Customer.updateOne({ email: customer.email}, {verification: true}, function(err, newCustomer){
                if (err){
                    res.json({ message: err});
                } else {
                    res.json({ message: 'Verification successful', data: newCustomer});
                }
            });
        }
    });
};
router.login = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Customer.findOne({email: req.body.email}, function (err, customer) {
        if (!customer) {
            res.json({message: 'Customer NOT found!', errmsg: err});
        } else {
            if (bcrypt.compareSync(req.body.password, customer.password)) {
                let token = customer.generateAuthToken();
                res.header('token', token);
                res.json({message: 'Login Successfully!', data: customer});
            }
            else
                res.json({message: 'Incorrect Password!', errmsg: err});
        }
    });
}
    router.EditInfo = (req, res) => {

        // Find the relevant booking based on params id passed in

        res.setHeader('Content-Type', 'application/json');
        let customer = new Customer({
            password: bcrypt.hashSync(req.body.password),
            password2: bcrypt.hashSync(req.body.password2),
            DateOfBirth: req.body.DateOfBirth,
            Gender: req.body.Gender
        });
        Customer.update({"email": req.params.email},
            {
                password: req.body.password,
                password2: req.body.password2,
                DateOfBirth: req.body.DateOfBirth,
                Gender: req.body.Gender
            },
            function (err, customer) {
                if (err)
                    res.json({message: 'Customer Not Edited', errmsg: err});
                else
                    res.json({message: 'Customer Edited successfully', data: customer});
            });
    };
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Customer.find({"email": req.params.email}, function (err, customer) {
        if (err)
            res.json({message: 'Customer NOT Found!', errmsg: err});
        else
            res.send(JSON.stringify(customer, null, 5));
    });
}


module.exports = router;
