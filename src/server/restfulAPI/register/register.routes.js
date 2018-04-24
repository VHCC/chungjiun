
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
}