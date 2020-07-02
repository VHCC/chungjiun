var WorkOverTimeItem = require('../../models/workOverTimeItem');

module.exports = function (app) {
    'use strict';

    // ----- define routes
    app.post(global.apiUrl.post_work_over_time_insert_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_over_time_insert_item");
        console.log(JSON.stringify(req.body));

        // New Items
        try {
            WorkOverTimeItem.create({
                creatorDID: req.body.creatorDID,
                prjDID: req.body.prjDID,
                create_formDate: req.body.create_formDate,
                year: req.body.year,
                month: req.body.month,
                day: req.body.day,

                timestamp: req.body.timestamp
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

    app.post(global.apiUrl.post_work_over_time_fetch_by_creatorDID, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_over_time_fetch_by_creatorDID");
        console.log(JSON.stringify(req.body));

        // New Items
        try {
            WorkOverTimeItem.find({
                creatorDID: req.body.creatorDID,
                year: req.body.year,
                month: req.body.month,
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

    app.post(global.apiUrl.post_work_over_time_fetch_by_creatorDID_create_formdate, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_over_time_fetch_by_creatorDID_create_formdate");
        console.log(JSON.stringify(req.body));

        // New Items
        try {
            WorkOverTimeItem.find({
                creatorDID: req.body.creatorDID,
                create_formDate: req.body.create_formDate,
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


    app.post(global.apiUrl.post_work_over_time_delete_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_over_time_delete_item");
        console.log(JSON.stringify(req.body));

        try {
            WorkOverTimeItem.remove({
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

    app.post(global.apiUrl.post_work_over_time_update_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_over_time_update_item");
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
            WorkOverTimeItem.updateOne({
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

}