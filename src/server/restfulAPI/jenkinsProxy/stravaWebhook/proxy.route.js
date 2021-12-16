var moment = require('moment');

var fs = require('fs');

const https = require('https');

var querystring = require('querystring');


module.exports = function (app) {
    'use strict';
    // ----- define routes

    // fetch
    app.post(global.apiUrl.post_jenkins_proxy_strava_webhook, function (req, res) {
        // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        // console.log(req)
        // console.log("auth URL:> " + fullUrl);
        // custom agent as global variable
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });

        var post_data = querystring.stringify({
            token: "TOKEN_STRVA_REFRESH",
        })
        // console.log(post_data)

        var post_options = {
            hostname: 'jenkins.ichenprocin.dsmynas.com',
            path: '/generic-webhook-trigger/invoke',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            },
            agent
        }

        // Set up the request
        var post_req = https.request(post_options, function(sub_res) {
            sub_res.setEncoding('utf8');
            sub_res.on('data', function (chunk) {
                console.log('Response: ' + chunk);

            });
            sub_res.on('end', function (chunk) {
            });
        });

        post_req.on('error', error => {
            console.error('Error: ' + error);
        })

        post_req.write(post_data);
        post_req.end()
    });


    app.get(global.apiUrl.get_jenkins_proxy_strava_webhook, function (req, res) {
        // console.log(req);
        // Your verify token. Should be a random string.
        const VERIFY_TOKEN = "STRAVA";
        // Parses the query params
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];
        // Checks if a token and mode is in the query string of the request
        if (mode && token) {
            // Verifies that the mode and token sent are valid
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                // Responds with the challenge token from the request
                console.log('WEBHOOK_VERIFIED');
                res.json({"hub.challenge":challenge});
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
    });

}