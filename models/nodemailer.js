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
        transporter.close();
    });
}

module.exports.send = send;
//
// const nodemailer = require('nodemailer');
// function send(email, role, code) {
//     let url = 'http://localhost:3000/active?code=';
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.126.com',
//         port: 465,
//         secure: true,
//         auth: {
//             user: 'wy20082242@126.com', //account to send email
//             pass: 'wy20082242' //email authentication
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     });
//     let mail = {
//         from: '"Yve Hotel"<wy20082242@126.com>',
//         to: email,
//         subject: 'Verify your email',
//         // text: 'This is the verification email',
//         html: "<h3>EMAIL VERIFICATION</h3>" +
//             "<h4>Dear customer</h4>"+
//             "<body><p>Please confirm your email address by clicking the VERIFY EMAIL link below.</p></br>" +
//             "<a href='http://localhost:3000/verification/"+ role +"?code="+code+"'>Click here</a></body>"
//        // html: '<h3><b>EMAIL VERIFICATION</b></h3>' + '<p><button class="btn btn-primary btn1" @click="verification()">VERIFY EMAIL</button></p>'
//     };
//     transporter.sendMail(mail, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent successfully!');
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//         transporter.close();
//
//     });
// }
// module.exports.send = send;
