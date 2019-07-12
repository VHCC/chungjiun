var moment = require('moment');

var fs = require('fs');
var readline = require('readline');

module.exports = function (app) {
    'use strict';
    // ----- define routes

    // fetch
    app.get(global.apiUrl.get_line_notify_auth_register, function (req, res) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log(fullUrl);
        console.log(req.body);
        res.status(200).send({
            code: 200,
            error: global.status._200,
        });
    });

}