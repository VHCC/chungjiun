var SubContractorPayItem = require('../../models/subContractorPayItem');

module.exports = function (app) {
    'use strict';

    // insert Item
    app.post(global.apiUrl.post_insert_sub_contractor_pay_item, function (req, res) {
        console.log(req.body);
        SubContractorPayItem.create({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            prjDID: req.body.prjDID,
            // subContractDID: req.body.subContractDID,
            // vendorDID: req.body.vendorDID,
            // itemDID: req.body.itemDID,
        }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        });
    });

    // remove item
    app.post(global.apiUrl.post_remove_sub_contractor_pay_item, function (req, res) {
        SubContractorPayItem.remove({
            _id: req.body._id,
        }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        });
    });

    // fetch items
    app.post(global.apiUrl.post_fetch_sub_contractor_pay_item, function (req, res) {
        console.log(req.body);
        var keyArray = Object.keys(req.body);
        var findTarget = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "findTarget.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }
        SubContractorPayItem.find(findTarget, function (err, items) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items,
                });
            }
        });
    });


    app.post(global.apiUrl.post_fetch_sub_contractor_pay_item_by_prj_did_array, function (req, res) {
        console.log(req.body);

        var findData = []
        for (var index = 0; index < req.body.prjDIDArray.length; index++) {
            var target = {
                prjDID: req.body.prjDIDArray[index],
            }
            findData.push(target);
        }

        var query = {};
        query.$or = findData;
        query.isExecutiveCheck = true;

        SubContractorPayItem.find(query, function (err, items) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items,
                });
            }
        });
    });


    app.post(global.apiUrl.post_update_sub_contractor_pay_item, function (req, res) {
        console.log(JSON.stringify(req.body));
        var keyArray = Object.keys(req.body);
        var updateTarget = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "updateTarget.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }

        SubContractorPayItem.update({
            _id: req.body._id
        }, {
            $set: updateTarget
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
    })


}