var WorkHourForm = require('../../models/workHourForm');
var WorkHourTableForm = require('../../models/workHourTableForm');
var Project = require('../../models/project');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_work_hour_create_table, function (req, res) {

        // 刪除既有工時表
        WorkHourForm.remove({
            creatorDID: req.body.creatorDID,
            create_formDate: req.body.create_formDate,
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
            }
            ;
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

    //get form by date
    app.post(global.apiUrl.post_work_hour_get, function (req, res) {
        WorkHourForm.find({
            creatorDID: req.body.creatorDID,
            create_formDate: req.body.create_formDate,
        }, function (err, workhourform) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: workhourform,
            });
        });
    });

    // get forms for manager
    app.post(global.apiUrl.post_work_hour_get_for_manager, function (req, res) {
        var relatedProjects = [];
        var prjCount = 0;
        Project.find(
            {
                majorID: req.body.majorID,
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
        // console.log(query)
        WorkHourTableForm.find(query, function (err, tables) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: tables,
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
        var findData = [];
        for (var index = 0; index < req.body.tableArray.length; index++) {
            // var target = {
            //     _id: req.body.tableArray[index],
            // }
            // findData.push(target);
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

        res.status(200).send({
            code: 200,
            error: global.status._200,
        })

        // WorkHourTableForm.update({
        //     // _id: req.body.tableID,
        //     $or: findData,
        // }, {
        //     $set: {
        //         isSendReview: true,
        //     }
        // }, function (err) {
        //     if (err) {
        //         res.send(err);
        //     }
        //     res.status(200).send({
        //         code: 200,
        //         error: global.status._200,
        //     });
        // })
    })

    // update table executive check
    app.post(global.apiUrl.post_work_hour_table_update, function (req, res) {

        var setQuery = {};

        if (req.body.isSendReview !== null) {
            setQuery.isSendReview = req.body.isSendReview;
        }
        if (req.body.isManagerCheck !== null) {
            setQuery.isManagerCheck = req.body.isManagerCheck;
        }
        if (req.body.isExecutiveCheck !== null) {
            setQuery.isExecutiveCheck = req.body.isExecutiveCheck;
        }
        WorkHourTableForm.update({
            _id: req.body.tableID,
        }, {
            $set: setQuery
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