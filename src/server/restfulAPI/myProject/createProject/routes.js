var User = require('../../models/user');
var Project = require('../../models/project');

module.exports = function (app) {
    'use strict';
// application -------------------------------------------------------------

// ----- define routes
    // create

    app.get(global.apiUrl.get_all_users, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, getAllUsers");
        User.find(
            {},
            {
                password: 0
            },
            function (err, users) {
                if (err) {
                    res.send(err);
                }
                res.json(users);
            });
    });

    app.get(global.apiUrl.get_all_techs, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "AP, getAllTechs");
        User.find(
            {
                roleType: 1 // 技師
            },
            {
                password: 0
            },
            function (err, techs) {
                if (err) {
                    res.send(err);
                }
                res.json(techs);
            })
    });

    app.post(global.apiUrl.post_project_create, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, create project");
        try {
            Project.create(
                {
                    year: String(req.body.year),
                    code: String(req.body.prj.code),
                    type: req.body.prj.type.selected.type,
                    name: req.body.prj.name.new,
                    prjCode:
                    String(req.body.year) +
                    String(req.body.prj.code) +
                    req.body.prj.type.selected.type +
                    req.body.prj.footCode,
                    technician: req.body.techs.selected,
                    enable: true,
                },
                function (err, project) {
                    if (err) {
                        res.send(err);
                    }
                    console.log(global.timeFormat(new Date()) + global.log.i + "create Rpeject= " +
                        JSON.stringify(req.body));
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                    });
                });
        } catch (error){
            console.log("ERROR");
            res.status(400).send({
                code: 400,
                error: global.status._400,
            });
        }

    });

    app.get(global.apiUrl.get_project_find_all, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get projects");
        Project.find(function (err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    });

    app.get(global.apiUrl.get_project_find_all_by_group, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, find all project by group");
        Project.aggregate([
            {
                $group: {
                    _id: '$name',  //$region is the column name in collection
                    name: {$first: '$name'},
                    code: {$first: '$code'},
                    type: {$first: '$type'},
                    prjCode: {$first: '$prjCode'},
                }
            }
        ], function (err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    });

    app.post(global.apiUrl.post_project_find_by_name, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, find prj by name");
        Project.findOne({
                name: req.body.name
            },
            function (err, prj) {
                if (err) {
                    res.send(err);
                }
                res.json(prj);
            })
    });

    app.get(global.apiUrl.get_project_find_by_name_distinct, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get projects by name distonct.");
        Project.find().distinct('name', function (err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    });

    app.post(global.apiUrl.post_project_foot_code, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post prj foot code.");
        Project.find(
            {
                year: req.body.year,
                code: req.body.code,
                type: req.body.type,
            }, function (err, projects) {
                if (err) {
                    res.send(err);
                }
                res.json(projects);
            })
    });

}