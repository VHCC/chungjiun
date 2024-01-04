var ProjectFinancialResult = require('../../models/projectFinancialResult');
var Project = require('../../models/project');
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
            rate_item_1: req.body.rate_item_1,
            rate_item_2: req.body.rate_item_2,
            rate_item_21: req.body.rate_item_21,
            rate_item_3: req.body.rate_item_3,
            rate_item_4: req.body.rate_item_4,
            rate_item_5: req.body.rate_item_5,
            timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
        }, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: results,
                });
            }
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

        ProjectFinancialResult.find({
            _id: req.body._id,
        }, function (err, fr) {
            if (err) {
                res.send(err);
            } else {
                if (req.body.changePrjStatus) {
                    Project.updateOne({
                        _id: fr[0].prjDID,
                    }, {
                        $set: {
                            enable: req.body.enable,
                            isPrjClose: req.body.isPrjClose,
                            update_ts: req.body.update_ts,
                            updater: req.body.updater,
                        }
                    }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }

                ProjectFinancialResult.updateOne({
                    _id: req.body._id,
                }, {
                    $set: updateTarget
                }, function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                        });
                    }
                });
            }

        });
    })

    // sync
    app.post(global.apiUrl.post_project_financial_result_sync_project, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_result_sync_project");

        ProjectFinancialResult.find({
            isPrjClose: true,
        }, function (err, frs) {
            if (err) {
                res.send(err);
            }

            var findData = []
            for (var index = 0; index < frs.length; index++) {
                var target = {
                    _id: frs[index].prjDID,
                }
                findData.push(target);
            }
            Project.updateMany(
                {
                    $or: findData,
                }, {
                    $set: {
                        isPrjClose: true,
                    }
                }, function (err) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, get_project_find_by_prjid_array");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.send(err);
                    } else {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                        });
                    }
                })
        });
    })


}