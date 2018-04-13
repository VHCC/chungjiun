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
                'WorkHourAddItemUtil',
                MyWorkHourTableAddHourModalCtrl
            ]);

    /** @ngInject */
    function MyWorkHourTableAddHourModalCtrl($scope,
                                             cookies,
                                             $uibModalInstance,
                                             WorkHourAddItemUtil) {
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.table = $scope.$resolve.table;
        $scope.searchType = $scope.$resolve.searchType;
        $scope.userHourSalary = $scope.$resolve.userHourSalary;

        // initial
        $scope.username = cookies.get('username');
        $scope.userDID = cookies.get('userDID');
        $scope.roleType = cookies.get('roletype');

        // 主要顯示
        $scope.workAddTablesItems = [];

        var formData = {
            creatorDID: $scope.userDID,
            create_formDate: $scope.table.create_formDate,
            day: $scope.searchType,
        }
        var workAddTableIDArray = [];
        WorkHourAddItemUtil.getWorkHourItems(formData)
            .success(function (res) {
                $scope.workAddTablesItems = res.payload;
                workAddTableIDArray = [];
                // 組成 prjID Array, TableID Array，再去Server要資料
                for (var index = 0; index < res.payload.length; index++) {
                    workAddTableIDArray[index] = res.payload[index]._id;
                }
                console.log(workAddTableIDArray);
            })
            .error(function () {
                console.log('ERROR  WorkHourAddItemUtil.getWorkHourItem')
            })

        $scope.addWorkAddItem = function () {
            var inserted = {
                creatorDID: $scope.userDID,
                workAddType: -1,
                create_formDate: $scope.table.create_formDate,
                prjDID: $scope.table.prjDID,
                month: (new Date($scope.table.create_formDate).getMonth() +1),
                day: $scope.searchType,
                start_time: "",
                end_time: "",
                reason: "事由",
                userHourSalary: $scope.userHourSalary,
            };
            $scope.workAddTablesItems.push(inserted);
        }

        $scope.setWorkAddType = function(table, type) {
            table.workAddType = type;
        }

        $scope.showTotalAddHour = function(tables) {
            var result = 0;
            for (var index = 0; index < tables.length; index++) {
                result += $scope.getHourDiffByTime(tables[index].start_time, tables[index].end_time)
            }
            $scope.table.totalHourTemp = result;
            return result;
        }

        // **************** time section ********************
        // time calculate
        $scope.getHourDiff = function (dom) {
            if (dom.tableTimeStart && dom.tableTimeEnd) {
                var difference = Math.abs(toSeconds(dom.tableTimeStart) - toSeconds(dom.tableTimeEnd));
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
                result = result[0] + (result[1] > 0 ? 0.5 : 0);
                dom.table.myHourDiff = result;
            }
        }

        $scope.getHourDiffByTime = function (start, end) {
            if (start && end) {
                var difference = Math.abs(toSeconds(start) - toSeconds(end));
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
                result = result[0] + (result[1] > 0 ? 0.5 : 0);
                return result;
            }
        }
        function toSeconds(time_str) {
            // Extract hours, minutes and seconds
            var parts = time_str.split(':');
            // compute  and return total seconds
            return parts[0] * 3600 +  // an hour has 3600 seconds
                parts[1] * 60         // a minute has 60 seconds
            // +parts[2];         // seconds
        }

        // **************** time section ********************


        $scope.saveWorkAddItem = function (button) {
            button.currentTarget.innerText = "saving...";
            var formData = {
                formTables: $scope.workAddTablesItems,
                oldTables: workAddTableIDArray,
            }

            WorkHourAddItemUtil.createWorkHourAddItem(formData)
                .success(function (res) {

                })
                .error(function () {
                    console.log('ERROR WorkHourAddItemUtil.createWorkHourAddItem')
                })

            $uibModalInstance.close($scope.table);
        };
    }

})();