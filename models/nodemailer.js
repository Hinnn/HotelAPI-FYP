let nodemailer = require('nodemailer');
// let code = require(code);
// let customer = require('../models/customers');
function send (email, code) {
//new smtp server
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
        text: 'Your verification code is ' + code + '. The valid time is 10 minutes'
    };

// add a new SMTP server object
    let transporter = nodemailer.createTransport(config);
//send email

    transporter.sendMail(mail, code, function (error) {
        // callback(null);
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
        }
        console.log('Email sent successfully! Your code is '+ code );
        //transporter.close();
    });
}

module.exports.send = send;

