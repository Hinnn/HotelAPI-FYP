let chai= require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let mongoose = require('mongoose');

let db = mongoose.connection;
let server = null;
let datastore = null;

chai.use(chaiHttp);
chai.use(require('chai-things'));
let bcrypt = require('bcrypt-nodejs');
let password = bcrypt.hashSync("Yue123...");
let _ = require('lodash');

let customer = [
    {
        "name": "Yue",
        "email":"666@qq.com",
        "password":password,
        "password2":password,
        "register_date": Date.now(),
        "verification": true
    },
    {
        "name": "Yu",
        "email":"777@qq.com",
        "password":password,
        "password2":password,
        "register_date": Date.now(),
        "verification": false
    }
]
describe('Customers', () => {
    before(function (done) {
            delete require.cache[require.resolve('../../bin/www')];
            datastore = require('../../models/customers');
            server = require('../../bin/www');
        try {
            db.collection('customers').insertMany(customer);
            console.log('Customer inserted successfully.');

        } catch (e) {
            console.log(e);
        }
        done();
    });
    after(function (done) {
        try{
        db.collection('customers').remove({'email': {$in: ['666@qq.com', '777@qq.com']}});
        console.log('Customers deleted successfully.');
        done();
        }catch (e) {
            console.log(e);
        }
    });


    describe('POST /customers/login', () => {
        describe('Welcome to our website!', function () {
            it('should return message about login successfully', function (done) {
                let customer = {'email': '666@qq.com', 'password': 'Yue123...'};
                chai.request(server)
                    .post('/customers/login')
                    .send(customer)
                    .end(function (err, res) {
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('message').equal('Welcome to our website! Yue');
                        expect(res.body.data).to.have.property('name', 'Yue');
                        done();
                    });
            });

        });
            it('should return customer does\'t exist message', function (done) {
                let customer = {'email': '12@qq.com', 'password': 'Yue123...'};
                chai.request(server).post('/customers/login').send(customer).end(function (err, res) {
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').equal('Please sign up first!');
                    expect(res.body.data).to.equal(null);
                    done();
                });
            });
            it('should return an not verified error', function (done) {
                let customer = {'email': '777@qq.com', 'password': 'Yue123...'};
                chai.request(server).post('/customers/login').send(customer).end(function (err, res) {
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').equal('You are not verified!');
                    expect(res.body.data).to.equal(null);
                    done();
                });
            });
            it('should return wrong password message', function (done) {
                let customer = {'email': '666@qq.com', 'password': '5111'};
                chai.request(server).post('/customers/login').send(customer).end(function (err, res) {
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').equal('Wrong password!');
                    expect(res.body.data).to.equal(null);
                    done();
                });
            });
    })
})
// });
