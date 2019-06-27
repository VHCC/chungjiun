var VhcUser = require('../../vhc/model/vhcUser');
var VhcUserEyeCheckInfo = require('../../vhc/model/vhcUserEyeCheckInfo');
var VhcPurchaseRecord = require('../../vhc/model/vhcPurchaseRecord');

module.exports = function (app) {
    'use strict';

    // fetch all vhc members
    app.get(global.apiUrl.get_vhc_member_all, function (req, res) {

        VhcUser.find({}, function (err, users) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: users,
                });
            }
        })
    });

    // purchase
    app.get(global.apiUrl.get_vhc_test_all, function (req, res) {

        // VhcPurchaseRecord.find({
        //     user_number: "10139",
        // }, function (err, results) {
        //     if (err) {
        //         res.send(err);
        //     }
        //     res.status(200).send({
        //         code: 200,
        //         error: global.status._200,
        //         payload: results,
        //     });
        // });


        VhcUser.aggregate( //
            [
                // {
                //     $match: {
                //         user_number: "10139"
                //     }
                // },
                {
                    $addFields: {
                        // "_number": {
                        //     $toString: "$user_number"
                        // },
                        "_member_info" : "$$CURRENT"
                    }
                },
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
                {
                    $project: {
                        "_id": 0,
                        "purchases": 1,
                        "_member_info": 1
                    }
                },

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

    // find old rx
    app.post(global.apiUrl.post_vhc_member_old_rx_by_number, function (req, res) {
        console.log(req.body);
        VhcUserEyeCheckInfo.findOne({
            user_number: req.body.user_number
        }, function (err, oldRx) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: oldRx,
                });
            }
        })
    });

    // update Old Rx
    app.post(global.apiUrl.post_vhc_member_old_rx_update, function (req, res) {
        console.log(req.body);
        VhcUserEyeCheckInfo.update({
            user_number: req.body.user_number,
        }, {
            $set: {
                user_rightolds: req.body.user_rightolds,
                user_rightoldc: req.body.user_rightoldc,
                user_rightolda: req.body.user_rightolda,
                user_rightoldbc: req.body.user_rightoldbc,
                user_rightoldadd: req.body.user_rightoldadd,
                user_rightoldva: req.body.user_rightoldva,
                user_rightoldpd: req.body.user_rightoldpd,

                user_leftolds: req.body.user_leftolds,
                user_leftoldc: req.body.user_leftoldc,
                user_leftolda: req.body.user_leftolda,
                user_leftoldbc: req.body.user_leftoldbc,
                user_leftoldadd: req.body.user_leftoldadd,
                user_leftoldva: req.body.user_leftoldva,
                user_leftoldpd: req.body.user_leftoldpd,
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

    // fetch all vhc members
    app.post(global.apiUrl.post_vhc_member_find_exist_number, function (req, res) {
        console.log(req.body);
        VhcUser.findOne({
            user_number: req.body.user_number
        }, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: user,
                });
            }
        })
    });

    // update member
    app.post(global.apiUrl.post_vhc_member_update, function (req, res) {
        VhcUser.update({
            _id: req.body.member._id,
        }, {
            $set: {
                user_birth: req.body.member.user_birth,
                user_mobile: req.body.member.user_mobile,
                user_email: req.body.member.user_email,
                user_address: req.body.member.user_address,
                user_memo: req.body.member.user_memo,
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

    // create member
    app.post(global.apiUrl.post_vhc_member_create, function (req, res) {

        console.log(req.body);

        VhcUser.create({
            user_number: req.body.member.user_number,
            user_name: req.body.member.user_name,
            user_birth: req.body.member.user_birth,
            user_mobile: req.body.member.user_mobile,
            user_homephone: '',
            user_officephone: '',
            user_email: req.body.member.user_email,
            user_address: req.body.member.user_address,
            user_memo: req.body.member.user_memo,
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

}