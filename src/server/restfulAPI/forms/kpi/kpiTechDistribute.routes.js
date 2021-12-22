var kpiTechDistribute = require('../../models/kpiTechDistribute');
var moment = require('moment');

module.exports = function (app) {
    'use strict';
    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_kpi_tech_distribute_create, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_kpi_tech_distribute_create");
        console.log(JSON.stringify(req.body));
        var keyArray = Object.keys(req.body);
        var updateRequest = {};
        console.log(keyArray)
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "updateRequest.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }

        updateRequest.timestamp = moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),


        kpiTechDistribute.create(updateRequest, function (err, results) {
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
    app.post(global.apiUrl.post_kpi_tech_distribute_find, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_distribute_find");

        var findRequest = {
            // year: req.body.year,
        }

        if (req.body.year != undefined) {
            findRequest.year = req.body.year;
        }

        if (req.body.userDID != undefined) {
            findRequest.userDID = req.body.userDID;
        }

        kpiTechDistribute.aggregate(
            [
                {
                    $match: findRequest
                },
                // {
                //     $addFields: {
                //         "_userDID": {
                //             $toObjectId: "$userDID"
                //         },
                //     }
                // },
                // {
                //     $lookup: {
                //         from: "users",
                //         localField: "_userDID",
                //         foreignField: "_id",
                //         as: "_user_info"
                //     }
                // },
                // {
                //     $unwind: "$_user_info"
                // },
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

    })

    // update data
    app.post(global.apiUrl.post_kpi_tech_distribute_update, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_kpi_tech_distribute_update");
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

        kpiTechDistribute.updateOne({
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
    app.post(global.apiUrl.post_kpi_tech_distribute_remove, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_kpi_tech_distribute_remove");
        console.log(JSON.stringify(req.body));
        kpiTechDistribute.remove({
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