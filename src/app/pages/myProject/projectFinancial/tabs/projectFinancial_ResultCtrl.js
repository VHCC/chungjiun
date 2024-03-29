/**
 * @author IChen.Chu
 * created on 26.09.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('projectFinancialResultCtrl',
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
                'bsLoadingOverlayService',
                projectFinancialResultCtrl
            ])

    /** @ngInject */
    function projectFinancialResultCtrl($scope,
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
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;
        $scope.year = thisYear;

        var specificYear = thisYear;
        var specificMonth = thisMonth;

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers; // 新增表單

                $scope.projectManagers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allUsers[i]._id,
                        name: allUsers[i].name
                    };
                }
            });

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
            });

        $scope.initProject = function() {
            Project.findAll()
                .success(function (allProjects) {
                    $scope.allProject_raw = allProjects;
                    vm.projects = allProjects.slice();
                });
        }

        $scope.resetProjectData = function() {
            if (vm.prjItems) {
                vm.prjItems.selected = null;
            }
            vm.projects = $scope.allProject_raw.slice();
        }

        $scope.initProject();

        $scope.listenYear = function (dom) {
            dom.$watch('myYear',function(newValue, oldValue) {
                if (dom.isShiftYearSelect) {
                    dom.isShiftYearSelect = false;
                    $scope.year = specificYear = newValue - 1911;
                    $scope.getFinancialRate();
                }
            });
        }

        // Filter
        $scope.showPrjCodeWithCombine = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].prjCode : 'Not Set';
        };

        $scope.showProjectManager = function (prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID
                });
            }
            if (majorSelected == undefined) return 'Not Set';
            var managerDID = majorSelected[0].managerID;
            var selected = [];
            if (managerDID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: managerDID
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].name : 'Not Set';
        };

        $scope.showUser = function (userDID) {
            var selected = [];
            if (vm.users === undefined) return;
            if (userDID) {
                selected = $filter('filter')(vm.users, {
                    _id: userDID,
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        $scope.setFinancialRate = function (rateItem) {
            var formData = {
                year: rateItem.year,
                rate_item_1: rateItem.rate_item_1,
                rate_item_2: rateItem.rate_item_2,
                rate_item_21: rateItem.rate_item_21,
                rate_item_3: rateItem.rate_item_3,
                rate_item_4: rateItem.rate_item_4,
                rate_item_5: rateItem.rate_item_5,
            }
            ProjectFinancialRateUtil.updateFinancialRate(formData)
                .success(function (res) {
                    $scope.getFinancialRate()
                })
        }

        $scope.getFinancialRate = function () {
            $timeout(function () {
                var formData = {
                    year: $scope.selectPrjInfo.year
                }

                ProjectFinancialRateUtil.getFinancialRate(formData)
                    .success(function (res) {
                        $scope.yearRate = res.payload;

                        var formData = {
                            prjDID: $scope.selectPrjInfo._id,
                        }

                        ProjectFinancialResultUtil.findFR(formData)
                            .success(function (res) {
                                console.log(" === findFR === ");
                                // console.log(res);

                                if (res.payload.length == 0) {
                                    ProjectFinancialResultUtil.createFR(formData)
                                        .success(function (res) {
                                            $scope.fetchProjectFinancialResult($scope.selectPrjInfo);
                                        })
                                } else {
                                    $scope.projectFinancialResultTable = res.payload;

                                    if (!$scope.projectFinancialResultTable[0].is011Set) {
                                        $scope.projectFinancialResultTable[0].rate_item_1 = $scope.yearRate.rate_item_1;
                                        $scope.projectFinancialResultTable[0].rate_item_2 = $scope.yearRate.rate_item_2;
                                        $scope.projectFinancialResultTable[0].rate_item_21 = $scope.yearRate.rate_item_21;
                                        $scope.projectFinancialResultTable[0].rate_item_3 = $scope.yearRate.rate_item_3;
                                        $scope.projectFinancialResultTable[0].rate_item_4 = $scope.yearRate.rate_item_4;
                                        $scope.projectFinancialResultTable[0].rate_item_5 = $scope.yearRate.rate_item_5;
                                    }

                                    $scope.overall_data = [];

                                    var incomeFormData = {
                                        prjDIDArray: $scope.selectPrjArray,
                                        isEnable: true
                                    }

                                    // 收入
                                    ProjectIncomeUtil.findIncomeByPrjDIDArray(incomeFormData)
                                        .success(function (res) {
                                            console.log(" --- 收入 --- ");
                                            // console.log(res);
                                            $scope.projectIncomeTable = res.payload;
                                            for (var i = 0; i < res.payload.length; i ++) {
                                                var tempDate = moment(res.payload[i].realDate).format("YYYY/MM");
                                                if (moment(tempDate) >= moment("2020/01")) {
                                                    if ($scope.overall_data[tempDate] != undefined) {
                                                        var data = $scope.overall_data[tempDate];
                                                        data._income.push(res.payload[i]);
                                                    } else {

                                                        var data = {
                                                            _date: tempDate,
                                                            _income: [res.payload[i]],
                                                            _payments: [],
                                                            _otherCost: [],
                                                            _subContractorPay: [],
                                                            _overall: 0,
                                                        }
                                                        $scope.overall_data.push(data);
                                                        eval('$scope.overall_data[tempDate] = data')
                                                    }
                                                }
                                            }
                                        })

                                    var subFormData = {
                                        prjDIDArray: $scope.selectPrjArray
                                    }

                                    // 墊付款
                                    // PaymentFormsUtil.fetchPaymentsItemByPrjDID(formData)
                                    PaymentFormsUtil.fetchPaymentsItemByPrjDIDArray(subFormData)
                                        .success(function (res) {
                                            console.log(" --- 墊付款 --- ")
                                            // console.log(res);
                                            $scope.searchPaymentsItems = res.payload;
                                            for (var i = 0; i < res.payload.length; i ++) {
                                                var tempDate = moment(res.payload[i].year+1911 + "/" + res.payload[i].month).format("YYYY/MM");
                                                if (moment(tempDate) >= moment("2020/01")) {
                                                    if ($scope.overall_data[tempDate] != undefined) {
                                                        var data = $scope.overall_data[tempDate];
                                                        data._payments.push(res.payload[i]);
                                                    } else {
                                                        var data = {
                                                            _date: tempDate,
                                                            _income: [],
                                                            _payments: [res.payload[i]],
                                                            _otherCost: [],
                                                            _subContractorPay: [],
                                                            _overall: 0,
                                                        }
                                                        $scope.overall_data.push(data);
                                                        eval('$scope.overall_data[tempDate] = data')
                                                    }
                                                }
                                            }
                                        })
                                        .error(function (resp) {
                                        })

                                    // 其他支出
                                    // ExecutiveExpenditureUtil.fetchExecutiveExpenditureItemsByPrjDID(formData)
                                    ExecutiveExpenditureUtil.fetchExecutiveExpenditureItemsByPrjDIDArray(subFormData)
                                        .success(function (res) {
                                            console.log(" --- 其他支出 --- ");
                                            // console.log(res)
                                            $scope.displayEEItems = res.payload;
                                            for (var i = 0; i < res.payload.length; i ++) {
                                                var tempDate = moment(res.payload[i].year+1911 + "/" + res.payload[i].month).format("YYYY/MM");
                                                if (moment(tempDate) >= moment("2020/01")) {
                                                    if ($scope.overall_data[tempDate] != undefined) {
                                                        var data = $scope.overall_data[tempDate];
                                                        data._otherCost.push(res.payload[i]);
                                                    } else {
                                                        var data = {
                                                            _date: tempDate,
                                                            _income: [],
                                                            _payments: [],
                                                            _subContractorPay: [],
                                                            _otherCost: [res.payload[i]],
                                                            _overall: 0,
                                                        }
                                                        $scope.overall_data.push(data);
                                                        eval('$scope.overall_data[tempDate] = data')
                                                    }
                                                }
                                            }
                                        })
                                        .error(function (res) {
                                        })

                                    var fetchFormData = {
                                        prjDID: $scope.selectPrjInfo._id,
                                        isExecutiveCheck: true
                                    }

                                    // 廠商請款
                                    // SubContractorPayItemUtil.fetchSCPayItems(fetchFormData)
                                    SubContractorPayItemUtil.fetchSCPayItemsByPrjDIDArray(subFormData)
                                        .success(function (res) {
                                            console.log(" --- 廠商請款 --- ")
                                            // console.log(res);
                                            $scope.subContractorPayItems = res.payload;
                                            for (var i = 0; i < res.payload.length; i ++) {
                                                var tempDate = moment(res.payload[i].year+1911 + "/" + res.payload[i].month).format("YYYY/MM");
                                                if (moment(tempDate) >= moment("2020/01")) {
                                                    if ($scope.overall_data[tempDate] != undefined) {
                                                        var data = $scope.overall_data[tempDate];
                                                        data._subContractorPay.push(res.payload[i]);
                                                    } else {
                                                        var data = {
                                                            _date: tempDate,
                                                            _income: [],
                                                            _payments: [],
                                                            _otherCost: [],
                                                            _subContractorPay: [res.payload[i]],
                                                            _overall: 0,
                                                        }
                                                        $scope.overall_data.push(data);
                                                        eval('$scope.overall_data[tempDate] = data')
                                                    }
                                                }
                                            }
                                        })

                                    // 人時支出
                                    var getData = {};

                                    getData.branch = $scope.selectPrjInfo.branch;
                                    getData.year = $scope.selectPrjInfo.year;
                                    getData.code = $scope.selectPrjInfo.code;
                                    getData.prjNumber = $scope.selectPrjInfo.prjNumber;
                                    getData.prjSubNumber = $scope.selectPrjInfo.prjSubNumber;
                                    getData.type = $scope.selectPrjInfo.type;

                                    // WorkHourUtil.queryStatisticsForms_projectIncome_Cost(getData)
                                    WorkHourUtil.queryStatisticsForms_projectIncome_Cost_ByPrjDIDArray(subFormData)
                                        .success(function (res) {
                                            console.log(" === 人工時 === ")
                                            // console.log(res);

                                            res.payload = res.payload.sort(function (a, b) {
                                                return a._id.userDID > b._id.userDID ? 1 : -1;
                                            });

                                            for (var index = 0; index < res.payload.length; index ++) {
                                                for (var index_sub = 0; index_sub < res.payload_add.length; index_sub ++) {
                                                    if( res.payload_add[index_sub]._id.prjCode == res.payload[index]._id.prjCode &&
                                                        res.payload_add[index_sub]._id.userDID == res.payload[index]._id.userDID) {
                                                        res.payload[index]._add_tables = res.payload_add[index_sub].add_tables;
                                                    }
                                                }
                                            }
                                            // $scope.statisticsResults = $scope.filter_type2_data(res.payload);
                                            $scope.statisticsResults_type1 = $scope.filter_type1_data(res.payload);
                                            console.log(" ----- filter_type1_data -------- ")
                                            $scope.statisticsResults_type1 = $scope.filter_type2_data_item($scope.statisticsResults_type1);
                                            console.log(" ----- filter_type2_data_item -------- ")

                                            for (var i = 0; i < $scope.statisticsResults_type1.length; i ++) {
                                                var tempDate = $scope.statisticsResults_type1[i]._date;

                                                if (moment(tempDate) >= moment("2020/01")) {
                                                    if ($scope.overall_data[tempDate] != undefined) {
                                                        var data = $scope.overall_data[tempDate];
                                                        data._overall += $scope.statisticsResults_type1[i].totalCost +
                                                            $scope.statisticsResults_type1[i].hourTotal_add_cost_A +
                                                            $scope.statisticsResults_type1[i].hourTotal_add_cost_B;
                                                    } else {
                                                        var data = {
                                                            _date: tempDate,
                                                            _income: [],
                                                            _payments: [],
                                                            _otherCost: [],
                                                            _subContractorPay: [],
                                                            _overall: $scope.statisticsResults_type1[i].totalCost +
                                                            $scope.statisticsResults_type1[i].hourTotal_add_cost_A +
                                                            $scope.statisticsResults_type1[i].hourTotal_add_cost_B,
                                                        }
                                                        $scope.overall_data.push(data);
                                                        eval('$scope.overall_data[tempDate] = data')
                                                    }
                                                }
                                            }
                                            // console.log($scope.overall_data)
                                        })

                                    // console.log($scope.selectPrjInfo);
                                    if ($scope.selectPrjInfo.year < 113) {
                                        angular.element(
                                            document.getElementById('includeHead_financial_result'))
                                            .html($compile(
                                                "<div ba-panel ba-panel-title=" +
                                                "'" + "" + "'" +
                                                "ba-panel-class= " +
                                                "'with-scroll'" + ">" +
                                                "<div " +
                                                "ng-include=\"'app/pages/myProject/projectFinancial/tables/projectFinancial_result_table.html'\">" +
                                                "</div>" +
                                                "</div>"
                                            )($scope));

                                        angular.element(
                                            document.getElementById('includeHead_financial_result_after113'))
                                            .html($compile(
                                                "<div ba-panel ba-panel-title=" +
                                                "'" + "" + "'" +
                                                "ba-panel-class= " +
                                                "'with-scroll'" + ">" +
                                                "<div " +
                                                "ng-include=\"'app/pages/myProject/projectFinancial/tables/projectFinancial_result_table_after113.html'\">" +
                                                "</div>" +
                                                "</div>"
                                            )($scope));
                                    } else {
                                        angular.element(
                                            document.getElementById('includeHead_financial_result'))
                                            .html("");

                                        angular.element(
                                            document.getElementById('includeHead_financial_result_after113'))
                                            .html($compile(
                                                "<div ba-panel ba-panel-title=" +
                                                "'" + "" + "'" +
                                                "ba-panel-class= " +
                                                "'with-scroll'" + ">" +
                                                "<div " +
                                                "ng-include=\"'app/pages/myProject/projectFinancial/tables/projectFinancial_result_table_after113.html'\">" +
                                                "</div>" +
                                                "</div>"
                                            )($scope));
                                    }




                                }

                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'mainPage_project_financial_result'
                                    });
                                }, 1000)
                            })
                    })
            }, 100)

        }

        $scope.calcRates = function (rateItem) {
            if (rateItem == undefined) return 0;
            return parseFloat(rateItem.rate_item_1)
                + parseFloat(rateItem.rate_item_2)
                + parseFloat(rateItem.rate_item_21)
                + parseFloat(rateItem.rate_item_3)
                + parseFloat(rateItem.rate_item_4)
                // + parseFloat(rateItem.rate_item_5)
        }

        $scope.fetchProjectFinancialResult = function (prjInfo) {
            $scope.selectPrjInfo = prjInfo;

            var formData = {
                rootPrjDID: $scope.selectPrjInfo._id
            }

            Project.fetchRelatedCombinedPrjArray(formData)
                .success(function (res) {
                    console.log(" --- 相關專案 ---");
                    console.log(res);
                    $scope.selectPrjArray = res;
                    $scope.getFinancialRate();
                })

            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_project_financial_result'
                });
            }, 100)
        }

        // type 2, 一專案加一人名 為一筆
        $scope.filter_type2_data = function(rawTables) {
            var type2_result = [];
            for (var index = 0 ;index < rawTables.length; index ++) {
                if ( ($scope.calculateHours_type2(rawTables[index]) + $scope.calculateHours_type2_add(rawTables[index], 1) + $scope.calculateHours_type2_add(rawTables[index], 2) != 0)) {
                    type2_result.push(rawTables[index]);
                }
            }
            return type2_result;
        }

        var cons_1 = 2.0;
        var cons_2 = 2.0; // 換休
        var cons_3 = 1.67; // 加班

        $scope.calculateHours_type2 = function (item, type) {
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
            for (var index = 0; index < item.tables.length; index ++) {
                if (item.tables[index].create_formDate == "2019/12/30") {
                    hourTotal += parseFloat(item.tables[index].wes_hour)
                    totalCost += parseFloat(item.tables[index].wes_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].thu_hour)
                    totalCost += parseFloat(item.tables[index].thu_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].fri_hour)
                    totalCost += parseFloat(item.tables[index].fri_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].sat_hour)
                    totalCost += parseFloat(item.tables[index].sat_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].sun_hour)
                    totalCost += parseFloat(item.tables[index].sun_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;
                } else if (moment(item.tables[index].create_formDate) > moment("2020/01/01")) {
                    hourTotal += parseFloat(item.tables[index].mon_hour)
                    totalCost += parseFloat(item.tables[index].mon_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].tue_hour)
                    totalCost += parseFloat(item.tables[index].tue_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].wes_hour)
                    totalCost += parseFloat(item.tables[index].wes_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].thu_hour)
                    totalCost += parseFloat(item.tables[index].thu_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].fri_hour)
                    totalCost += parseFloat(item.tables[index].fri_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].sat_hour)
                    totalCost += parseFloat(item.tables[index].sat_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

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

            for (var index = 0; index < item._add_tables.length; index ++) {
                var operatedFormDate = item._add_tables[index].create_formDate;
                if (moment(DateUtil.getShiftDatefromFirstDate(moment(operatedFormDate), item._add_tables[index].day - 1)) < moment("2020/01/01")) {
                    continue
                }
                if (item._add_tables[index].workAddType == type) {

                    if (!item._add_tables[index].isExecutiveConfirm) {
                        continue;
                    }

                    var date_id = DateUtil.getShiftDatefromFirstDate_typeB(moment(operatedFormDate), item._add_tables[index].day - 1) + "_"+ item._add_tables[index].creatorDID;
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
            for (var i = 0 ; i < type2_add_data.length; i ++) {
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

        $scope.saveProjectFR = function (item) {

            var formData = {
                _id: item._id,
                // income: item.income,
                otherCost: item.otherCost,
                rate_item_1: item.rate_item_1,
                rate_item_2: item.rate_item_2,
                rate_item_21: item.rate_item_21,
                rate_item_3: item.rate_item_3,
                rate_item_4: item.rate_item_4,
                rate_item_5: item.rate_item_5,
                memo: item.memo,
                is011Set: true,

                changePrjStatus: false,
            }

            ProjectFinancialResultUtil.updateFR(formData)
                .success(function (res) {
                    // console.log(res)
                    toastr.success('暫存成功', 'Success');
                    $scope.fetchProjectFinancialResult($scope.selectPrjInfo);
                })
        }

        $scope.closeProjectFR = function (item) {
            // console.log(item)

            var formData = {

                _id: item._id,
                // income: item.income,
                otherCost: item.otherCost, <!--其他-->
                rate_item_1: item.rate_item_1,
                rate_item_2: item.rate_item_2,
                rate_item_21: item.rate_item_21,
                rate_item_3: item.rate_item_3,
                rate_item_4: item.rate_item_4,
                rate_item_5: item.rate_item_5,
                memo: item.memo,
                is011Set: true,

                kpi1: $scope.calIncome(1), <!-- 收入 -->
                kpi2: $scope.calIncome(2), <!-- 不含稅收入B=A/1.05 -->
                kpi3: $scope.calResult(3, item), <!-- 公司調整(規劃、設計、監造廷整)C=B*調整值 -->
                kpi4: $scope.calSubContractorPay(), <!-- 廠商請款(未稅金額) D -->
                kpi5: $scope.calResult(4, item), <!-- 實際收入E=C-D -->
                kpi6: $scope.calResult(5, item), <!-- 行政費 1-->
                kpi61: $scope.calResult(51, item), <!-- 行政費 2-->
                kpi7: $scope.calResult(6, item), <!--技師費-->
                kpi8: $scope.calResult(7, item), <!--風險-->
                kpi9: $scope.calResult(8, item), <!--利潤-->
                kpi10: $scope.calcAllCost_special20201207(), <!-- 專案成本(墊付款、其他支出) --> <!-- (匯費、罰款) -->
                kpi11: $scope.calResult(9, item), <!--可分配金額-->
                kpi12: $scope.calcAllCost_special20210819(1), <!-- 執行成本 -->
                kpi13: ($scope.calResult(9, item) - $scope.calcAllCost_special20210819(1)), <!-- 績效結餘 -->

                changePrjStatus: true,

                enable: false,
                isPrjClose: true,
                update_ts: moment(new Date()).format("YYYYMMDD_HHmmss"),
                updater: $cookies.get('username')
            }

            ProjectFinancialResultUtil.updateFR(formData)
                .success(function (res) {
                    console.log(res)
                    $scope.fetchProjectFinancialResult($scope.selectPrjInfo);
                    toastr.success('結算成功', 'Success');
                })
        }

        $scope.openProjectFR = function(item) {
            var formData = {
                _id: item._id,

                changePrjStatus: true,

                enable: true,
                isPrjClose: false,
                update_ts: moment(new Date()).format("YYYYMMDD_HHmmss"),
                updater: $cookies.get('username')
            }

            ProjectFinancialResultUtil.updateFR(formData)
                .success(function (res) {
                    $scope.fetchProjectFinancialResult($scope.selectPrjInfo);
                    toastr.success('開啟專案成功', 'Success');
                })
        }

        $scope.calIncome = function (type) {
            var incomeA = 0.0;
            if ($scope.projectIncomeTable == null) return
            for (var i = 0; i < $scope.projectIncomeTable.length; i ++) {
                if (moment($scope.projectIncomeTable[i].realDate) >= moment("2020/01")) {
                    incomeA += parseInt($scope.projectIncomeTable[i].expectAmount)
                }
            }
            // console.log("incomeA:> " + incomeA)
            switch (type) {
                case 1:
                    return incomeA;
                case 2:
                    return Math.round(incomeA/1.05)
            }
        }

        $scope.calFines = function () {
            var incomeA = 0.0;
            if ($scope.projectIncomeTable == undefined) return incomeA;
            for (var i = 0; i < $scope.projectIncomeTable.length; i ++) {
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
            for (var i = 0; i < $scope.projectIncomeTable.length; i ++) {
                if (moment($scope.projectIncomeTable[i].realDate) >= moment("2020/01")) {
                    incomeA += parseInt($scope.projectIncomeTable[i].fee)
                }
            }
            // console.log("calFee:> " + incomeA)
            return incomeA;
        }

        $scope.calSubContractorPay = function() {
            // 廠商請款
            var resultD = 0.0;
            if ($scope.subContractorPayItems == undefined) return resultD;
            for (var i = 0; i < $scope.subContractorPayItems.length; i ++) {
                var tempDate = moment($scope.subContractorPayItems[i].year+1911 + "/" +
                    $scope.subContractorPayItems[i].month).format("YYYY/MM");
                if (moment(tempDate) >= moment("2020/01")) {
                    resultD += (parseInt($scope.subContractorPayItems[i].payApply) -
                        parseInt($scope.subContractorPayItems[i].payTax) -
                        parseInt($scope.subContractorPayItems[i].payOthers)
                    )
                }
            }
            // console.log("resultD:> " + resultD)
            return resultD;
        }

        $scope.calcAllCost = function () {
            var result = 0.0;

            // 人時
            var resultA = 0.0;
            for (var i = 0; i < $scope.statisticsResults.length; i ++) {
                resultA += $scope.calculateHours_type2($scope.statisticsResults[i], 2);
                resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 1, 2);
                resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 2, 2);
            }
            // console.log("resultA:> " + resultA)

            // 墊付款
            var resultB = 0.0;
            for (var i = 0; i < $scope.searchPaymentsItems.length; i ++) {
                resultB += parseInt($scope.searchPaymentsItems[i].amount)
            }
            // console.log("resultB:> " + resultB)

            // 其他
            var resultC = 0.0;
            for (var i = 0; i < $scope.displayEEItems.length; i ++) {
                resultC += parseInt($scope.displayEEItems[i].amount)
            }
            // console.log("resultC:> " + resultC)

            //
            var resultD = 0.0;
            for (var i = 0; i < $scope.projectIncomeTable.length; i ++) {
                if (moment($scope.projectIncomeTable[i].realDate) >= moment("2020/01")) {
                    resultD += parseInt($scope.projectIncomeTable[i].fines)
                    resultD += parseInt($scope.projectIncomeTable[i].fee)
                }
            }
            return Math.round(resultA + resultB + resultC + resultD);
        }

        $scope.calcAllCost_special20201207 = function() {
            // 人時
            var resultG = 0.0;
            // for (var i = 0; i < $scope.overall_data.length; i ++) {
                // console.log($scope.overall_data[i])
                // resultG += parseInt($scope.overall_data[i]._overall)
                // console.log(resultG)
            // }
            // console.log("resultG:> " + resultG)
            // 墊付款
            var resultB = 0.0;
            for (var i = 0; i < $scope.overall_data.length; i ++) {
                // console.log($scope.overall_data[i])
                for (var j = 0; j < $scope.overall_data[i]._payments.length; j ++) {
                    resultB += $scope.overall_data[i]._payments[j].amount == null ? 0 :$scope.overall_data[i]._payments[j].amount == undefined ? 0 : parseInt($scope.overall_data[i]._payments[j].amount)
                }
            }
            // console.log("resultB:> " + resultB)

            // 其他
            var resultC = 0.0;
            for (var i = 0; i < $scope.overall_data.length; i ++) {
                for (var j = 0; j < $scope.overall_data[i]._otherCost.length; j ++) {
                    resultC += $scope.overall_data[i]._otherCost[j].amount == null ? 0 : $scope.overall_data[i]._otherCost[j].amount == undefined ? 0 : parseInt($scope.overall_data[i]._otherCost[j].amount)
                }
            }
            // console.log("resultC:> " + resultC)
            return Math.round(resultG+resultB+resultC+$scope.calFines() + $scope.calFee())
        }

        $scope.calcAllCost_special20210819  = function(type) {
            switch(type) {
                case 1:
                    // 人時
                    var resultG = 0.0;
                    for (var i = 0; i < $scope.overall_data.length; i ++) {
                        // console.log($scope.overall_data[i])
                        resultG += parseFloat($scope.overall_data[i]._overall)
                        // console.log(resultG)
                    }
                    return resultG
                case 2:
                    var resultB = 0.0;
                    for (var i = 0; i < $scope.overall_data.length; i ++) {
                        // console.log($scope.overall_data[i])
                        for (var j = 0; j < $scope.overall_data[i]._payments.length; j ++) {
                            resultB += $scope.overall_data[i]._payments[j].amount == null ? 0 :$scope.overall_data[i]._payments[j].amount == undefined ? 0 : parseInt($scope.overall_data[i]._payments[j].amount)
                        }
                    }
                    return resultB
                case 3:
                    var resultC = 0.0;
                    for (var i = 0; i < $scope.overall_data.length; i ++) {
                        for (var j = 0; j < $scope.overall_data[i]._otherCost.length; j ++) {
                            resultC += $scope.overall_data[i]._otherCost[j].amount == null ? 0 : $scope.overall_data[i]._otherCost[j].amount == undefined ? 0 : parseInt($scope.overall_data[i]._otherCost[j].amount)
                        }
                    }
                    return resultC
                case 4:
                    return $scope.calFines()
                case 5:
                    return $scope.calFee()
            }
        }

        $scope.calResult = function (type, item) {
            switch (type) {
                // 公司調整(規劃、設計、監造廷整)C=B*調整值
                case 3:
                    return Math.round(item.rate_item_5 * $scope.calIncome(2) / 100);
                //  113 實際收入 B1=B-C
                case 31:
                    return $scope.calIncome(2) - $scope.calSubContractorPay();
                // 實際收入E=C-D
                case 4:
                    return Math.round(item.rate_item_5 * $scope.calIncome(2) / 100 - $scope.calSubContractorPay());
                //  113 公司算法 D=B1*比例
                case 41:
                    return Math.round(item.rate_item_5 * ($scope.calIncome(2) - $scope.calSubContractorPay()) / 100 );
                // 行政費 E*N
                case 5:
                    return Math.round(item.rate_item_2 * ($scope.calResult(4, item)) / 100);
                // 行政費 E*N
                case 51:
                    if (item.rate_item_21 === undefined) {
                        return 0;
                    }
                    return Math.round(item.rate_item_21 * ($scope.calResult(41, item)) / 100);
                case 52:
                    return Math.round(item.rate_item_2 * ($scope.calResult(41, item)) / 100);
                // 技師費 E*N
                case 6:
                    return Math.round(item.rate_item_1 * ($scope.calResult(4, item)) / 100);
                case 61:
                    return Math.round(item.rate_item_1 * ($scope.calResult(41, item)) / 100);
                // 風險 E*N
                case 7:
                    return Math.round(item.rate_item_4 * ($scope.calResult(4, item)) / 100);
                case 71:
                    return Math.round(item.rate_item_4 * ($scope.calIncome(2)) / 100);
                // 利潤 E*N
                case 8:
                    return Math.round(item.rate_item_3 * ($scope.calResult(4, item)) / 100);
                case 81:
                    return Math.round(item.rate_item_3 * ($scope.calResult(41, item)) / 100);
                // 可分配績效
                case 9:
                    return Math.round(($scope.calResult(4, item))
                    - ($scope.calResult(5, item))
                    - ($scope.calResult(51, item))
                    - ($scope.calResult(6, item))
                    - ($scope.calResult(7, item))
                    - ($scope.calResult(8, item))
                    // - $scope.calcAllCost()
                    - $scope.calcAllCost_special20201207()
                    - item.otherCost)
                case 91:
                    return Math.round(($scope.calResult(41, item))
                        - ($scope.calResult(52, item))
                        - ($scope.calResult(51, item))
                        - ($scope.calResult(61, item))
                        - ($scope.calResult(71, item))
                        - ($scope.calResult(81, item))
                        // - $scope.calcAllCost()
                        - $scope.calcAllCost_special20201207()
                        - item.otherCost)
            }
        }


        $scope.filter_type1_data = function(rawTables) {
            // console.log(rawTables)
            var itemList = [];

            var type1_data = [];
            var table_add_id_array = [];

            for (var memberCount = 0; memberCount < rawTables.length; memberCount++) {
                // console.log(rawTables[memberCount].tables);
                if (rawTables[memberCount].tables != undefined) {
                    for (var table_index = 0 ;table_index < rawTables[memberCount].tables.length; table_index ++) {
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
                    for (var table_add_index = 0 ;table_add_index < rawTables[memberCount]._add_tables.length; table_add_index ++) {

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
            // console.log(itemList);
            // console.log(type1_data);

            var result = [];
            var result_sort = [];

            for (var index = 0; index < itemList.length; index ++) {
                result.push(type1_data[itemList[index]]);
            }

            // console.log(result);
            result_sort = result.sort(function (a, b) {

                if (a._date == b._date) {
                    return a._prjCode - b._prjCode;
                }
                return a._date > b._date ? 1 : -1;

            });
            // console.log(result_sort);
            return result_sort;
        }

        $scope.filter_type2_data_item = function(rawTables) {
            // console.log("filter_type2_data_item");
            // console.log(rawTables);
            var type2_result = [];
            for (var index = 0 ;index < rawTables.length; index ++) {
                if ( ($scope.calculateHours_type2_item(rawTables[index]) + $scope.calculateHours_type2_add(rawTables[index], 1) + $scope.calculateHours_type2_add(rawTables[index], 2) != 0)) {
                    type2_result.push(rawTables[index]);
                }
            }
            return type2_result;
        }

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
            for (var index = 0; index < item.tables.length; index ++) {
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

        $scope.showPrjCode= function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].prjCode : 'Not Set';
        };

        $scope.showCombinedPrjCode = function () {
            var results = "[ ";

            for (var index = 0; index < $scope.selectPrjArray.length; index ++) {
                // console.log($scope.selectPrjArray[index])
                results += $scope.showPrjCode($scope.selectPrjArray[index])
                if (index < $scope.selectPrjArray.length - 1) {
                    results += ", "
                }
            }
            results += " ]"
            return results
        }

    }
})();


