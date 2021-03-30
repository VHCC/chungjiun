var HrRemedyTable = require('../../models/hrRemedy');

module.exports = function (app) {
    'use strict';

    // ----- define routes
    app.post(global.apiUrl.post_hr_remedy_insert_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_hr_remedy_insert_item");
        console.log(JSON.stringify(req.body));
        // New Items
        try {
            HrRemedyTable.create({
                creatorDID: req.body.creatorDID,
                create_formDate: req.body.create_formDate,
                workType: req.body.workType,
                year: req.body.year,
                month: req.body.month,
                day: req.body.day,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                reason: req.body.reason,
                //RIGHT
                isSendReview: req.body.isSendReview,
                isBossCheck: req.body.isBossCheck,
                isExecutiveCheck: req.body.isExecutiveCheck,
                userMonthSalary: req.body.userMonthSalary,

                timestamp: req.body.timestemp

            }, function (err, item) {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: item,
                });
            });
        } catch (err) {
            if (err) {
                res.send(err);
            }
        }
    });

    app.post(global.apiUrl.post_hr_remedy_fetch_items_by_creatorDID, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_hr_remedy_fetch_items_by_creatorDID");
        console.log(JSON.stringify(req.body));
        // New Items

        if(!req.body.year) {
            try {
                HrRemedyTable.find({
                    creatorDID: req.body.creatorDID,
                }, function (err, items) {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: items,
                    });
                });
            } catch (err) {
                if (err) {
                    res.send(err);
                }
            }
        } else {
            try {
                HrRemedyTable.find({
                    creatorDID: req.body.creatorDID,
                    year: req.body.year,
                }, function (err, items) {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: items,
                    });
                });
            } catch (err) {
                if (err) {
                    res.send(err);
                }
            }
        }


    });

    app.post(global.apiUrl.post_hr_remedy_delete_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_hr_remedy_delete_items");
        console.log(JSON.stringify(req.body));

        try {
            HrRemedyTable.remove({
                _id: req.body.tableID,

            }, function (err, items) {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items,
                });
            });
        } catch (err) {
            if (err) {
                res.send(err);
            }
        }
    });

    app.post(global.apiUrl.post_hr_remedy_update_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_hr_remedy_update_item");
        console.log(JSON.stringify(req.body));

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
        console.log(updateRequest);

        try {
            HrRemedyTable.updateOne({
                _id: req.body._id,
            }, {
                $set: updateRequest
            }, function (err, result) {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: result,
                });
            });
        } catch (err) {
            if (err) {
                res.send(err);
            }
        }
    });

    app.post(global.apiUrl.post_hr_remedy_search_item_review, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_hr_remedy_search_item_review");
        console.log(JSON.stringify(req.body));
        try {

            var findData = [];
            for (var index = 0; index < req.body.creatorDIDList.length; index++) {
                var target = {
                    creatorDID: req.body.creatorDIDList[index],
                }
                findData.push(target);
            }

            if (req.body.creatorDIDList.length == 0){
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: [],
                });
            } else {
                HrRemedyTable.aggregate(
                    [
                        {
                            $match: {
                                $or: findData,
                                isSendReview: true,
                                isBossCheck: false
                            }
                        },
                        {
                            $sort: {
                                timestamp: 1
                            }
                        }
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
            }

        } catch (err) {
            if (err) {
                res.send(err);
            }
        }
    });

    app.post(global.apiUrl.post_hr_remedy_search_item_confirm, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_hr_remedy_search_item_confirm");
        console.log(JSON.stringify(req.body));
        try {

            HrRemedyTable.aggregate(
                [
                    {
                        $match: {
                            // $or: findData,
                            isSendReview: true,
                            isBossCheck: true
                        }
                    },
                    {
                        $sort: {
                            timestamp: 1
                        }
                    }
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

        } catch (err) {
            if (err) {
                res.send(err);
            }
        }
    });

}