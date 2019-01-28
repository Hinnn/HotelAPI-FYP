const nodemailer = require('nodemailer');

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

// add a new SMTP server object
let transporter = nodemailer.createTransport(config);
//send email
exports.send = function (mail, callback) {
    transporter.sendMail(mail, function (error, info) {
        callback(error);
        if (error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
}
