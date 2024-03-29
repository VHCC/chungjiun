var WorkHourTableFormWorkAdd = require('../../models/workHourTableFormWorkAdd');
var moment = require('moment');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_work_hour_work_add_create_item, function (req, res) {
        try {
            if (req.body.hasOwnProperty('formTables')) {
                for (var index = 0; index < req.body.formTables.length; index++) {
                    WorkHourTableFormWorkAdd.create({
                        creatorDID: req.body.formTables[index].creatorDID,
                        workAddType: req.body.formTables[index].workAddType,
                        create_formDate: req.body.formTables[index].create_formDate,
                        prjDID: req.body.formTables[index].prjDID,
                        year: req.body.formTables[index].year,
                        month: req.body.formTables[index].month,
                        day: req.body.formTables[index].day,
                        start_time: req.body.formTables[index].start_time,
                        end_time: req.body.formTables[index].end_time,
                        // userHourSalary: req.body.formTables[index].userHourSalary,
                        userMonthSalary: req.body.formTables[index].userMonthSalary,
                        reason: req.body.formTables[index].reason,
                        timestamp: moment(new Date()).format("YYYYMMDD_HHmmss")
                    })
                }
            }

            // 刪除既有加班表
            if (req.body.hasOwnProperty('oldTables')) {
                var findData = []
                for (var index = 0; index < req.body.oldTables.length; index++) {
                    var target = {
                        _id: req.body.oldTables[index],
                    }
                    findData.push(target);
                }

                if (req.body.oldTables.length > 0) {
                    WorkHourTableFormWorkAdd.remove(
                        {
                            $or: findData,
                        }, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        })
                }
            }
        } finally {
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        }
    });

    // 更新加班單
    app.post(global.apiUrl.post_work_hour_work_add_update_item, function (req, res) {
        console.log(req.body)
        var updateCounts = 0;
        for(var index = 0; index < req.body.workAddItems.length; index ++) {
            WorkHourTableFormWorkAdd.updateOne({
                _id: req.body.workAddItems[index]._id,
            }, {
                $set: {
                    workAddType: req.body.workAddItems[index].workAddType,
                    start_time: req.body.workAddItems[index].start_time,
                    end_time: req.body.workAddItems[index].end_time,
                    reason: req.body.workAddItems[index].reason,
                }
            }, function (err) {
                updateCounts++;
                if (err) {
                    res.send(err);
                } else {
                    if (updateCounts == req.body.workAddItems.length) {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                        });
                    }
                }
            })
        }
    });

    // 移除新加班單
    app.post(global.apiUrl.post_work_hour_work_add_remove_item, function (req, res) {
        console.log(req.body)
        var updateCounts = 0;
            WorkHourTableFormWorkAdd.remove({
                _id: req.body._id,
            },function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                    });
                }
            })
    });

    // create Form
    app.post(global.apiUrl.post_work_hour_work_add_create_item_one, function (req, res) {
        WorkHourTableFormWorkAdd.create({
            creatorDID: req.body.creatorDID,
            workAddType: req.body.workAddType,
            create_formDate: req.body.create_formDate,
            prjDID: req.body.prjDID,
            year: req.body.year,
            month: req.body.month,
            day: req.body.day,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            userMonthSalary: req.body.userMonthSalary,
            reason: req.body.reason,
            timestamp: moment(new Date()).format("YYYYMMDD_HHmmss")
        }, function (err, resp) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: resp,
                });
            }
        })
    });


    app.post(global.apiUrl.post_work_hour_work_add_get_items, function (req, res) {
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

        WorkHourTableFormWorkAdd.find(query)
            .sort({
                create_formDate: 1,
                day: 1
            })
            .exec(function (err, workAddItems) {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: workAddItems,
                    });
                }
            });

    });

    // remove related work add items by project ID
    app.post(global.apiUrl.post_work_hour_work_remove_related_work_add_items, function (req, res) {
        WorkHourTableFormWorkAdd.remove({
            creatorDID: req.body.creatorDID,
            prjDID: req.body.prjDID,
            create_formDate: req.body.create_formDate,
            month: req.body.month,
        }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })

    // 更新 加班/補休 單
    app.post(global.apiUrl.post_work_hour_work_update_related_work_add_items, function (req, res) {
        console.log(req.body)
        var resultCount = 0;
        for (var prjIndex = 0; prjIndex < req.body.prjDIDs.length; prjIndex ++) {
            WorkHourTableFormWorkAdd.updateMany({
                creatorDID: req.body.creatorDID,
                prjDID: req.body.prjDIDs[prjIndex],
                create_formDate: req.body.create_formDate,
                month: req.body.month,
            }, {
                $set: {
                    isExecutiveConfirm: true,
                }
            }, function (err, results) {
                resultCount++
                if (err) {
                    res.send(err);
                } else {
                    if (resultCount === req.body.prjDIDs.length) {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            payloads: results
                        });
                    }
                }
            })
        }

    })

    // executive confirm
    app.post(global.apiUrl.post_work_hour_work_executive_confirm, function (req, res) {
        var findData = []
        var resultCount = 0
        console.log(req.body);

        for (var index = 0; index < req.body.formTables.length; index++) {
            WorkHourTableFormWorkAdd.update({
                _id: req.body.formTables[index],
            }, {
                $set: {
                    isExecutiveConfirm: true,
                }
            }, function (err) {
                resultCount++;
                if (err) {
                    res.send(err);
                } else {
                    if (resultCount === req.body.formTables.length) {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                        });
                    }
                }
            })
        }

    })

    // update work add item repent back
    app.post(global.apiUrl.post_work_hour_work_add_item_update_repent, function (req, res) {

        var keyArray = Object.keys(req.body);
        var query = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "query.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }

        WorkHourTableFormWorkAdd.updateMany(query, {
            $set: {
                isExecutiveConfirm: false,
            }
        }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    });

    // 加班單分配
    app.post(global.apiUrl.post_work_hour_work_distribution_save, function (req, res) {

        console.log(req.body);
        var resultCount = 0;

        if (req.body.data.length == 0) {
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        }
        
        for (var index = 0; index < req.body.data.length; index ++) {
            WorkHourTableFormWorkAdd.updateMany({
                creatorDID: req.body.data[index].creatorDID,
                create_formDate: req.body.data[index].create_formDate,
                prjDID: req.body.data[index].prjDID,
                day: req.body.data[index].day,
            }, {
                $set: {
                    dis_1_0: req.body.data[index].dis_1_0,
                    dis_1_13: req.body.data[index].dis_1_13,
                    dis_1_23: req.body.data[index].dis_1_23,
                    dis_1_1: req.body.data[index].dis_1_1,
                    isExecutiveConfirm: true,
                }
            }, function (err) {
                resultCount++;
                if (err) {
                    res.send(err);
                } else {
                    if (resultCount === req.body.data.length) {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                        });
                    }
                }
            })
        }
    });

    app.post(global.apiUrl.post_work_hour_work_add_month_salary_update, function (req, res) {
        var resultCount = 0;

        for (var index = 0; index < req.body.items.length; index ++) {
            WorkHourTableFormWorkAdd.update({
                _id: req.body.items[index].item_id,
            }, {
                $set: {
                    userMonthSalary: req.body.salary,
                }
            }, function (err) {
                resultCount++;
                if (err) {
                    res.send(err);
                } else {
                    if (resultCount === req.body.items.length) {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                        });
                    }
                }
            })
        }
    });


    app.post(global.apiUrl.post_work_hour_work_add_month_salary_update_all, function (req, res) {
        WorkHourTableFormWorkAdd.updateMany({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
            isExecutiveConfirm: true
        }, {
            $set: {
                userMonthSalary: req.body.userMonthSalary,
            }
        }, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: results
                });
            }
        })
    });

}