var ExecutiveExpenditureItem = require('../../models/executiveExpenditureItem');

module.exports = function (app) {
    'use strict';

    // insert Item
    app.post(global.apiUrl.post_executive_expenditure_insert_item, function (req, res) {
        console.log(req.body);
        ExecutiveExpenditureItem.create({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
            prjDID: req.body.prjDID,
            payDate: req.body.payDate,
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
    app.post(global.apiUrl.post_executive_expenditure_remove_item, function (req, res) {
        ExecutiveExpenditureItem.remove({
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
    app.post(global.apiUrl.post_executive_expenditure_fetch_items, function (req, res) {
        console.log(req.body);
        ExecutiveExpenditureItem.find({
            // creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
        }, function (err, items) {
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

    // fetch items by prjDID
    app.post(global.apiUrl.post_executive_expenditure_fetch_items_by_prj_did, function (req, res) {
        console.log(req.body);
        ExecutiveExpenditureItem.find({
            prjDID: req.body.prjDID
        }, function (err, items) {
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

    app.post(global.apiUrl.post_executive_expenditure_fetch_items_by_prj_did_array, function (req, res) {
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

        ExecutiveExpenditureItem.find(query, function (err, items) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items,
                    prjDID: req.body.prjDIDArray[0],
                });
            }
        });
    });


    // update table by parameters
    app.post(global.apiUrl.post_executive_expenditure_items_update_one, function (req, res) {
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

        ExecutiveExpenditureItem.updateOne({
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
    app.post(global.apiUrl.post_executive_expenditure_items_update_many, function (req, res) {
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

        ExecutiveExpenditureItem.updateMany({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
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

    // 合併、轉換專案
    app.post(global.apiUrl.post_executive_expenditure_fetch_items_by_prjdid_array, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_executive_expenditure_fetch_items_by_prjdid_array");

        var findData = []
        for (var index = 0; index < req.body.prjDIDArray.length; index++) {
            var target = {
                prjDID: req.body.prjDIDArray[index],
            }
            findData.push(target);
        }
        ;

        var query = {};
        query.$or = findData;

        if (req.body.year) {
            query.isSendReview = true;
            query.year = req.body.year;
            query.month = req.body.month;

            ExecutiveExpenditureItem.find(query, function (err, eeItems) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_executive_expenditure_fetch_items_by_prjdid_array");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: eeItems,
                    });
                }
            });
        } else {
            query.isSendReview = true;
            ExecutiveExpenditureItem.find(query, function (err, eeItems) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_executive_expenditure_fetch_items_by_prjdid_array");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: eeItems,
                    });
                }
            });
        }
    })


}