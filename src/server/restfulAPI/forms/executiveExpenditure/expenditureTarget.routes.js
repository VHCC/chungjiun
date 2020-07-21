var ExpenditureTarget = require('../../models/expenditureTarget');
var moment = require('moment');

module.exports = function (app) {

    // ----------- fetch ------------
    app.post(global.apiUrl.post_fetch_expenditure_target, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_fetch_expenditure_target");
        console.log(req.body);

        ExpenditureTarget.find(
            {
                isEnable: req.body.isEnable,
            },
            function (err, targets) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_fetch_expenditure_target");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: targets,
                    });
                }
            })
    })

    // ----------- fetch all ------------
    app.post(global.apiUrl.post_fetch_all_expenditure_target, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_fetch_all_expenditure_target");
        console.log(req.body);

        ExpenditureTarget.find(
            {
            },
            function (err, targets) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_fetch_all_expenditure_target");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: targets,
                    });
                }
            })
    })

    // insert
    app.post(global.apiUrl.post_insert_expenditure_target, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_insert_expenditure_target");
        console.log(req.body);

        ExpenditureTarget.create(
            {
                targetName: req.body.targetName
            },
            function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_insert_expenditure_target");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                    });
                }
            })
    })

    // update
    app.post(global.apiUrl.post_update_expenditure_target, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_update_expenditure_target");
        console.log(req.body);

        ExpenditureTarget.update(
            {
                _id: req.body._id
            },
            {
                $set: {
                    targetName: req.body.targetName,
                    timestamp: req.body.timestamp,
                    isEnable: true,
                }
            },
            function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_update_expenditure_target");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                    });
                }
            })
    })

    // remove
    app.post(global.apiUrl.post_remove_expenditure_target, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_remove_expenditure_target");
        console.log(req.body);

        ExpenditureTarget.remove(
            {
                _id: req.body._id
            }, function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_remove_expenditure_target");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
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