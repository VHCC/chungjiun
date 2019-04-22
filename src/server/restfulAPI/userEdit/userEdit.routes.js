var User = require('../models/user');

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

    app.post(global.apiUrl.post_upload_user_avatatr, upload.single('file'), function (req, res) {
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
    })

    app.post(global.apiUrl.post_user_find_by_userdid, function (req, res) {
        User.find({
            _id: req.body.userDID,
        }, function (err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user[0]);
        })
    })

    app.post(global.apiUrl.post_user_change_password_by_userdid, function (req, res) {
        User.update({
            _id: req.body.userDID,
        }, {
            $set: {
                password: req.body.password,
            }
        }, function (err) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
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
                userMonthSalary: req.body.userMonthSalary,
                bossID: req.body.bossID,
                machineDID: req.body.machineDID,
                workStatus: req.body.workStatus,
            }
        }, function (err) {
            if (err) {
                res.send(err);
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
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
            }
            res.status(200).send({
                code: 200,
                error: global.status._200,
            });
        })
    })
}