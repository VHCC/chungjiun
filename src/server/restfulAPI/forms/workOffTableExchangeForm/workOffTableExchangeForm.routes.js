var WorkOffTableExchangeForm = require('../../models/workOffTableExchangeForm');

module.exports = function (app) {
    'use strict';

    // ----- define routes
    // insert table item
    app.post(global.apiUrl.post_work_off_exchange_table_insert_item, function (req, res) {
        console.log(JSON.stringify(req.body));

        // New Items
        console.log(req.body.dataItem);

        try {
            WorkOffTableExchangeForm.create({
                creatorDID: req.body.dataItem.creatorDID,

                workOffType: req.body.dataItem.workOffType,
                create_formDate: req.body.dataItem.create_formDate,
                year: req.body.dataItem.year,
                month: req.body.dataItem.month,
                day: req.body.dataItem.day,

                //RIGHT
                isSendReview: req.body.dataItem.isSendReview,
                isBossCheck: req.body.dataItem.isBossCheck,
                isExecutiveCheck: req.body.dataItem.isExecutiveCheck,

                userMonthSalary: req.body.dataItem.userMonthSalary,

            }, function (err, workOffExchangeItem) {
                // workOffForm formTables 的參數
                var tableItem = {
                    tableID: workOffExchangeItem._id,
                }

                console.log(tableItem);
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
    app.post(global.apiUrl.post_work_off_exchange_table_remove_by_itemID, function (req, res) {
        console.log(req.body);

        try {
            WorkOffTableExchangeForm.remove({
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

    // find table item by user DID to executive
    // 請假單行政確認
    app.post(global.apiUrl.post_work_off_table_item_find_by_user_did_executive, function (req, res) {
        console.log(JSON.stringify(req.body));
        WorkOffTableExchangeForm.find({
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
        WorkOffTableExchangeForm.find({
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


    // 休假單更新
    // update table by parameters
    app.post(global.apiUrl.post_work_off_exchange_table_update, function (req, res) {
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
        console.log(query);

        WorkOffTableExchangeForm.update({
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
        WorkOffTableExchangeForm.aggregate(
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
        WorkOffTableExchangeForm.aggregate(
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

        WorkOffTableExchangeForm.find({
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
    app.post(global.apiUrl.post_work_off_exchange_table_find_by_creatorDID, function (req, res) {
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

        WorkOffTableExchangeForm.find(query)
            .sort({
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


    })

}