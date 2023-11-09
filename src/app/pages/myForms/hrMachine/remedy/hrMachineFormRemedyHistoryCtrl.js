/**
 * @author IChen.chu
 * created on 01.07.2020
 */
(function () {
        'use strict';
        angular.module('BlurAdmin.pages.myForms')
            .controller('hrMachineFormRemedyHistoryCtrl',
                [
                    '$scope',
                    '$filter',
                    '$cookies',
                    '$timeout',
                    '$compile',
                    'ngDialog',
                    'User',
                    'DateUtil',
                    'TimeUtil',
                    'Project',
                    'RemedyUtil',
                    'bsLoadingOverlayService',
                    'toastr',
                    hrMachineFormRemedyHistoryCtrl
                ]);

        /** @ngInject */
        function hrMachineFormRemedyHistoryCtrl($scope,
                                            $filter,
                                            cookies,
                                            $timeout,
                                            $compile,
                                            ngDialog,
                                            User,
                                            DateUtil,
                                            TimeUtil,
                                            Project,
                                            RemedyUtil,
                                            bsLoadingOverlayService,
                                            toastr) {
            var vm = this;

            var loginUserDID = cookies.get('userDID');

            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;
            var thisDay = new Date().getDay();

            var specificYear = thisYear;
            var specificMonth = thisMonth;

            // 主要顯示
            $scope.redemyTablesItems = [];

            // // 所有人，對照資料
            User.getAllUsers()
                .success(function (allUsers) {
                    vm.users = allUsers;
                });

            var formData = {
                userDID: loginUserDID,
            }
            User.findUserByUserDID(formData)
                .success(function (user) {
                    $scope.userMonthSalary = user.userMonthSalary;
                    $scope.bossID = user.bossID;
                })

            $scope.listenYear = function (dom) {
                dom.$watch('myYear',function(newValue, oldValue) {
                    if (dom.isShiftYearSelect) {
                        dom.isShiftYearSelect = false;
                        $scope.year = specificYear = newValue - 1911;
                        $scope.getRemedyHistoryData(vm.user.selected);
                    }
                });
            }

            $scope.showBoss = function (bossID) {
                var selected = [];
                if (bossID) {
                    selected = $filter('filter')($scope.allUsers, {
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

            $scope.showDay = function (day) {
                return DateUtil.getDay(day)
            }

            $scope.showDate = function (table) {
                return DateUtil.getShiftDatefromFirstDate(
                    DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                    table.day === 0 ? 6 : table.day - 1);
            }

            // 新增補打卡
            $scope.addHrRemedyItem = function () {
                // var inserted = {
                //     creatorDID: $scope.userDID,
                //     remedyType: -1,
                //     year: thisYear,
                //     month: thisMonth,
                //     day: thisDay,
                //     start_time: "",
                //     end_time: "",
                //     //RIGHT
                //     isSendReview: false,
                //     isBossCheck: false,
                //     isExecutiveCheck: false,
                //     // myDay: DateUtil.getDay(new Date().getDay()),
                //     userMonthSalary: $scope.userMonthSalary,
                // };
                // $scope.redemyTablesItems.push(inserted);

                $scope.insertRemedyItem(0);
            }

            $scope.changeRemedyType = function (dom) {
                // 個人請假
                if (dom.$parent.table != undefined) {
                    dom.$parent.table.workType = dom.workType.type;
                }
            }

            // // Insert WorkOff Item
            // $scope.insertRemedyItem = function (time) {
            //     return $timeout(function () {
            //         // var tableItem = $scope.redemyTablesItems[$scope.redemyTablesItems.length - 1];
            //         console.log("insertRemedyItem")
            //         var formData = {
            //             creatorDID: $scope.userDID,
            //             remedyType: -1,
            //             year: specificYear,
            //             month: thisMonth,
            //             day: thisDay,
            //             start_time: "",
            //             end_time: "",
            //             //RIGHT
            //             isSendReview: false,
            //             isBossCheck: false,
            //             isExecutiveCheck: false,
            //             userMonthSalary: $scope.userMonthSalary,
            //             timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
            //         }
            //         RemedyUtil.insertRemedyItemToDB(formData)
            //             .success(function (res) {
            //                 $scope.getRemedyHrData();
            //             })
            //
            //     }, time);
            // }



            // 顯示補登類別
            $scope.showWRemedyTypeString = function (type) {
                // console.log(type)
                switch (type) {
                    // case 0:
                    //     return "補登上班"
                    // case 1:
                    //     return "補登下班"
                    case 0:
                        return "上班(1)"
                    case 1:
                        return "下班(1)"
                    case 2:
                        return "上班(2)"
                    case 3:
                        return "下班(2)"

                    case 4:
                        return "加班(1)"
                    case 5:
                        return "加退(1)"
                    case 6:
                        return "加班(2)"
                    case 7:
                        return "加退(2)"
                    case 8:
                        return "加班(3)"
                    case 9:
                        return "加退(3)"
                }
            }

            // Send WorkOffTable to Review
            $scope.recoveryRemedyItem = function (table, button, index) {
                $timeout(function () {
                    console.log(table);
                    var remedyString = $scope.showWRemedyTypeString($scope.redemyTablesItems[index].workType);
                    $scope.checkText = '確定退回 ' + remedyString + '：' +
                        DateUtil.getShiftDatefromFirstDate(
                            DateUtil.getFirstDayofThisWeek(moment($scope.redemyTablesItems[index].create_formDate)),
                            $scope.redemyTablesItems[index].day === 0 ? 6 : $scope.redemyTablesItems[index].day - 1) +
                        "  審查？";

                    $scope.checkingTable = table;
                    $scope.checkingButton = button;
                    $scope.checkingIndex = index;
                    ngDialog.open({
                        template: 'app/pages/myModalTemplate/remedyFormRecoveryModal.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: false,
                    });
                }, 150)
            }
            //跟後臺溝通
            $scope.sendRemedyItemRecovery = function (checkingTable, checkingButton, checkingIndex) {
                checkingButton.rowform1.$waiting = true;
                console.log(checkingTable)
                var formData = {
                    _id: checkingTable._id,
                    isBossCheck: false,
                }

                // var targetList = [$scope.bossID];
                // var msgTopicList = [2000];
                // var msgDetailList = [2001];
                // var memoList = [$scope.showDate(checkingTable)];

                // WorkOffFormUtil.updateWorkOffItem(formData)
                //     .success(function (res) {
                //         // $scope.specificUserTablesItems[checkingIndex].isSendReview = true;
                //         $scope.getWorkOffTable(null, thisYear);
                //     })

                RemedyUtil.updateRemedyItemFromDB(formData)
                    .success(function (res) {
                        $scope.getRemedyHistoryData(vm.user.selected);
                    })
            }

            $scope.getRemedyHistoryData = function(user) {
                bsLoadingOverlayService.start({
                    referenceId: 'overlay_hrMachine'
                });

                var formData = {
                    creatorDID: user._id,
                    year: specificYear,
                }
                RemedyUtil.fetchRemedyHistoryItemFromDB(formData)
                    .success(function (res) {
                        $scope.redemyTablesItems = res.payload;
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'overlay_hrMachine'
                            });
                        }, 300)
                    })
            }

            $scope.remedyTimeChange = function (dom) {
                // console.log(dom)
                dom.table.start_time = dom.tableTimeStart;
            }

        } // End of function
    }
)();