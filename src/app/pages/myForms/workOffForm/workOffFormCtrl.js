/**
 * @author Ichen.chu
 * created on 14.03.2018
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .service('intiWorkOffAllService', function ($http, $cookies) {

                // var formData = {
                //     creatorDID: $cookies.get('userDID'),
                //     year: null,
                //     month: null,
                //     isSendReview: true,
                //     isBossCheck: true,
                //     isExecutiveCheck: true
                // }
                //
                // var promise = $http.post('/api/post_work_off_table_find_by_user_did', formData)
                //     .success(function (workOffTables) {
                //         return workOffTables;
                //     });
                // return promise;
                return "";
            })
            .controller('workOffFormCtrl',
                [
                    '$scope',
                    '$filter',
                    '$cookies',
                    '$timeout',
                    'ngDialog',
                    '$compile',
                    'Project',
                    'User',
                    'DateUtil',
                    'TimeUtil',
                    'WorkOffTypeUtil',
                    'WorkOffFormUtil',
                    'WorkOffExchangeFormUtil',
                    'NationalHolidayUtil',
                    'OverTimeDayUtil',
                    'WorkHourAddItemUtil',
                    'toastr',
                    'HolidayDataForms',
                    'bsLoadingOverlayService',
                    'intiWorkOffAllService',
                    WorkOffFormCtrl
                ]);

        /** @ngInject */
        function WorkOffFormCtrl($scope,
                                 $filter,
                                 cookies,
                                 $timeout,
                                 ngDialog,
                                 $compile,
                                 Project,
                                 User,
                                 DateUtil,
                                 TimeUtil,
                                 WorkOffTypeUtil,
                                 WorkOffFormUtil,
                                 WorkOffExchangeFormUtil,
                                 NationalHolidayUtil,
                                 OverTimeDayUtil,
                                 WorkHourAddItemUtil,
                                 toastr,
                                 HolidayDataForms,
                                 bsLoadingOverlayService,
                                 intiWorkOffAllService) {

            // intiWorkOffAllService.then(function (resp) {
            //     console.log("===intiWorkOffAllService===");
                // console.log(resp.data.payload);
                // $scope.workOffTables = resp.data.payload;
                //
                // angular.element(
                //     document.getElementById('includeHead'))
                //     .append($compile(
                //         "<div ba-panel ba-panel-title=" +
                //         "'所有請假單列表 - " + resp.data.payload.length + "'" +
                //         "ba-panel-class= " +
                //         "'with-scroll'" + ">" +
                //         "<div " +
                //         "ng-include=\"'app/pages/myForms/forms/workOffForm_AllHistory.html'\">" +
                //         "</div>" +
                //         "</div>"
                //     )($scope));
            // })

            $scope.username = cookies.get('username');
            $scope.userDID = cookies.get('userDID');
            $scope.roleType = cookies.get('roletype');

            // 行政總管、經理專屬，主任無權
            if ($scope.roleType == 100 || $scope.roleType == 2) {
                // 所有人，對照資料
                User.getAllUsers()
                    .success(function (allUsers) {
                        vm.users = allUsers;
                    });
            }

            var formData = {
                userDID: cookies.get('userDID'),
            }
            User.findUserByUserDID(formData)
                .success(function (user) {
                    // $scope.userHourSalary = user.userHourSalary;
                    $scope.userMonthSalary = user.userMonthSalary;
                    $scope.bossID = user.bossID;
                    $scope.residualRestHour = user.residualRestHour;
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

                        if ($scope.roleType === '2' || $scope.roleType === '100') {
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
                                    console.log(res.payload);
                                    for (var outIndex = 0; outIndex < res.payload.length; outIndex++) {
                                        console.log(res.payload[outIndex]);
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

            // 主要顯示
            $scope.specificUserTablesItems = [];

            var vm = this;
            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;
            $scope.year = thisYear;
            $scope.month = thisMonth;
            var thisDay = new Date().getDay();

            User.getAllUsers()
                .success(function (allManagers) {
                    $scope.usersBosses = [];
                    vm.usersReview = allManagers;
                    for (var i = 0; i < allManagers.length; i++) {
                        $scope.usersBosses[i] = {
                            value: allManagers[i]._id,
                            name: allManagers[i].name
                        };
                    }
                });

            // ***********************  個人填寫 ************************

            $scope.getUserHolidayForm = function () {
                var formData = {
                    year: thisYear, // 年度
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
                            vm.loginUserHolidayForm.calculate_others = $scope.showWorkOffCount(1001);
                            vm.loginUserHolidayForm.person_residual_rest_hour = parseFloat($scope.residualRestHour);

                        } else {
                            HolidayDataForms.createForms(formData)
                                .success(function (res) {
                                    vm.loginUserHolidayForm = res.payload;
                                })
                        }
                        fetchWorkOffTableData($scope.userDID, 1);
                    })
            }

            //取得使用者個人休假表，userDID
            $scope.getWorkOffTable = function (userDID, month) {
                $scope.specificUserTablesItems = [];
                var getData = {
                    creatorDID: (userDID === undefined || userDID == null)? $scope.userDID : userDID,
                    year: null,
                    month: month === undefined ? null : month,
                    isSendReview: null,
                    isBossCheck: null,
                    isExecutiveCheck: null
                }

                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_workOff'
                });

                WorkOffFormUtil.findWorkOffTableFormByUserDID(getData)
                    .success(function (res) {
                        // 填入表單資訊
                        var workOffTableIDArray = [];
                        $scope.tableData = {};
                        for (var index = 0; index < res.payload.length; index++) {
                            workOffTableIDArray[index] = res.payload[index]._id;
                            var detail = {
                                tableID: res.payload[index]._id,

                                creatorDID: res.payload[index].creatorDID,
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

                        formDataTable = {
                            tableIDArray: workOffTableIDArray,
                        };

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
                        $('.workOffFormNumberInput').mask('00.Z', {
                            translation: {
                                'Z': {
                                    pattern: /[05]/,
                                }
                            }
                        });

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_workOff'
                            });
                        },1000);

                    })
                    .error(function () {
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_workOff'
                            });
                        }, 500)
                        console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByUserDID');
                        toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                    })

                // Deprecate 20190201
                // WorkOffFormUtil.fetchUserWorkOffForm(getData)
                //     .success(function (res) {
                //         console.log(res);
                //         if (res.payload.length > 0) {
                //             var workItemCount = res.payload[0].formTables.length;
                //
                //             var workOffTableIDArray = [];
                //             // 組成 TableID Array，再去Server要資料
                //             for (var index = 0; index < workItemCount; index++) {
                //                 workOffTableIDArray[index] = res.payload[0].formTables[index].tableID;
                //             }
                //             console.log("AAA");
                //             formDataTable = {
                //                 creatorDID: userDID === undefined ? $scope.userDID : userDID,
                //                 year: thisYear,
                //                 month: null
                //                 // tableIDArray: workOffTableIDArray,
                //             }
                //             console.log(formDataTable);
                //             // 取得 Table Data
                //             WorkOffFormUtil.findWorkOffTableFormByUserDID(formDataTable)
                //                 .success(function (res) {
                //                     // 填入表單資訊
                //                     $scope.tableData = {};
                //                     for (var index = 0; index < res.payload.length; index++) {
                //                         var detail = {
                //                             tableID: res.payload[index]._id,
                //
                //                             workOffType: res.payload[index].workOffType,
                //                             create_formDate: res.payload[index].create_formDate,
                //                             year: res.payload[index].year,
                //                             month: res.payload[index].month,
                //                             day: res.payload[index].day,
                //                             start_time: res.payload[index].start_time,
                //                             end_time: res.payload[index].end_time,
                //
                //                             //RIGHT
                //                             isSendReview: res.payload[index].isSendReview,
                //                             isBossCheck: res.payload[index].isBossCheck,
                //                             isExecutiveCheck: res.payload[index].isExecutiveCheck,
                //
                //                             // Reject
                //                             isBossReject: res.payload[index].isBossReject,
                //                             bossReject_memo: res.payload[index].bossReject_memo,
                //
                //                             isExecutiveReject: res.payload[index].isExecutiveReject,
                //                             executiveReject_memo: res.payload[index].executiveReject_memo,
                //
                //                             userMonthSalary: res.payload[index].userMonthSalary,
                //                             // userHourSalary: res.payload[index].userHourSalary,
                //                         };
                //                         $scope.specificUserTablesItems.push(detail);
                //                     }
                //                     console.log($scope.specificUserTablesItems);
                //                     if (userDID !== undefined) {
                //                         $scope.findHolidayFormByUserDID(userDID === undefined ? $scope.userDID : userDID);
                //                     } else {
                //                         $scope.getUserHolidayForm();
                //                     }
                //                 })
                //                 .error(function () {
                //                     console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByTableIDArray');
                //                 })
                //         } else {
                //             $scope.loading = false;
                //             if (userDID !== undefined) {
                //                 $scope.findHolidayFormByUserDID(userDID === undefined ? $scope.userDID : userDID);
                //             } else {
                //                 $scope.getUserHolidayForm();
                //             }
                //         }
                //
                //
                //
                //
                //         $('.workOffFormDateInput').mask('20Y0/M0/D0', {
                //             translation: {
                //                 'Y': {
                //                     pattern: /[0123]/,
                //                 },
                //                 'M': {
                //                     pattern: /[01]/,
                //                 },
                //                 'D': {
                //                     pattern: /[0123]/,
                //                 }
                //             }
                //         });
                //         $('.workOffFormNumberInput').mask('00.Z', {
                //             translation: {
                //                 'Z': {
                //                     pattern: /[05]/,
                //                 }
                //             }
                //         });
                //
                //     })
                //     .error(function () {
                //         console.log('ERROR WorkOffFormUtil.fetchUserWorkOffForm');
                //     })
            }

            $scope.showWorkOffCount = function(workOffType) {
                var index = 0;
                var result = 0;
                for (index = 0; index < $scope.specificUserTablesItems.length; index ++) {
                    if ($scope.specificUserTablesItems[index].workOffType === workOffType && $scope.specificUserTablesItems[index].isExecutiveCheck) {
                        result += $scope.getHourDiffByTime($scope.specificUserTablesItems[index].start_time
                            , $scope.specificUserTablesItems[index].end_time, $scope.specificUserTablesItems[index].workOffType);
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
                    // 補休
                    case 2: {
                        return result ;
                    }
                    // 特
                    case 3: {
                        return result / 8;
                    }
                    // 婚
                    case 4:
                        return result / 8;
                    // 喪
                    case 5:
                        return result / 8;
                    // 公
                    case 6:
                        return result;
                    // 公傷
                    case 7:
                        return result / 8;
                    // 產
                    case 8:
                        return result / 8;
                    // 陪產
                    case 9:
                        return result / 8;
                    case 1001:
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

                // $scope.createSubmit(0);
                $scope.insertWorkOffItem(0);
            }

            $scope.removeHolidayItem = function (index) {
                // console.log(index)
                // $scope.specificUserTablesItems.splice(index, 1);
                console.log('removeHolidayItem, Index= ' + index);

                var formData = {
                    creatorDID: $scope.userDID,
                    tableID: $scope.specificUserTablesItems[index].tableID
                }

                WorkOffFormUtil.removeWorkOffTableItem(formData)
                    .success(function (res) {
                        $scope.specificUserTablesItems.splice(index, 1);
                        console.log($scope.specificUserTablesItems);
                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.removeWorkOffTableItem');
                    })

                // $scope.createSubmit(0);
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
                    selected = $filter('filter')($scope.usersBosses, {
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
                if (dom.$parent.reloadDatePicker != null) {
                    dom.$parent.reloadDatePicker(dom.workOffType.type);
                }
            }

            // 休假規則，未滿一小算一小
            $scope.getHourDiff = function (dom) {
                // console.log(dom);
                if (dom.tableTimeStart && dom.tableTimeEnd) {
                    dom.table.start_time = dom.tableTimeStart;
                    dom.table.end_time = dom.tableTimeEnd;
                    if (TimeUtil.getHour(dom.tableTimeEnd) == 12) {
                        dom.table.end_time = "12:00";
                    }

                    var difference = Math.abs(TimeUtil.toSeconds(dom.table.start_time) - TimeUtil.toSeconds(dom.table.end_time));
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

                    if (TimeUtil.getHour(dom.table.end_time) == 12) {
                        // console.log(result[0])
                        // console.log(result[1])
                        result = result[0] + (result[1] > 0 ? 0.5 : 0);
                        // console.log(result)
                    } else {
                        result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                    }
                    var resultFinal;
                    if (TimeUtil.getHour(dom.table.start_time) <= 12 && TimeUtil.getHour(dom.table.end_time) >= 13) {
                        if (dom.table.workOffType == 2) {
                            resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                        } else {
                            resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                        }
                    } else {
                        if (dom.table.workOffType == 2) {
                            resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                        } else {
                            resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                        }
                    }

                    dom.table.myHourDiff = resultFinal;
                    if (dom.table.workOffType == 3 || dom.table.workOffType == 4 || dom.table.workOffType == 5
                        || dom.table.workOffType == 7 ||dom.table.workOffType == 8 || dom.table.workOffType == 9) {
                        dom.table.myHourDiff = resultFinal <= 4 ? 4 : 8;
                    }

                }
            }

            $scope.getHourDiffByTime = function (start, end, type) {
                // console.log("- workOffFormCtrl, start= " + start + ", end= " + end + ", type= " + type);
                if (isNaN(parseInt(start)) || isNaN(parseInt(end))) {
                    return "輸入格式錯誤";
                }
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

                    // result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                    // return result <= 1 ? 1 : result >= 8 ? 8 : result;

                    if (TimeUtil.getHour(end) == 12) {
                        // console.log(result[0])
                        // console.log(result[1])
                        result = result[0] + (result[1] > 0 ? 0.5 : 0);
                        // console.log(result)
                    } else {
                        result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                    }
                    var resultFinal;
                    if (TimeUtil.getHour(start) <= 12 && TimeUtil.getHour(end) >= 13) {
                        // if (this.table != undefined && this.workOffType.type == 2) {
                        //     resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                        // } else {
                        //     resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                        // }

                        if (this.workOffType !== undefined) {
                            // 請假單
                            if (this.workOffType.type == 2) {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                            } else {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                            }

                        } else if (this.table != undefined) {
                            // 主管審核、行政審核
                            if (this.table.workOffType == 2) {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                            } else {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                            }
                        } else {
                            // 總攬
                            if (type == 2) {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                            } else {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                            }
                        }

                    } else {
                        // if (this.table != undefined && this.workOffType.type == 2) {
                        //     resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                        // } else {
                        //     resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                        // }

                        if (this.workOffType !== undefined) {
                            // 請假單
                            if (this.workOffType.type == 2) {
                                resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                            } else {
                                resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                            }

                        } else if (this.table != undefined) {
                            // 主管審核、行政審核
                            if (this.table.workOffType == 2) {
                                resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                            } else {
                                resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                            }
                        } else {
                            // 總攬
                            if (type == 2) {
                                resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                            } else {
                                resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                            }
                        }
                    }

                    if (this.workOffType !== undefined) {
                        // 請假單
                        if (this.workOffType.type == 3 || this.workOffType.type == 4 || this.workOffType.type == 5
                            || this.workOffType.type == 7 || this.workOffType.type == 8 || this.workOffType.type == 9) {

                            resultFinal = resultFinal <= 4 ? 4 : 8;
                        }

                        console.log("this.workOffType= " + this.workOffType + ", resultFinal= " + resultFinal);

                        return resultFinal;
                    } else if (this.table != undefined) {
                        // 主管審核、行政審核
                        if (this.table.workOffType == 3 || this.table.workOffType == 4 || this.table.workOffType == 5
                            || this.table.workOffType == 7 || this.table.workOffType == 8 || this.table.workOffType == 9) {
                            resultFinal = resultFinal <= 4 ? 4 : 8;
                        }

                        console.log("workOffType= " + this.table.workOffType + ", resultFinal= " + resultFinal);

                        return resultFinal;
                    } else {
                        // 總攬
                        if (type == 3 || type == 4 || type == 5
                            || type == 7 || type == 8 || type == 9) {

                            resultFinal = resultFinal <= 4 ? 4 : 8;
                        }

                        return resultFinal;
                    }

                }
            }

            // 換休換算專用
            $scope.getHourDiffByTime_for_work_add = function (start, end, type) {
                // console.log("- workOffFormCtrl, start= " + start + ", end= " + end + ", type= " + type);
                if (isNaN(parseInt(start)) || isNaN(parseInt(end))) {
                    return "輸入格式錯誤";
                }
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

                    // console.log(result);
                    // console.log(result[0]);
                    // console.log(result[1]);

                    result = result[0] + (result[1] < 30 ? 0 : result[1] === 0 ? 0 : 0.5);
                    return result;
                }
            }

            // Send WorkOffTable to Review
            $scope.reviewWorkOffTable = function (table, button, index) {
                // $scope.createSubmit(0);
                $timeout(function () {
                    // console.log(table)
                    console.log($scope.specificUserTablesItems[index]);
                    var workOffString = $scope.showWorkOffTypeString($scope.specificUserTablesItems[index].workOffType);
                    $scope.checkText = '確定提交 ' + workOffString + '：' +
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
                checkingButton.rowform1.$waiting = true;
                var formData = {
                    tableID: checkingTable.tableID,

                    workOffType: checkingTable.workOffType,
                    create_formDate: checkingTable.create_formDate,
                    year: checkingTable.year,
                    month: checkingTable.month,
                    day: checkingTable.day,
                    start_time: checkingTable.start_time,
                    end_time: checkingTable.end_time,

                    userMonthSalary: checkingTable.userMonthSalary,
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
            // @Deprecated
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
                    // console.log(workOffTableData);
                    var formData = {
                        creatorDID: $scope.userDID,
                        year: thisYear,
                        month: thisMonth,
                        formTables: workOffTableData,
                        oldTables: formDataTable,
                    }
                    // console.log(formDataTable);
                    WorkOffFormUtil.createWorkOffTableForm(formData)
                        .success(function (res) {
                            // 更新old Table ID Array
                            // $scope.getWorkOffTable();
                            var workOffTableIDArray = [];
                            // console.log(res.payload);
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
                            console.log($scope.specificUserTablesItems);
                        })
                        .error(function () {
                            console.log('ERROR WorkOffFormUtil.createWorkOffTableForm');
                        })

                }, time);
            }

            // Insert WorkOff Item
            $scope.insertWorkOffItem = function (time) {
                return $timeout(function () {
                    var tableItem = $scope.specificUserTablesItems[$scope.specificUserTablesItems.length - 1];

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
                    var formData = {
                        creatorDID: $scope.userDID,
                        year: thisYear,
                        month: thisMonth,
                        dataItem: dataItem,
                    }
                    WorkOffFormUtil.insertWorkOffTableItem(formData)
                        .success(function (res) {
                            // console.log(res.payload);
                            $scope.specificUserTablesItems[$scope.specificUserTablesItems.length - 1].tableID = res.payload.tableID;
                            console.log($scope.specificUserTablesItems);
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
                console.log("假期確認表");
                var formData = {
                    userDID: userDID,
                }
                User.findUserByUserDID(formData)
                    .success(function (user) {
                        // $scope.userHourSalary = user.userHourSalary;
                        $scope.preciseResidualRestHour = user.residualRestHour;

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
                                    vm.holidayForm.calculate_others = $scope.showWorkOffCount(1001);
                                    vm.holidayForm.person_residual_rest_hour = parseFloat($scope.preciseResidualRestHour);
                                    console.log(vm.holidayForm);
                                } else {
                                    HolidayDataForms.createForms(formData)
                                        .success(function (res) {
                                            vm.holidayForm = res.payload;
                                        })
                                }
                                fetchWorkOffTableData(userDID, 2);
                            })

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

            // $(document).ready(function () {
            //     $('.workOffFormNumberInput').mask('00.Z', {
            //         translation: {
            //             'Z': {
            //                 pattern: /[05]/,
            //             }
            //         }
            //     });
            // });

            // ***********************  國定假日設定 ************************

            // 主要顯示
            $scope.nationalHolidayTablesItems = [];

            $scope.fetchNationHolidays_workOff = function () {
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
                            $scope.fetchNationHolidays_workOff();
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
                        $scope.fetchNationHolidays_workOff();
                    })
            }

            /**
             * 顯示加班單，目的找補休
             * @param user
             */
            function fetchWorkOffTableData(userDID, type) {
                var formData = {
                    creatorDID: userDID,
                    workAddType: 2
                    // month: thisMonth,
                }
                WorkHourAddItemUtil.getWorkHourAddItems(formData)
                    .success(function (res) {
                        var tables = res.payload;
                        var result = 0;
                        console.log(tables);
                        for (var index = 0; index < tables.length; index++) {
                            if (!tables[index].isExecutiveConfirm) {
                                continue;
                            }
                            switch (tables[index].workAddType) {
                                case 1:
                                    // 加班不使用
                                    break;
                                case 2:
                                    console.log(tables[index]);
                                    // result += $scope.getHourDiffByTime(
                                    //     tables[index].start_time,
                                    //     tables[index].end_time, tables[index].workAddType);
                                    // getHourDiffByTime_for_work_add
                                    result += $scope.getHourDiffByTime_for_work_add(
                                        tables[index].start_time,
                                        tables[index].end_time, tables[index].workAddType);
                                    console.log(result);
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
                        $scope.overTimeDayTablesItems = [];
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
                        $scope.fetchOverTimeDays();
                    })
            }

            //小數點2
            $scope.formatFloat = function (num, pos) {
                var size = Math.pow(10, pos);
                return Math.round(num * size) / size;
            }

            $scope.changeWorkOffHistoryMonth = function(changeCount, dom) {

                bsLoadingOverlayService.start({
                    referenceId: 'allHistory_workOff'
                });

                $scope.monthPicker = dom;

                document.getElementById('includeHead').innerHTML = "";

                dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
                dom.myDT = moment(dom.myDT).add(changeCount, 'M');
                console.log("dom.myMonth= " + dom.myMonth);

                var year = parseInt(dom.myDT.year()) - 1911;
                var month = parseInt(dom.myDT.month()) + 1;

                var formData = {
                    creatorDID: vm.userSelected == undefined ? $scope.userDID : vm.userSelected._id,
                    year: year,
                    month: month,
                    isSendReview: true,
                    isBossCheck: true,
                    isExecutiveCheck: true
                }
                // console.log(formData);
                WorkOffFormUtil.findWorkOffTableFormByUserDID(formData)
                    .success(function (workOffTables) {
                        // console.log(workOffTables.payload);
                        $scope.workOffTables = workOffTables.payload;
                        angular.element(
                            document.getElementById('includeHead'))
                            .append($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'" + (vm.userSelected == undefined ? $scope.username : vm.userSelected.name) + " "+ year + "年" +
                                month + "月" +
                                "請假單列表 - " + workOffTables.payload.length + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/pages/myForms/forms/workOffForm_AllHistory.html'\">" +
                                "</div>" +
                                "</div>"
                            )($scope));

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'allHistory_workOff'
                            });
                        } ,300);

                    })
                    .error(function () {
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'allHistory_workOff'
                            });
                        }, 500)
                        console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByUserDID');
                        toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                    });
            }

            $scope.$watch('myMonth',function(newValue, oldValue) {
                // console.log(oldValue);
                // console.log(newValue);
                if ($scope.isShiftMonthSelect) {
                    $scope.isShiftMonthSelect = false;
                    $scope.changeWorkOffHistoryMonth(0, $scope.monthPickerDom);
                }
            });

            $scope.changeWorkOffHistoryUserDID = function(user) {

                bsLoadingOverlayService.start({
                    referenceId: 'allHistory_workOff'
                });

                document.getElementById('includeHead').innerHTML = "";

                var year = thisYear;
                var month = thisMonth;
                if ($scope.monthPicker != undefined) {
                    year = parseInt($scope.monthPicker.myDT.year()) - 1911;
                    month = parseInt($scope.monthPicker.myDT.month()) + 1;
                }

                vm.userSelected = user;

                var formData = {
                    creatorDID: user._id,
                    year: year,
                    month: month,
                    isSendReview: true,
                    isBossCheck: true,
                    isExecutiveCheck: true
                }
                // console.log(formData);
                WorkOffFormUtil.findWorkOffTableFormByUserDID(formData)
                    .success(function (workOffTables) {
                        // console.log(workOffTables.payload);
                        $scope.workOffTables = workOffTables.payload;
                        angular.element(
                            document.getElementById('includeHead'))
                            .append($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'" + user.name + " " + year + "年" +
                                month + "月" +
                                "請假單列表 - " + workOffTables.payload.length + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/pages/myForms/forms/workOffForm_AllHistory.html'\">" +
                                "</div>" +
                                "</div>"
                            )($scope));

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'allHistory_workOff'
                            });
                        }, 300);
                    })
                    .error(function () {
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'allHistory_workOff'
                            });
                        }, 500)
                        console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByUserDID');
                        toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                    });
                ;
            }

            $scope.initWorkOffMonthCheck = function (specificUser) {
                console.log(specificUser);
                bsLoadingOverlayService.start({
                    referenceId: 'allHistory_workOff'
                });

                document.getElementById('includeHead').innerHTML = "";
                var formData = {
                    // creatorDID: $scope.userDID,
                    creatorDID: specificUser == undefined ? $scope.userDID : specificUser._id,
                    year: null,
                    month: null,
                    isSendReview: true,
                    isBossCheck: true,
                    isExecutiveCheck: true
                }

                WorkOffFormUtil.findWorkOffTableFormByUserDID(formData)
                    .success(function (workOffTables) {
                        // console.log(workOffTables.payload);
                        $scope.workOffTables = workOffTables.payload;
                        angular.element(
                            document.getElementById('includeHead'))
                            .append($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'" + (specificUser == null ? $scope.username : specificUser.name) + " " +
                                "所有請假單列表 - " + workOffTables.payload.length + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/pages/myForms/forms/workOffForm_AllHistory.html'\">" +
                                "</div>" +
                                "</div>"
                            )($scope));

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'allHistory_workOff'
                            });
                        }, 300);
                    })
                    .error(function () {
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'allHistory_workOff'
                            });
                        }, 300)
                        console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByUserDID');
                        toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                    })
                ;


            }


            // ***********************  特休補休 兌換 ************************

            // 兌換單主要顯示
            $scope.specificUserExchangeTablesItems = [];

            //取得使用者個人休假表，userDID
            $scope.getWorkOffExchangeTable = function (userDID, month) {
                $scope.specificUserExchangeTablesItems = [];
                var getData = {
                    creatorDID: (userDID === undefined || userDID == null)? $scope.userDID : userDID,
                    year: null,
                    month: month === undefined ? null : month,
                    isSendReview: null,
                    isBossCheck: null,
                    isExecutiveCheck: null
                }
                WorkOffExchangeFormUtil.findWorkOffExchangeTableFormByUserDID(getData)
                    .success(function (res) {
                        // 填入表單資訊
                        var workOffExchangeTableIDArray = [];
                        $scope.tableData = {};
                        for (var index = 0; index < res.payload.length; index++) {
                            workOffExchangeTableIDArray[index] = res.payload[index]._id;
                            var detail = {
                                tableID: res.payload[index]._id,
                                index: index,
                                creatorDID: res.payload[index].creatorDID,
                                workOffType: res.payload[index].workOffType,
                                create_formDate: res.payload[index].create_formDate,
                                year: res.payload[index].year,
                                month: res.payload[index].month,
                                day: res.payload[index].day,
                                value: res.payload[index].value,

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
                            };
                            $scope.specificUserExchangeTablesItems.push(detail);
                        }
                        console.log(" *** getWorkOffExchangeTable done *** ")
                        console.log($scope.specificUserExchangeTablesItems);
                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByUserDID');
                    })
            }

            $scope.addExchangeItem = function () {
                var inserted = {
                    creatorDID: $scope.userDID,
                    workOffType: -1,
                    create_formDate: $scope.firstFullDate,
                    year: thisYear,
                    month: thisMonth,
                    day: thisDay,
                    value: "0",
                    //RIGHT
                    isSendReview: false,
                    isBossCheck: false,
                    isExecutiveCheck: false,
                    myDay: DateUtil.getDay(new Date().getDay()),
                    // userHourSalary: $scope.userHourSalary,
                    userMonthSalary: $scope.userMonthSalary,
                };
                $scope.specificUserExchangeTablesItems.push(inserted);

                $scope.insertExchangeItem(10);
            }

            // Create Form
            $scope.insertExchangeItem = function (time) {
                return $timeout(function () {
                    var tableItem = $scope.specificUserExchangeTablesItems[$scope.specificUserExchangeTablesItems.length - 1];

                    var dataItem = {
                        creatorDID: $scope.userDID,

                        workOffType: tableItem.workOffType,
                        create_formDate: tableItem.create_formDate,
                        year: tableItem.year,
                        month: tableItem.month,
                        day: tableItem.day,
                        value: tableItem.value,

                        //RIGHT
                        isSendReview: tableItem.isSendReview,
                        isBossCheck: tableItem.isBossCheck,
                        isExecutiveCheck: tableItem.isExecutiveCheck,
                        userMonthSalary: tableItem.userMonthSalary,
                    }

                    var formData = {
                        creatorDID: $scope.userDID,
                        year: thisYear,
                        month: thisMonth,
                        dataItem: dataItem,
                        // oldTables: formDataTable,
                    }
                    console.log(dataItem);
                    WorkOffExchangeFormUtil.insertWorkOffExchangeTableForm(formData)
                        .success(function (res) {
                            $scope.specificUserExchangeTablesItems[$scope.specificUserExchangeTablesItems.length - 1].tableID = res.payload.tableID;
                            $scope.specificUserExchangeTablesItems[$scope.specificUserExchangeTablesItems.length - 1].index = $scope.specificUserExchangeTablesItems.length - 1;
                            console.log($scope.specificUserExchangeTablesItems);
                        })
                        .error(function () {
                            console.log('ERROR WorkOffExchangeFormUtil.insertWorkOffExchangeTableForm');
                        })

                }, time);

            }

            $scope.removeExchangeItem = function (index) {
                console.log('removeExchangeItem, Index= ' + index);
                console.log($scope.specificUserExchangeTablesItems[index]);

                var formData = {
                    creatorDID: $scope.userDID,
                    tableID: $scope.specificUserExchangeTablesItems[index].tableID
                }

                WorkOffExchangeFormUtil.removeWorkOffExchangeTableFormByItemID(formData)
                    .success(function (res) {
                        $scope.specificUserExchangeTablesItems.splice(index, 1);
                        console.log($scope.specificUserExchangeTablesItems);
                    })
                    .error(function () {
                        console.log('ERROR WorkOffExchangeFormUtil.removeWorkOffExchangeTableFormByItemID');
                    })
            };

            // Send WorkOffExchangeTable to Review
            $scope.reviewWorkOffExchangeTable = function (table, button, index) {
                console.log($scope.specificUserExchangeTablesItems[index]);
                var workOffString = $scope.showWorkOffTypeString($scope.specificUserExchangeTablesItems[index].workOffType);
                $scope.checkText = '確定提交 ' + workOffString + '：' +
                    $scope.specificUserExchangeTablesItems[index].value +
                    "小時 審查？";
                $scope.checkingTable = $scope.specificUserExchangeTablesItems[index];
                $scope.checkingButton = button;
                $scope.checkingIndex = index;
                ngDialog.open({
                    template: 'app/pages/myModalTemplate/myWorkOffExchangeTableFormReviewModal.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: false,
                });
            }
            //跟後臺溝通
            $scope.sendWorkOffExchangeTable = function (checkingTable, checkingButton, checkingIndex) {
                var formData = {
                    tableID: checkingTable.tableID,
                    workOffType: checkingTable.workOffType,
                    create_formDate: $scope.firstFullDate,
                    year: thisYear,
                    month: thisMonth,
                    day: thisDay,
                    value: checkingTable.value,
                    userMonthSalary: $scope.userMonthSalary,

                    isSendReview: true,
                }
                WorkOffExchangeFormUtil.updateWorkOffExchangeItem(formData)
                    .success(function (res) {
                        checkingButton.rowform1.$waiting = true;
                        $scope.specificUserTablesItems[checkingIndex].isSendReview = true;
                    })
                    .error(function () {
                        console.log('ERROR WorkOffExchangeFormUtil.sendWorkOffExchangeTable');
                    })
            }

            // 對應行政總管
            $scope.isFitExecutive = function () {
                return ($scope.roleType == 100)
            }

            // ************* 行政核定後退回 ****************
            $scope.repentWorkItem_executive = function (workOffTables, table, index) {
                console.log(table);
                console.log(index);

                $scope.checkText = '確定 恢復成行政審核前狀態：' +
                    $scope.showDate(table) +
                    " " +
                    $scope.showWorkOffTypeString(table.workOffType) +
                    "  ？";
                $scope.checkingForm = workOffTables;
                $scope.checkingTable = table;
                $scope.mIndex = index;
                ngDialog.open({
                    template: 'app/pages/myModalTemplate/myWorkOffTableFormRepent_ExecutiveModal.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: false,
                });
            }

            //行政核定後退回 -2
            $scope.sendWorkRepent_executive = function (workOffTables, checkingTable, index) {

                // console.log(workOffTables);
                // console.log(checkingTable);
                // console.log(index);

                var formData = {
                    tableID: checkingTable._id,
                    isExecutiveCheck: false,
                }
                WorkOffFormUtil.updateWorkOffItem(formData)
                    .success(function (res) {
                        workOffTables.splice(index, 1);
                    })
            }


        } // End of function
    }

)();


