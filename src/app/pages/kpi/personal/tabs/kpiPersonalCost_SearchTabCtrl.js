/**
 * @author IChen.chu
 * created on 20 Dec 2023
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.cgKPI')
        .controller('kpiPersonalCost_SearchCtrl',
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
                kpiPersonalCostSearchCtrl
            ])

    /** @ngInject */
    function kpiPersonalCostSearchCtrl($scope,
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

        var thisYear = new Date().getFullYear() - 1911;
        var specificYear = thisYear;
        $scope.year = specificYear;

        $scope.listenYear = function (dom) {
            dom.$watch('myYear', function (newValue, oldValue) {
                if (dom.isShiftYearSelect) {
                    dom.isShiftYearSelect = false;
                    $scope.year = specificYear = newValue - 1911;

                    $scope.personSelect = {};
                    console.log(vm.queryUsers.selected);
                    // $scope.personSelect._id = $scope.userDID;
                    $scope.personSelect._id = vm.queryUsers.selected._id;

                    $scope.fetchWorkHour($scope.personSelect);
                }
            });
        }

        $scope.personSelected = function() {

            angular.element(
                document.getElementById('includeHead_kpi_personal_cost_search_result'))
                .html(($scope));

            toastr.warning("請選擇年份", 'Warn');
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
                        technician: allProjects[index].technician,
                        ezName: nameResult,
                        combinedID: allProjects[index].combinedID,
                    };
                }
            })

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
                $scope.getQueryUserArray();
                $scope.projectManagers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allUsers[i]._id,
                        name: allUsers[i].name
                    };
                }
            });

        $scope.getQueryUserArray = function () {
            var formData = {
                userDID : $scope.userDID,
            }
            KpiUtil.findKPIPersonQuerySetting(formData)
                .success(function (res) {
                    if (res.payload.length == 0) {
                        KpiUtil.insertKPIPersonQuerySetting(formData)
                            .success(function (res) {
                                $scope.getQueryUserArray();
                            })
                    } else {
                        vm.queryUsers = [];
                        for (var i = 0; i < res.payload[0].userDIDArray.length; i++) {
                            var temp = {
                                _id: res.payload[0].userDIDArray[i],
                                name: $scope.showUser(res.payload[0].userDIDArray[i]),
                                before108Kpi: $scope.showBefore108Kpi(res.payload[0].userDIDArray[i]),
                            };
                            vm.queryUsers.push(temp);
                        }
                        console.log(vm.queryUsers);
                    }
                })
        }

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

        $scope.showPrjInfo = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0] : 'Not Set';
        };

        $scope.showPrjTech = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].technician : 'Not Set';
        };

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

        $scope.showBefore108Kpi = function (userDID) {
            var selected = [];
            if (vm.users === undefined) return;
            if (userDID) {
                selected = $filter('filter')(vm.users, {
                    _id: userDID,
                });
            }
            return selected.length ? selected[0].before108Kpi : 0;
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

        $scope.addKPIElement = function(type) {
            var formData = {
                year: $scope.year,
                type: type,
            }
            KpiUtil.insertKPIElement(formData)
                .success(function (res) {
                    $scope.fetchYearlyProject($scope.year)
                })
        }

        $scope.deleteKPIElement = function(kpi) {
            var formData = {
                _id: kpi._id,
            }
            KpiUtil.deleteKPIElement(formData)
                .success(function (res) {
                    $scope.fetchYearlyProject($scope.year)
                })
        }

        $scope.saveKPIElements = function() {
            for (var index= 0; index < $scope.projectKPIElements.length; index ++) {
                var formData = {
                    _id: $scope.projectKPIElements[index]._id,
                    amount: $scope.projectKPIElements[index].amount,
                    memo: $scope.projectKPIElements[index].memo,
                }
                KpiUtil.updateKPIElement(formData)
                    .success(function (res) {
                    })
            }
            $scope.fetchYearlyProject($scope.year)
        }

        $scope.fetchKPIValue = function(type, item) {
            switch(type) {
                case 6: // 行政
                    return item.kpi6;
                case 8: // 風險
                    return item.kpi8;
                case 9: // 利潤
                    return item.kpi9;
            }
        }

        $scope.calResultKpiAll = function(type) {
            var result = 0.0;
            switch (type){
                // 行政費
                case 6:
                    for (var index = 0; index < $scope.projectFinancialResultTable_total.length; index++) {
                        var item = $scope.projectFinancialResultTable_total[index];
                        result += item.kpi6;
                    }
                    for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                        var item = $scope.projectKPIElements[index];
                        result += item.amount;
                    }
                    return result;
                // 風險 E*N
                case 8:
                    for (var index = 0; index < $scope.projectFinancialResultTable_total.length; index++) {
                        var item = $scope.projectFinancialResultTable_total[index];
                        result += item.kpi8;
                    }
                    for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                        var item = $scope.projectKPIElements[index];
                        result += item.amount;
                    }
                    return result;
                // 利潤 E*N
                case 9:
                    for (var index = 0; index < $scope.projectFinancialResultTable_total.length; index++) {
                        var item = $scope.projectFinancialResultTable_total[index];
                        result += item.kpi9;
                    }
                    for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                        var item = $scope.projectKPIElements[index];
                        result += item.amount;
                    }
                    return result;
            }
        }

        // 統計搜尋條件
        var getData = {};

        // 年度、月份
        // 總案代碼、專案代碼、子案代碼、類型代碼
        // 工時類型、相關人員
        $scope.fetchWorkHour = function (userSelected) {

            // $scope.startDay = $('#inputStartDay_employee')[0].value;
            // $scope.endDay = $('#inputEndDay_employee')[0].value;

            // getData.form_yearArray = $scope.fetchYearArray($scope.startDay, $scope.endDay);
            // getData.form_monthArray = $scope.fetchMonthArray($scope.startDay, $scope.endDay);

            getData.year = $scope.year+"";
            // getData.form_yearArray = [109];
            // getData.form_monthArray = [1,2,3,4,5,6,7,8,9,10,11,12];
            getData.targerUsers = userSelected;
            console.log(getData);

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_kpi_personal'
            });

            WorkHourUtil.queryKPIPersonalWorkHour(getData)
                .success(function (res) {
                    console.log(res);
                    res.payload = res.payload.sort(function (a, b) {
                        return a._id.prjCode > b._id.prjCode ? 1 : -1;
                    });

                    for (var index = 0; index < res.payload.length; index ++) {
                        for (var index_sub = 0; index_sub < res.payload_add.length; index_sub ++) {
                            if( res.payload_add[index_sub]._id.prjCode == res.payload[index]._id.prjCode &&
                                res.payload_add[index_sub]._id.userDID == res.payload[index]._id.userDID) {
                                res.payload[index]._add_tables = res.payload_add[index_sub].add_tables;
                            }
                        }
                    }
                    $scope.statisticsResults_type2 = $scope.filter_type2_data(res.payload);

                    $scope.overall_data = [];

                    console.log($scope.statisticsResults_type2);
                    angular.element(
                        document.getElementById('includeHead_kpi_personal_cost_search_result'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'列表 - " + $scope.statisticsResults_type2.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/kpi/personal/tables/kpiPersonalTable_type2.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)

                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)
                })
        }






        // END

        // METHODS
        // type 2, 一專案加一人名 為一筆
        $scope.filter_type2_data = function(rawTables) {
            // console.log("filter_type2_data");
            // console.log(rawTables);
            var type2_result = [];
            for (var index = 0 ;index < rawTables.length; index ++) {
                if ( ($scope.calculateHours_type2(rawTables[index]) +
                    $scope.calculateHours_type2_add(rawTables[index], 1) +
                    $scope.calculateHours_type2_add(rawTables[index], 2) != 0)) {
                    type2_result.push(rawTables[index]);
                }
            }
            // console.log(type2_result);
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

        $scope.calculateHours_type2_add = function (item, type) {
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


        $scope.getTotalCost = function (item) {
            return Math.round(item.totalCost + item.hourTotal_add_cost_A + item.hourTotal_add_cost_B);
        }


    }
})();


