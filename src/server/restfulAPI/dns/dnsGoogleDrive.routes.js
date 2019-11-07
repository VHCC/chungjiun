var fs = require('fs');
var moment = require('moment');
const dir = '../temp';

const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const TOKEN_PATH = 'token.json';

var oAuth2Client = null;

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    // authorize(JSON.parse(content), createSubFolder);
    authorize(JSON.parse(content));
});

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


function createDNSCloudFolder(auth, targetFolderName, folderID, callback) {
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
        'name': targetFolderName,
        parents: [folderID],
        'mimeType': 'application/vnd.google-apps.folder'
    };
    drive.files.create({
        resource: fileMetadata,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('-- create folder name: ' + targetFolderName + ', folder Id: ' + file.data.id);
            return callback(file.data.id);
        }
    });
}

function getCloudFile(auth, fileID, callback) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.get({
            fileId: fileID,
            fields: 'thumbnailLink, name'
            // fields: '*'
        }, function(err, res){
            if (err) {
                // Handle error
                console.error(err);
            } else {
                // console.log(res.data);
                callback(res.data);
            }
        }
    );
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getDriveFolderID(auth, targetFolderName, callback) {
    const drive = google.drive({version: 'v3', auth});

    var DNS_STORAGE_FOLDER_ID = '1AtKAtrZaa3PL7svM6AXDlhx32j-5jT16';
    var rootFolderID;

    var todayDate = moment(new Date()).format("YYYYMMDD");
    var isHasTodayDate = false;
    var isTargetExist = false;
    var targetFile;
    drive.files.list({
        pageSize: 1000,
        q: "mimeType='application/vnd.google-apps.folder'",
        // fields: 'nextPageToken, files(id, name)',
        fields: 'nextPageToken, files(id, name, parents)',
        // fields: '*',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        // console.log(files);
        if (files.length) {
            files.map((file) => {
                if (file.name == targetFolderName) {
                    console.log('$Folders:');
                    console.log(` - ${file.name} (${file.id}) [${file.parents}]`);
                    console.log("[" + targetFolderName + "] is exists.")
                    targetFile = file;
                    isTargetExist = true;
                }

                if (file.name == todayDate) {
                    console.log('%Folders:');
                    console.log(` - ${file.name} (${file.id}) [${file.parents}]`);
                    isHasTodayDate = true;
                }
            });

            if (isTargetExist) {
                return callback(targetFile.id);
            }

            console.log("isHasTodayDate= " + isHasTodayDate);

            if (!isHasTodayDate) {
                createDNSCloudFolder(oAuth2Client, todayDate, DNS_STORAGE_FOLDER_ID, function (todayFolderID) {
                    rootFolderID = todayFolderID;
                    createDNSCloudFolder(oAuth2Client, targetFolderName, rootFolderID, function (targetFolderID) {
                        console.log("- targetFolderID: " + targetFolderID);
                        return callback(targetFolderID);
                    });
                });
            } else {
                getDriveFolderID(oAuth2Client, todayDate, function (todayFolderID) {
                    rootFolderID = todayFolderID;
                    createDNSCloudFolder(oAuth2Client, targetFolderName, rootFolderID, function (targetFolderID) {
                        console.log("- targetFolderID: " + targetFolderID);
                        return callback(targetFolderID);
                    });
                })
            }
        } else {
            console.log('No files found.');
        }
    });
}

var fileName;

module.exports = function (app) {

    var multer = require('multer');

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir)
        },
        filename: function (req, file, cb) {
            fileName = req.body.name;
            console.log("build Official Doc name: " + fileName);
            cb(null, fileName);
        }
    });

    var upload = multer({storage: storage});

    // upload file
    app.post(global.apiUrl.post_dns_google_drive_upload_file,
        upload.single('file'),
        function (req, res) {
            uploadFile(oAuth2Client);

            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
            // req.file is the `avatar` file
            // req.body will hold the text fields, if there were any
        })


    // test
    app.get(global.apiUrl.get_dns_google_drive_test, function (req, res) {

        var fileID = "1dY0f6-lELIweHYtZISKbY6ahtjvX7gD7";
        getCloudFile(oAuth2Client, fileID, function (resData) {
            console.log(resData);
            res.status(200).send({
                code: 200,
                error: global.status._200,
                fileName: resData.name,
                fileUrl: resData.thumbnailLink
            });
        })
    })

    // get folder id by specific folder name
    app.get(global.apiUrl.post_dns_google_drive_get_folder_id, function (req, res) {
        var folderName = req.body.folderName;
        getDriveFolderID(oAuth2Client, folderName, function (folderID) {
            console.log("folderName: " + folderName + ", folderID: " + folderID);
            res.status(200).send({
                code: 200,
                error: global.status._200,
                folderName: folderName,
                folderID: folderID
            });
        })
    })

    // get file
    // post_dns_google_drive_get_file



}


// ***************

/**
 * Create an OAuth2 client with the given credentials, and then execute the given callback function.
 */
// function authorize(credentials, callback) {
function authorize(credentials) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
        // callback(oAuth2Client);
    });
}

// function getAccessToken(oAuth2Client, callback) {
function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
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
            // callback(oAuth2Client);
        });
    });
}