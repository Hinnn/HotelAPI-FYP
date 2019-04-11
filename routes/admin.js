let Admin = require('../models/admin');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
let mailer = require('../models/adminmail');
let mail = require('../models/pass_mail');
let admin_code = Math.floor(Math.random()*900000 + 100000);
let jwt = require('jsonwebtoken');
// let SECRET = require('../models/secretkey');
let newPass = randomWord();



router.signUp = (req, res)=> {
    res.setHeader('Content-Type', 'application/json');

    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    // let checkID = /^\d{8}$/;
    let email = req.body.email;
    let admin = new Admin();
    // admin.adminID = req.body.adminID;
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
    }
    else{
        Admin.findOne({ email: req.body.email }, function (err, user) {
            if(user) {
                res.json({ message : 'Account already exists! Please change another email!', data: null });
            } else {
                // Admin.findOne({email: req.body.email}, function (err, user) {
                    // if(user) {
                    //     res.json({ message : 'Email has been registered as a customer! Please change another email!', data: null });
                    // } else{
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
            Admin.findOneAndUpdate({ email: admin.email}, {verification: true}, function(err, newAdmin){
                if (err){
                    res.json({ message: err});
                } else {
                    res.json({message: 'Email confirmed!', data: newAdmin});
                }
            });
        }
    });
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
                // res.cookie('user', customer.email, {
                //     httpOnly: true,//避免被 xss 攻击拿到 cookie。
                //     signed: true
                // });
                let token = admin.generateAuthToken();
                res.header('token',token);
                res.json({ message: 'Welcome to our website! '+ admin.name, data: admin, token: token });
                console.log(token)
            }
            else
                res.json({ message: 'Wrong password!', data: null });
        }
    });
};
// router.login = (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//
//     Admin.findOne({email: req.body.email}, function (err, admin) {
//         if (!admin) {
//             res.json({message: ' Please sign up first!', data: null});
//         } else if (admin.verification === false) {
//             res.json({message: 'You are not verified!', data: null})
//         } else {
//             if(bcrypt.compareSync(req.body.password, admin.password)){
//                 let token = admin.generateAuthToken();
//                 // let token = jwt.sign({ email: admin.email}, 'AdminJwtKey', {expiresIn: "1h"});
//                 // admin.token = token;
//                 res.header('x-auth-token',token);
//                 res.json({ message: 'Welcome! ' + admin.name, token: token, success: true});
//                 console.log(token)
//             }
//             else
//                 res.json({ message: 'Wrong password!', data: null });
//         }
//     });
// };
//
// router.logout = (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//
//     if (req.headers.cookie != null) {
//         res.removeHeader('cookie');
//         res.clearCookie('user')
//         res.json({ message: 'log out successfully!', data: req.headers.cookie });
//         console.log(req.cookies);
//         console.log(req.headers);
//     } else{
//             console.log(req.headers);
//         res.json({ message: 'Please log in first' });
//     }
// };
router.logout = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.token == null) {
        res.json({ message: 'Please log in first' , data:req.token});
    } else {
        res.removeHeader('token');
        res.clearCookie('user')
        console.log(req.headers);
        res.json({ message: 'Logout Successfully!',data: req.token});
    }
};
function randomWord(randomFlag,str){
    var str = "",
        range = 8,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
            'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
            'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
            'T', 'U', 'V', 'W', 'X', 'Y', 'Z','?','.','!','_','+'];

    // random password
    if(randomFlag){
        range = Math.round(Math.random() * 8) + 8;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
        console.log(str);
    }
    return str;

}
// let newPass = str;
router.forgetPassword = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let email = req.body.email;
    Admin.findOne({ email: req.body.email }, function (err, user) {
        if(!user) {
            res.json({ message : 'Account does not exist! Please check your email!', data: null });
        } else {
            mail.send(email, newPass);
            // res.json({message : 'Email sent successfully!'})
        }
    });
    Admin.updateOne({"email": req.body.email},
        {password :bcrypt.hashSync(newPass),
            password2 : bcrypt.hashSync(newPass)
        }, function (err){

            if (err) {
                console.log( 'Password failed to change!');
            } else {
                console.log( 'Password has been changed. Please do remember to change your password! ');
            }
        })

}
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Admin.find({"email": req.params.email}, function (err, admin) {
        if (err)
            res.json({message: 'Admin NOT Found!', errmsg: err});
        else
            res.send(JSON.stringify(admin, null, 5));
    });
}
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
        Admin.findOneAndUpdate({"email": req.params.email},
            {
                password: bcrypt.hashSync(req.body.password),
                password2: bcrypt.hashSync(req.body.password2)
            },
            {new:true},
            function (err, admin) {
                if (err)
                    res.json({message: 'Unable to change', errmsg: err});
                else
                    res.json({message: 'Password changed successfully!', data: admin});
            });
    };
};
module.exports = router;
module.exports.admin_code = admin_code;
module.exports.newPass = newPass;

