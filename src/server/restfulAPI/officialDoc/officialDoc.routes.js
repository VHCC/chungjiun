var User = require('../models/user');
var fs = require('fs');
const dir = '../temp';

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


}