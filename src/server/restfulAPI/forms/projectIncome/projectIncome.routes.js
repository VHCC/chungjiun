var ProjectIncome = require('../../models/projectIncome');
var moment = require('moment');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_project_income_create, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_income_create");

        console.log(JSON.stringify(req.body));
        ProjectIncome.create({
            year: req.body.year,
            month: req.body.month,
            prjDID: req.body.prjDID,
            timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
        }, function (err, results) {
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
    app.post(global.apiUrl.post_project_income_find, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_income_find");

        console.log(JSON.stringify(req.body));
        ProjectIncome.find({
            prjDID: req.body.prjDID,
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
    app.post(global.apiUrl.post_project_income_update, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_income_update");

        console.log(JSON.stringify(req.body));

        var keyArray = Object.keys(req.body);
        var updateTarget = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "updateTarget.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }

        console.log(updateTarget)

        ProjectIncome.update({
            _id: req.body.itemID,
        }, {
            $set: updateTarget
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
    app.post(global.apiUrl.post_project_income_remove, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_income_remove");
        console.log(JSON.stringify(req.body));
        ProjectIncome.remove({
            _id: req.body._id,
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


}