const nodemailer = require("nodemailer");

function send (email, admin_code) {
//new smtp server
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
        subject: 'Admin Email Verification',
        text: 'Your verification code is ' + admin_code + '. The valid time is 10 minutes'
    };


    // let transporter = nodemailer.createTransport(config);
        // // host: 'smtp.126.com',
        // host: 'localhost',// https://github.com/nodemailer/nodemailer/issues/441
        // port: 465,
        // secure: true,
        // auth: {
        //     user: 'wy20082242@126.com', //account to send email
        //     pass: 'yue123' //email authentication
        // }
    // });

//send email

    transporter.sendMail(mail, function (error, admin_code) {
         // callback(admin_code);
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
        } else {
            console.log('Email sent successfully! Your code is ' + admin_code);
            transporter.close();
        }
    });
    // return;
}

module.exports.send = send;
