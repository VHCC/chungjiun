var WorkOffForm = require('../../models/workOffForm');
var WorkOffTableForm = require('../../models/workOffTableForm');

module.exports = function (app) {
    'use strict';

    // ----- define routes
    // create table item
    app.post(global.apiUrl.post_work_off_create_table, function (req, res) {
        console.log(JSON.stringify(req.body));
        // 刪除既有休假表
        // WorkOffForm.remove({
        //     creatorDID: req.body.creatorDID,
        //     year: req.body.year,
        //     month: req.body.month,
        // }, function (err) {
        //     if (err) {
        //         console.log(err);
        //     }
        // })
        // console.log(req.body.oldTables);
        if (req.body.oldTables.hasOwnProperty('tableIDArray')) {
            var findData = []
            for (var index = 0; index < req.body.oldTables.tableIDArray.length; index++) {
                var target = {
                    _id: req.body.oldTables.tableIDArray[index],
                    creatorDID: req.body.creatorDID,
                }
                findData.push(target);
            }
            // console.log(findData);
            // 刪除既有 工時表格
            WorkOffTableForm.remove(
                {
                    $or: findData,
                }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
        }

        var formTable = [];
        var resultTable = [];
        var resIndex = 0;
        // New Items
        for (var index = 0; index < req.body.formTables.length; index++) {
            try {
                WorkOffTableForm.create({
                    creatorDID: req.body.formTables[index].creatorDID,

                    workOffType: req.body.formTables[index].workOffType,
                    create_formDate: req.body.formTables[index].create_formDate,
                    year: req.body.formTables[index].year,
                    month: req.body.formTables[index].month,
                    day: req.body.formTables[index].day,
                    start_time: req.body.formTables[index].start_time,
                    end_time: req.body.formTables[index].end_time,

                    //RIGHT
                    isSendReview: req.body.formTables[index].isSendReview,
                    isBossCheck: req.body.formTables[index].isBossCheck,
                    isExecutiveCheck: req.body.formTables[index].isExecutiveCheck,

                    // userHourSalary: req.body.formTables[index].userHourSalary,
                    userMonthSalary: req.body.formTables[index].userMonthSalary,

                }, function (err, workOffTable) {
                    resIndex++;
                    // workOffForm formTables 的參數
                    var tableItem = {
                        tableID: workOffTable._id,
                    }
                    // formTable.push(tableItem);
                    if (resIndex === req.body.formTables.length) {
                        // WorkOffForm.create({
                        //     creatorDID: req.body.creatorDID,
                        //     year: req.body.year,
                        //     month: req.body.month,
                        //     formTables: formTable,
                        // }, function (err) {
                        //     if (err) {
                        //         res.send(err);
                        //     }
                        //     WorkOffTableForm.find({
                        //         creatorDID: req.body.creatorDID,
                        //         year: req.body.year,
                        //     }, function (err, workOffForms) {
                        //         if (err) {
                        //             res.send(err);
                        //         }
                        //         for (var x= 0; x < workOffForms.length; x++) {
                        //             var tableItem = {
                        //                 tableID: workOffForms[x]._id,
                        //             }
                        //             resultTable.push(tableItem);
                        //         }
                        //         res.status(200).send({
                        //             code: 200,
                        //             error: global.status._200,
                        //             payload: resultTable,
                        //         });
                        //     })
                        // });
                        // WorkOffTableForm.find({
                        //     creatorDID: req.body.creatorDID,
                        //     year: req.body.year,
                        // }, function (err, workOffTables) {
                        //     if (err) {
                        //         res.send(err);
                        //     }
                        //     for (var index = 0; index < workOffTables.length; index++) {
                        //         var tableItem = {
                        //             tableID: workOffTables[index]._id,
                        //         }
                        //         resultTable.push(tableItem);
                        //     }
                        //     res.status(200).send({
                        //         code: 200,
                        //         error: global.status._200,
                        //         payload: resultTable,
                        //     });
                        // })

                        var query = {
                            creatorDID: req.body.creatorDID,
                            // year: req.body.year,
                        }

                        WorkOffTableForm.find(query)
                            .sort({
                                _id: 1,
                            })
                            .exec(function (err, workOffTables) {
                                if (err) {
                                    res.send(err);
                                }
                                for (var index = 0; index < workOffTables.length; index++) {
                                    var tableItem = {
                                        tableID: workOffTables[index]._id,
                                    }
                                    resultTable.push(tableItem);
                                }
                                res.status(200).send({
                                    code: 200,
                                    error: global.status._200,
                                    payload: resultTable,
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

    // 20190515
    // insert work off item
    app.post(global.apiUrl.post_work_off_table_insert_item, function (req, res) {
        console.log(JSON.stringify(req.body));
        // New Items
            try {
            WorkOffTableForm.create({
                creatorDID: req.body.dataItem.creatorDID,

                workOffType: req.body.dataItem.workOffType,
                create_formDate: req.body.dataItem.create_formDate,
                year: req.body.dataItem.year,
                month: req.body.dataItem.month,
                day: req.body.dataItem.day,
                start_time: req.body.dataItem.start_time,
                end_time: req.body.dataItem.end_time,

                //RIGHT
                isSendReview: req.body.dataItem.isSendReview,
                isBossCheck: req.body.dataItem.isBossCheck,
                isExecutiveCheck: req.body.dataItem.isExecutiveCheck,

                userMonthSalary: req.body.dataItem.userMonthSalary,

            }, function (err, workOffTable) {
                var tableItem = {
                    tableID: workOffTable._id,
                }
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: tableItem,
                });
            });
        } catch (err) {
            if (err) {
                res.send(err);
            }
        }
    });

    // remove table item
    app.post(global.apiUrl.post_work_off_table_remove_item, function (req, res) {
        console.log(req.body);

        try {
            WorkOffTableForm.remove({
                creatorDID: req.body.creatorDID,
                _id: req.body.tableID
            }, function (err, workOffExchangeItem) {

                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            });
        } catch (err) {
            if (err) {
                res.send(err);
            }
        }
    });

    //get Work Off Form by date
    //@Deprecated
    // app.post(global.apiUrl.post_work_off_table_fetch_all_user, function (req, res) {
    //     console.log(JSON.stringify(req.body));
    //     var query = {};
    //     if (req.body.month !== null) {
    //         query.month = req.body.month;
    //     }
    //     query.creatorDID = req.body.creatorDID;
    //     query.year = req.body.year;
    //
    //     // console.log(query);
    //     WorkOffForm.find(query, function (err, workOffForm) {
    //         if (err) {
    //             res.send(err);
    //         }
    //         res.status(200).send({
    //             code: 200,
    //             error: global.status._200,
    //             payload: workOffForm,
    //         });
    //     });
    //
    //     // WorkOffForm.find({
    //     //     creatorDID: req.body.creatorDID,
    //     //     year: req.body.year,
    //     //     month: req.body.month,
    //     // }, function (err, workOffForm) {
    //     //     if (err) {
    //     //         res.send(err);
    //     //     }
    //     //     res.status(200).send({
    //     //         code: 200,
    //     //         error: global.status._200,
    //     //         payload: workOffForm,
    //     //     });
    //     // });
    // });

    // find table by table Id array
    //@Deprecated
    // app.post(global.apiUrl.post_work_off_table_find_by_table_id_array, function (req, res) {
    //     console.log(JSON.stringify(req.body));
    //     var tableCount = req.body.tableIDArray.length;
    //     var findData = []
    //     for (var index = 0; index < tableCount; index++) {
    //         var target = {
    //             _id: req.body.tableIDArray[index],
    //         }
    //         findData.push(target);
    //     }
    //     WorkOffTableForm.find({
    //         $or: findData,
    //     }, function (err, tables) {
    //         if (err) {
    //             res.send(err);
    //         }
    //         res.status(200).send({
    //             code: 200,
    //             error: global.status._200,
    //             payload: tables,
    //         });
    //     });
    // })

    // update table item send review
    //@Deprecated
    // app.post(global.apiUrl.post_work_off_table_update_send_review, function (req, res) {
    //     console.log(JSON.stringify(req.body));
    //     WorkOffTableForm.update({
    //         _id: req.body.tableID,
    //     }, {
    //         $set: {
    //             isSendReview: true,
    //         }
    //     }, function (err) {
    //         if (err) {
    //             res.send(err);
    //         }
    //         res.status(200).send({
    //             code: 200,
    //             error: global.status._200,
    //         });
    //     })
    // })

    // find table item by user DID to executive
    // 請假單行政確認
    app.post(global.apiUrl.post_work_off_table_item_find_by_user_did_executive, function (req, res) {
        console.log(JSON.stringify(req.body));
        WorkOffTableForm.find({
            creatorDID: req.body.creatorDID,
            // year: req.body.year, // 年度
            isSendReview: true,
            isBossCheck: true,
            isExecutiveCheck: false,
        }, function (err, tables) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: tables,
            });
        })
    })

    // find table item by user DID to boss
    // 請假單主管確認
    app.post(global.apiUrl.post_work_off_table_item_find_by_user_did_boss, function (req, res) {
        console.log(JSON.stringify(req.body));
        WorkOffTableForm.find({
            creatorDID: req.body.creatorDID,
            // year: req.body.year, // 年度
            isSendReview: true,
            isBossCheck: false,
        }, function (err, tables) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: tables,
            });
        })
    })

    // executive agree
    //@Deprecated
    // app.post(global.apiUrl.post_work_off_table_update_executive_agree, function (req, res) {
    //     console.log(JSON.stringify(req.body));
    //     WorkOffTableForm.update({
    //         _id: req.body.tableID,
    //     }, {
    //         $set: {
    //             isExecutiveCheck: true,
    //         }
    //     }, function (err) {
    //         if (err) {
    //             res.send(err);
    //         }
    //         res.status(200).send({
    //             code: 200,
    //             error: global.status._200,
    //         });
    //     })
    // })

    // boss agree
    //@Deprecated
    // app.post(global.apiUrl.post_work_off_table_update_boss_agree, function (req, res) {
    //     console.log(JSON.stringify(req.body));
    //     WorkOffTableForm.update({
    //         _id: req.body.tableID,
    //     }, {
    //         $set: {
    //             isBossCheck: true,
    //         }
    //     }, function (err) {
    //         if (err) {
    //             res.send(err);
    //         }
    //         res.status(200).send({
    //             code: 200,
    //             error: global.status._200,
    //         });
    //     })
    // })

    // disagree
    //@Deprecated
    // app.post(global.apiUrl.post_work_off_table_update_disagree, function (req, res) {
    //     console.log(JSON.stringify(req.body));
    //     WorkOffTableForm.update({
    //         _id: req.body.tableID,
    //     }, {
    //         $set: {
    //             isSendReview: false,
    //             isExecutiveCheck: false,
    //             isBossCheck: false
    //         }
    //     }, function (err) {
    //         if (err) {
    //             res.send(err);
    //         }
    //         res.status(200).send({
    //             code: 200,
    //             error: global.status._200,
    //         });
    //     })
    // })

    // 休假單更新
    // update table by parameters
    app.post(global.apiUrl.post_work_off_table_update, function (req, res) {
        console.log(JSON.stringify(req.body));
        var keyArray = Object.keys(req.body);
        var query = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "query.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }
        // console.log(query);

        WorkOffTableForm.update({
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

    // fetch all executive tables
    app.post(global.apiUrl.post_work_off_table_fetch_all_executive, function (req, res) {
        console.log(JSON.stringify(req.body));
        WorkOffTableForm.aggregate(
            [
                {
                    $match: {
                        isSendReview: true,
                        isBossCheck: true,
                        isExecutiveCheck: false
                    }
                },
                {
                    $group: {
                        _id: "$creatorDID",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ], function (err, tables) {
                if (err) {
                    res.send(err);
                }
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: tables,
                });
            }
        )
    })

    // fetch all boss tables
    app.post(global.apiUrl.post_work_off_table_fetch_all_boss, function (req, res) {
        console.log(JSON.stringify(req.body));
        var underlingCount = req.body.underlingArray.length;
        var findData = []
        for (var index = 0; index < underlingCount; index++) {
            var target = {
                creatorDID: req.body.underlingArray[index],
            }
            findData.push(target);
        }
        // console.log(findData)
        WorkOffTableForm.aggregate(
            [
                {
                    $match: {
                        $or: findData,
                        // year:108,
                        isSendReview: true,
                        isBossCheck: false
                    }
                },
                {
                    $group: {
                        _id: "$creatorDID",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ], function (err, tables) {
                if (err) {
                    res.send(err);
                }
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: tables,
                });
            }
        )
    })


    // find table by table id array and parameters
    app.post(global.apiUrl.post_work_off_table_find_by_table_id_array_and_parameters, function (req, res) {
        console.log(JSON.stringify(req.body));
        var tableCount = req.body.tableIDArray.length;
        var findData = [];
        for (var index = 0; index < tableCount; index++) {
            var target = {
                _id: req.body.tableIDArray[index],
                create_formDate: req.body.create_formDate,
            }
            findData.push(target);
        }

        WorkOffTableForm.find({
            $or: findData,
        }, function (err, tables) {
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

    // 20190201 add
    // find table by creatorDID
    app.post(global.apiUrl.post_work_off_table_find_by_user_did, function (req, res) {
        console.log(JSON.stringify(req.body));
        var query = {};
        if (req.body.month !== null) {
            query.month = req.body.month;
        }

        if (req.body.year !== null) {
            query.year = req.body.year;
        }

        if (req.body.isSendReview !== null) {
            query.isSendReview = req.body.isSendReview;
        }

        if (req.body.isBossCheck !== null) {
            query.isBossCheck = req.body.isBossCheck;
        }

        if (req.body.isExecutiveCheck !== null) {
            query.isExecutiveCheck = req.body.isExecutiveCheck;
        }

        query.creatorDID = req.body.creatorDID;

        console.log(query);

        WorkOffTableForm.find(query)
            .sort({
                create_formDate: 1,
                _id: 1,
            })
            .exec(function (err, tables) {
                if (err) {
                    res.send(err);
                }
                console.log(tables.length);
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: tables,
                });
            });


        // WorkOffTableForm.find(query, function (err, tables) {
        //     if (err) {
        //         res.send(err);
        //     }
        //     console.log(tables.length);
        //     res.status(200).send({
        //         code: 200,
        //         error: global.status._200,
        //         payload: tables,
        //     });
        // });
    })

}