/**
 * @author IChen.chu
 * created on 25.09.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('projectIncomeCostCtrl',
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
                'Project',
                'ProjectUtil',
                'DateUtil',
                'TimeUtil',
                'WorkHourUtil',
                'bsLoadingOverlayService',
                projectIncomeCostCtrl
            ])

    /** @ngInject */
    function projectIncomeCostCtrl($scope,
                             toastr,
                             $cookies,
                             $filter,
                             $compile,
                             $timeout,
                             window,
                             ngDialog,
                             User,
                             Project,
                             ProjectUtil,
                             DateUtil,
                             TimeUtil,
                             WorkHourUtil,
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
                    $scope.fetchSCApplyData();
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

                    if (!item._add_tables[index].isExecutiveConfirm) {
                        continue;
                    }

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
            console.log(type2_add_data);
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

        $scope.fetchProjectIncomeCost = function (prjInfo) {
            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_project_income_cost'
                });
            }, 100)
            // 統計搜尋條件
            var getData = {};

            getData.branch = prjInfo.branch;
            getData.year = prjInfo.year;
            getData.code = prjInfo.code;
            getData.prjNumber = prjInfo.prjNumber;
            getData.prjSubNumber = prjInfo.prjSubNumber;
            getData.type = prjInfo.type;

            console.log(getData);

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

                    angular.element(
                        document.getElementById('includeHead_cost'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'列表 - " + $scope.statisticsResults.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/myProject/projectIncome/tables/projectIncome_cost_table.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_project_income_cost'
                        });
                    }, 1000)
                })
        }


    }
})();


