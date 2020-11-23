var ProjectFinancialResult = require('../../models/projectFinancialResult');
var moment = require('moment');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_project_financial_result_create, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_result_create");

        console.log(JSON.stringify(req.body));
        ProjectFinancialResult.create({
            prjDID: req.body.prjDID,
            timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
        }, function (err, results) {
            if (err) {
                res.send(err);
            }
        });
        res.status(200).send({
            code: 200,
            error: global.status._200,
        });
    });

    // fetch data
    app.post(global.apiUrl.post_project_financial_result_find, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_result_find");

        console.log(JSON.stringify(req.body));
        ProjectFinancialResult.find({
            prjDID: req.body.prjDID,
        }, function (err, tables) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: tables,
            });
        });
    })

    // update data
    app.post(global.apiUrl.post_project_financial_result_update, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_result_update");

        console.log(JSON.stringify(req.body));

        var keyArray = Object.keys(req.body);
        var updateTarget = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "updateTarget.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }

        console.log(updateTarget);

        ProjectFinancialResult.updateOne({
            _id: req.body._id,
        }, {
            $set: updateTarget
        }, function (err) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        });
    })

}