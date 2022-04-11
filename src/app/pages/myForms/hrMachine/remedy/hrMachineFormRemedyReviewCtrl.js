/**
 * @author Ichen.chu
 * created on 17.06.2020
 */
(function () {
        'use strict';
        angular.module('BlurAdmin.pages.myForms')
            .controller('hrMachineFormRemedyReviewCtrl',
                [
                    '$scope',
                    '$rootScope',
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
                    HrMachineFormRemedyReviewCtrl
                ]);

        /** @ngInject */
        function HrMachineFormRemedyReviewCtrl($scope,
                                               $rootScope,
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
            document.getElementById('includeHead_review').innerHTML = "";

            $scope.roleType = $cookies.get('roletype');
            $scope.relatedUserDIDArray_Boss = JSON.parse($cookies.get('relatedUserDIDArray_Boss'));


            var creatorDIDArray = [];

            $scope.getReviewData = function () {

                document.getElementById('includeHead_review').innerHTML = "";

                // for (var index = 0; index < $scope.allUsers.length; index++) {
                //     if ($scope.allUsers[index].bossID === $cookies.get('userDID')) {
                //         creatorDIDArray.push($scope.allUsers[index]._id)
                //     }
                // }

                var formData = {
                    creatorDIDList: $scope.relatedUserDIDArray_Boss
                }

                $http.post('/api/post_hr_remedy_search_item_review', formData)
                    .success(function (response) {

                        $scope.remedyReviewItems = response.payload;
                        $scope.remedyReviewItems.slice(0, response.payload.length);

                        angular.element(
                            document.getElementById('includeHead_review'))
                            .append($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'待審列表 - " + response.payload.length + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/pages/myForms/hrMachine/remedy/table/remedyReviewTable.html'\">" +
                                "</div>" +
                                "</div>"
                            )($scope));
                        $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                    });
            }

            User.getAllUsers()
                .success(function (allUsers) {
                    // 經理、主承辦、主管
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

                    // if ($scope.roleType === '2' || $scope.roleType === '100' || $scope.roleType === '6') {
                    //     for (var index = 0; index < allUsers.length; index++) {
                    //         if (allUsers[index].bossID === $cookies.get('userDID')) {
                    //             creatorDIDArray.push(allUsers[index]._id)
                    //         }
                    //     }

                    $scope.getReviewData();
                    // }
                })


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

            // Send to Review
            $scope.approveRemedyItem = function (table) {
                var remedyString = $scope.showApplier(table.creatorDID) + ", " +
                    $scope.showRemedyDate(table) + " " +
                    table.start_time + " ";

                $scope.checkText = '確定同意 ' + remedyString + '：' + "  申請？";
                $scope.checkingItem = table;
                ngDialog.open({
                    template: 'app/pages/myForms/hrMachine/remedy/modal/remedyItemApproveModal.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: false,
                });
            }

            //跟後臺溝通
            $scope.sendRemedyItemApprove = function (remedyItem) {
                var formData = {
                    _id: remedyItem._id,

                    isSendReview: true,
                    isBossCheck: true,
                }

                RemedyUtil.updateRemedyItemFromDB(formData)
                    .success(function (res) {
                        $scope.getReviewData();
                    })

            }

            // 顯示補登類別
            $scope.showWRemedyTypeString = function (type) {
                switch (type) {
                    case "1":
                        return "補登上班"
                    case "2":
                        return "補登下班"
                }
            }

            // Send Travel Application to deny
            $scope.denyRemedyItem = function (table) {
                var remedyString = $scope.showApplier(table.creatorDID) + ", " +
                    $scope.showRemedyDate(table) + " " +
                    table.start_time + " ";

                $scope.checkText = '確定退回 ' + remedyString + '：' + "  申請？";
                $scope.checkingItem = table;
                ngDialog.open({
                    template: 'app/pages/myForms/hrMachine/remedy/modal/remedyItemModal_Deny.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: false,
                });
            }

            //跟後臺溝通
            $scope.sendRemedyItem_Deny = function (item, rejectMsg) {
                var formData = {
                    _id: item._id,

                    isSendReview: false,
                    isBossReject: true,
                    bossReject_memo: rejectMsg,
                }

                RemedyUtil.updateRemedyItemFromDB(formData)
                    .success(function (res) {
                        $scope.getReviewData();
                    })
            }

        } // End of function
    }
)();