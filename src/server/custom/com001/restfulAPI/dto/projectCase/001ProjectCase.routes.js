var ProjectCase = require('../../models/projectCase');

var moment = require('moment');

module.exports = function (app) {
    'use strict';

    app.get(global._001_apiUrl._001_post_project_case_find_all, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_case_find_all");
        ProjectCase.find(
            {},
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_case_find_all");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                    return;
                } else {
                    res.status(200).json(results);
                    return;
                }
            });
    });

    app.post(global._001_apiUrl._001_post_project_case_create, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_case_create");
        ProjectCase.create(
            {
                contractDID: req.body.contractDID,
                instituteDID: req.body.instituteDID,
                name: req.body.name,
                code: req.body.code,
                timestamp: moment(new Date()).format("YYYYMMDD_HHmmss"),
                updateTs: moment(new Date()).format("YYYYMMDD_HHmmss"),
            },
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_case_create");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                    return;
                } else {
                    res.status(200).json(results);
                    return;
                }
            });
    });

    app.post(global._001_apiUrl._001_post_project_case_find_by_contractDID_and_instituteDID, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_case_find_by_contractDID_and_instituteDID");
        ProjectCase.find(
            {
                contractDID: req.body.contractDID,
                instituteDID: req.body.instituteDID,
            },
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_case_find_by_contractDID_and_instituteDID");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                    return;
                } else {
                    res.status(200).json(results);
                    return;
                }
            });
    });

}