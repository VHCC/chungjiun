/**
 * @author IChen.chu
 * created on 29.06.2020
 */
(function () {
        'use strict';
        angular.module('BlurAdmin.pages.myForms')
            .controller('supervisionNotifyCtrl',
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
                    'SuperVisionNotifyUtil',
                    'bsLoadingOverlayService',
                    'toastr',
                    supervisionNotifyCtrl
                ]);

        /** @ngInject */
        function supervisionNotifyCtrl($scope,
                                            $filter,
                                            cookies,
                                            $timeout,
                                            $compile,
                                            ngDialog,
                                            User,
                                            DateUtil,
                                            TimeUtil,
                                            Project,
                                            SuperVisionNotifyUtil,
                                            bsLoadingOverlayService,
                                            toastr) {

            var vm = this;

            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;
            var thisDate = new Date().getDate();
            var thisDay = new Date().getDay();

            var specificYear = thisYear;
            var specificMonth = thisMonth;

            // 主要顯示
            $scope.supervisionNotifyItems = [];

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
                        $scope.getSVNData();
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
                dom.table.date = dom.myDT.getDate();
                dom.table.day = dom.myDT.getDay();
            }

            $scope.showDay = function (day) {
                console.log("AAAA")
                return DateUtil.getDay(day)
            }

            $scope.showDate = function (table) {
                return DateUtil.getShiftDatefromFirstDate(
                    DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                    table.day === 0 ? 6 : table.day - 1);
            }

            // 新增監造通知物件
            $scope.addSVNItem = function () {
                $scope.insertSVNItem(0);
            }

            $scope.changeRemedyType = function (dom) {
                // 個人請假
                if (dom.$parent.table != undefined) {
                    dom.$parent.table.workType = dom.workType.type;
                }
            }

            // Insert WorkOff Item
            $scope.insertSVNItem = function (time) {
                return $timeout(function () {
                    var formData = {
                        creatorDID: $scope.userDID,
                        year: specificYear,
                        month: thisMonth,
                        date: thisDate,
                        day: thisDay,
                        start_time: "",
                        //RIGHT
                        timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
                    }
                    SuperVisionNotifyUtil.insertSVNItemToDB(formData)
                        .success(function (res) {
                            $scope.getSVNData();
                        })

                }, time);
            }

            $scope.removeSVNItem = function (index) {
                var formData = {
                    tableID: $scope.supervisionNotifyItems[index]._id
                }

                SuperVisionNotifyUtil.removeSVNItemFromDB(formData)
                    .success(function (res) {
                        $scope.getSVNData();
                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.removeWorkOffTableItem');
                    })
            };


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
            $scope.reviewSVNItem = function (table, button, index) {
                $timeout(function () {
                    console.log(table)
                    $scope.checkText = '確定提交 ' +
                        DateUtil.getShiftDatefromFirstDate(
                            DateUtil.getFirstDayofThisWeek(moment($scope.supervisionNotifyItems[index].create_formDate)),
                            $scope.supervisionNotifyItems[index].day === 0 ? 6 : $scope.supervisionNotifyItems[index].day - 1) +
                        "  審查？";

                    $scope.checkingTable = table;
                    $scope.checkingButton = button;
                    $scope.checkingIndex = index;
                    ngDialog.open({
                        template: 'app/pages/myModalTemplate/supervisionNotifyReviewModal.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        showClose: false,
                    });
                }, 150)
            }
            //跟後臺溝通
            $scope.sendSVNItemReview = function (checkingTable, checkingButton, checkingIndex) {
                checkingButton.rowform1.$waiting = true;
                var formData = {
                    _id: checkingTable._id,

                    workType: checkingTable.workType,
                    create_formDate: checkingTable.create_formDate,
                    year: checkingTable.year,
                    month: checkingTable.month,
                    date: checkingTable.date,
                    day: checkingTable.day,
                    start_time: checkingTable.start_time,

                    msg: checkingTable.msg,

                    isSetup: true,

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

                SuperVisionNotifyUtil.updateSVNItemFromDB(formData)
                    .success(function (res) {
                        $scope.getSVNData();
                    })
            }

            $scope.getSVNData = function() {

                bsLoadingOverlayService.start({
                    referenceId: 'overlay_hrMachine'
                });

                var formData = {
                    creatorDID: $scope.userDID,
                    year: specificYear,
                }
                SuperVisionNotifyUtil.fetchSVNItemFromDB(formData)
                    .success(function (res) {
                        $scope.supervisionNotifyItems = res.payload;
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'overlay_hrMachine'
                            });
                        }, 300)
                    })
            }

            $scope.remedyTimeChange = function (dom) {
                console.log(dom)
                dom.table.start_time = dom.tableTimeStart;
            }

        } // End of function
    }
)();