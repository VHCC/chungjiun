var NotificationMsgItem = require('../models/notificationMsgItem');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // fetch Form
    app.post(global.apiUrl.post_notification_msg_by_user_did, function (req, res) {
        console.log(req.body);


        NotificationMsgItem.aggregate( // 由專案找起
            [
                {
                    $match: {
                        msgTarget: req.body.creatorDID
                    }
                },
                // {
                //     $addFields: {
                //         "_projectTargetString": {
                //             $toString: "$_id"
                //         },
                //         "_project_info" : "$$CURRENT"
                //     }
                // },
                // {
                //     $lookup: {
                //         from: "users", // 同仁
                //         localField: "creatorDID",
                //         foreignField: "prjDID",
                //         as: "work_hour_add_tables"
                //     }
                // },
                // {
                //     $unwind: "$work_hour_add_tables"
                // },
                // {
                //     $project: {
                //         "_id": 0,
                //         "_work_hour_add_tables_info" : {
                //             $cond: {
                //                 if: {
                //                     $and: $project_hour_add_table_Conds
                //                 },
                //                 then: "$work_hour_add_tables",
                //                 else: "$$REMOVE"
                //             }
                //         },
                //         "_project_info" : 1,
                //     }
                // },
                // {
                //     $unwind: "$_work_hour_add_tables_info"
                // },
                {
                    $addFields: {
                        "_userDID": {
                            $toObjectId: "$creatorDID"
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
                // {
                //     $unwind: "$_user_info"
                // },
                // {
                //     $project: {
                //         "_id": 0,
                //         "_project_info" : 1,
                //         "_work_hour_add_tables_info" : 1,
                //         "_user_info" : 1,
                //     }
                // },
                // {
                //     $group: {
                //         _id: {
                //             prjCode: '$_project_info.prjCode',  //$region is the column name in collection
                //             userDID: '$_work_hour_add_tables_info.creatorDID',  //$region is the column name in collection
                //         },
                //         add_tables: { $push: "$_work_hour_add_tables_info" },
                //         forms: { $push: "$_work_hour_forms_info" },
                //         _user_info: {$first: "$_user_info"},
                //         _project_info: {$first: "$_project_info"},
                //     }
                // },
                {
                    $sort: {
                        "_id": -1,
                    }
                },

            ], function (err, msgItems) {
                if (err) {
                    res.send(err);
                } else {

                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: msgItems,
                    });
                }
            }
        )
    });

    // update item
    app.post(global.apiUrl.post_notification_msg_update, function (req, res) {
        console.log(req.body);

        NotificationMsgItem.update({
            _id: req.body.msgID
        },{
            $set: {
                isRead: true,
            }
        }, function(err, msg) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: msg
                });
            }
        });
    });

    // update item all
    app.post(global.apiUrl.post_notification_msg_update_all, function (req, res) {
        console.log(req.body);

        var msgIDs = req.body.msgIDs

        for (var index = 0; index < msgIDs.length; index ++) {
            NotificationMsgItem.update({
                _id: msgIDs[index]
            }, {
                $set: {
                    isRead: true,
                }
            }, function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(result)
                }
            });
        }

        res.status(200).send({
            code: 200,
            error: global.status._200,
        });

    });

    // create item
    app.post(global.apiUrl.post_notification_msg_create_item, function (req, res) {
        console.log(req.body);
        for (var index = 0; index < req.body.msgTargetArray.length; index++) {
            NotificationMsgItem.create({
                creatorDID: req.body.creatorDID,
                msgTarget: req.body.msgTargetArray[index],
                msgMemo: req.body.msgMemoArray[index],
                msgActionTopic: req.body.msgTopicArray[index],
                msgActionDetail: req.body.msgDetailArray[index],
                timestamp: new Date()
            });
        }
        res.status(200).send({
            code: 200,
            error: global.status._200,
        })
    });
}