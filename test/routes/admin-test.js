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
let jwt = require('jsonwebtoken');
let token = null;
let admin = [
    {
        "name": "Yue Wang",
        "email":"test1@qq.com",
        "password":password,
        "password2":password,
        "register_date": Date.now(),
        "verification": true
    },
    {
        "name": "Yvette",
        "email":"test2@qq.com",
        "password":password,
        "password2":password,
        "register_date": Date.now(),
        "verification": false
    }
]
describe('Admin', () => {
    before(function (done) {
        delete require.cache[require.resolve('../../bin/www')];
        datastore = require('../../models/admin');
        server = require('../../bin/www');
        token = jwt.sign({email: datastore.email}, 'AdminJwtKey');
        try {
            db.collection('admin').insertMany(admin);
            console.log('Admin inserted successfully.');

        } catch (e) {
            console.log(e);
        }
        done();
    });
    after(function (done) {
        try {
            db.collection('admin').remove({'email': {$in: ['test1@qq.com', 'test2@qq.com']}});
            console.log('Admin deleted successfully.');
            done();
        } catch (e) {
            console.log(e);
        }
    });
    describe('GET /:admin/customers', () => {
        it('should return an error of unauthorized', function (done) {
            chai.request(server)
                .get('/customers')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                // expect(res.body).to.have.property('message').equal('You can not do this operation!');
                done();
            });
        });
        it('should retuen all customers in an array', function (done) {
            chai.request(server)
                .get('/test1@qq.com/customers')
                .set('token', token)
                .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
        })
    })
})
