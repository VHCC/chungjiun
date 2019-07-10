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
                '$cookies',
                '$uibModalInstance',
                'TimeUtil',
                'WorkHourAddItemUtil',
                MyWorkHourTableAddHourModalCtrl
            ]);

    /** @ngInject */
    function MyWorkHourTableAddHourModalCtrl($scope,
                                             cookies,
                                             $uibModalInstance,
                                             TimeUtil,
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

        console.log($scope.table);

        var formData = {
            creatorDID: $scope.table.creatorDID,
            prjDID: $scope.table.prjDID,
            create_formDate: $scope.table.create_formDate,
            day: $scope.day,
        }
        console.log(formData);
        // console.log($scope.table);
        var workAddTableIDArray = [];
        WorkHourAddItemUtil.getWorkHourAddItems(formData)
            .success(function (res) {
                console.log(res.payload);
                $scope.workAddTablesItems = res.payload;
                workAddTableIDArray = [];
                // 組成 prjID Array, TableID Array，再去Server要資料
                for (var index = 0; index < res.payload.length; index++) {
                    workAddTableIDArray[index] = res.payload[index]._id;
                }
                // console.log(workAddTableIDArray);
            })
            .error(function () {
                console.log('ERROR  WorkHourAddItemUtil.getWorkHourAddItems')
            })

        $scope.addWorkAddItem = function () {
            var inserted = {
                creatorDID: $scope.userDID,
                workAddType: 1,
                create_formDate: $scope.table.create_formDate,
                prjDID: $scope.table.prjDID,
                year: (new Date($scope.table.create_formDate).getFullYear() -1911),
                month: (new Date($scope.table.create_formDate).getMonth() + 1),
                day: $scope.day,
                start_time: "",
                end_time: "",
                reason: "事由",
                userMonthSalary: $scope.userMonthSalary,
                // userHourSalary: $scope.userHourSalary,
            };
            $scope.workAddTablesItems.push(inserted);
        }

        $scope.removeWorkAddItem = function (index) {
            $scope.workAddTablesItems.splice(index, 1);
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
            // console.log(workOverOn);
            // console.log(workOverOff);
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
            button.currentTarget.innerText = "saving...";
            $scope.table.totalHourTemp = $scope.showTotalAddHour($scope.workAddTablesItems, 1) + $scope.showTotalAddHour($scope.workAddTablesItems, 2);
            var data = {
                table: $scope.table,
                formTables: $scope.workAddTablesItems,
                oldTables: workAddTableIDArray,
            };
            $uibModalInstance.close(data);
        };
    }

})();