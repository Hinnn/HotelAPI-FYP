let nodemailer = require('nodemailer');
let customer = require('../models/customers');
function send (email, code) {
//new smtp server
    // let code =Math.floor(Math.random()*1100000-100001);
    // let code = customer.code;
    const config = {
        host: 'smtp.126.com',
        port: 465,
        secure: true,
        auth: {
            user: 'wy20082242@126.com', //account to send email
            pass: 'wy20082242' //email authentication
        }
    };
    let mail = {
        from: '"Yve Hotel"<wy20082242@126.com>',
        to: email,
        subject: 'Email Verification',
        text: 'Your verification code is ' + code + ' The valid time is 10 minutes'
    };

// add a new SMTP server object
    let transporter = nodemailer.createTransport(config);
//send email

    transporter.sendMail(mail, code, function (error) {
        //callback(error);
        if (error) {
            // return console.log('error');
            console.log('Error occurred');
            console.log(error.message);
            // return process.exit(1);
        }
        console.log('Email sent successfully! Your code is '+ code);
        transporter.close();
    });
}

module.exports.send = send;
