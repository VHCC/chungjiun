var projectFinancialRateModel = require('../models/projectFinancialRate');
var moment = require('moment');

module.exports = function(app) {
    'use strict';

    // insert
    app.post(global.apiUrl.post_project_financial_rate_insert, function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_rate_insert");
        console.log(req.body);

        projectFinancialRateModel.create({
            year: req.body.year,
            timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
        }, function(err, financialRate) {
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: financialRate
            });
        });
    });

    // fetch
    app.post(global.apiUrl.post_project_financial_rate_get, function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_rate_get");
        console.log(req.body);

        projectFinancialRateModel.findOne({
            year: req.body.year,
        }, function(err, financialRate) {
            if (financialRate == null) {
                projectFinancialRateModel.create({
                    year: req.body.year,
                    timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
                }, function(err, financialRate) {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: financialRate
                    });
                });
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: financialRate
                });
            }

        });
    });

    app.post(global.apiUrl.post_project_financial_rate_update, function(req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_financial_rate_update");
        console.log(req.body);

        projectFinancialRateModel.updateOne({
            year: req.body.year,
        }, {
            $set: {
                rate_item_1: req.body.rate_item_1,
                rate_item_2: req.body.rate_item_2,
                rate_item_3: req.body.rate_item_3,
                rate_item_4: req.body.rate_item_4,
                rate_item_5: req.body.rate_item_5,
            }
        }, function(err, result) {
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: result
            });
        });
    });
}