/**
 * @author IChen.Chu
 * created on 13.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('MyWorkHourTable_AddHourModalCtrl',
            [
                '$scope',
                'toastr',
                '$cookies',
                '$uibModalInstance',
                'TimeUtil',
                'DateUtil',
                'WorkHourAddItemUtil',
                MyWorkHourTableAddHourModalCtrl
            ]);

    /** @ngInject */
    function MyWorkHourTableAddHourModalCtrl($scope,
                                             toastr,
                                             cookies,
                                             $uibModalInstance,
                                             TimeUtil,
                                             DateUtil,
                                             WorkHourAddItemUtil) {
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.table = $scope.$resolve.table;
        $scope.day = $scope.$resolve.searchType;
        $scope.userMonthSalary = $scope.$resolve.userMonthSalary;
        // $scope.userHourSalary = $scope.$resolve.userHourSalary;
        $scope.editableFlag = $scope.$resolve.editableFlag;

        // initial
        $scope.username = cookies.get('username');
        $scope.userDID = cookies.get('userDID');
        $scope.roleType = cookies.get('roletype');

        // 主要顯示
        $scope.workAddTablesItems = [];

        var formData = {
            creatorDID: $scope.table.creatorDID,
            prjDID: $scope.table.prjDID,
            create_formDate: $scope.table.create_formDate,
            day: $scope.day,
        }
        // var workAddTableIDArray = [];
        WorkHourAddItemUtil.getWorkHourAddItems(formData)
            .success(function (res) {
                $scope.workAddTablesItems = res.payload;
                // workAddTableIDArray = [];
                // 組成 prjID Array, TableID Array，再去Server要資料
                // for (var index = 0; index < res.payload.length; index++) {
                //     workAddTableIDArray[index] = res.payload[index]._id;
                // }
            })
            .error(function () {
                console.log('ERROR  WorkHourAddItemUtil.getWorkHourAddItems')
            })

        $scope.createWorkAddItem = function (items) {
            var createData = {
                creatorDID: $scope.userDID,
                workAddType: 1,
                create_formDate: $scope.table.create_formDate,
                prjDID: $scope.table.prjDID,
                // year: (new Date($scope.table.create_formDate).getFullYear() -1911),
                year: (new Date(moment($scope.table.create_formDate).add($scope.day - 1, "days").format("YYYY/MM/DD")).getFullYear() -1911),
                month: (new Date(DateUtil.getShiftDatefromFirstDate(moment($scope.table.create_formDate), ($scope.day - 1))).getMonth() + 1),
                day: $scope.day,
                start_time: "08:30",
                end_time: "08:30",
                reason: "",
                userMonthSalary: $scope.userMonthSalary,
            };

            WorkHourAddItemUtil.createWorkHourAddItemOne(createData)
                .success(function (resp) {
                    $scope.workAddTablesItems.push(resp.payload);
                })
        }

        $scope.removeWorkAddItem = function (index, item) {
            var removeData = {
                _id: item._id
            }

            WorkHourAddItemUtil.removeWorkHourAddItem(removeData)
                .success(function (resp) {

                    $scope.workAddTablesItems.splice(index, 1);

                    var result = $scope.showTotalAddHour($scope.workAddTablesItems, 1) +
                        $scope.showTotalAddHour($scope.workAddTablesItems, 2);
                    if (isNaN(result)) {
                        toastr.error('加班單格式錯誤，請檢查', '錯誤');
                        return;
                    }

                    $scope.table.totalHourTemp = result;
                    console.log(result);
                    console.log($scope);

                    switch ($scope.day) {
                        case 1 : {
                            $scope.table.mon_hour_add = $scope.table.totalHourTemp;
                        }
                            break;
                        case 2 : {
                            $scope.table.tue_hour_add = $scope.table.totalHourTemp;
                        }
                            break;
                        case 3 : {
                            $scope.table.wes_hour_add = $scope.table.totalHourTemp;
                        }
                            break;
                        case 4 : {
                            $scope.table.thu_hour_add = $scope.table.totalHourTemp;
                        }
                            break;
                        case 5 : {
                            $scope.table.fri_hour_add = $scope.table.totalHourTemp;
                        }
                            break;
                        case 6 : {
                            $scope.table.sat_hour_add = $scope.table.totalHourTemp;
                        }
                            break;
                        case 7 : {
                            $scope.table.sun_hour_add = $scope.table.totalHourTemp;
                        }
                            break;
                    }
                    $scope.table.hourAddTotal = $scope.table.mon_hour_add +
                        $scope.table.tue_hour_add +
                        $scope.table.wes_hour_add +
                        $scope.table.thu_hour_add +
                        $scope.table.fri_hour_add +
                        $scope.table.sat_hour_add +
                        $scope.table.sun_hour_add;

                    $scope.parent.saveTemp($scope.table);
                })
        };

        $scope.setWorkAddType = function (table, type) {
            table.workAddType = type;
        }

        // 累積所有項目
        $scope.showTotalAddHour = function (tables, type) {
            var result = 0;
            for (var index = 0; index < tables.length; index++) {
                if (type == tables[index].workAddType) {
                    result += parseInt(TimeUtil.getCalculateHourDiffByTime(tables[index].start_time, tables[index].end_time));
                }
            }
            result = result % 60 < 30 ? Math.round(result / 60) : Math.round(result / 60) - 0.5;
            if (result < 1) {
                // $scope.table.totalHourTemp = 0;
                return 0;
            }
            // $scope.table.totalHourTemp = result;
            return result;
        }

        // **************** time section ********************
        // time calculate
        $scope.getHourDiff = function (dom) {
            if (dom.tableTimeStart && dom.tableTimeEnd) {
                var difference = Math.abs(TimeUtil.toSeconds(dom.tableTimeStart) - TimeUtil.toSeconds(dom.tableTimeEnd));
                dom.table.start_time = dom.tableTimeStart;
                dom.table.end_time = dom.tableTimeEnd;
                // compute hours, minutes and seconds
                var result = [
                    // an hour has 3600 seconds so we have to compute how often 3600 fits
                    // into the total number of seconds
                    Math.floor(difference / 3600), // HOURS
                    // similar for minutes, but we have to "remove" the hours first;
                    // this is easy with the modulus operator
                    Math.floor((difference % 3600) / 60) // MINUTES
                    // the remainder is the number of seconds
                    // difference % 60 // SECONDS
                ];

                // formatting (0 padding and concatenation)
                // result = result.map(function (v) {
                //     return v < 10 ? '0' + v : v;
                // }).join(':');
                result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                dom.table.myHourDiff = result <= 1 ? 1 : result >= 8 ? 8 : result;
            }
        }

        // 加班，規則
        $scope.getHourDiffByTime = function (start, end, type) {
            console.log("- MyWorkHourTableAddHourModalCtrl, start= " + start + ", end= " + end + ", type= " + type);
            if (start && end) {
                var difference = Math.abs(TimeUtil.toSeconds(start) - TimeUtil.toSeconds(end));
                // compute hours, minutes and seconds
                var result = [
                    // an hour has 3600 seconds so we have to compute how often 3600 fits
                    // into the total number of seconds
                    Math.floor(difference / 3600), // HOURS
                    // similar for minutes, but we have to "remove" the hours first;
                    // this is easy with the modulus operator
                    Math.floor((difference % 3600) / 60) // MINUTES
                    // the remainder is the number of seconds
                    // difference % 60 // SECONDS
                ];

                // formatting (0 padding and concatenation)
                // result = result.map(function (v) {
                //     return v < 10 ? '0' + v : v;
                // }).join(':');
                result = result[0] + (result[1] < 30 ? 0 : result[1] === 0 ? 0 : 0.5);
                return result; // 『每30分鐘足分，計0.5，無加班上限制』
            }
        }

        // 分鐘數
        $scope.showWorkOverMin = function (workOverOn, workOverOff, type) {
            var workOnHour;
            var workOnMin;
            var workOffHour;
            var workOffMin;
            if (workOverOn && workOverOff) {
                // console.log("A " + datas[index].time);
                workOnHour = parseInt(workOverOn.substr(0,2));
                workOnMin = parseInt(workOverOn.substr(3,5));
                // console.log("AA " + workOnHour + ":" + workOnMin);

                // console.log("B " + datas[index].time);
                workOffHour = parseInt(workOverOff.substr(0,2));
                workOffMin = parseInt(workOverOff.substr(3,5));
                // console.log("BB " + workOffHour + ":" + workOffMin);

                if ((workOnHour && workOffHour) || (workOnHour == 0 && workOffHour) || (workOnHour == 0 && workOffHour == 0)) {
                    // console.log("C " + workOnHour + ":" + workOnMin);
                    // console.log("D " + workOffHour + ":" + workOffMin);
                    var min = ((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin))
                    return min;
                }
            }
        }

        // **************** time section ********************
        $scope.saveWorkAddItem = function (button) {
            var result = $scope.showTotalAddHour($scope.workAddTablesItems, 1) +
                $scope.showTotalAddHour($scope.workAddTablesItems, 2);
            if (isNaN(result)) {
                toastr.error('加班單格式錯誤，請檢查', '錯誤');
                return;
            }

            button.currentTarget.innerText = "saving...";
            $scope.table.totalHourTemp = result;
            var data = {
                table: $scope.table,
                workAddTablesItems: $scope.workAddTablesItems,
                // oldTables: workAddTableIDArray,
            };
            $uibModalInstance.close(data);
        };
    }

})();