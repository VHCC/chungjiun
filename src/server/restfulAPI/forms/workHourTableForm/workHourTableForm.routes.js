var WorkHourForm = require('../../models/workHourForm');
var WorkHourTable = require('../../models/workHourTableForm');
var Project = require('../../models/project');
var Temp = require('../../models/temp');
// var NotificationMsgItem = require('../../models/notificationMsgItem');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_work_hour_create_table, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_hour_create_table");
        // console.log(req.body);
        // 刪除既有工時表
        WorkHourForm.remove({
            creatorDID: req.body.creatorDID,
            create_formDate: req.body.create_formDate,
            year: req.body.year,
            month: req.body.month,
        }, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_create_table");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
            }
        })
        // console.log(req.body.oldTables);
        if (req.body.oldTables.hasOwnProperty('tableIDArray')) {
            var findData = []
            for (var index = 0; index < req.body.oldTables.tableIDArray.length; index++) {
                var target = {
                    _id: req.body.oldTables.tableIDArray[index],
                    creatorDID: req.body.creatorDID,
                    create_formDate: req.body.create_formDate,
                }
                findData.push(target);
            };
            // console.log(findData);
            // 刪除既有 工時表格
            WorkHourTable.remove(
                {
                    $or: findData,
                }, function (err) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_create_table");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                    }
                })
        }

        var formTable = [];
        var resIndex = 0;

        console.log("req.body.formTables= " + req.body.formTables.length);
        for (var index = 0; index < req.body.formTables.length; index++) {
            try {
                WorkHourTable.create({
                    creatorDID: req.body.formTables[index].creatorDID,
                    prjDID: req.body.formTables[index].prjDID,
                    create_formDate: req.body.create_formDate,
                    //MON
                    mon_hour: req.body.formTables[index].mon_hour,
                    mon_memo: req.body.formTables[index].mon_memo,
                    mon_hour_add: req.body.formTables[index].mon_hour_add,
                    mon_memo_add: req.body.formTables[index].mon_memo_add,
                    //TUE
                    tue_hour: req.body.formTables[index].tue_hour,
                    tue_memo: req.body.formTables[index].tue_memo,
                    tue_hour_add: req.body.formTables[index].tue_hour_add,
                    tue_memo_add: req.body.formTables[index].tue_memo_add,
                    //WES
                    wes_hour: req.body.formTables[index].wes_hour,
                    wes_memo: req.body.formTables[index].wes_memo,
                    wes_hour_add: req.body.formTables[index].wes_hour_add,
                    wes_memo_add: req.body.formTables[index].wes_memo_add,
                    //THU
                    thu_hour: req.body.formTables[index].thu_hour,
                    thu_memo: req.body.formTables[index].thu_memo,
                    thu_hour_add: req.body.formTables[index].thu_hour_add,
                    thu_memo_add: req.body.formTables[index].thu_memo_add,
                    //FRI
                    fri_hour: req.body.formTables[index].fri_hour,
                    fri_memo: req.body.formTables[index].fri_memo,
                    fri_hour_add: req.body.formTables[index].fri_hour_add,
                    fri_memo_add: req.body.formTables[index].fri_memo_add,
                    //SAT
                    sat_hour: req.body.formTables[index].sat_hour,
                    sat_memo: req.body.formTables[index].sat_memo,
                    sat_hour_add: req.body.formTables[index].sat_hour_add,
                    sat_memo_add: req.body.formTables[index].sat_memo_add,
                    //SUN
                    sun_hour: req.body.formTables[index].sun_hour,
                    sun_memo: req.body.formTables[index].sun_memo,
                    sun_hour_add: req.body.formTables[index].sun_hour_add,
                    sun_memo_add: req.body.formTables[index].sun_memo_add,
                    //RIGHT
                    isSendReview: req.body.formTables[index].isSendReview,
                    isManagerCheck: req.body.formTables[index].isManagerCheck,
                    isExecutiveCheck: req.body.formTables[index].isExecutiveCheck,

                    // Reject
                    isManagerReject: req.body.formTables[index].isManagerReject,
                    managerReject_memo: req.body.formTables[index].managerReject_memo,

                    isExecutiveReject: req.body.formTables[index].isExecutiveReject,
                    executiveReject_memo: req.body.formTables[index].executiveReject_memo,

                    userMonthSalary: req.body.formTables[index].userMonthSalary,

                }, function (err, workTable) {
                    resIndex++;
                    // workHourForm formTables 的參數

                    if (workTable) {
                        var tableItem = {
                            tableID: workTable._id,
                            prjDID: workTable.prjDID,
                        }
                        formTable.push(tableItem);
                    }

                    if (resIndex === req.body.formTables.length) {
                        console.log(formTable);
                        WorkHourForm.create({
                            year: req.body.year,
                            month: req.body.month,
                            creatorDID: req.body.creatorDID,
                            create_formDate: req.body.create_formDate,
                            formTables: formTable,
                        }, function (err) {
                            if (err) {
                                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_create_table");
                                console.log(req.body);
                                console.log(" ***** ERROR ***** ");
                                console.log(err);
                                res.send(err);
                            } else {
                                res.status(200).send({
                                    code: 200,
                                    error: global.status._200,
                                    payload: formTable,
                                });
                            }
                        });
                    }
                });
            } catch (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_create_table");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                }
            }
        }

    });

    //get form by date, creator DID
    app.post(global.apiUrl.post_work_hour_get, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_hour_get");
        var query = {
            creatorDID: req.body.creatorDID,
            create_formDate: req.body.create_formDate,
        }

        console.log(query);
        var d = new Date(req.body.create_formDate);
        if (d.getMonth() == 11) {
            WorkHourForm.find(query)
                .sort({
                    month: -1,
                })
                .exec(function (err, workHourForms) {
                    if (err) {
                        res.send(err);
                    }
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: workHourForms,
                    });
                });
        } else {
            WorkHourForm.find(query)
                .sort({
                    month: 1,
                })
                .exec(function (err, workHourForms) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_get");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.send(err);
                    } else {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            payload: workHourForms,
                        });
                    }
                });
        }


    });

    // 多組creator, create_formDate
    app.post(global.apiUrl.post_work_hour_multiple_get, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_hour_multiple_get");
        var findData = []
        for (var index = 0; index < req.body.relatedMembers.length; index++) {
            var target = {
                creatorDID: req.body.relatedMembers[index],
                create_formDate: req.body.create_formDate,
            }
            findData.push(target);
        }

        var query = {
            $or: findData,
        }

        var d = new Date(req.body.create_formDate);
        if (d.getMonth() == 11) {
            WorkHourForm.find(query)
                .sort({
                    month: -1,
                })
                .exec(function (err, workHourForms) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_multiple_get");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.send(err);
                    } else {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            payload: workHourForms,
                        });
                    }
                });
        } else {
            WorkHourForm.find(query)
                .sort({
                    month: 1,
                })
                .exec(function (err, workHourForms) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_multiple_get");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.send(err);
                    } else {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            payload: workHourForms,
                        });
                    }
                });
        }

    })

    // get forms for manager
    app.post(global.apiUrl.post_work_hour_get_for_manager, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_hour_get_for_manager");

        var relatedProjects = [];
        var prjCount = 0;
        Project.find(
            {
                managerID: req.body.managerID,
            }, function (err, projects) {
                relatedProjects = projects;
                prjCount = projects.length;
                var findData = [];
                var prjIDArray = [];
                for (var index = 0; index < prjCount; index++) {
                    var target = {
                        creatorDID: req.body.creatorDID,
                        create_formDate: req.body.create_formDate,
                    }
                    prjIDArray.push(relatedProjects[index]._id)
                    findData.push(target);
                }


                WorkHourForm.find({
                    // $or: findData,
                    creatorDID: req.body.creatorDID,
                    create_formDate: req.body.create_formDate,
                }, function (err, forms) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_get_for_manager");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.send(err);
                    } else {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            payload: forms,
                            prjIDArray: prjIDArray,
                        });
                    }
                });

            });

    })

    // find table by tableid array
    app.post(global.apiUrl.post_work_hour_table_find_by_tableid_array, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_hour_table_find_by_tableid_array");

        var tableCount = req.body.tableIDArray.length;
        var findData = []
        for (var index = 0; index < tableCount; index++) {
            var target = {
                _id: req.body.tableIDArray[index],
            }
            findData.push(target);
        }

        var query = {};
        query.$or = findData;
        if (req.body.isFindSendReview !== null) {
            query.isSendReview = req.body.isFindSendReview;
        }
        if (req.body.isFindManagerCheck !== null) {
            query.isManagerCheck = req.body.isFindManagerCheck;
        }
        if (req.body.isFindExecutiveCheck !== null) {
            query.isExecutiveCheck = req.body.isFindExecutiveCheck;
        }
        if (req.body.isFindManagerReject !== null) {
            query.isManagerReject = req.body.isFindManagerReject;
        }
        if (req.body.isFindExecutiveReject !== null) {
            query.isExecutiveReject = req.body.isFindExecutiveReject;
        }

        // console.log(query);

        WorkHourTable.find(query, function (err, tables) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_table_find_by_tableid_array");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: tables,
                    creatorDID: req.body.creatorDID
                });
            }
        });
    })

    // update table form send review
    app.post(global.apiUrl.post_work_hour_table_update_send_review, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_hour_table_update_send_review");


        WorkHourTable.update({
            _id: req.body.tableID,
        }, {
            $set: {
                isSendReview: true,
            }
        }, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_table_update_send_review");
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

    // update all table ***
    app.post(global.apiUrl.post_work_hour_table_total_update_send_review, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_hour_table_total_update_send_review");
        console.log(req.body);
        for (var index = 0; index < req.body.tableArray.length; index++) {
            WorkHourTable.update({
                _id: req.body.tableArray[index],
            }, {
                $set: {
                    isSendReview: true,
                }
            }, function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_table_total_update_send_review");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                }
            })

        }
        res.status(200).send({
            code: 200,
            error: global.status._200,
        })

    })

    // update table one item
    app.post(global.apiUrl.post_work_hour_table_update, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_hour_table_update");

        // console.log(req.body);
        var keyArray = Object.keys(req.body);
        var query = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "query.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }
        console.log(query);

        // var setQuery = {};

        WorkHourTable.update({
            _id: req.body.tableID,
        }, {
            $set: query
        }, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_table_update");
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

    // update table array
    app.post(global.apiUrl.post_work_hour_table_update_array, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_hour_table_update");
        var keyArray = Object.keys(req.body);
        var query = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "query.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }
        console.log(query);

        for (var index = 0; index < req.body.tableIDs.length; index++) {
            WorkHourTable.update({
                _id: req.body.tableIDs[index],
            }, {
                $set: query
            }, function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_work_hour_table_update");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                }
            })
        }
        res.status(200).send({
            code: 200,
            error: global.status._200,
        })
    })

    app.post(global.apiUrl.insert_work_hour_table_temp, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, insert_work_hour_table_temp");
        console.log(req.body.users);
        var index = 0
        if (req.body.users != null) {
            while(index < req.body.users.length) {
                var items = {};
                items.userID = req.body.users[index];
                Temp.create({
                    tempID: req.body.users[index],
                    creatorDID: req.body.creatorDID
                });
                index ++;
            }
        }
        res.status(200).send({
            code: 200,
            error: global.status._200,
        });
    })

    // management List
    app.post(global.apiUrl.get_work_hour_table_management_list, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get_work_hour_table_management_list");

        Temp.aggregate(
            [
                {
                    $lookup:{
                        from: "workhourforms",
                        let: {
                            userID: "$tempID",
                            mainID: "$creatorDID"
                        },
                        pipeline: [
                            { $match:
                                    { $expr:
                                            { $and:
                                                    [
                                                        { $eq: [ "$creatorDID",  "$$userID" ] },
                                                        { $eq: [ "$$mainID", req.body.creatorDID ] },
                                                        { $eq: [ "$create_formDate",  req.body.date ] }
                                                    ]
                                            }
                                    }
                            },
                            {
                                $sort:{
                                    month:1,
                                }
                            },
                            {
                                $project: {
                                    _id: 0
                                }
                            }
                        ],
                        as: "work_hour_forms"
                    }
                },
                {
                    $addFields: {
                        "_aaa": {
                            $toObjectId: "$tempID"
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_aaa",
                        foreignField: "_id",
                        as: "user_info"
                    }
                },
                {
                    $project: {
                        "work_hour_forms": 1,
                        "user_info": 1,
                        // "_id": 1,
                        "tempID": 1,
                        // "creatorDID":0
                        // "user_info" : 1
                    }
                },
                {
                    $sort: {
                        "tempID": 1
                    }
                },
                {
                    $lookup:{
                        from: "workhourtableforms",
                        localField: "work_hour_forms.formTables.tableID",
                        foreignField: "_id",
                        as: "work_hour_tables"
                    }
                },
            ], function (err, tables) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_work_hour_table_management_list");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    Temp.remove({
                        creatorDID: req.body.creatorDID
                    }, function (err) {
                        if (err) {
                            console.log(global.timeFormat(new Date()) + global.log.e + "API, get_work_hour_table_management_list");
                            console.log(req.body);
                            console.log(" ***** ERROR ***** ");
                            console.log(err);
                        }
                    });

                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: tables,
                    });
                }
            }
        )
    })

    // end of file
}