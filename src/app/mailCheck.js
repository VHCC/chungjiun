var moment = require('moment');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');

var mailTransport = nodemailer.createTransport({
    host: 'mail.chongjun.tw',
    secureConnecton: false,
    port: 25,
    auth: {
        user: '0973138343',
        pass: '123456'
    }
});

var dueDate = moment().add(3, 'days').format("YYYY/MM/DD");
console.log(" ------ dueDate= " + dueDate + " ------ ");

var officialDocModel = require('../server/restfulAPI/models/officialDocItem');
var userModel = require('../server/restfulAPI/models/user');

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

var defaultMail_1;
var defaultMail_2;
var defaultMail_3;

schedule.scheduleJob('0 00 08 * * *', function() {
// schedule.scheduleJob('10 29 14 * * *', function () {

    defaultMail_1 = allUsersCache.find(function (item) {
        return item.name == "林佳樞";
    })

    defaultMail_2 = allUsersCache.find(function (item) {
        return item.name == "蕭鈺樺";
    })

    defaultMail_3 = allUsersCache.find(function (item) {
        return item.name == "陳瑞鳳";
    })


    checkNoHandleMail(3, 1);
    checkDueDateMail(1, 0);
    checkDueDateMail(-1, 2);
    console.log('schedule: ' + new Date());
});

function getDocDivisionName(division) {
    switch (division) {
        case 0:
            return "F";
        case 1:
            return "N";
        case 2:
            return "G";
        case 3:
            return "D";
        case 4:
            return "P";
    }
}


/**
 * @param days
 * @param targetType 0= singer, 1= handler, 2=小鳳
 */

function checkDueDateMail(days, targetType) {

    dueDate = moment().add(days, 'days').format("YYYY/MM/DD");
    console.log(" checkDueDateMail: ------ dueDate= " + dueDate + " ------ ");

    officialDocModel.find(
        {
            dueDate: dueDate,
            isDocClose: false,
            type: 0

        }, function (err, items) {
            if (err) {
                console.log(err);
            } else {
                console.log("doc counts= " + items.length);

                var counter = 1;

                var mailIndex = 0;

                var syncSendMail = false;
                var j = schedule.scheduleJob('* * * * * *', function () {

                    if (mailIndex < items.length) {

                        if (!syncSendMail) {
                            syncSendMail = true;

                            if (items[mailIndex].signerDID) {
                                console.log("*** doc ID= " + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber);
                                console.log("*** signerDID= " + items[mailIndex].signerDID);

                                var signer = allUsersCache.find(function (item) {
                                    return item.value == items[mailIndex].signerDID;
                                })

                                var handler = allUsersCache.find(function (item) {
                                    return item.value == items[mailIndex].handlerDID;
                                })

                                console.log(signer);

                                var sendTarget = ""

                                if (signer.cjMail == undefined || signer.cjMail == null) {
                                    sendTarget = defaultMail_1.name + ' <' + defaultMail_1.cjMail + '>;' +
                                        defaultMail_2.name + ' <' + defaultMail_2.cjMail + '>'
                                } else {
                                    sendTarget = signer.name + ' <' + signer.cjMail + '>';
                                }

                                var subject_tail = ' 即將到期，請留意';
                                var html_content = '最後期限即將到期，請注意';

                                if (targetType == 2) {
                                    sendTarget =  defaultMail_3.name + ' <' + defaultMail_3.cjMail + '>';
                                    subject_tail = ' 已經過期，且尚未歸檔，請留意';
                                    html_content = '已經過期，且尚未歸檔，請注意';
                                }

                                console.log("sendTarget:" + sendTarget);

                                mailTransport.sendMail({
                                    from: 'ERM System <0973138343@chongjun.tw>',
                                    to: sendTarget,
                                    subject: '公文 ' + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber + subject_tail,
                                    html: '<h1>公文 ' + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber + '</h1>' +
                                    '<p> ' + html_content + ' </p><br/>' +
                                    '<p> 到期日：' + items[mailIndex].dueDate + '</p>' +
                                    '<p> 待辦人：' + handler.name + '</p>'

                                }, function(err){
                                    if(err){
                                        console.log('Unable to send email: ' + err);
                                        syncSendMail = false;
                                    } else {
                                        console.log('Send Successfully: no.' + mailIndex + ', archiveNumber= ' + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber);
                                        syncSendMail = false;
                                        mailIndex ++;
                                    }
                                });
                            } else {
                                console.log(mailIndex + " doc has no signer");
                                syncSendMail = false;
                                mailIndex++;
                            }
                        }


                    } else {
                        console.log("doc counts= " + items.length);
                        j.cancel();
                    }

                    // console.log('定時器觸發次數：' + counter);
                    counter++;

                });

            }
        })
}


function checkNoHandleMail(days, targetType) {

    dueDate = moment().add(days, 'days').format("YYYY/MM/DD");
    console.log(" checkNoHandleMail: ------ dueDate= " + dueDate + " ------ ");

    officialDocModel.find(
        {
            dueDate: dueDate,
            isDocClose: false,
            "stageInfo": { $size: 1 },
            type: 0

        }, function (err, items) {
            if (err) {
                console.log(err);
            } else {
                console.log("doc counts= " + items.length);

                var counter = 1;

                var mailIndex = 0;

                var syncSendMail = false;
                var j = schedule.scheduleJob('* * * * * *', function(){

                    if (mailIndex < items.length) {

                        if (!syncSendMail) {
                            syncSendMail = true;

                            var mailTarget;

                            switch (targetType) {
                                case 0:
                                    if (items[mailIndex].signerDID) {
                                        var signer = allUsersCache.find(function (item) {
                                            return item.value == items[mailIndex].signerDID;
                                        })
                                        console.log("*** signerDID= " + items[mailIndex].signerDID);
                                        mailTarget = signer;
                                    } else {
                                        console.log(mailIndex + " doc has no signer");
                                        syncSendMail = false;
                                        mailIndex ++;
                                    }
                                    break;
                                case 1:
                                    if (items[mailIndex].chargerDID) {
                                        var charger = allUsersCache.find(function (item) {
                                            return item.value == items[mailIndex].chargerDID;
                                        })
                                        console.log("*** chargerDID= " + items[mailIndex].chargerDID);
                                        mailTarget = charger;
                                    } else {
                                        console.log(mailIndex + " doc has no chargerDID");
                                        syncSendMail = false;
                                        mailIndex ++;
                                    }
                                    break;
                                case 2:
                                    break;
                            }

                            console.log("*** doc ID= " + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber);

                            console.log(mailTarget);

                            var sendTarget = ""

                            if (mailTarget.cjMail == undefined || mailTarget.cjMail == null) {
                                sendTarget = defaultMail_1.name + ' <' + defaultMail_1.cjMail + '>;' +
                                    defaultMail_2.name + ' <' + defaultMail_2.cjMail + '>'
                            }  else {
                                sendTarget = mailTarget.name + ' <' + mailTarget.cjMail + '>';
                            }

                            console.log("sendTarget:" + sendTarget);

                            mailTransport.sendMail({
                                from: 'ERM System <0973138343@chongjun.tw>',
                                to: sendTarget,
                                subject: '公文 ' + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber + ' 請盡快處理',
                                html: '<h1>公文 ' + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber + '</h1>' +
                                '<p> 最後期限即將到期，請注意</p><br/>' +
                                '<p> 到期日：' + items[mailIndex].dueDate + '</p>' +
                                '<p> 承辦人：' + mailTarget.name + '</p>'

                            }, function(err){
                                if(err){
                                    console.log('Unable to send email: ' + err);
                                    syncSendMail = false;
                                } else {
                                    console.log('Send Successfully: no.' + mailIndex + ', archiveNumber= ' + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber);
                                    syncSendMail = false;
                                    mailIndex ++;
                                }
                            });
                        }


                    } else {
                        console.log("doc counts= " + items.length);
                        j.cancel();
                    }

                    // console.log('定時器觸發次數：' + counter);
                    counter++;
                });

            }
        })
}


