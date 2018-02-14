var path = require('path');
var appDir = path.dirname(require.main.filename);

var UserLogin = require('./models/user');

module.exports = function(app) {

// application -------------------------------------------------------------

// ----- define routes
    // create
    app.post('/api/login', function(req, res) {
        console.log("create user");
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
        console.log("find");
        UserLogin.find({
            email : req.body.email
        }, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    });

// // get the indexold.html
//     app.get('*', function(req, res) {
//         // res.sendFile(appDir + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
//         console.log("redirect");
//         res.sendFile('/auth.html' , { root : appDir}); // load the single view file (angular will handle the page changes on the front-end)
//     });
}