let Customer = require('../models/customers');
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

    let customer = new Customer();
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.password = bcrypt.hashSync(req.body.password);
    customer.password2 = bcrypt.hashSync(req.body.password2);
    customer.phoneNumber = req.body.phoneNumber;
    customer.DateOfBirth = req.body.DateOfBirth;
    customer.Gender = req.body.Gender;
    customer.register_date = Date.now();
    customer.code = code;
         if( customer.name == null || customer.email == null || customer.password == null || customer.password2 == null){
             res.json({message: 'Name, email,password and confirm password are all required!',data:null})
         }
        else if (!checkEmail.test(customer.email)){
            res.json({message: 'Wrong email format!'})
        } else if((8 > req.body.password.length) || (8 > req.body.password2)){
            res.json({message: 'Password should be more than 8 characters!',data:null})
        } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))){
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
                                    mailer.send(email,code);
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
            Customer.findOneAndRemove({email: customer.email});
            res.json({ message: 'Timeout! Please sign up again!'});
        } else {
            Customer.update({ email: customer.email}, {verification: true}, function(err, newCustomer){
                if (err){
                    res.json({ message: err});
                } else {
                    res.json({message: 'Verification successful!', data: newCustomer});
                }
            });
        }
    });
};



loginToken = (customer) => {
    return jwt.sign({
        iss: 'developer',//发行者
        sub: customer.login,//主题
        iat: new Date().getTime()//发行时间
    }, SECRET.JWT_CUSTOMER_SECRET);
};
router.login = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Customer.findOne({email: req.body.email}, function (err, customer) {
        if(!customer) {
            res.json({ message: ' Please sign up first!', data: null });
        } else if(customer.verification === false) {
            res.json({ message: 'You are not verified!', data: null })
        } else{
            if(bcrypt.compareSync(req.body.password, customer.password)){
                let token = loginToken(customer);
                res.header('token',token);
                res.cookie('user', customer.email, {
                });
                res.json({ message: 'Welcome to our website! '+ customer.name, data: customer });
                console.log(req.cookies)
            }
            else
                res.json({ message: 'Wrong password!', data: null });
        }
    });
};

    router.EditInfo = (req, res) => {

        res.setHeader('Content-Type', 'application/json');
        let customer = new Customer;
            customer.DateOfBirth = req.body.DateOfBirth;
            customer.Gender = req.body.Gender;
            customer.phoneNum = req.body.phoneNum

        Customer.update({"email": req.params.email},
            {
                DateOfBirth: req.body.DateOfBirth,
                Gender: req.body.Gender,
                phoneNum: req.body.phoneNum
            },
            function (err, customer) {
                if (err)
                    res.json({message: 'Unable to change', errmsg: err});
                else
                    res.json({message: 'Information changed successfully!', data: customer});
            });
    };
    router.changePassword = (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let customer = new Customer();
        customer.password = bcrypt.hashSync(req.body.password);
        customer.password2 = bcrypt.hashSync(req.body.password2)
        if(customer.password == null || customer.password2 == null){
            res.json({message: 'Password and confirm password are all required!',data:null})
        } else if((8 > req.body.password.length) || (8 > req.body.password2)){
            res.json({message: 'Password should be more than 8 characters!',data:null})
        } else if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W?$]{8,16}/.test(req.body.password))){
            res.json({ message: 'Password must has number,special character, lowercase and capital Letters!', data: null});
        } else if (req.body.password !== req.body.password2) {
            res.json({message: 'Please input the same password!', data: null})
          }
        else{
            Customer.update({"email": req.params.email},
                {
                    password: bcrypt.hashSync(req.body.password),
                    password2: bcrypt.hashSync(req.body.password2)
                },
                function (err, customer) {
                    if (err)
                    res.json({message: 'Unable to change', errmsg: err});
                else
                    res.json({message: 'Password changed successfully!', data: customer});
                });
        };
    };
    /*
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Customer.find({"email": req.params.email}, function (err, customer) {
        if (err)
            res.json({message: 'Customer NOT Found!', errmsg: err});
        else
            res.send(JSON.stringify(customer, null, 5));
    });
}
*/
  router.logout = (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      if (req.headers.cookie != null) {
          res.removeHeader('cookie');
          res.clearCookie('user')
          res.json({ data: req.headers.cookie });
      } else{
          //     console.log(req.headers);
          res.json({ message: 'Please log in first' });
      }
  };

module.exports = router;
module.exports.code = code;
