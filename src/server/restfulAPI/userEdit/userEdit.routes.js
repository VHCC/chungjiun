var User = require('../models/user');
var nodemailer = require('nodemailer');
var moment = require('moment');

var mailTransport = nodemailer.createTransport({
    host: 'mail.chongjun.tw',
    secureConnection: false,
    port: 25,
    auth: {
        user: '0973138343',
        pass: '123456'
    }
});

module.exports = function (app) {
// application -------------------------------------------------------------
    var multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/uploads/usersAvatar')
        },
        filename: function (req, file, cb) {
            console.log(req.body.userDID);
            cb(null, req.body.userDID + '.png');
        }
    });
    var upload = multer({storage: storage});
// ----- define routes
    // upload

    app.post(global.apiUrl.post_upload_user_avatar, upload.single('file'), function (req, res) {
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
    })

    app.post(global.apiUrl.post_user_find_by_userdid, function (req, res) {
        User.find({
            _id: req.body.userDID,
        }, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                res.json(user[0]);
            }
        })
    })

    app.post(global.apiUrl.post_user_change_password_by_userdid, function (req, res) {
        User.updateOne({
            _id: req.body.userDID,
        }, {
            $set: {
                password: req.body.password,
                passwordChangeTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                isChangedPWD: true,
                pwdChangeUserName: req.body.userName,
            }
        }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })

    app.post(global.apiUrl.post_user_update_profile, function (req, res) {
        User.update({
            _id: req.body.userDID,
        }, {
            $set: {
                roleType: req.body.roleType,
                name: req.body.userName,
                email: req.body.email,
                cjMail: req.body.cjMail,
                userMonthSalary: req.body.userMonthSalary,
                bossID: req.body.bossID,
                machineDID: req.body.machineDID,
                workStatus: req.body.workStatus,
                feature_official_doc: req.body.feature_official_doc,
            }
        }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })


    app.post(global.apiUrl.post_user_set_residual_rest_hour, function (req, res) {
        User.update({
            _id: req.body.userDID,
        }, {
            $set: {
                residualRestHour: req.body.residualRestHour,
                isSetResidualRestHour: req.body.isSetResidualRestHour,
            }
        }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
            }
        })
    })


    // send test mail
    app.post(global.apiUrl.post_user_send_test_mail, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_user_send_test_mail");

        console.log(req.body);

        mailTransport.sendMail({
            from: 'ERM System <0973138343@chongjun.tw>',
            to: req.body.name + ' <' + req.body.cjMail + '>',
            subject: '崇峻 ERM 測試信件',
            html: '<h1> 崇峻工程股份有限公司 </h1> ERM 測試信件' +
                'https://erm.chongjun.synology.me/'
        }, function(err){
            if(err){
                console.log(global.timeFormat(new Date()) + global.log.e + "API, get_official_doc_fetch_all_item");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log('Unable to send email: ' + err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                });
                console.log('Send Successfully:');
            }
        });
    })

    app.post(global.apiUrl.post_user_info_update_before_108_kpi, function (req, res) {
        User.update({
            _id: req.body.userDID,
        }, {
            $set: {
                before108Kpi: req.body.before108Kpi,
            }
        }, function (err) {
            if (err) {
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