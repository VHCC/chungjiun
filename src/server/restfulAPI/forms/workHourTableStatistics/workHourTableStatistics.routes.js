var WorkHourForm = require('../../models/workHourForm');
var WorkHourTable = require('../../models/workHourTableForm');
var Project = require('../../models/project');
var Temp = require('../../models/temp');
// var NotificationMsgItem = require('../../models/notificationMsgItem');

module.exports = function (app) {
    'use strict';

    // ------------------------ Statistics ---------------------
    app.post(global.apiUrl.query_statistics_form, function (req, res) {
        console.log("query_statistics_form");
        console.log(req.body);

        var prjInfo = {};

        if (req.body.branch != undefined) {
            prjInfo.branch = req.body.branch;
        }

        if (req.body.year != undefined) {
            prjInfo.year = req.body.year;
        }

        if (req.body.code != undefined) {
            prjInfo.code = req.body.code;
        }

        if (req.body.prjNumber != undefined) {
            prjInfo.prjNumber = req.body.prjNumber;
        }

        if (req.body.prjSubNumber != undefined) {
            prjInfo.prjSubNumber = req.body.prjSubNumber;
        }

        if (req.body.type != undefined) {
            prjInfo.type = req.body.type;
        }
        // var prjInfo = {
        //     branch: "C",
        //     year: "108",
        //     code: "02",
        //     prjNumber: "01",
        // }

        console.log(prjInfo);

        var $project_hour_table_Conds = [
            {$eq: [ "$work_hour_forms.formTables.prjDID", "$_projectTargetString" ]}
        ];

        var $project_hour_add_table_Conds = [
            {$eq: [ "$work_hour_add_tables.prjDID", "$_projectTargetString" ]}
        ]

        if (req.body.form_year != undefined) {
            $project_hour_table_Conds.push({$eq: [ "$work_hour_forms.year", req.body.form_year ]});
            $project_hour_add_table_Conds.push({$eq: [ "$work_hour_add_tables.year", req.body.form_year ]});
        }

        if (req.body.form_month != undefined) {
            $project_hour_table_Conds.push({$eq: [ "$work_hour_forms.month", req.body.form_month ]});
            $project_hour_add_table_Conds.push({$eq: [ "$work_hour_add_tables.month", req.body.form_month ]});
        }

        Project.aggregate( // 由專案找起
            [
                {
                    $match: prjInfo
                },
                {
                    $addFields: {
                        "_projectTargetString": {
                            $toString: "$_id"
                        },
                        "_project_info" : "$$CURRENT"
                    }
                },
                {
                    $lookup: {
                        from: "workhourforms", // 年跟月的屬性
                        localField: "_projectTargetString",
                        foreignField: "formTables.prjDID",
                        as: "work_hour_forms"
                    }
                },
                {
                    $unwind: "$work_hour_forms"
                },
                {
                    $unwind: "$work_hour_forms.formTables"
                },
                {
                    $project: {
                        "_id": 0,
                        "_work_hour_forms_info" : {
                            $cond: {
                                if: {
                                    $and: $project_hour_table_Conds
                                },
                                then: "$work_hour_forms",
                                else: "$$REMOVE"
                            }
                        },
                        "_project_info" : 1,
                    }
                },
                {
                    $unwind: "$_work_hour_forms_info"
                },
                {
                    $lookup: {
                        from: "workhourtableforms", // 年跟月的屬性
                        localField: "_work_hour_forms_info.formTables.tableID",
                        foreignField: "_id",
                        as: "_work_hour_tables_info"
                    }
                },
                {
                    $unwind: "$_work_hour_tables_info"
                },
                {
                    $addFields: {
                        "_userDID": {
                            $toObjectId: "$_work_hour_forms_info.creatorDID"
                        },
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_userDID",
                        foreignField: "_id",
                        as: "_user_info"
                    }
                },
                {
                    $unwind: "$_user_info"
                },
                {
                    $project: {
                        "_id": 0,
                        "_project_info" : 1,
                        "_work_hour_forms_info" : 1,
                        "_work_hour_tables_info" : 1,
                        "_user_info" : 1,
                    }
                },
                {
                    $group: {
                        _id: {
                            prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                            userDID: '$_work_hour_forms_info.creatorDID',  //$region is the column name in collection
                        },
                        tables: { $push: "$_work_hour_tables_info" },
                        forms: { $push: "$_work_hour_forms_info" },
                        _user_info: {$first: "$_user_info"},
                        _work_hour_forms_info: {$first: "$_work_hour_forms_info"},
                        _project_info: {$first: "$_project_info"},

                    }
                },
                {
                    $sort: {
                        "_work_hour_forms_info.creatorDID": 1,
                        "_project_info.prjCode": 1
                    }
                },

            ], function (err, tables) {
                if (err) {
                    res.send(err);
                } else {
                    // Temp.drop();

                    var results = tables;

                    Project.aggregate( // 由專案找起
                        [
                            {
                                $match: prjInfo
                            },
                            {
                                $addFields: {
                                    "_projectTargetString": {
                                        $toString: "$_id"
                                    },
                                    "_project_info" : "$$CURRENT"
                                }
                            },
                            {
                                $lookup: {
                                    from: "workhourtableformworkadds", // 年跟月的屬性
                                    localField: "_projectTargetString",
                                    foreignField: "prjDID",
                                    as: "work_hour_add_tables"
                                }
                            },
                            {
                                $unwind: "$work_hour_add_tables"
                            },
                            // {
                            //     $unwind: "$work_hour_forms.formTables"
                            // },
                            {
                                $project: {
                                    "_id": 0,
                                    "_work_hour_add_tables_info" : {
                                        $cond: {
                                            if: {
                                                $and: $project_hour_add_table_Conds
                                            },
                                            then: "$work_hour_add_tables",
                                            else: "$$REMOVE"
                                        }
                                    },
                                    "_project_info" : 1,
                                }
                            },
                            {
                                $unwind: "$_work_hour_add_tables_info"
                            },
                            // {
                            //     $lookup: {
                            //         from: "workhourtableforms", // 年跟月的屬性
                            //         localField: "_work_hour_forms_info.formTables.tableID",
                            //         foreignField: "_id",
                            //         as: "_work_hour_tables_info"
                            //     }
                            // },
                            // {
                            //     $unwind: "$_work_hour_tables_info"
                            // },
                            {
                                $addFields: {
                                    "_userDID": {
                                        $toObjectId: "$_work_hour_add_tables_info.creatorDID"
                                    },
                                }
                            },
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "_userDID",
                                    foreignField: "_id",
                                    as: "_user_info"
                                }
                            },
                            {
                                $unwind: "$_user_info"
                            },
                            {
                                $project: {
                                    "_id": 0,
                                    "_project_info" : 1,
                                    "_work_hour_add_tables_info" : 1,
                                    "_user_info" : 1,
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                                        userDID: '$_work_hour_add_tables_info.creatorDID',  //$region is the column name in collection
                                    },
                                    add_tables: { $push: "$_work_hour_add_tables_info" },
                                    forms: { $push: "$_work_hour_forms_info" },
                                    _user_info: {$first: "$_user_info"},
                                    _project_info: {$first: "$_project_info"},
                                }
                            },
                            {
                                $sort: {
                                    "_work_hour_add_tables_info.creatorDID": 1,
                                    "_project_info.prjCode": 1
                                }
                            },

                        ], function (err, tables) {
                            if (err) {
                                res.send(err);
                            } else {
                                results = results.concat(tables);

                                res.status(200).send({
                                    code: 200,
                                    error: global.status._200,
                                    payload: results,
                                });
                            }
                        }
                    )
                }
            }
        )
    })

    // ------------------------ Statistics CJ ---------------------
    app.post(global.apiUrl.query_statistics_form_CJ, function (req, res) {
        console.log("query_statistics_form_CJ");
        console.log(req.body);

        var results = [];

        var count = 0;
        var count_add = 0;

        if (req.body.form_monthArray != undefined) {
            for (var index = 0; index < req.body.form_monthArray.length; index ++) {

                var prjInfo = {};

                if (req.body.branch != undefined) {
                    prjInfo.branch = req.body.branch;
                }

                if (req.body.year != undefined) {
                    prjInfo.year = req.body.year;
                }

                if (req.body.code != undefined) {
                    prjInfo.code = req.body.code;
                }

                if (req.body.prjNumber != undefined) {
                    prjInfo.prjNumber = req.body.prjNumber;
                }

                if (req.body.prjSubNumber != undefined) {
                    prjInfo.prjSubNumber = req.body.prjSubNumber;
                }

                if (req.body.type != undefined) {
                    prjInfo.type = req.body.type;
                }

                // console.log(prjInfo);

                var $project_hour_table_Conds = [
                    {$eq: [ "$work_hour_forms.formTables.prjDID", "$_projectTargetString" ]}
                ];

                var $project_hour_add_table_Conds = [
                    {$eq: [ "$work_hour_add_tables.prjDID", "$_projectTargetString" ]}
                ]

                if (req.body.form_year != undefined) {
                    $project_hour_table_Conds.push({$eq: [ "$work_hour_forms.year", req.body.form_year ]});
                    $project_hour_add_table_Conds.push({$eq: [ "$work_hour_add_tables.year", req.body.form_year ]});
                }

                // if (req.body.form_month != undefined) {
                $project_hour_table_Conds.push({$eq: [ "$work_hour_forms.month", req.body.form_monthArray[index] ]});
                $project_hour_add_table_Conds.push({$eq: [ "$work_hour_add_tables.month", req.body.form_monthArray[index] ]});
                // }

                // console.log($project_hour_table_Conds);

                Project.aggregate( // 由專案找起
                    [
                        {
                            $match: prjInfo
                        },
                        {
                            $addFields: {
                                "_projectTargetString": {
                                    $toString: "$_id"
                                },
                                "_project_info" : "$$CURRENT"
                            }
                        },
                        {
                            $lookup: {
                                from: "workhourforms", // 年跟月的屬性
                                localField: "_projectTargetString",
                                foreignField: "formTables.prjDID",
                                as: "work_hour_forms"
                            }
                        },
                        {
                            $unwind: "$work_hour_forms"
                        },
                        {
                            $unwind: "$work_hour_forms.formTables"
                        },
                        {
                            $project: {
                                "_id": 0,
                                "_work_hour_forms_info" : {
                                    $cond: {
                                        if: {
                                            // $and: $project_hour_table_Conds
                                            $and: $project_hour_table_Conds
                                        },
                                        then: "$work_hour_forms",
                                        else: "$$REMOVE"
                                    }
                                },
                                "_project_info" : 1,
                            }
                        },
                        {
                            $unwind: "$_work_hour_forms_info"
                        },
                        {
                            $lookup: {
                                from: "workhourtableforms", // 年跟月的屬性
                                localField: "_work_hour_forms_info.formTables.tableID",
                                foreignField: "_id",
                                as: "_work_hour_tables_info"
                            }
                        },
                        {
                            $unwind: "$_work_hour_tables_info"
                        },
                        {
                            $addFields: {
                                "_userDID": {
                                    $toObjectId: "$_work_hour_forms_info.creatorDID"
                                },
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "_userDID",
                                foreignField: "_id",
                                as: "_user_info"
                            }
                        },
                        {
                            $unwind: "$_user_info"
                        },
                        {
                            $project: {
                                "_id": 0,
                                "_project_info" : 1,
                                "_work_hour_forms_info" : 1,
                                "_work_hour_tables_info" : 1,
                                "_user_info" : 1,
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                                    userDID: '$_work_hour_forms_info.creatorDID',  //$region is the column name in collection
                                },
                                tables: { $push: "$_work_hour_tables_info" },
                                forms: { $push: "$_work_hour_forms_info" },
                                _user_info: {$first: "$_user_info"},
                                _work_hour_forms_info: {$first: "$_work_hour_forms_info"},
                                _project_info: {$first: "$_project_info"},

                            }
                        },
                        {
                            $sort: {
                                "_work_hour_forms_info.creatorDID": 1,
                                "_project_info.prjCode": 1
                            }
                        },

                    ], function (err, tables) {
                        count++;
                        if (err) {
                            res.send(err);
                        } else {
                            results = results.concat(tables);
                            if ((count == req.body.form_monthArray.length) &&
                                (count_add == req.body.form_monthArray.length)) {
                                res.status(200).send({
                                    code: 200,
                                    error: global.status._200,
                                    payload: results,
                                });
                            }
                        }
                    }
                )

                console.log($project_hour_add_table_Conds);

                Project.aggregate( // 由專案找起
                    [
                        {
                            $match: prjInfo
                        },
                        {
                            $addFields: {
                                "_projectTargetString": {
                                    $toString: "$_id"
                                },
                                "_project_info" : "$$CURRENT"
                            }
                        },
                        {
                            $lookup: {
                                from: "workhourtableformworkadds", // 年跟月的屬性
                                localField: "_projectTargetString",
                                foreignField: "prjDID",
                                as: "work_hour_add_tables"
                            }
                        },
                        {
                            $unwind: "$work_hour_add_tables"
                        },
                        // {
                        //     $unwind: "$work_hour_forms.formTables"
                        // },
                        {
                            $project: {
                                "_id": 0,
                                "_work_hour_add_tables_info" : {
                                    $cond: {
                                        if: {
                                            // $and: $project_hour_add_table_Conds
                                            $and: $project_hour_add_table_Conds
                                        },
                                        then: "$work_hour_add_tables",
                                        else: "$$REMOVE"
                                    }
                                },
                                "_project_info" : 1,
                            }
                        },
                        {
                            $unwind: "$_work_hour_add_tables_info"
                        },
                        // {
                        //     $lookup: {
                        //         from: "workhourtableforms", // 年跟月的屬性
                        //         localField: "_work_hour_forms_info.formTables.tableID",
                        //         foreignField: "_id",
                        //         as: "_work_hour_tables_info"
                        //     }
                        // },
                        // {
                        //     $unwind: "$_work_hour_tables_info"
                        // },
                        {
                            $addFields: {
                                "_userDID": {
                                    $toObjectId: "$_work_hour_add_tables_info.creatorDID"
                                },
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "_userDID",
                                foreignField: "_id",
                                as: "_user_info"
                            }
                        },
                        {
                            $unwind: "$_user_info"
                        },
                        {
                            $project: {
                                "_id": 0,
                                "_project_info" : 1,
                                "_work_hour_add_tables_info" : 1,
                                "_user_info" : 1,
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                                    userDID: '$_work_hour_add_tables_info.creatorDID',  //$region is the column name in collection
                                },
                                add_tables: { $push: "$_work_hour_add_tables_info" },
                                forms: { $push: "$_work_hour_forms_info" },
                                _user_info: {$first: "$_user_info"},
                                _project_info: {$first: "$_project_info"},
                            }
                        },
                        {
                            $sort: {
                                "_work_hour_add_tables_info.creatorDID": 1,
                                "_project_info.prjCode": 1
                            }
                        },

                    ], function (err, tables) {

                        count_add++;
                        if (err) {
                            res.send(err);
                        } else {
                            results = results.concat(tables);

                            if ((count == req.body.form_monthArray.length) &&
                                (count_add == req.body.form_monthArray.length)) {
                                res.status(200).send({
                                    code: 200,
                                    error: global.status._200,
                                    payload: results,
                                });
                            }
                        }
                    }
                )
            }
        }
    })

    app.post(global.apiUrl.query_statistics_form_CJ_type2, function (req, res) {
        console.log("query_statistics_form_CJ_type2");
        console.log(req.body);

        var results = [];
        var results_add = [];

        var normal = false;
        var overTime = false;
        var isRespSended = false;


        var prjInfo = {};

        if (req.body.branch != undefined) {
            prjInfo.branch = req.body.branch;
        }

        if (req.body.year != undefined) {
            prjInfo.year = req.body.year;
        }

        if (req.body.code != undefined) {
            prjInfo.code = req.body.code;
        }

        if (req.body.prjNumber != undefined) {
            prjInfo.prjNumber = req.body.prjNumber;
        }

        if (req.body.prjSubNumber != undefined) {
            prjInfo.prjSubNumber = req.body.prjSubNumber;
        }

        if (req.body.type != undefined) {
            prjInfo.type = req.body.type;
        }

        // console.log(prjInfo);

        var $project_hour_table_Conds = [
            {$eq: [ "$work_hour_forms.formTables.prjDID", "$_projectTargetString" ]}
        ];

        var $project_hour_add_table_Conds = [
            {$eq: [ "$work_hour_add_tables.prjDID", "$_projectTargetString" ]}
        ]

        // if (req.body.form_year != undefined) {
        //     $project_hour_table_Conds.push({$eq: [ "$work_hour_forms.year", req.body.form_year ]});
        //     $project_hour_add_table_Conds.push({$eq: [ "$work_hour_add_tables.year", req.body.form_year ]});
        // }

        if (req.body.form_yearArray != undefined) {
            var table_year_Conds = [];
            var table_year_Conds_add = [];
            for (var x = 0; x < req.body.form_yearArray.length; x ++) {
                table_year_Conds.push({$eq: [ "$work_hour_forms.year", req.body.form_yearArray[x] ]})
                table_year_Conds_add.push({$eq: [ "$work_hour_add_tables.year", req.body.form_yearArray[x] ]})
            }
            $project_hour_table_Conds.push({$or:table_year_Conds});
            $project_hour_add_table_Conds.push({$or:table_year_Conds_add});

        }

        if (req.body.form_monthArray != undefined) {
            var table_month_Conds = [];
            var table_month_Conds_add = [];
            for (var y = 0; y < req.body.form_monthArray.length; y ++) {
                table_month_Conds.push({$eq: [ "$work_hour_forms.month", req.body.form_monthArray[y] ]})
                table_month_Conds_add.push({$eq: [ "$work_hour_add_tables.month", req.body.form_monthArray[y] ]})
            }
            $project_hour_table_Conds.push({$or:table_month_Conds});
            $project_hour_add_table_Conds.push({$or:table_month_Conds_add});

        }

        console.log($project_hour_table_Conds);

        Project.aggregate( // 由專案找起
            [
                {
                    $match: prjInfo
                },
                {
                    $addFields: {
                        "_projectTargetString": {
                            $toString: "$_id"
                        },
                        "_project_info" : "$$CURRENT"
                    }
                },
                {
                    $lookup: {
                        from: "workhourforms", // 年跟月的屬性
                        localField: "_projectTargetString",
                        foreignField: "formTables.prjDID",
                        as: "work_hour_forms"
                    }
                },
                {
                    $unwind: "$work_hour_forms"
                },
                {
                    $unwind: "$work_hour_forms.formTables"
                },
                {
                    $project: {
                        "_id": 0,
                        "_work_hour_forms_info" : {
                            $cond: {
                                if: {
                                    // $and: $project_hour_table_Conds
                                    $and: $project_hour_table_Conds
                                },
                                then: "$work_hour_forms",
                                else: "$$REMOVE"
                            }
                        },
                        "_project_info" : 1,
                    }
                },
                {
                    $unwind: "$_work_hour_forms_info"
                },
                {
                    $lookup: {
                        from: "workhourtableforms", // 年跟月的屬性
                        localField: "_work_hour_forms_info.formTables.tableID",
                        foreignField: "_id",
                        as: "_work_hour_tables_info"
                    }
                },
                {
                    $unwind: "$_work_hour_tables_info"
                },
                {
                    $addFields: {
                        "_userDID": {
                            $toObjectId: "$_work_hour_forms_info.creatorDID"
                        },
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_userDID",
                        foreignField: "_id",
                        as: "_user_info"
                    }
                },
                {
                    $unwind: "$_user_info"
                },
                {
                    $project: {
                        "_id": 0,
                        "_project_info" : 1,
                        "_work_hour_forms_info" : 1,
                        "_work_hour_tables_info" : 1,
                        "_user_info" : 1,
                    }
                },
                {
                    $group: {
                        _id: {
                            prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                            userDID: '$_work_hour_forms_info.creatorDID',  //$region is the column name in collection
                        },
                        tables: { $push: "$_work_hour_tables_info" },
                        forms: { $push: "$_work_hour_forms_info" },
                        _user_info: {$first: "$_user_info"},
                        _work_hour_forms_info: {$first: "$_work_hour_forms_info"},
                        _project_info: {$first: "$_project_info"},

                    }
                },
                {
                    $sort: {
                        "_work_hour_forms_info.creatorDID": 1,
                        "_project_info.prjCode": 1
                    }
                },

            ], function (err, tables) {
                normal = true;
                if (err) {
                    res.send(err);
                } else {
                    results = results.concat(tables);
                    if (normal && overTime && !isRespSended) {
                        isRespSended = true;
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            payload: results,
                            payload_add: results_add,
                        });
                    }
                }
            }
        )

        // console.log($project_hour_add_table_Conds);

        Project.aggregate( // 由專案找起
            [
                {
                    $match: prjInfo
                },
                {
                    $addFields: {
                        "_projectTargetString": {
                            $toString: "$_id"
                        },
                        "_project_info" : "$$CURRENT"
                    }
                },
                {
                    $lookup: {
                        from: "workhourtableformworkadds", // 年跟月的屬性
                        localField: "_projectTargetString",
                        foreignField: "prjDID",
                        as: "work_hour_add_tables"
                    }
                },
                {
                    $unwind: "$work_hour_add_tables"
                },
                // {
                //     $unwind: "$work_hour_forms.formTables"
                // },
                {
                    $project: {
                        "_id": 0,
                        "_work_hour_add_tables_info" : {
                            $cond: {
                                if: {
                                    // $and: $project_hour_add_table_Conds
                                    $and: $project_hour_add_table_Conds
                                },
                                then: "$work_hour_add_tables",
                                else: "$$REMOVE"
                            }
                        },
                        "_project_info" : 1,
                    }
                },
                {
                    $unwind: "$_work_hour_add_tables_info"
                },
                // {
                //     $lookup: {
                //         from: "workhourtableforms", // 年跟月的屬性
                //         localField: "_work_hour_forms_info.formTables.tableID",
                //         foreignField: "_id",
                //         as: "_work_hour_tables_info"
                //     }
                // },
                // {
                //     $unwind: "$_work_hour_tables_info"
                // },
                {
                    $addFields: {
                        "_userDID": {
                            $toObjectId: "$_work_hour_add_tables_info.creatorDID"
                        },
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_userDID",
                        foreignField: "_id",
                        as: "_user_info"
                    }
                },
                {
                    $unwind: "$_user_info"
                },
                {
                    $project: {
                        "_id": 0,
                        "_project_info" : 1,
                        "_work_hour_add_tables_info" : 1,
                        "_user_info" : 1,
                    }
                },
                {
                    $group: {
                        _id: {
                            prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                            userDID: '$_work_hour_add_tables_info.creatorDID',  //$region is the column name in collection
                        },
                        add_tables: { $push: "$_work_hour_add_tables_info" },
                        forms: { $push: "$_work_hour_forms_info" },
                        _user_info: {$first: "$_user_info"},
                        _project_info: {$first: "$_project_info"},
                    }
                },
                {
                    $sort: {
                        "_work_hour_add_tables_info.creatorDID": 1,
                        "_project_info.prjCode": 1
                    }
                },

            ], function (err, tables) {
                overTime = true;
                if (err) {
                    res.send(err);
                } else {
                    results_add = results_add.concat(tables);

                    if (normal && overTime && !isRespSended) {
                        isRespSended = true;
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            payload: results,
                            payload_add: results_add,
                        });
                    }
                }
            }
        )
    })

    app.post(global.apiUrl.queryStatisticsForms_projectIncome_Cost, function (req, res) {
        console.log("queryStatisticsForms_projectIncome_Cost");
        console.log(req.body);

        var results = [];
        var results_add = [];

        var normal = false;
        var overTime = false;
        var isRespSended = false;


        var prjInfo = {};

        if (req.body.branch != undefined) {
            prjInfo.branch = req.body.branch;
        }

        if (req.body.year != undefined) {
            prjInfo.year = req.body.year;
        }

        if (req.body.code != undefined) {
            prjInfo.code = req.body.code;
        }

        if (req.body.prjNumber != undefined) {
            prjInfo.prjNumber = req.body.prjNumber;
        }

        if (req.body.prjSubNumber != undefined) {
            prjInfo.prjSubNumber = req.body.prjSubNumber;
        }

        if (req.body.type != undefined) {
            prjInfo.type = req.body.type;
        }

        // console.log(prjInfo);

        var $project_hour_table_Conds = [
            {$eq: [ "$work_hour_forms.formTables.prjDID", "$_projectTargetString" ]}
        ];

        var $project_hour_add_table_Conds = [
            {$eq: [ "$work_hour_add_tables.prjDID", "$_projectTargetString" ]}
        ]

        if (req.body.form_yearArray != undefined) {
            var table_year_Conds = [];
            var table_year_Conds_add = [];
            for (var x = 0; x < req.body.form_yearArray.length; x ++) {
                table_year_Conds.push({$eq: [ "$work_hour_forms.year", req.body.form_yearArray[x] ]})
                table_year_Conds_add.push({$eq: [ "$work_hour_add_tables.year", req.body.form_yearArray[x] ]})
            }
            $project_hour_table_Conds.push({$or:table_year_Conds});
            $project_hour_add_table_Conds.push({$or:table_year_Conds_add});

        }

        if (req.body.form_monthArray != undefined) {
            var table_month_Conds = [];
            var table_month_Conds_add = [];
            for (var y = 0; y < req.body.form_monthArray.length; y ++) {
                table_month_Conds.push({$eq: [ "$work_hour_forms.month", req.body.form_monthArray[y] ]})
                table_month_Conds_add.push({$eq: [ "$work_hour_add_tables.month", req.body.form_monthArray[y] ]})
            }
            $project_hour_table_Conds.push({$or:table_month_Conds});
            $project_hour_add_table_Conds.push({$or:table_month_Conds_add});

        }

        console.log($project_hour_table_Conds);

        Project.aggregate( // 由專案找起
            [
                {
                    $match: prjInfo
                },
                {
                    $addFields: {
                        "_projectTargetString": {
                            $toString: "$_id"
                        },
                        "_project_info" : "$$CURRENT"
                    }
                },
                {
                    $lookup: {
                        from: "workhourforms", // 年跟月的屬性
                        localField: "_projectTargetString",
                        foreignField: "formTables.prjDID",
                        as: "work_hour_forms"
                    }
                },
                {
                    $unwind: "$work_hour_forms"
                },
                {
                    $unwind: "$work_hour_forms.formTables"
                },
                {
                    $project: {
                        "_id": 0,
                        "_work_hour_forms_info" : {
                            $cond: {
                                if: {
                                    // $and: $project_hour_table_Conds
                                    $and: $project_hour_table_Conds
                                },
                                then: "$work_hour_forms",
                                else: "$$REMOVE"
                            }
                        },
                        "_project_info" : 1,
                    }
                },
                {
                    $unwind: "$_work_hour_forms_info"
                },
                {
                    $lookup: {
                        from: "workhourtableforms", // 年跟月的屬性
                        localField: "_work_hour_forms_info.formTables.tableID",
                        foreignField: "_id",
                        as: "_work_hour_tables_info"
                    }
                },
                {
                    $unwind: "$_work_hour_tables_info"
                },
                {
                    $addFields: {
                        "_userDID": {
                            $toObjectId: "$_work_hour_forms_info.creatorDID"
                        },
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_userDID",
                        foreignField: "_id",
                        as: "_user_info"
                    }
                },
                {
                    $unwind: "$_user_info"
                },
                {
                    $project: {
                        "_id": 0,
                        "_project_info" : 1,
                        "_work_hour_forms_info" : 1,
                        "_work_hour_tables_info" : 1,
                        "_user_info" : 1,
                    }
                },
                {
                    $group: {
                        _id: {
                            prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                            userDID: '$_work_hour_forms_info.creatorDID',  //$region is the column name in collection
                        },
                        tables: { $push: "$_work_hour_tables_info" },
                        forms: { $push: "$_work_hour_forms_info" },
                        _user_info: {$first: "$_user_info"},
                        _work_hour_forms_info: {$first: "$_work_hour_forms_info"},
                        _project_info: {$first: "$_project_info"},

                    }
                },
                {
                    $sort: {
                        "_work_hour_forms_info.creatorDID": 1,
                        "_project_info.prjCode": 1
                    }
                },

            ], function (err, tables) {
                normal = true;
                if (err) {
                    res.send(err);
                } else {
                    results = results.concat(tables);
                    if (normal && overTime && !isRespSended) {
                        isRespSended = true;
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            payload: results,
                            payload_add: results_add,
                        });
                    }
                }
            }
        )

        // console.log($project_hour_add_table_Conds);

        Project.aggregate( // 由專案找起
            [
                {
                    $match: prjInfo
                },
                {
                    $addFields: {
                        "_projectTargetString": {
                            $toString: "$_id"
                        },
                        "_project_info" : "$$CURRENT"
                    }
                },
                {
                    $lookup: {
                        from: "workhourtableformworkadds", // 年跟月的屬性
                        localField: "_projectTargetString",
                        foreignField: "prjDID",
                        as: "work_hour_add_tables"
                    }
                },
                {
                    $unwind: "$work_hour_add_tables"
                },
                // {
                //     $unwind: "$work_hour_forms.formTables"
                // },
                {
                    $project: {
                        "_id": 0,
                        "_work_hour_add_tables_info" : {
                            $cond: {
                                if: {
                                    // $and: $project_hour_add_table_Conds
                                    $and: $project_hour_add_table_Conds
                                },
                                then: "$work_hour_add_tables",
                                else: "$$REMOVE"
                            }
                        },
                        "_project_info" : 1,
                    }
                },
                {
                    $unwind: "$_work_hour_add_tables_info"
                },
                // {
                //     $lookup: {
                //         from: "workhourtableforms", // 年跟月的屬性
                //         localField: "_work_hour_forms_info.formTables.tableID",
                //         foreignField: "_id",
                //         as: "_work_hour_tables_info"
                //     }
                // },
                // {
                //     $unwind: "$_work_hour_tables_info"
                // },
                {
                    $addFields: {
                        "_userDID": {
                            $toObjectId: "$_work_hour_add_tables_info.creatorDID"
                        },
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_userDID",
                        foreignField: "_id",
                        as: "_user_info"
                    }
                },
                {
                    $unwind: "$_user_info"
                },
                {
                    $project: {
                        "_id": 0,
                        "_project_info" : 1,
                        "_work_hour_add_tables_info" : 1,
                        "_user_info" : 1,
                    }
                },
                {
                    $group: {
                        _id: {
                            prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                            userDID: '$_work_hour_add_tables_info.creatorDID',  //$region is the column name in collection
                        },
                        add_tables: { $push: "$_work_hour_add_tables_info" },
                        forms: { $push: "$_work_hour_forms_info" },
                        _user_info: {$first: "$_user_info"},
                        _project_info: {$first: "$_project_info"},
                    }
                },
                {
                    $sort: {
                        "_work_hour_add_tables_info.creatorDID": 1,
                        "_project_info.prjCode": 1
                    }
                },

            ], function (err, tables) {
                overTime = true;
                if (err) {
                    res.send(err);
                } else {
                    results_add = results_add.concat(tables);

                    if (normal && overTime && !isRespSended) {
                        isRespSended = true;
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            payload: results,
                            payload_add: results_add,
                        });
                    }
                }
            }
        )
    })


    // end of file
}