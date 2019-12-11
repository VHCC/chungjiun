var User = require('../models/user');
var fs = require('fs');
const dir = '../temp';
var Vendor = require('../models/officialDocVendor');
var OfficialDocItem = require('../models/officialDocItem');
var moment = require('moment');


module.exports = function (app) {
// application -------------------------------------------------------------
    var multer = require('multer');

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir)
        },
        filename: function (req, file, cb) {
            console.log("build Official Doc name:" + req.body.userDID + ".pdf");
            cb(null, req.body.userDID + '.pdf');
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

    // remove file
    app.post(global.apiUrl.post_official_doc_delete_file, function (req, res) {

        fs.unlink(dir + '/' + req.body.userDID + '.pdf', function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log('File has been Deleted');
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        });
    })

    // detect is there attachments ?
    app.post(global.apiUrl.post_official_doc_detect_file, function (req, res) {

        fs.readdir(dir, function (err, files) {

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
    app.post(global.apiUrl.post_official_doc_fetch_file, function (req, res) {
        fs.readdir(dir, function (err, files) {
            if (err) {
                // some sort of error
            } else {
                // console.log("files= " + files.length);
                if (!files.length) {
                    // directory appears to be empty
                } else {

                    var filesResult = [];

                    for (var index = 0; index < files.length; index++) {
                        var pdfItem = {
                            name: files[index]
                        };
                        // console.log(files[index]);
                        // console.log(files[index].indexOf(".pdf"));
                        if (files[index].indexOf(".pdf") > 0) {
                            var stats = fs.statSync(dir + "/" + files[index]);
                            // console.log(stats.size + " bytes");
                            // console.log(Math.round(stats.size / 1000) + " KB");
                            pdfItem.size = Math.round(stats.size / 1000) + " KB";
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
    })

    // get file
    app.post(global.apiUrl.post_official_doc_get_file, function (req, res) {

        console.log(req.body);

        fs.readFile(dir + '/' + req.body.fileName,
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
        fs.readFile(dir + '/' + req.body.fileName,
            'base64',
            function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(data);
                }
            });
    })

    // ----------- item ------------
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

                receiveDate: req.body._receiveDate,
                lastDate: req.body._lastDate,
                dueDate: req.body._dueDate,

                chargerDID: req.body.chargeUser._id,
                subject: req.body._subject,
                archiveNumber: req.body._archiveNumber,
                receiveType: req.body._receiveType,
                receiveNumber: req.body._receiveNumber,
                docType: req.body.docOption.option,

                timestamp: req.body.timestamp,
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