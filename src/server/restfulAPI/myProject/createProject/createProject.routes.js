var User = require('../../models/user');
var Project = require('../../models/project');
var ProjectFinancialResult = require('../../models/projectFinancialResult');

var moment = require('moment');

module.exports = function (app) {
    'use strict';
// application -------------------------------------------------------------

// ----- define routes

    app.get(global.apiUrl.get_all_users, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, getAllUsers");
        User.find(
            {
                workStatus:true
            },
            {
                password: 0
            },
            function (err, users) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_all_users");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(users);
                }
            });
    });

    app.get(global.apiUrl.get_all_resign_users, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get_all_resign_users");
        User.find(
            {
                workStatus: false
            },
            {
                password: 0
            },
            function (err, users) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_all_resign_users");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(users);
                }
            });
    });

    app.get(global.apiUrl.get_all_users_with_unregister, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, getAllUsersWithUnRegister");
        User.find(
            {},
            {
                machineDID: 0,
                residualRestHour: 0,
                isSetResidualRestHour: 0,
                feature_official_doc: 0,
                before108Kpi: 0,
                cjMail: 0,
                password: 0
            },
            function (err, users) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_all_users_with_unregister");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                    return;
                } else {
                    res.json(users);
                    return;
                }
            });
    });

    app.get(global.apiUrl.get_all_techs, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "AP, getAllTechs");
        User.find(
            {
                roleType: 1, // 技師
                workStatus: true
            },
            {
                password: 0
            },
            function (err, techs) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_all_techs");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(techs);
                }
            })
    });

    app.get(global.apiUrl.get_all_managers, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, getAllManagers");
        User.find(
            {
                roleType: 2, // 技師
                workStatus: true
            },
            {
                password: 0
            },
            function (err, managers) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_all_managers");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(managers);
                }
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
                    isPrjClose: false,
                    prjNumber: req.body.prjNumber,
                    prjName: req.body.prjName,
                    prjSubNumber: req.body.prjSubNumber,
                    prjSubName: req.body.prjSubName,
                },
                function (err, project) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_create");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.send(err);
                    } else {
                        console.log(global.timeFormat(new Date()) + global.log.i + "create Project= " +
                            JSON.stringify(req.body));
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                        });
                    }
                });
        } catch (error) {
            console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_create");
            console.log(req.body);
            console.log(" ***** ERROR ***** ");
            console.log(error);
            res.status(400).send({
                code: 400,
                error: global.status._400,
            });
        }

    });

    // Project Transfer
    app.post(global.apiUrl.post_project_transfer, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, transfer project");
        try {
            Project.create(
                {
                    branch: req.body.branch,
                    year: String(req.body.year),
                    code: String(req.body.code),
                    type: req.body.type,
                    mainName: req.body.mainName,
                    managerID: req.body.managerID,
                    prjCode: req.body.prjCode,
                    technician: req.body.technician,
                    enable: true,
                    isPrjClose: false,
                    prjNumber: req.body.prjNumber,
                    prjName: req.body.prjName,
                    prjSubNumber: req.body.prjSubNumber,
                    prjSubName: req.body.prjSubName,
                },
                function (err, project) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_transfer");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.send(err);
                    } else {

                        Project.update({
                            _id: req.body.prjA,
                        }, {
                            $set: {
                                combinedID: project._id,
                                enable: false,
                                isCombined: true,
                            }
                        }, function (err) {
                            if (err) {
                                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_transfer");
                                console.log(req.body);
                                console.log(" ***** ERROR ***** ");
                                console.log(err);
                                res.send(err);
                            } else {
                                console.log("update A Done");
                            }
                        })

                        console.log(global.timeFormat(new Date()) + global.log.i + "API, transfer Project done: " +
                            JSON.stringify(req.body));
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                        });
                    }
                });

        } catch (error) {
            console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_transfer");
            console.log(req.body);
            console.log(" ***** ERROR ***** ");
            console.log(error);
            res.status(400).send({
                code: 400,
                error: global.status._400,
            });
        }

    });

    // projectCombine
    app.post(global.apiUrl.post_project_combine, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, combine project");
        try {
            Project.create(
                {
                    branch: req.body.branch,
                    year: String(req.body.year),
                    code: String(req.body.code),
                    type: req.body.type,
                    mainName: req.body.mainName,
                    managerID: req.body.managerID,
                    prjCode: req.body.prjCode,
                    technician: req.body.technician,
                    enable: true,
                    isPrjClose: false,
                    prjNumber: req.body.prjNumber,
                    prjName: req.body.prjName,
                    prjSubNumber: req.body.prjSubNumber,
                    prjSubName: req.body.prjSubName,
                },
                function (err, project) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_combine");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.send(err);
                    } else {

                        Project.update({
                            _id: req.body.prjA,
                        }, {
                            $set: {
                                combinedID: project._id,
                                enable: false,
                                isCombined: true,
                            }
                        }, function (err) {
                            if (err) {
                                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_combine");
                                console.log(req.body);
                                console.log(" ***** ERROR ***** ");
                                console.log(err);
                                res.send(err);
                            } else {
                                console.log("update A Done");
                            }
                        })

                        Project.update({
                            _id: req.body.prjB,
                        }, {
                            $set: {
                                combinedID: project._id,
                                enable: false,
                                isCombined: true,
                            }
                        }, function (err) {
                            if (err) {
                                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_combine");
                                console.log(req.body);
                                console.log(" ***** ERROR ***** ");
                                console.log(err);
                                res.send(err);
                            } else {
                                console.log("update B Done");
                            }
                        })


                        console.log(global.timeFormat(new Date()) + global.log.i + "API, combine Project done: " +
                            JSON.stringify(req.body));
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                        });
                    }
                });

        } catch (error) {
            console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_combine");
            console.log(req.body);
            console.log(" ***** ERROR ***** ");
            console.log(error);
            res.status(400).send({
                code: 400,
                error: global.status._400,
            });
        }

    });

    // include disable, closed prj
    app.get(global.apiUrl.get_project_find_all, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get projects");
        Project.find(function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, get_project_find_all");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    });

    // only include enable prj
    app.get(global.apiUrl.get_project_find_all_enable, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get projects");
        Project.find(
            {
                enable: true,
                // isPrjClose: false,
            },
            function (err, projects) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_project_find_all_enable");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(projects);
                }
        })
    });

    // only include enable prj
    app.get(global.apiUrl.get_project_find_all_closed, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get_project_find_all_closed");

        ProjectFinancialResult.aggregate([
            {
                $addFields: {
                    "_prjDIDObj": {
                        $toObjectId: "$prjDID"
                    },
                }
            },
            {
                $lookup: {
                    from: "projects", // 年跟月的屬性
                    localField: "_prjDIDObj",
                    foreignField: "_id",
                    as: "_prjInfo"
                }
            },

            {
                $unwind: "$_prjInfo",
            },

            {
                $match: {
                    isPrjClose: true
                }
            },
        ], function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, get_project_find_all_closed");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    });

    app.get(global.apiUrl.get_project_find_all_by_group, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, find all project by group");
        Project.aggregate([
            {
                $match: {
                    branch: "C",
                },
            },
            {
                $group: {
                    _id: '$mainName',  //$region is the column name in collection
                    mainName: {$first: '$mainName'},
                    code: {$first: '$code'},
                    type: {$first: '$type'},
                    prjCode: {$first: '$prjCode'},
                    year: {$first: '$year'},
                    branch: {$first: '$branch'},
                }
            }
        ], function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, get_project_find_all_by_group");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    });

    app.post(global.apiUrl.post_project_find_by_name, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, find prj by name");
        Project.findOne({
            mainName: req.body.name
        }, function (err, oneProject) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_find_by_name");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(oneProject);
            }
        })
    });

    app.post(global.apiUrl.post_project_find_by_code, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, find prj by code");
        Project.findOne({
            prjCode: req.body.prjCode
        }, function (err, oneProject) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_find_by_code");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(oneProject);
            }
        })
    });

    app.post(global.apiUrl.post_project_find_group_list, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_find_group_list");
        Project.find({
            year: req.body.year,
            code: req.body.code,
        }, function (err, oneProject) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_find_group_list");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(oneProject);
            }
        })
    });

    app.post(global.apiUrl.post_project_find_related_combined_array, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_find_related_combined_array");
        var projectsArray = [];
        projectsArray.push(req.body.rootPrjDID)
        var promise = findPrj(req.body.rootPrjDID, projectsArray)

        promise.then((response) => {
            console.log(" $$$ success $$$ ");
            console.log(response);
            res.json(response);
        }, (fail) => {
        })
    });

    function findPrj(parentPrjDID, projectsArray) {
        return new Promise(function(resolve, reject) {
            // console.log(" Promise -- parentPrjDID:> " + parentPrjDID)
            // console.log(projectsArray)
            Project.find({
                combinedID: parentPrjDID
            }, function (err, projects) {
                // console.log(" --- projects --- ");
                // console.log(projects);
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "function, findPrj");
                    console.log(parentPrjDID);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                }
                // console.log("projects.length:> " + projects.length)
                if (projects.length > 0) {

                    var promiseArray = []

                    for (var index = 0; index < projects.length; index ++) {
                        // console.log("find prj:> " + projects[index]._id + ", prjCode:> " + projects[index].prjCode)
                        projectsArray.push(projects[index]._id)
                        // console.log(projectsArray)
                        var ppromise = findPrj(projects[index]._id, projectsArray)
                        promiseArray.push(ppromise)
                    }

                    Promise.all(promiseArray).then((success)=> {
                        // console.log(" == success == ");
                        // console.log(success);
                        resolve(projectsArray);
                    })
                } else {
                    resolve(projectsArray);
                }

            })
        })
    }

    app.get(global.apiUrl.get_project_find_by_code_distinct, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get projects by name distinct.");
        Project.find({
            year: moment().format('YYYY') - 1911,
        }).distinct('code', function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, get_project_find_by_code_distinct");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    });


    app.post(global.apiUrl.get_project_find_by_prjid_array, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get_project_find_by_prjid_array");
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
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_project_find_by_prjid_array");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: projects,
                    });
                }
            })
    });

    // 找總案代碼下的專案總數
    app.post(global.apiUrl.post_project_number_find_by_prj_number_distinct, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_number_find_by_prj_number_distinct");

        Project.find({
            year: req.body.year,
            code: req.body.code,
        }).distinct('prjNumber', function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_number_find_by_prj_number_distinct");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    })

    // 找專案代碼下的子案總數
    app.post(global.apiUrl.post_project_sub_number_find_by_number_distinct, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_sub_number_find_by_number_distinct");

        Project.find({
            year: req.body.year,
            code: req.body.code,
            prjNumber: req.body.prjNumber
        }).distinct('prjSubNumber', function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_sub_number_find_by_number_distinct");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    })

    // 用總案代碼找專案，用專案代碼分類
    app.post(global.apiUrl.post_project_number_find_by_code_group_by_number, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_number_find_by_code_group_by_number");

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
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_number_find_by_code_group_by_number");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(projects);
                }
            });
    })

    // 用專案代碼找子案
    app.post(global.apiUrl.post_project_sub_number_find_by_number, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_sub_number_find_by_number");

        var query = [
            {
                $match: {
                    year: req.body.year,
                    code: req.body.code,
                    prjNumber: req.body.prjNumber
                }
            },
            {
                $group: {
                    _id: '$prjSubNumber',  //$region is the column name in collection
                    prjSubName: {$first: '$prjSubName'},
                    prjSubNumber: {$first: '$prjSubNumber'},
                }
            }
        ];
        Project.aggregate(query)
            .sort({
                prjSubNumber: 1,
            })
            .exec(function (err, projects) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_sub_number_find_by_number");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(projects);
                }
            });

    })

    // 用子案代碼找類型
    app.post(global.apiUrl.post_project_type_find_by_sub_number, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_type_find_by_sub_number");

        Project.find({
            year: req.body.year,
            code: req.body.code,
            prjNumber: req.body.prjNumber,
            prjSubNumber: req.body.prjSubNumber,
            type: req.body.type,
        }, function (err, projects) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_project_type_find_by_sub_number");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.json(projects);
            }
        })
    })


    app.post(global.apiUrl.post_project_find_by_request, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_project_find_by_year");
        var keyArray = Object.keys(req.body);
        var findRequest = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "findRequest.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }
        console.log("--- findRequest ---");
        console.log(findRequest);
        try {
            Project.find(findRequest, function (err, items) {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items,
                });
            });
        } catch (err) {
            if (err) {
                res.send(err);
            }
        }
    });
}