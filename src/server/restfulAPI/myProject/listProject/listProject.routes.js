var User = require('../../models/user');
var Project = require('../../models/project');

module.exports = function (app) {
    'use strict';
// application -------------------------------------------------------------

// ----- define routes

    app.post(global.apiUrl.post_project_all_related_to_user, function (req, res) {
        var findDataOr = [];
        findDataOr.push({managerID: req.body.relatedID});
        findDataOr.push({majorID: req.body.relatedID});
        findDataOr.push({workers: req.body.relatedID});
        var findDataAnd = [];
        findDataAnd.push({enable: true});
        findDataAnd.push({isPrjClose: false});
        Project.find({
            // enable: true,
            $or: findDataOr,
            $and: findDataAnd
        }, function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_all_related_to_user");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    })

    // by user
    app.post(global.apiUrl.post_project_all_related_to_user_with_disabled, function (req, res) {
        var findData = [];
        findData.push({managerID: req.body.relatedID});
        findData.push({majorID: req.body.relatedID});
        findData.push({workers: req.body.relatedID});
        Project.find({
            // workers: req.body.relatedID,
            $or: findData,
        }, function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_all_related_to_user_with_disabled");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    })

    // by user
    app.post(global.apiUrl.post_project_all_related_to_major_with_disabled, function (req, res) {
        var findData = [];
        // findData.push({managerID: req.body.relatedID});
        findData.push({majorID: req.body.relatedID});
        // findData.push({workers: req.body.relatedID});
        Project.find({
            // workers: req.body.relatedID,
            $or: findData,
        }, function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_all_related_to_major_with_disabled");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    })

    // 工時表，經理審查
    app.post(global.apiUrl.post_project_all_related_to_manager, function (req, res) {
        var findData = [];
        findData.push({managerID: req.body.relatedID});
        // var findDataAnd = [];
        // findDataAnd.push({enable: true});
        Project.find({
            // workers: req.body.relatedID,
            $or: findData,
            // $and: findDataAnd,
        }, function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_all_related_to_manager");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    })

    // 更新總案名
    app.post(global.apiUrl.post_project_update_main_name, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, update_main_name");
        Project.update({
            _id: req.body.prjID,
        }, {
            $set: {
                mainName: req.body.mainName,
            }
        }, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_update_main_name");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })

    // 更新專案名
    app.post(global.apiUrl.post_project_update_prj_name, function (req, res) {
        Project.update({
            _id: req.body.prjID,
        }, {
            $set: {
                prjName: req.body.prjName,
            }
        }, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_update_prj_name");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })

    // 更新子案名
    app.post(global.apiUrl.post_project_update_prj_sub_name, function (req, res) {
        Project.update({
            _id: req.body.prjID,
        }, {
            $set: {
                prjSubName: req.body.prjSubName,
            }
        }, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_update_prj_sub_name");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })

    // 更新經理
    app.post(global.apiUrl.post_project_update_manager_id, function (req, res) {
        Project.update({
            _id: req.body.prjID,
        }, {
            $set: {
                managerID: req.body.managerID,
            }
        }, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_update_manager_id");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })

    // 更新承辦人員
    app.post(global.apiUrl.post_project_update_major_id, function (req, res) {
        Project.update({
            _id: req.body.prjID,
        }, {
            $set: {
                majorID: req.body.majorID,
            }
        }, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_update_major_id");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })

    // 更新協辦
    app.post(global.apiUrl.post_project_update_workers, function (req, res) {
        Project.update({
            _id: req.body.prjID,
        }, {
            $set: {
                workers: req.body.workers,
            }
        }, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_update_workers");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })

    // 更新專案狀態
    app.post(global.apiUrl.post_project_update_status, function (req, res) {
        Project.update({
            _id: req.body.prjID,
        }, {
            $set: {
                enable: req.body.enable,
            }
        }, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_update_status");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })


}