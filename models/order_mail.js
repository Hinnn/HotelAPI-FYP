let nodemailer = require('nodemailer');

function send (email, booking) {
//new smtp server
    const config = {
        service: 'smtp.126.com',
        host: 'smtp.126.com',
        port: 465,
        secure: true,
        auth: {
            user: 'wy20082242@126.com', //account to send email
            pass: 'yue123' //email authentication
        }
    };
    let mail = {
        from: '"Yve Hotel"<wy20082242@126.com>',
        to: email,
        subject: 'Thanks for your order',
        // html: '<h>Dear customer</h><br>' +
        //     '<h>This is your order detail: </h>' + '<h>Order ID: </h>' + booking._id +
        //     '<h>payment_status: </h>' + booking.payment_status +
        //     '<br><h>Name: </h>' + booking.name + '<br><h>Contact Phone: </h>' + booking.contactNum +
        //     '<br><h>Check In Date: </h>' + booking.checkin_date + '<br><h>Leave Date: </h>' + booking.leave_date +
        //     '<br><h>Hope you enjoy your travel</h>'
        // text: ''+ booking + ' Hope you enjoy your travel.'
        html: '<h>Dear customer</h><br>' + '<h>This is your order detail: </h><br>' + booking
    };

    let transporter = nodemailer.createTransport(config);

    transporter.sendMail(mail, function (error, booking) {
        // callback(null);
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
        } else {
            console.log('Email sent successfully! '+ booking);
            //transporter.close();
        }
    });
    return;
}

module.exports.sendEmail = send;

