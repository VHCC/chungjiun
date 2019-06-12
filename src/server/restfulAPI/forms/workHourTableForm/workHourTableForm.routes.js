var WorkHourForm = require('../../models/workHourForm');
var WorkHourTableForm = require('../../models/workHourTableForm');
var Project = require('../../models/project');
var Temp = require('../../models/temp');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_work_hour_create_table, function (req, res) {

        // 刪除既有工時表
        WorkHourForm.remove({
            creatorDID: req.body.creatorDID,
            create_formDate: req.body.create_formDate,
            year: req.body.year,
            month: req.body.month,
        }, function (err) {
            if (err) {
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
            WorkHourTableForm.remove(
                {
                    $or: findData,
                }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
        }

        var formTable = [];
        var resIndex = 0;
        for (var index = 0; index < req.body.formTables.length; index++) {
            try {
                WorkHourTableForm.create({
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
                    var tableItem = {
                        tableID: workTable._id,
                        prjDID: workTable.prjDID,
                    }
                    formTable.push(tableItem);

                    if (resIndex === req.body.formTables.length) {
                        // console.log(formTable);
                        WorkHourForm.create({
                            year: req.body.year,
                            month: req.body.month,
                            creatorDID: req.body.creatorDID,
                            create_formDate: req.body.create_formDate,
                            formTables: formTable,
                        }, function (err) {
                            if (err) {
                                res.send(err);
                            }
                            res.status(200).send({
                                code: 200,
                                error: global.status._200,
                                payload: formTable,
                            });
                        });
                    }
                });
            } catch (err) {
                if (err) {
                    res.send(err);
                }
            }
        }

    });

    //get form by date, creator DID
    app.post(global.apiUrl.post_work_hour_get, function (req, res) {

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
                        res.send(err);
                    }
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: workHourForms,
                    });
                });
        }


    });

    // 多組creator, create_formDate
    app.post(global.apiUrl.post_work_hour_multiple_get, function (req, res) {
        // console.log(req.body);
        var findData = []
        for (var index = 0; index < req.body.relatedMembers.length; index++) {
            var target = {
                creatorDID: req.body.relatedMembers[index],
                create_formDate: req.body.create_formDate,
            }
            findData.push(target);

        }

        // WorkHourForm.find({
        //     $or: findData,
        // }, function (err, workHourForms) {
        //     if (err) {
        //         res.send(err);
        //     }
        //     res.status(200).send({
        //         code: 200,
        //         error: global.status._200,
        //         payload: workHourForms,
        //     });
        // });

        var query = {
            $or: findData,
        }

        // WorkHourForm.find(query)
        //     .sort({
        //         month: -1,
        //     })
        //     .exec(function (err, workHourForms) {
        //         if (err) {
        //             res.send(err);
        //         }
        //         res.status(200).send({
        //             code: 200,
        //             error: global.status._200,
        //             payload: workHourForms,
        //         });
        //     });


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
                        res.send(err);
                    }
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: workHourForms,
                    });
                });
        }

    })

    // get forms for manager
    app.post(global.apiUrl.
        post_work_hour_get_for_manager, function (req, res) {
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
                        res.send(err);
                    }
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: forms,
                        prjIDArray: prjIDArray,
                    });
                });

            });


    })

    // find table by tableid array
    app.post(global.apiUrl.post_work_hour_table_find_by_tableid_array, function (req, res) {
        var tableCount = req.body.tableIDArray.length;
        var findData = []
        for (var index = 0; index < tableCount; index++) {
            var target = {
                _id: req.body.tableIDArray[index],
            }
            findData.push(target);
        }

        // console.log("findData");
        // console.log(findData);

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

        WorkHourTableForm.find(query, function (err, tables) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: tables,
                creatorDID: req.body.creatorDID
            });
        });
    })

    // update table form send review
    app.post(global.apiUrl.post_work_hour_table_update_send_review, function (req, res) {
        WorkHourTableForm.update({
            _id: req.body.tableID,
        }, {
            $set: {
                isSendReview: true,
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

    // update all table ***
    app.post(global.apiUrl.post_work_hour_table_total_update_send_review, function (req, res) {
        for (var index = 0; index < req.body.tableArray.length; index++) {
            WorkHourTableForm.update({
                _id: req.body.tableArray[index],
            }, {
                $set: {
                    isSendReview: true,
                }
            }, function (err) {
                if (err) {
                    res.send(err);
                }
            })
        }
        // global.qqq.response(req.body.msgTargetID, global.eventString._2001);
        res.status(200).send({
            code: 200,
            error: global.status._200,
        })

    })

    // update table one item
    app.post(global.apiUrl.post_work_hour_table_update, function (req, res) {
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

        // if (req.body.isSendReview !== null) {
        //     setQuery.isSendReview = req.body.isSendReview;
        // }
        // if (req.body.isManagerCheck !== null) {
        //     setQuery.isManagerCheck = req.body.isManagerCheck;
        // }
        // if (req.body.isExecutiveCheck !== null) {
        //     setQuery.isExecutiveCheck = req.body.isExecutiveCheck;
        // }

        WorkHourTableForm.update({
            _id: req.body.tableID,
        }, {
            $set: query
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

    // update table array
    app.post(global.apiUrl.post_work_hour_table_update_array, function (req, res) {
        console.log("update table array");
        console.log(req.body);
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
            WorkHourTableForm.update({
                _id: req.body.tableIDs[index],
            }, {
                $set: query
            }, function (err) {
                if (err) {
                    res.send(err);
                }
            })
        }
        res.status(200).send({
            code: 200,
            error: global.status._200,
        })
    })

    // in order to insert temp related usersDID
    app.post(global.apiUrl.insert_work_hour_table_management_related_user_temp, function (req, res) {
        console.log(req.body.users);
        var index = 0
        while(index < req.body.users.length) {
            var items = {};
            items.userID = req.body.users[index];
            Temp.create({
                tempID: req.body.users[index],
                creatorDID: req.body.creatorDID
            });
            index ++;
        }
        res.status(200).send({
            code: 200,
            error: global.status._200,
        });
    })

    // management List
    app.post(global.apiUrl.get_work_hour_table_management_list, function (req, res) {
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
                            { $project: {
                                    _id: 0
                                }
                            }
                        ],
                        as: "work_hour_forms"
                    }
                },

                // {
                //     $match:{
                //         "work_hour_forms.create_formDate": "2019/02/11"
                //     }
                // },
                // {
                //     $match: {
                //         create_formDate: "2019/02/11"
                //         // isSendReview: true,
                //         // isBossCheck: true,
                //         // isExecutiveCheck: false
                //     }
                // },
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
                // {
                //     $match: {
                //         create_formDate: "2019/02/11",
                //         // isSendReview: true,
                //         // isBossCheck: true,
                //         // isExecutiveCheck: false
                //     }
                // },
                // {
                //     $group: {
                //         _id: "$creatorDID",
                //         count: {
                //             $sum: 1
                //         }
                //     }
                // }
            ], function (err, tables) {
                if (err) {
                    res.send(err);
                } else {
                    Temp.remove({
                    }, function (err) {
                        if (err) {
                            console.log(err)
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

        // WorkHourForm.aggregate(
        //     [
        //         {
        //             $lookup:{
        //                 from: "workhourtableforms",
        //                 localField: "formTables.tableID",
        //                 foreignField: "_id",
        //                 as: "work_hour_tables"
        //             }
        //         },
        //         {
        //             $match: {
        //                 create_formDate: "2019/02/11",
        //                 // isSendReview: true,
        //                 // isBossCheck: true,
        //                 // isExecutiveCheck: false
        //             }
        //         },
        //         {
        //             $addFields: {
        //                 "_aaa": {
        //                     $toObjectId: "$creatorDID"
        //                 }
        //             }
        //         },
        //         {
        //             $lookup: {
        //                 from: "users",
        //                 localField: "_aaa",
        //                 foreignField: "_id",
        //                 as: "user_info"
        //             }
        //         },
        //         {
        //             $project: {
        //                 "work_hour_tables": 1,
        //                 "user_info" : 1
        //             }
        //         }
        //         // {
        //         //     $group: {
        //         //         _id: "$creatorDID",
        //         //         count: {
        //         //             $sum: 1
        //         //         }
        //         //     }
        //         // }
        //     ], function (err, tables) {
        //         if (err) {
        //             res.send(err);
        //         } else {
        //             // Temp.drop();
        //             res.status(200).send({
        //                 code: 200,
        //                 error: global.status._200,
        //                 payload: tables,
        //             });
        //         }
        //     }
        // )
    })

}