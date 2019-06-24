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
        console.log(req.body);
        HolidayData.update({
            _id: req.body._id,
        }, {
            $set: {
                start_special: req.body.start_special,
                end_special: req.body.end_special,
                start_married: req.body.start_married,
                end_married: req.body.end_married,
                start_mourning: req.body.start_mourning,
                end_mourning: req.body.end_mourning,
                start_official: req.body.start_official,
                end_official: req.body.end_official,
                start_workinjury: req.body.start_workinjury,
                end_workinjury: req.body.end_workinjury,
                start_maternity: req.body.start_maternity,
                end_maternity: req.body.end_maternity,
                start_paternity: req.body.start_paternity,
                end_paternity: req.body.end_paternity,
                start_others: req.body.start_others,
                end_others: req.body.end_others,

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
                calculate_others: req.body.calculate_others,

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
                rest_others: req.body.rest_others,
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