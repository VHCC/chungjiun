var Payment = require('../../models/paymentForm');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // create Form
    app.post(global.apiUrl.post_payment_create, function (req, res) {
        console.log(JSON.stringify(req.body));
        console.log(req.body.length);
        for (var index = 0; index < req.body.length; index ++) {
            Payment.create({
                creatorDID: req.body[index].creatorDID,
                payDate: req.body[index].payDate,
                receiptCode: req.body[index].receiptCode,
                payment: req.body[index].payment,
                amount: req.body[index].amount,
            }, function (err, payment) {
                if (err) {
                    res.send(err);
                }
            });
        }
        res.status(200).send({
            code: 200,
            error: global.status._200,
            // payload: payment,
        });
    });

}