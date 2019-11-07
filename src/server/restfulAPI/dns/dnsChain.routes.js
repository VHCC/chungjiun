var fs = require('fs');
var DNSGameChain = require('../dns/models/dnsGameChain');
var moment = require('moment');

module.exports = function (app) {

    // create game chain
    app.post(global.apiUrl.post_dns_game_chain_create_game_chain, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_game_chain_create_game_chain");
        console.log(req.body);

        DNSGameChain.create(
            {
                roomID: req.body.roomID,
                creator: req.body.creator,
                playerChained: null,
                resultsChained: [],
                subject: req.body.subject,
                parentID: req.body.folderID,
                timestamp: moment(new Date()).format("YYYYMMDD_HHmmss"),
            },
            function (err, gameChain) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_game_chain_create_game_chain");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: gameChain
                    });
                }
            })
    })

}
