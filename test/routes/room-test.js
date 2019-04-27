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
let token = null;
let room = [
    {
        "roomType": "twin",
        "roomID":"801",
        "price":"60",
        "bedType":"two single beds",
        "people":"2"
    },
    {
        "roomType": "single",
        "roomID":"802",
        "price":"40",
        "bedType":"one single bed",
        "people":"1"
    }
]
describe('Admin', () => {
    before(function (done) {
        delete require.cache[require.resolve('../../bin/www')];
        datastore = require('../../models/rooms');
        server = require('../../bin/www');
        token = jwt.sign({email: datastore.email}, 'AdminJwtKey');
        try {
            db.collection('rooms').insertMany(room);
            console.log('Rooms inserted successfully.');

        } catch (e) {
            console.log(e);
        }
        done();
    });
    after(function (done) {
        try {
            db.collection('rooms').remove({'roomID': {$in: ['801', '802']}});
            console.log('Rooms deleted successfully.');
            done();
        } catch (e) {
            console.log(e);
        }
    });
    describe('DELETE /:admin/rooms/:roomID', () => {
        it('should return unauthorized error', function (done) {
            chai.request(server)
                .delete('/rooms/801')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    // expect(res.body).to.have.property('message').equal('You can not delete the room!');
                    done();
                });
        });
        it('should return room deleted successfully message', function (done) {
            chai.request(server)
                .delete('/111@qq.com/rooms/801')
                .set('token', token)
                .end((err, res) => {
                    expect(res.body).to.have.property('message').equal('Room Successfully Deleted!');
                    done();
                });
        after(function (done) {
            chai.request(server)
                .get('/rooms')
                .end(function (err, res) {
                    let result = _.map(res.body, (booking) => {
                        return {
                            roomID: booking.roomID
                        }
                    });
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(result).to.include({
                        "roomID": "102"

                    });
                    done();
                });
        });
        })
    })
})
