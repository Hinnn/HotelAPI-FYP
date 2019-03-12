let Admin = require('../models/admin');
let Customer = require('../models/customers');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
let mailer = require('../models/adminmail');
let admin_code = Math.floor(Math.random()*900000 + 100000);
let jwt = require('jsonwebtoken');
let SECRET = require('../models/secretkey');

router.signUp = (req, res)=> {
    res.setHeader('Content-Type', 'application/json');

    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    let checkID = /^\d{8}$/;
    let email = req.body.email;
    let admin = new Admin();
    admin.adminID = req.body.adminID;
    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.password = bcrypt.hashSync(req.body.password);
    admin.password2 = bcrypt.hashSync(req.body.password2);
    admin.register_date = Date.now();
    admin.admin_code = admin_code;
    if( admin.name == null || admin.email == null || admin.password == null || admin.password2 == null){
        res.json({message: 'Name, email,password and confirm password are all required!',data:null})
    }
    else if (!checkEmail.test(admin.email)){
        res.json({message: 'Wrong email format!'})
    } else if((8 > req.body.password.length) || (8 > req.body.password2)){
        res.json({message: 'Password should be more than 8 characters!',data:null})
    } else if((15 < req.body.password.length) || (15 < req.body.password2)){
        res.json({message: 'Password should be less than 15 characters!',data:null})
    } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,15}/.test(req.body.password))){
        res.json({ message: 'Password must have number,special character, lowercase and capital Letters!', data: null});
    } else if (req.body.password !== req.body.password2){
        res.json({message: 'Please input the same password!',data:null})
    } else if (!checkID.test(admin.adminID)){
        res.json({message: 'Please enter an 8-bit valid ID!', data:null})
    }
    else{
        Admin.findOne({ email: req.body.email }, function (err, user) {
            if(user) {
                res.json({ message : 'Account already exists! Please change another email!', data: null });
            } else {
                Customer.findOne({email: req.body.email}, function (err, user) {
                    if(user) {
                        res.json({ message : 'Email has been registered as a customer! Please change another email!', data: null });
                    } else{
                        Admin.findOne({adminID: req.body.adminID}, function(err, user){
                            if(user) {
                                res.json({ message : 'This ID already exists! Please check your ID!', data: null });
                            } else {
                                admin.save(function (err) {
                                    if(err) {
                                        res.json({ message: 'Fail to register!',err : err, data: null});
                                    } else {
                                        //mailer.send(email,code);
                                        mailer.send(email, admin_code);
                                        res.json({message: 'Sign Up Successfully!', data: admin});
                                    }
                                });
                            }
                        })
                    }
                })

            }
        });
    }
};

router.verification = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Admin.findOne({admin_code: req.body.admin_code}, function (err, admin) {
        if (!admin) {
            res.json({  message: 'Fail to confirm email!'});
        } else if ((Date.now() - admin.register_date) > (1000*60*10)){
            Admin.findOneAndRemove({email: req.body.email})
            {
                res.json({message: 'Timeout! Please sign up again!'});

            }
        } else {
            Admin.updateOne({ email: admin.email}, {verification: true}, function(err, newAdmin){
                if (err){
                    res.json({ message: err});
                } else {
                    res.json({message: 'Email confirmed!', data: newAdmin});
                }
            });
        }
    });
};



loginToken = (admin) => {
    return jwt.sign({
        iss: 'developer',//发行者
        sub: admin.login,//主题
        iat: new Date().getTime()//发行时间
    }, SECRET.JWT_ADMIN_SECRET);
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
                res.cookie('user', admin.email, {
                    httpOnly: true,
                    signed: true
                });
                res.json({ message: 'Welcome! '+ admin.name });
                console.log(req.cookies)
            }
            else
                res.json({ message: 'Wrong password!', data: null });
        }
    });
};

router.changePassword = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let admin = new Admin();
    admin.password = bcrypt.hashSync(req.body.password);
    admin.password2 = bcrypt.hashSync(req.body.password2)
    if(admin.password == null || admin.password2 == null){
        res.json({message: 'Password and confirm password are all required!',data:null})
    } else if((8 > req.body.password.length) || (8 > req.body.password2)){
        res.json({message: 'Password should be more than 8 characters!',data:null})
    } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))){
        res.json({ message: 'Password must has number,special character, lowercase and capital Letters!', data: null});
    } else if (req.body.password !== req.body.password2) {
        res.json({message: 'Please input the same password!', data: null})
    }
    else{
        Admin.update({"email": req.params.email},
            {
                password: bcrypt.hashSync(req.body.password),
                password2: bcrypt.hashSync(req.body.password2)
            },
            function (err, admin) {
                if (err)
                    res.json({message: 'Unable to change', errmsg: err});
                else
                    res.json({message: 'Password changed successfully!', data: admin});
            });
    };
};

router.logout = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.headers.cookie != null) {
        res.removeHeader('cookie');
        res.clearCookie('user')
        res.json({ message: 'log out successfully!', data: req.headers.cookie });
    } else{
        //     console.log(req.headers);
        res.json({ message: 'Please log in first' });
    }
};

module.exports = router;
module.exports.admin_code = admin_code;
