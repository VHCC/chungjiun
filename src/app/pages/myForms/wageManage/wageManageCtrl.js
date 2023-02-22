/**
 * @author Ichen.chu
 * created on 19.10.2019
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .service('intiWorkOffAllService', function ($http, $cookies) {
                return "";
            })
            .controller('wageManageCtrl',
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
                    'OverTimeDayUtil',
                    'toastr',
                    'WageManageUtil',
                    'WorkHourAddItemUtil',
                    'WorkOffFormUtil',
                    'WorkOffExchangeFormUtil',
                    'bsLoadingOverlayService',
                    'intiWorkOffAllService',
                    WageManageCtrl
                ]);

        /** @ngInject */
        function WageManageCtrl($scope,
                                 $filter,
                                 cookies,
                                 $timeout,
                                 ngDialog,
                                 $compile,
                                 Project,
                                 User,
                                 DateUtil,
                                 TimeUtil,
                                 OverTimeDayUtil,
                                 toastr,
                                 WageManageUtil,
                                 WorkHourAddItemUtil,
                                 WorkOffFormUtil,
                                 WorkOffExchangeFormUtil,
                                 bsLoadingOverlayService,
                                 intiWorkOffAllService) {

            var vm = this;

            $scope.username = cookies.get('username');
            $scope.userDID = cookies.get('userDID');
            $scope.roleType = cookies.get('roletype');

            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;

            var specificYear = thisYear;
            var specificMonth = thisMonth;

            // 所有人，對照資料
            User.getAllUsersWithSignOut()
                .success(function (allUsers) {
                    vm.mainUsers = allUsers; // 俸給設定
                });

            $scope.isMain = false;

            $scope.switchToMain = function(boolean) {
                $scope.isMain = boolean;
            }

            $scope.showWageTable = function (userDID) {
                // console.log(userDID);
                var formData = {
                    creatorDID: userDID == null ? vm.main.selected._id : userDID,
                    year: specificYear,
                    month: specificMonth
                }

                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_wageManage'
                });

                // console.log(formData);

                WageManageUtil.fetchUserWageMain(formData)
                    .success(function (res) {
                        // console.log(res);
                        if (res.payload == null) {
                            WageManageUtil.createUserWageMain(formData)
                                .success(function (res) {
                                    vm.formID = res.payload._id;

                                    if (vm.wageForm_blue) {

                                        vm.wageForm_blue.wgae_item_1 = res.payload.wgae_item_1 == null ? 0 : res.payload.wgae_item_1;
                                        vm.wageForm_blue.wgae_item_2 = res.payload.wgae_item_2 == null ? 0 : res.payload.wgae_item_2;
                                        vm.wageForm_blue.wgae_item_3 = res.payload.wgae_item_3 == null ? 0 : res.payload.wgae_item_3;
                                        vm.wageForm_blue.wgae_item_4 = res.payload.wgae_item_4 == null ? 0 : res.payload.wgae_item_4;
                                        vm.wageForm_blue.wgae_item_5 = res.payload.wgae_item_5 == null ? 0 : res.payload.wgae_item_5;
                                        // vm.wageForm.wgae_item_6 = res.payload.wgae_item_6 == null ? 0 : res.payload.wgae_item_6;
                                        vm.wageForm_blue.wgae_item_7 = res.payload.wgae_item_7 == null ? 0 : res.payload.wgae_item_7;
                                        vm.wageForm_blue.wgae_item_8 = res.payload.wgae_item_8 == null ? 0 : res.payload.wgae_item_8;
                                        vm.wageForm_blue.wgae_item_9 = res.payload.wgae_item_9 == null ? 0 : res.payload.wgae_item_9;
                                        vm.wageForm_blue.wgae_item_10 = res.payload.wgae_item_10 == null ? 0 : res.payload.wgae_item_10;
                                        vm.wageForm_blue.wgae_item_11 = res.payload.wgae_item_11 == null ? 0 : res.payload.wgae_item_11;
                                        vm.wageForm_blue.wgae_item_12 = res.payload.wgae_item_12 == null ? 0 : res.payload.wgae_item_12;
                                        vm.wageForm_blue.wgae_item_12_title = res.payload.wgae_item_12_title == null ? "" : res.payload.wgae_item_12_title;
                                        vm.wageForm_blue.wgae_item_13 = res.payload.wgae_item_13 == null ? 0 : res.payload.wgae_item_13;
                                        vm.wageForm_blue.wgae_item_13_title = res.payload.wgae_item_13_title == null ? "" : res.payload.wgae_item_13_title;
                                        vm.wageForm_blue.wgae_item_14 = res.payload.wgae_item_14 == null ? 0 : res.payload.wgae_item_14;
                                        vm.wageForm_blue.wgae_item_14_title = res.payload.wgae_item_14_title == null ? "" : res.payload.wgae_item_14_title;
                                        vm.wageForm_blue.wgae_item_15 = res.payload.wgae_item_15 == null ? 0 : res.payload.wgae_item_15;
                                        vm.wageForm_blue.wgae_item_15_title = res.payload.wgae_item_15_title == null ? "" : res.payload.wgae_item_15_title;
                                        vm.wageForm_blue.wgae_item_16 = res.payload.wgae_item_16 == null ? 0 : res.payload.wgae_item_16;
                                        vm.wageForm_blue.wgae_item_16_title = res.payload.wgae_item_16_title == null ? "" : res.payload.wgae_item_16_title;
                                    }

                                    if (vm.wageForm_yellow) {
                                        vm.wageForm_yellow.withholding_item_2 = res.payload.withholding_item_2 == null ? 0 : res.payload.withholding_item_2;
                                        vm.wageForm_yellow.withholding_item_3 = res.payload.withholding_item_3 == null ? 0 : res.payload.withholding_item_3;
                                        vm.wageForm_yellow.withholding_item_4 = res.payload.withholding_item_4 == null ? 0 : res.payload.withholding_item_4;
                                        vm.wageForm_yellow.withholding_item_5 = res.payload.withholding_item_5 == null ? 0 : res.payload.withholding_item_5;
                                        vm.wageForm_yellow.withholding_item_5_title = res.payload.withholding_item_5_title == null ? "" : res.payload.withholding_item_5_title;
                                    }

                                    if (vm.wageForm_green) {

                                        vm.wageForm_green.green_item_1 = res.payload.green_item_1 == null ? 0 : res.payload.green_item_1;
                                        vm.wageForm_green.green_item_2 = res.payload.green_item_2 == null ? 0 : res.payload.green_item_2;
                                        vm.wageForm_green.green_item_3 = res.payload.green_item_3 == null ? 0 : res.payload.green_item_3;
                                        vm.wageForm_green.green_item_4 = res.payload.green_item_4 == null ? 0 : res.payload.green_item_4;
                                        vm.wageForm_green.green_item_5 = res.payload.green_item_5 == null ? 0 : res.payload.green_item_5;
                                        vm.wageForm_green.green_item_6 = res.payload.green_item_6 == null ? 0 : res.payload.green_item_6;
                                        vm.wageForm_green.green_item_7 = res.payload.green_item_7 == null ? 0 : res.payload.green_item_7;
                                        vm.wageForm_green.green_item_8 = res.payload.green_item_8 == null ? 0 : res.payload.green_item_8;
                                        vm.wageForm_green.green_item_8_title = res.payload.green_item_8_title == null ? "" : res.payload.green_item_8_title;
                                        vm.wageForm_green.green_item_9 = res.payload.green_item_9 == null ? 0 : res.payload.green_item_9;
                                        vm.wageForm_green.green_item_9_title = res.payload.green_item_9_title == null ? "" : res.payload.green_item_9_title;
                                        vm.wageForm_green.green_item_10 = res.payload.green_item_10 == null ? 0 : res.payload.green_item_10;
                                        vm.wageForm_green.green_item_10_title = res.payload.green_item_10_title == null ? "" : res.payload.green_item_10_title;

                                    }
                                    if (vm.wageForm_blue_servitor) {

                                        vm.wageForm_blue_servitor.blue_item_1 = res.payload.blue_item_1 == null ? 0 : res.payload.blue_item_1;
                                        vm.wageForm_blue_servitor.blue_item_1_hour = res.payload.blue_item_1_hour == null ? 0 : res.payload.blue_item_1_hour;
                                        vm.wageForm_blue_servitor.blue_item_2 = res.payload.blue_item_2 == null ? 0 : res.payload.blue_item_2;
                                        vm.wageForm_blue_servitor.blue_item_3 = res.payload.blue_item_3 == null ? 0 : res.payload.blue_item_3;
                                        vm.wageForm_blue_servitor.blue_item_4 = res.payload.blue_item_4 == null ? 0 : res.payload.blue_item_4;
                                        vm.wageForm_blue_servitor.blue_item_5 = res.payload.blue_item_5 == null ? 0 : res.payload.blue_item_5;
                                        vm.wageForm_blue_servitor.blue_item_6 = res.payload.blue_item_6 == null ? 0 : res.payload.blue_item_6;
                                        vm.wageForm_blue_servitor.blue_item_6_title = res.payload.blue_item_6_title == null ? "" : res.payload.blue_item_6_title;
                                        vm.wageForm_blue_servitor.blue_item_7 = res.payload.blue_item_7 == null ? 0 : res.payload.blue_item_7;
                                        vm.wageForm_blue_servitor.blue_item_7_title = res.payload.blue_item_7_title == null ? "" : res.payload.blue_item_7_title;
                                    }

                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'mainPage_wageManage'
                                        });
                                    }, 500)
                                })
                                .error(function (res) {
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'mainPage_wageManage'
                                        });
                                    }, 500)
                                })
                        } else {
                            console.log(vm);

                            vm.formID = res.payload._id;

                            if (vm.wageForm_blue) {

                                vm.wageForm_blue.wgae_item_1 = res.payload.wgae_item_1 == null ? 0 : res.payload.wgae_item_1;
                                vm.wageForm_blue.wgae_item_2 = res.payload.wgae_item_2 == null ? 0 : res.payload.wgae_item_2;
                                vm.wageForm_blue.wgae_item_3 = res.payload.wgae_item_3 == null ? 0 : res.payload.wgae_item_3;
                                vm.wageForm_blue.wgae_item_4 = res.payload.wgae_item_4 == null ? 0 : res.payload.wgae_item_4;
                                vm.wageForm_blue.wgae_item_5 = res.payload.wgae_item_5 == null ? 0 : res.payload.wgae_item_5;
                                // vm.wageForm.wgae_item_6 = res.payload.wgae_item_6 == null ? 0 : res.payload.wgae_item_6;
                                vm.wageForm_blue.wgae_item_7 = res.payload.wgae_item_7 == null ? 0 : res.payload.wgae_item_7;
                                vm.wageForm_blue.wgae_item_8 = res.payload.wgae_item_8 == null ? 0 : res.payload.wgae_item_8;
                                vm.wageForm_blue.wgae_item_9 = res.payload.wgae_item_9 == null ? 0 : res.payload.wgae_item_9;
                                vm.wageForm_blue.wgae_item_10 = res.payload.wgae_item_10 == null ? 0 : res.payload.wgae_item_10;
                                vm.wageForm_blue.wgae_item_11 = res.payload.wgae_item_11 == null ? 0 : res.payload.wgae_item_11;
                                vm.wageForm_blue.wgae_item_12 = res.payload.wgae_item_12 == null ? 0 : res.payload.wgae_item_12;
                                vm.wageForm_blue.wgae_item_12_title = res.payload.wgae_item_12_title == null ? "" : res.payload.wgae_item_12_title;
                                vm.wageForm_blue.wgae_item_13 = res.payload.wgae_item_13 == null ? 0 : res.payload.wgae_item_13;
                                vm.wageForm_blue.wgae_item_13_title = res.payload.wgae_item_13_title == null ? "" : res.payload.wgae_item_13_title;
                                vm.wageForm_blue.wgae_item_14 = res.payload.wgae_item_14 == null ? 0 : res.payload.wgae_item_14;
                                vm.wageForm_blue.wgae_item_14_title = res.payload.wgae_item_14_title == null ? "" : res.payload.wgae_item_14_title;
                                vm.wageForm_blue.wgae_item_15 = res.payload.wgae_item_15 == null ? 0 : res.payload.wgae_item_15;
                                vm.wageForm_blue.wgae_item_15_title = res.payload.wgae_item_15_title == null ? "" : res.payload.wgae_item_15_title;
                                vm.wageForm_blue.wgae_item_16 = res.payload.wgae_item_16 == null ? 0 : res.payload.wgae_item_16;
                                vm.wageForm_blue.wgae_item_16_title = res.payload.wgae_item_16_title == null ? "" : res.payload.wgae_item_16_title;
                            }

                            if (vm.wageForm_yellow) {
                                vm.wageForm_yellow.withholding_item_2 = res.payload.withholding_item_2 == null ? 0 : res.payload.withholding_item_2;
                                vm.wageForm_yellow.withholding_item_3 = res.payload.withholding_item_3 == null ? 0 : res.payload.withholding_item_3;
                                vm.wageForm_yellow.withholding_item_4 = res.payload.withholding_item_4 == null ? 0 : res.payload.withholding_item_4;
                                vm.wageForm_yellow.withholding_item_5 = res.payload.withholding_item_5 == null ? 0 : res.payload.withholding_item_5;
                                vm.wageForm_yellow.withholding_item_5_title = res.payload.withholding_item_5_title == null ? "" : res.payload.withholding_item_5_title;
                            }

                            if (vm.wageForm_green) {

                                vm.wageForm_green.green_item_1 = res.payload.green_item_1 == null ? 0 : res.payload.green_item_1;
                                vm.wageForm_green.green_item_2 = res.payload.green_item_2 == null ? 0 : res.payload.green_item_2;
                                vm.wageForm_green.green_item_3 = res.payload.green_item_3 == null ? 0 : res.payload.green_item_3;
                                vm.wageForm_green.green_item_4 = res.payload.green_item_4 == null ? 0 : res.payload.green_item_4;
                                vm.wageForm_green.green_item_5 = res.payload.green_item_5 == null ? 0 : res.payload.green_item_5;
                                vm.wageForm_green.green_item_6 = res.payload.green_item_6 == null ? 0 : res.payload.green_item_6;
                                vm.wageForm_green.green_item_7 = res.payload.green_item_7 == null ? 0 : res.payload.green_item_7;
                                vm.wageForm_green.green_item_8 = res.payload.green_item_8 == null ? 0 : res.payload.green_item_8;
                                vm.wageForm_green.green_item_8_title = res.payload.green_item_8_title == null ? "" : res.payload.green_item_8_title;
                                vm.wageForm_green.green_item_9 = res.payload.green_item_9 == null ? 0 : res.payload.green_item_9;
                                vm.wageForm_green.green_item_9_title = res.payload.green_item_9_title == null ? "" : res.payload.green_item_9_title;
                                vm.wageForm_green.green_item_10 = res.payload.green_item_10 == null ? 0 : res.payload.green_item_10;
                                vm.wageForm_green.green_item_10_title = res.payload.green_item_10_title == null ? "" : res.payload.green_item_10_title;

                            }
                            if (vm.wageForm_blue_servitor) {

                                vm.wageForm_blue_servitor.blue_item_1 = res.payload.blue_item_1 == null ? 0 : res.payload.blue_item_1;
                                vm.wageForm_blue_servitor.blue_item_1_hour = res.payload.blue_item_1_hour == null ? 0 : res.payload.blue_item_1_hour;
                                vm.wageForm_blue_servitor.blue_item_2 = res.payload.blue_item_2 == null ? 0 : res.payload.blue_item_2;
                                vm.wageForm_blue_servitor.blue_item_3 = res.payload.blue_item_3 == null ? 0 : res.payload.blue_item_3;
                                vm.wageForm_blue_servitor.blue_item_4 = res.payload.blue_item_4 == null ? 0 : res.payload.blue_item_4;
                                vm.wageForm_blue_servitor.blue_item_5 = res.payload.blue_item_5 == null ? 0 : res.payload.blue_item_5;
                                vm.wageForm_blue_servitor.blue_item_6 = res.payload.blue_item_6 == null ? 0 : res.payload.blue_item_6;
                                vm.wageForm_blue_servitor.blue_item_6_title = res.payload.blue_item_6_title == null ? "" : res.payload.blue_item_6_title;
                                vm.wageForm_blue_servitor.blue_item_7 = res.payload.blue_item_7 == null ? 0 : res.payload.blue_item_7;
                                vm.wageForm_blue_servitor.blue_item_7_title = res.payload.blue_item_7_title == null ? "" : res.payload.blue_item_7_title;
                            }


                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_wageManage'
                                });
                            }, 500)
                        }
                    })
                    .error(function (res) {
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_wageManage'
                            });
                        }, 500)
                    })

                var formData_workAdd = {
                    creatorDID: userDID == null ? vm.main.selected._id : userDID,
                    year: specificYear,
                    month: specificMonth,
                    isExecutiveConfirm: true,
                }

                WorkHourAddItemUtil.getWorkHourAddItems(formData_workAdd)
                    .success(function (res) {
                        // $$$$$ 主要顯示 $$$$$
                        $scope.workAddConfirmTablesItems = $scope.filterData(res.payload);

                        fetchExchangeData(userDID == null ? vm.main.selected._id : userDID, specificYear, specificMonth);
                    })
                    .error(function () {
                        console.log('ERROR  WorkHourAddItemUtil.getWorkHourAddItems');
                    })

                // 整理數據
                $scope.filterData = function(rawData) {
                    var itemList = [];

                    var workOT_date = [];

                    for (var index = 0; index < rawData.length; index++) {
                        var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawData[index].create_formDate)
                            , 0) + "_" +
                            rawData[index].day + "_" +
                            rawData[index].prjDID;

                        var detail = {
                            item_id: rawData[index]._id,
                            item_start_time: rawData[index].start_time,
                            item_end_time: rawData[index].end_time,
                            item_workAddType: rawData[index].workAddType,
                        }

                        if (workOT_date[item] != undefined) {
                            var data = workOT_date[item];
                            data.items.push(detail);

                            data.reason += ", " + rawData[index].reason
                        } else {

                            itemList.push(item);

                            var items = [];

                            items.push(detail);

                            rawData[index].items = items;

                            var data = rawData[index];
                        }

                        eval('workOT_date[item] = data');
                    }

                    var result = [];

                    for (var index = 0; index < itemList.length; index ++) {
                        result.push(workOT_date[itemList[index]]);
                    }

                    return result;
                }

                var formData_workoff = {
                    creatorDID: userDID == null ? vm.main.selected._id : userDID,
                    year: specificYear,
                    month: specificMonth,
                    isSendReview: true,
                    isBossCheck: true,
                    isExecutiveCheck: true
                }

                WorkOffFormUtil.findWorkOffTableFormByUserDID(formData_workoff)
                    .success(function (res) {

                        // 主要顯示
                        $scope.specificUserWorkOffItems = [];

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
                            };
                            $scope.specificUserWorkOffItems.push(detail);
                        }
                    })
                    .error(function () {
                    })

                $scope.getHourDiffByTime = function (start, end, type) {
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

                        if (TimeUtil.getHour(end) == 12) {
                            // result = result[0] + (result[1] > 0 ? 0.5 : 0);
                            result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                        } else {
                            result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                        }
                        var resultFinal;
                        if (TimeUtil.getHour(start) <= 12 && TimeUtil.getHour(end) >= 13) {

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
                            return resultFinal;
                        } else if (this.table != undefined) {
                            // 主管審核、行政審核
                            if (this.table.workOffType == 4 || this.table.workOffType == 5
                                || this.table.workOffType == 7 || this.table.workOffType == 8 || this.table.workOffType == 9) {
                                resultFinal = resultFinal <= 4 ? 4 : 8;
                            }
                            return resultFinal;
                        } else {
                            // 總攬
                            if (type == 4 || type == 5
                                || type == 7 || type == 8 || type == 9) {
                                resultFinal = resultFinal <= 4 ? 4 : 8;
                            }
                            return resultFinal;
                        }
                    }
                }
            }

            $scope.showTotalOTMoney_wage = function () {

                if ($scope.workAddConfirmTablesItems == undefined || $scope.workAddConfirmTablesItems.length === 0) {
                    return  $scope.formatFloat(0.0, 0);
                }

                var result = 0.0;

                var result_1_0 = 0.0;
                var result_1_13 = 0.0;
                var result_1_23 = 0.0;
                var result_1_1 = 0.0;

                for (var index = 0; index < $scope.workAddConfirmTablesItems.length; index ++) {
                    var salaryBase =  Math.round($scope.workAddConfirmTablesItems[index].userMonthSalary / 30 / 8);
                    result_1_0 += $scope.workAddConfirmTablesItems[index].dis_1_0 * salaryBase * 1;
                    result_1_13 += $scope.workAddConfirmTablesItems[index].dis_1_13 * salaryBase * (4/3);
                    result_1_23 += $scope.workAddConfirmTablesItems[index].dis_1_23 * salaryBase * (5/3);
                    result_1_1 += $scope.workAddConfirmTablesItems[index].dis_1_1 * salaryBase * (2);
                }

                // result = Math.ceil(result_1_0) + Math.ceil(result_1_13) + Math.ceil(result_1_23) + Math.ceil(result_1_1);
                result = Math.ceil(result_1_0 + result_1_13 + result_1_23 + result_1_1);

                // console.log(result)

                return $scope.formatFloat(result, 0);
            }

            /**
             * 顯示兌現單，目的找補休、特休兌換數
             * @param user
             */
            function fetchExchangeData(userDID, year, month) {
                var formData = {
                    creatorDID: userDID,
                    year: year,
                    month: month,
                }
                WorkOffExchangeFormUtil.fetchExchangeItemsByYear(formData)
                    .success(function (res) {

                        res.payload = res.payload.sort(function (a, b) {
                            return a._id > b._id ? 1 : -1;
                        });

                        var exchangeItems = res.payload;

                        // console.log(exchangeItems);

                        $scope.exchange_special = 0.0;
                        $scope.exchange_special_money = 0.0;
                        $scope.exchange_observed = 0.0;
                        $scope.exchange_observed_money = 0.0;
                        for (var index = 0; index < exchangeItems.length; index ++) {
                            if (exchangeItems[index].isConfirmed) {
                                var salaryBase = Math.round(exchangeItems[index].userMonthSalary / 30 / 8);
                                console.log(salaryBase);
                                switch (exchangeItems[index].workOffType) {
                                    case 2:
                                        $scope.exchange_observed += parseFloat(exchangeItems[index].exchangeHour);
                                        console.log(Math.ceil(parseFloat(exchangeItems[index].exchangeHour) * salaryBase));
                                        $scope.exchange_observed_money += Math.ceil(parseFloat(exchangeItems[index].exchangeHour) * salaryBase);
                                        break;
                                    case 3:
                                        $scope.exchange_special += parseFloat(exchangeItems[index].exchangeHour);
                                        console.log(Math.ceil(parseFloat(exchangeItems[index].exchangeHour) * salaryBase));
                                        $scope.exchange_special_money += Math.ceil(parseFloat(exchangeItems[index].exchangeHour) * salaryBase);
                                        break;
                                }
                            }
                        }

                    })
            }

            $scope.showTotalWorkOffMoney_wage = function () {
                // workoffType = 0, *1
                // workoffType = 1, *0.5
                var result = 0;
                if ($scope.specificUserWorkOffItems) {
                    for (var index = 0; index < $scope.specificUserWorkOffItems.length; index ++) {

                        var salaryBase = Math.round($scope.specificUserWorkOffItems[index].userMonthSalary / 30 / 8);
                        // console.log("userMonthSalary= " + $scope.specificUserWorkOffItems[index].userMonthSalary + ", salaryBase= " + salaryBase);

                        var hour = $scope.getHourDiffByTime(
                            $scope.specificUserWorkOffItems[index].start_time,
                            $scope.specificUserWorkOffItems[index].end_time,
                            $scope.specificUserWorkOffItems[index].workOffType)

                        // console.log("workOffType= " + $scope.specificUserWorkOffItems[index].workOffType + ", hour= " + hour);

                        switch ($scope.specificUserWorkOffItems[index].workOffType) {
                            case 0: // *1
                                result += parseFloat(hour) * salaryBase * 1;
                                break;
                            case 1: // *0.5
                                result += parseFloat(hour) * salaryBase * 0.5;
                                break;
                        }
                    }
                }
                return Math.ceil(result)
            }

            //小數點2
            $scope.formatFloat = function (num, pos) {
                var size = Math.pow(10, pos);
                return Math.round(num * size) / size;
            }

            //
            $scope.fetch_pre_month_data = function () {
                var formData = {
                    creatorDID: vm.main.selected._id,
                    year: specificMonth == 1 ? specificYear - 1 : specificYear,
                    month: specificMonth == 1 ? 12 : specificMonth - 1
                }

                // console.log(formData);
                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_wageManage'
                });

                // console.log(formData);

                WageManageUtil.fetchUserWageMain(formData)
                    .success(function (res) {
                        // console.log(res);

                        if (vm.wageForm_blue) {

                            vm.wageForm_blue.wgae_item_1 = res.payload.wgae_item_1 == null ? 0 : res.payload.wgae_item_1;
                            vm.wageForm_blue.wgae_item_2 = res.payload.wgae_item_2 == null ? 0 : res.payload.wgae_item_2;
                            vm.wageForm_blue.wgae_item_3 = res.payload.wgae_item_3 == null ? 0 : res.payload.wgae_item_3;
                            vm.wageForm_blue.wgae_item_4 = res.payload.wgae_item_4 == null ? 0 : res.payload.wgae_item_4;
                            vm.wageForm_blue.wgae_item_5 = res.payload.wgae_item_5 == null ? 0 : res.payload.wgae_item_5;
                            // vm.wageForm.wgae_item_6 = res.payload.wgae_item_6 == null ? 0 : res.payload.wgae_item_6;
                            vm.wageForm_blue.wgae_item_7 = res.payload.wgae_item_7 == null ? 0 : res.payload.wgae_item_7;
                            vm.wageForm_blue.wgae_item_8 = res.payload.wgae_item_8 == null ? 0 : res.payload.wgae_item_8;
                            vm.wageForm_blue.wgae_item_9 = res.payload.wgae_item_9 == null ? 0 : res.payload.wgae_item_9;
                            vm.wageForm_blue.wgae_item_10 = res.payload.wgae_item_10 == null ? 0 : res.payload.wgae_item_10;
                            vm.wageForm_blue.wgae_item_11 = res.payload.wgae_item_11 == null ? 0 : res.payload.wgae_item_11;
                            vm.wageForm_blue.wgae_item_12 = res.payload.wgae_item_12 == null ? 0 : res.payload.wgae_item_12;
                            vm.wageForm_blue.wgae_item_12_title = res.payload.wgae_item_12_title == null ? "" : res.payload.wgae_item_12_title;
                            vm.wageForm_blue.wgae_item_13 = res.payload.wgae_item_13 == null ? 0 : res.payload.wgae_item_13;
                            vm.wageForm_blue.wgae_item_13_title = res.payload.wgae_item_13_title == null ? "" : res.payload.wgae_item_13_title;
                            vm.wageForm_blue.wgae_item_14 = res.payload.wgae_item_14 == null ? 0 : res.payload.wgae_item_14;
                            vm.wageForm_blue.wgae_item_14_title = res.payload.wgae_item_14_title == null ? "" : res.payload.wgae_item_14_title;
                            vm.wageForm_blue.wgae_item_15 = res.payload.wgae_item_15 == null ? 0 : res.payload.wgae_item_15;
                            vm.wageForm_blue.wgae_item_15_title = res.payload.wgae_item_15_title == null ? "" : res.payload.wgae_item_15_title;
                            vm.wageForm_blue.wgae_item_16 = res.payload.wgae_item_16 == null ? 0 : res.payload.wgae_item_16;
                            vm.wageForm_blue.wgae_item_16_title = res.payload.wgae_item_16_title == null ? "" : res.payload.wgae_item_16_title;
                        }

                        if (vm.wageForm_blue_servitor) {

                            vm.wageForm_blue_servitor.blue_item_1 = res.payload.blue_item_1 == null ? 0 : res.payload.blue_item_1;
                            vm.wageForm_blue_servitor.blue_item_1_hour = res.payload.blue_item_1_hour == null ? 0 : res.payload.blue_item_1_hour;
                            vm.wageForm_blue_servitor.blue_item_2 = res.payload.blue_item_2 == null ? 0 : res.payload.blue_item_2;
                            vm.wageForm_blue_servitor.blue_item_3 = res.payload.blue_item_3 == null ? 0 : res.payload.blue_item_3;
                            vm.wageForm_blue_servitor.blue_item_4 = res.payload.blue_item_4 == null ? 0 : res.payload.blue_item_4;
                            vm.wageForm_blue_servitor.blue_item_5 = res.payload.blue_item_5 == null ? 0 : res.payload.blue_item_5;
                            vm.wageForm_blue_servitor.blue_item_6 = res.payload.blue_item_6 == null ? 0 : res.payload.blue_item_6;
                            vm.wageForm_blue_servitor.blue_item_6_title = res.payload.blue_item_6_title == null ? "" : res.payload.blue_item_6_title;
                            vm.wageForm_blue_servitor.blue_item_7 = res.payload.blue_item_7 == null ? 0 : res.payload.blue_item_7;
                            vm.wageForm_blue_servitor.blue_item_7_title = res.payload.blue_item_7_title == null ? "" : res.payload.blue_item_7_title;
                        }


                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_wageManage'
                            });
                        }, 500)
                    })
                    .error(function (res) {
                        console.log(res)
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_wageManage'
                            });
                        }, 500)
                    })
            }

            $scope.save_wage_main = function () {

                var formData = {
                    _id: vm.formID,
                    wgae_item_1: vm.wageForm_blue.wgae_item_1,
                    wgae_item_2: vm.wageForm_blue.wgae_item_2,
                    wgae_item_3: vm.wageForm_blue.wgae_item_3,
                    wgae_item_4: vm.wageForm_blue.wgae_item_4,
                    wgae_item_5: vm.wageForm_blue.wgae_item_5,
                    // wgae_item_6: vm.wageForm.wgae_item_6,
                    wgae_item_7: vm.wageForm_blue.wgae_item_7,
                    wgae_item_8: vm.wageForm_blue.wgae_item_8,
                    wgae_item_9: vm.wageForm_blue.wgae_item_9,
                    wgae_item_10: vm.wageForm_blue.wgae_item_10,
                    wgae_item_11: vm.wageForm_blue.wgae_item_11,
                    wgae_item_12: vm.wageForm_blue.wgae_item_12,
                    wgae_item_12_title: vm.wageForm_blue.wgae_item_12_title,
                    wgae_item_13: vm.wageForm_blue.wgae_item_13,
                    wgae_item_13_title: vm.wageForm_blue.wgae_item_13_title,
                    wgae_item_14: vm.wageForm_blue.wgae_item_14,
                    wgae_item_14_title: vm.wageForm_blue.wgae_item_14_title,
                    wgae_item_15: vm.wageForm_blue.wgae_item_15,
                    wgae_item_15_title: vm.wageForm_blue.wgae_item_15_title,
                    wgae_item_16: vm.wageForm_blue.wgae_item_16,
                    wgae_item_16_title: vm.wageForm_blue.wgae_item_16_title,

                    // withholding_item_1: vm.wageForm.withholding_item_1,
                    withholding_item_2: vm.wageForm_yellow.withholding_item_2,
                    withholding_item_3: vm.wageForm_yellow.withholding_item_3,
                    withholding_item_4: vm.wageForm_yellow.withholding_item_4,
                    withholding_item_5: vm.wageForm_yellow.withholding_item_5,
                    withholding_item_5_title: vm.wageForm_yellow.withholding_item_5_title,

                    green_item_1: vm.wageForm_green.green_item_1,
                    green_item_2: vm.wageForm_green.green_item_2,
                    green_item_3: vm.wageForm_green.green_item_3,
                    green_item_4: vm.wageForm_green.green_item_4,
                    green_item_5: vm.wageForm_green.green_item_5,
                    green_item_6: vm.wageForm_green.green_item_6,
                    green_item_7: vm.wageForm_green.green_item_7,
                    green_item_8: vm.wageForm_green.green_item_8,
                    green_item_8_title: vm.wageForm_green.green_item_8_title,
                    green_item_9: vm.wageForm_green.green_item_9,
                    green_item_9_title: vm.wageForm_green.green_item_9_title,
                    green_item_10: vm.wageForm_green.green_item_10,
                    green_item_10_title: vm.wageForm_green.green_item_10_title,

                    // 工讀生
                    blue_item_1: vm.wageForm_blue_servitor == undefined ? "0" : vm.wageForm_blue_servitor.blue_item_1,
                    blue_item_1_hour: vm.wageForm_blue_servitor == undefined ? "0" : vm.wageForm_blue_servitor.blue_item_1_hour,
                    blue_item_2: vm.wageForm_blue_servitor == undefined ? "0" : vm.wageForm_blue_servitor.blue_item_2,
                    blue_item_3: vm.wageForm_blue_servitor == undefined ? "0" : vm.wageForm_blue_servitor.blue_item_3,
                    blue_item_4: vm.wageForm_blue_servitor == undefined ? "0" : vm.wageForm_blue_servitor.blue_item_4,
                    blue_item_5: vm.wageForm_blue_servitor == undefined ? "0" : vm.wageForm_blue_servitor.blue_item_5,
                    blue_item_6: vm.wageForm_blue_servitor == undefined ? "0" : vm.wageForm_blue_servitor.blue_item_6,
                    blue_item_6_title: vm.wageForm_blue_servitor == undefined ? "0" : vm.wageForm_blue_servitor.blue_item_6_title,
                    blue_item_7: vm.wageForm_blue_servitor == undefined ? "0" : vm.wageForm_blue_servitor.blue_item_7,
                    blue_item_7_title: vm.wageForm_blue_servitor == undefined ? "0" : vm.wageForm_blue_servitor.blue_item_7_title,

                }

                console.log(formData);

                WageManageUtil.updateUserWageMain(formData)
                    .success(function (res) {

                        toastr.success('儲存成功', 'Success');
                    })
                    .error(function (res) {

                    })


            }

            $scope.listenMonth = function(dom){
                dom.$watch('myMonth',function(newValue, oldValue) {
                    if (dom.isShiftMonthSelect) {
                        dom.isShiftMonthSelect = false;
                        $scope.changeWageMonth(0, dom.monthPickerDom);
                    }
                });
            }

            $scope.listenMonth_person = function(dom){
                dom.$watch('myMonth',function(newValue, oldValue) {
                    if (dom.isShiftMonthSelect) {
                        dom.isShiftMonthSelect = false;
                        $scope.changeWageMonth_person(0, dom.monthPickerDom);
                    }
                });
            }

            // 俸給設定
            $scope.changeWageMonth = function(changeCount, dom) {

                $scope.monthPicker = dom;

                dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
                dom.myDT = moment(dom.myDT).add(changeCount, 'M');

                var year = parseInt(dom.myDT.year()) - 1911;
                var month = parseInt(dom.myDT.month()) + 1;

                specificYear = year;
                specificMonth = month;

                $scope.showWageTable();
            }

            $scope.changeWageMonth_person = function(changeCount, dom) {

                $scope.monthPicker = dom;

                dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
                dom.myDT = moment(dom.myDT).add(changeCount, 'M');

                var year = parseInt(dom.myDT.year()) - 1911;
                var month = parseInt(dom.myDT.month()) + 1;

                specificYear = year;
                specificMonth = month;

                $scope.showWageTable($scope.userDID);
            }

            //
            $scope.getTotalWage_blue = function () {
                vm.wageForm_blue = this;
                var total_wage_temp =
                    (isNaN(this.wgae_item_1) ? 0 : parseInt(this.wgae_item_1)) +
                    (isNaN(this.wgae_item_2) ? 0 : parseInt(this.wgae_item_2)) +
                    (isNaN(this.wgae_item_3) ? 0 : parseInt(this.wgae_item_3)) +
                    (isNaN(this.wgae_item_4) ? 0 : parseInt(this.wgae_item_4)) +
                    (isNaN(this.wgae_item_5) ? 0 : parseInt(this.wgae_item_5)) +
                    ($scope.showTotalWorkOffMoney_wage() * -1) +
                    // (isNaN(this.wgae_item_6) ? 0 : parseInt(this.wgae_item_6)) +
                    (isNaN(this.wgae_item_7) ? 0 : parseInt(this.wgae_item_7)) +
                    (isNaN(this.wgae_item_8) ? 0 : parseInt(this.wgae_item_8)) +
                    (isNaN(this.wgae_item_9) ? 0 : parseInt(this.wgae_item_9)) +
                    (isNaN(this.wgae_item_10) ? 0 : parseInt(this.wgae_item_10)) +
                    (isNaN(this.wgae_item_11) ? 0 : parseInt(this.wgae_item_11)) +
                    (isNaN(this.wgae_item_12) ? 0 : parseInt(this.wgae_item_12)) +
                    (isNaN(this.wgae_item_13) ? 0 : parseInt(this.wgae_item_13)) +
                    (isNaN(this.wgae_item_14) ? 0 : parseInt(this.wgae_item_14)) +
                    (isNaN(this.wgae_item_15) ? 0 : parseInt(this.wgae_item_15)) +
                    (isNaN(this.wgae_item_16) ? 0 : parseInt(this.wgae_item_16));

                this.total_wage = total_wage_temp.toLocaleString();
            }

            $scope.getTotalWage_yellow = function () {

                vm.wageForm_yellow = this;

                var total_withholding =
                    // (isNaN(this.withholding_item_1) ? 0 : parseInt(this.withholding_item_1)) +
                    ($scope.showTotalOTMoney_wage() * 1) +
                    + $scope.exchange_observed_money +
                    $scope.exchange_special_money +
                    // (isNaN(this.withholding_item_2) ? 0 : parseInt(this.withholding_item_2)) +
                    (isNaN(this.withholding_item_3) ? 0 : parseInt(this.withholding_item_3)) +
                    (isNaN(this.withholding_item_4) ? 0 : parseInt(this.withholding_item_4)) +
                    (isNaN(this.withholding_item_5) ? 0 : parseInt(this.withholding_item_5));

                this.total_wage_withholding = total_withholding.toLocaleString();
            }

            $scope.getTotalWage_green = function () {

                vm.wageForm_green = this;

                var total_green =
                    (isNaN(this.green_item_1) ? 0 : parseInt(this.green_item_1)) +
                    (isNaN(this.green_item_2) ? 0 : parseInt(this.green_item_2)) +
                    (isNaN(this.green_item_3) ? 0 : parseInt(this.green_item_3)) +
                    (isNaN(this.green_item_4) ? 0 : parseInt(this.green_item_4)) +
                    (isNaN(this.green_item_5) ? 0 : parseInt(this.green_item_5)) +
                    (isNaN(this.green_item_6) ? 0 : parseInt(this.green_item_6)) +
                    (isNaN(this.green_item_7) ? 0 : parseInt(this.green_item_7)) +
                    (isNaN(this.green_item_8) ? 0 : parseInt(this.green_item_8)) +
                    (isNaN(this.green_item_9) ? 0 : parseInt(this.green_item_9)) +
                    (isNaN(this.green_item_10) ? 0 : parseInt(this.green_item_10));

                this.total_wage_green = total_green.toLocaleString();
            }

            $scope.getTotalWage_servitor = function () {

                vm.wageForm_blue_servitor = this;

                var total_wage_temp =
                    ((isNaN(this.blue_item_1) ? 0 : parseInt(this.blue_item_1)) *
                        (isNaN(this.blue_item_1_hour) ? 0 : parseFloat(this.blue_item_1_hour))) +
                    (isNaN(this.blue_item_2) ? 0 : parseInt(this.blue_item_2)) +
                    (isNaN(this.blue_item_3) ? 0 : parseInt(this.blue_item_3)) +
                    (isNaN(this.blue_item_4) ? 0 : parseInt(this.blue_item_4)) +
                    (isNaN(this.blue_item_5) ? 0 : parseInt(this.blue_item_5)) +
                    (isNaN(this.blue_item_6) ? 0 : parseInt(this.blue_item_6)) +
                    (isNaN(this.blue_item_7) ? 0 : parseInt(this.blue_item_7));

                this.total_wage_servitor = total_wage_temp.toLocaleString();
            }

        } // End of function
    }

)();


