var WorkAddConfirmForm = require('../../models/workAddConfirmForm');
var moment = require('moment');

module.exports = function (app) {
    'use strict';
    // ----- define routes

    // Deprecated
    // create Form
    app.post(global.apiUrl.post_create_work_add_confirm_form, function (req, res) {
        if (req.body.oldFormID !== undefined) {
            WorkAddConfirmForm.remove({
                _id: req.body.oldFormID
            }, function (err) {
                if (err) {
                    res.send(err);
                }
                WorkAddConfirmForm.create({
                    creatorDID: req.body.creatorDID,
                    year: req.body.year,
                    month: req.body.month,
                    formTables: JSON.stringify(req.body.formTables),
                    timestamp: moment(new Date()).format("YYYYMMDD_HHmmss")
                }, function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        // payload: holidayForm,
                    });
                })
            })
        } else {
            WorkAddConfirmForm.create({
                creatorDID: req.body.creatorDID,
                year: req.body.year,
                month: req.body.month,
                formTables: JSON.stringify(req.body.formTables),
                timestamp: moment(new Date()).format("YYYYMMDD_HHmmss")
            }, function (err) {
                if (err) {
                    res.send(err);
                }
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    // payload: holidayForm,
                });
            })
        }
    });

    // fetch
    // Deprecated
    app.post(global.apiUrl.post_fetch_work_add_confirm_form_by_user_id, function (req, res) {
        WorkAddConfirmForm.find({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
        }, function (err, formDataResponse) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: formDataResponse,
            });
        })
    });
}