let chai= require('chai');
let chaiHttp = require('chai-http');
let things = require('chai-things');
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let _ = require('lodash');

let expect = chai.expect;
chai.use( things);
chai.use(chaiHttp);
let db = mongoose.connection;
let server = null ;
let datastore = null ;
let password = bcrypt.hashSync(567);

describe('Customer Test', function (){
    before(function (done) {
        delete require.cache[require.resolve('../bin/www')];
        // delete require.cache[require.resolve('../models/classification')];
        datastore = require('../../models/customers');
        server = require('../../bin/www');
        try{
            let customer1 = new datastore(
                {   'name': 'Yu','email': '1095933649@qq.com','password': password,
                    'register_date': Date.now(), 'verification': true, 'code': null
                });
            let customer2 = new datastore(
                {
                    'name': 'Yue','email': '333@qq.com','password': password,
                    'register_date': Date.now(), 'verification': false, 'code': null
                });
            customer1.save();
            customer2.save();
            console.log('Customer insert success.');
            done();
        }catch (e) {
            console.log(e);
        }
    });
    after(function(done){
        try{
            db.collection('customer').deleteMany({'name': { $in: ['Yue','Yu'] }});
            console.log('Customers delete successfully.');
            done();
        }catch (e) {
            console.log(e);
        }
    });

    describe('POST /customers/login', () => {
        it('should return a message and a valid customer', function (done) {
            let customer = {'email': '1095933649@qq.com', 'password': 'Yue123...'};
            chai.request(server).post('/customers/login').send(customer).end(function (err, res) {
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('Welcome to our website! ');
                expect(res.body.data).to.have.property('name','Yue Wang');
                done();
            });
        });
        it('should return a Not Exist and null data', function (done) {
            let customer = {'email': '10001@qq.com', 'password': 'Yue123...'};
            chai.request(server).post('/customers/login').send(customer).end(function (err, res) {
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('Please sign up first!');
                expect(res.body.data).to.equal(null);
                done();
            });
        });
        it('should return an inactive message and null data', function (done) {
            let customer = {'email': '333@qq.com', 'password': 'Yue123...'};
            chai.request(server).post('/customers/login').send(customer).end(function (err, res) {
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('You are not verified!');
                expect(res.body.data).to.equal(null);
                done();
            });
        });
        it('should return an match failed message and null data', function (done) {
            let customer = {'email': '1095933649@q1.com', 'password': 'abc11122'};
            chai.request(server).post('/customers/login').send(customer).end(function (err, res) {
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('Wrong password!');
                expect(res.body.data).to.equal(null);
                done();
            });
        });
    });
});
