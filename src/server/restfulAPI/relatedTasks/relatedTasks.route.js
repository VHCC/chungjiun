var fs = require('fs');
var WorkOffTableForm = require('../models/workOffTableForm');
var moment = require('moment');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // fetch related tasks
    app.post(global.apiUrl.fetch_related_tasks, function (req, res) {

        var workOff_Rejected = 0;
        var workOff_Agent_Tasks = 0;
        var workOff_Boss_Tasks = 0;
        var workOff_Executive_Tasks = 0;

        var findDataOr_Boss = [];
        for (var index = 0; index < req.body.relatedUserDIDArray_Boss.length; index++) {
            findDataOr_Boss.push({creatorDID: req.body.relatedUserDIDArray_Boss[index]});
        }

        var findDataOr_Executive = [];
        for (var index = 0; index < req.body.relatedUserDIDArray_Executive.length; index++) {
            findDataOr_Executive.push({creatorDID: req.body.relatedUserDIDArray_Executive[index]});
        }

        var findDataAnd_Agent = [];
        findDataAnd_Agent.push({isSendReview: true});
        findDataAnd_Agent.push({isAgentCheck: false});

        WorkOffTableForm.find({
                agentID: req.body.userDID,
                $and: findDataAnd_Agent
            },
            function (err, tables) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    workOff_Agent_Tasks = tables.length;

                    var findDataAnd_Boss = [];
                    findDataAnd_Boss.push({isSendReview: true});
                    findDataAnd_Boss.push({isAgentCheck: true});
                    findDataAnd_Boss.push({isBossCheck: false});

                    WorkOffTableForm.find({
                            $or: findDataOr_Boss,
                            $and: findDataAnd_Boss
                        },
                        function (err, tables) {
                            if (err) {
                                console.log(err);
                                res.send(err);
                            } else {
                                // console.log(tables);
                                workOff_Boss_Tasks = tables.length;

                                var findDataAnd_Executive = [];
                                findDataAnd_Executive.push({isSendReview: true});
                                findDataAnd_Executive.push({isAgentCheck: true});
                                findDataAnd_Executive.push({isBossCheck: true});
                                findDataAnd_Executive.push({isExecutiveCheck: false});

                                WorkOffTableForm.find({
                                        $or: findDataOr_Executive,
                                        $and: findDataAnd_Executive
                                    },
                                    function (err, tables) {
                                        if (err) {
                                            console.log(err);
                                            res.send(err);
                                        } else {
                                            workOff_Executive_Tasks = tables.length;

                                            var findDataOr_Rejected = [];
                                            findDataOr_Rejected.push({isAgentReject: true});
                                            findDataOr_Rejected.push({isBossReject: true});
                                            findDataOr_Rejected.push({isExecutiveReject: true});

                                            var findDataAnd_Rejected = [];
                                            findDataAnd_Rejected.push({creatorDID: req.body.userDID});
                                            findDataAnd_Rejected.push({isSendReview: false});

                                            WorkOffTableForm.find({
                                                    $or: findDataOr_Rejected,
                                                    $and: findDataAnd_Rejected
                                                },
                                                function (err, tables) {
                                                    if (err) {
                                                        console.log(err);
                                                        res.send(err);
                                                    } else {
                                                        workOff_Rejected = tables.length;
                                                        res.status(200).send({
                                                            code: 200,
                                                            error: global.status._200,
                                                            payload: {
                                                                workOff_Rejected: workOff_Rejected,
                                                                workOff_Agent_Tasks: workOff_Agent_Tasks,
                                                                workOff_Boss_Tasks: workOff_Boss_Tasks,
                                                                workOff_Executive_Tasks: workOff_Executive_Tasks,
                                                            },
                                                        });
                                                    }
                                                })
                                        }
                                    })
                            }
                        })

                }
            })

    });
}