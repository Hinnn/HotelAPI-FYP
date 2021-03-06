let Customer = require('../models/customers');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
let mailer = require('../models/nodemailer');
let mail = require('../models/pass_mail');
let code = Math.floor(Math.random()*900000 + 100000);
let newPass = randomWord();


router.signUp = (req, res)=> {
    res.setHeader('Content-Type', 'application/json');

    let checkEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    let email = req.body.email;
    let customer = new Customer();
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.password = bcrypt.hashSync(req.body.password);
    customer.password2 = bcrypt.hashSync(req.body.password2);
    // customer.phoneNumber = req.body.phoneNumber;
    // customer.DateOfBirth = req.body.DateOfBirth;
    // customer.Gender = req.body.Gender;
    customer.register_date = Date.now();
    customer.code = code;
    if( customer.name == null || customer.email == null || customer.password == null || customer.password2 == null){
        res.json({message: 'Name, email,password and confirm password are all required!',data:null})
    }
    else if (!checkEmail.test(customer.email)){
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
        Customer.findOne({ email: req.body.email }, function (err, user) {
            if(user) {
                res.json({ message : 'Account already exists! Please change another email!', data: null });
            } else {
                customer.save(function (err) {
                    if(err) {
                        res.json({ message: 'Fail to register!',err : err, data: null});
                    } else {
                        //mailer.send(email,code);
                        mailer.send(email, code);
                        res.json({message: 'Sign Up Successfully!', data: customer});
                    }
                });
            }
        });
    }
};

router.verification = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Customer.findOne({code: req.body.code}, function (err, customer) {
        if (!customer) {
            res.json({  message: 'Wrong code!'});
        } else if ((Date.now() - customer.register_date) > (1000*60*10)){
            Customer.findOneAndRemove({email: req.body.email})
            {
                //if (!err) {
                res.json({message: 'Timeout! Please sign up again!'});
                // } else
                //  res.json({message: 'Customer NOT Found!', errmsg: err});
            }
            //res.json({ message: 'Timeout! Please sign up again!'});
        } else {
            Customer.findOneAndUpdate({ email: customer.email}, {verification: true}, function(err, newCustomer){
                if (err){
                    res.json({ message: err});
                } else {
                    res.json({message: 'Email confirmed!', data: newCustomer});
                }
            });
        }
    });
};

router.login = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Customer.findOne({email: req.body.email}, function (err, customer) {
        if(!customer) {
            res.json({ message: 'Please sign up first!', data: null });
        } else if(customer.verification === false) {
            res.json({ message: 'You are not verified!', data: null })
        } else{
            if(bcrypt.compareSync(req.body.password, customer.password)){
                // res.cookie('user', customer.email, {
                //     httpOnly: true,//避免被 xss 攻击拿到 cookie。
                //     signed: true
                // });
                let token = customer.generateAuthToken();
                res.header('token',token);
                res.json({ message: 'Welcome to our website! '+ customer.name, data: customer });
                console.log(token)
            }
            else
                res.json({ message: 'Wrong password!', data: null });
        }
    });
};
router.EditInfo = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let customer = new Customer();
        customer.DateOfBirth = req.body.DateOfBirth;
        customer.Gender = req.body.Gender;
        customer.phoneNum = req.body.phoneNum;
    if(customer.DateOfBirth == null || customer.Gender == null || customer.phoneNum == null) {
        res.json({ message : 'Please input all the information!', data: null });
    }  else if(customer.phoneNum.length !== 10) {
        res.json({message: 'Please input 10 digital phone numbers!', data: null})
    } else {
        Customer.findOneAndUpdate({
                email: req.params.customer
            }, {

                DateOfBirth: req.body.DateOfBirth,
                Gender: req.body.Gender,
                phoneNum: req.body.phoneNum
            },
            {new: true},
            // console.log(customer),
            function (err, customer) {
                if (err) {
                    res.json({message: 'Unable to edit.', data: err})
                } else {
                    console.log(customer);
                    // res.send(JSON.stringify(result, null, 5));
                    res.json({message: 'Information Successfully edited', data: customer})
                }
            });
    }
};

    router.changePassword = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
        if (req.params.customer == null) {
            res.json({ message: 'You can not change password!'});
        } else {
            let customer = new Customer();
            customer.password = bcrypt.hashSync(req.body.password);
            customer.password2 = bcrypt.hashSync(req.body.password2)
            if (customer.password == null || customer.password2 == null) {
                res.json({message: 'Password and confirm password are all required!', data: null})
            } else if ((8 > req.body.password.length) || (8 > req.body.password2)) {
                res.json({message: 'Password should be more than 8 characters!', data: null})
            } else if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))) {
                res.json({
                    message: 'Password must has number,special character, lowercase and capital Letters!',
                    data: null
                });
            } else if (req.body.password !== req.body.password2) {
                res.json({message: 'Please input the same password!', data: null})
            }
            else {
                Customer.findOneAndUpdate({"email": req.params.customer},
                    {
                        password: bcrypt.hashSync(req.body.password),
                        password2: bcrypt.hashSync(req.body.password2)
                    },
                    {new: true},
                    function (err, customer) {
                        if (err)
                            res.json({message: 'Unable to change', errmsg: err});
                        else
                            res.json({message: 'Password changed successfully!', data: customer});
                    });
            }
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

    Customer.findOne({ email: req.body.email }, function (err, user) {
        if(!user) {
            res.json({ message : 'Account does not exist! Please check your email!', data: null });
        } else {
            mail.send(email, newPass);
            res.json({message : 'Email sent successfully!'})
        }
    });
    Customer.findOneAndUpdate({"email": req.body.email},
        {password :bcrypt.hashSync(newPass),
            password2 : bcrypt.hashSync(newPass)
        },
        {new: true},
        function (err){
            if (err) {
                console.log( 'Password failed to change!');
            } else {
                console.log( 'Password has been changed. Please do remember to change your password! ');
            }
        })
    //password: bcrypt.hashSync(newPass),
    //password2: bcrypt.hashSync(newPass)

}

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Customer.find({"email": req.params.email}, function (err, customer) {
        if (err)
            res.json({message: 'Customer NOT Found!', errmsg: err});
        else
            res.send(JSON.stringify(customer, null, 5));
    });
}

router.logout = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.token != null) {
        res.removeHeader('token');
        // res.clearCookie('user')
        // console.log(req.headers.cookie);
        res.json({ message: 'Logout Successfully!' });
    } else {
        res.json({ message: 'Please log in first', data: req.token });
    }
};
router.deleteCustomer = (req, res) => {
    res.setHeader('Content-Type','application/json');
    if (req.params.admin == null) {
        res.json({ message: 'You can not delete the customer!'});
    } else{
        Customer.findOneAndRemove({"email" : req.params.email},function (err, customer) {
            if (err) {
                res.json({ message: 'Failed to delete!', data: null});
            } else {
                res.json({ message: 'Customer deleted successfully', data: customer});
            }
        });
    }
};
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    if (req.params.admin == null) {
        res.json({message: 'You can not do this operation!'});
    } else {
        Customer.find(function (err, customers) {
            if (err)
                res.send(err);
            else
                res.send(JSON.stringify(customers, null, 5));
        });
    }
};

module.exports = router;
module.exports.code = code;
module.exports.newPass = newPass;
