var moment = require('moment');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');

// We need this to build our post string
var querystring = require('querystring');
var request = require('request');
var http = require('http');


var userModel = require('../server/restfulAPI/models/user');
var lineNotifyModel = require('../server/restfulAPI/models/lineNotifyObject');
var svnModel = require('../server/restfulAPI/models/supervisionNotifyItem');

var allUsersCache = [];

userModel.find({}, function (err, allUsers) {
    if (err) {
        console.log(err);
    } else {
        // console.log("user counts= " + allUsers.length);
        allUsersCache = [];
        allUsersCache[0] = {
            value: "",
            name: "None"
        };
        for (var i = 0; i < allUsers.length; i++) {
            allUsersCache[i] = {
                value: allUsers[i]._id,
                name: allUsers[i].name,
                cjMail: allUsers[i].cjMail,
            };
        }
    }
})

schedule.scheduleJob('0 * * * * *', function() {

    // console.log(" ======== 1 min ========== ");

    checkSVNTasks();
    // checkDueDateMail(-1, 2);
});

function checkSVNTasks() {
    svnModel.find({
        isSetup: true,
        isSend:false
        }, function (err, items) {
            if (err) {
                console.log(err);
            } else {
                // console.log(new moment());
                // console.log(moment(new Date()).format("YYYYMMDD HH:mm"));

                var svnIndex = 0;

                var syncSVNSendTask = false;
                var j = schedule.scheduleJob('* * * * * *', function(){

                    if (svnIndex < items.length) {

                        if (!syncSVNSendTask) {
                            syncSVNSendTask = true;

                            var svnItem = items[svnIndex]
                            console.log(svnItem);
                            var year = svnItem.year + 1911;
                            var msgDate = year.toString() + svnItem.month.toString() + svnItem.date.toString() + " " + svnItem.start_time;
                            // console.log(msgDate);
                            // if (msgDate == moment(new Date()).format("YYYYMMDD HH:mm")) {
                            console.log(" ====== task execute ======= ")

                            lineNotifyModel.findOne({
                                creatorDID: svnItem.creatorDID
                            }, function (err, lineNotifyObject) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    // console.log(lineNotifyObject)
                                    var auth = "Bearer " + lineNotifyObject.token;

                                    var form = {
                                        message: svnItem.msg,
                                    };

                                    var formData = querystring.stringify(form);
                                    var contentLength = formData.length;

                                    request({
                                        headers: {
                                            'Authorization': auth,
                                            // 'Content-Length': contentLength,
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        uri: 'https://notify-api.line.me/api/notify',
                                        body: formData,
                                        method: 'POST'
                                    }, function (err, res, body) {
                                        //it works!
                                        // console.log(res);
                                        // console.log(res.body);
                                        // console.log(res.body.status);
                                        // console.log(body);

                                        var bodyJson = JSON.parse(body)
                                        console.log(bodyJson);
                                        // console.log(bodyJson.status);
                                        if (bodyJson.status != 401) {
                                            svnModel.updateOne({
                                                _id: svnItem._id
                                            }, {$set:{
                                                    isSend: true
                                                }}, function (err, result) {
                                                // console.log(result);
                                            })
                                        }
                                        syncSVNSendTask = false;
                                        svnIndex ++;
                                    });

                                }
                            })
                        }
                    } else {
                        console.log("svn counts= " + items.length);
                        j.cancel();
                    }

                });





            }
    })
}


