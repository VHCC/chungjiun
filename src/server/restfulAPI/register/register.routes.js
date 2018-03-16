
var userModel = require('../models/user');

module.exports = function(app) {
// application -------------------------------------------------------------

// ----- define routes
    // create
    app.post(global.apiUrl.post_register_user, function(req, res) {
        console.log(123123)
    });
}