
var userModel = require('../models/user');

module.exports = function(app) {
// application -------------------------------------------------------------

// ----- define routes
    // create
    app.post(global.apiUrl.post_register_user, function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "create user");
        userModel.create({
            email : req.body.email,
            password : req.body.password,
            name : req.body.username,
            roleType : req.body.roletype,
            done : false
        }, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    });
}