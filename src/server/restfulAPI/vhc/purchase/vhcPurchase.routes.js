var VhcUser = require('../../vhc/model/vhcUser');
var VhcUserEyeCheckInfo = require('../../vhc/model/vhcUserEyeCheckInfo');
var VhcPurchaseRecord = require('../../vhc/model/vhcPurchaseRecord');

module.exports = function (app) {
    'use strict';

    // purchase
    app.get(global.apiUrl.get_vhc_purchase_all, function (req, res) {
        VhcUser.aggregate( //
            [
                // {
                //     $match: {
                //         user_number: "10139"
                //     }
                // },
                // {
                //     $addFields: {
                //         // "_number": {
                //         //     $toString: "$user_number"
                //         // },
                //         "_member_info" : "$$CURRENT"
                //     }
                // },
                {
                    $lookup: {
                        from: "vhcpurchaserecords",
                        localField: "user_number",
                        foreignField: "user_number",
                        as: "purchases"
                    }
                },
                // {
                //     $unwind: "$vhcPurchaseRecord"
                // },
                // {
                //     $unwind: "$work_hour_forms"
                // },
                // {
                //     $unwind: "$work_hour_forms.formTables"
                // },
                // {
                //     $project: {
                //         "_id": 0,
                //         "purchases": 1,
                //         "_member_info": 1
                //     }
                // },
                // {
                //     $unwind: "$_work_hour_forms_info"
                // },
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
                // {
                //     $addFields: {
                //         "_userDID": {
                //             $toObjectId: "$_work_hour_forms_info.creatorDID"
                //         },
                //     }
                // },
                // {
                //     $lookup: {
                //         from: "users",
                //         localField: "_userDID",
                //         foreignField: "_id",
                //         as: "_user_info"
                //     }
                // },
                // {
                //     $unwind: "$_user_info"
                // },
                // {
                //     $project: {
                //         "_id": 0,
                //         "_project_info" : 1,
                //         "_work_hour_forms_info" : 1,
                //         "_work_hour_tables_info" : 1,
                //         "_user_info" : 1,
                //     }
                // },
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
                        payload: results,
                    });
                }
            }
        )
    });

    // update Purchase Item
    app.post(global.apiUrl.post_vhc_purchase_update, function (req, res) {
        console.log(req.body);

        VhcPurchaseRecord.update({
            _id: req.body.purchase._id,
        }, {
            $set: {
                purchase_recorddate: req.body.purchase.purchase_recorddate,

                purchase_rights: req.body.purchase.purchase_rights,
                purchase_rightc: req.body.purchase.purchase_rightc,
                purchase_righta: req.body.purchase.purchase_righta,
                purchase_rightbc: req.body.purchase.purchase_rightbc,
                purchase_rightpd: req.body.purchase.purchase_rightpd,
                purchase_rightadd: req.body.purchase.purchase_rightadd,

                purchase_lefts: req.body.purchase.purchase_lefts,
                purchase_leftc: req.body.purchase.purchase_leftc,
                purchase_lefta: req.body.purchase.purchase_lefta,
                purchase_leftbc: req.body.purchase.purchase_leftbc,
                purchase_leftpd: req.body.purchase.purchase_leftpd,
                purchase_leftadd: req.body.purchase.purchase_leftadd,

                purchase_f_memo: req.body.purchase.purchase_f_memo,
                purchase_f: req.body.purchase.purchase_f,
                purchase_fprice: req.body.purchase.purchase_fprice,
                purchase_l_memo: req.body.purchase.purchase_l_memo,
                purchase_l: req.body.purchase.purchase_l,
                purchase_lprice: req.body.purchase.purchase_lprice,
            }
        }, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: result
                });
            }
        })
    });

    // create Purchase Item
    app.post(global.apiUrl.post_vhc_purchase_add, function (req, res) {
        console.log(req.body);

        VhcPurchaseRecord.create({
            user_number: req.body.member_info.user_number
        }, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: result
                });
            }
        })
    });


}