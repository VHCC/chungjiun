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
                    'TimeUtil',
                    'WorkOffTypeUtil',
                    'WorkOffFormUtil',
                    'NationalHolidayUtil',
                    'OverTimeDayUtil',
                    'WorkHourAddItemUtil',
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
                                 TimeUtil,
                                 WorkOffTypeUtil,
                                 WorkOffFormUtil,
                                 NationalHolidayUtil,
                                 OverTimeDayUtil,
                                 WorkHourAddItemUtil,
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

            // 主管審核、行政確認
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
                            vm.loginUserHolidayForm.calculate_sick = $scope.showWorkOffCount(1);
                            vm.loginUserHolidayForm.calculate_private = $scope.showWorkOffCount(0);
                            vm.loginUserHolidayForm.calculate_observed = $scope.showWorkOffCount(2);
                            vm.loginUserHolidayForm.calculate_special = $scope.showWorkOffCount(3);
                            vm.loginUserHolidayForm.calculate_married = $scope.showWorkOffCount(4);
                            vm.loginUserHolidayForm.calculate_mourning = $scope.showWorkOffCount(5);
                            vm.loginUserHolidayForm.calculate_official = $scope.showWorkOffCount(6);
                            vm.loginUserHolidayForm.calculate_workinjury = $scope.showWorkOffCount(7);
                            vm.loginUserHolidayForm.calculate_maternity = $scope.showWorkOffCount(8);
                            vm.loginUserHolidayForm.calculate_paternity = $scope.showWorkOffCount(9);

                        } else {
                            HolidayDataForms.createForms(formData)
                                .success(function (res) {
                                    vm.loginUserHolidayForm = res.payload;
                                })
                        }
                        fetchWorkOffTableData($scope.userDID, 1);
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

                                            // Reject
                                            isBossReject: res.payload[index].isBossReject,
                                            bossReject_memo: res.payload[index].bossReject_memo,

                                            isExecutiveReject: res.payload[index].isExecutiveReject,
                                            executiveReject_memo: res.payload[index].executiveReject_memo,

                                            userMonthSalary: res.payload[index].userMonthSalary,
                                            // userHourSalary: res.payload[index].userHourSalary,
                                        };
                                        $scope.specificUserTablesItems.push(detail);
                                    }
                                    console.log($scope.specificUserTablesItems);
                                    if (userDID !== undefined) {
                                        $scope.findHolidayFormByUserDID(userDID === undefined ? $scope.userDID : userDID);
                                    } else {
                                        $scope.getUserHolidayForm();
                                    }
                                })
                                .error(function () {
                                    console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByTableIDArray');
                                })
                        } else {
                            $scope.loading = false;
                            if (userDID !== undefined) {
                                $scope.findHolidayFormByUserDID(userDID === undefined ? $scope.userDID : userDID);
                            } else {
                                $scope.getUserHolidayForm();
                            }
                        }
                        $('.workOffFormDateInput').mask('20Y0/M0/D0', {
                            translation: {
                                'Y': {
                                    pattern: /[0123]/,
                                },
                                'M': {
                                    pattern: /[01]/,
                                },
                                'D': {
                                    pattern: /[0123]/,
                                }
                            }
                        });
                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.fetchUserWorkOffForm');
                    })
            }

            $scope.showWorkOffCount = function(workOffType) {
                var index = 0;
                var result = 0;
                for (index = 0; index < $scope.specificUserTablesItems.length; index ++) {
                    if ($scope.specificUserTablesItems[index].workOffType === workOffType && $scope.specificUserTablesItems[index].isExecutiveCheck) {
                        result += $scope.getHourDiffByTime($scope.specificUserTablesItems[index].start_time
                            , $scope.specificUserTablesItems[index].end_time);
                    }
                }
                switch (workOffType) {
                    // 事
                    case 0: {
                        return result;
                    }
                    // 病
                    case 1: {
                        return result;
                    }
                    // 補
                    case 2: {
                        return result;
                    }
                    // 特
                    case 3: {
                        return result / 8;
                    }
                    case 4:
                        return result;
                    case 5:
                        return result / 8;
                    case 6:
                        return result;
                    case 7:
                        return result / 8;
                    case 8:
                        return result;
                    case 9:
                        return result;
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

            // 變更休假單日期
            $scope.changeWorkOffItemDay = function (dom) {
                dom.table.create_formDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(dom.myDT)), 0);
                dom.table.year = dom.myDT.getFullYear() - 1911;
                dom.table.month = dom.myDT.getMonth() + 1;
                dom.table.day = dom.myDT.getDay();
            }

            // 顯示假期名
            $scope.showWorkOffTypeString = function (type) {
                return WorkOffTypeUtil.getWorkOffString(type);
            }

            $scope.changeWorkOffType = function (dom) {
                dom.$parent.table.workOffType = dom.workOffType.type;
                dom.$parent.reloadDatePicker(dom.workOffType.type);
            }

            // 休假規則，未滿一小算一小
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

            $scope.getHourDiffByTime = function (start, end) {
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
                    result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                    return result <= 1 ? 1 : result >= 8 ? 8 : result;
                }
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
            //跟後臺溝通
            $scope.sendWorkOffTable = function (checkingTable, checkingButton, checkingIndex) {
                // console.log(checkingTable);
                checkingButton.rowform1.$waiting = true;
                var formData = {
                    tableID: checkingTable.tableID,
                    isSendReview: true,
                }
                // WorkOffFormUtil.updateWorkOffTableSendReview(formData)
                WorkOffFormUtil.updateWorkOffItem(formData)
                    .success(function (res) {
                        $scope.specificUserTablesItems[checkingIndex].isSendReview = true;
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
            //跟後臺溝通
            $scope.sendExecutiveAgree = function (checkingTable, index) {
                var formData = {
                    tableID: checkingTable.tableID,
                    isExecutiveCheck: true,
                }
                // WorkOffFormUtil.updateExecutiveAgree(formData)
                WorkOffFormUtil.updateWorkOffItem(formData)
                    .success(function (res) {
                        $scope.executiveCheckTablesItems.splice(index, 1);
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
            //跟後臺溝通
            $scope.sendDisagree_executive = function (checkingTable, index, rejectMsg) {
                var formData = {
                    tableID: checkingTable.tableID,
                    isSendReview: false,
                    isBossCheck: false,
                    isExecutiveCheck: false,
                    isBossReject: false,
                    isExecutiveReject: true,
                    executiveReject_memo: rejectMsg,
                }
                // WorkOffFormUtil.updateDisAgree(formData)
                WorkOffFormUtil.updateWorkOffItem(formData)
                    .success(function (res) {
                        $scope.executiveCheckTablesItems.splice(index, 1);
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
            //跟後臺溝通
            $scope.sendBossAgree = function (checkingTable, index) {
                var formData = {
                    tableID: checkingTable.tableID,
                    isBossCheck: true,
                }
                // WorkOffFormUtil.updateBossAgree(formData)
                WorkOffFormUtil.updateWorkOffItem(formData)
                    .success(function (res) {
                        $scope.bossCheckTablesItems.splice(index, 1);
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
            //跟後臺溝通
            $scope.sendDisagree_boss = function (checkingTable, index, rejectMsg) {
                var formData = {
                    tableID: checkingTable.tableID,
                    isSendReview: false,
                    isBossCheck: false,
                    isExecutiveCheck: false,
                    isBossReject: true,
                    isExecutiveReject: false,
                    bossReject_memo: rejectMsg,
                }
                // WorkOffFormUtil.updateDisAgree(formData)
                WorkOffFormUtil.updateWorkOffItem(formData)
                    .success(function (res) {
                        // console.log(res.code + ", sendDisagree_boss");
                        $scope.bossCheckTablesItems.splice(index, 1);
                    })
            }

            //主要工作Data
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

            // ***********************  更新假期確認 ************************
            $scope.updateUserHolidayData = function () {
                var formData = vm.holidayForm;
                console.log(vm.holidayForm);
                HolidayDataForms.updateFormByFormDID(formData)
                    .success(function (res) {
                        toastr['success']('成功', '更新成功');
                    })
            }

            // -------------選取 指定人員之 假期確認表 ----------------------
            $scope.findHolidayFormByUserDID = function (userDID) {
                var formData = {
                    year: thisYear,
                    creatorDID: userDID,
                };
                HolidayDataForms.findFormByUserDID(formData)
                    .success(function (res) {
                        if (res.payload.length > 0) {
                            vm.holidayForm = res.payload[0];
                            console.log(vm.holidayForm);
                            vm.holidayForm.calculate_sick = $scope.showWorkOffCount(1);
                            vm.holidayForm.calculate_private = $scope.showWorkOffCount(0);
                            vm.holidayForm.calculate_observed = $scope.showWorkOffCount(2);
                            vm.holidayForm.calculate_special = $scope.showWorkOffCount(3);
                            vm.holidayForm.calculate_married = $scope.showWorkOffCount(4);
                            vm.holidayForm.calculate_mourning = $scope.showWorkOffCount(5);
                            vm.holidayForm.calculate_official = $scope.showWorkOffCount(6);
                            vm.holidayForm.calculate_workinjury = $scope.showWorkOffCount(7);
                            vm.holidayForm.calculate_maternity = $scope.showWorkOffCount(8);
                            vm.holidayForm.calculate_paternity = $scope.showWorkOffCount(9);
                            console.log(vm.holidayForm);
                        } else {
                            HolidayDataForms.createForms(formData)
                                .success(function (res) {
                                    vm.holidayForm = res.payload;
                                })
                        }
                        fetchWorkOffTableData(userDID, 2);
                    })
            }

            // --------------- calculator ----------------
            $scope.total = function (a, b) {
                return parseInt(a) + parseInt(b);
            }

            $scope.diff = function(a, b) {
                return parseInt(a) - parseInt(b);
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

            });

            // ***********************  國定假日設定 ************************

            // 主要顯示
            $scope.nationalHolidayTablesItems = [];

            $scope.fetchNationHolidays = function () {
                var getData = {
                    year: thisYear,
                }
                NationalHolidayUtil.fetchAllNationalHolidays(getData)
                    .success(function (res) {
                        // console.log(res.payload);
                        if (res.payload.length > 0) {
                            $scope.nationalHolidayTablesItems = [];
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
                            // console.log($scope.nationalHolidayTablesItems);
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

            /**
                                 * 顯示加班單，目的找補休
                                 * @param user
                                 */
            function fetchWorkOffTableData(userDID, type) {
                var formData = {
                    creatorDID: userDID,
                    month: thisMonth,
                }
                WorkHourAddItemUtil.getWorkHourAddItems(formData)
                    .success(function (res) {
                        var tables = res.payload;
                        var result = 0;
                        for (var index = 0; index < tables.length; index++) {
                            switch (tables[index].workAddType) {
                                case 1:
                                    break;
                                case 2:
                                    result += $scope.getHourDiffByTime(
                                        tables[index].start_time,
                                        tables[index].end_time);
                                    break;
                            }
                        }
                        switch (type) {
                            // login User
                            case 1:
                                vm.loginUserHolidayForm.rest_observed = (result);
                                break;
                            // specific user
                            case 2:
                                vm.holidayForm.rest_observed = (result);
                                break;
                        }
                    })
                    .error(function () {
                        console.log('ERROR  WorkHourAddItemUtil.getWorkHourAddItems')
                    })
            }

            // ***********************  補班日設定 ************************

            // 主要顯示
            $scope.overTimeDayTablesItems = [];

            $scope.fetchOverTimeDays = function () {
                var getData = {
                    year: thisYear,
                }
                OverTimeDayUtil.fetchAllOverTimeDays(getData)
                    .success(function (res) {
                        // console.log(res.payload);
                        if (res.payload.length > 0) {
                            $scope.overTimeDayTablesItems = [];
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
                                $scope.overTimeDayTablesItems.push(detail);
                            }
                            console.log($scope.overTimeDayTablesItems);
                        }
                    })
                    .error(function () {
                        console.log('ERROR OverTimeDayUtil.fetchAllOverTimeDays');
                    })
            }

            $scope.addOverTimeDayItem = function () {
                var inserted = {
                    create_formDate: $scope.firstFullDate,
                    year: thisYear,
                    month: thisMonth,
                    day: thisDay,
                    //RIGHT
                    myDay: DateUtil.getDay(new Date().getDay()),
                };
                $scope.createOverTimeDayTable(inserted);
            }

            $scope.createOverTimeDayTable = function (table) {
                return $timeout(function () {
                    var formData = {
                        create_formDate: table.create_formDate,
                        year: table.year,
                        month: table.month,
                        day: table.day,
                    }
                    OverTimeDayUtil.createOverTimeDay(formData)
                        .success(function (res) {
                            $scope.fetchOverTimeDays();
                        })
                        .error(function () {
                            console.log('ERROR NationalHolidayUtil.createNationalHoliday');
                        })
                }, 300);
            }

            $scope.saveOverTimeDay = function (checkingTable, checkingButton) {
                var formData = {
                    tableID: checkingTable.tableID,
                    create_formDate: checkingTable.create_formDate,
                    year: checkingTable.year,
                    month: checkingTable.month,
                    day: checkingTable.day,
                }
                OverTimeDayUtil.updateOverTimeDay(formData)
                    .success(function (res) {
                        checkingTable.isEnable = true;
                    })
            }

            $scope.removeOverTimeDay = function (table) {
                var formData = {
                    tableID: table.tableID,
                }
                OverTimeDayUtil.removeOverTimeDay(formData)
                    .success(function (res) {
                        $scope.fetchNationHolidays();
                    })
            }

        } // End of function
    }

)();


