let mongoose = require('mongoose');
let Admin = require('../models/admin');
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
    console.log('Successfully Connected to [ ' + db.name + ' ] ');
});

router.signUp = (req, res)=> {
    res.setHeader('Content-Type', 'application/json');
    let code =Math.floor(Math.random()*1100000-100001);
    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    let email = req.body.email;

    let admin = new Admin();
    // customer.customerID = req.body.customerID;
    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.password = bcrypt.hashSync(req.body.password);
    admin.password2 = bcrypt.hashSync(req.body.password2);
    admin.register_date = Date.now();
    admin.code = code;
    if(admin.name == null || admin.email == null || admin.password == null || admin.password2 == null){
        res.json({message: 'Name,email,password and confirm password are all required',data:null})
    }
    else if (!checkEmail.test(admin.email)){
        res.json({message: 'Wrong email format!'})
    } else if((8 > req.body.password.length) || (8 > req.body.password2)){
        res.json({message: 'Password should be more than 8 characters',data:null})
    } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))){
        res.json({ message: 'Password must has number,special character, lowercase and capital Letters!', data: null});
    } else{
        Admin.findOne({ email: req.body.email }, function (err, user) {
            if(user) {
                res.json({ message : 'Email already exists!', data: null });
            } else {
                Admin.save(function (err) {
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

    Admin.findOne({email: req.body.email}, function (err, admin) {
        if (!admin) {
            res.json({ message: 'verification failed'});
        } else if ((Date.now() - admin.register_date) > (1000*60*10)){
            Admin.deleteOne({email: admin.email});
            res.json({ message: 'Time expired! Please sign up again!'});
        } else if (req.body.code = admin.code) {
            Admin.updateOne({ email: admin.email}, {verification: true}, function(err, newAdmin){
                if (err){
                    res.json({ message: err});
                } else {
                    res.json({ message: 'Verification successful', data: newAdmin});
                }
            });
        }
    });
};
router.login = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Admin.findOne({email: req.body.email}, function (err, admin) {
        if (!admin) {
            res.json({message: 'Customer NOT found!', errmsg: err});
        } else {
            if (bcrypt.compareSync(req.body.password, admin.password)) {
                let token = admin.generateAuthToken();
                res.header('token', token);
                res.json({message: 'Login Successfully!', data: admin});
            }
            else
                res.json({message: 'Incorrect Password!', errmsg: err});
        }
    });
}
router.EditInfo = (req, res) => {

    // Find the relevant booking based on params id passed in

    res.setHeader('Content-Type', 'application/json');
    let admin = new Admin({
        password: bcrypt.hashSync(req.body.password),
        password2: bcrypt.hashSync(req.body.password2),
        DateOfBirth: req.body.DateOfBirth,
        Gender: req.body.Gender
    });
    Admin.update({"email": req.params.email},
        {
            password: req.body.password,
            password2: req.body.password2,
            DateOfBirth: req.body.DateOfBirth,
            Gender: req.body.Gender
        },
        function (err, customer) {
            if (err)
                res.json({message: 'Admin Not Edited', errmsg: err});
            else
                res.json({message: 'Admin Edited successfully', data: admin});
        });
};


module.exports = router;
