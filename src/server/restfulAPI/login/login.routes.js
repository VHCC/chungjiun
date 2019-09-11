var userModel = require('../models/user');

module.exports = function(app) {
    'use strict';
// application -------------------------------------------------------------
// ----- define routes
    // find
    app.post(global.apiUrl.post_login_user_find, function(req, res) {
        userModel.find({
            email : req.body.email,
        }, function(err, user) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + error);
                res.send(err);
            } else {
                if (user != '') {

                    if (req.body.password != user[0].get('password')) {
                        console.log(global.timeFormat(new Date()) + global.log.w + 'wrong pwd= ' + req.body.password);
                        res.status(404).send({
                            code: 400,
                            error: global.status._400,
                        });
                        return;
                    }
                    console.log(global.timeFormat(new Date()) + global.log.i + "Login Success, user= " + JSON.stringify(user));
                    res.json(user);
                    return;
                }
                console.log(global.timeFormat(new Date()) + global.log.i + "no User= " + req.body.email);
                res.status(404).send({
                    code: 404,
                    error: global.status._404,
                });
            }

        });
    });
}