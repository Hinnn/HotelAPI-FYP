let chai= require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let mongoose = require('mongoose');

let db = mongoose.connection;
let server = null;
let datastore = null;

chai.use(chaiHttp);
chai.use(require('chai-things'));
let _ = require('lodash');
let jwt = require('jsonwebtoken');

let booking = [
    {
        "name": "Yue Wang",
        "email":"666@qq.com",
        "roomType":"double",
        "quantity":"1",
        "checkin_date": "2019-06-01",
        "leave_date":"2019-06-02",
        "contactNum":"0989890000"
    }
    // {
    //     "name": "Yu",
    //     "email":"666@qq.com",
    //     "roomType":"double",
    //     "quantity":"1",
    //     "checkin_date": "2019-05-01",
    //     "leave_date":"2019-05-02",
    //     "contactNum":"0989890000"
    // }

]
describe('Bookings', () => {
    before(function (done) {
        delete require.cache[require.resolve('../../bin/www')];
        datastore = require('../../models/bookings');
        server = require('../../bin/www');
        // token = jwt.sign({email: datastore.email}, 'AdminJwtKey');
        try {
            db.collection('bookings').insertMany(booking);
            console.log(' Bookings inserted successfully.');

        } catch (e) {
            console.log(e);
        }
        done();
    });
    after(function (done) {
        try {
            db.collection('bookings').remove({'email': {$in: ['666@qq.com']}});
            console.log('Bookings deleted successfully.');
            done();
        } catch (e) {
            console.log(e);
        }
    });
    describe('POST /bookings', () => {
        describe('Please add order operation', function () {
            it('show a message about please complete all the information', function (done) {
                let booking = {
                    "name": "Yu",
                    "email": "666@qq.com",
                    "roomType": "double",
                    "checkin_date": "2019-05-01",
                    "leave_date": "2019-05-02",
                    "contactNum": "0989890000"
                };
                chai.request(server)
                    .post('/bookings')
                    .send(booking)
                    .end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Please complete all the information!');
                        done();
                    });
            });
            it('Show an error about wrong email format', function (done) {
                let booking = {
                    "name": "Yu",
                    "email": "666@qq",
                    "roomType": "double",
                    "quantity": "1",
                    "checkin_date": "2019-05-01",
                    "leave_date": "2019-05-02",
                    "contactNum": "0989890000"
                };
                chai.request(server)
                    .post('/bookings')
                    .send(booking)
                    .end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Wrong email format!');
                        done();
                    });
            });
            it('Show an error of invalid phone number', function (done) {
                let booking = {
                    "name": "Yu",
                    "email": "666@qq.com",
                    "roomType": "double",
                    "quantity": "1",
                    "checkin_date": "2019-05-01",
                    "leave_date": "2019-05-02",
                    "contactNum": "098989"
                };
                chai.request(server)
                    .post('/bookings')
                    .send(booking)
                    .end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Your phone number should contain 10 characters!');
                        done();
                    });
            });
            it('Show an error of please choose at least one room', function (done) {
                let booking = {
                    "name": "Yu",
                    "email": "666@qq.com",
                    "roomType": "double",
                    "quantity": "0",
                    "checkin_date": "2019-05-01",
                    "leave_date": "2019-05-02",
                    "contactNum": "0989891111"
                };
                chai.request(server)
                    .post('/bookings')
                    .send(booking)
                    .end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Please choose at least one room!');
                        done();
                    });
            });
            it('Show room amount error', function (done) {
                let booking = {
                    "name": "Yu",
                    "email": "666@qq.com",
                    "roomType": "double",
                    "quantity": "9",
                    "checkin_date": "2019-05-01",
                    "leave_date": "2019-05-02",
                    "contactNum": "0989891111"
                };
                chai.request(server)
                    .post('/bookings')
                    .send(booking)
                    .end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('You can only book no more than 3 rooms!');
                        done();
                    });
            });
            it('Show an error of invalid check out date', function (done) {
                let booking = {
                    "name": "Yu",
                    "email": "666@qq.com",
                    "roomType": "double",
                    "quantity": "1",
                    "checkin_date": "2019-05-05",
                    "leave_date": "2019-05-02",
                    "contactNum": "0989891111"
                };
                chai.request(server)
                    .post('/bookings')
                    .send(booking)
                    .end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Leaving date should be later than check in date!');
                        done();
                    });
            });
            it('Show an error of check in date', function (done) {
                let booking = {
                    "name": "Yu",
                    "email": "666@qq.com",
                    "roomType": "double",
                    "quantity": "1",
                    "checkin_date": "2019-04-01",
                    "leave_date": "2019-04-02",
                    "contactNum": "0989891111"
                };
                chai.request(server)
                    .post('/bookings')
                    .send(booking)
                    .end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('The earliest day is the next day!');
                        done();
                    });
            });
            it('Show a message of order added successfully', function (done) {
                let booking = {
                    "name": "Yu",
                    "email": "666@qq.com",
                    "roomType": "double",
                    "quantity": "1",
                    "checkin_date": "2019-06-01",
                    "leave_date": "2019-06-02",
                    "contactNum": "0989891111"
                };
                chai.request(server)
                    .post('/bookings')
                    .send(booking)
                    .end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Booking Successfully Added!');
                        done();
                    });
            });


        });
    })
})
