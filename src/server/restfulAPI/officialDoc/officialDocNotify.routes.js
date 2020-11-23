var officialDocNotifyItem = require('../models/officialDocNotifyItem');
var moment = require('moment');

module.exports = function (app) {

    // generate official doc Notify
    app.post(global.apiUrl.post_insert_official_doc_notify, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_insert_official_doc_notify");

        console.log(req.body);

        for (var index = 0; index < req.body.notifyUsersList.length; index++) {
            var targetDID = req.body.notifyUsersList[index];
            officialDocNotifyItem.create({
                creatorDID: req.body.creatorDID,
                targetDID: targetDID,
                archiveNumber: req.body.archiveNumber,
                notifyMsg: req.body.notifyMsg,
                docDivision: req.body.docDivision,
                timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                type: req.body.type,
            }, function (err, items) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_insert_official_doc_notify");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                }
            });
        }
        res.status(200).send({
            code: 200,
            error: global.status._200,
        });
    })


    app.post(global.apiUrl.fetch_official_doc_notify, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, fetch_official_doc_notify");

        console.log(req.body);

        officialDocNotifyItem.find({
            targetDID: req.body.userDID,
            isDocOpened: req.body.isDocOpened
        }, function (err, items) {
            if (err) {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, fetch_official_doc_notify");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items
                });
            }
        })
    })

    app.post(global.apiUrl.post_update_official_doc_notify, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_update_official_doc_notify");

        console.log(req.body);

        officialDocNotifyItem.updateOne(
            {
                _id:req.body._id

            }, {
                $set: {
                    isDocOpened: true,
                    archiveTimestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                }
            }, function (err, result) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_update_official_doc_notify");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: result
                    });
                }
            })
    })


}