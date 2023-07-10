var ProjectContract = require('../../models/projectContract');

var moment = require('moment');

module.exports = function (app) {
    'use strict';

    app.get(global._001_apiUrl._001_post_project_contract_find_all, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_contract_find_all");
        ProjectContract.find(
            {},
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_contract_find_all");
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

    app.post(global._001_apiUrl._001_post_project_contract_create, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_contract_create");
        ProjectContract.create(
            {
                instituteDID: req.body.instituteDID,
                name: req.body.name,
                code: req.body.code,
                timestamp: moment(new Date()).format("YYYYMMDD_HHmmss"),
                updateTs: moment(new Date()).format("YYYYMMDD_HHmmss"),
            },
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_contract_create");
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

    app.post(global._001_apiUrl._001_post_project_contract_find_by_instituteDID, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_contract_find_by_instituteDID");
        ProjectContract.find(
            {
                instituteDID: req.body.instituteDID,
            },
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_contract_find_by_instituteDID");
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


    // 更新契約
    app.post(global._001_apiUrl._001_post_project_contract_update_one_by_contractDID, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_contract_update_one_by_contractDID");
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

        console.log(updateTarget);
        ProjectContract.updateOne({
            _id: req.body._id,
        }, {
            $set: updateTarget
        }, function (err, results) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_contract_update_one_by_contractDID");
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