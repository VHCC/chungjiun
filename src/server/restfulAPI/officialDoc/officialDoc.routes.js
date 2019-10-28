var User = require('../models/user');
var fs = require('fs');
const dir = '../temp';
var Vendor = require('../models/officialDocVendor');
var OfficialDocItem = require('../models/officialDocItem');

const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const TOKEN_PATH = 'token.json';

// fs.readFile('credentials.json', (err, content) => {
//     if (err) return console.log('Error loading client secret file:', err);
//     // Authorize a client with credentials, then call the Google Drive API.
//     authorize(JSON.parse(content), uploadFile);
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the given callback function.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Describe with given media and metaData and upload it using google.drive.create method()
 */
function uploadFile(auth) {
    const drive = google.drive({version: 'v3', auth});
    const fileMetadata = {
        'name': fileName
    };
    const media = {
        mimeType: 'image/jpeg',
        // body: fs.createReadStream('photo.jpg')
        body: fs.createReadStream(dir + '/' + fileName)
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, (err, file) => {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ' + file.data.id);
        }
    });
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

var fileName;

module.exports = function (app) {
// application -------------------------------------------------------------
    var multer = require('multer');

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir)
        },
        filename: function (req, file, cb) {
            console.log(file)
            fileName = req.body.userDID + ".jpg";
            console.log("build Official Doc name: " + req.body.userDID + ".jpg");
            cb(null, req.body.userDID + '.jpg');
        }
    });

    var upload = multer({storage: storage});

    // upload file
    app.post(global.apiUrl.post_official_doc_upload_file,
        upload.single('file'),
        function (req, res) {

            fs.readFile('credentials.json', (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                // Authorize a client with credentials, then call the Google Drive API.
                authorize(JSON.parse(content), uploadFile);
            });

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
        console.log(req.body);
        OfficialDocItem.create(
            {
                creatorDID: req.body.creatorDID,
                vendorDID: req.body.vendorItem._id,
                receiveDate: req.body._receiveDate,
                dueDate: req.body._dueDate,
                prjDID: req.body.prjItem._id,
                chargerDID: req.body.chargeUser._id,
                subject: req.body._subject,
                archiveNumber: req.body._archiveNumber,
                receiveType: req.body._receiveType,
                receiveNumber: req.body._receiveNumber,
                docType: req.body.docOption.option,
            },
            function (err) {
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

    app.post(global.apiUrl.post_insert_official_doc_vendor, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_insert_official_doc_vendor");
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

}