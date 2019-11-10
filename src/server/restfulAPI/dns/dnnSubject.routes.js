var fs = require('fs');
var DNSGameSubject = require('../dns/models/dnsSubject')();
var moment = require('moment');

module.exports = function (app) {

    // get game subject
    app.post(global.apiUrl.post_dns_game_subject_get, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_game_subject_get");
        console.log(req.body);

        DNSGameSubject.aggregate([
                {
                    $match: {
                        difficulty: req.body.difficulty,
                        isAdult: req.body.isAdult,
                        locale: "zh_TW"
                    }
                },
                {
                    $sample: {
                        size: 1
                    }
                }
            ], function (err, result) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_game_subject_get");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: result
                    });
                }
            })
    })


}
