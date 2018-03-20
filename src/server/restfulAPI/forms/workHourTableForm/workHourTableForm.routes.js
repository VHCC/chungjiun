var WorkHourForm = require('../../models/workHourForm');
var WorkHourTableForm = require('../../models/WorkHourTableForm');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_work_hour_create_table, function (req, res) {

        var formTable = [];
        var resIndex = 0;
        for (var index = 0; index < req.body.formTables.length; index++) {
            try {
                WorkHourTableForm.create({
                    creatorDID: req.body.formTables[index].creatorDID,
                    prjDID: req.body.formTables[index].prjDID,

                    mon_hour: req.body.formTables[index].mon_hour,
                    mon_hour_add: req.body.formTables[index].mon_hour_add,
                    mon_memo: req.body.formTables[index].mon_memo,
                    mon_memo_add: req.body.formTables[index].mon_memo_add,
                }, function (err, workTable) {
                    resIndex++;
                    var tableItem = {
                        tableID: workTable._id,
                        prjDID: workTable.prjDID,
                    }
                    formTable.push(tableItem);

                    if (resIndex === req.body.formTables.length) {
                        console.log(formTable);
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

    // find table by tableid array
    app.post(global.apiUrl.post_work_hour_table_find_by_tableid_array, function (req, res) {
        var tableCount = req.body.tableIDArray.length;
        var findData = []
        for (var index = 0; index < tableCount; index++) {
            var target = {
                _id: req.body.tableIDArray[index],
            }
            findData.push(target);
        };
        WorkHourTableForm.find({
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

}