
var userModel = require('../models/user');

module.exports = function(app) {
// application -------------------------------------------------------------

// ----- define routes
    // create
    app.post(global.apiUrl.post_register_user, function(req, res) {
        console.log(req.body);
        userModel.create({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            roleType: req.body.roletype,
        }, function (err, project) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        })
    });

    app.post(global.apiUrl.post_find_user_by_email, function(req, res) {
        console.log(req.body);
        userModel.find({
            email : req.body.email,

        }, function(err, user) {
            if (err) {
                res.send(err);
            }
            if (user != '') {
                res.json(user);
                return;
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        });
    });
}