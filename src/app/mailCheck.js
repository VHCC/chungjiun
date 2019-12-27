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
console.log("dueDate= " + dueDate);

var officialDocModel = require('../server/restfulAPI/models/officialDocItem');
var userModel = require('../server/restfulAPI/models/user');

var allUsersCache = [];

userModel.find({}, function (err, allUsers) {
    if (err) {
        console.log(err);
    } else {
        console.log("user counts= " + allUsers.length);
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

// userModel.find({}, function (err, allUsers) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("user counts= " + allUsers.length);
//         allUsersCache = [];
//         allUsersCache[0] = {
//             value: "",
//             name: "None"
//         };
//         for (var i = 0; i < allUsers.length; i++) {
//             allUsersCache[i] = {
//                 value: allUsers[i]._id,
//                 name: allUsers[i].name,
//                 cjMail: allUsers[i].cjMail,
//             };
//         }
//
//         officialDocModel.find(
//             {
//                 dueDate: dueDate,
//                 isDocClose: false,
//                 type: 0
//
//             }, function (err, items) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log("docs= " + items.length);
//                     for (var index = 0; index < items.length; index++) {
//                         if (items[index].signerDID) {
//                             console.log(items[index].signerDID);
//
//                             var output = allUsersCache.find(function (item) {
//                                 return item.value == items[index].signerDID;
//                             })
//
//
//                         }
//                     }
//
//
//                 }
//             })
//     }
// })


schedule.scheduleJob('0 00 08 * * *', function(){

    checkDueDateMail ();
    console.log('scheduleCronstyle:' + new Date());
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
            return "P"
    }
}


function checkDueDateMail () {
    officialDocModel.find(
        {
            dueDate: dueDate,
            isDocClose: false,
            type: 0

        }, function (err, items) {
            if (err) {
                console.log(err);
            } else {
                // console.log(items);
                console.log("doc counts= " + items.length);
                // console.log(today);

                var counter = 1;

                var mailIndex = 0;

                var syncSendMail = false;
                var j = schedule.scheduleJob('* * * * * *', function(){

                    if (mailIndex < items.length) {

                        if (!syncSendMail) {
                            syncSendMail = true;

                            if (items[mailIndex].signerDID) {
                                console.log("*** doc ID= " + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber);
                                console.log("*** signerDID= " + items[mailIndex].signerDID);

                                var signer = allUsersCache.find(function (item) {
                                    // console.log(item);
                                    // console.log(items[mailIndex].signerDID);
                                    return item.value == items[mailIndex].signerDID;
                                })

                                var handler = allUsersCache.find(function (item) {
                                    // console.log(item);
                                    // console.log(items[mailIndex].signerDID);
                                    return item.value == items[mailIndex].handlerDID;
                                })

                                // console.log(output);

                                mailTransport.sendMail({
                                    from: 'ERM System <0973138343@chongjun.tw>',
                                    to: signer.name + ' <' + signer.cjMail + '>',
                                    subject: '公文 ' + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber + ' 即將到期，請留意',
                                    html: '<h1>公文 ' + getDocDivisionName(items[mailIndex].docDivision) + items[mailIndex].archiveNumber + '</h1>' +
                                    '<p> 最後期限即將到期，請注意</p><br/>' +
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
                                mailIndex ++;
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


