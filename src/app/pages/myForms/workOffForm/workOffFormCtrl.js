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
                    'NationalHolidayUtil',
                    'toastr',
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
                                 NationalHolidayUtil,
                                 toastr,
                                 HolidayDataForms) {


            $scope.username = cookies.get('username');
            $scope.userDID = cookies.get('userDID');
            $scope.roleType = cookies.get('roletype');

            var formData = {
                userDID: cookies.get('userDID'),
            }
            User.findUserByUserDID(formData)
                .success(function (user) {
                    // $scope.userHourSalary = user.userHourSalary;
                    $scope.userMonthSalary = user.userMonthSalary;
                    $scope.bossID = user.bossID;
                })

            Project.findAll()
                .success(function (allProjects) {
                    // console.log(allProjects);
                    vm.projects = allProjects;
                });

            $scope.initUser = function () {
                User.getAllUsers()
                    .success(function (allUsers) {
                        vm.users = allUsers;
                        if ($scope.roleType === '100') {
                            vm.executiveUsers = [];
                            WorkOffFormUtil.fetchAllExecutiveItem()
                                .success(function (res) {
                                    for (var outIndex = 0; outIndex < res.payload.length; outIndex++) {
                                        // console.log(res.payload[outIndex]);
                                        for (var index = 0; index < allUsers.length; index++) {
                                            if (res.payload[outIndex]._id === allUsers[index]._id) {
                                                allUsers[index].excutive_count = res.payload[outIndex].count;
                                                vm.executiveUsers.push(allUsers[index]);
                                            }
                                        }
                                    }
                                })
                        }

                        if ($scope.roleType === '2') {
                            var underling = []
                            for (var x = 0; x < allUsers.length; x++) {
                                if (allUsers[x].bossID === cookies.get('userDID')) {
                                    underling.push(allUsers[x]._id)
                                }
                            }
                            var formData = {
                                underlingArray: underling,
                            }
                            vm.bossUsers = [];
                            WorkOffFormUtil.fetchAllBossItem(formData)
                                .success(function (res) {
                                    for (var outIndex = 0; outIndex < res.payload.length; outIndex++) {
                                        // console.log(res.payload[outIndex]);
                                        for (var index = 0; index < allUsers.length; index++) {
                                            if (res.payload[outIndex]._id === allUsers[index]._id) {
                                                allUsers[index].boss_count = res.payload[outIndex].count;
                                                vm.bossUsers.push(allUsers[index]);
                                            }
                                        }
                                    }
                                })
                        }
                    });
            }

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
            $scope.specificUserTablesItems = [];

            var vm = this;
            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;
            $scope.year = thisYear;
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
            $scope.getWorkOffTable = function (userDID) {
                $scope.specificUserTablesItems = [];
                var getData = {
                    creatorDID: userDID === undefined ? $scope.userDID : userDID,
                    year: thisYear,
                    month: thisMonth,
                }
                // console.log($scope.firstFullDate);
                WorkOffFormUtil.fetchUserWorkOffForm(getData)
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
                            // 取得 Table Data
                            WorkOffFormUtil.findWorkOffTableFormByTableIDArray(formDataTable)
                                .success(function (res) {

                                    // 填入表單資訊
                                    $scope.tableData = {};
                                    for (var index = 0; index < res.payload.length; index++) {
                                        var detail = {
                                            tableID: res.payload[index]._id,

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
                                            userMonthSalary: res.payload[index].userMonthSalary,
                                            // userHourSalary: res.payload[index].userHourSalary,
                                        };
                                        $scope.specificUserTablesItems.push(detail);
                                    }
                                    // console.log(workOffTableIDArray);
                                    console.log($scope.specificUserTablesItems);
                                })
                                .error(function () {
                                    console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByTableIDArray');
                                })

                        } else {
                            $scope.loading = false;
                        }
                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.fetchUserWorkOffForm');
                    })
            }

            $scope.showWorkOffCount = function(workOffType) {
                var index = 0;
                var result = 0;
                switch (workOffType) {
                    // 事
                    case 0: {
                        for (index = 0; index < $scope.specificUserTablesItems.length; index ++) {
                            if ($scope.specificUserTablesItems[index].workOffType === workOffType) {
                                result += $scope.getHourDiffByTime($scope.specificUserTablesItems[index].start_time
                                    , $scope.specificUserTablesItems[index].end_time);
                            }
                        }
                        return result;
                    }
                    // 病
                    case 1: {
                        for (index = 0; index < $scope.specificUserTablesItems.length; index ++) {
                            if ($scope.specificUserTablesItems[index].workOffType === workOffType) {
                                result += $scope.getHourDiffByTime($scope.specificUserTablesItems[index].start_time
                                    , $scope.specificUserTablesItems[index].end_time);
                            }
                        }
                        return result;
                    }
                    // 補
                    case 2: {
                        for (index = 0; index < $scope.specificUserTablesItems.length; index ++) {
                            if ($scope.specificUserTablesItems[index].workOffType === workOffType) {
                                result += $scope.getHourDiffByTime($scope.specificUserTablesItems[index].start_time
                                    , $scope.specificUserTablesItems[index].end_time);
                            }
                        }
                        return result;
                    }
                    // 特
                    case 3: {
                        for (index = 0; index < $scope.specificUserTablesItems.length; index ++) {
                            if ($scope.specificUserTablesItems[index].workOffType === workOffType) {
                                result += $scope.getHourDiffByTime($scope.specificUserTablesItems[index].start_time
                                    , $scope.specificUserTablesItems[index].end_time);
                            }
                        }
                        return result;
                    }
                }
            }

            // 預設日期
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
                    // userHourSalary: $scope.userHourSalary,
                    userMonthSalary: $scope.userMonthSalary,
                };
                $scope.specificUserTablesItems.push(inserted);

                $scope.createSubmit(0);
            }

            $scope.removeHolidayItem = function (index) {
                // console.log(index)
                $scope.specificUserTablesItems.splice(index, 1);
                console.log('removeHolidayItem, Index= ' + index);
                $scope.createSubmit(0);
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
                dom.$parent.table.workOffType = dom.workOffType.type;
            }

            // 休假規則
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
                    result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                    dom.table.myHourDiff = result <= 1 ? 1 : result >= 8 ? 8 : result;
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
                    result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                    return result <= 1 ? 1 : result >= 8 ? 8 : result;
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
            $scope.reviewWorkOffTable = function (table, button, index) {
                $scope.createSubmit(0);
                $timeout(function () {
                    // console.log(table)
                    // console.log($scope.specificUserTablesItems[index]);
                    $scope.checkText = '確定提交 休假：' +
                        DateUtil.getShiftDatefromFirstDate(
                            DateUtil.getFirstDayofThisWeek(moment($scope.specificUserTablesItems[index].create_formDate)),
                            $scope.specificUserTablesItems[index].day === 0 ? 6 : $scope.specificUserTablesItems[index].day - 1) +
                        "  審查？";
                    $scope.checkingTable = $scope.specificUserTablesItems[index];
                    $scope.checkingButton = button;
                    $scope.checkingIndex = index;
                    ngDialog.open({
                        template: 'app/pages/myModalTemplate/myWorkOffTableFormReviewModal.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: false,
                    });
                }, 150)

            }

            $scope.sendWorkOffTable = function (checkingTable, checkingButton, checkingIndex) {
                // console.log(checkingTable);
                checkingButton.rowform1.$waiting = true;
                var formData = {
                    tableID: checkingTable.tableID,
                }
                WorkOffFormUtil.updateWorkOffTableSendReview(formData)
                    .success(function (res) {
                        $scope.specificUserTablesItems[checkingIndex].isSendReview = true;
                        console.log(res.code + ", sendWorkOffTable");
                    })
            }

            //行政確認
            $scope.reviewExecutiveItem = function (table, index) {
                $scope.checkText = '確定 同意：' + vm.executive.selected.name + " " +
                    DateUtil.getShiftDatefromFirstDate(
                        DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                        table.day === 0 ? 6 : table.day - 1) +
                    "  ？";
                $scope.checkingTable = table;
                $scope.mIndex = index;
                ngDialog.open({
                    template: 'app/pages/myModalTemplate/myWorkOffTableFormExecutiveAgreeModal.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: false,
                });
            }

            $scope.sendExecutiveAgree = function (checkingTable, index) {
                $scope.executiveCheckTablesItems.splice(index, 1);
                var formData = {
                    tableID: checkingTable.tableID,
                }
                WorkOffFormUtil.updateExecutiveAgree(formData)
                    .success(function (res) {
                        console.log(res.code + ", sendExecutiveAgree");
                    })
            }

            //行政退回
            $scope.disagreeItem_executive = function (table, index) {
                $scope.checkText = '確定 退回：' + vm.executive.selected.name + " " +
                    DateUtil.getShiftDatefromFirstDate(
                        DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                        table.day === 0 ? 6 : table.day - 1) +
                    "  ？";
                $scope.checkingTable = table;
                $scope.mIndex = index;
                ngDialog.open({
                    template: 'app/pages/myModalTemplate/myWorkOffTableFormDisAgree_ExecutiveModal.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: false,
                });
            }

            $scope.sendDisagree_executive = function (checkingTable, index) {
                $scope.executiveCheckTablesItems.splice(index, 1);
                var formData = {
                    tableID: checkingTable.tableID,
                }
                WorkOffFormUtil.updateDisAgree(formData)
                    .success(function (res) {
                        console.log(res.code + ", sendDisagree_executive");
                    })
            }

            //主管確認
            $scope.reviewBossItem = function (table, index) {
                $scope.checkText = '確定 同意：' + vm.boss.selected.name + " " +
                    DateUtil.getShiftDatefromFirstDate(
                        DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                        table.day === 0 ? 6 : table.day - 1) +
                    "  ？";
                $scope.checkingTable = table;
                $scope.mIndex = index;
                ngDialog.open({
                    template: 'app/pages/myModalTemplate/myWorkOffTableFormBossAgreeModal.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: false,
                });
            }

            $scope.sendBossAgree = function (checkingTable, index) {
                $scope.bossCheckTablesItems.splice(index, 1);
                var formData = {
                    tableID: checkingTable.tableID,
                }
                WorkOffFormUtil.updateBossAgree(formData)
                    .success(function (res) {
                        console.log(res.code + ", sendBossAgree");
                    })
            }

            //主管退回
            $scope.disagreeItem_boss = function (table, index) {
                $scope.checkText = '確定 退回：' + vm.boss.selected.name + " " +
                    DateUtil.getShiftDatefromFirstDate(
                        DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                        table.day === 0 ? 6 : table.day - 1) +
                    "  ？";
                $scope.checkingTable = table;
                $scope.mIndex = index;
                ngDialog.open({
                    template: 'app/pages/myModalTemplate/myWorkOffTableFormDisAgree_BossModal.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: false,
                });
            }

            $scope.sendDisagree_boss = function (checkingTable, index) {
                $scope.bossCheckTablesItems.splice(index, 1);
                var formData = {
                    tableID: checkingTable.tableID,
                }
                WorkOffFormUtil.updateDisAgree(formData)
                    .success(function (res) {
                        console.log(res.code + ", sendDisagree_boss");
                    })
            }


            var formDataTable = {};

            // Create Form
            $scope.createSubmit = function (time) {
                return $timeout(function () {
                    var workOffTableData = [];

                    for (var index = 0; index < $scope.specificUserTablesItems.length; index++) {
                        var tableItem = $scope.specificUserTablesItems[index];

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
                            // userHourSalary: tableItem.userHourSalary,
                            userMonthSalary: tableItem.userMonthSalary,
                        }
                        workOffTableData.push(dataItem);
                    }
                    // console.log(formDataTable);
                    var formData = {
                        creatorDID: $scope.userDID,
                        year: thisYear,
                        month: thisMonth,
                        formTables: workOffTableData,
                        oldTables: formDataTable,
                    }
                    WorkOffFormUtil.createWorkOffTableForm(formData)
                        .success(function (res) {
                            // 更新old Table ID Array
                            var workOffTableIDArray = [];
                            if (res.payload.length > 0) {
                                for (var index = 0; index < res.payload.length; index++) {
                                    // console.log(res.payload[index]);
                                    workOffTableIDArray[index] = res.payload[index].tableID;
                                    // $scope.specificUserTablesItems[index] = res.payload[index];
                                    $scope.specificUserTablesItems[index].tableID = res.payload[index].tableID;
                                }
                            }
                            formDataTable = {
                                tableIDArray: workOffTableIDArray,
                            };
                            // console.log($scope.specificUserTablesItems);
                        })
                        .error(function () {
                            console.log('ERROR WorkOffFormUtil.createWorkOffTableForm');
                        })

                }, time);
            }

            // ***********************  主管審核 ************************

            $scope.findWorkOffItemByUserDID_boss = function () {
                var formData = {
                    year: thisYear,
                    creatorDID: vm.boss.selected._id
                };
                $scope.bossCheckTablesItems = [];
                WorkOffFormUtil.findWorkOffTableItemByUserDID_boss(formData)
                    .success(function (res) {
                        for (var index = 0; index < res.payload.length; index++) {
                            var detail = {
                                tableID: res.payload[index]._id,

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
                                // userHourSalary: res.payload[index].userHourSalary,
                                userMonthSalary: res.payload[index].userMonthSalary,
                            };
                            $scope.bossCheckTablesItems.push(detail);
                        }
                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.findWorkOffTableItemByUserDID');
                    })
            }

            // ***********************  行政確認 ************************

            $scope.findWorkOffItemByUserDID_executive = function () {
                var formData = {
                    year: thisYear,
                    creatorDID: vm.executive.selected._id
                };
                $scope.executiveCheckTablesItems = [];
                WorkOffFormUtil.findWorkOffTableItemByUserDID_executive(formData)
                    .success(function (res) {
                        for (var index = 0; index < res.payload.length; index++) {
                            var detail = {
                                tableID: res.payload[index]._id,

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
                                // userHourSalary: res.payload[index].userHourSalary,
                                userMonthSalary: res.payload[index].userMonthSalary,
                            };
                            $scope.executiveCheckTablesItems.push(detail);
                        }
                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.findWorkOffTableItemByUserDID');
                    })
            }

            // ***********************  update holiday Data ************************
            $scope.updateUserHolidayData = function () {
                var formData = vm.holidayForm;
                HolidayDataForms.updateFormByFormDID(formData)
                    .success(function (res) {
                        // console.log(res.code);
                        toastr['success']('成功', '更新成功');
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

            // ***********************  國定假日設定 ************************

            // 主要顯示
            $scope.nationalHolidayTablesItems = [];

            $scope.fetchNationHolidays = function () {
                var formData = {
                    year: thisYear,
                };

                $scope.nationalHolidayTablesItems = [];
                var getData = {
                    year: thisYear,
                }
                NationalHolidayUtil.fetchAllNationalHolidays(getData)
                    .success(function (res) {
                        // console.log(res.payload);
                        if (res.payload.length > 0) {
                            // 取得 Table Data
                            for (var index = 0; index < res.payload.length; index++) {
                                var detail = {
                                    tableID: res.payload[index]._id,

                                    create_formDate: res.payload[index].create_formDate,
                                    year: res.payload[index].year,
                                    month: res.payload[index].month,
                                    day: res.payload[index].day,
                                    isEnable: res.payload[index].isEnable,
                                };
                                $scope.nationalHolidayTablesItems.push(detail);
                            }
                        }
                    })
                    .error(function () {
                        console.log('ERROR NationalHolidayUtil.fetchAllNationalHolidays');
                    })
            }

            $scope.addNationalHolidayItem = function () {
                var inserted = {
                    create_formDate: $scope.firstFullDate,
                    year: thisYear,
                    month: thisMonth,
                    day: thisDay,
                    //RIGHT
                    myDay: DateUtil.getDay(new Date().getDay()),
                };
                $scope.createNationalHolidaysTable(inserted);
            }

            $scope.createNationalHolidaysTable = function (table) {
                return $timeout(function () {
                    var formData = {
                        create_formDate: table.create_formDate,
                        year: table.year,
                        month: table.month,
                        day: table.day,
                    }
                    NationalHolidayUtil.createNationalHoliday(formData)
                        .success(function (res) {
                            $scope.fetchNationHolidays();
                            console.log(res.code + ", createNationalHoliday");
                        })
                        .error(function () {
                            console.log('ERROR NationalHolidayUtil.createNationalHoliday');
                        })
                }, 300);
            }

            $scope.saveNationalHoliday = function (checkingTable, checkingButton) {
                var formData = {
                    tableID: checkingTable.tableID,
                    create_formDate: checkingTable.create_formDate,
                    year: checkingTable.year,
                    month: checkingTable.month,
                    day: checkingTable.day,
                }
                NationalHolidayUtil.updateNationalHoliday(formData)
                    .success(function (res) {
                        checkingTable.isEnable = true;
                    })
            }

            $scope.removeNationalHoliday = function (table) {
                var formData = {
                    tableID: table.tableID,
                }
                NationalHolidayUtil.removeNationalHoliday(formData)
                    .success(function (res) {
                        $scope.fetchNationHolidays();
                    })
            }

        } // End of function
    }

)();


