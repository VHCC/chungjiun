var userModel = require('../models/user');
var nodemailer = require('nodemailer');

var mailTransport = nodemailer.createTransport({
    host: 'mail.chongjun.tw',
    secureConnection: false,
    port: 25,
    auth: {
        user: '0973138343',
        pass: '123456'
    }
});

module.exports = function(app) {
    // 'use strict';
// application -------------------------------------------------------------
// ----- define routes
    // find
    app.post(global.apiUrl.post_login_user_find, function(req, res) {
        userModel.find({
            email : req.body.email,
        }, function(err, user) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + error);
                res.send(err);
            } else {
                if (user != '') {

                    if (req.body.password != user[0].get('password') && user[0].isChangedPWD) {
                        console.log(global.timeFormat(new Date()) + global.log.w + 'wrong pwd= ' + req.body.password);
                        res.status(404).send({
                            code: 401,
                            pwdChangeUserName: user[0].pwdChangeUserName,
                            passwordChangeTs: user[0].passwordChangeTs,
                            error: global.status._400,
                        });
                        return;
                    } else if (req.body.password != user[0].get('password')) {
                        console.log(global.timeFormat(new Date()) + global.log.w + 'wrong pwd= ' + req.body.password);
                        res.status(404).send({
                            code: 400,
                            error: global.status._400,
                        });
                        return;
                    }

                    userModel.updateOne({
                        email: req.body.email,
                    }, {
                        $set: {
                            isChangedPWD: false,
                        }
                    }, function (err) {
                        if (err) {
                            res.send(err);
                        } else {
                        }
                    })

                    console.log(global.timeFormat(new Date()) + global.log.i + "Login Success, user= " + JSON.stringify(user));
                    res.json(user);
                    return;
                }
                console.log(global.timeFormat(new Date()) + global.log.i + "no User= " + req.body.email);
                res.status(404).send({
                    code: 404,
                    error: global.status._404,
                });
            }
        });
    });

    // find forger PWD
    app.post(global.apiUrl.post_login_user_find_forget_password, function(req, res) {
        userModel.find({
            email : req.body.email,
        }, function(err, user) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + error);
                res.send(err);
            } else {
                if (user != '') {

                    if (user[0].get('cjMail') == '' || user[0].get('cjMail') == undefined) {
                        console.log(global.timeFormat(new Date()) + global.log.w + 'no cjMail:> ' + req.body.email);
                        res.status(404).send({
                            code: 600,
                            error: global.status._400,
                        });
                        return;
                    }

                    console.log(user[0])

                    mailTransport.sendMail({
                        from: 'ERM System <0973138343@chongjun.tw>',
                        to: user[0].name + ' <' + user[0].cjMail + '>',
                        subject: '崇峻 ERM 忘記密碼信件',
                        html: '<h1> 崇峻工程股份有限公司 </h1> ERM 忘記密碼信件 </br>' +
                        user[0].name + ' 的密碼：' + user[0].password
                    }, function(err){
                        if(err){
                            console.log(global.timeFormat(new Date()) + global.log.e + "API, get_official_doc_fetch_all_item");
                            console.log(req.body);
                            console.log(" ***** ERROR ***** ");
                            console.log('Unable to send email: ' + err);
                            res.send(err);
                        } else {
                            // res.status(200).send({
                            //     code: 200,
                            //     error: global.status._200,
                            // });
                            res.json(user);
                            console.log('Send Successfully:');
                        }
                    });
                    return;
                }
                console.log(global.timeFormat(new Date()) + global.log.i + "no User= " + req.body.email);
                res.status(404).send({
                    code: 404,
                    error: global.status._404,
                });
            }
        });
    });
}