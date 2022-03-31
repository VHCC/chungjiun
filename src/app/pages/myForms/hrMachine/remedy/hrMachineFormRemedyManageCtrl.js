/**
 * @author IChen.chu
 * created on 31.03.2022
 */
(function () {
        'use strict';
        angular.module('BlurAdmin.pages.myForms')
            .controller('hrMachineFormRemedyManageCtrl',
                [
                    '$scope',
                    '$http',
                    '$filter',
                    '$cookies',
                    '$timeout',
                    '$compile',
                    'ngDialog',
                    'User',
                    'DateUtil',
                    'TimeUtil',
                    'RemedyUtil',
                    'bsLoadingOverlayService',
                    'toastr',
                    hrMachineFormRemedyManageCtrl
                ]);

        /** @ngInject */
        function hrMachineFormRemedyManageCtrl($scope,
                                            $http,
                                            $filter,
                                            $cookies,
                                            $timeout,
                                            $compile,
                                            ngDialog,
                                            User,
                                            DateUtil,
                                            TimeUtil,
                                            RemedyUtil,
                                            bsLoadingOverlayService,
                                            toastr) {
            var vm = this;
            $scope.roleType = $cookies.get('roletype');

            // // 所有人，對照資料
            User.getAllUsers()
                .success(function (allUsers) {

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

                    vm.users = allUsers;
                    vm.users = vm.users.sort(function (a, b) {
                        return a.machineDID > b.machineDID ? 1 : -1;
                    });
                });

            $scope.getRemedyHistoryData = function(user) {
                bsLoadingOverlayService.start({
                    referenceId: 'overlay_hrMachine'
                });

                var formData = {
                    creatorDID: user._id,
                    isSendReview: true,
                }
                RemedyUtil.fetchRemedyItemFromDB(formData)
                    .success(function (res) {
                        console.log(res);
                        document.getElementById('includeHead_manage').innerHTML = "";

                        $scope.remedyTablesItems = res.payload;
                        $scope.remedyTablesItems.slice(0, res.payload.length);

                        angular.element(
                            document.getElementById('includeHead_manage'))
                            .append($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'補登列表 - " + res.payload.length + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/pages/myForms/hrMachine/remedy/table/remedyManageTable.html'\">" +
                                "</div>" +
                                "</div>"
                            )($scope));

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'overlay_hrMachine'
                            });
                        }, 300)
                    })
            }

            $scope.showApplier = function (userDID) {
                var selected = [];
                if (userDID) {
                    selected = $filter('filter')($scope.allUsers, {
                        value: userDID
                    });
                }
                if (!selected) return 'Not Set'
                return selected.length > 0 ? selected[0].name : 'Not Set';
            }

            $scope.showRemedyDate = function (table) {
                return DateUtil.getShiftDatefromFirstDate(
                    DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                    table.day === 0 ? 6 : table.day - 1);
            }

            // Send Travel Application to deny
            $scope.denyRemedyItem = function (table) {
                var remedyString = $scope.showApplier(table.creatorDID) + ", " +
                    $scope.showRemedyDate(table) + " " +
                    table.start_time + " ";

                $scope.checkText = '確定退回 ' + remedyString + '：' + "  補登？";
                $scope.checkingItem = table;
                ngDialog.open({
                    template: 'app/pages/myForms/hrMachine/remedy/modal/remedyItemModal_Cancel.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: false,
                });
            }

            //跟後臺溝通
            $scope.sendRemedyItem_Cancel = function (item) {
                var formData = {
                    _id: item._id,

                    isSendReview: false,
                    isBossCheck: false,
                    isExecutiveCheck: false,
                    isExecutiveReject: false,
                    // executiveReject_memo: rejectMsg,
                }

                RemedyUtil.updateRemedyItemFromDB(formData)
                    .success(function (res) {
                        $scope.getRemedyHistoryData(vm.user.selected);
                    })
            }


        } // End of function
    }
)();