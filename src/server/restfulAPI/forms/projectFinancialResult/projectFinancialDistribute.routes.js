var ProjectFinancialDistribute = require('../../models/projectFinancialDistribute');
var moment = require('moment');

module.exports = function (app) {
    'use strict';
    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_project_financial_distribute_create, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_distribute_create");
        console.log(JSON.stringify(req.body));
        ProjectFinancialDistribute.create({
            prjDID: req.body.prjDID,
            userDID: req.body.userDID,
            is011Add: req.body.is011Add,
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
    app.post(global.apiUrl.post_project_financial_distribute_find, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_distribute_find");

        ProjectFinancialDistribute.aggregate(
            [
                {
                    $match: {
                        prjDID: req.body.prjDID,
                    }
                },
                {
                    $addFields: {
                        "_userDID": {
                            $toObjectId: "$userDID"
                        },
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_userDID",
                        foreignField: "_id",
                        as: "_user_info"
                    }
                },
                {
                    $unwind: "$_user_info"
                },
            ], function (err, items) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: items,
                    });
                }
            }
        )


        // ProjectFinancialDistribute.find({
        //     prjDID: req.body.prjDID,
        // }, function (err, tables) {
        //     if (err) {
        //         res.send(err);
        //     }
        //     res.status(200).send({
        //         code: 200,
        //         error: global.status._200,
        //         payload: tables,
        //     });
        // });
    })

    // update data
    app.post(global.apiUrl.post_project_financial_distribute_update, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_distribute_update");
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

        ProjectFinancialDistribute.updateOne({
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

    // remove
    app.post(global.apiUrl.post_project_financial_distribute_remove, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_distribute_remove");
        ProjectFinancialDistribute.remove({
            _id: req.body._id,
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
    })

}