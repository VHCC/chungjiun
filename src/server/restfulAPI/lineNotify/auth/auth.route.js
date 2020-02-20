var moment = require('moment');
var moment = require('moment');

var fs = require('fs');
var readline = require('readline');

const https = require('https');

var querystring = require('querystring');

var lineNotifyObjectModel = require('../../models/lineNotifyObject');

module.exports = function (app) {
    'use strict';
    // ----- define routes

    // fetch
    app.get(global.apiUrl.get_line_notify_auth_register, function (req, res) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log(fullUrl);

        const userDID = fullUrl.split("=")[2];

        console.log(fullUrl.split("=")[2]);

        var post_data = querystring.stringify({
            grant_type: "authorization_code",
            code: fullUrl.split("=")[1].toString().split("&")[0],
            redirect_uri: "https://vhc.ichenprocin.dsmynas.com/api/post_line_notify_auth_register",
            // redirect_uri: "http://localhost:3000/api/post_line_notify_auth_register",
            client_id: "8KVRmFQC5LQ0bCfjRVzmxV",
            client_secret: "vsN1sbQUs4cWjuomuHEYUk73z7CKn0TcaTgblZQBSjW"
        })

        var post_options = {
            hostname: 'notify-bot.line.me',
            port: 443,
            path: '/oauth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        }

        console.log(post_data);

        // Set up the request
        var post_req = https.request(post_options, function(sub_res) {
            sub_res.setEncoding('utf8');
            sub_res.on('data', function (chunk) {
                console.log('Response: ' + chunk);

                var status = JSON.parse(chunk).status;

                console.log(status);
                switch(status) {
                    case 400:
                        res.status(400).send({
                            code: 400,
                            error: global.status._400,
                        });
                        break;
                    case 200:
                        var access_token = JSON.parse(chunk).access_token;

                        lineNotifyObjectModel.find({
                            creatorDID: userDID,
                        }, function (err, results) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(results);
                                if (results.length == 0) {
                                    lineNotifyObjectModel.create({
                                            creatorDID: userDID,
                                            token: access_token,
                                            timestamp: moment(new Date()).format("YYYYMMDD HHmmss")
                                        }, function(err, results) {
                                            if (err) {
                                                console.log(err)
                                            } else {
                                                res.status(200).send({
                                                    code: 200,
                                                    results: userDID + " connect to Line Succeed.",
                                                    payload: results
                                                });
                                            }

                                        });
                                } else {
                                    lineNotifyObjectModel.update({
                                        creatorDID: userDID,
                                    }, {
                                        $set: {
                                            token: access_token,
                                            timestamp: moment(new Date()).format("YYYYMMDD HHmmss")
                                        }
                                    }, function(err, results) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            res.status(200).send({
                                                code: 200,
                                                results: userDID + " connect to Line Succeed.",
                                                payload: results
                                            });
                                        }

                                    });
                                }
                            }
                        })
                        break;
                }

            });
        });

        post_req.on('error', error => {
            console.error('Error: ' + error);
        })

        post_req.write(post_data);
        post_req.end()


    });

}