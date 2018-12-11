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
        console.log(global.timeFormat(new Date()) + global.log.i + "API, getAllManagers");
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

    app.get(global.apiUrl.get_project_find_all_enable, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get projects");
        Project.find(
            {
                enable: true
            },
            function (err, projects) {
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
                    _id: '$mainName',  //$region is the column name in collection
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
        }, function (err, oneProject) {
            if (err) {
                res.send(err);
            }
            res.json(oneProject);
        })
    });

    app.post(global.apiUrl.post_project_find_by_code, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, find prj by code");
        console.log(req.body.prjCode)
        Project.findOne({
            prjCode: req.body.prjCode
        }, function (err, oneProject) {
            console.log(oneProject)
            if (err) {
                res.send(err);
            }
            res.json(oneProject);
        })
    });

    app.get(global.apiUrl.get_project_find_by_name_distinct, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get projects by name distonct.");
        Project.find().distinct('mainName', function (err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    });


    app.post(global.apiUrl.get_project_find_by_prjid_array, function (req, res) {
        var prjCount = req.body.prjIDArray.length;
        var findData = [];
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

    // 找總案代碼下的專案總數
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

    // 找專案代碼下的子案總數
    app.post(global.apiUrl.post_project_sub_number_find_by_number_distinct, function (req, res) {
        Project.find({
            year: req.body.year,
            code: req.body.code,
            prjNumber: req.body.prjNumber
        }).distinct('prjSubNumber', function (err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    })

    // 用總案代碼找專案，用專案代碼分類
    app.post(global.apiUrl.post_project_number_find_by_code_group_by_number, function (req, res) {
        // Project.aggregate(
        //     [
        //         {
        //             $match: {
        //                 year: req.body.year,
        //                 code: req.body.code
        //             }
        //         },
        //         {
        //             $group: {
        //                 _id: '$prjName',  //$region is the column name in collection
        //                 prjName: {$first: '$prjName'},
        //                 prjNumber: {$first: '$prjNumber'},
        //             }
        //         }
        //     ], function (err, projects) {
        //         if (err) {
        //             res.send(err);
        //         }
        //         res.json(projects);
        //     })
        var query = [
            {
                $match: {
                    year: req.body.year,
                    code: req.body.code
                }
            },
            {
                $group: {
                    _id: '$prjName',  //$region is the column name in collection
                    prjName: {$first: '$prjName'},
                    prjNumber: {$first: '$prjNumber'},
                }
            }
        ];
        Project.aggregate(query)
            .sort({
                prjNumber: 1,
            })
            .exec(function (err, projects) {
                if (err) {
                    res.send(err);
                }
                res.json(projects);
            });
    })

    // 用專案代碼找子案
    app.post(global.apiUrl.post_project_sub_number_find_by_number, function (req, res) {
        Project.find({
            year: req.body.year,
            code: req.body.code,
            prjNumber: req.body.prjNumber
        }, function (err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    })

    // 用子案代碼找類型
    app.post(global.apiUrl.post_project_type_find_by_sub_number, function (req, res) {
        Project.find({
            year: req.body.year,
            code: req.body.code,
            prjNumber: req.body.prjNumber,
            prjSubNumber: req.body.prjSubNumber,
            type: req.body.type,
        }, function (err, projects) {
            if (err) {
                res.send(err);
            }
            res.json(projects);
        })
    })
}