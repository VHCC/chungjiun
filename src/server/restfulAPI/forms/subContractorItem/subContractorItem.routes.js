var SubContractorItem = require('../../models/subContractorItem');
var moment = require('moment');

module.exports = function (app) {

    // ----------- fetch ------------
    app.post(global.apiUrl.post_fetch_sub_contractor_item_enabled, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_fetch_sub_contractor_item_enabled");
        console.log(req.body);

        SubContractorItem.find(
            {
                isEnable: req.body.isEnable,
            },
            function (err, targets) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_fetch_sub_contractor_item_enabled");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: targets,
                    });
                }
            })
    })

    // ----------- fetch all ------------
    app.post(global.apiUrl.post_fetch_all_sub_contractor_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_fetch_all_sub_contractor_item");
        console.log(req.body);

        SubContractorItem.find(
            {
            },
            function (err, targets) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_fetch_all_sub_contractor_item");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: targets,
                    });
                }
            })
    })

    // insert
    app.post(global.apiUrl.post_insert_sub_contractor_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_insert_sub_contractor_item");
        console.log(req.body);

        SubContractorItem.create(
            {
                subContractorItemName: req.body.subContractorItemName
            },
            function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_insert_sub_contractor_item");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                    });
                }
            })
    })

    // update
    app.post(global.apiUrl.post_update_sub_contractor_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_update_sub_contractor_item");
        console.log(req.body);

        SubContractorItem.update(
            {
                _id: req.body._id
            },
            {
                $set: {
                    subContractorItemName: req.body.subContractorItemName,
                    timestamp: req.body.timestamp,
                    isEnable: true,
                }
            },
            function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_update_sub_contractor_item");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                    });
                }
            })
    })

    // remove
    app.post(global.apiUrl.post_remove_sub_contractor_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_remove_sub_contractor_item");
        console.log(req.body);

        SubContractorItem.remove(
            {
                _id: req.body._id
            }, function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_remove_sub_contractor_item");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
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