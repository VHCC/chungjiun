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

    app.get(global.apiUrl.get_all_managers, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "AP, getAllManagers");
        User.find(
            {
                roleType: 2 // 技師
            },
            {
                password: 0
            },
            function (err, managers) {
                if (err) {
                    res.send(err);
                }
                res.json(managers);
            })
    })

    app.post(global.apiUrl.post_project_create, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, create project");
        console.log(req.body);
        try {
            Project.create(
                {
                    branch: req.body.branch,
                    year: String(req.body.year),
                    code: String(req.body.code),
                    type: req.body.type,
                    mainName: req.body.mainName,
                    // majorID: req.body.majorID,
                    managerID: req.body.managerID,
                    prjCode: req.body.prjCode,
                    technician: req.body.technician,
                    // endDate: req.body.prjEndDate,
                    enable: true,
                    prjNumber: req.body.prjNumber,
                    prjName: req.body.prjName,
                    prjSubNumber: req.body.prjSubNumber,
                    prjSubName: req.body.prjSubName,
                },
                function (err, project) {
                    if (err) {
                        res.send(err);
                    }
                    console.log(global.timeFormat(new Date()) + global.log.i + "create Project= " +
                        JSON.stringify(req.body));
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,

                    });
                });
        } catch (error) {
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
                    mainName: {$first: '$mainName'},
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
            mainName: req.body.name
        }, function (err, prj) {
            if (err) {
                res.send(err);
            }
            res.json(prj);
        })
    });

    app.post(global.apiUrl.post_project_find_by_code, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, find prj by code");
        console.log(req.body.code)
        Project.findOne({
            code: req.body.code
        }, function (err, prj) {
            console.log(prj)
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

    app.post(global.apiUrl.get_project_find_by_prjid_array, function (req, res) {
        var prjCount = req.body.prjIDArray.length;
        var findData = []
        for (var index = 0; index < prjCount; index++) {
            var target = {
                _id: req.body.prjIDArray[index],
            }
            findData.push(target);
        }
        Project.find(
            {
                $or: findData,
            }, function (err, projects) {
                if (err) {
                    res.send(err);
                }
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: projects,
                });
            })
    });

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

    app.post(global.apiUrl.post_project_number_find_by_code_distinct, function (req, res) {
        Project.find({
            code: req.body.code,
        }).distinct('prjNumber', function (err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    })

    app.post(global.apiUrl.post_project_number_find_by_code, function (req, res) {
        Project.find({
            code: req.body.code
        }, function (err, prj) {
            if (err) {
                res.send(err);
            }
            res.json(prj);
        })
    })

}