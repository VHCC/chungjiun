var WorkHourTableFormWorkAdd = require('../../models/workHourTableFormWorkAdd');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_work_hour_work_add_create_item, function (req, res) {
        // 刪除既有加班表
        if (req.body.hasOwnProperty('oldTables')) {
            var findData = []
            for (var index = 0; index < req.body.oldTables.length; index++) {
                var target = {
                    _id: req.body.oldTables[index],
                }
                findData.push(target);
            }
            WorkHourTableFormWorkAdd.remove(
                {
                    $or: findData,
                }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
        }

        if (req.body.hasOwnProperty('formTables')) {
            try {
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
                    })
                }
            } finally {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        }
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

        // WorkHourTableFormWorkAdd.find(query, function (err, workAddItems) {
        //     if (err) {
        //         res.send(err);
        //     }
        //     res.status(200).send({
        //         code: 200,
        //         error: global.status._200,
        //         payload: workAddItems,
        //     });
        // })
        WorkHourTableFormWorkAdd.find(query)
            .sort({
                create_formDate: 1,
                day: 1
            })
            .exec(function (err, workAddItems) {
                if (err) {
                    res.send(err);
                }
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: workAddItems,
                });
            });

    });

    // remove related work add items by project ID
    app.post(global.apiUrl.post_work_hour_work_remove_related_work_add_items, function (req, res) {
        WorkHourTableFormWorkAdd.remove({
            creatorDID: req.body.creatorDID,
            prjDID: req.body.prjDID,
            create_formDate: req.body.create_formDate,
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

    // 更新 加班/補休 單
    app.post(global.apiUrl.post_work_hour_work_update_related_work_add_items, function (req, res) {
        WorkHourTableFormWorkAdd.updateMany({
            creatorDID: req.body.creatorDID,
            prjDID: req.body.prjDID,
            create_formDate: req.body.create_formDate,
        }, {
            $set: {
                isExecutiveConfirm: true,
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
                }
                if (resultCount === req.body.formTables.length) {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                    });
                }
            })
        }

    })

    // update work add item
    app.post(global.apiUrl.post_work_hour_work_add_item_update, function (req, res) {

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
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        })
    });
}