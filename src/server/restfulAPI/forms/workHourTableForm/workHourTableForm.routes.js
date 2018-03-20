var WorkHourForm = require('../../models/workHourForm');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_work_hour_create, function (req, res) {
        console.log(req.body);
        WorkHourForm.create({
            creatorDID: req.body.creatorDID,
            create_formDate: '2018/03/12',
            formTable: req.body.formTable,
        }, function (err, workhour) {
            if (err) {
                res.send(err);
            }
        });
        res.status(200).send({
            code: 200,
            error: global.status._200,
            // payload: workhour,
        });
    });

    //get form by date
    app.post(global.apiUrl.post_work_hour_get, function (req, res) {
        console.log(req.body);
        WorkHourForm.find({
            creatorDID: req.body.creatorDID,
            create_formDate: req.body.create_formDate,
        }, function (err, workhourform) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: workhourform,
            });
        });

    });

}