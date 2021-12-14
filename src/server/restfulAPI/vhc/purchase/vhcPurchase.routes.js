var VhcUser = require('../../vhc/model/vhcUser');
var VhcUserEyeCheckInfo = require('../../vhc/model/vhcUserEyeCheckInfo');
var VhcPurchaseRecord = require('../../vhc/model/vhcPurchaseRecord');

module.exports = function (app) {
    'use strict';

    // purchase
    app.get(global.apiUrl.get_vhc_purchase_all, function (req, res) {
        VhcUser.aggregate( //
            [
                {
                    $addFields: {
                        "_userIdString": {
                            $toString: "$_id"
                        },
                    }
                },
                {
                    $lookup: {
                        from: "vhcpurchaserecords",
                        localField: "_userIdString",
                        foreignField: "userUUID",
                        as: "purchases"
                    }
                },
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

    // bindingData
    app.post(global.apiUrl.bindingDAta, function (req, res) {

        VhcUser.aggregate([
            {
                $project: {
                    "_id": 1,
                    "user_number": 1,
                }
            },
        ], function (err, users) {
            if (err) {
                res.send(err);
            } else {

                for (var i = 0; i < users.length; i++) {

                    VhcPurchaseRecord.updateMany({
                        user_number: users[i].user_number,
                    }, {
                        $set: {
                            userUUID: users[i]._id
                        }
                    }, function (err) {
                        if (err) {
                            res.send(err);
                        }
                    })

                    VhcUserEyeCheckInfo.updateMany({
                        user_number: users[i].user_number,
                    }, {
                        $set: {
                            userUUID: users[i]._id
                        }
                    }, function (err) {
                        if (err) {
                            res.send(err);
                        }
                    })
                }

                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: users,
                });
            }
        })


        // VhcUser.find({}, function (err, users) {
        //     if (err) {
        //         res.send(err);
        //     } else {
        //
        //         for (var i = 0 ; i < users.length; i ++) {
        //             console.log(users[i])
        //             console.log(users[i]._id)
        //         }
        //
        //
        //
        //         res.status(200).send({
        //             code: 200,
        //             error: global.status._200,
        //             payload: users,
        //         });
        //     }
        // })
    });


}