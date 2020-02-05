var TravelApplicationItem = require('../../models/travelApplicationItem');

module.exports = function (app) {
    'use strict';

    // ----- define routes
    // insert travel application item
    app.post(global.apiUrl.post_travel_application_insert_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_travel_application_insert_item");
        console.log(JSON.stringify(req.body));
        // New Items
        try {
            TravelApplicationItem.create({
                creatorDID: req.body.creatorDID,

                prjDID: req.body.prjDID,

                year: req.body.year,
                month: req.body.month,

                taStartDate: req.body.taStartDate,
                start_time: req.body.start_time,

                taEndDate: req.body.taEndDate,
                end_time: req.body.end_time,

                location: req.body.location,

                //RIGHT
                isSendReview: req.body.isSendReview,
                isBossCheck: req.body.isBossCheck,
                isExecutiveCheck: req.body.isExecutiveCheck,

                userMonthSalary: req.body.userMonthSalary,

                timestamp: req.body.timestamp,

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

    app.post(global.apiUrl.post_travel_application_get_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_travel_application_get_item");

        var keyArray = Object.keys(req.body);
        var findRequest = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "findRequest.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }

        console.log("--- find Request ---");
        console.log(findRequest);

        try {
            TravelApplicationItem.find(
                findRequest
            ).sort({
                timestamp: 1
            }).exec(function (err, items) {
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

    app.post(global.apiUrl.post_travel_application_remove_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_travel_application_remove_item");
        console.log(JSON.stringify(req.body));
        try {
            TravelApplicationItem.remove({
                _id: req.body.tableID,
            }).exec(function (err, items) {
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

    app.post(global.apiUrl.post_travel_application_update_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_travel_application_update_item");
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
            TravelApplicationItem.updateOne(
                {
                    _id:req.body._id

                }, {
                    $set: updateRequest
                }, function (err, result) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_update_item");
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
        } catch (err) {
            if (err) {
                res.send(err);
            }
        }
    });

    app.post(global.apiUrl.post_travel_application_search_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_travel_application_search_item");
        // console.log(JSON.stringify(req.body));
        try {
            var underlingCount = req.body.prjItems.length;
            var findData = []
            for (var index = 0; index < underlingCount; index++) {
                var target = {
                    prjDID: req.body.prjItems[index]._id,
                }
                findData.push(target);
            }
            TravelApplicationItem.aggregate(
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
                    // {
                    //     $group: {
                    //         _id: "$creatorDID",
                    //         count: {
                    //             $sum: 1
                    //         }
                    //     }
                    // }
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

    app.post(global.apiUrl.post_travel_application_search_item_2, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_travel_application_search_item_2");
        // console.log(JSON.stringify(req.body));
        try {
            var findData = [];
            for (var index = 0; index < req.body.creatorDIDList.length; index++) {
                var target = {
                    creatorDID: req.body.creatorDIDList[index],
                }
                findData.push(target);
            }
            TravelApplicationItem.aggregate(
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

        } catch (err) {
            if (err) {
                res.send(err);
            }
        }
    });

}