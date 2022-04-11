/**
 * @author Ichen.chu
 * created on 17.06.2020
 */
(function () {
        'use strict';
        angular.module('BlurAdmin.pages.myForms')
            .controller('hrMachineFormRemedyCtrl',
                [
                    '$scope',
                    '$rootScope',
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
                    HrMachineFormRemedyCtrl
                ]);

        /** @ngInject */
        function HrMachineFormRemedyCtrl($scope,
                                         $rootScope,
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
                    // vm.executiveUsers = allUsers;
                    // vm.allUsers = allUsers;
                    $scope.allUsers = [];
                    $scope.allUsers[0] = {
                        value: "",
                        name: "None"
                    };
                    for (var i = 0; i < allUsers.length; i++) {
                        $scope.allUsers[i] = {
                            value: allUsers[i]._id,
                            name: allUsers[i].name
                        };
                    }
                });

            var formData = {
                userDID: cookies.get('userDID'),
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
                        $scope.getRemedyHrData();
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

            // Insert WorkOff Item
            $scope.insertRemedyItem = function (time) {
                return $timeout(function () {
                    // var tableItem = $scope.redemyTablesItems[$scope.redemyTablesItems.length - 1];

                    var formData = {
                        creatorDID: $scope.userDID,
                        workType: -1,
                        year: specificYear,
                        month: thisMonth,
                        day: thisDay,
                        start_time: "",
                        end_time: "",
                        //RIGHT
                        isSendReview: false,
                        isBossCheck: false,
                        isExecutiveCheck: false,
                        userMonthSalary: $scope.userMonthSalary,
                        timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
                    }
                    RemedyUtil.insertRemedyItemToDB(formData)
                        .success(function (res) {
                            $scope.getRemedyHrData();
                        })
                }, time);
            }

            $scope.removeRemedyItem = function (index) {
                var formData = {
                    tableID: $scope.redemyTablesItems[index]._id
                }

                RemedyUtil.removeRemedyItemFromDB(formData)
                    .success(function (res) {
                        $scope.getRemedyHrData();
                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.removeWorkOffTableItem');
                    })
            };


            // 顯示補登類別
            $scope.showWRemedyTypeString = function (type) {
                // console.log(type)
                switch (type) {
                    case "1":
                        return "補登上班"
                    case "2":
                        return "補登下班"
                }
            }

            // Send WorkOffTable to Review
            $scope.reviewRemedyItem = function (table, button, index) {
                $timeout(function () {
                    var remedyString = $scope.showWRemedyTypeString($scope.redemyTablesItems[index].workType);
                    $scope.checkText = '確定提交 ' + remedyString + '：' +
                        DateUtil.getShiftDatefromFirstDate(
                            DateUtil.getFirstDayofThisWeek(moment($scope.redemyTablesItems[index].create_formDate)),
                            $scope.redemyTablesItems[index].day === 0 ? 6 : $scope.redemyTablesItems[index].day - 1) +
                        "  審查？";

                    $scope.checkingTable = table;
                    $scope.checkingButton = button;
                    $scope.checkingIndex = index;

                    if (table.start_time == "") {
                        toastr.error('輸入法異常', '（時間輸入格式錯誤，可能有輸入到中文、注音、英文字母、請重新整理後再次輸入）');
                        return;
                    }

                    if (table.start_time.length != 5) {
                        toastr.error('時間異常', '（時間輸入格式錯誤，請輸入完整 HH:MM）');
                        return;
                    }

                    ngDialog.open({
                        template: 'app/pages/myModalTemplate/remedyFormReviewModal.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: false,
                    });
                }, 100)
            }

            //跟後臺溝通
            $scope.sendRemedyItemReview = function (checkingTable, checkingButton, checkingIndex) {
                checkingButton.rowform1.$waiting = true;
                var formData = {
                    _id: checkingTable._id,

                    workType: checkingTable.workType,
                    create_formDate: checkingTable.create_formDate,
                    year: checkingTable.year,
                    month: checkingTable.month,
                    day: checkingTable.day,
                    start_time: checkingTable.start_time,
                    end_time: checkingTable.end_time,

                    reason: checkingTable.reason,

                    userMonthSalary: checkingTable.userMonthSalary,
                    isSendReview: true,

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
                        $scope.getRemedyHrData();
                    })
            }

            $scope.getRemedyHrData = function() {

                bsLoadingOverlayService.start({
                    referenceId: 'overlay_hrMachine'
                });

                var formData = {
                    creatorDID: $scope.userDID,
                    year: specificYear,
                }
                RemedyUtil.fetchRemedyItemFromDB(formData)
                    .success(function (res) {
                        $scope.redemyTablesItems = res.payload;
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'overlay_hrMachine'
                            });
                            $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                        }, 200)
                    })
            }

            $scope.remedyTimeChange = function (dom) {
                dom.table.start_time = dom.tableTimeStart;
            }

        } // End of function
    }
)();