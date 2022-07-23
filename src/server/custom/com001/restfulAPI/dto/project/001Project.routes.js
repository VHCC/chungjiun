var _001Project = require('../../models/_001project.js');

var moment = require('moment');

module.exports = function (app) {
    'use strict';

    app.post(global._001_apiUrl._001_post_project_create, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_create");
        console.log(req.body);
        try {
            _001Project.create(
                {
                    branch: req.body.branch,
                    contractDID: req.body.contractDID,
                    instituteDID: req.body.instituteDID,
                    caseDID: req.body.caseDID,
                    code: req.body.code,
                    type: req.body.type,
                    managerID: req.body.managerID,
                    technician: req.body.technician,
                    timestamp: moment(new Date()).format("YYYYMMDD_HHmmss"),
                    updateTs: moment(new Date()).format("YYYYMMDD_HHmmss"),
                },
                function (err, project) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_create");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.status(500).send(err);
                    } else {
                        console.log(global.timeFormat(new Date()) + global.log.i + "create Project= " +
                            JSON.stringify(req.body));
                        res.status(200).send(project);
                    }
                    return;
                });
        } catch (error) {
            console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_create");
            console.log(req.body);
            console.log(" ***** ERROR ***** ");
            console.log(error);
            res.status(500).send(error);
            return;
        }
    });

    app.post(global._001_apiUrl._001_post_project_find_all, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_find_all");
        console.log(req.body);
        _001Project.find(
            {
            },
            function (err, projects) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_find_all");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send(projects);
                }
                return;
            });
    });

    app.post(global._001_apiUrl._001_post_project_find_one_case_with_all_type, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_find_one_case_with_all_type");
        console.log(req.body);
        _001Project.find(
            {
                caseDID: req.body.caseDID
            },
            function (err, projects) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_find_one_case_with_all_type");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send(projects);
                }
                return;
            });
    });

    app.post(global._001_apiUrl._001_post_project_find_one_case_with_specific_type, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_find_one_case_with_specific_type");
        console.log(req.body);
        _001Project.find(
            {
                caseDID: req.body.caseDID,
                type: req.body.type,
            },
            function (err, projects) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_find_one_case_with_specific_type");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send(projects);
                }
                return;
            });
    });

    app.post(global._001_apiUrl._001_post_project_find_all_case_with_one_contract, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_find_all_case_with_one_contract");
        console.log(req.body);
        _001Project.find(
            {
                contractDID: req.body.contractDID,
            },
            function (err, projects) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_find_all_case_with_one_contract");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send(projects);
                }
                return;
            });
    });

    app.post(global._001_apiUrl._001_post_project_find_all_case_with_specific_type_specific_contract, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_find_all_case_with_specific_type_specific_contract");
        console.log(req.body);
        _001Project.find(
            {
                contractDID: req.body.contractDID,
                type: req.body.type,
            },
            function (err, projects) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_find_all_case_with_specific_type_specific_contract");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send(projects);
                }
                return;
            });
    });



}