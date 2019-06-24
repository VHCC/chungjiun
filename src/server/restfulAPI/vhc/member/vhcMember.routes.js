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