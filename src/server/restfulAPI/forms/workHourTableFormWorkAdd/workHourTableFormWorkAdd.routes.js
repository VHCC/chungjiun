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
            };
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
            for (var index = 0; index < req.body.formTables.length; index++) {
                WorkHourTableFormWorkAdd.create({
                    creatorDID: req.body.formTables[index].creatorDID,
                    workAddType: req.body.formTables[index].workAddType,
                    create_formDate: req.body.formTables[index].create_formDate,
                    prjDID: req.body.formTables[index].prjDID,
                    month: req.body.formTables[index].month,
                    day: req.body.formTables[index].day,
                    start_time: req.body.formTables[index].start_time,
                    end_time: req.body.formTables[index].end_time,
                    userHourSalary: req.body.formTables[index].userHourSalary,
                    reason: req.body.formTables[index].reason,
                })
            }
        }
    });

    app.post(global.apiUrl.post_work_hour_work_add_get_items, function (req, res) {
        WorkHourTableFormWorkAdd.find({
            creatorDID: req.body.creatorDID,
            create_formDate: req.body.create_formDate,
            day: req.body.day,
        }, function (err,workAddItems) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: workAddItems,
            });
        })
    });

}