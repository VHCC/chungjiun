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

    var storage_public_fs = multer.diskStorage({
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

            // if (!fs.existsSync(dirTemp + '/' + req.body.userDID)){
            //     fs.mkdirSync(dirTemp + '/' + req.body.userDID);
            // }

            if (!fs.existsSync(fileStorageDir + "/" + req.body.folder + "/" + subTarget)){
                fs.mkdirSync(fileStorageDir + "/" + req.body.folder + "/" + subTarget);
            }

            cb(null, fileStorageDir + "/" + req.body.folder + "/" + subTarget);
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

    var upload_public_fs = multer({storage: storage_public_fs});

    // PUBLIC
    // upload file to cache
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

    // upload file to fs
    app.post(global.apiUrl.post_official_doc_upload_file_public_fs,
        upload_public_fs.single('file'),
        function (req, res) {
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
            // req.file is the `avatar` file
            // req.body will hold the text fields, if there were any
        })

    // update item
    app.post(global.apiUrl.post_official_doc_update_item_public, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_update_item_public");
        console.log(req.body);

        try {
            if (req.body.old_archiveNumber) {

                var oldDir = fileStorageDir + '/' + req.body.old_archiveNumber + getDivision(req.body.old_docDivision.option);
                var newDir = fileStorageDir + '/'  + req.body.archiveNumber + getDivision(req.body.docDivision);

                fs.rename(oldDir, newDir, function (err) {
                    if (err) throw err;
                    console.log('renamed complete');
                });
            }
        } catch (e) {
            console.log(e)
        }

        var keyArray = Object.keys(req.body);
        var updateRequest = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "updateRequest.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }

        delete updateRequest._id;
        console.log("--- updateRequest ---");
        console.log(updateRequest);

        OfficialDocItem.updateOne(
            {
                _id:req.body._id

            }, {
                $set: updateRequest
            }, function (err, result) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_update_item_public");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: result
                    });
                }
            })
    })

    // remove file from cache
    app.post(global.apiUrl.post_official_doc_delete_file_public, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_delete_file_public");
        console.log(req.body);

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
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_delete_file_public");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                console.log(req.body.fileName + ' has been Deleted');
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        });
    })

    // remove doc file from storage
    app.post(global.apiUrl.post_official_doc_delete_file_public_from_fs, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_delete_file_public_from_fs");
        console.log(req.body);

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

        var fetchDir = fileStorageDir + '/' + req.body.archiveNumber + "/" + subTarget;
        fs.unlink(fetchDir + '/' + req.body.fileName, function (err) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_delete_file_public_from_fs");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                console.log(req.body.fileName + ' has been Deleted');
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        });
    })

    // 20200406
    // 發文暫存檔
    app.post(global.apiUrl.post_official_doc_create_item_public_temp, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_create_item_public_temp");
        console.log(req.body);

        var _year = moment().format('YYYY') - 1911;

        var _month = moment().format('MM');

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
                // publicDate: req.body._publicDate, // 20200406 行政階段決定

                signerDID: req.body.signer._id,
                handlerDID: req.body.creatorDID,
                // handlerDID: req.body.chargeUser._id,
                chargerDID: req.body.creatorDID,
                subject: req.body._subject,
                archiveNumber: req.body._archiveNumber,
                // receiveType: req.body._receiveType,
                // receiveNumber: req.body._receiveNumber,
                // docType: req.body.docOption.option, // 20200406 行政階段決定
                // docDivision: req.body.docDivision.option, // 20200406 行政階段決定
                // publicType: req.body.docType.option, // 20200406 行政階段決定

                timestamp: req.body.timestamp,

                stageInfo: req.body.stageInfo,

                // targetOrigin: req.body.vendorItem, // 20200406 行政階段決定
                // targetCopy: req.body.vendorItemCopy, // 20200406 行政階段決定

                isAttached: req.body.isAttached,

                type: 1,
            }, function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_create_item_public_temp");
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

    app.post(global.apiUrl.post_official_doc_create_item_public, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_create_item_public");
        console.log(req.body);

        var _year = moment(req.body._publicDate).format('YYYY') - 1911;

        var _month = moment(req.body._publicDate).format('MM');

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
                docDivision: req.body.docDivision.option,
                publicType: req.body.docType.option,

                timestamp: req.body.timestamp,

                stageInfo: req.body.stageInfo,

                targetOrigin: req.body.vendorItem,
                targetCopy: req.body.vendorItemCopy,

                isAttached: req.body.isAttached,

                type: 1,
            }, function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_create_item_public");
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
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_fetch_file_public");
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
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_fetch_file_public");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
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
        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_get_file_public");
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
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_get_file_public");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.send(data);
                }
            });
    })

    // download file
    app.post(global.apiUrl.post_official_doc_download_file_public, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_download_file_public");
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
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_download_file_public");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
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
                    // console.log(items);
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: items
                    });
                }
            });
    })


    // generate item archive number public doc
    app.post(global.apiUrl.post_official_doc_create_item_archive_number_public, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_create_item_archive_number_public");
        console.log(req.body);

        var publicDate = moment(req.body.publicDate).format('YYYY/MM/DD');
        var year = moment(req.body.publicDate).format('YYYY') - 1911;
        var month = moment(req.body.publicDate).format('MM');

        var day = moment(req.body.publicDate).format('DD');

        OfficialDocItem.find(
            {
                docDivision: req.body.docDivision,
                publicDate: publicDate,
                type: req.body.type
            }, function (err, items) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_create_item_archive_number_public");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {

                    var result = "" + year + month + day + "";

                    if (items.length == 0) {
                        result += ("00" + (items.length + 1));
                    } else {
                        var archiveNumber = items[items.length - 1].archiveNumber.substring(7, 10);
                        var numberString = (parseInt(archiveNumber) + 1).toString();
                        if (numberString.length == 1) {
                            numberString = "00" + numberString;
                        } else if (numberString.length == 2) {
                            numberString = "0" + numberString;
                        }
                        result += numberString;
                    }

                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: result,
                    });
                }
            })
    })

    const getDivision = function (type) {
        switch (type) {
            case 0:
                return "F";
            case 1:
                return "N";
            case 2:
                return "G";
            case 3:
                return "D";
            case 4:
                return "P"
        }
    };

    // delete item
    app.post(global.apiUrl.post_official_doc_delete_item_public, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_delete_item_public");
        console.log(req.body);

        OfficialDocItem.remove(
            {
                _id:req.body._id

            }, function (err, result) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_delete_item_public");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {

                    var deleteFolder = fileStorageDir + '/' + req.body.folder;

                    deleteFolderRecursive(deleteFolder);

                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: result
                    });
                }
            })
    })

    const deleteFolderRecursive = function(dir) {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach((file, index) => {
                const curPath = path.join(dir, file);
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dir);
        }
    };

}