
var userModel = require('../models/user');

module.exports = function(app) {
// application -------------------------------------------------------------

// ----- define routes
    // find
    app.post('/api/loginfind/', function(req, res) {

        userModel.find({
            email : req.body.email,

        }, function(err, user) {
            if (err) {
                res.send(err);
            }
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
        });
    });
}