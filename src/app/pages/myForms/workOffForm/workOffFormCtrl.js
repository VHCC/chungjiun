/**
 * @author Ichen.chu
 * created on 14.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('workOffFormCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$timeout',
                'ngDialog',
                'Project',
                'User',
                'DateUtil',
                'WorkOffTypeUtil',
                'WorkOffFormUtil',
                'HolidayDataForms',
                WorkOffFormCtrl
            ]);

    /** @ngInject */
    function WorkOffFormCtrl($scope,
                             $filter,
                             cookies,
                             $timeout,
                             ngDialog,
                             Project,
                             User,
                             DateUtil,
                             WorkOffTypeUtil,
                             WorkOffFormUtil,
                             HolidayDataForms) {


        $scope.username = cookies.get('username');
        $scope.userDID = cookies.get('userDID');
        $scope.roleType = cookies.get('roletype');

        var formData = {
            userDID: cookies.get('userDID'),
        }
        User.findUserByUserDID(formData)
            .success(function (user) {
                $scope.userHourSalary = user.userHourSalary;
                $scope.bossID = user.bossID;
            })

        Project.findAll()
            .success(function (allProjects) {
                // console.log(allProjects);
                vm.projects = allProjects;
            });

        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
            });

        User.findManagers()
            .success(function (allManagers) {
                $scope.projectManagers = [];
                for (var i = 0; i < allManagers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allManagers[i]._id,
                        name: allManagers[i].name
                    };
                }
            });

        // 主要顯示
        $scope.loginUserTablesItems = [];

        var vm = this;
        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;
        $scope.month = thisMonth;
        var thisDay = new Date().getDay();
        // ***********************  個人填寫 ************************

        $scope.getUserHolidayForm = function () {
            var formData = {
                year: thisYear,
                creatorDID: $scope.userDID,
            };
            HolidayDataForms.findFormByUserDID(formData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        vm.loginUserHolidayForm = res.payload[0];
                    } else {
                        HolidayDataForms.createForms(formData)
                            .success(function (res) {
                                vm.loginUserHolidayForm = res.payload;
                            })
                    }
                })
        }

        //取得使用者個人休假表，userDID, 一年的 一個月 只有一張休假表
        $scope.getWorkOffTable = function () {
            $scope.loginUserTablesItems = [];
            var getData = {
                creatorDID: $scope.userDID,
                year: thisYear,
                month: thisMonth,
            }
            // console.log($scope.firstFullDate);
            WorkOffFormUtil.getWorkOffForm(getData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        var workItemCount = res.payload[0].formTables.length;

                        var workOffTableIDArray = [];
                        // 組成 TableID Array，再去Server要資料
                        for (var index = 0; index < workItemCount; index++) {
                            workOffTableIDArray[index] = res.payload[0].formTables[index].tableID;
                        }

                        formDataTable = {
                            tableIDArray: workOffTableIDArray,
                        }
                        // console.log(formDataTable);
                        // 取得 Table Data
                        WorkOffFormUtil.findWorkOffTableFormByTableIDArray(formDataTable)
                            .success(function (res) {

                                // 填入表單資訊
                                $scope.tableData = {};
                                for (var index = 0; index < res.payload.length; index++) {
                                    var detail = {
                                        tableID: workOffTableIDArray[index],

                                        workOffType: res.payload[index].workOffType,
                                        create_formDate: res.payload[index].create_formDate,
                                        year: res.payload[index].year,
                                        month: res.payload[index].month,
                                        day: res.payload[index].day,
                                        start_time: res.payload[index].start_time,
                                        end_time: res.payload[index].end_time,

                                        //RIGHT
                                        isSendReview: res.payload[index].isSendReview,
                                        isBossCheck: res.payload[index].isBossCheck,
                                        isExecutiveCheck: res.payload[index].isExecutiveCheck,
                                        userHourSalary: res.payload[index].userHourSalary,
                                    };
                                    $scope.loginUserTablesItems.push(detail);

                                }
                                // console.log($scope.loginUserTablesItems);
                            })
                            .error(function () {
                                console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByTableIDArray');
                            })

                    } else {
                        $scope.loading = false;
                    }
                })
                .error(function () {
                    console.log('ERROR WorkOffFormUtil.getWorkOffForm');
                })
        }

        $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);

        $scope.addHolidayItem = function () {
            var inserted = {
                creatorDID: $scope.userDID,
                workOffType: -1,
                create_formDate: $scope.firstFullDate,
                year: thisYear,
                month: thisMonth,
                day: thisDay,
                start_time: "",
                end_time: "",
                //RIGHT
                isSendReview: false,
                isBossCheck: false,
                isExecutiveCheck: false,
                myDay: DateUtil.getDay(new Date().getDay()),
                userHourSalary: $scope.userHourSalary,
            };
            $scope.loginUserTablesItems.push(inserted);

            $timeout(function () {
                $('button[id="btnCreate"]')[0].click();
            }, 10);
        }

        $scope.removeHolidayItem = function (index) {
            // console.log(index)
            $scope.loginUserTablesItems.splice(index, 1);
            console.log('removeHolidayItem, Index= ' + index);
            $timeout(function () {
                $('button[id="btnCreate"]')[0].click();
            }, 10);
        };

        $scope.showDate = function (table) {
            return DateUtil.getShiftDatefromFirstDate(
                DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                table.day === 0 ? 6 : table.day - 1);

        }

        $scope.showDay = function (day) {
            return DateUtil.getDay(day)
        }

        $scope.showBoss = function (bossID) {
            var selected = [];
            if (bossID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: bossID
                });
            }

            return selected.length ? selected[0].name : 'Not Set';
        };

        $scope.changeTableDay = function (dom) {
            dom.table.create_formDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(dom.myDT)), 0);
            dom.table.year = dom.myDT.getFullYear() - 1911;
            dom.table.month = dom.myDT.getMonth() + 1;
            dom.table.day = dom.myDT.getDay();
        }

        $scope.showWorkOffTypeString = function (type) {
            return WorkOffTypeUtil.getWorkOffString(type);
        }

        $scope.changeWorkOffType = function (dom) {
            console.log(dom);
            console.log(dom.workOffType);
            dom.$parent.table.workOffType = dom.workOffType.type;
        }

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

        // Send WorkOffTable to Review
        $scope.reviewWorkOffTable = function (table, button) {
            $scope.createSubmit(0);
            // console.log(table)
            $scope.checkText = '確定提交 休假：' +
                DateUtil.getShiftDatefromFirstDate(
                    DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                    table.day === 0 ? 6 : table.day - 1) +
                "  審查？";
            $scope.checkingTable = table;
            $scope.checkingButton = button;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkOffTableFormReviewModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendWorkOffTable = function (checkingTable, checkingButton) {
            // console.log(checkingTable);
            checkingButton.rowform1.$waiting = true;
            var formData = {
                tableID: checkingTable.tableID,
            }
            WorkOffFormUtil.updateWorkOffTableSendReview(formData)
                .success(function (res) {
                    console.log(res.code);
                })
        }

        var formDataTable = {};

        // Create Form
        $scope.createSubmit = function (time) {
            return $timeout(function () {
                var workOffTableData = [];

                for (var index = 0; index < $scope.loginUserTablesItems.length; index ++) {
                    var tableItem = $scope.loginUserTablesItems[index];

                    var dataItem = {
                        creatorDID: $scope.userDID,

                        workOffType: tableItem.workOffType,
                        create_formDate: tableItem.create_formDate,
                        year: tableItem.year,
                        month: tableItem.month,
                        day: tableItem.day,
                        start_time: tableItem.start_time,
                        end_time: tableItem.end_time,

                        //RIGHT
                        isSendReview: tableItem.isSendReview,
                        isBossCheck: tableItem.isBossCheck,
                        isExecutiveCheck: tableItem.isExecutiveCheck,
                        userHourSalary: tableItem.userHourSalary,

                    }

                    workOffTableData.push(dataItem);
                }

                console.log(formDataTable);

                var formData = {
                    creatorDID: $scope.userDID,
                    year: thisYear,
                    month: thisMonth,
                    formTables: workOffTableData,
                    oldTables: formDataTable,
                }

                WorkOffFormUtil.createWrokOffTableForm(formData)
                    .success(function (res) {
                        // 更新old Table ID Array
                        var workOffTableIDArray = [];
                        if (res.payload.length > 0) {
                            for (var index = 0; index < res.payload.length; index++) {
                                // console.log(res.payload[index]);
                                workOffTableIDArray[index] = res.payload[index].tableID;
                                $scope.loginUserTablesItems[index].tableID = res.payload[index].tableID;
                            }
                        }
                        formDataTable = {
                            tableIDArray: workOffTableIDArray,
                        };

                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.createWrokOffTableForm');
                    })

            }, time);
        }

        // ***********************  行政確認 ************************

        // ***********************  update holiday Data ************************
        $scope.updateUserHolidayData = function () {
            var formData = vm.holidayForm;
            HolidayDataForms.updateFormByFormDID(formData)
                .success(function (res) {
                    // console.log(res.code);
                })
        }

        // -------------find form ----------------------
        $scope.findHolidayFormByUserDID = function () {
            var formData = {
                year: thisYear,
                creatorDID: vm.user.selected._id
            };
            HolidayDataForms.findFormByUserDID(formData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        vm.holidayForm = res.payload[0];
                    } else {
                        HolidayDataForms.createForms(formData)
                            .success(function (res) {
                                vm.holidayForm = res.payload;
                            })
                    }
                })
        }

        // --------------- calculator ----------------
        $scope.total = function (a, b) {
            return parseInt(a) + parseInt(b);
        }

        // --------------- document ready -----------------

        $(document).ready(function () {
            $('.workOffFormNumberInput').mask('00.Z', {
                translation: {
                    'Z': {
                        pattern: /[05]/,
                    }
                }
            });
            $('.workOffFormDateInput').mask('100/M0/D0', {
                translation: {
                    'M': {
                        pattern: /[01]/,
                    },
                    'D': {
                        pattern: /[0123]/,
                    }
                }
            });

        });
    }
})();


