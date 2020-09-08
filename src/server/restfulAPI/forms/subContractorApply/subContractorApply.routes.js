var SubContractorApplyItem = require('../../models/subContractorApplyItem');

module.exports = function (app) {
    'use strict';

    // insert Item
    app.post(global.apiUrl.post_sub_contractor_apply_insert_item, function (req, res) {
        console.log(req.body);
        SubContractorApplyItem.create({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            // month: req.body.month,
            prjDID: req.body.prjDID,
        }, function (err, item) {
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
    app.post(global.apiUrl.post_sub_contractor_apply_remove_item, function (req, res) {
        SubContractorApplyItem.remove({
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
    app.post(global.apiUrl.post_sub_contractor_apply_fetch_items, function (req, res) {
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
        SubContractorApplyItem.find(findTarget, function (err, items) {
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

    // update table by parameters
    app.post(global.apiUrl.post_sub_contractor_apply_items_update_one, function (req, res) {
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

        SubContractorApplyItem.update({
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

    // 更新
    // update table by parameters
    app.post(global.apiUrl.post_sub_contractor_apply_items_update_many, function (req, res) {
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

        SubContractorApplyItem.updateMany({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
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