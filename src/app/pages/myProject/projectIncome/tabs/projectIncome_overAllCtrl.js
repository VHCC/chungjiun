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
                    };
                }
            });

        $scope.initProject = function() {
            Project.findAllEnable()
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

        // $scope.listenYear = function (dom) {
        //     dom.$watch('myYear',function(newValue, oldValue) {
        //         if (dom.isShiftYearSelect) {
        //             dom.isShiftYearSelect = false;
        //             $scope.year = specificYear = newValue - 1911;
        //             $scope.fetchSCApplyData();
        //         }
        //     });
        // }

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
            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_project_income_overall'
                });
            }, 100)

            var formData = {
                prjDID: prjInfo._id
            }

            ProjectFinancialResultUtil.findFR(formData)
                .success(function (res) {
                    console.log("FinancialResult");
                    console.log(res);

                    if (res.payload.length == 0) {
                        ProjectFinancialResultUtil.createFR(formData)
                            .success(function (res) {
                                $scope.fetchProjectFinancialResult($scope.selectPrjInfo);
                            })
                    }

                    $scope.financialResult = res.payload[0];
                    $scope.projectFinancialResultTable = res.payload;

                    $scope.overall_data = [];

                    var incomeFormData = {
                        isEnable: true,
                        prjDID: prjInfo._id
                    }

                    // 收入
                    ProjectIncomeUtil.findIncome(incomeFormData)
                        .success(function (res) {
                            console.log("收入");
                            console.log(res);
                            $scope.projectIncomeTable = res.payload;
                            for (var i = 0; i < res.payload.length; i ++) {
                                if ($scope.overall_data[res.payload[i].realDate] != undefined) {
                                    var data = $scope.overall_data[res.payload[i].realDate];
                                    data._income.push(res.payload[i]);
                                } else {

                                    var data = {
                                        _date: res.payload[i].realDate,
                                        _income: [res.payload[i]],
                                        _payments: [],
                                        _otherCost: [],
                                        _subContractorPay: [],
                                        _overall: 0,
                                    }

                                    $scope.overall_data.push(data);
                                    eval('$scope.overall_data[res.payload[i].realDate] = data')
                                }
                            }
                            console.log($scope.overall_data);
                        })

                    // 墊付款
                    PaymentFormsUtil.fetchPaymentsItemByPrjDID(formData)
                        .success(function (res) {
                            console.log("墊付款")
                            console.log(res)
                            $scope.searchPaymentsItems = res.payload;
                            for (var i = 0; i < res.payload.length; i ++) {

                                var tempDate = moment(res.payload[i].year+1911 + "/" + res.payload[i].month).format("YYYY/MM");
                                // console.log(tempDate)
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
                            console.log($scope.overall_data);
                        })
                        .error(function (resp) {
                        })

                    // 其他支出
                    ExecutiveExpenditureUtil.fetchExecutiveExpenditureItemsByPrjDID(formData)
                        .success(function (res) {
                            console.log("其他支出")
                            console.log(res)
                            $scope.displayEEItems = res.payload;
                            for (var i = 0; i < res.payload.length; i ++) {
                                var tempDate = moment(res.payload[i].year+1911 + "/" + res.payload[i].month).format("YYYY/MM");
                                // console.log(tempDate)
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
                        })
                        .error(function (res) {
                        })

                    var fetchFormData = {
                        prjDID: prjInfo._id,
                        isExecutiveCheck: true
                    }

                    // 廠商請款
                    SubContractorPayItemUtil.fetchSCPayItems(fetchFormData)
                        .success(function (res) {
                            console.log("廠商請款")
                            console.log(res)
                            $scope.subContractorPayItems = res.payload;
                            for (var i = 0; i < res.payload.length; i ++) {
                                var tempDate = moment(res.payload[i].year+1911 + "/" + res.payload[i].month).format("YYYY/MM");
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

                        })

                    // 人時支出
                    var getData = {};

                    getData.branch = prjInfo.branch;
                    getData.year = prjInfo.year;
                    getData.code = prjInfo.code;
                    getData.prjNumber = prjInfo.prjNumber;
                    getData.prjSubNumber = prjInfo.prjSubNumber;
                    getData.type = prjInfo.type;

                    WorkHourUtil.queryStatisticsForms_projectIncome_Cost(getData)
                        .success(function (res) {
                            // console.log(res)

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
                            // console.log(res.payload);
                            $scope.statisticsResults_type1 = $scope.filter_type1_data(res.payload);
                            $scope.statisticsResults = $scope.filter_type2_data(res.payload);
                            console.log($scope.statisticsResults);
                            $scope.statisticsResults_type1 = $scope.filter_type2_data($scope.statisticsResults_type1);
                            console.log($scope.statisticsResults_type1);

                            for (var i = 0; i < $scope.statisticsResults_type1.length; i ++) {
                                var tempDate = $scope.statisticsResults_type1[i]._date;
                                if ($scope.overall_data[tempDate] != undefined) {
                                    var data = $scope.overall_data[tempDate];
                                    data._overall = $scope.statisticsResults_type1[i].totalCost +
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

                            $scope.overall_data_sort = $scope.overall_data.sort(function (a, b) {
                                return moment(a._date).unix() > moment(b._date).unix() ? 1 : -1;
                            });
                        })

                    angular.element(
                        document.getElementById('includeHead_over_all'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'專案 - " + prjInfo.prjCode + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/myProject/projectIncome/tables/projectIncome_overall_table.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_project_income_overall'
                        });
                    }, 1000)
                })
        }



        // type 2, 一專案加一人名 為一筆
        $scope.filter_type2_data = function(rawTables) {
            console.log("filter_type2_data");
            console.log(rawTables);
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
                        item.hourTotal_add_A = hourTotal * cons_3;
                        item.hourTotal_add_cost_A = parseInt(totalCost * cons_3);
                        break;
                    case 2:
                        item.iscalculate_B = true;
                        item.hourTotal_add_B = hourTotal * cons_2;
                        item.hourTotal_add_cost_B = parseInt(totalCost * cons_2);
                        break;
                }
                return hourTotal;
            }

            var type2_add_data = [];

            for (var index = 0; index < item._add_tables.length; index ++) {
                var operatedFormDate = item._add_tables[index].create_formDate;
                if (item._add_tables[index].workAddType == type) {

                    // var date_id = DateUtil.getShiftDatefromFirstDate_typeB(moment(operatedFormDate), item._add_tables[index].day - 1) + "_"
                    //     + item._id.prjCode + "_"
                    //     + item._user_info._id;

                    var date_id = DateUtil.getShiftDatefromFirstDate_typeB(moment(operatedFormDate), item._add_tables[index].day - 1)
                    var min = parseInt(TimeUtil.getCalculateHourDiffByTime(item._add_tables[index].start_time, item._add_tables[index].end_time))
                    // mins += min;
                    // console.log(item)
                    // console.log(type2_add_data);
                    // console.log(date_id);
                    if (type2_add_data[date_id] != undefined) {
                        var data = type2_add_data[date_id];
                        data.min = min + type2_add_data[date_id].min;
                    } else {
                        var data = {
                            _date: DateUtil.getShiftDatefromFirstDate(moment(operatedFormDate), item._add_tables[index].day - 1),
                            min: min,
                            monthSalary: item._add_tables[index].userMonthSalary
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
                    item.hourTotal_add_B = hourTotal * cons_2;
                    item.hourTotal_add_cost_B = parseInt(totalCost * cons_2);
                    break;
            }
            return hourTotal;
        }

        $scope.calIncome = function (type) {
            var incomeA = 0.0;
            if ($scope.projectIncomeTable == undefined) return incomeA;
            for (var i = 0; i < $scope.projectIncomeTable.length; i ++) {
                incomeA += parseInt($scope.projectIncomeTable[i].realAmount)
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
                incomeA += parseInt($scope.projectIncomeTable[i].fines)
            }
            // console.log("incomeA:> " + incomeA)
            return incomeA;
        }

        $scope.calSubContractorPay = function() {
            // 廠商請款
            var resultD = 0.0;
            if ($scope.subContractorPayItems == undefined) return resultD;
            for (var i = 0; i < $scope.subContractorPayItems.length; i ++) {
                resultD += (parseInt($scope.subContractorPayItems[i].payApply) -
                    parseInt($scope.subContractorPayItems[i].payTax) -
                    parseInt($scope.subContractorPayItems[i].payOthers)
                )
            }
            // console.log("resultD:> " + resultD)
            return resultD;
        }

        // 技師、行政、風險
        $scope.calcRates = function () {
            if ($scope.financialResult == undefined) return 0;
            // console.log($scope.financialResult[0]);
            var rates = parseFloat($scope.financialResult.rate_item_1)
                + parseFloat($scope.financialResult.rate_item_2)
                + parseFloat($scope.financialResult.rate_item_4);

            if (rates == 0.0) {
                return 0.0;
            } else {
                return parseFloat($scope.financialResult.rate_item_1)
                    + parseFloat($scope.financialResult.rate_item_2)
                    + parseFloat($scope.financialResult.rate_item_4)
            }

            // + parseFloat(rateItem.rate_item_5)
        }

        $scope.calcCost = function (type) {
            switch (type) {
                case 1:
                    // 人時
                    var resultA = 0.0;
                    if ($scope.statisticsResults == undefined) return resultA;
                    for (var i = 0; i < $scope.statisticsResults.length; i ++) {
                        resultA += $scope.calculateHours_type2($scope.statisticsResults[i], 2);
                        resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 1, 2);
                        resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 2, 2);
                    }
                    // console.log("resultA:> " + resultA)
                    return Math.round(resultA)
                case 2:
                    // 墊付款
                    var resultB = 0.0;
                    if ($scope.searchPaymentsItems == undefined) return resultB;
                    for (var i = 0; i < $scope.searchPaymentsItems.length; i ++) {
                        resultB += parseInt($scope.searchPaymentsItems[i].amount)
                    }
                    // console.log("resultB:> " + resultB)
                    return Math.round(resultB)
                case 3:
                    // 其他
                    var resultC = 0.0;
                    if ($scope.displayEEItems == undefined) return resultC;
                    for (var i = 0; i < $scope.displayEEItems.length; i ++) {
                        resultC += parseInt($scope.displayEEItems[i].amount)
                    }
                    // console.log("resultC:> " + resultC)
                    return Math.round(resultC);
            }
        }

        $scope.calcItem = function (item, type) {
            switch (type) {
                case 1:
                    // 人時
                    var resultA = 0.0;
                    for (var i = 0; i < $scope.statisticsResults.length; i ++) {
                        resultA += $scope.calculateHours_type2($scope.statisticsResults[i], 2);
                        resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 1, 2);
                        resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 2, 2);
                    }
                    // console.log("resultA:> " + resultA)
                    return Math.round(resultA)
                case 2:
                    // 墊付款
                    var resultB = 0.0;
                    for (var i = 0; i < item._payments.length; i ++) {
                        resultB += parseInt(item._payments[i].amount)
                    }
                    // console.log("resultB:> " + resultB)
                    return Math.round(resultB)
                case 3:
                    // 其他
                    var resultC = 0.0;
                    for (var i = 0; i < item._otherCost.length; i ++) {
                        resultC += parseInt(item._otherCost[i].amount)
                    }
                    // console.log("resultC:> " + resultC)
                    return Math.round(resultC)
                case 4:
                    // 收入
                    var resultD = 0.0;
                    for (var i = 0; i < item._income.length; i ++) {
                        // console.log(item._income[i])
                        resultD += parseInt(item._income[i].realAmount)
                    }
                    // console.log("resultC:> " + resultC)
                    return Math.round(resultD)
                case 5:
                    // 廠商請款
                    var resultE = 0.0;
                    for (var i = 0; i < item._subContractorPay.length; i ++) {
                        resultE += (parseInt(item._subContractorPay[i].payApply) -
                            parseInt(item._subContractorPay[i].payTax) -
                            parseInt(item._subContractorPay[i].payOthers));
                    }
                    // console.log("resultC:> " + resultC)
                    return Math.round(resultE);
                case 6:
                    // 罰款
                    var resultF = 0.0;
                    for (var i = 0; i < item._income.length; i ++) {
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





    //    ===================
        // type 1, 一天加一專案 為一筆

        $scope.filter_type1_data = function(rawTables) {
            console.log(rawTables)
            var itemList = [];

            var type1_data = [];

            for (var memberCount = 0; memberCount < rawTables.length; memberCount++) {
                // console.log(rawTables[memberCount].tables);
                if (rawTables[memberCount].tables != undefined) {
                    for (var table_index = 0 ;table_index < rawTables[memberCount].tables.length; table_index ++) {

                        var item = "_" + DateUtil.getShiftDatefromFirstDate_month(moment(rawTables[memberCount].tables[table_index].create_formDate)
                            , 0) + "_" +
                            rawTables[memberCount]._id.prjCode;

                        // var tableData = {
                        //     type_1_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                        //     type_1_day: 0,
                        //     type_1_hour: rawTables[memberCount].tables[table_index].mon_hour,
                        //     type_1_hour_memo: rawTables[memberCount].tables[table_index].mon_memo
                        // }

                        var tableData = rawTables[memberCount].tables[table_index];

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
                                _day: 1,
                                _day_tw: DateUtil.getDay(1),
                                _prjCode: rawTables[memberCount]._id.prjCode,
                                _project_info: rawTables[memberCount]._project_info,
                                users: users,
                                users_info: users_info,
                                tables: tables,
                                _add_tables: [],
                            }
                        }
                        eval('type1_data[item] = data')
                    }
                }

                if (rawTables[memberCount]._add_tables != undefined) {
                    for (var table_add_index = 0 ;table_add_index < rawTables[memberCount]._add_tables.length; table_add_index ++) {

                        var item = "_" + DateUtil.getShiftDatefromFirstDate_month(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate),
                            rawTables[memberCount]._add_tables[table_add_index].day - 1) + "_" +
                            rawTables[memberCount]._id.prjCode;

                        var tableData_add = {
                            create_formDate: rawTables[memberCount]._add_tables[table_add_index].create_formDate,
                            day: rawTables[memberCount]._add_tables[table_add_index].day,
                            workAddType: rawTables[memberCount]._add_tables[table_add_index].workAddType,
                            start_time: rawTables[memberCount]._add_tables[table_add_index].start_time,
                            end_time: rawTables[memberCount]._add_tables[table_add_index].end_time,
                            reason: rawTables[memberCount]._add_tables[table_add_index].reason,
                            userMonthSalary: rawTables[memberCount]._add_tables[table_add_index].userMonthSalary,
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
                        }
                        eval('type1_data[item] = data')
                    }
                }
            }
            // console.log(itemList);
            console.log(type1_data);

            var result = [];
            var result_sort = [];

            for (var index = 0; index < itemList.length; index ++) {
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

    }
})();


