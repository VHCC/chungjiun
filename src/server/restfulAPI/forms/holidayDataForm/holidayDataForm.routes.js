var HolidayData = require('../../models/holidayDataForm');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_holiday_data_form_create, function (req, res) {
        HolidayData.create({
            year: 107,
            creatorDID: req.body.creatorDID,
        }, function (err, holidayForm) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: holidayForm,
            });
        });
    });

    // find form
    app.post(global.apiUrl.post_holiday_data_form_find_by_user_did, function (req, res) {
        HolidayData.find({
            year: 107,
            creatorDID: req.body.creatorDID,
        }, function (err, holidayForm) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: holidayForm,
            });
        })
    })

    // update form
    app.post(global.apiUrl.post_holiday_data_form_update_by_form_id, function (req, res) {
        HolidayData.update({
            _id: req.body._id,
        }, {
            $set: {
                calculate_sick: req.body.calculate_sick,
                calculate_private: req.body.calculate_private,
                calculate_observed: req.body.calculate_observed,
                calculate_special: req.body.calculate_special,
                calculate_married: req.body.calculate_married,
                calculate_mourning: req.body.calculate_mourning,
                calculate_official: req.body.calculate_official,
                calculate_workinjury: req.body.calculate_workinjury,
                calculate_maternity: req.body.calculate_maternity,
                calculate_paternity: req.body.calculate_paternity,
                rest_sick: req.body.rest_sick,
                rest_private: req.body.rest_private,
                rest_observed: req.body.rest_observed,
                rest_special: req.body.rest_special,
                rest_married: req.body.rest_married,
                rest_mourning: req.body.rest_mourning,
                rest_official: req.body.rest_official,
                rest_workinjury: req.body.rest_workinjury,
                rest_maternity: req.body.rest_maternity,
                rest_paternity: req.body.rest_paternity,
            }
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

}