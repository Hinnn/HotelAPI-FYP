let mongoose = require('mongoose');
let Customer = require('../models/customers');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
let mailer = require('../models/nodemailer');

let mongodbUri ='mongodb://YueWang:donations999@ds113435.mlab.com:13435/hotelapi-fyp';

mongoose.connect(mongodbUri,{useNewUrlParser:true});

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ] in mLab.com ');
});

router.signUp = (req, res)=> {
    res.setHeader('Content-Type', 'application/json');
    let code =Math.floor(Math.random()*11000-1001);
    let mail = {
        from: '"Yve Hotel"<wy20082242@126.com>',
        to: '1095933649@qq.com',
        subject: 'Email Verification',
        html: '<h3>Thank you for your register!</h3>' +
            '<h3>Your verification code is ${code}, valid time is 5 minutes. </h3>'

    };

    let customer = new Customer();
    customer.customerID = req.body.customerID;
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.password = bcrypt.hashSync(req.body.password);
    customer.password2 = bcrypt.hashSync(req.body.password2);
    customer.phoneNumber = req.body.phoneNumber;
    customer.DateOfBirth = req.body.DateOfBirth;
    customer.Gender = req.body.Gender;
    customer.register_date = Date.now();
    customer.save(function (err) {
        if (err)
            res.json({message: 'Fail to Sign up !', errmsg: err});
        else
            mailer.send(mail, function () {
                //     if(error)
                //         res.json({message: 'Fail to send an email'});
                //         else
                //             res.json({message: 'Email sent successfully'})
                // });
                res.json({message: 'Sign up Successfully!'});
            });
    });
}


router.login = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Customer.findOne({email: req.body.email}, function (err, customer) {
        if (!customer)
            res.json({message: 'Customer NOT found!', errmsg: err});
        else {
            /* if (req.body.password === customer.password) {
                 res.json({message: 'Login Successfully!', data: customer});
             }*/
            if (bcrypt.compareSync(req.body.password, customer.password)) {
                let token = customer.generateAuthToken();
                res.header('token', token);
                res.json({message: 'Login Successfully!', data: customer});
            }
            else
                res.json({message: 'Incorrect email Address or Password!', errmsg: err});
        }
    });
}
    router.EditInfo = (req, res) => {

        // Find the relevant booking based on params id passed in

        res.setHeader('Content-Type', 'application/json');
        let customer = new Customer({
            //customerID: req.body.customerID,
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password),
            password2: bcrypt.hashSync(req.body.password2),
            DateOfBirth: req.body.DateOfBirth,
            Gender: req.body.Gender
        });
        Customer.update({"customerID": req.params.customerID},
            {
                name: req.body.name,
                //email: req.body.email,
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



module.exports = router;
