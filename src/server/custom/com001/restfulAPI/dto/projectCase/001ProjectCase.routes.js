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

    app.post(global._001_apiUrl._001_post_project_case_find_one, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_case_find_one");
        ProjectCase.find(
            {
                _id: req.body.caseDID,
            },
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_case_find_one");
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


    // 契約多選
    app.post(global._001_apiUrl._001_post_project_case_find_by_contractDIDMulti_and_instituteDID, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_case_find_by_contractDIDMulti_and_instituteDID");

        var findData = [];
        for (var index = 0; index < req.body.contractDIDs.length; index++) {
            var target = {
                contractDID: req.body.contractDIDs[index],
                instituteDID: req.body.instituteDID
            }
            findData.push(target);
        }

        ProjectCase.find(
            {
                $or: findData,
            },
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_case_find_by_contractDIDMulti_and_instituteDID");
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

    app.post(global._001_apiUrl._001_post_project_case_find_by_caseDIDMulti, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_case_find_by_caseDIDMulti");
        console.log(JSON.stringify(req.body));

        var findData = [];
        for (var index = 0; index < req.body.contractDIDs.length; index++) {
            var target = {
                _id: req.body.contractDIDs[index],
            }
            findData.push(target);
        }

        console.log(findData);
        ProjectCase.find(
            {
                $or: findData,
            },
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_case_find_by_caseDIDMulti");
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


    // 更新工程
    app.post(global._001_apiUrl._001_post_project_case_update_one_by_caseDID, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_case_update_one_by_caseDID");
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
        ProjectCase.updateOne({
            _id: req.body._id,
        }, {
            $set: updateTarget
        }, function (err, results) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_case_update_one_by_caseDID");
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