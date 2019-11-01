var User = require('../models/user');
var fs = require('fs');
const dir = '../temp';
var DNSPlayRoom = require('../dns/models/dnsPlayRoom');

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

function createFolder(auth) {
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
        'name': 'DrawNSend',
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
            // console.log(file);
            console.log('Folder Id: ' + file.data.id);
        }
    });
}

function createSubFolder(auth) {
    const drive = google.drive({version: 'v3', auth});
    var folderId = '15WflLe-UdxwHeaYfsGv64N9rOpR1AUJ4';
    var fileMetadata = {
        'name': 'DrawNSend',
        parents: [folderId],
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
            console.log('Folder Id: ' + file.data.id);
        }
    });
}

// function getAccessToken(oAuth2Client, callback) {
function getAccessToken(oAuth2Client) {
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
            // callback(oAuth2Client);
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
            // console.log(file)
            fileName = req.body.userDID + ".jpg";
            console.log("build Official Doc name: " + req.body.userDID + ".jpg");
            cb(null, req.body.userDID + '.jpg');
        }
    });

    var upload = multer({storage: storage});

    // upload file
    app.post(global.apiUrl.post_dns_upload_file,
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

    // check server status
    app.get(global.apiUrl.get_dns_check_server_status, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get_dns_check_server_status");
        res.status(200).send({
            code: 200,
            error: global.status._200,
        });
    });

    // create room
    app.post(global.apiUrl.post_dns_create_game_room, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_create_game_room");
        console.log(req.body);

        var participants = [req.body.roomOwner];
        DNSPlayRoom.create(
            {
                roomOwner: req.body.roomOwner,
                playTime: req.body.playTime,
                joinNumber: Math.floor(100000 + Math.random() * 900000),
                participants: participants,
            },
            function (err, room) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_create_game_room");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: room
                    });
                }
            })
    })


    // get room info

    // check is Owner
    app.post(global.apiUrl.post_dns_check_room_owner, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_check_room_owner");

        DNSPlayRoom.find(
            {
                joinNumber: req.body.joinNumber,
                roomOwner: {
                    $in : req.body.player
                }
            }, function (err, room) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_join_game_room");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: room
                    });
                }
            })
    })

    // join room
    app.post(global.apiUrl.post_dns_join_game_room, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_join_game_room");

        console.log(req.body);

        DNSPlayRoom.updateOne(
            {
                joinNumber: req.body.joinNumber,
                participants: {
                    $nin: req.body.player
                }
            }, {
                $push: {
                    participants: req.body.player,
                }
            }, function (err, result) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_join_game_room");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    console.log(result);
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: result
                    });
                }
            })

        // DNSPlayRoom.updateOne(
        //     {
        //         joinNumber: req.body.joinNumber
        //     }, {
        //         $push: {
        //             participants: req.body.player,
        //         }
        //     }, function (err, room) {
        //         if (err) {
        //             console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_join_game_room");
        //             console.log(req.body);
        //             console.log(" ***** ERROR ***** ");
        //             console.log(err);
        //             res.send(err);
        //         } else {
        //             res.status(200).send({
        //                 code: 200,
        //                 error: global.status._200,
        //                 payload: room
        //             });
        //         }
        //     })
    })

    // quit room
    app.post(global.apiUrl.post_dns_quit_game_room, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_quit_game_room");

        DNSPlayRoom.updateOne(
            {
                joinNumber: req.body.joinNumber
            }, {
                $pull: {
                    participants: req.body.player,
                }
            }, function (err, room) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_quit_game_room");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: room
                    });
                }
            })

        // DNSPlayRoom.update,(
        //     {
        //         joinNumber: req.body.joinNumber
        //     }, {
        //         $pull: {
        //             participants: aaa
        //         }
        //     }, {
        //         multi: true
        //     }, function (err, room) {
        //         if (err) {
        //             console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_quit_game_room");
        //             console.log(req.body);
        //             console.log(" ***** ERROR ***** ");
        //             console.log(err);
        //             res.send(err);
        //         } else {
        //             res.status(200).send({
        //                 code: 200,
        //                 error: global.status._200,
        //                 payload: room
        //             });
        //         }
        //     })
    })

    // update room status
    app.post(global.apiUrl.post_dns_update_game_room_status, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_update_game_room_status");
        console.log(req.body);

        DNSPlayRoom.update(
            {
                joinNumber: req.body.joinNumber
            }, {
                $set: {
                    roomStatus: req.body.roomStatus,
                }
            }, function (err, room) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_update_game_room_status");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: room
                    });
                }
            })
    })


}