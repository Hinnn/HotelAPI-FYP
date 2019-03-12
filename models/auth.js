const jwt = require('jsonwebtoken');



function authCustomer(req, res, next){
    if(req.signedCookies.user == req.params.customer) {
        next()
    } else{
        next(new Error('Un-Authorized'));
    }
};

function authAdmin(req, res, next){
    if(req.signedCookies.user == req.params.admin) {
        next()
    } else{
        next(new Error('Un-Authorized'));
    }
};


module.exports.authCustomer = authCustomer;
module.exports.authAdmin = authAdmin;
