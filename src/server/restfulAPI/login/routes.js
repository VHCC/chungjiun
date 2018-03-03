
var UserLogin = require('./models/user');
var statusString = require

module.exports = function(app) {
// application -------------------------------------------------------------

// ----- define routes
    // create

    app.post('/api/login', function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "create user");
        UserLogin.create({
            email : req.body.email,
            password : req.body.password,
            done : false
        }, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    });

    // find
    app.post('/api/loginfind/', function(req, res) {

        UserLogin.find({
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

// // get the indexold.html
//     app.get('/api/login/check', function(req, res) {
//         // res.sendFile(appDir + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
//         console.log("redirect");
//         res.sendFile('/src/auth.html' , { root : appDir}); // load the single view file (angular will handle the page changes on the front-end)
//     });
}