/**
 * @author IChen.chu
 * created on 19.11.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('projectIncomeOverAllCtrl',
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
                projectIncomeOverAllCtrl
            ])

    /** @ngInject */
    function projectIncomeOverAllCtrl($scope,
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

        // ***** SubContractorApply main Tab 主要顯示 *****
        $scope.displaySubContractorApplyItems;

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
        // Project.findAllEnable()
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

        $scope.initProject = function () {
            Project.findAll()
                .success(function (allProjects) {
                    $scope.allProject_raw = allProjects;
                    vm.projects = allProjects.slice();
                });
        }

        $scope.resetProjectData = function () {
            if (vm.prjItems) {
                vm.prjItems.selected = null;
            }
            vm.projects = $scope.allProject_raw.slice();
        }

        $scope.initProject();

        // Filter

        $scope.showPrjCodeWithCombine = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            // if (selected[0].combinedID != undefined) {
            //     return $scope.showPrjCodeWithCombine(selected[0].combinedID);
            // }
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

        // =============== Main Function ===============
        $scope.fetchPrjIncomeOverAll = function (prjInfo) {
            $scope.selectPrjInfo = prjInfo;

            var formData = {
                rootPrjDID: $scope.selectPrjInfo._id
            }

            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_project_income_overall'
                });
            }, 100)

            Project.fetchRelatedCombinedPrjArray(formData)
                .success(function (res) {
                    $scope.selectPrjArray = res;
                    $scope.getFinancialRate();
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
                            prjDIDArray: $scope.selectPrjArray
                        }

                        ProjectFinancialResultUtil.findFR(formData)
                            .success(function (res) {
                                console.log(" === FinancialResult === ");
                                console.log(res);

                                if (res.payload.length == 0) {
                                    ProjectFinancialResultUtil.createFR(formData)
                                        .success(function (res) {
                                            $scope.fetchPrjIncomeOverAll($scope.selectPrjInfo);
                                        })
                                } else {
                                    $scope.financialResult = res.payload[0];
                                    // $scope.projectFinancialResultTable = res.payload;

                                    if (!$scope.financialResult.is011Set) {
                                        $scope.financialResult.rate_item_1 = $scope.yearRate.rate_item_1;
                                        $scope.financialResult.rate_item_2 = $scope.yearRate.rate_item_2;
                                        $scope.financialResult.rate_item_3 = $scope.yearRate.rate_item_3;
                                        $scope.financialResult.rate_item_4 = $scope.yearRate.rate_item_4;
                                        $scope.financialResult.rate_item_5 = $scope.yearRate.rate_item_5;
                                    }

                                    $scope.overall_data = [];

                                    var incomeFormData = {
                                        prjDIDArray: $scope.selectPrjArray,
                                        isEnable: true,
                                    }

                                    // 收入
                                    ProjectIncomeUtil.findIncomeByPrjDIDArray(incomeFormData)
                                        .success(function (res) {
                                            console.log(" --- 收入 --- ");
                                            console.log(res);
                                            $scope.projectIncomeTable = res.payload;
                                            for (var i = 0; i < res.payload.length; i++) {
                                                var tempDate = moment(res.payload[i].realDate).utcOffset(+480).format("YYYY/MM");
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
                                            // console.log($scope.overall_data);
                                        })

                                    // 墊付款
                                    PaymentFormsUtil.fetchPaymentsItemByPrjDIDArray(formData)
                                        .success(function (res) {
                                            console.log(" --- 墊付款 --- ")
                                            console.log(res);
                                            $scope.searchPaymentsItems = res.payload;
                                            for (var i = 0; i < res.payload.length; i++) {
                                                var tempDate = moment(res.payload[i].year + 1911 + "/" + res.payload[i].month).utcOffset(+480).format("YYYY/MM");
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
                                            // console.log($scope.overall_data);
                                        })
                                        .error(function (resp) {
                                        })

                                    // 其他支出
                                    ExecutiveExpenditureUtil.fetchExecutiveExpenditureItemsByPrjDIDArray(formData)
                                        .success(function (res) {
                                            console.log(" --- 其他支出 --- ");
                                            console.log(res);
                                            $scope.displayEEItems = res.payload;
                                            for (var i = 0; i < res.payload.length; i++) {
                                                var tempDate = moment(res.payload[i].year + 1911 + "/" + res.payload[i].month).utcOffset(+480).format("YYYY/MM");
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

                                    // 廠商請款
                                    SubContractorPayItemUtil.fetchSCPayItemsByPrjDIDArray(formData)
                                        .success(function (res) {
                                            console.log(" --- 廠商請款 --- ")
                                            console.log(res);
                                            $scope.subContractorPayItems = res.payload;
                                            for (var i = 0; i < res.payload.length; i++) {
                                                var tempDate = moment(res.payload[i].year + 1911 + "/" + res.payload[i].month).utcOffset(+480).format("YYYY/MM");
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

                                    WorkHourUtil.queryStatisticsForms_projectIncome_Cost_ByPrjDIDArray(formData)
                                        .success(function (res) {
                                            console.log(" === 人工時 === ")
                                            // console.log(res);

                                            var manipulateData = jQuery.extend(true, {}, res); // 深度複製
                                            console.log(manipulateData);
                                            manipulateData.payload = manipulateData.payload.sort(function (a, b) {
                                                return a._id.userDID > b._id.userDID ? 1 : -1;
                                            });

                                            for (var index = 0; index < manipulateData.payload.length; index++) {
                                                for (var index_sub = 0; index_sub < manipulateData.payload_add.length; index_sub++) {
                                                    if (manipulateData.payload_add[index_sub]._id.prjCode == manipulateData.payload[index]._id.prjCode &&
                                                        manipulateData.payload_add[index_sub]._id.userDID == manipulateData.payload[index]._id.userDID) {
                                                        manipulateData.payload[index]._add_tables = manipulateData.payload_add[index_sub].add_tables;
                                                    }
                                                }
                                            }
                                            // console.log(manipulateData.payload)
                                            $scope.statisticsResults_type1 = $scope.filter_type1_data(manipulateData.payload);
                                            console.log(" ----- filter_type1_data -------- ")
                                            console.log($scope.statisticsResults_type1);
                                            // $scope.statisticsResults = $scope.filter_type2_data(manipulateData.payload);
                                            // console.log(" ----- filter_type2_data -------- ")
                                            // console.log($scope.statisticsResults);
                                            $scope.statisticsResults_type2 = $scope.filter_type2_data_item($scope.statisticsResults_type1);
                                            console.log(" ----- filter_type2_data_item -------- ")
                                            console.log($scope.statisticsResults_type2);

                                            for (var i = 0; i < $scope.statisticsResults_type2.length; i++) {
                                                var tempDate = $scope.statisticsResults_type2[i]._date;

                                                if (moment(tempDate) >= moment("2020/01")) {
                                                    if ($scope.overall_data[tempDate] != undefined) {
                                                        var data = $scope.overall_data[tempDate];
                                                        data._overall += $scope.statisticsResults_type2[i].totalCost +
                                                            $scope.statisticsResults_type2[i].hourTotal_add_cost_A +
                                                            $scope.statisticsResults_type2[i].hourTotal_add_cost_B;
                                                    } else {
                                                        var data = {
                                                            _date: tempDate,
                                                            _income: [],
                                                            _payments: [],
                                                            _otherCost: [],
                                                            _subContractorPay: [],
                                                            _overall: $scope.statisticsResults_type2[i].totalCost +
                                                            $scope.statisticsResults_type2[i].hourTotal_add_cost_A +
                                                            $scope.statisticsResults_type2[i].hourTotal_add_cost_B,
                                                        }
                                                        $scope.overall_data.push(data);
                                                        eval('$scope.overall_data[tempDate] = data')
                                                    }
                                                }
                                            }
                                            console.log($scope.overall_data);
                                            $scope.overall_data_sort = $scope.overall_data.sort(function (a, b) {
                                                return moment(a._date).unix() > moment(b._date).unix() ? 1 : -1;
                                            });
                                        })

                                    angular.element(
                                        document.getElementById('includeHead_over_all'))
                                        .html($compile(
                                            "<div ba-panel ba-panel-title=" +
                                            "'專案 - " + $scope.selectPrjInfo.prjCode + "'" +
                                            "ba-panel-class= " +
                                            "'with-scroll'" + ">" +
                                            "<div " +
                                            "ng-include=\"'app/pages/myProject/projectIncome/tables/projectIncome_overall_table.html'\">" +
                                            "</div>" +
                                            "</div>"
                                        )($scope));
                                }

                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'mainPage_project_income_overall'
                                    });
                                }, 500)
                            })
                    })
            }, 100)
        }

        // type 2, 一專案加一人名 為一筆
        $scope.filter_type2_data = function (rawTables) {
            console.log("filter_type2_data");
            console.log(rawTables);
            var type2_result = [];
            for (var index = 0; index < rawTables.length; index++) {
                if (($scope.calculateHours_type2(rawTables[index]) + $scope.calculateHours_type2_add(rawTables[index], 1) + $scope.calculateHours_type2_add(rawTables[index], 2) != 0)) {
                    type2_result.push(rawTables[index]);
                }
            }
            return type2_result;
        }

        $scope.filter_type2_data_item = function (rawTables) {
            console.log(" --- filter_type2_data_item --- ");
            console.log(rawTables);
            var type2_result = [];
            for (var index = 0; index < rawTables.length; index++) {
                if (($scope.calculateHours_type2_item(rawTables[index]) +
                    $scope.calculateHours_type2_add(rawTables[index], 1) +
                    $scope.calculateHours_type2_add(rawTables[index], 2) != 0)) {
                    type2_result.push(rawTables[index]);
                }
            }
            return type2_result;
        }

        var cons_1 = 2.0;
        var cons_2 = 2.0; // 換休
        var cons_3 = 1.67; // 加班

        $scope.calculateHours_type2_item = function (item, type) {
            if (item.iscalculate_A && item.iscalculate_B) {
                switch (type) {
                    case 1:
                        return item.hourTotal;
                        break;
                    case 2:
                        return parseInt(item.totalCost);
                        break;
                }
            }
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
            var hourTotal = 0;
            var totalCost = 0.0;
            for (var index = 0; index < item.tables.length; index++) {
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
            switch (type) {
                case 1:
                    if (item.iscalculate_A) {
                        switch (showType) {
                            case 1:
                                return item.hourTotal_add_A;
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

                    var date_id = DateUtil.getShiftDatefromFirstDate_typeB(moment(operatedFormDate), item._add_tables[index].day - 1) + "_"+ item._add_tables[index].creatorDID;
                    var min = parseInt(TimeUtil.getCalculateHourDiffByTime(item._add_tables[index].start_time, item._add_tables[index].end_time))
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
            var hour = 0
            console.log(type2_add_data);
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
                    // console.log("add cost A:> " + parseInt(totalCost * cons_3))
                    item.hourTotal_add_cost_A = parseInt(totalCost * cons_3);
                    break;
                case 2:
                    item.iscalculate_B = true;
                    item.hourTotal_add_B = hourTotal;
                    // console.log("add cost B:> " + parseInt(totalCost * cons_2))
                    item.hourTotal_add_cost_B = parseInt(totalCost * cons_2);
                    break;
            }
            return hourTotal;
        }

        $scope.calIncome = function (type) {
            var incomeA = 0.0;
            if ($scope.projectIncomeTable == undefined) return incomeA;
            for (var i = 0; i < $scope.projectIncomeTable.length; i++) {
                if (moment($scope.projectIncomeTable[i].realDate) >= moment("2020/01")) {
                    incomeA += parseInt($scope.projectIncomeTable[i].expectAmount)
                }
            }
            // console.log("incomeA:> " + incomeA)
            switch (type) {
                case 1:
                    return incomeA;
                case 2:
                    return Math.round(incomeA / 1.05 * (1 - ($scope.calcRates() / 100)))
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
            // console.log("incomeA:> " + incomeA)
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
            // console.log("incomeA:> " + incomeA)
            return incomeA;
        }

        $scope.calProfit = function () {
            return (
                $scope.calIncome(2) -
                // $scope.calcCost(1) -
                $scope.calcCost_special20201207(1) -
                // $scope.calcCost(2) -
                $scope.calcCost_special20201207(2) -
                $scope.calSubContractorPay() -
                // $scope.calcCost(3) -
                $scope.calcCost_special20201207(3) -
                $scope.calFines() -
                $scope.calFee()
            );
        }

        $scope.calSubContractorPay = function () {
            // 廠商請款
            var resultD = 0.0;
            if ($scope.subContractorPayItems == undefined) return resultD;
            for (var i = 0; i < $scope.subContractorPayItems.length; i++) {
                var tempDate = moment($scope.subContractorPayItems[i].year + 1911 + "/" +
                    $scope.subContractorPayItems[i].month).utcOffset(+480).format("YYYY/MM");
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

        // 技師、行政、風險
        // 20220103 新增利潤
        $scope.calcRates = function () {
            if ($scope.financialResult == undefined) return 0;
            // console.log($scope.financialResult[0]);
            var rates = parseFloat($scope.financialResult.rate_item_1)
                + parseFloat($scope.financialResult.rate_item_2)
                + parseFloat($scope.financialResult.rate_item_3)
                + parseFloat($scope.financialResult.rate_item_4);

            if (rates == 0.0) {
                return 0.0;
            } else {
                return parseFloat($scope.financialResult.rate_item_1)
                    + parseFloat($scope.financialResult.rate_item_2)
                    + parseFloat($scope.financialResult.rate_item_3)
                    + parseFloat($scope.financialResult.rate_item_4)
            }
            // + parseFloat(rateItem.rate_item_5)
        }

        // $scope.calcCost = function (type) {
        //     switch (type) {
        //         case 1:
        //             // 人時
        //             var resultA = 0.0;
        //             if ($scope.statisticsResults == undefined) return resultA;
        //             for (var i = 0; i < $scope.statisticsResults.length; i++) {
        //                 resultA += $scope.calculateHours_type2($scope.statisticsResults[i], 2);
        //                 resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 1, 2);
        //                 resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 2, 2);
        //             }
        //             // console.log("resultA:> " + resultA)
        //             return Math.round(resultA)
        //         case 2:
        //             // 墊付款
        //             var resultB = 0.0;
        //             if ($scope.searchPaymentsItems == undefined) return resultB;
        //             for (var i = 0; i < $scope.searchPaymentsItems.length; i++) {
        //                 if ($scope.searchPaymentsItems[i].amount == null || $scope.searchPaymentsItems[i].amount == undefined) {
        //                 } else {
        //                     resultB += parseInt($scope.searchPaymentsItems[i].amount)
        //                 }
        //             }
        //             // console.log("resultB:> " + resultB)
        //             return Math.round(resultB)
        //         case 3:
        //             // 其他
        //             var resultC = 0.0;
        //             if ($scope.displayEEItems == undefined) return resultC;
        //             for (var i = 0; i < $scope.displayEEItems.length; i++) {
        //                 if ($scope.displayEEItems[i].amount == null || $scope.displayEEItems[i].amount == undefined) {
        //                 } else {
        //                     resultC += parseInt($scope.displayEEItems[i].amount)
        //                 }
        //             }
        //             // console.log("resultC:> " + resultC)
        //             return Math.round(resultC);
        //     }
        // }

        $scope.calcCost_special20201207 = function (type) {

            switch (type) {
                case 1:
                    // 人時
                    var resultG = 0.0;
                    for (var i = 0; i < $scope.overall_data.length; i++) {
                        // console.log($scope.overall_data[i]);
                        resultG += parseFloat($scope.overall_data[i]._overall)
                        // console.log(resultG)
                    }
                    // console.log("20201207 resultG:> " + resultG)
                    return Math.round(resultG);
                case 2:
                    // 墊付款
                    var resultB = 0.0;
                    for (var i = 0; i < $scope.overall_data.length; i++) {
                        // console.log($scope.overall_data[i])
                        for (var j = 0; j < $scope.overall_data[i]._payments.length; j++) {
                            if ($scope.overall_data[i]._payments[j].amount == null || $scope.overall_data[i]._payments[j].amount == undefined) {
                            } else {
                                resultB += parseFloat($scope.overall_data[i]._payments[j].amount)
                            }
                        }
                    }
                    // console.log("20201207 resultB:> " + resultB)
                    return Math.round(resultB);
                case 3:
                    // 其他
                    var resultC = 0.0;
                    // console.log(" *** overall_data *** ")
                    // console.log($scope.overall_data)
                    for (var i = 0; i < $scope.overall_data.length; i++) {
                        // console.log($scope.overall_data[i])
                        for (var j = 0; j < $scope.overall_data[i]._otherCost.length; j++) {
                            if ($scope.overall_data[i]._otherCost[j].amount == null || $scope.overall_data[i]._otherCost[j].amount == undefined) {
                            } else {
                                resultC += parseFloat($scope.overall_data[i]._otherCost[j].amount)
                            }
                        }
                    }
                    // console.log("20201207 resultC:> " + resultC)
                    return Math.round(resultC)
            }


        }

        $scope.calcItem = function (item, type) {
            switch (type) {
                case 1:
                    // 人時
                    var resultA = 0.0;
                    for (var i = 0; i < $scope.statisticsResults.length; i++) {
                        resultA += $scope.calculateHours_type2_item($scope.statisticsResults[i], 2);
                        resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 1, 2);
                        resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 2, 2);
                    }
                    // console.log("resultA:> " + resultA)
                    return Math.round(resultA)
                case 2:
                    // 墊付款
                    var resultB = 0.0;
                    for (var i = 0; i < item._payments.length; i++) {
                        if (item._payments[i].amount == null || item._payments[i].amount == undefined) {
                        } else {
                            resultB += parseInt(item._payments[i].amount)
                        }
                    }
                    // console.log("resultB:> " + resultB)
                    return Math.round(resultB)
                case 3:
                    // 其他
                    var resultC = 0.0;
                    // console.log("其他:> ");
                    // console.log(item);
                    for (var i = 0; i < item._otherCost.length; i++) {
                        if (item._otherCost[i].amount == null || item._otherCost[i].amount == undefined) {
                        } else {
                            // console.log(item._otherCost[i].amount)
                            resultC += parseInt(item._otherCost[i].amount)
                        }
                    }
                    // console.log("resultC:> " + resultC)
                    return Math.round(resultC)
                case 4:
                    // 收入
                    var resultD = 0.0;
                    for (var i = 0; i < item._income.length; i++) {
                        // console.log(item._income[i])
                        resultD += parseInt(item._income[i].expectAmount)
                    }
                    // console.log("resultC:> " + resultC)
                    // return Math.round(resultD)
                    return Math.round(resultD / 1.05 * (1 - ($scope.calcRates() / 100)))
                case 5:
                    // 廠商請款
                    var resultE = 0.0;
                    for (var i = 0; i < item._subContractorPay.length; i++) {
                        resultE += (parseInt(item._subContractorPay[i].payApply) -
                            parseInt(item._subContractorPay[i].payTax) -
                            parseInt(item._subContractorPay[i].payOthers));
                    }
                    // console.log("resultC:> " + resultC)
                    return Math.round(resultE);
                case 6:
                    // 罰款
                    var resultF = 0.0;
                    for (var i = 0; i < item._income.length; i++) {
                        // console.log(item._income[i])
                        resultF += parseInt(item._income[i].fines)
                    }
                    // console.log("resultC:> " + resultC)
                    return Math.round(resultF)
                case 7:
                    // 人時：正常，加班
                    // console.log(item);
                    var resultG = 0.0;
                    resultG += parseInt(item._overall)
                    // console.log("resultG:> " + resultG)
                    return Math.round(parseInt(item._overall))

                case 8:
                    // 匯費
                    var resultF = 0.0;
                    for (var i = 0; i < item._income.length; i++) {
                        // console.log(item._income[i])
                        resultF += parseInt(item._income[i].fee)
                    }
                    // console.log("resultC:> " + resultC)
                    return Math.round(resultF)
            }
        }

        $scope.saveOverAll = function (item) {
            var formData = {
                _id: item._id,
                overAllMemo: item.overAllMemo,
                preIncome: item.preIncome,
                preCost: item.preCost,
            }
            ProjectFinancialResultUtil.updateFR(formData)
                .success(function (res) {
                    toastr.success('設定成功', 'Success');
                })
        }

        $scope.showPrjCode = function (prjDID) {
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

            for (var index = 0; index < $scope.selectPrjArray.length; index++) {
                // console.log($scope.selectPrjArray[index])
                results += $scope.showPrjCode($scope.selectPrjArray[index])
                if (index < $scope.selectPrjArray.length - 1) {
                    results += ", "
                }
            }
            results += " ]"
            return results
        }

        //    ===================
        // type 1, 一天加一專案 為一筆
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

                        // console.log(item)
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

            for (var index = 0; index < itemList.length; index++) {
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

    }
})();


