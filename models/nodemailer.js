let nodemailer = require('nodemailer');
// let code = require(code);
// let customer = require('../models/customers');
function send (email, code) {
//new smtp server
//     const config = {
//         host: 'smtp.126.com',
//         port: 465,
//         secure: true,
//         auth: {
//             user: 'wy20082242@126.com', //account to send email
//             pass: 'yue123' //email authentication
//         }
//     };
    let transporter = nodemailer.createTransport({
        host: 'smtp.126.com',
        port: 465,
        secure: true,
        secureConnection:true,
        auth: {
            user: 'wy20082242@126.com', //account to send email
            pass: 'yue123' //email authentication
        }
    });
    let mail = {
        from: '"Yve Hotel"<wy20082242@126.com>',
        to: email,
        subject: 'Email Verification',
        text: 'Your verification code is ' + code + '. Please verify your email in 10 minutes'
    }

// add a new SMTP server object
//     let transporter = nodemailer.createTransport(config);
//send email

    transporter.sendMail(mail, function (error, code) {
        // callback(null);
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
        } else {
            console.log('Email sent successfully! Your code is ' + code);
            transporter.close();
        }
    });
    // return;
}

module.exports.send = send;

