var OverTimeDay = require('../../models/overTimedayForm');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_over_time_day_data_form_create, function (req, res) {
        console.log(JSON.stringify(req.body));
        OverTimeDay.create({
            create_formDate: req.body.create_formDate,
            year: req.body.year,
            month: req.body.month,
            day: req.body.day,
        }, function (err, payment) {
            if (err) {
                res.send(err);
            }
        });
        res.status(200).send({
            code: 200,
            error: global.status._200,
        });
    });

    // fetch all data
    app.post(global.apiUrl.post_over_time_day_data_form_fetch_all, function (req, res) {
        // console.log(JSON.stringify(req.body));
        OverTimeDay.find({
            year: req.body.year,
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
    app.post(global.apiUrl.post_over_time_day_data_form_update, function (req, res) {
        console.log(JSON.stringify(req.body));
        OverTimeDay.update({
            _id: req.body.tableID,
        }, {
            $set: {
                create_formDate: req.body.create_formDate,
                year: req.body.year,
                month: req.body.month,
                day: req.body.day,
                isEnable: true,
            }
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

    // remove item
    app.post(global.apiUrl.post_over_time_day_data_form_remove, function (req, res) {
        console.log(JSON.stringify(req.body));
        OverTimeDay.remove({
            _id: req.body.tableID,
        }, function (err) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        })
    })

    // TODO
    //fetch Holiday with parameters
    app.post(global.apiUrl.post_over_time_day_data_form_fetch_with_parameters, function (req, res) {
        console.log("OverTime= " + JSON.stringify(req.body));
        OverTimeDay.find({
            // year: req.body.year,
            create_formDate: req.body.create_formDate,
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

}