var User = require('../../models/user');
var Project = require('../../models/project');

module.exports = function (app) {
    'use strict';
// application -------------------------------------------------------------

// ----- define routes

    //
    app.post(global.apiUrl.post_project_all_related_to_user, function (req, res) {
        var findData = [];
        findData.push({managerID: req.body.relatedID});
        findData.push({majorID: req.body.relatedID});
        findData.push({workers: req.body.relatedID});
        Project.find({
            // workers: req.body.relatedID,
            $or: findData,
        }, function (err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    })

    // 工時表，經理審查
    app.post(global.apiUrl.post_project_all_related_to_manager, function (req, res) {
        var findData = [];
        findData.push({managerID: req.body.relatedID});
        Project.find({
            // workers: req.body.relatedID,
            $or: findData,
        }, function (err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    })

    //TODO
    // 工時表，行政總管審查

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
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
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
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        })
    })

}