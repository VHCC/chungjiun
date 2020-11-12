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

        $scope.listenYear = function (dom) {
            dom.$watch('myYear',function(newValue, oldValue) {
                if (dom.isShiftYearSelect) {
                    dom.isShiftYearSelect = false;
                    $scope.year = specificYear = newValue - 1911;
                    $scope.getFinancialRate();
                }
            });
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
                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_project_financial'
                });
            }, 0)
            var formData = {
                year: $scope.year
            }

            ProjectFinancialRateUtil.getFinancialRate(formData)
                .success(function (res) {
                    if (res.payload == null || res.payload.length == 0) {
                        ProjectFinancialRateUtil.insertFinancialRate(formData)
                            .success(function (res) {
                                $scope.yearRate = res.payload;
                            })
                    } else {
                        $scope.yearRate = res.payload;
                    }
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_project_financial'
                        });
                    }, 500)
                })
        }

        $scope.calcRates = function (rateItem) {
            if (rateItem == undefined) return 0;
            return parseFloat(rateItem.rate_item_1)
                + parseFloat(rateItem.rate_item_2)
                + parseFloat(rateItem.rate_item_3)
                + parseFloat(rateItem.rate_item_4)
                + parseFloat(rateItem.rate_item_5)
        }

        $scope.fetchProjectFinancialResult = function (prjInfo) {
            $scope.selectPrjDID = prjInfo._id;

            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_project_financial_result'
                });
            }, 100)

            var formData = {
                prjDID: prjInfo._id
            }

            ProjectFinancialResultUtil.findFR(formData)
                .success(function (res) {
                    console.log(res);

                    if (res.payload.length == 0) {
                        ProjectFinancialResultUtil.createFR(formData)
                            .success(function (res) {
                                $scope.fetchProjectFinancialResult($scope.selectPrjDID);
                            })
                    }

                    $scope.projectFinancialResultTable = res.payload;

                    var incomeFormData = {
                        isEnable: true,
                        prjDID: prjInfo._id
                    }

                    // 收入
                    ProjectIncomeUtil.findIncome(incomeFormData)
                        .success(function (res) {
                            console.log(res);
                            $scope.projectIncomeTable = res.payload;
                        })

                    // 墊付款
                    PaymentFormsUtil.fetchPaymentsItemByPrjDID(formData)
                        .success(function (res) {
                            console.log(res)
                            $scope.searchPaymentsItems = res.payload;
                        })
                        .error(function (resp) {
                        })

                    // 其他支出
                    ExecutiveExpenditureUtil.fetchExecutiveExpenditureItemsByPrjDID(formData)
                        .success(function (res) {
                            console.log(res)
                            $scope.displayEEItems = res.payload;
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
                            console.log(res)
                            $scope.subContractorPayItems = res.payload;
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
                            console.log(res)

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
                            // console.log(res.payload)
                            $scope.statisticsResults = $scope.filter_type2_data(res.payload);
                            console.log($scope.statisticsResults);
                        })

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

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_project_financial_result'
                        });
                    }, 1000)
                })
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
            var type2_add_data = [];

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

            for (var index = 0; index < item._add_tables.length; index ++) {
                var operatedFormDate = item._add_tables[index].create_formDate;
                if (item._add_tables[index].workAddType == type) {

                    var date_id = DateUtil.getShiftDatefromFirstDate_typeB(moment(operatedFormDate), item._add_tables[index].day - 1) + "_"
                        + item._id.prjCode + "_"
                        + item._user_info._id;
                    var min = parseInt(TimeUtil.getCalculateHourDiffByTime(item._add_tables[index].start_time, item._add_tables[index].end_time))
                    // mins += min;
                    if (type2_add_data[date_id] != undefined) {
                        var data = type2_add_data[date_id];
                        data.min = min + type2_add_data[date_id].min;
                        // type2_add_data[date_id] = (min + type2_add_data[date_id])
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

        $scope.saveProjectFR = function (item) {
            console.log(item)

            var formData = {

                _id: item._id,
                income: item.income,
                otherCost: item.otherCost,
                rate_item_1: item.rate_item_1,
                rate_item_2: item.rate_item_2,
                rate_item_3: item.rate_item_3,
                rate_item_4: item.rate_item_4,
                rate_item_5: item.rate_item_5,
                memo: item.memo,
            }

            ProjectFinancialResultUtil.updateFR(formData)
                .success(function (res) {
                    console.log(res)
                    toastr.success('設定成功', 'Success');
                })
        }

        $scope.closeProjectFR = function (item) {
            console.log(item)

            var formData = {

                _id: item._id,
                income: item.income,
                otherCost: item.otherCost,
                rate_item_1: item.rate_item_1,
                rate_item_2: item.rate_item_2,
                rate_item_3: item.rate_item_3,
                rate_item_4: item.rate_item_4,
                rate_item_5: item.rate_item_5,
                memo: item.memo,
            }

            ProjectFinancialResultUtil.updateFR(formData)
                .success(function (res) {
                    console.log(res)
                    toastr.success('設定成功', 'Success');
                })
        }

        $scope.calIncome = function () {
            var incomeA = 0.0;
            for (var i = 0; i < $scope.projectIncomeTable.length; i ++) {
                incomeA += parseInt($scope.projectIncomeTable[i].realAmount)
            }
            console.log("incomeA:> " + incomeA)
            return incomeA
        }

        $scope.calcAllCost = function () {
            var result = 0.0;
            var resultA = 0.0;
            for (var i = 0; i < $scope.statisticsResults.length; i ++) {
                resultA += $scope.calculateHours_type2($scope.statisticsResults[i], 2);
                resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 1, 2);
                resultA += $scope.calculateHours_type2_add($scope.statisticsResults[i], 2, 2);
            }
            // console.log("resultA:> " + resultA)

            var resultB = 0.0;
            for (var i = 0; i < $scope.searchPaymentsItems.length; i ++) {
                resultB += parseInt($scope.searchPaymentsItems[i].amount)
            }
            // console.log("resultB:> " + resultB)

            var resultC = 0.0;
            for (var i = 0; i < $scope.displayEEItems.length; i ++) {
                resultC += parseInt($scope.displayEEItems[i].amount)
            }
            // console.log("resultC:> " + resultC)

            var resultD = 0.0;
            for (var i = 0; i < $scope.subContractorPayItems.length; i ++) {
                resultD += (parseInt($scope.subContractorPayItems[i].payApply) -
                    parseInt($scope.subContractorPayItems[i].payTax) -
                    parseInt($scope.subContractorPayItems[i].payOthers)
                )
            }
            // console.log("resultD:> " + resultD)

            return resultA + resultB + resultC + resultD;
        }

    }
})();


