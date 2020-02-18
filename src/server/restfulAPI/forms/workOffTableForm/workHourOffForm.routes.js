var WorkOffForm = require('../../models/workOffForm');
var WorkOffTableForm = require('../../models/workOffTableForm');
var moment = require('moment');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // 20190515
    // insert work off item
    app.post(global.apiUrl.post_work_off_table_insert_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_insert_item");
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

                timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),

            }, function (err, workOffTable) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    var tableItem = {
                        tableID: workOffTable._id,
                    }
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: tableItem,
                    });
                }

            });
        } catch (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
        }
    });

    // remove table item
    app.post(global.apiUrl.post_work_off_table_remove_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_remove_item");
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
                console.log(err);
                res.send(err);
            }
        }
    });

    // find table item by parameter
    app.post(global.apiUrl.post_work_off_table_item_find_by_parameter, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_item_find_by_parameter");
        console.log(JSON.stringify(req.body));

        var keyArray = Object.keys(req.body);
        var findQuery = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "findQuery.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }

        console.log(findQuery);

        WorkOffTableForm.find(
            findQuery,
            function (err, tables) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: tables,
                    });
                }
        })
    })

    // find table item by user DID to boss
    // 請假單主管確認
    // stage 2
    //@Deprecated 20200218
    app.post(global.apiUrl.post_work_off_table_item_find_by_user_did_boss, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_item_find_by_user_did_boss");
        console.log(JSON.stringify(req.body));
        WorkOffTableForm.find({
            creatorDID: req.body.creatorDID,
            // year: req.body.year, // 年度
            isSendReview: true,
            isBossCheck: false,
        }, function (err, tables) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: tables,
                });
            }
        })
    })

    // find table item by user DID to executive
    // 請假單行政確認
    // stage 3
    //@Deprecated 20200218
    app.post(global.apiUrl.post_work_off_table_item_find_by_user_did_executive, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_item_find_by_user_did_executive");
        console.log(JSON.stringify(req.body));
        WorkOffTableForm.find({
            creatorDID: req.body.creatorDID,
            isSendReview: true,
            isBossCheck: true,
            isExecutiveCheck: false,
        }, function (err, tables) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: tables,
                });
            }
        })
    })

    // 休假單更新
    // update table by parameters
    app.post(global.apiUrl.post_work_off_table_update, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_update");
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

        WorkOffTableForm.update({
            _id: req.body.tableID,
        }, {
            $set: query
        }, function (err) {
            if (err) {
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

    // fetch all agent related items
    // stage 1
    app.post(global.apiUrl.post_work_off_table_fetch_all_agent, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_fetch_all_agent");
        console.log(JSON.stringify(req.body));
        WorkOffTableForm.aggregate(
            [
                {
                    $match: {
                        agentID: req.body.userDID,
                        isSendReview: true,
                        isAgentCheck: false
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
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: tables,
                    });
                }
            }
        )
    })

    // fetch all boss tables
    // stage 2
    app.post(global.apiUrl.post_work_off_table_fetch_all_boss, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_fetch_all_boss");
        console.log(JSON.stringify(req.body));
        var underlingCount = req.body.underlingArray.length;
        var findData = []
        for (var index = 0; index < underlingCount; index++) {
            var target = {
                creatorDID: req.body.underlingArray[index],
            }
            findData.push(target);
        }
        console.log(findData);
        WorkOffTableForm.aggregate(
            [
                {
                    $match: {
                        $or: findData,
                        isSendReview: true,
                        isAgentCheck: true,
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
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: tables,
                    });
                }
            }
        )
    })

    // fetch all executive tables
    // stage 3
    app.post(global.apiUrl.post_work_off_table_fetch_all_executive, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_fetch_all_executive");
        console.log(JSON.stringify(req.body));
        WorkOffTableForm.aggregate(
            [
                {
                    $match: {
                        isSendReview: true,
                        isAgentCheck: true,
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
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: tables,
                    });
                }
            }
        )
    })


    // find table by table id array and parameters
    // Deprecated
    app.post(global.apiUrl.post_work_off_table_find_by_table_id_array_and_parameters, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_find_by_table_id_array_and_parameters");
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
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: tables,
                });
            }
        });
    })

    // 20191118 add
    app.post(global.apiUrl.post_work_off_table_update_salary, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_update_salary");
        console.log(JSON.stringify(req.body));
        var query = {};
        if (req.body.month !== null) {
            query.month = req.body.month;
        }

        if (req.body.year !== null) {
            query.year = req.body.year;
        }

        // if (req.body.isSendReview !== null) {
        //     query.isSendReview = req.body.isSendReview;
        // }
        //
        // if (req.body.isBossCheck !== null) {
        //     query.isBossCheck = req.body.isBossCheck;
        // }
        //
        // if (req.body.isExecutiveCheck !== null) {
        //     query.isExecutiveCheck = req.body.isExecutiveCheck;
        // }

        query.creatorDID = req.body.creatorDID;
        query.isSendReview = true;
        query.isBossCheck = true;
        query.isExecutiveCheck = true;

        console.log(query);

        WorkOffTableForm.updateMany({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
            isSendReview: true,
            isBossCheck: true,
            isExecutiveCheck: true,
        }, {
            $set: {
                userMonthSalary: req.body.userMonthSalary
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload:result
                });
            }
        })
    })

    // 20190201 add
    // find table by creatorDID
    app.post(global.apiUrl.post_work_off_table_find_by_user_did, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_work_off_table_find_by_user_did");
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

        if (req.body.create_formDate !== null && req.body.create_formDate != undefined) {
            query.create_formDate = req.body.create_formDate;
        }

        query.creatorDID = req.body.creatorDID;

        WorkOffTableForm.find(query)
            .sort({
                create_formDate: 1,
                _id: 1,
            })
            .exec(function (err, tables) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: tables,
                    });
                }
            });
    })

}