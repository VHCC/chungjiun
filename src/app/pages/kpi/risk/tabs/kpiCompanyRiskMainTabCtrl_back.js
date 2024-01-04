/**
 * @author IChen.chu
 * created on 30 Dec 2021
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.cgKPI')
        .controller('kpiCompanyRiskCtrl_back',
            [
                '$scope',
                'toastr',
                '$cookies',
                '$filter',
                '$compile',
                '$timeout',
                '$window',
                'ngDialog',
                'User',
                'WorkHourUtil',
                'DateUtil',
                'TimeUtil',
                'Project',
                'ProjectUtil',
                'ProjectFinancialRateUtil',
                'ProjectFinancialResultUtil',
                'PaymentFormsUtil',
                'ExecutiveExpenditureUtil',
                'SubContractorPayItemUtil',
                'ProjectIncomeUtil',
                'KpiUtil',
                'bsLoadingOverlayService',
                kpiCompanyRiskCtrl
            ])

    /** @ngInject */
    function kpiCompanyRiskCtrl($scope,
                                toastr,
                                $cookies,
                                $filter,
                                $compile,
                                $timeout,
                                window,
                                ngDialog,
                                User,
                                WorkHourUtil,
                                DateUtil,
                                TimeUtil,
                                Project,
                                ProjectUtil,
                                ProjectFinancialRateUtil,
                                ProjectFinancialResultUtil,
                                PaymentFormsUtil,
                                ExecutiveExpenditureUtil,
                                SubContractorPayItemUtil,
                                ProjectIncomeUtil,
                                KpiUtil,
                                bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        // 主要顯示
        $scope.subContractorVendors = [];

        var specificYear = thisYear;
        var thisYear = new Date().getFullYear() - 1911;

        $scope.listenYear = function (dom) {
            dom.$watch('myYear', function (newValue, oldValue) {
                if (dom.isShiftYearSelect) {
                    dom.isShiftYearSelect = false;
                    $scope.year = specificYear = newValue - 1911;
                    $scope.fetchYearlyProject(specificYear)
                    var formData = {}
                    ProjectFinancialResultUtil.syncAllFRAndProject(formData)
                        .success(function (res) {
                        })
                }
            });
        }

        //所有專案，資料比對用
        Project.findAll()
            .success(function (allProjects) {
                $scope.allProjectCache = [];
                var prjCount = allProjects.length;
                for (var index = 0; index < prjCount; index++) {

                    // 專案名稱顯示規則 2019/07 定義
                    var nameResult = "";
                    if (allProjects[index].prjSubName != undefined && allProjects[index].prjSubName.trim() != "") {
                        nameResult = allProjects[index].prjSubName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    } else if (allProjects[index].prjName != undefined && allProjects[index].prjName.trim() != "") {
                        nameResult = allProjects[index].prjName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    } else {
                        nameResult = allProjects[index].mainName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    }

                    $scope.allProjectCache[index] = {
                        prjDID: allProjects[index]._id,
                        prjCode: allProjects[index].prjCode,
                        mainName: allProjects[index].mainName + " - "
                        + allProjects[index].prjName + " - "
                        + allProjects[index].prjSubName + " - "
                        + ProjectUtil.getTypeText(allProjects[index].type),
                        majorID: allProjects[index].majorID,
                        managerID: allProjects[index].managerID,
                        ezName: nameResult,
                        combinedID: allProjects[index].combinedID,
                    };
                }
            })

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
                $scope.projectManagers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allUsers[i]._id,
                        name: allUsers[i].name
                    };
                }
            });

        //技師
        User.findTechs()
            .success(function (allTechs) {
                $scope.projectTechs = [];
                for (var i = 0; i < allTechs.length; i++) {
                    $scope.projectTechs[i] = {
                        value: allTechs[i]._id,
                        name: allTechs[i].name
                    };
                }
            });

        $scope.showPrjName = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }

            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].mainName : 'Not Set';
        };

        $scope.showManager = function (project) {
            var selected = [];
            if ($scope.projectManagers === undefined) return;
            if (project.managerID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: project.managerID
                });
            }
            return selected.length ? selected[0].name : '未指派經理';
        };

        $scope.showTechs = function (techs) {
            var resault = "";
            var selected = [];
            if ($scope.projectTechs === undefined) return;
            for (var index = 0; index < techs.length; index++) {
                selected = $filter('filter')($scope.projectTechs, {
                    value: techs[index],
                });
                resault += selected.length ? selected[0].name + ", " : '未指定';
            }
            return resault;
        }

        // mainly function
        $scope.fetchYearlyProject = function (specificYear) {
            console.log(specificYear);

            var formData = {
                year: specificYear,
                isPrjClose: true,
            }
            // initialize
            $scope.selectPrjInfo = [];
            $scope.selectPrjArray = [];
            $scope.projectFinancialResultTable = [];

            // recursion
            $scope.overall_data = [];
            $scope.projectIncomeTable = [];
            $scope.searchPaymentsItems = [];
            $scope.displayEEItems = [];
            $scope.subContractorPayItems = [];

            ProjectFinancialRateUtil.getFinancialRate(formData) // year rate
                .success(function (res) {
                    $scope.yearRate = res.payload;
                    Project.findByRequest(formData)
                        .success(function (res) {
                            console.log(res.payload);
                            // Loading start
                            $timeout(function () {
                                bsLoadingOverlayService.start({
                                    referenceId: 'mainPage_kpi_companyRisk_result'
                                });
                            }, 100)
                            if (res.payload.length == 0) {
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'mainPage_kpi_companyRisk_result'
                                    });
                                }, 500)
                            } else {
                                for (var index = 0; index < res.payload.length; index++) {
                                    console.log("index:> " + index)
                                    var prjDID = res.payload[index]._id;
                                    $scope.findOneFR(res.payload[index]);
                                    // var evalString = "$scope.selectPrjInfo[prjDID] = res.payload[index]"
                                    // eval(evalString);
                                    // var formData = {
                                    //     rootPrjDID: prjDID
                                    // }
                                    // Project.fetchRelatedCombinedPrjArray(formData)
                                    //     .success(function (res) {
                                    //         console.log(" --- 相關專案 ---");
                                    //         console.log(res);
                                    //         var evalString = "$scope.selectPrjArray[res[0]] = res"
                                    //         eval(evalString);
                                    //         // $scope.selectPrjArray = res;
                                    //         $scope.findOneFR($scope.selectPrjInfo[res[0]]);
                                    //     })
                                }
                            }
                        })
                })
        }


        // step 2, for recursion
        $scope.findOneFR = function (prjInfo) {
            var formData = {
                prjDID: prjInfo._id,
            }
            ProjectFinancialResultUtil.findFR(formData)
                .success(function (res) {
                    console.log(" === findFR === ");
                    console.log(res);

                    if (res.payload.length == 0) {
                        console.log("還沒結算")
                    } else {
                        if (!res.payload[0].is011Set) {
                            res.payload[0].rate_item_1 = $scope.yearRate.rate_item_1;
                            res.payload[0].rate_item_2 = $scope.yearRate.rate_item_2;
                            res.payload[0].rate_item_21 = $scope.yearRate.rate_item_21;
                            res.payload[0].rate_item_3 = $scope.yearRate.rate_item_3;
                            res.payload[0].rate_item_4 = $scope.yearRate.rate_item_4;
                            res.payload[0].rate_item_5 = $scope.yearRate.rate_item_5;
                        }
                        res.payload[0].prjInfo = prjInfo;
                        $scope.projectFinancialResultTable.push(res.payload[0]);
                        var evalString = "$scope.projectFinancialResultTable[prjInfo._id] = res.payload[0]";
                        eval(evalString);

                        // var incomeFormData = {
                        //     prjDIDArray: $scope.selectPrjArray[prjInfo._id],
                        //     isEnable: true
                        // }
                        //
                        // KpiUtil.fetchKpiItemsByPrjDIDArray(incomeFormData)
                        //     .success(function (res) {
                        //         console.log(res);
                        //
                        //         // 收入
                        //         $scope.projectIncomeTable[res.prjDID] = res.projectIncomes;
                        //         for (var i = 0; i < res.projectIncomes.length; i++) {
                        //             var tempDate = moment(res.projectIncomes[i].realDate).format("YYYY/MM");
                        //             if (moment(tempDate) >= moment("2020/01")) {
                        //                 var tempData = $scope.overall_data[res.prjDID];
                        //                 if (tempData != undefined) {
                        //                     if (tempData[tempDate] != undefined) {
                        //                         var data = $scope.overall_data[res.prjDID][tempDate];
                        //                         data._income.push(res.projectIncomes[i]);
                        //                     } else {
                        //                         var data = {
                        //                             _date: tempDate,
                        //                             _income: [res.projectIncomes[i]],
                        //                             _payments: [],
                        //                             _otherCost: [],
                        //                             _subContractorPay: [],
                        //                             _overall: 0,
                        //                         }
                        //                         var temp = $scope.overall_data[res.prjDID]
                        //                         eval('temp[tempDate] = data')
                        //                         $scope.overall_data[res.prjDID].push(data);
                        //                     }
                        //                 } else {
                        //                     var data = {
                        //                         _date: tempDate,
                        //                         _income: [res.projectIncomes[i]],
                        //                         _payments: [],
                        //                         _otherCost: [],
                        //                         _subContractorPay: [],
                        //                         _overall: 0,
                        //                     }
                        //                     eval('$scope.overall_data[res.prjDID] = []')
                        //                     var temp = $scope.overall_data[res.prjDID]
                        //                     eval('temp[tempDate] = data')
                        //                     $scope.overall_data[res.prjDID].push(data);
                        //                 }
                        //             }
                        //         }
                        //
                        //         // 墊付款
                        //         $scope.searchPaymentsItems[res.prjDID] = res.paymentItems;
                        //         for (var i = 0; i < res.paymentItems.length; i++) {
                        //             var tempDate = moment(res.paymentItems[i].year + 1911 + "/" + res.paymentItems[i].month).format("YYYY/MM");
                        //             if (moment(tempDate) >= moment("2020/01")) {
                        //                 var tempData = $scope.overall_data[res.prjDID];
                        //                 if (tempData != undefined) {
                        //                     if (tempData[tempDate] != undefined) {
                        //                         var data = $scope.overall_data[res.prjDID][tempDate];
                        //                         data._payments.push(res.paymentItems[i]);
                        //                     } else {
                        //                         var data = {
                        //                             _date: tempDate,
                        //                             _income: [],
                        //                             _payments: [res.paymentItems[i]],
                        //                             _otherCost: [],
                        //                             _subContractorPay: [],
                        //                             _overall: 0,
                        //                         }
                        //                         var temp = $scope.overall_data[res.prjDID]
                        //                         eval('temp[tempDate] = data')
                        //                         $scope.overall_data[res.prjDID].push(data);
                        //                     }
                        //                 } else {
                        //                     var data = {
                        //                         _date: tempDate,
                        //                         _income: [],
                        //                         _payments: [res.paymentItems[i]],
                        //                         _otherCost: [],
                        //                         _subContractorPay: [],
                        //                         _overall: 0,
                        //                     }
                        //                     eval('$scope.overall_data[res.prjDID] = []')
                        //                     var temp = $scope.overall_data[res.prjDID]
                        //                     eval('temp[tempDate] = data')
                        //                     $scope.overall_data[res.prjDID].push(data);
                        //                 }
                        //             }
                        //         }
                        //
                        //         // 其他支出
                        //         $scope.displayEEItems[res.prjDID] = res.executiveExpenditureItems;
                        //         for (var i = 0; i < res.executiveExpenditureItems.length; i++) {
                        //             var tempDate = moment(res.executiveExpenditureItems[i].year + 1911 + "/" + res.executiveExpenditureItems[i].month).format("YYYY/MM");
                        //             if (moment(tempDate) >= moment("2020/01")) {
                        //                 var tempData = $scope.overall_data[res.prjDID];
                        //                 if (tempData != undefined) {
                        //                     if (tempData[tempDate] != undefined) {
                        //                         var data = $scope.overall_data[res.prjDID][tempDate];
                        //                         data._otherCost.push(res.executiveExpenditureItems[i]);
                        //                     } else {
                        //                         var data = {
                        //                             _date: tempDate,
                        //                             _income: [],
                        //                             _payments: [],
                        //                             _otherCost: [res.executiveExpenditureItems[i]],
                        //                             _subContractorPay: [],
                        //                             _overall: 0,
                        //                         }
                        //                         var temp = $scope.overall_data[res.prjDID]
                        //                         eval('temp[tempDate] = data')
                        //                         $scope.overall_data[res.prjDID].push(data);
                        //                     }
                        //                 } else {
                        //                     var data = {
                        //                         _date: tempDate,
                        //                         _income: [],
                        //                         _payments: [],
                        //                         _otherCost: [res.executiveExpenditureItems[i]],
                        //                         _subContractorPay: [],
                        //                         _overall: 0,
                        //                     }
                        //                     eval('$scope.overall_data[res.prjDID] = []')
                        //                     var temp = $scope.overall_data[res.prjDID]
                        //                     eval('temp[tempDate] = data')
                        //                     $scope.overall_data[res.prjDID].push(data);
                        //                 }
                        //             }
                        //         }
                        //
                        //         // 廠商請款
                        //         $scope.subContractorPayItems[res.prjDID] = res.subContractorPayItems;
                        //         for (var i = 0; i < res.subContractorPayItems.length; i++) {
                        //             var tempDate = moment(res.subContractorPayItems[i].year + 1911 + "/" + res.subContractorPayItems[i].month).format("YYYY/MM");
                        //             if (moment(tempDate) >= moment("2020/01")) {
                        //                 var tempData = $scope.overall_data[res.prjDID];
                        //                 if (tempData != undefined) {
                        //                     if (tempData[tempDate] != undefined) {
                        //                         var data = $scope.overall_data[res.prjDID][tempDate];
                        //                         data._subContractorPay.push(res.subContractorPayItems[i]);
                        //                     } else {
                        //                         var data = {
                        //                             _date: tempDate,
                        //                             _income: [],
                        //                             _payments: [],
                        //                             _otherCost: [],
                        //                             _subContractorPay: [res.subContractorPayItems[i]],
                        //                             _overall: 0,
                        //                         }
                        //                         var temp = $scope.overall_data[res.prjDID]
                        //                         eval('temp[tempDate] = data')
                        //                         $scope.overall_data[prjInfo._id].push(data);
                        //                     }
                        //                 } else {
                        //                     var data = {
                        //                         _date: tempDate,
                        //                         _income: [],
                        //                         _payments: [],
                        //                         _otherCost: [],
                        //                         _subContractorPay: [res.subContractorPayItems[i]],
                        //                         _overall: 0,
                        //                     }
                        //                     eval('$scope.overall_data[res.prjDID] = []')
                        //                     var temp = $scope.overall_data[res.prjDID]
                        //                     eval('temp[tempDate] = data')
                        //                     $scope.overall_data[res.prjDID].push(data);
                        //                 }
                        //             }
                        //         }
                        //
                        //
                        //     })

                        // // 收入
                        // ProjectIncomeUtil.findIncomeByPrjDIDArray(incomeFormData)
                        //     .success(function (res) {
                        //         console.log(" --- 收入 --- ");
                        //         console.log(res);
                        //         $scope.projectIncomeTable[res.prjDID] = res.payload;
                        //         for (var i = 0; i < res.payload.length; i++) {
                        //             var tempDate = moment(res.payload[i].realDate).format("YYYY/MM");
                        //             if (moment(tempDate) >= moment("2020/01")) {
                        //                 var tempData = $scope.overall_data[res.prjDID];
                        //                 if (tempData != undefined) {
                        //                     if (tempData[tempDate] != undefined) {
                        //                         var data = $scope.overall_data[res.prjDID][tempDate];
                        //                         data._income.push(res.payload[i]);
                        //                     } else {
                        //                         var data = {
                        //                             _date: tempDate,
                        //                             _income: [res.payload[i]],
                        //                             _payments: [],
                        //                             _otherCost: [],
                        //                             _subContractorPay: [],
                        //                             _overall: 0,
                        //                         }
                        //                         var temp = $scope.overall_data[res.prjDID]
                        //                         eval('temp[tempDate] = data')
                        //                         $scope.overall_data[res.prjDID].push(data);
                        //                     }
                        //                 } else {
                        //                     var data = {
                        //                         _date: tempDate,
                        //                         _income: [res.payload[i]],
                        //                         _payments: [],
                        //                         _otherCost: [],
                        //                         _subContractorPay: [],
                        //                         _overall: 0,
                        //                     }
                        //                     eval('$scope.overall_data[res.prjDID] = []')
                        //                     var temp = $scope.overall_data[res.prjDID]
                        //                     eval('temp[tempDate] = data')
                        //                     $scope.overall_data[res.prjDID].push(data);
                        //                 }
                        //             }
                        //         }
                        //
                        //         var subFormData = {
                        //             prjDIDArray: $scope.selectPrjArray[res.prjDID]
                        //         }
                        //
                        //         // 墊付款
                        //         PaymentFormsUtil.fetchPaymentsItemByPrjDIDArray(subFormData)
                        //             .success(function (res) {
                        //                 console.log(" --- 墊付款 --- ")
                        //                 console.log(res);
                        //                 $scope.searchPaymentsItems[res.prjDID] = res.payload;
                        //                 for (var i = 0; i < res.payload.length; i++) {
                        //                     var tempDate = moment(res.payload[i].year + 1911 + "/" + res.payload[i].month).format("YYYY/MM");
                        //                     if (moment(tempDate) >= moment("2020/01")) {
                        //                         var tempData = $scope.overall_data[res.prjDID];
                        //                         if (tempData != undefined) {
                        //                             if (tempData[tempDate] != undefined) {
                        //                                 var data = $scope.overall_data[res.prjDID][tempDate];
                        //                                 data._payments.push(res.payload[i]);
                        //                             } else {
                        //                                 var data = {
                        //                                     _date: tempDate,
                        //                                     _income: [],
                        //                                     _payments: [res.payload[i]],
                        //                                     _otherCost: [],
                        //                                     _subContractorPay: [],
                        //                                     _overall: 0,
                        //                                 }
                        //                                 var temp = $scope.overall_data[res.prjDID]
                        //                                 eval('temp[tempDate] = data')
                        //                                 $scope.overall_data[res.prjDID].push(data);
                        //                             }
                        //                         } else {
                        //                             var data = {
                        //                                 _date: tempDate,
                        //                                 _income: [],
                        //                                 _payments: [res.payload[i]],
                        //                                 _otherCost: [],
                        //                                 _subContractorPay: [],
                        //                                 _overall: 0,
                        //                             }
                        //                             eval('$scope.overall_data[res.prjDID] = []')
                        //                             var temp = $scope.overall_data[res.prjDID]
                        //                             eval('temp[tempDate] = data')
                        //                             $scope.overall_data[res.prjDID].push(data);
                        //                         }
                        //                     }
                        //                 }
                        //
                        //                 var subFormData = {
                        //                     prjDIDArray: $scope.selectPrjArray[res.prjDID]
                        //                 }
                        //
                        //                 // 其他支出
                        //                 ExecutiveExpenditureUtil.fetchExecutiveExpenditureItemsByPrjDIDArray(subFormData)
                        //                     .success(function (res) {
                        //                         console.log(" --- 其他支出 --- ");
                        //                         console.log(res)
                        //                         $scope.displayEEItems[res.prjDID] = res.payload;
                        //                         for (var i = 0; i < res.payload.length; i++) {
                        //                             var tempDate = moment(res.payload[i].year + 1911 + "/" + res.payload[i].month).format("YYYY/MM");
                        //                             if (moment(tempDate) >= moment("2020/01")) {
                        //                                 var tempData = $scope.overall_data[res.prjDID];
                        //                                 if (tempData != undefined) {
                        //                                     if (tempData[tempDate] != undefined) {
                        //                                         var data = $scope.overall_data[res.prjDID][tempDate];
                        //                                         data._otherCost.push(res.payload[i]);
                        //                                     } else {
                        //                                         var data = {
                        //                                             _date: tempDate,
                        //                                             _income: [],
                        //                                             _payments: [],
                        //                                             _otherCost: [res.payload[i]],
                        //                                             _subContractorPay: [],
                        //                                             _overall: 0,
                        //                                         }
                        //                                         var temp = $scope.overall_data[res.prjDID]
                        //                                         eval('temp[tempDate] = data')
                        //                                         $scope.overall_data[res.prjDID].push(data);
                        //                                     }
                        //                                 } else {
                        //                                     var data = {
                        //                                         _date: tempDate,
                        //                                         _income: [],
                        //                                         _payments: [],
                        //                                         _otherCost: [res.payload[i]],
                        //                                         _subContractorPay: [],
                        //                                         _overall: 0,
                        //                                     }
                        //                                     eval('$scope.overall_data[res.prjDID] = []')
                        //                                     var temp = $scope.overall_data[res.prjDID]
                        //                                     eval('temp[tempDate] = data')
                        //                                     $scope.overall_data[res.prjDID].push(data);
                        //                                 }
                        //                             }
                        //                         }
                        //
                        //                         // 廠商請款
                        //                         SubContractorPayItemUtil.fetchSCPayItemsByPrjDIDArray(subFormData)
                        //                             .success(function (res) {
                        //                                 console.log(" --- 廠商請款 --- ")
                        //                                 console.log(res);
                        //                                 $scope.subContractorPayItems[res.prjDID] = res.payload;
                        //                                 for (var i = 0; i < res.payload.length; i++) {
                        //                                     var tempDate = moment(res.payload[i].year + 1911 + "/" + res.payload[i].month).format("YYYY/MM");
                        //                                     if (moment(tempDate) >= moment("2020/01")) {
                        //                                         var tempData = $scope.overall_data[res.prjDID];
                        //                                         if (tempData != undefined) {
                        //                                             if (tempData[tempDate] != undefined) {
                        //                                                 var data = $scope.overall_data[res.prjDID][tempDate];
                        //                                                 data._subContractorPay.push(res.payload[i]);
                        //                                             } else {
                        //                                                 var data = {
                        //                                                     _date: tempDate,
                        //                                                     _income: [],
                        //                                                     _payments: [],
                        //                                                     _otherCost: [],
                        //                                                     _subContractorPay: [res.payload[i]],
                        //                                                     _overall: 0,
                        //                                                 }
                        //                                                 var temp = $scope.overall_data[res.prjDID]
                        //                                                 eval('temp[tempDate] = data')
                        //                                                 $scope.overall_data[prjInfo._id].push(data);
                        //                                             }
                        //                                         } else {
                        //                                             var data = {
                        //                                                 _date: tempDate,
                        //                                                 _income: [],
                        //                                                 _payments: [],
                        //                                                 _otherCost: [],
                        //                                                 _subContractorPay: [res.payload[i]],
                        //                                                 _overall: 0,
                        //                                             }
                        //                                             eval('$scope.overall_data[res.prjDID] = []')
                        //                                             var temp = $scope.overall_data[res.prjDID]
                        //                                             eval('temp[tempDate] = data')
                        //                                             $scope.overall_data[res.prjDID].push(data);
                        //                                         }
                        //                                     }
                        //                                 }
                        //                             })
                        //
                        //
                        //                     })
                        //                     .error(function (res) {
                        //                     })
                        //
                        //             })
                        //             .error(function (resp) {
                        //             })
                        //
                        //
                        //     })

                        // var subFormData = {
                        //     prjDIDArray: $scope.selectPrjArray[prjInfo._id]
                        // }
                        //
                        // // 墊付款
                        // PaymentFormsUtil.fetchPaymentsItemByPrjDIDArray(subFormData)
                        //     .success(function (res) {
                        //         console.log(" --- 墊付款 --- ")
                        //         console.log(res);
                        //         $scope.searchPaymentsItems[prjInfo._id] = res.payload;
                        //         for (var i = 0; i < res.payload.length; i++) {
                        //             var tempDate = moment(res.payload[i].year + 1911 + "/" + res.payload[i].month).format("YYYY/MM");
                        //             if (moment(tempDate) >= moment("2020/01")) {
                        //                 var tempData = $scope.overall_data[prjInfo._id];
                        //                 if (tempData != undefined) {
                        //                     if (tempData[tempDate] != undefined) {
                        //                         var data = $scope.overall_data[prjInfo._id][tempDate];
                        //                         data._payments.push(res.payload[i]);
                        //                     } else {
                        //                         var data = {
                        //                             _date: tempDate,
                        //                             _income: [],
                        //                             _payments: [res.payload[i]],
                        //                             _otherCost: [],
                        //                             _subContractorPay: [],
                        //                             _overall: 0,
                        //                         }
                        //                         var temp = $scope.overall_data[prjInfo._id]
                        //                         eval('temp[tempDate] = data')
                        //                         $scope.overall_data[prjInfo._id].push(data);
                        //                     }
                        //                 } else {
                        //                     var data = {
                        //                         _date: tempDate,
                        //                         _income: [],
                        //                         _payments: [res.payload[i]],
                        //                         _otherCost: [],
                        //                         _subContractorPay: [],
                        //                         _overall: 0,
                        //                     }
                        //                     eval('$scope.overall_data[prjInfo._id] = []')
                        //                     var temp = $scope.overall_data[prjInfo._id]
                        //                     eval('temp[tempDate] = data')
                        //                     $scope.overall_data[prjInfo._id].push(data);
                        //                 }
                        //             }
                        //         }
                        //     })
                        //     .error(function (resp) {
                        //     })

                        // // 其他支出
                        // ExecutiveExpenditureUtil.fetchExecutiveExpenditureItemsByPrjDIDArray(subFormData)
                        //     .success(function (res) {
                        //         console.log(" --- 其他支出 --- ");
                        //         console.log(res)
                        //         $scope.displayEEItems[prjInfo._id] = res.payload;
                        //         for (var i = 0; i < res.payload.length; i++) {
                        //             var tempDate = moment(res.payload[i].year + 1911 + "/" + res.payload[i].month).format("YYYY/MM");
                        //             if (moment(tempDate) >= moment("2020/01")) {
                        //                 var tempData = $scope.overall_data[prjInfo._id];
                        //                 if (tempData != undefined) {
                        //                     if (tempData[tempDate] != undefined) {
                        //                         var data = $scope.overall_data[prjInfo._id][tempDate];
                        //                         data._otherCost.push(res.payload[i]);
                        //                     } else {
                        //                         var data = {
                        //                             _date: tempDate,
                        //                             _income: [],
                        //                             _payments: [],
                        //                             _otherCost: [res.payload[i]],
                        //                             _subContractorPay: [],
                        //                             _overall: 0,
                        //                         }
                        //                         var temp = $scope.overall_data[prjInfo._id]
                        //                         eval('temp[tempDate] = data')
                        //                         $scope.overall_data[prjInfo._id].push(data);
                        //                     }
                        //                 } else {
                        //                     var data = {
                        //                         _date: tempDate,
                        //                         _income: [],
                        //                         _payments: [],
                        //                         _otherCost: [res.payload[i]],
                        //                         _subContractorPay: [],
                        //                         _overall: 0,
                        //                     }
                        //                     eval('$scope.overall_data[prjInfo._id] = []')
                        //                     var temp = $scope.overall_data[prjInfo._id]
                        //                     eval('temp[tempDate] = data')
                        //                     $scope.overall_data[prjInfo._id].push(data);
                        //                 }
                        //             }
                        //         }
                        //     })
                        //     .error(function (res) {
                        //     })
                        //
                        // // 廠商請款
                        // SubContractorPayItemUtil.fetchSCPayItemsByPrjDIDArray(subFormData)
                        //     .success(function (res) {
                        //         console.log(" --- 廠商請款 --- ")
                        //         console.log(res);
                        //         $scope.subContractorPayItems[prjInfo._id] = res.payload;
                        //         for (var i = 0; i < res.payload.length; i++) {
                        //             var tempDate = moment(res.payload[i].year + 1911 + "/" + res.payload[i].month).format("YYYY/MM");
                        //             if (moment(tempDate) >= moment("2020/01")) {
                        //                 var tempData = $scope.overall_data[prjInfo._id];
                        //                 if (tempData != undefined) {
                        //                     if (tempData[tempDate] != undefined) {
                        //                         var data = $scope.overall_data[prjInfo._id][tempDate];
                        //                         data._subContractorPay.push(res.payload[i]);
                        //                     } else {
                        //                         var data = {
                        //                             _date: tempDate,
                        //                             _income: [],
                        //                             _payments: [],
                        //                             _otherCost: [],
                        //                             _subContractorPay: [res.payload[i]],
                        //                             _overall: 0,
                        //                         }
                        //                         var temp = $scope.overall_data[prjInfo._id]
                        //                         eval('temp[tempDate] = data')
                        //                         $scope.overall_data[prjInfo._id].push(data);
                        //                     }
                        //                 } else {
                        //                     var data = {
                        //                         _date: tempDate,
                        //                         _income: [],
                        //                         _payments: [],
                        //                         _otherCost: [],
                        //                         _subContractorPay: [res.payload[i]],
                        //                         _overall: 0,
                        //                     }
                        //                     eval('$scope.overall_data[prjInfo._id] = []')
                        //                     var temp = $scope.overall_data[prjInfo._id]
                        //                     eval('temp[tempDate] = data')
                        //                     $scope.overall_data[prjInfo._id].push(data);
                        //                 }
                        //             }
                        //         }
                        //     })
                        //
                        // // 人時支出
                        // var getData = {};
                        //
                        // getData.branch = $scope.selectPrjInfo.branch;
                        // getData.year = $scope.selectPrjInfo.year;
                        // getData.code = $scope.selectPrjInfo.code;
                        // getData.prjNumber = $scope.selectPrjInfo.prjNumber;
                        // getData.prjSubNumber = $scope.selectPrjInfo.prjSubNumber;
                        // getData.type = $scope.selectPrjInfo.type;
                        //
                        // WorkHourUtil.queryStatisticsForms_projectIncome_Cost_ByPrjDIDArray(subFormData)
                        //     .success(function (res) {
                        //         console.log(" === 人工時 === ")
                        //         console.log(res)
                        //         res.payload = res.payload.sort(function (a, b) {
                        //             return a._id.userDID > b._id.userDID ? 1 : -1;
                        //         });
                        //
                        //         for (var index = 0; index < res.payload.length; index ++) {
                        //             for (var index_sub = 0; index_sub < res.payload_add.length; index_sub ++) {
                        //                 if( res.payload_add[index_sub]._id.prjCode == res.payload[index]._id.prjCode &&
                        //                     res.payload_add[index_sub]._id.userDID == res.payload[index]._id.userDID) {
                        //                     res.payload[index]._add_tables = res.payload_add[index_sub].add_tables;
                        //                 }
                        //             }
                        //         }
                        //         $scope.statisticsResults_type1 = $scope.filter_type1_data(res.payload);
                        //         console.log(" ----- filter_type1_data -------- ")
                        //         $scope.statisticsResults_type2 = $scope.filter_type2_data_item($scope.statisticsResults_type1);
                        //         console.log(" ----- filter_type2_data_item -------- ")
                        //         console.log($scope.statisticsResults_type2);
                        //
                        //         for (var i = 0; i < $scope.statisticsResults_type2.length; i ++) {
                        //             var tempDate = $scope.statisticsResults_type2[i]._date;
                        //
                        //             if (moment(tempDate) >= moment("2020/01")) {
                        //                 if ($scope.overall_data[tempDate] != undefined) {
                        //                     var data = $scope.overall_data[tempDate];
                        //                     data._overall += $scope.statisticsResults_type2[i].totalCost +
                        //                         $scope.statisticsResults_type2[i].hourTotal_add_cost_A +
                        //                         $scope.statisticsResults_type2[i].hourTotal_add_cost_B;
                        //                 } else {
                        //                     var data = {
                        //                         _date: tempDate,
                        //                         _income: [],
                        //                         _payments: [],
                        //                         _otherCost: [],
                        //                         _subContractorPay: [],
                        //                         _overall: $scope.statisticsResults_type2[i].totalCost +
                        //                         $scope.statisticsResults_type2[i].hourTotal_add_cost_A +
                        //                         $scope.statisticsResults_type2[i].hourTotal_add_cost_B,
                        //                     }
                        //                     $scope.overall_data.push(data);
                        //                     eval('$scope.overall_data[tempDate] = data')
                        //                 }
                        //             }
                        //         }
                        //         console.log($scope.overall_data)
                        //     })

                        angular.element(
                            document.getElementById('includeHead_kpi_companyRisk_result'))
                            .html($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'" + "" + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/pages/kpi/risk/tables/kpiCompanyRisk_result_table.html'\">" +
                                "</div>" +
                                "</div>"
                            )($scope));
                    }

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_companyRisk_result'
                        });
                    }, 1000)
                })

        }

        $scope.fetchKPIValue = function(type, item) {
            switch(type) {
                case 8:
                    return item.kpi8;
            }
        }

        $scope.calIncomeKpi = function (type, item) {
            var incomeA = 0.0;
            if ($scope.projectIncomeTable[item.prjInfo._id] == null) return
            for (var i = 0; i < $scope.projectIncomeTable[item.prjInfo._id].length; i++) {
                if (moment($scope.projectIncomeTable[item.prjInfo._id][i].realDate) >= moment("2020/01")) {
                    incomeA += parseInt($scope.projectIncomeTable[item.prjInfo._id][i].expectAmount)
                }
            }
            switch (type) {
                case 1:
                    return incomeA;
                case 2:
                    return Math.round(incomeA / 1.05)
            }
        }

        $scope.calFines = function () {
            var incomeA = 0.0;
            if ($scope.projectIncomeTable == undefined) return incomeA;
            for (var i = 0; i < $scope.projectIncomeTable.length; i++) {
                if (moment($scope.projectIncomeTable[i].realDate) >= moment("2020/01")) {
                    incomeA += parseInt($scope.projectIncomeTable[i].fines)
                }
            }
            // console.log("calFines:> " + incomeA)
            return incomeA;
        }

        $scope.calFee = function () {
            var incomeA = 0.0;
            if ($scope.projectIncomeTable == undefined) return incomeA;
            for (var i = 0; i < $scope.projectIncomeTable.length; i++) {
                if (moment($scope.projectIncomeTable[i].realDate) >= moment("2020/01")) {
                    incomeA += parseInt($scope.projectIncomeTable[i].fee)
                }
            }
            // console.log("calFee:> " + incomeA)
            return incomeA;
        }


        $scope.calSubContractorPayKpi = function (item) {
            // 廠商請款
            var resultD = 0.0;
            if ($scope.subContractorPayItems[item.prjInfo._id] == undefined) return resultD;
            for (var i = 0; i < $scope.subContractorPayItems[item.prjInfo._id].length; i++) {
                var tempDate = moment($scope.subContractorPayItems[item.prjInfo._id][i].year + 1911 + "/" +
                    $scope.subContractorPayItems[item.prjInfo._id][i].month).format("YYYY/MM");
                if (moment(tempDate) >= moment("2020/01")) {
                    resultD += (parseInt($scope.subContractorPayItems[item.prjInfo._id][i].payApply) -
                        parseInt($scope.subContractorPayItems[item.prjInfo._id][i].payTax) -
                        parseInt($scope.subContractorPayItems[item.prjInfo._id][i].payOthers)
                    )
                }
            }
            // console.log("resultD:> " + resultD)
            return resultD;
        }

        $scope.calResultKpi = function (type, item) {
            switch (type) {
                // 公司調整(規劃、設計、監造廷整)C=B*調整值
                case 3:
                    return Math.round(item.rate_item_5 * $scope.calIncomeKpi(2, item) / 100);
                // 實際收入E=C-D
                case 4:
                    return Math.round(item.rate_item_5 * $scope.calIncomeKpi(2, item) / 100 - $scope.calSubContractorPayKpi(item));
                // 行政費 E*N
                case 5:
                    return Math.round(item.rate_item_2 * ($scope.calResultKpi(4, item)) / 100);
                // 行政費 E*N
                case 51:
                    if (item.rate_item_21 === undefined) {
                        return 0;
                    }
                    return Math.round(item.rate_item_21 * ($scope.calResultKpi(4, item)) / 100);
                // 技師費 E*N
                case 6:
                    return Math.round(item.rate_item_1 * ($scope.calResultKpi(4, item)) / 100);
                // 風險 E*N
                case 7:
                    $scope.totalRisk += Math.round(item.rate_item_4 * ($scope.calResultKpi(4, item)) / 100);
                    return Math.round(item.rate_item_4 * ($scope.calResultKpi(4, item)) / 100);
                // 利潤 E*N
                case 8:
                    return Math.round(item.rate_item_3 * ($scope.calResultKpi(4, item)) / 100);
                // 可分配績效
                case 9:
                    return Math.round(($scope.calResultKpi(4, item))
                        - ($scope.calResultKpi(5, item))
                        - ($scope.calResultKpi(51, item))
                        - ($scope.calResultKpi(6, item))
                        - ($scope.calResultKpi(7, item))
                        - ($scope.calResultKpi(8, item))
                        // - $scope.calcAllCost()
                        - $scope.calcAllCost_special20201207()
                        - item.otherCost)
            }
        }


        $scope.calResultKpiAll = function(type) {
            var result = 0.0;
            switch (type){
                // 風險 E*N
                case 7:
                    for (var index = 0; index < $scope.projectFinancialResultTable.length; index++) {
                        var item = $scope.projectFinancialResultTable[index];
                        result += item.kpi8;
                    }
                    return result;
            }
        }


        // ============ algorithm
        $scope.filter_type1_data = function (rawTables) {
            // console.log(rawTables)
            var itemList = [];

            var type1_data = [];
            var table_add_id_array = [];

            for (var memberCount = 0; memberCount < rawTables.length; memberCount++) {
                // console.log(rawTables[memberCount].tables);
                if (rawTables[memberCount].tables != undefined) {
                    for (var table_index = 0; table_index < rawTables[memberCount].tables.length; table_index++) {
                        if (rawTables[memberCount].tables[table_index].mon_hour > 0) {
                            var item = "_" + DateUtil.getShiftDatefromFirstDate_month(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                , 0) + "_" +
                                rawTables[memberCount]._id.prjCode;

                            // rawTables[memberCount].tables[table_index]._day = 1;
                            // var tableData = rawTables[memberCount].tables[table_index];

                            var tableData = {};
                            Object.assign(tableData, rawTables[memberCount].tables[table_index]);
                            tableData._day = 1;

                            if (type1_data[item] != undefined) {
                                var data = type1_data[item];
                                data.tables.push(tableData);
                                if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                    data.users.push(rawTables[memberCount]._id.userDID);
                                    data.users_info.push(rawTables[memberCount]._user_info);
                                }
                            } else {

                                itemList.push(item);

                                var tables = [];

                                tables.push(tableData);

                                var users = [];

                                users.push(rawTables[memberCount]._id.userDID);

                                var users_info = [];

                                users_info.push(rawTables[memberCount]._user_info);

                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate_month_slash(moment(rawTables[memberCount].tables[table_index].create_formDate), 0),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 0)),
                                    // _day: 1,
                                    // _day_tw: DateUtil.getDay(1),
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _project_info: rawTables[memberCount]._project_info,
                                    users: users,
                                    users_info: users_info,
                                    tables: tables,
                                    _add_tables: [],
                                }
                                eval('type1_data[item] = data')
                            }
                        }

                        if (rawTables[memberCount].tables[table_index].tue_hour > 0) {
                            var item = "_" + DateUtil.getShiftDatefromFirstDate_month(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                , 1) + "_" +
                                rawTables[memberCount]._id.prjCode;

                            // rawTables[memberCount].tables[table_index]._day = 2;
                            // var tableData = rawTables[memberCount].tables[table_index];
                            var tableData = {};
                            Object.assign(tableData, rawTables[memberCount].tables[table_index]);
                            tableData._day = 2;

                            if (type1_data[item] != undefined) {
                                var data = type1_data[item];
                                data.tables.push(tableData);
                                if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                    data.users.push(rawTables[memberCount]._id.userDID);
                                    data.users_info.push(rawTables[memberCount]._user_info);
                                }
                            } else {

                                itemList.push(item);

                                var tables = [];

                                tables.push(tableData);

                                var users = [];

                                users.push(rawTables[memberCount]._id.userDID);

                                var users_info = [];

                                users_info.push(rawTables[memberCount]._user_info);

                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate_month_slash(moment(rawTables[memberCount].tables[table_index].create_formDate), 1),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 0)),
                                    // _day: 1,
                                    // _day_tw: DateUtil.getDay(1),
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _project_info: rawTables[memberCount]._project_info,
                                    users: users,
                                    users_info: users_info,
                                    tables: tables,
                                    _add_tables: [],
                                }
                                eval('type1_data[item] = data')
                            }
                        }


                        if (rawTables[memberCount].tables[table_index].wes_hour > 0) {
                            var item = "_" + DateUtil.getShiftDatefromFirstDate_month(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                , 2) + "_" +
                                rawTables[memberCount]._id.prjCode;

                            // rawTables[memberCount].tables[table_index]._day = 3;
                            // var tableData = rawTables[memberCount].tables[table_index];
                            var tableData = {};
                            Object.assign(tableData, rawTables[memberCount].tables[table_index]);
                            tableData._day = 3;

                            if (type1_data[item] != undefined) {
                                var data = type1_data[item];
                                data.tables.push(tableData);
                                if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                    data.users.push(rawTables[memberCount]._id.userDID);
                                    data.users_info.push(rawTables[memberCount]._user_info);
                                }
                            } else {

                                itemList.push(item);

                                var tables = [];

                                tables.push(tableData);

                                var users = [];

                                users.push(rawTables[memberCount]._id.userDID);

                                var users_info = [];

                                users_info.push(rawTables[memberCount]._user_info);

                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate_month_slash(moment(rawTables[memberCount].tables[table_index].create_formDate), 2),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 0)),
                                    // _day: 1,
                                    // _day_tw: DateUtil.getDay(1),
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _project_info: rawTables[memberCount]._project_info,
                                    users: users,
                                    users_info: users_info,
                                    tables: tables,
                                    _add_tables: [],
                                }
                                eval('type1_data[item] = data')
                            }
                        }

                        if (rawTables[memberCount].tables[table_index].thu_hour > 0) {
                            var item = "_" + DateUtil.getShiftDatefromFirstDate_month(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                , 3) + "_" +
                                rawTables[memberCount]._id.prjCode;

                            // rawTables[memberCount].tables[table_index]._day = 4;
                            // var tableData = rawTables[memberCount].tables[table_index];
                            var tableData = {};
                            Object.assign(tableData, rawTables[memberCount].tables[table_index]);
                            tableData._day = 4;

                            if (type1_data[item] != undefined) {
                                var data = type1_data[item];
                                data.tables.push(tableData);
                                if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                    data.users.push(rawTables[memberCount]._id.userDID);
                                    data.users_info.push(rawTables[memberCount]._user_info);
                                }
                            } else {

                                itemList.push(item);

                                var tables = [];

                                tables.push(tableData);

                                var users = [];

                                users.push(rawTables[memberCount]._id.userDID);

                                var users_info = [];

                                users_info.push(rawTables[memberCount]._user_info);

                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate_month_slash(moment(rawTables[memberCount].tables[table_index].create_formDate), 3),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 0)),
                                    // _day: 1,
                                    // _day_tw: DateUtil.getDay(1),
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _project_info: rawTables[memberCount]._project_info,
                                    users: users,
                                    users_info: users_info,
                                    tables: tables,
                                    _add_tables: [],
                                }
                                eval('type1_data[item] = data')
                            }
                        }

                        if (rawTables[memberCount].tables[table_index].fri_hour > 0) {
                            var item = "_" + DateUtil.getShiftDatefromFirstDate_month(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                , 4) + "_" +
                                rawTables[memberCount]._id.prjCode;

                            // rawTables[memberCount].tables[table_index]._day = 5;
                            // var tableData = rawTables[memberCount].tables[table_index];
                            var tableData = {};
                            Object.assign(tableData, rawTables[memberCount].tables[table_index]);
                            tableData._day = 5;

                            if (type1_data[item] != undefined) {
                                var data = type1_data[item];
                                data.tables.push(tableData);
                                if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                    data.users.push(rawTables[memberCount]._id.userDID);
                                    data.users_info.push(rawTables[memberCount]._user_info);
                                }
                            } else {

                                itemList.push(item);

                                var tables = [];

                                tables.push(tableData);

                                var users = [];

                                users.push(rawTables[memberCount]._id.userDID);

                                var users_info = [];

                                users_info.push(rawTables[memberCount]._user_info);

                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate_month_slash(moment(rawTables[memberCount].tables[table_index].create_formDate), 4),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 0)),
                                    // _day: 1,
                                    // _day_tw: DateUtil.getDay(1),
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _project_info: rawTables[memberCount]._project_info,
                                    users: users,
                                    users_info: users_info,
                                    tables: tables,
                                    _add_tables: [],
                                }
                                eval('type1_data[item] = data')
                            }
                        }

                        if (rawTables[memberCount].tables[table_index].sat_hour > 0) {
                            var item = "_" + DateUtil.getShiftDatefromFirstDate_month(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                , 5) + "_" +
                                rawTables[memberCount]._id.prjCode;

                            // rawTables[memberCount].tables[table_index]._day = 6;
                            // var tableData = rawTables[memberCount].tables[table_index];
                            var tableData = {};
                            Object.assign(tableData, rawTables[memberCount].tables[table_index]);
                            tableData._day = 6;

                            if (type1_data[item] != undefined) {
                                var data = type1_data[item];
                                data.tables.push(tableData);
                                if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                    data.users.push(rawTables[memberCount]._id.userDID);
                                    data.users_info.push(rawTables[memberCount]._user_info);
                                }
                            } else {

                                itemList.push(item);

                                var tables = [];

                                tables.push(tableData);

                                var users = [];

                                users.push(rawTables[memberCount]._id.userDID);

                                var users_info = [];

                                users_info.push(rawTables[memberCount]._user_info);

                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate_month_slash(moment(rawTables[memberCount].tables[table_index].create_formDate), 5),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 0)),
                                    // _day: 1,
                                    // _day_tw: DateUtil.getDay(1),
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _project_info: rawTables[memberCount]._project_info,
                                    users: users,
                                    users_info: users_info,
                                    tables: tables,
                                    _add_tables: [],
                                }
                                eval('type1_data[item] = data')
                            }
                        }

                        if (rawTables[memberCount].tables[table_index].sun_hour > 0) {
                            var item = "_" + DateUtil.getShiftDatefromFirstDate_month(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                , 6) + "_" +
                                rawTables[memberCount]._id.prjCode;

                            // rawTables[memberCount].tables[table_index]._day = 7;
                            // var tableData = rawTables[memberCount].tables[table_index];
                            var tableData = {};
                            Object.assign(tableData, rawTables[memberCount].tables[table_index]);
                            tableData._day = 7;

                            if (type1_data[item] != undefined) {
                                var data = type1_data[item];
                                data.tables.push(tableData);
                                if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                    data.users.push(rawTables[memberCount]._id.userDID);
                                    data.users_info.push(rawTables[memberCount]._user_info);
                                }
                            } else {

                                itemList.push(item);

                                var tables = [];

                                tables.push(tableData);

                                var users = [];

                                users.push(rawTables[memberCount]._id.userDID);

                                var users_info = [];

                                users_info.push(rawTables[memberCount]._user_info);

                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate_month_slash(moment(rawTables[memberCount].tables[table_index].create_formDate), 6),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 0)),
                                    // _day: 1,
                                    // _day_tw: DateUtil.getDay(1),
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _project_info: rawTables[memberCount]._project_info,
                                    users: users,
                                    users_info: users_info,
                                    tables: tables,
                                    _add_tables: [],
                                }
                                eval('type1_data[item] = data')
                            }
                        }
                    }
                }

                // work add
                if (rawTables[memberCount]._add_tables != undefined) {
                    for (var table_add_index = 0; table_add_index < rawTables[memberCount]._add_tables.length; table_add_index++) {

                        var item = "_" + DateUtil.getShiftDatefromFirstDate_month(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate),
                            rawTables[memberCount]._add_tables[table_add_index].day - 1) + "_" +
                            rawTables[memberCount]._id.prjCode;

                        if (!rawTables[memberCount]._add_tables[table_add_index].isExecutiveConfirm) {
                            continue;
                        }

                        if (table_add_id_array.includes(rawTables[memberCount]._add_tables[table_add_index]._id)) continue;
                        table_add_id_array.push(rawTables[memberCount]._add_tables[table_add_index]._id)


                        var tableData_add = {
                            _id: rawTables[memberCount]._add_tables[table_add_index]._id,
                            create_formDate: rawTables[memberCount]._add_tables[table_add_index].create_formDate,
                            day: rawTables[memberCount]._add_tables[table_add_index].day,
                            workAddType: rawTables[memberCount]._add_tables[table_add_index].workAddType,
                            start_time: rawTables[memberCount]._add_tables[table_add_index].start_time,
                            end_time: rawTables[memberCount]._add_tables[table_add_index].end_time,
                            reason: rawTables[memberCount]._add_tables[table_add_index].reason,
                            userMonthSalary: rawTables[memberCount]._add_tables[table_add_index].userMonthSalary,
                            isExecutiveConfirm: rawTables[memberCount]._add_tables[table_add_index].isExecutiveConfirm,
                            creatorDID: rawTables[memberCount]._add_tables[table_add_index].creatorDID,
                        }

                        if (type1_data[item] != undefined) {
                            var data = type1_data[item];
                            data._add_tables.push(tableData_add);
                            if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                data.users.push(rawTables[memberCount]._id.userDID);
                                data.users_info.push(rawTables[memberCount]._user_info);
                            }
                        } else {

                            itemList.push(item);

                            var tables_add = [];

                            tables_add.push(tableData_add);

                            var users = [];

                            users.push(rawTables[memberCount]._id.userDID);

                            var users_info = [];

                            users_info.push(rawTables[memberCount]._user_info);

                            var data = {
                                _date: DateUtil.getShiftDatefromFirstDate_month_slash(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1),
                                _date_short: DateUtil.formatDate(
                                    DateUtil.getShiftDatefromFirstDate(
                                        moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1)),
                                _day: rawTables[memberCount]._add_tables[table_add_index].day,
                                _day_tw: DateUtil.getDay(rawTables[memberCount]._add_tables[table_add_index].day),
                                _prjCode: rawTables[memberCount]._id.prjCode,
                                _project_info: rawTables[memberCount]._project_info,
                                users: users,
                                users_info: users_info,
                                tables: [],
                                _add_tables: tables_add,
                            }
                            eval('type1_data[item] = data')
                        }
                    }
                }
            }
            console.log(type1_data);

            var result = [];
            var result_sort = [];

            for (var index = 0; index < itemList.length; index++) {
                result.push(type1_data[itemList[index]]);
            }

            console.log(result);
            result_sort = result.sort(function (a, b) {

                if (a._date == b._date) {
                    return a._prjCode - b._prjCode;
                }
                return a._date > b._date ? 1 : -1;

            });
            console.log(result_sort);
            return result_sort;
        }

        $scope.filter_type2_data_item = function (rawTables) {
            var type2_result = [];
            for (var index = 0; index < rawTables.length; index++) {
                if (($scope.calculateHours_type2_item(rawTables[index]) + $scope.calculateHours_type2_add(rawTables[index], 1) + $scope.calculateHours_type2_add(rawTables[index], 2) != 0)) {
                    type2_result.push(rawTables[index]);
                }
            }
            return type2_result;
        }

        var cons_1 = 2.0;
        var cons_2 = 2.0; // 換休
        var cons_3 = 1.67; // 加班

        $scope.calculateHours_type2_item = function (item, type) {
            // console.log(item)
            if (item.iscalculate_A && item.iscalculate_B) {
                switch (type) {
                    case 1:
                        return item.hourTotal;
                        // return item.totalCost;
                        break;
                    case 2:
                        return parseInt(item.totalCost);
                        break;
                }
            }
            // console.log(item);
            var hourTotal = 0;
            var totalCost = 0.0;
            for (var index = 0; index < item.tables.length; index++) {
                if (item.tables[index]._day == 1) {
                    hourTotal += parseFloat(item.tables[index].mon_hour)
                    totalCost += parseFloat(item.tables[index].mon_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;
                }

                if (item.tables[index]._day == 2) {

                    hourTotal += parseFloat(item.tables[index].tue_hour)
                    totalCost += parseFloat(item.tables[index].tue_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;
                }

                if (item.tables[index]._day == 3) {

                    hourTotal += parseFloat(item.tables[index].wes_hour)
                    totalCost += parseFloat(item.tables[index].wes_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;
                }

                if (item.tables[index]._day == 4) {

                    hourTotal += parseFloat(item.tables[index].thu_hour)
                    totalCost += parseFloat(item.tables[index].thu_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;
                }

                if (item.tables[index]._day == 5) {

                    hourTotal += parseFloat(item.tables[index].fri_hour)
                    totalCost += parseFloat(item.tables[index].fri_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;
                }

                if (item.tables[index]._day == 6) {

                    hourTotal += parseFloat(item.tables[index].sat_hour)
                    totalCost += parseFloat(item.tables[index].sat_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;
                }

                if (item.tables[index]._day == 7) {

                    hourTotal += parseFloat(item.tables[index].sun_hour)
                    totalCost += parseFloat(item.tables[index].sun_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;
                }

            }
            item.hourTotal = hourTotal;
            item.totalCost = totalCost;
            switch (type) {
                case 1:
                    return hourTotal;
                    break;
                case 2:
                    return parseInt(totalCost);
                    break;
            }
        }

        $scope.calculateHours_type2_add = function (item, type, showType) {
            // console.log(item)
            switch (type) {
                case 1:
                    if (item.iscalculate_A) {
                        switch (showType) {
                            case 1:
                                return item.hourTotal_add_A;
                                // return item.totalCost;
                                break;
                            case 2:
                                return parseInt(item.hourTotal_add_cost_A);
                                break;
                        }
                    }
                    break;
                case 2:
                    if (item.iscalculate_B) {
                        switch (showType) {
                            case 1:
                                return item.hourTotal_add_B;
                                // return item.totalCost;
                                break;
                            case 2:
                                return parseInt(item.hourTotal_add_cost_B);
                                break;
                        }
                    }
                    break;
            }

            var mins = 0

            var hourTotal = 0;
            var totalCost = 0.0;

            if (item._add_tables == undefined) {
                switch (type) {
                    case 1:
                        item.iscalculate_A = true;
                        item.hourTotal_add_A = hourTotal;
                        item.hourTotal_add_cost_A = parseInt(totalCost * cons_3);
                        break;
                    case 2:
                        item.iscalculate_B = true;
                        item.hourTotal_add_B = hourTotal;
                        item.hourTotal_add_cost_B = parseInt(totalCost * cons_2);
                        break;
                }
                return hourTotal;
            }

            var type2_add_data = [];

            for (var index = 0; index < item._add_tables.length; index++) {
                var operatedFormDate = item._add_tables[index].create_formDate;
                if (moment(DateUtil.getShiftDatefromFirstDate(moment(operatedFormDate), item._add_tables[index].day - 1)) < moment("2020/01/01")) {
                    continue
                }
                if (item._add_tables[index].workAddType == type) {

                    if (!item._add_tables[index].isExecutiveConfirm) {
                        continue;
                    }

                    var date_id = DateUtil.getShiftDatefromFirstDate_typeB(moment(operatedFormDate), item._add_tables[index].day - 1) + "_" + item._add_tables[index].creatorDID;
                    var min = parseInt(TimeUtil.getCalculateHourDiffByTime(item._add_tables[index].start_time, item._add_tables[index].end_time))
                    // mins += min;
                    if (type2_add_data[date_id] != undefined) {
                        var data = type2_add_data[date_id];
                        data.min = min + type2_add_data[date_id].min;
                    } else {
                        var data = {
                            _date: DateUtil.getShiftDatefromFirstDate(moment(operatedFormDate), item._add_tables[index].day - 1),
                            min: min,
                            monthSalary: item._add_tables[index].userMonthSalary,
                            creatorDID: item._add_tables[index].creatorDID,
                        }
                        type2_add_data.push(data);
                        eval('type2_add_data[date_id] = data')
                    }
                }
            }
            // console.log(type2_add_data);
            var hour = 0
            for (var i = 0; i < type2_add_data.length; i++) {
                hour = type2_add_data[i].min % 60 < 30 ? Math.round(type2_add_data[i].min / 60) : Math.round(type2_add_data[i].min / 60) - 0.5;
                if (hour < 1) {
                    hourTotal += 0;
                } else {
                    hourTotal += hour;
                    totalCost += hour * type2_add_data[i].monthSalary / 30 / 8;
                }
            }
            switch (type) {
                case 1:
                    item.iscalculate_A = true;
                    item.hourTotal_add_A = hourTotal;
                    item.hourTotal_add_cost_A = parseInt(totalCost * cons_3);
                    break;
                case 2:
                    item.iscalculate_B = true;
                    item.hourTotal_add_B = hourTotal;
                    item.hourTotal_add_cost_B = parseInt(totalCost * cons_2);
                    break;
            }
            return hourTotal;
        }


        // END
    }

})();


