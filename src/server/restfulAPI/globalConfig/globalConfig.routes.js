var globalConfigModel = require('../models/globalConfig');

module.exports = function(app) {
    'use strict';

    // insert
    app.post(global.apiUrl.post_global_configs_insert, function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_global_configs_insert");

        console.log(req.body);

        globalConfigModel.create({
            year: req.body.year,
            month: req.body.month,
        }, function(err, configs) {
            console.log(configs);
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: configs
            });
        });
    });

    // fetch
    app.post(global.apiUrl.fetch_global_configs, function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, fetch_global_configs");

        console.log(req.body);

        globalConfigModel.find({
            year: req.body.year,
            month: req.body.month,
        }, function(err, configs) {
            console.log(configs);
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: configs
            });
        });
    });

    app.post(global.apiUrl.post_global_configs_update, function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_global_configs_update");

        console.log(req.body);

        var keyArray = Object.keys(req.body);
        var updateRequest = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "updateRequest.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }

        delete updateRequest._id;
        console.log("--- updateRequest ---");

        globalConfigModel.updateOne({

        }, {
            $set: updateRequest
        }, function(err, result) {
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: result
            });
        });
    });
}