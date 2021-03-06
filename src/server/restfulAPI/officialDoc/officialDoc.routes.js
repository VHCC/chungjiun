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

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (!fs.existsSync(dirTemp + '/' + req.body.userDID)){
                fs.mkdirSync(dirTemp + '/' + req.body.userDID);
            }
            cb(null, dirTemp + '/' + req.body.userDID);
        },
        filename: function (req, file, cb) {
            console.log(req.body);
            // console.log("build Official Doc name:" + req.body.userDID + ".pdf");
            // cb(null, req.body.userDID + '.pdf');
            console.log("build Official Doc name: " + req.body.fileName);
            cb(null, req.body.fileName);
        }
    });

    var upload = multer({storage: storage});

    // upload file
    app.post(global.apiUrl.post_official_doc_upload_file,
        upload.single('file'),
        function (req, res) {
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
            // req.file is the `avatar` file
            // req.body will hold the text fields, if there were any
        })

    // remove file from cache
    app.post(global.apiUrl.post_official_doc_delete_file, function (req, res) {

        // fs.unlink(dir + '/' + req.body.userDID + '.pdf', function (err) {
        fs.unlink(dirTemp + '/' + req.body.userDID + '/' + req.body.fileName, function (err) {
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

    // detect is there attachments ?
    // @Deprecated
    app.post(global.apiUrl.post_official_doc_detect_file, function (req, res) {

        fs.readdir(dirTemp, function (err, files) {

            console.log(files);

            if (err) {
                // some sort of error
            } else {
                console.log("files= " + files.length);
                if (!files.length) {
                    // directory appears to be empty
                } else {
                    res.status(200).send({
                        code: 200,
                        payload: files,
                        error: global.status._200,
                    });
                }
            }
        });
    })

    // fetch files
    // from storage
    app.post(global.apiUrl.post_official_doc_fetch_file, function (req, res) {

        console.log(req.body);

        var fetchDir = fileStorageDir + '/' + req.body.archiveNumber;

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

    // rename folder and files
    // from cache to Storage
    app.post(global.apiUrl.post_official_doc_rename_and_folder, function (req, res) {
        console.log(req.body);

        var cacheDir = dirTemp + '/' + req.body.userDID;

        if (!fs.existsSync(cacheDir)){

            var archiveDir = fileStorageDir + '/' + req.body._archiveNumber

            if (!fs.existsSync(archiveDir)){
                fs.mkdirSync(archiveDir);
            }

            res.status(200).send({
                code: 200,
                error: global.status._200,
            });

        } else {
            var archiveDir = fileStorageDir + '/' + req.body._archiveNumber

            if (!fs.existsSync(archiveDir)){
                fs.mkdirSync(archiveDir);
            }

            fs.readdir(cacheDir, function (err, files) {
                files.forEach(function(fileName) {
                    console.log("file= " + fileName);
                    console.log("extname= " + path.extname(fileName));

                    if (path.extname(fileName).indexOf(".") > -1 ) {
                        var oldPath = cacheDir + '/' + fileName;
                        var newPath = archiveDir + '/' + fileName;

                        fs.rename(oldPath, newPath, function (err) {
                            if (err) throw err
                            console.log('Successfully renamed - AKA moved!')
                        })
                    }

                    if (fileName == 'origin') {

                        fs.readdir(cacheDir + "/" + fileName, function (err, subFiles) {
                            subFiles.forEach(function(subFileName) {
                                var oldPath = cacheDir + "/" + fileName + '/' + subFileName;
                                var newPath = archiveDir + "/" + fileName + '/' + subFileName;

                                if (!fs.existsSync(archiveDir + "/" + fileName)){
                                    fs.mkdirSync(archiveDir + "/" + fileName);
                                }

                                fs.rename(oldPath, newPath, function (err) {
                                    if (err) throw err
                                    console.log('Successfully renamed - AKA moved!')
                                })
                            });
                        });
                    }

                    if (fileName == 'copy') {
                        fs.readdir(cacheDir + "/" + fileName, function (err, subFiles) {
                            subFiles.forEach(function(subFileName) {
                                var oldPath = cacheDir + "/" + fileName + '/' + subFileName;
                                var newPath = archiveDir + "/" + fileName + '/' + subFileName;

                                if (!fs.existsSync(archiveDir + "/" + fileName)){
                                    fs.mkdirSync(archiveDir + "/" + fileName);
                                }

                                fs.rename(oldPath, newPath, function (err) {
                                    if (err) throw err
                                    console.log('Successfully renamed - AKA moved!')
                                })
                            });
                        });
                    }

                });
            });
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        }
    })

    // rename folder and files
    // from temppublic to Formal Public
    app.post(global.apiUrl.post_official_doc_rename_and_folder_public, function (req, res) {
        console.log(req.body);

        var tempDir = fileStorageDir + '/' + req.body.tempFolderName;

        if (!fs.existsSync(tempDir)){

            var archiveDir = fileStorageDir + '/' + req.body._archiveNumber

            if (!fs.existsSync(archiveDir)){
                fs.mkdirSync(archiveDir);
            }

            res.status(200).send({
                code: 200,
                error: global.status._200,
            });

        } else {
            var archiveDir = fileStorageDir + '/' + req.body._archiveNumber

            if (!fs.existsSync(archiveDir)){
                fs.mkdirSync(archiveDir);
            }

            fs.readdir(tempDir, function (err, files) {
                files.forEach(function(fileName) {
                    console.log("file= " + fileName);
                    console.log("extname= " + path.extname(fileName));

                    if (path.extname(fileName).indexOf(".") > -1 ) {
                        var oldPath = tempDir + '/' + fileName;
                        var newPath = archiveDir + '/' + fileName;

                        fs.rename(oldPath, newPath, function (err) {
                            if (err) throw err
                            console.log('Successfully renamed - AKA moved!')
                        })
                    }

                    if (fileName == 'origin') {

                        fs.readdir(tempDir + "/" + fileName, function (err, subFiles) {
                            subFiles.forEach(function(subFileName) {
                                var oldPath = tempDir + "/" + fileName + '/' + subFileName;
                                var newPath = archiveDir + "/" + fileName + '/' + subFileName;

                                if (!fs.existsSync(archiveDir + "/" + fileName)){
                                    fs.mkdirSync(archiveDir + "/" + fileName);
                                }

                                fs.rename(oldPath, newPath, function (err) {
                                    if (err) throw err
                                    console.log('Successfully renamed - AKA moved!')
                                })
                            });
                        });
                    }

                    if (fileName == 'copy') {
                        fs.readdir(tempDir + "/" + fileName, function (err, subFiles) {
                            subFiles.forEach(function(subFileName) {
                                var oldPath = tempDir + "/" + fileName + '/' + subFileName;
                                var newPath = archiveDir + "/" + fileName + '/' + subFileName;

                                if (!fs.existsSync(archiveDir + "/" + fileName)){
                                    fs.mkdirSync(archiveDir + "/" + fileName);
                                }

                                fs.rename(oldPath, newPath, function (err) {
                                    if (err) throw err
                                    console.log('Successfully renamed - AKA moved!')
                                })
                            });
                        });
                    }

                });
            });
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        }
    })

    // get file
    // from storage
    app.post(global.apiUrl.post_official_doc_get_file, function (req, res) {

        console.log(req.body);

        var storageDir = fileStorageDir + '/' + req.body.archiveNumber

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
    app.post(global.apiUrl.post_official_doc_download_file, function (req, res) {

        // var files = fs.createReadStream(dir + '/' + req.body.fileName);
        // res.writeHead(200, {
        //     'Content-disposition': 'attachment; filename=demo.pdf'
        // }); //here you can add more headers
        // files.pipe(res)
        var storageDir = fileStorageDir + '/' + req.body.archiveNumber

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

    // ----------- official doc item ------------

    app.post(global.apiUrl.post_official_doc_create_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_create_item");

        var _year = moment(req.body._receiveDate).format('YYYY') - 1911;
        console.log(_year);

        var _month = moment(req.body._receiveDate).format('MM');
        console.log(_month);

        console.log(req.body);

        OfficialDocItem.create(
            {
                creatorDID: req.body.creatorDID,

                year: _year,
                month: _month,

                vendorDID: req.body.vendorItem._id,
                prjDID: req.body.prjItem._id,
                prjCode: req.body.prjItem.prjCode,

                receiveDate: req.body._receiveDate,
                lastDate: req.body._lastDate,
                dueDate: req.body._dueDate,
                officialPublicDate: req.body._officialPublicDate,

                handlerDID: req.body.chargeUser._id,
                chargerDID: req.body.chargeUser._id,
                signerDID: req.body.signer._id,
                subject: req.body._subject,
                archiveNumber: req.body._archiveNumber,
                receiveType: req.body._receiveType,
                receiveNumber: req.body._receiveNumber,
                docType: req.body.docOption.option,
                docDivision: req.body.docDivision.option,
                docAttachedType: req.body.docAttachedType.option,

                isAttached: req.body.isAttached,

                timestamp: req.body.timestamp,

                stageInfo: req.body.stageInfo,

                type: 0,
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

    // fetch all
    app.get(global.apiUrl.get_official_doc_fetch_all_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get_official_doc_fetch_all_item");
        OfficialDocItem.find(
            {
            }, function (err, items) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, get_official_doc_fetch_all_item");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: items
                    });
                }
            })
    })

    // fetch period
    app.post(global.apiUrl.post_official_doc_fetch_item_period, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_fetch_item_period");
        console.log(req.body);

        var query = {
            receiveDate:
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
                "receiveDate": 1,
            })
            .exec(function (err, items) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_fetch_item_period");
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

    // search by parameters
    app.post(global.apiUrl.post_official_doc_search_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_search_item");

        console.log(req.body);

        var query = {};

        if (req.body._id !== null
            && req.body._id !== undefined) {
            query._id = req.body._id;
        }

        if (req.body.chargerDID !== null
            && req.body.chargerDID !== undefined) {
            query.chargerDID = req.body.chargerDID;
        }

        if (req.body.handlerDID !== null
            && req.body.handlerDID !== undefined) {
            query.handlerDID = req.body.handlerDID;
        }

        if (req.body.isDocClose !== null
            && req.body.isDocClose !== undefined) {
            query.isDocClose = req.body.isDocClose;
        }

        if (req.body.isDocOpened !== null
            && req.body.isDocOpened !== undefined) {
            query.isDocOpened = req.body.isDocOpened;
        }

        if (req.body.isDocSignStage !== null
            && req.body.isDocSignStage !== undefined) {
            query.isDocSignStage = req.body.isDocSignStage;
        }

        if (req.body.type !== null
            && req.body.type !== undefined) {
            query.type = req.body.type;
        }

        if (req.body.isDocCanPublic !== null
            && req.body.isDocCanPublic !== undefined) {
            query.isDocCanPublic = req.body.isDocCanPublic;
        }

        if (req.body.isDocPublic !== null
            && req.body.isDocPublic !== undefined) {
            query.isDocPublic = req.body.isDocPublic;
        }

        if (req.body.archiveNumber !== null
            && req.body.archiveNumber !== undefined) {
            query.archiveNumber = req.body.archiveNumber;
        }

        if (req.body.docDivision !== null
            && req.body.docDivision !== undefined) {
            query.docDivision = req.body.docDivision;
        }

        if (req.body.isCounterSign !== null
            && req.body.isCounterSign !== undefined) {
            query.isCounterSign = req.body.isCounterSign;
        }

        if (req.body.signerDID !== null
            && req.body.signerDID !== undefined) {
            query.signerDID = req.body.signerDID;
        }

        // 會簽
        if (req.body.counterDID !== null
            && req.body.counterDID !== undefined) {

            var $elemMatch = {
                _id: req.body.counterDID,
            }

            query.counterSignList = {
                $elemMatch
            };

        }

        console.log(" === query ===");
        console.log(query);

        OfficialDocItem.find(
                query,
                function (err, items) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_search_item");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.send(err);
                    } else {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            payload: items
                        });
                    }
            })
    })

    // search by managerID
    app.post(global.apiUrl.post_official_doc_search_item_by_managerID, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_search_item_by_managerID");
        console.log(req.body);

        var keyArray = Object.keys(req.body);
        var findRequest = {};
        for (var index = 0; index < keyArray.length; index++) {
            var evalString = "findRequest.";
            evalString += keyArray[index];

            var evalFooter = "req.body.";
            evalFooter += keyArray[index];
            eval(evalString + " = " + evalFooter);
        }

        delete findRequest.managerID;
        console.log("--- findRequest ---");
        console.log(findRequest);

        OfficialDocItem.aggregate( // 由專案找起
            [
                {
                    $match: findRequest
                },
                {
                    $addFields: {
                        // "_projectTargetString": {
                        //     $toString: "$_id"
                        // },
                        "_project_info" : "$$CURRENT",
                        "_prjDID" : "$$CURRENT.prjDID"
                    }
                },
                {
                    $addFields: {
                        "_prjDIDObj": {
                            $toObjectId: "$_prjDID"
                        },
                    }
                },
                {
                    $lookup: {
                        from: "projects", // 年跟月的屬性
                        localField: "_prjDIDObj",
                        foreignField: "_id",
                        as: "_prjInfo"
                    }
                },
                {
                    $unwind: "$_prjInfo"
                },
                {
                    $addFields: {
                        "_prjManagerID": "$_prjInfo.managerID"
                    }
                },
                {
                    $match: {
                        _prjManagerID: req.body.managerID
                    }
                },

            ], function (err, results) {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: results,
                    });
                }
            }
        )
    })


    // update item
    app.post(global.apiUrl.post_official_doc_update_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_update_item");
        console.log(req.body);

        try {
            if (req.body.old_archiveNumber) {

                var oldDir = fileStorageDir + '/' + getDivision(req.body.old_docDivision.option) + req.body.old_archiveNumber;
                var newDir = fileStorageDir + '/' + getDivision(req.body.docDivision) + req.body.archiveNumber;

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
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_update_item");
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

    // delete item
    app.post(global.apiUrl.post_official_doc_delete_item, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_delete_item");

        console.log(req.body);

        OfficialDocItem.remove(
            {
                _id:req.body._id

            }, function (err, result) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_delete_item");
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

    // generate item archive number
    app.post(global.apiUrl.post_official_doc_create_item_archive_number, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_official_doc_create_item_archive_number");

        var receiveDate = moment(req.body.receiveDate).format('YYYY/MM/DD');

        var year = moment(req.body.receiveDate).format('YYYY') - 1911;
        var month = moment(req.body.receiveDate).format('MM');
        var day = moment(req.body.receiveDate).format('DD');

        console.log(req.body);

        OfficialDocItem.find(
            {
                docDivision: req.body.docDivision,
                receiveDate: receiveDate,
                type: req.body.type
            }).sort({
                archiveNumber: 1
            }).exec(function (err, items) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_official_doc_create_item_archive_number");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    var result = "" + year + month + day + "";

                    if (items.length == 0) {
                        result += ("00" + (items.length + 1));
                    } else {
                        // var archiveNumber = items[items.length - 1].archiveNumber.substring(7, 10);
                        var numberString = (parseInt(items.length) + 1).toString();

                        // console.log(archiveNumber);
                        // console.log(numberString);
                        if (numberString.length == 1) {
                            numberString = "00" + numberString;
                        } else if (numberString.length == 2) {
                            numberString = "0" + numberString;
                        }
                        result += numberString;
                    }
                    // console.log(result)
                    var itemsLength = items.length
                    // console.log(items)

                    var isNeedToCheck = true;

                    while (isNeedToCheck) {
                        if (!isOfficialDocArchiveNumberExist(items, result)) {
                            isNeedToCheck = false;

                            res.status(200).send({
                                code: 200,
                                error: global.status._200,
                                payload: result,
                            });
                        } else {
                            // console.log("itemsLength= " + itemsLength)
                            // console.log("result= " + result)
                            itemsLength += 1
                            result = "" + year + month + day + "";
                            var numberString = (parseInt(itemsLength) + 1).toString();

                            // console.log(archiveNumber);
                            // console.log(numberString);
                            if (numberString.length == 1) {
                                numberString = "00" + numberString;
                            } else if (numberString.length == 2) {
                                numberString = "0" + numberString;
                            }
                            result += numberString;
                        }
                    }

                    function isOfficialDocArchiveNumberExist(items, archiveNumber) {
                        for (var index = 0; index < items.length; index++) {
                            if (archiveNumber == items[index].archiveNumber) {
                                return true
                            }
                        }
                        return false
                    };

                }
            });

    })

}