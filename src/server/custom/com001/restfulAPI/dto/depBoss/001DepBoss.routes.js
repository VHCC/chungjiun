var DepBoss = require('../../models/depBoss');

var moment = require('moment');

module.exports = function (app) {
    'use strict';

    app.get(global._001_apiUrl._001_post_dep_boss_find_all, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_dep_boss_find_all");
        DepBoss.find(
            {},
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_dep_boss_find_all");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                    return;
                } else {
                    res.status(200).json(results);
                    return;
                }
            });
    });

    app.post(global._001_apiUrl._001_post_dep_boss_find_one, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_dep_boss_find_one");
        console.log(req.body);
        DepBoss.find(
            {
                depType: req.body.depType
            },
            function (err, results) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_dep_boss_find_one");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.status(500).send(err);
                    return;
                } else {
                    res.status(200).json(results);
                    return;
                }
            });
    });


    app.post(global._001_apiUrl._001_post_dep_boss_update_one, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, _001_post_dep_update_one");
        console.log(JSON.stringify(req.body));

            DepBoss.find(
                {
                    depType: req.body.depType,
                },
                function (err, results) {
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_dep_boss_update_one");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.status(500).send(err);
                        return;
                    } else {
                        if (results.length == 0) {
                            DepBoss.create(
                                {
                                    depType: req.body.depType,
                                    depName: req.body.depName,
                                    userDID: req.body.userDID,
                                    updateTs: moment(new Date()).format("YYYYMMDD_HHmmss"),
                                },
                                function (err, results) {
                                    if (err) {
                                        console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_dep_boss_update_one");
                                        console.log(req.body);
                                        console.log(" ***** ERROR ***** ");
                                        console.log(err);
                                        res.status(500).send(err);
                                        return;
                                    } else {
                                        res.status(200).json(results);
                                        return;
                                    }
                                });
                        } else {
                            var keyArray = Object.keys(req.body);
                            var updateTarget = {};
                            for (var index = 0; index < keyArray.length; index++) {
                                var evalString = "updateTarget.";
                                evalString += keyArray[index];

                                var evalFooter = "req.body.";
                                evalFooter += keyArray[index];
                                eval(evalString + " = " + evalFooter);
                            }
                            DepBoss.updateOne({
                                depType: req.body.depType
                                // depName: req.body.depName,
                                // userDID: req.body.userDID,
                            }, {
                                $set: updateTarget
                            }, function (err, results) {
                                if (err) {
                                    console.log(global.timeFormat(new Date()) + global.log.e + "API, _001_post_dep_boss_update_one");
                                    console.log(req.body);
                                    console.log(" ***** ERROR ***** ");
                                    console.log(err);
                                    res.status(500).send(err);
                                    return;
                                } else {
                                    res.status(200).json(results);
                                    return;
                                }
                            });
                        }
                    }
                });
    });

}