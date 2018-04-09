var WorkOffForm = require('../../models/workOffForm');
var WorkOffTableForm = require('../../models/workOffTableForm');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_work_off_create_table, function (req, res) {

        // 刪除既有休假表
        WorkOffForm.remove({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
        }, function (err) {
            if (err) {
                console.log(err);
            }
        })
        console.log(req.body.oldTables);
        if (req.body.oldTables.hasOwnProperty('tableIDArray')) {
            var findData = []
            for (var index = 0; index < req.body.oldTables.tableIDArray.length; index++) {
                var target = {
                    _id: req.body.oldTables.tableIDArray[index],
                    creatorDID: req.body.creatorDID,
                }
                findData.push(target);
            };
            console.log(findData);
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
        var resIndex = 0;
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
                    isManagerCheck: req.body.formTables[index].isManagerCheck,
                    isExecutiveCheck: req.body.formTables[index].isExecutiveCheck,
                    userHourSalary: req.body.formTables[index].userHourSalary,


                }, function (err, workOffTable) {
                    resIndex++;
                    // workOffForm formTables 的參數
                    var tableItem = {
                        tableID: workOffTable._id,
                    }
                    formTable.push(tableItem);

                    if (resIndex === req.body.formTables.length) {
                        console.log(formTable);
                        WorkOffForm.create({
                            creatorDID: req.body.creatorDID,
                            year: req.body.year,
                            month: req.body.month,
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
    app.post(global.apiUrl.post_work_off_get, function (req, res) {
        WorkOffForm.find({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
        }, function (err, workOffForm) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: workOffForm,
            });
        });
    });

    // find table by tableid array
    app.post(global.apiUrl.post_work_off_table_find_by_tableid_array, function (req, res) {
        var tableCount = req.body.tableIDArray.length;
        var findData = []
        for (var index = 0; index < tableCount; index++) {
            var target = {
                _id: req.body.tableIDArray[index],
            }
            findData.push(target);
        };
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

    // update table form send review
    app.post(global.apiUrl.post_work_off_table_update_send_review, function (req, res) {
        WorkOffTableForm.update({
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

    // find table item by user DID to executive
    app.post(global.apiUrl.post_work_off_table_item_find_by_user_did, function (req,res) {
        WorkOffTableForm.find({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            isSendReview: true,
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

}