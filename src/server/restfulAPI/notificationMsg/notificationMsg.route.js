var NotificationMsgItem = require('../models/notificationMsgItem');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // fetch Form
    app.post(global.apiUrl.post_notification_msg_by_user_did, function (req, res) {
        console.log(req.body);
        NotificationMsgItem.find({
            msgTarget: req.body.creatorDID,
        }, function (err, msgItems) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: msgItems,
                });
            }

        });
    });

}