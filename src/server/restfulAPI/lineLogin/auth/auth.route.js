var moment = require('moment');

var userModel = require('../../models/user');
var VhcUser = require('../../vhc/model/vhcUser');

var fs = require('fs');
var readline = require('readline');

const https = require('https');

var querystring = require('querystring');


module.exports = function (app) {
    'use strict';
    // ----- define routes

    // fetch
    app.get(global.apiUrl.post_line_login_callback, function (req, res) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log("auth URL:> " + fullUrl);
        var rep_id_token = "";

        var captured = /code=([^&]+)/.exec(fullUrl)[1]; // Value is in [1] ('384' in our case)
        var code = captured ? captured : 'inValid';

        // var code = fullUrl.split("=")[1].toString().split("&")[0];

        var post_data = querystring.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "https://vhc.ichenprocin.dsmynas.com/api/auth",
            // redirect_uri: "https://vhc.ichenprocin.dsmynas.com/api/post_line_notify_auth_register",
            client_id: "1656703065",
            client_secret: "1751c7107a7aa05f6893da3b76fc5253"
        })
        // console.log(post_data)

        var post_options = {
            hostname: 'api.line.me',
            path: '/oauth2/v2.1/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        }

        // Set up the request
        var post_req = https.request(post_options, function(sub_res) {
            sub_res.setEncoding('utf8');
            sub_res.on('data', function (chunk) {
                console.log('Response: ' + chunk);

                var access_token = JSON.parse(chunk).access_token;
                console.log("access_token:> " + access_token);

                var id_token = JSON.parse(chunk).id_token;
                console.log("id_token:> " + id_token);
                rep_id_token = id_token;
            });
            sub_res.on('end', function (chunk) {
                const query = querystring.stringify({
                    "id_token": rep_id_token,
                });
                res.redirect('/lineSignUp.html?' + query);
            });
        });

        post_req.on('error', error => {
            console.error('Error: ' + error);
        })

        post_req.write(post_data);
        post_req.end()
    });


    app.post(global.apiUrl.post_line_login_email_check, function (req, res) {
        VhcUser.find({
            user_email : req.body.lineEmail,
        }, function(err, user) {
            if (err) {
                res.send(err);
            } else {
                console.log(user)
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: user,
                });
            }
        });
    });

    app.post(global.apiUrl.post_line_login_email_add_member, function (req, res) {
        console.log(req.body)
        VhcUser.create({
            user_number: "line_00000",
            user_email: req.body.lineEmail,
            line_photo: req.body.linePicture,
            line_id: req.body.lineID,
            user_name: req.body.vhcIDBindLine,
        }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    });
}