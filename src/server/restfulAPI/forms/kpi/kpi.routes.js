var SubContractorPayItem = require('../../models/subContractorPayItem');
var ProjectIncome = require('../../models/projectIncome');
var ExecutiveExpenditureItem = require('../../models/executiveExpenditureItem');
var PaymentFormItem = require('../../models/paymentFormItem');

var Project = require('../../models/project');
var ProjectFinancialResult = require('../../models/projectFinancialResult');
var ProjectKPIElements = require('../../models/projectKPIElement');
var KpiYearBonus = require('../../models/kpiYearBonus');

var moment = require('moment');

module.exports = function (app) {
    'use strict';

    app.post(global.apiUrl.post_get_kpi_elements_by_year, function (req, res) {
        console.log(JSON.stringify(req.body));
        ProjectKPIElements.find({
            year: req.body.year,
            type: req.body.type,
        }, function (err, items) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items,
                });
            }
        });
    });

    app.post(global.apiUrl.post_get_kpi_person_elements_by_year, function (req, res) {
        console.log(JSON.stringify(req.body));
        ProjectKPIElements.find({
            year: req.body.year,
            userDID: req.body.userDID,
        }, function (err, items) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items,
                });
            }
        });
    });

    app.post(global.apiUrl.post_get_kpi_person_elements_all, function (req, res) {
        console.log(JSON.stringify(req.body));
        ProjectKPIElements.find({
            userDID: req.body.userDID,
        }, function (err, items) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: items,
                });
            }
        });
    });

    app.post(global.apiUrl.post_kpi_person_elements_insert, function (req, res) {
        console.log(JSON.stringify(req.body));
        ProjectKPIElements.create({
            year: req.body.year,
            userDID: req.body.userDID,
            timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
        }, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: results,
                });
            }
        });
    });


    app.post(global.apiUrl.post_get_kpi_elements_delete, function (req, res) {
        console.log(JSON.stringify(req.body));
        ProjectKPIElements.remove({
            _id: req.body._id,
        }, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: results,
                });
            }
        });
    });

    app.post(global.apiUrl.post_get_kpi_elements_insert, function (req, res) {
        console.log(JSON.stringify(req.body));
        ProjectKPIElements.create({
            year: req.body.year,
            type: req.body.type,
            timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
        }, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: results,
                });
            }
        });
    });

    app.post(global.apiUrl.post_get_kpi_elements_update, function (req, res) {
        console.log(JSON.stringify(req.body));
        ProjectKPIElements.updateOne({
            _id: req.body._id,
        },{
            $set: {
                amount: req.body.amount,
                memo: req.body.memo,
            }
        }, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: results,
                });
            }
        });
    });


    app.post(global.apiUrl.post_get_kpi_financial_results_by_year, function (req, res) {
        console.log(JSON.stringify(req.body));
        Project.find({
            year: req.body.year,
            isPrjClose: true,
        }, function (err, projects) {
            if (err) {
                res.send(err);
            } else {
                var findData = []
                if (projects.length != 0) {
                    for (var index = 0; index < projects.length; index++) {
                        var target = {
                            prjDID: projects[index]._id,
                        }
                        findData.push(target);
                    }
                    var query = {};
                    query.$or = findData;
                    ProjectFinancialResult.find(query,
                        function (err, items) {
                            if (err) {
                                res.send(err);
                            }
                            res.status(200).send({
                                code: 200,
                                error: global.status._200,
                                payload: items,
                            });
                        });
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: findData,
                    });
                }
            }
        });
    });

    app.post(global.apiUrl.post_get_kpi_financial_results_by_year_and_user_uuid, function (req, res) {
        console.log(JSON.stringify(req.body));
        Project.find({
            year: req.body.year,
            isPrjClose: true,
        }, function (err, projects) {
            if (err) {
                res.send(err);
            } else {
                var findData = []
                if (projects.length != 0) {
                    for (var index = 0; index < projects.length; index++) {
                        var target = {
                            prjDID: projects[index]._id,
                        }
                        findData.push(target);
                    }
                    var query = {};
                    query.$or = findData;
                    ProjectFinancialResult.find(query,
                        function (err, items) {
                            if (err) {
                                res.send(err);
                            }
                            res.status(200).send({
                                code: 200,
                                error: global.status._200,
                                payload: items,
                            });
                        });
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: findData,
                    });
                }
            }
        });
    });

    app.post(global.apiUrl.post_get_kpi_elements_by_prjdid_array, function (req, res) {
        var findData = []
        for (var index = 0; index < req.body.prjDIDArray.length; index++) {
            var target = {
                prjDID: req.body.prjDIDArray[index],
            }
            findData.push(target);
        }

        var isProjectIncome = false;
        var isSubContractorPayItem = false;
        var isExecutiveExpenditureItem = false;
        var isPaymentFormItem = false;
        var isResponse = false;

        var projectIncomes;
        var subContractorPayItems;
        var executiveExpenditureItems;
        var paymentItems;

        // 專案收入
        var queryProjectIncome = {};
        queryProjectIncome.$or = findData;

        if (req.body.isEnable != null) {
            queryProjectIncome.isEnable = req.body.isEnable;
        }

        ProjectIncome.find(queryProjectIncome,
            function (err, item) {
                isProjectIncome = true;
                projectIncomes = item
                if (err) {
                    res.send(err);
                }
                if (isProjectIncome &&
                    isSubContractorPayItem &&
                    isExecutiveExpenditureItem &&
                    isPaymentFormItem && !isResponse) {
                    isResponse = true
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        projectIncomes: projectIncomes,
                        subContractorPayItems: subContractorPayItems,
                        executiveExpenditureItems: executiveExpenditureItems,
                        paymentItems: paymentItems,
                        prjDID: req.body.prjDIDArray[0],
                    });

                }
        });


        // 廠商請款
        var querySubContractorPayItem = {};
        querySubContractorPayItem.$or = findData;
        querySubContractorPayItem.isExecutiveCheck = true;
        SubContractorPayItem.find(querySubContractorPayItem,
            function (err, item) {
                isSubContractorPayItem = true
                subContractorPayItems = item
                if (err) {
                    res.send(err);
                } else {
                    if (isProjectIncome &&
                        isSubContractorPayItem &&
                        isExecutiveExpenditureItem &&
                        isPaymentFormItem && !isResponse) {
                        isResponse = true
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            projectIncomes: projectIncomes,
                            subContractorPayItems: subContractorPayItems,
                            executiveExpenditureItems: executiveExpenditureItems,
                            paymentItems: paymentItems,
                            prjDID: req.body.prjDIDArray[0],
                        });
                    }
                }
        });


        // 其他支出
        var queryExecutiveExpenditureItem = {};
        queryExecutiveExpenditureItem.$or = findData;

        ExecutiveExpenditureItem.find(queryExecutiveExpenditureItem,
            function (err, item) {
                isExecutiveExpenditureItem = true
                executiveExpenditureItems = item
                if (err) {
                    res.send(err);
                } else {
                    if (isProjectIncome &&
                        isSubContractorPayItem &&
                        isExecutiveExpenditureItem &&
                        isPaymentFormItem && !isResponse) {
                        isResponse = true
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            projectIncomes: projectIncomes,
                            subContractorPayItems: subContractorPayItems,
                            executiveExpenditureItems: executiveExpenditureItems,
                            paymentItems: paymentItems,
                            prjDID: req.body.prjDIDArray[0],
                        });
                    }
                }
        });

        // 墊付款
        var queryPaymentFormItem = {};
        queryPaymentFormItem.$or = findData;

        queryPaymentFormItem.isExecutiveCheck = true;
        PaymentFormItem.find(queryPaymentFormItem,
            function (err, item) {
                isPaymentFormItem = true
                paymentItems = item
                if (err) {
                    res.send(err);
                } else {
                    if (isProjectIncome &&
                        isSubContractorPayItem &&
                        isExecutiveExpenditureItem &&
                        isPaymentFormItem && !isResponse) {
                        isResponse = true
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                            projectIncomes: projectIncomes,
                            subContractorPayItems: subContractorPayItems,
                            executiveExpenditureItems: executiveExpenditureItems,
                            paymentItems: paymentItems,
                            prjDID: req.body.prjDIDArray[0],
                        });
                    }
                }
        });
    });



    // BONUS 年終
    app.post(global.apiUrl.post_get_kpi_bonus_find, function (req, res) {

        console.log(req.body)

        var findRequest = {
            // year: req.body.year,
        }

        if (req.body.year != undefined) {
            findRequest.year = req.body.year;
        }

        if (req.body.userDID != undefined) {
            findRequest.userDID = req.body.userDID;
        }

        KpiYearBonus.find(findRequest, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: results,
                });
            }
        });
    });

    app.post(global.apiUrl.post_get_kpi_bonus_insert, function (req, res) {
        console.log(JSON.stringify(req.body));
        KpiYearBonus.create({
            year: req.body.year,
            userDID: req.body.userDID,
            amount: req.body.amount,
            timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
        }, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: results,
                });
            }
        });
    });

    app.post(global.apiUrl.post_get_kpi_bonus_update, function (req, res) {
        console.log(JSON.stringify(req.body));
        KpiYearBonus.updateOne({
            _id: req.body._id,
        },{
            $set: {
                amount: req.body.amount,
                memo: req.body.memo,
            }
        }, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: results,
                });
            }
        });
    });


}