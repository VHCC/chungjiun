var fs = require('fs');
// 請假單
var WorkOffTableForm = require('../models/workOffTableForm');

// 差勤補登
var HrRemedyTable = require('../models/hrRemedy');

// 公差公出
var TravelApplicationItem = require('../models/travelApplicationItem');

// 墊付款
var PaymentFormItem = require('../models/paymentFormItem');

// 工時表
var WorkHourTable = require('../models/workHourTableForm');

// 加班單
var WorkOverTimeItem = require('../models/workOverTimeItem');

var moment = require('moment');

module.exports = function (app) {
    'use strict';

    // ----- define routes

    // fetch related tasks
    app.post(global.apiUrl.fetch_related_tasks, function (req, res) {

        // 請假單
        var workOff_Rejected = 0;
        var workOff_Agent_Tasks = 0;
        var workOff_Boss_Tasks = 0;
        var workOff_Executive_Tasks = 0;

        // 差勤補登
        var hrRemedy_Rejected = 0;
        var hrRemedy_Boss_Tasks = 0;

        // 出差公出
        var travelApply_Rejected = 0;
        var travelApply_Manager_Tasks = 0;
        var travelApply_Boss_Tasks = 0;

        // 墊付款
        var payment_Rejected = 0;
        var payment_Manager_Tasks = 0;
        var payment_Executive_Tasks = 0;

        // 工時表
        var workHour_Rejected = 0;
        var workHour_Manager_Tasks = 0;
        var workHour_Executive_Tasks = 0;

        // 加班申請
        var workOverTime_Rejected = 0;
        var workOverTime_Manager_Tasks = 0;

        var findDataOr_Boss = [{creatorDID: "empty"}];
        for (var index = 0; index < req.body.relatedUserDIDArray_Boss.length; index++) {
            findDataOr_Boss.push({creatorDID: req.body.relatedUserDIDArray_Boss[index]});
        }

        var findDataOr_Executive = [{creatorDID: "empty"}];
        for (var index = 0; index < req.body.relatedUserDIDArray_Executive.length; index++) {
            findDataOr_Executive.push({creatorDID: req.body.relatedUserDIDArray_Executive[index]});
        }

        var findDataOr_Manager = [{prjDID: "empty"}];
        for (var index = 0; index < req.body.managersRelatedProjects.length; index++) {
            findDataOr_Manager.push({prjDID: req.body.managersRelatedProjects[index]});
        }

        var findDataOr_create_formDate_rejected = [
            {
                creatorDID: "empty",
                create_formDate: "empty",
            }];
        for (var subIndex = 0; subIndex < req.body.create_formDate_array.length; subIndex++) {
            findDataOr_create_formDate_rejected.push(
                {
                    create_formDate: req.body.create_formDate_array[subIndex],
                    isManagerReject: true,
                });
            findDataOr_create_formDate_rejected.push(
                {
                    create_formDate: req.body.create_formDate_array[subIndex],
                    isExecutiveReject: true,
                });
        }


        executiveAllPromise(req.body.userDID, findDataOr_Boss,
            findDataOr_Executive, findDataOr_Manager,
            req.body.relatedUserDIDArray_Executive,
            req.body.managersRelatedProjects,
            req.body.create_formDate_array,
            findDataOr_create_formDate_rejected).then(function (resp) {

            workOff_Agent_Tasks = resp[0];
            workOff_Boss_Tasks = resp[1];
            workOff_Executive_Tasks = resp[2];
            workOff_Rejected = resp[3];

            hrRemedy_Boss_Tasks = resp[4];
            hrRemedy_Rejected = resp[5];

            travelApply_Manager_Tasks = resp[6];
            travelApply_Boss_Tasks = resp[7];
            travelApply_Rejected = resp[8];

            payment_Manager_Tasks = resp[9];
            payment_Executive_Tasks = resp[10];
            payment_Rejected = resp[11];

            workHour_Manager_Tasks = resp[12];
            workHour_Executive_Tasks = resp[13];
            workHour_Rejected = resp[14];

            workOverTime_Manager_Tasks = resp[15];
            workOverTime_Rejected = resp[16];


            res.status(200).send({
                code: 200,
                error: global.status._200,
                payload: {
                    workOff_Rejected: workOff_Rejected,
                    workOff_Agent_Tasks: workOff_Agent_Tasks,
                    workOff_Boss_Tasks: workOff_Boss_Tasks,
                    workOff_Executive_Tasks: workOff_Executive_Tasks,

                    hrRemedy_Boss_Tasks: hrRemedy_Boss_Tasks,
                    hrRemedy_Rejected: hrRemedy_Rejected,

                    travelApply_Rejected: travelApply_Rejected,
                    travelApply_Manager_Tasks: travelApply_Manager_Tasks,
                    travelApply_Boss_Tasks: travelApply_Boss_Tasks,

                    payment_Rejected: payment_Rejected,
                    payment_Manager_Tasks: payment_Manager_Tasks,
                    payment_Executive_Tasks: payment_Executive_Tasks,

                    workHour_Manager_Tasks: workHour_Manager_Tasks,
                    workHour_Executive_Tasks: workHour_Executive_Tasks,
                    workHour_Rejected: workHour_Rejected,

                    workOverTime_Manager_Tasks: workOverTime_Manager_Tasks,
                    workOverTime_Rejected: workOverTime_Rejected,
                },
            });
        })

    });

    function executiveAllPromise(userDID, findDataOr_Boss,
                                 findDataOr_Executive, findDataOr_Manager,
                                 related_userDIDArrays,
                                 related_prjDIDArrays,
                                 related_create_formDateArrays,
                                 findDataOr_Create_FormDate_Rejected) {

        var promiseArray = [];
        promiseArray.push(getWorkOff_Agent(userDID)); // 0
        promiseArray.push(getWorkOff_Boss(findDataOr_Boss)); // 1
        promiseArray.push(getWorkOff_Executive(findDataOr_Executive)); // 2
        promiseArray.push(getWorkOff_Reject(userDID)); // 3

        promiseArray.push(getHrRemedy_Boss(findDataOr_Boss)); // 4
        promiseArray.push(getHrRemedy_Reject(userDID)); // 5

        promiseArray.push(getTravelApply_Manager(findDataOr_Manager)); // 6
        promiseArray.push(getTravelApply_Boss(findDataOr_Boss)); // 7
        promiseArray.push(getTravelApply_Reject(userDID)); // 8

        promiseArray.push(getPayment_Manager(findDataOr_Manager)); // 9
        promiseArray.push(getPayment_Executive(findDataOr_Executive)); // 10
        promiseArray.push(getPayment_Reject(userDID)); // 11

        promiseArray.push(getWorkHour_Manager(related_prjDIDArrays, related_create_formDateArrays)); // 12
        promiseArray.push(getWorkHour_Executive(related_userDIDArrays, related_create_formDateArrays)); // 13
        promiseArray.push(getWorkHour_Reject(userDID, findDataOr_Create_FormDate_Rejected)); // 14

        promiseArray.push(getWorkOverTime_Manager(related_prjDIDArrays)); // 15
        promiseArray.push(getWorkOverTime_Reject(userDID)); // 16

        return Promise.all(promiseArray);
    }


    // Jobs
    async function getWorkOff_Agent(userDID) {
        return new Promise((resolve, reject) => {
            var findDataAnd_Agent = [];
            findDataAnd_Agent.push({isSendReview: true});
            findDataAnd_Agent.push({isAgentCheck: false});

            WorkOffTableForm.countDocuments({
                    agentID: userDID,
                    $and: findDataAnd_Agent
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    };
            });
        });
    }

    async function getWorkOff_Boss(findDataOr_Boss) {
        return new Promise((resolve, reject) => {
            var findDataAnd_Boss = [];
            findDataAnd_Boss.push({isSendReview: true});
            findDataAnd_Boss.push({isAgentCheck: true});
            findDataAnd_Boss.push({isBossCheck: false});

            WorkOffTableForm.countDocuments({
                    $or: findDataOr_Boss,
                    $and: findDataAnd_Boss
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                });
        });
    }

    async function getWorkOff_Executive(findDataOr_Executive) {
        return new Promise((resolve, reject) => {
            var findDataAnd_Executive = [];
            findDataAnd_Executive.push({isSendReview: true});
            findDataAnd_Executive.push({isAgentCheck: true});
            findDataAnd_Executive.push({isBossCheck: true});
            findDataAnd_Executive.push({isExecutiveCheck: false});

            WorkOffTableForm.countDocuments({
                    $or: findDataOr_Executive,
                    $and: findDataAnd_Executive
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                });
        });
    }

    async function getWorkOff_Reject(userDID) {
        return new Promise((resolve, reject) => {
            var findDataOr_Rejected = [];
            findDataOr_Rejected.push({isAgentReject: true});
            findDataOr_Rejected.push({isBossReject: true});
            findDataOr_Rejected.push({isExecutiveReject: true});

            var findDataAnd_Rejected = [];
            findDataAnd_Rejected.push({creatorDID: userDID});
            findDataAnd_Rejected.push({isSendReview: false});

            WorkOffTableForm.countDocuments({
                    $or: findDataOr_Rejected,
                    $and: findDataAnd_Rejected
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    async function getHrRemedy_Boss(findDataOr_Boss) {
        return new Promise((resolve, reject) => {
            // 傳入 resolve 與 reject，表示資料成功與失敗
            // if (success) {
            //     setTimeout(function () {
            //         // 3 秒時間後，透過 resolve 來表示完成
            //         resolve(`${someone} 跑 ${timer / 1000} 秒時間(fulfilled)`);
            //     }, timer);
            // } else {
            //     // 回傳失敗
            //     reject(`${someone} 跌倒失敗(rejected)`)
            // }

            var findDataAnd_Boss = [];
            findDataAnd_Boss.push({isSendReview: true});
            findDataAnd_Boss.push({isBossCheck: false});

            HrRemedyTable.countDocuments({
                    $or: findDataOr_Boss,
                    $and: findDataAnd_Boss
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    async function getHrRemedy_Reject(userDID) {
        return new Promise((resolve, reject) => {
            var findDataOr_Rejected = [];
            findDataOr_Rejected.push({isBossReject: true});

            var findDataAnd_Rejected = [];
            findDataAnd_Rejected.push({creatorDID: userDID});
            findDataAnd_Rejected.push({isSendReview: false});

            HrRemedyTable.count({
                    $or: findDataOr_Rejected,
                    $and: findDataAnd_Rejected
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    async function getTravelApply_Manager(findDataOr_Manager) {
        return new Promise((resolve, reject) => {
            var findDataAnd_Manager = [];
            findDataAnd_Manager.push({isSendReview: true});
            findDataAnd_Manager.push({isManagerCheck: false});

            TravelApplicationItem.countDocuments({
                    $or: findDataOr_Manager,
                    $and: findDataAnd_Manager
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    async function getTravelApply_Boss(findDataOr_Boss) {
        return new Promise((resolve, reject) => {
            var findDataAnd_Manager = [];
            findDataAnd_Manager.push({isSendReview: true});
            findDataAnd_Manager.push({isManagerCheck: true});
            findDataAnd_Manager.push({isBossCheck: false});

            TravelApplicationItem.countDocuments({
                    $or: findDataOr_Boss,
                    $and: findDataAnd_Manager
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    async function getTravelApply_Reject(userDID) {
        return new Promise((resolve, reject) => {
            var findDataOr_Rejected = [];
            findDataOr_Rejected.push({isBossReject: true});
            findDataOr_Rejected.push({isManagerReject: true});

            var findDataAnd_Rejected = [];
            findDataAnd_Rejected.push({creatorDID: userDID});
            findDataAnd_Rejected.push({isSendReview: false});

            TravelApplicationItem.countDocuments({
                    $or: findDataOr_Rejected,
                    $and: findDataAnd_Rejected
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    async function getPayment_Manager(findDataOr_Manager) {
        return new Promise((resolve, reject) => {

            var findDataAnd = [];
            findDataAnd.push({isSendReview: true});
            findDataAnd.push({isManagerCheck: false});

            PaymentFormItem.countDocuments({
                    $or: findDataOr_Manager,
                    $and: findDataAnd
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    var thisYear = new Date().getFullYear() - 1911;
    var thisMonth = new Date().getMonth() + 1; //January is 0!;

    async function getPayment_Executive(findDataOr_Executive) {
        return new Promise((resolve, reject) => {

            var findDataAnd = [];
            findDataAnd.push({isSendReview: true});
            findDataAnd.push({isManagerCheck: true});
            findDataAnd.push({isExecutiveCheck: false});
            findDataAnd.push({year: thisYear});
            findDataAnd.push({month: thisMonth});

            PaymentFormItem.countDocuments({
                    $or: findDataOr_Executive,
                    $and: findDataAnd
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    async function getPayment_Reject(userDID) {
        return new Promise((resolve, reject) => {
            var findDataOr = [];
            findDataOr.push({isExecutiveReject: true});
            findDataOr.push({isManagerReject: true});

            var findDataAnd = [];
            findDataAnd.push({creatorDID: userDID});
            findDataAnd.push({isSendReview: false});

            PaymentFormItem.countDocuments({
                    $or: findDataOr,
                    $and: findDataAnd
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    // 工時表
    async function getWorkHour_Manager(prjDIDArrays, create_formDateArrays) {
        return new Promise((resolve, reject) => {

            var findDataAnd = [];
            findDataAnd.push({isSendReview: true});
            findDataAnd.push({isManagerCheck: false});

            WorkHourTable.countDocuments({
                    // $or: findDataOr_Create_FormDate_Manager,
                    prjDID: {
                        $in: prjDIDArrays
                    },
                    create_formDate: {
                        $in: create_formDateArrays
                    },
                    $and: findDataAnd
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    async function getWorkHour_Executive(userDIDArrays, create_formDateArrays) {
        return new Promise((resolve, reject) => {

            var findDataAnd = [];
            findDataAnd.push({isSendReview: true});
            findDataAnd.push({isManagerCheck: true});
            findDataAnd.push({isExecutiveCheck: false});

            WorkHourTable.countDocuments({
                    // $or: findDataOr_Create_FormDate_Executive,
                    creatorDID: {
                        $in: userDIDArrays
                    },
                    create_formDate: {
                        $in: create_formDateArrays
                    },
                    $and: findDataAnd
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    async function getWorkHour_Reject(userDID, findDataOr_Create_FormDate_Rejected) {
        return new Promise((resolve, reject) => {
            var findDataAnd = [];
            findDataAnd.push({creatorDID: userDID});
            findDataAnd.push({isSendReview: false});

            WorkHourTable.countDocuments({
                    $or: findDataOr_Create_FormDate_Rejected,
                    $and: findDataAnd
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    // 加班申請
    async function getWorkOverTime_Manager(prjDIDArrays) {
        return new Promise((resolve, reject) => {

            var findDataAnd = [];
            findDataAnd.push({isSendReview: true});
            findDataAnd.push({isManagerCheck: false});

            WorkOverTimeItem.countDocuments({
                    prjDID: {
                        $in: prjDIDArrays
                    },
                    $and: findDataAnd
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }

    async function getWorkOverTime_Reject(userDID) {
        return new Promise((resolve, reject) => {
            var findDataAnd = [];
            findDataAnd.push({creatorDID: userDID});
            findDataAnd.push({isSendReview: false});
            findDataAnd.push({isManagerReject: true});

            WorkOverTimeItem.countDocuments({
                    $and: findDataAnd
                },
                function (err, counts) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(counts);
                    }
                })
        });
    }
}