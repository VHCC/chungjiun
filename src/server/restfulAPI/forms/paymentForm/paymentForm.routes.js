var PaymentForm = require('../../models/paymentForm');
var PaymentFormItem = require('../../models/paymentFormItem');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // Deprectated 2019/08/15
    // create Form
    // app.post(global.apiUrl.post_payment_create, function (req, res) {
    //     console.log(JSON.stringify(req.body));
    //     console.log(req.body.length);
    //     for (var index = 0; index < req.body.length; index ++) {
    //         PaymentForm.create({
    //             creatorDID: req.body[index].creatorDID,
    //             payDate: req.body[index].payDate,
    //             receiptCode: req.body[index].receiptCode,
    //             payment: req.body[index].payment,
    //             amount: req.body[index].amount,
    //         }, function (err, payment) {
    //             if (err) {
    //                 res.send(err);
    //             }
    //         });
    //     }
    //     res.status(200).send({
    //         code: 200,
    //         error: global.status._200,
    //         // payload: payment,
    //     });
    // });

    // insert Item
    app.post(global.apiUrl.post_payment_insert_item, function (req, res) {
        console.log(req.body);
        PaymentFormItem.create({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
            prjDID: req.body.prjDID,
            payDate: req.body.payDate,
        }, function (err, payment) {
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
    app.post(global.apiUrl.post_payment_remove_item, function (req, res) {
        PaymentFormItem.remove({
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
    app.post(global.apiUrl.post_payment_fetch_items, function (req, res) {
        console.log(req.body);
        PaymentFormItem.find({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
        }, function (err, paymentItems) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: paymentItems,
                });
            }
        });
    });

    //create Form
    app.post(global.apiUrl.post_payment_create_form, function (req, res) {
        console.log(req.body);

        PaymentForm.remove({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
        }, function (err) {
            if (err) {
                res.send(err);
            } else {
                PaymentForm.create({
                    creatorDID: req.body.creatorDID,
                    year: req.body.year,
                    month: req.body.month,
                    formTables: req.body.formTables,
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
            }
        });
    });


    // 提交審查
    app.post(global.apiUrl.post_payment_send_review, function (req, res) {
        console.log(req.body);
        PaymentFormItem.find({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
        }, function (err, paymentItems) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: paymentItems,
                });
            }
        });
    });

    // 更新
    // update table by parameters
    app.post(global.apiUrl.post_payment_items_update, function (req, res) {
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
        // console.log(query);

        PaymentFormItem.updateMany({
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

    // update table by id
    app.post(global.apiUrl.post_payment_items_update_by_id, function (req, res) {
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
        // console.log(query);

        PaymentFormItem.update({
            _id: req.body._id,
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

    // get manager review tables
    // 多組creator, create_formDate
    app.post(global.apiUrl.post_payment_multiple_get, function (req, res) {
        var findData = []
        for (var index = 0; index < req.body.relatedMembers.length; index++) {
            var target = {
                creatorDID: req.body.relatedMembers[index],
                year: req.body.year,
                month: req.body.month,
            }
            findData.push(target);
        }

        var query = {
            $or: findData,
        }

        if (req.body.isFindSendReview !== null) {
            query.isSendReview = req.body.isFindSendReview;
        }

        if (req.body.isFindManagerCheck !== null) {
            query.isManagerCheck = req.body.isFindManagerCheck;
        }

        if (req.body.isFindExecutiveCheck !== null) {
            query.isExecutiveCheck = req.body.isFindExecutiveCheck;
        }

        console.log(query);

        PaymentFormItem.find(query)
            .sort({})
            .exec(function (err, workHourForms) {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: workHourForms,
                    });
                }
            });
    })

    app.post(global.apiUrl.post_payment_fetch_items_by_prjdid, function (req, res) {
        console.log(req.body);

        if (req.body.year) {
            PaymentFormItem.find({
                prjDID: req.body.prjDID,
                isExecutiveCheck: true,
                year: req.body.year,
                month: req.body.month,
            }, function (err, paymentItems) {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: paymentItems,
                    });
                }
            });
        } else {
            PaymentFormItem.find({
                prjDID: req.body.prjDID,
                isExecutiveCheck: true,
            }, function (err, paymentItems) {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: paymentItems,
                    });
                }
            });
        }
    })


    // 合併、轉換專案
    app.post(global.apiUrl.post_payment_fetch_items_by_prjdid_array, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_payment_fetch_items_by_prjdid_array");

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
            query.isExecutiveCheck = true;
            query.year = req.body.year;
            query.month = req.body.month;

            PaymentFormItem.find(query, function (err, paymentItems) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_payment_fetch_items_by_prjdid_array");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: paymentItems,
                    });
                }
            });
        } else {
            query.isExecutiveCheck = true;
            PaymentFormItem.find(query, function (err, paymentItems) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_payment_fetch_items_by_prjdid_array");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: paymentItems,
                    });
                }
            });
        }
    })
}