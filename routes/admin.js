let Admin = require('../models/admin');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
let mailer = require('../models/nodemailer');
let code =Math.floor(Math.random()*1100000-100001);
let jwt = require('jsonwebtoken');
let SECRET = require('../models/secretkey');

router.signUp = (req, res)=> {
    res.setHeader('Content-Type', 'application/json');

    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    let email = req.body.email;

    let admin = new Customer();
    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.password = bcrypt.hashSync(req.body.password);
    admin.password2 = bcrypt.hashSync(req.body.password2);
    admin.phoneNumber = req.body.phoneNumber;
    admin.register_date = Date.now();
    admin.code = code;
    if( admin.name == null || admin.email == null || admin.password == null || admin.password2 == null){
        res.json({message: 'Name, email,password and confirm password are all required!',data:null})
    }
    else if (!checkEmail.test(admin.email)){
        res.json({message: 'Wrong email format!'})
    } else if((8 > req.body.password.length) || (8 > req.body.password2)){
        res.json({message: 'Password should be more than 8 characters!',data:null})
    } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))){
        res.json({ message: 'Password must has number,special character, lowercase and capital Letters!', data: null});
    } else if (req.body.password !== req.body.password2){
        res.json({message: 'Please input the same password!',data:null})
    }
    else{
        Admin.findOne({ email: req.body.email }, function (err, user) {
            if(user) {
                res.json({ message : 'Account already exists! Please change another email!', data: null });
            } else {
                admin.save(function (err) {
                    if(err) {
                        res.json({ message: 'Fail to register!',err : err, data: null});
                    } else {
                        mailer.send(email,code);
                        res.json({message: 'Sign Up Successfully!', data: admin});
                    }
                });
            }
        });
    }
};

router.verification = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Admin.findOne({code: req.body.code}, function (err, admin) {
        if (!admin) {
            res.json({  message: 'Wrong code!'});
        } else if ((Date.now() - admin.register_date) > (1000*60*10)){
            Admin.findOneAndRemove({email: admin.email});
            res.json({ message: 'Timeout! Please try again!'});
        } else {
            Admin.update({ email: admin.email}, {verification: true}, function(err, newAdmin){
                if (err){
                    res.json({ message: err});
                } else {
                    res.json({message: 'Verification successful!', data: newAdmin});
                }
            });
        }
    });
};



loginToken = (admin) => {
    return jwt.sign({
        iss: 'developer',
        sub: admin.email,
        iat: new Date().getTime()
    }, SECRET.JWT_CUSTOMER_SECRET);
};
router.login = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Admin.findOne({email: req.body.email}, function (err, admin) {
        if(!admin) {
            res.json({ message: ' Please sign up first!', data: null });
        } else if(admin.verification === false) {
            res.json({ message: 'You are not verified!', data: null })
        } else{
            if(bcrypt.compareSync(req.body.password, admin.password)){
                let token = loginToken(admin);
                res.header('token',token);
                res.cookie('admin', admin.email, {
                });
                res.json({ message: 'Welcome to our website! '+ admin.name, data: admin });
                console.log(req.cookies)
            }
            else
                res.json({ message: 'Wrong password!', data: null });
        }
    });
};
/*
router.EditInfo = (req, res) => {

    // Find the relevant booking based on params id passed in

    res.setHeader('Content-Type', 'application/json');
    let admin = new Admin({
        password: bcrypt.hashSync(req.body.password),
        password2: bcrypt.hashSync(req.body.password2),
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
*/

module.exports = router;
