var User = require('../models/user');
var fs = require('fs');
var path = require('path')

const dirTemp = '../temp';
const fileStorageDir = '../OfficialDocs'


var Vendor = require('../models/officialDocVendor');
var OfficialDocItem = require('../models/officialDocItem');
var moment = require('moment-timezone');


module.exports = function (app) {

    // ----------- Vendor ------------
    app.get(global.apiUrl.get_fetch_official_doc_vendor, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get_fetch_official_doc_vendor");

        Vendor.find(
            {
            },
            function (err, vendors) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_fetch_official_doc_vendor");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: vendors,
                    });
                }
        })
    })

    // insert
    app.post(global.apiUrl.post_insert_official_doc_vendor, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_insert_official_doc_vendor");
        console.log(req.body);

        Vendor.create(
            {
                vendorName: req.body.vendorName
            },
            function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_insert_official_doc_vendor");
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
    app.post(global.apiUrl.post_update_official_doc_vendor, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_update_official_doc_vendor");
        console.log(req.body);

        Vendor.update(
            {
                _id: req.body._id
            },
            {
                $set: {
                    vendorName: req.body.vendorName,
                    isEnable: true,
                }
            },
            function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_update_official_doc_vendor");
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

    app.post(global.apiUrl.post_remove_official_doc_vendor, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_remove_official_doc_vendor");
        console.log(req.body);

        Vendor.remove(
            {
                _id: req.body._id
            }, function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_remove_official_doc_vendor");
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