var WorkOffTableExchangeForm = require('../../models/workOffTableExchangeForm');

module.exports = function (app) {
    'use strict';

    // ----- define routes
    // create item
    app.post(global.apiUrl.post_work_off_exchange_table_insert_item, function (req, res) {
        WorkOffTableExchangeForm.create({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            isConfirmed: false,
        }, function (err, item) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        });

    });

    // fetch items
    app.post(global.apiUrl.post_work_off_exchange_table_fetch_items, function (req, res) {
        WorkOffTableExchangeForm.find({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
        }, function (err, items) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items,
                });
            }
        });
    });

    // remove items
    app.post(global.apiUrl.post_work_off_exchange_table_remove_item, function (req, res) {
        WorkOffTableExchangeForm.remove({
            _id: req.body._id,
        }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        });
    });

    // confirm items
    app.post(global.apiUrl.post_work_off_exchange_table_confirm_item, function (req, res) {
        WorkOffTableExchangeForm.update({
            _id: req.body._id,
        }, {
            $set: {
                month: req.body.month,
                userMonthSalary: req.body.userMonthSalary,
                exchangeHour: req.body.exchangeHour,
                workOffType: req.body.workOffType,
                isConfirmed: true,
            }
        }, function (err, items) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items,
                });
            }
        });
    });
}