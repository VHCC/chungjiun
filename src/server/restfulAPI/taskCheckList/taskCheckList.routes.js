var workHourForm = require('../models/workHourForm');
var workHourTable = require('../models/workHourTableForm');
var project = require('../models/project');
var moment = require('moment');

module.exports = function (app) {


    app.post(global.apiUrl.fetch_task_check_list_work_hour_table_manager, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, fetch_task_check_list_work_hour_table_manager");
        console.log(req.body);

        var prjInfo = {
            managerID: req.body.managerDID
        };

        var $table_forms_conditions = [
            {$eq: [ "$_work_hour_tables_info.isSendReview", true ]},
            {$eq: [ "$_work_hour_tables_info.isManagerCheck", false ]}
        ];

        project.aggregate( // 由專案找起
            [
                {
                    $match: prjInfo
                },
                {
                    $addFields: {
                        "_projectTargetString": {
                            $toString: "$_id"
                        },
                        "_projectInfo" : "$$CURRENT"
                    }
                },
                {
                    $lookup: {
                        from: "workhourforms", // 年跟月的屬性
                        localField: "_projectTargetString",
                        foreignField: "formTables.prjDID",
                        as: "_work_hour_forms"
                    }
                },
                {
                    $unwind: "$_work_hour_forms"
                },
                {
                    $unwind: "$_work_hour_forms.formTables"
                },
                //
                {
                    $project: {
                        "_id": 0,
                        "_project_info" : 1,
                        "_projectTargetString" : 1,
                        "_work_hour_forms" : 1,
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        "_work_hour_forms_eq_target_prjDID" : {
                            $cond: {
                                if: {
                                    $and: {
                                        $eq: [ "$_work_hour_forms.formTables.prjDID", "$_projectTargetString" ]
                                    }
                                },
                                then: "$_work_hour_forms",
                                else: "$$REMOVE"
                            }
                        },
                        "_project_info" : 1,
                        "_projectTargetString" : 1,
                    }
                },
                {
                    $unwind: "$_work_hour_forms_eq_target_prjDID"
                },
                // workhourtable 表單
                {
                    $lookup: {
                        from: "workhourtableforms", // 年跟月的屬性
                        localField: "_work_hour_forms_eq_target_prjDID.formTables.tableID",
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
                            $toObjectId: "$_work_hour_tables_info.creatorDID"
                        },
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_userDID",
                        foreignField: "_id",
                        as: "_userInfo"
                    }
                },
                {
                    $unwind: "$_userInfo"
                },
                {
                    $project: {
                        "_id": 0,
                        "_project_info" : 1,
                        "_work_hour_forms_eq_target_prjDID" : 1,
                        "_work_hour_tables_info" : 1,
                        "_work_hour_table_eq_condition" : {
                            $cond: {
                                if: {
                                    // $and: [{$eq: [ "$_work_hour_tables_info.isSendReview", true ]},
                                    //        {$eq: [ "$_work_hour_tables_info.isManagerCheck", false ]},
                                    //       ],
                                    $and: $table_forms_conditions

                                },
                                then: "$_work_hour_tables_info",
                                else: "$$REMOVE"
                            }
                        },
                        "_userInfo" : 1,
                    }
                },
                {
                    $unwind: "$_work_hour_table_eq_condition"
                },
                // {
                //     $group: {
                //         _id: {
                //             prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                //             userDID: '$_work_hour_forms_info.creatorDID',  //$region is the column name in collection
                //         },
                //         tables: { $push: "$_work_hour_tables_info" },
                //         forms: { $push: "$_work_hour_forms_info" },
                //         _user_info: {$first: "$_user_info"},
                //         _work_hour_forms_info: {$first: "$_work_hour_forms_info"},
                //         _project_info: {$first: "$_project_info"},
                //
                //     }
                // },
                // {
                //     $sort: {
                //         "_work_hour_forms_info.creatorDID": 1,
                //         "_project_info.prjCode": 1
                //     }
                // },

            ], function (err, results) {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: results
                    });
                }
            }
        )
    })

    app.post(global.apiUrl.fetch_task_check_list_work_hour_table_executive, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, fetch_task_check_list_work_hour_table_executive");
        console.log(req.body);

        var prjInfo = {
            enable: true
        };

        var $table_forms_conditions = [
            {$eq: [ "$_work_hour_tables_info.isSendReview", true ]},
            {$eq: [ "$_work_hour_tables_info.isManagerCheck", true ]},
            {$eq: [ "$_work_hour_tables_info.isExecutiveCheck", false ]}
        ];

        project.aggregate( // 由專案找起
            [
                {
                    $match: prjInfo
                },
                {
                    $addFields: {
                        "_projectTargetString": {
                            $toString: "$_id"
                        },
                        "_projectInfo" : "$$CURRENT"
                    }
                },
                {
                    $lookup: {
                        from: "workhourforms", // 年跟月的屬性
                        localField: "_projectTargetString",
                        foreignField: "formTables.prjDID",
                        as: "_work_hour_forms"
                    }
                },
                {
                    $unwind: "$_work_hour_forms"
                },
                {
                    $unwind: "$_work_hour_forms.formTables"
                },
                //
                {
                    $project: {
                        "_id": 0,
                        "_project_info" : 1,
                        "_projectTargetString" : 1,
                        "_work_hour_forms" : 1,
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        "_work_hour_forms_eq_target_prjDID" : {
                            $cond: {
                                if: {
                                    $and: {
                                        $eq: [ "$_work_hour_forms.formTables.prjDID", "$_projectTargetString" ]
                                    }
                                },
                                then: "$_work_hour_forms",
                                else: "$$REMOVE"
                            }
                        },
                        "_project_info" : 1,
                        "_projectTargetString" : 1,
                    }
                },
                {
                    $unwind: "$_work_hour_forms_eq_target_prjDID"
                },
                // workhourtable 表單
                {
                    $lookup: {
                        from: "workhourtableforms", // 年跟月的屬性
                        localField: "_work_hour_forms_eq_target_prjDID.formTables.tableID",
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
                            $toObjectId: "$_work_hour_tables_info.creatorDID"
                        },
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_userDID",
                        foreignField: "_id",
                        as: "_userInfo"
                    }
                },
                {
                    $unwind: "$_userInfo"
                },
                {
                    $project: {
                        "_id": 0,
                        "_project_info" : 1,
                        "_work_hour_forms_eq_target_prjDID" : 1,
                        "_work_hour_tables_info" : 1,
                        "_work_hour_table_eq_condition" : {
                            $cond: {
                                if: {
                                    // $and: [{$eq: [ "$_work_hour_tables_info.isSendReview", true ]},
                                    //        {$eq: [ "$_work_hour_tables_info.isManagerCheck", false ]},
                                    //       ],
                                    $and: $table_forms_conditions

                                },
                                then: "$_work_hour_tables_info",
                                else: "$$REMOVE"
                            }
                        },
                        "_userInfo" : 1,
                    }
                },
                {
                    $unwind: "$_work_hour_table_eq_condition"
                },
                // {
                //     $group: {
                //         _id: {
                //             prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                //             userDID: '$_work_hour_forms_info.creatorDID',  //$region is the column name in collection
                //         },
                //         tables: { $push: "$_work_hour_tables_info" },
                //         forms: { $push: "$_work_hour_forms_info" },
                //         _user_info: {$first: "$_user_info"},
                //         _work_hour_forms_info: {$first: "$_work_hour_forms_info"},
                //         _project_info: {$first: "$_project_info"},
                //
                //     }
                // },
                // {
                //     $sort: {
                //         "_work_hour_forms_info.creatorDID": 1,
                //         "_project_info.prjCode": 1
                //     }
                // },

            ], function (err, results) {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: results
                    });
                }
            }
        )
    })


}