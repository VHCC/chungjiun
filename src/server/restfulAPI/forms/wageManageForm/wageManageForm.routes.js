var WageItem = require('../../models/wageItem');

module.exports = function (app) {
    'use strict';
    // ----- define routes

    // fetch items
    app.post(global.apiUrl.post_wage_manage_fetch_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_wage_manage_fetch_item");
        WageItem.findOne({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
        }, function (err, wageItem) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_wage_manage_fetch_items");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: wageItem,
                });
            }
        });
    });

    // create item
    app.post(global.apiUrl.post_wage_manage_create_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_wage_manage_create_item");
        WageItem.create({
            creatorDID: req.body.creatorDID,
            year: req.body.year,
            month: req.body.month,
        }, function (err, wageItem) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_wage_manage_create_item");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: wageItem,
                });
            }
        });
    });

    //save item
    app.post(global.apiUrl.post_wage_manage_update_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_wage_manage_update_item");
        console.log(req.body);
        WageItem.update({
            _id: req.body._id
        },{
            $set: {
                wgae_item_1: req.body.wgae_item_1,
                wgae_item_2: req.body.wgae_item_2,
                wgae_item_3: req.body.wgae_item_3,
                wgae_item_4: req.body.wgae_item_4,
                wgae_item_5: req.body.wgae_item_5,
                // wgae_item_6: req.body.wgae_item_6,
                wgae_item_7: req.body.wgae_item_7,
                wgae_item_8: req.body.wgae_item_8,
                wgae_item_9: req.body.wgae_item_9,
                wgae_item_10: req.body.wgae_item_10,
                wgae_item_11: req.body.wgae_item_11,
                wgae_item_12: req.body.wgae_item_12,
                wgae_item_12_title: req.body.wgae_item_12_title,
                wgae_item_13: req.body.wgae_item_13,
                wgae_item_13_title: req.body.wgae_item_13_title,
                wgae_item_14: req.body.wgae_item_14,
                wgae_item_14_title: req.body.wgae_item_14_title,
                wgae_item_15: req.body.wgae_item_15,
                wgae_item_15_title: req.body.wgae_item_15_title,
                wgae_item_16: req.body.wgae_item_16,
                wgae_item_16_title: req.body.wgae_item_16_title,

                // withholding_item_1: req.body.withholding_item_1,
                withholding_item_2: req.body.withholding_item_2,
                withholding_item_3: req.body.withholding_item_3,
                withholding_item_4: req.body.withholding_item_4,
                withholding_item_5: req.body.withholding_item_5,
                withholding_item_5_title: req.body.withholding_item_5_title,

                green_item_1: req.body.green_item_1,
                green_item_2: req.body.green_item_2,
                green_item_3: req.body.green_item_3,
                green_item_4: req.body.green_item_4,
                green_item_5: req.body.green_item_5,
                green_item_6: req.body.green_item_6,
                green_item_7: req.body.green_item_7,
                green_item_8: req.body.green_item_8,
                green_item_8_title: req.body.green_item_8_title,
                green_item_9: req.body.green_item_9,
                green_item_9_title: req.body.green_item_9_title,
                green_item_10: req.body.green_item_10,
                green_item_10_title: req.body.green_item_10_title,

                blue_item_1: req.body.blue_item_1,
                blue_item_1_hour: req.body.blue_item_1_hour,
                blue_item_2: req.body.blue_item_2,
                blue_item_3: req.body.blue_item_3,
                blue_item_4: req.body.blue_item_4,
                blue_item_5: req.body.blue_item_5,
                blue_item_6: req.body.blue_item_6,
                blue_item_6_title: req.body.blue_item_6_title,
                blue_item_7: req.body.blue_item_7,
                blue_item_7_title: req.body.blue_item_7_title,

            }
        }, function (err, wageItem) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_wage_manage_update_item");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: wageItem,
                });
            }
        });
    });

}