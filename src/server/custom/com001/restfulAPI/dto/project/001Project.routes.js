var _001Project = require('../../models/_001project.js');
var User = require('../../../../../restfulAPI/models/user.js');

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

    app.post(global._001_apiUrl._001_post_project_find_all_case_with_multi_contract, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_find_all_case_with_multi_contract");
        console.log(req.body);

        var findData = [];
        for (var index = 0; index < req.body.contractDIDs.length; index++) {
            var target = {
                contractDID: req.body.contractDIDs[index],
            }
            findData.push(target);
        }

        _001Project.find(
            {
                // contractDID: req.body.contractDID,
                $or: findData,
            },
            function (err, projects) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_find_all_case_with_multi_contract");
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


    // 更新專案
    app.post(global._001_apiUrl._001_post_project_update_one_by_projectDID, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_update_one_by_projectDID");
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
        _001Project.updateOne({
            _id: req.body._id,
        }, {
            $set: updateTarget
        }, function (err, results) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_update_one_by_projectDID");
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

    // 更新多個專案 from 工程基本資料
    app.post(global._001_apiUrl._001_post_project_update_multi_by_object, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_update_multi_by_object");
        console.log(JSON.stringify(req.body));

        var workCount = 0;

        for (var unitIndex = 0; unitIndex < req.body.units.length; unitIndex++) {
            req.body.units[unitIndex].userUpdateTs = req.body.userUpdateTs;
            var updateTarget = req.body.units[unitIndex];
            var unitId = updateTarget._id;
            delete updateTarget._id;
            delete updateTarget.typeName;
            console.log("-----");
            console.log(updateTarget);
            _001Project.updateOne({
                _id: unitId,
            }, {
                $set: updateTarget
            }, function (err, results) {
                workCount ++;
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_update_multi_by_object");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                    return;
                } else {
                    if (workCount == req.body.units.length) {
                        res.status(200).json(results);
                        return;
                    }
                }
            });
        }
    });


    app.post(global._001_apiUrl._001_post_project_find_all_by_userDID, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_find_all_by_userDID");
        console.log(req.body);

        var findData = [];

        var target = {
            majorID: req.body.userDID,
        }
        findData.push(target);

        var target_v2 = {
            managerID: req.body.userDID,
        }
        findData.push(target_v2);

        console.log(findData);

        _001Project.find(
            {
                $or: findData,
            },
            function (err, projects) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_find_all_by_userDID");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    console.log(projects.length);
                    res.status(200).send(projects);
                }
                return;
            });
    });


    app.post(global._001_apiUrl._001_post_project_find_all_by_depType, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_project_find_all_by_depType");
        console.log(req.body);

        User.find(
            {
                depType: req.body.depType,
            },
            function (err, users) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_all_users");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    var findData = [];
                    for (var index = 0; index < users.length; index++) {
                        var target = {
                            majorID: users[index]._id,
                        }
                        findData.push(target);
                        var target_v2 = {
                            managerID: users[index]._id,
                        }
                        findData.push(target_v2);
                    }

                    console.log(findData);

                    var target = {
                        majorID: req.body.userDID,
                    }
                    findData.push(target);

                    var target_v2 = {
                        managerID: req.body.userDID,
                    }
                    findData.push(target_v2);

                    _001Project.find(
                        {
                            $or: findData
                        },
                        function (err, projects) {
                            if (err) {
                                console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_project_find_all_by_depType");
                                console.log(req.body);
                                console.log(" ***** ERROR ***** ");
                                console.log(err);
                                res.status(500).send(err);
                            } else {
                                res.status(200).send(projects);
                            }
                            return;
                        });
                }
            });


    });



}