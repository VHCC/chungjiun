var User = require('../models/user');
var fs = require('fs');
var path = require('path')

const dirTemp = '../temp';
const fileStorageDir = '../OfficialDocs'


var Vendor = require('../models/officialDocVendor');
var OfficialDocItem = require('../models/officialDocItem');
var moment = require('moment');


module.exports = function (app) {

    // ------------ official Doc File (PDF) --------------
    var multer = require('multer');

    var storage_public = multer.diskStorage({
        destination: function (req, file, cb) {

            var subTarget = "";

            switch (req.body.type) {
                case '0':
                    subTarget = "origin";
                    // origin
                    break;
                case '1':
                    subTarget = "copy";
                    // copy
                    break;
            }

            if (!fs.existsSync(dirTemp + '/' + req.body.userDID)){
                fs.mkdirSync(dirTemp + '/' + req.body.userDID);
            }

            if (!fs.existsSync(dirTemp + '/' + req.body.userDID + "/" + subTarget)){
                fs.mkdirSync(dirTemp + '/' + req.body.userDID + "/" + subTarget);
            }

            cb(null, dirTemp + '/' + req.body.userDID + "/" + subTarget);
        },
        filename: function (req, file, cb) {
            console.log(req.body);
            // console.log("build Official Doc name:" + req.body.userDID + ".pdf");
            // cb(null, req.body.userDID + '.pdf');
            console.log("build Official Doc name: " + req.body.fileName);
            cb(null, req.body.fileName);
        }
    });

    var upload_public = multer({storage: storage_public});

    // PUBLIC
    // upload file
    app.post(global.apiUrl.post_official_doc_upload_file_public,
        upload_public.single('file'),
        function (req, res) {
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
            // req.file is the `avatar` file
            // req.body will hold the text fields, if there were any
        })

    // remove file from cache
    app.post(global.apiUrl.post_official_doc_delete_file_public, function (req, res) {

        var subTarget = "";

        switch (req.body.type) {
            case 0:
                subTarget = "origin";
                // origin
                break;
            case 1:
                subTarget = "copy";
                // copy
                break;
        }

        // fs.unlink(dir + '/' + req.body.userDID + '.pdf', function (err) {
        fs.unlink(dirTemp + '/' + req.body.userDID + '/' + subTarget + '/' + req.body.fileName, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log(req.body.fileName + ' has been Deleted');
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        });
    })

    app.post(global.apiUrl.post_official_doc_create_item_public, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_create_item");

        var _year = moment(req.body._publicDate).format('YYYY') - 1911;
        console.log(_year);

        var _month = moment(req.body._publicDate).format('MM');
        console.log(_month);

        console.log(req.body);

        OfficialDocItem.create(
            {
                creatorDID: req.body.creatorDID,

                year: _year,
                month: _month,

                // vendorDID: req.body.vendorItem._id,
                prjDID: req.body.prjItem._id,
                prjCode: req.body.prjItem.prjCode,

                // receiveDate: req.body._receiveDate,
                // lastDate: req.body._lastDate,
                // dueDate: req.body._dueDate,
                publicDate: req.body._publicDate,

                handlerDID: req.body.creatorDID,
                // handlerDID: req.body.chargeUser._id,
                chargerDID: req.body.creatorDID,
                subject: req.body._subject,
                archiveNumber: req.body._archiveNumber,
                // receiveType: req.body._receiveType,
                // receiveNumber: req.body._receiveNumber,
                docType: req.body.docOption.option,
                publicType: req.body.docType.option,

                timestamp: req.body.timestamp,

                stageInfo: req.body.stageInfo,

                targetOrigin: req.body.vendorItem,
                targetCopy: req.body.vendorItemCopy,

                isAttached: req.body.isAttached,

                type: 1,
            }, function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_create_item");
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

    // fetch files
    // from storage
    app.post(global.apiUrl.post_official_doc_fetch_file_public, function (req, res) {

        console.log(req.body);

        var subTarget = ""

        if (req.body.type != null && req.body.type != undefined) {
            switch (req.body.type) {
                case 0:
                    subTarget = "origin";
                    // origin
                    break;
                case 1:
                    subTarget = "copy";
                    // copy
                    break;
            }
        }


        var fetchDir = fileStorageDir + '/' + req.body.archiveNumber + "/" + subTarget;

        if (!fs.existsSync(fetchDir)){
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        } else {
            // fs.readdir(dirTemp, function (err, files) {
            fs.readdir(fetchDir, function (err, files) {
                if (err) {
                    // some sort of error
                } else {
                    // console.log("files= " + files.length);
                    if (!files.length) {
                        // directory appears to be empty
                        res.status(200).send({
                            code: 200,
                            payload: filesResult,
                            error: global.status._200,
                        });
                    } else {

                        var filesResult = [];

                        for (var index = 0; index < files.length; index++) {
                            var pdfItem = {
                                name: files[index]
                            };
                            // if (files[index].indexOf(".pdf") > 0) {
                            //     // var stats = fs.statSync(dirTemp + "/" + files[index]);
                            //     var stats = fs.statSync(fetchDir + "/" + files[index]);
                            //     // console.log(stats.size + " bytes");
                            //     // console.log(Math.round(stats.size / 1000) + " KB");
                            //     pdfItem.size = Math.round(stats.size / 1000) + " KB";
                            //     filesResult.push(pdfItem);
                            // }

                            if (files[index].indexOf(".") > 0) {
                                // var stats = fs.statSync(dirTemp + "/" + files[index]);
                                var stats = fs.statSync(fetchDir + "/" + files[index]);
                                // console.log(stats.size + " bytes");
                                // console.log(Math.round(stats.size / 1000) + " KB");
                                pdfItem.size = Math.round(stats.size / 1000) + " KB";

                                if ((stats.size/ 1000) > 1000) {
                                    pdfItem.size = Math.round(stats.size / 1000 / 1000) + " MB";
                                }

                                filesResult.push(pdfItem);
                            }
                        }

                        res.status(200).send({
                            code: 200,
                            payload: filesResult,
                            error: global.status._200,
                        });
                    }
                }
            });
        }
    })

    // get file
    // from storage
    app.post(global.apiUrl.post_official_doc_get_file_public, function (req, res) {

        console.log(req.body);

        var subTarget = "";

        if (!req.body.isCopy) {
            subTarget = "origin";
        } else {
            subTarget = "copy";
        }

        var storageDir = fileStorageDir + '/' + req.body.archiveNumber + "/" + subTarget;

        // fs.readFile(dirTemp + '/' + req.body.fileName,
        fs.readFile(storageDir + '/' + req.body.fileName,
            'base64',
            function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(data);
                }
            });
    })

    // download file
    app.post(global.apiUrl.post_official_doc_download_file_public, function (req, res) {

        var subTarget = "";

        if (!req.body.isCopy) {
            subTarget = "origin";
        } else {
            subTarget = "copy";
        }

        var storageDir = fileStorageDir + '/' + req.body.archiveNumber + "/" + subTarget;

        // fs.readFile(dirTemp + '/' + req.body.fileName,
        fs.readFile(storageDir + '/' + req.body.fileName,
            'base64',
            function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(data);
                }
            });
    })


    // fetch period
    app.post(global.apiUrl.post_official_doc_fetch_item_period_public, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_fetch_item_period_public");
        console.log(req.body);

        var query = {
            publicDate:
                {
                    // $gte: "2019/12/01",
                    $gte: req.body.startDay,
                    // $lt:  "2019/12/07"
                    $lte:  req.body.endDay
                    // $lte:  endDate
                },
        }

        console.log(query);

        OfficialDocItem.find(query)
            .sort({
                "publicDate": 1,
            })
            .exec(function (err, items) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_fetch_item_period_public");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    console.log(items);
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: items
                    });
                }
            });
    })


    // generate item archive number
    app.post(global.apiUrl.post_official_doc_create_item_archive_number_public, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_create_item_archive_number_public");

        var publicDate = moment(req.body.publicDate).format('YYYY/MM/DD');

        var year = moment(req.body.publicDate).format('YYYY') - 1911;
        var month = moment(req.body.publicDate).format('MM');
        var day = moment(req.body.publicDate).format('DD');


        console.log(req.body);

        OfficialDocItem.find(
            {
                publicDate: publicDate
            }, function (err, items) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_create_item_archive_number_public");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {

                    var result = "" + year + month + day + "";

                    if (items.length <= 8 ) {
                        result += ("00" + (items.length + 1));
                    } else if (items.length > 8 && items.length <= 98) {
                        result += ("0" + (items.length + 1));
                    } else {
                        result += (items.length + 1);
                    }

                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: result,
                    });
                }
            })
    })

}