let nodemailer = require('nodemailer');

function send (email) {
//new smtp server
    let code =Math.floor(Math.random()*1100000-100001);
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
       // html: '<h3>Thank you for your register!</h3>' +'<h3>Your verification code is: <strong style="color: #ff4e2a;"> +code+</strong>, ' +'valid time is 5 minutes. </h3>'
    };

// add a new SMTP server object
    let transporter = nodemailer.createTransport(config);
//send email

    transporter.sendMail(mail, function (error, info) {
        //callback(error);
        if (error) {
            return console.log('error');
            // return process.exit(1);
        }
        console.log('Email sent successfully!', info.response);
        transporter.close();
    });
}

module.exports.send = send;
