const nodemailer = require("nodemailer");

function send (email, newPass) {
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
        subject: 'Forget your Password?',
        text: '"' + newPass + '" is your new password. Please change your password after login to make sure the safety of your account.'
    };

//send email

    transporter.sendMail(mail, function (error) {
        //callback(newPass);
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
        }else {
            console.log('Email sent successfully!');
            transporter.close();
        }
    });
}

module.exports.send = send;
