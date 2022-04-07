(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgWorkManage')
        .controller('travelApplicationBossReviewCtrl',
            [
                '$scope',
                '$http',
                '$filter',
                '$cookies',
                'ngDialog',
                '$uibModal',
                'User',
                'Project',
                'ProjectUtil',
                'TravelApplicationUtil',
                'UpdateActionUtil',
                '$compile',
                travelApplicationBossReviewCtrl
            ]);

    /**
     * @ngInject
     */
    function travelApplicationBossReviewCtrl($scope,
                                         $http,
                                         $filter,
                                         $cookies,
                                         ngDialog,
                                         $uibModal,
                                         User,
                                         Project,
                                         ProjectUtil,
                                         TravelApplicationUtil,
                                         UpdateActionUtil,
                                         $compile) {

        var vm = this;

        $scope.roleType = $cookies.get('roletype');
        $scope.userDID = $cookies.get('userDID');

        var creatorDIDArray = [];

        $scope.getBossReviewData = function () {

            document.getElementById('includeHead_review_boss').innerHTML = "";

            for (var index = 0; index < $scope.allUsers.length; index++) {
                if ($scope.allUsers[index].bossID === $scope.userDID) {
                    creatorDIDArray.push($scope.allUsers[index].value);
                }
            }

            var formData = {
                creatorDIDList: creatorDIDArray
            }

            $http.post('/api/post_travel_application_search_item_2', formData)
                .success(function (response) {
                    $scope.travelApplicationReviewItems = response.payload;
                    $scope.travelApplicationReviewItems.slice(0, response.payload.length);

                    angular.element(
                        document.getElementById('includeHead_review_boss'))
                        .append($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'待審列表 - " + response.payload.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/myForms/travelApplication/table/travelApplicationReviewTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                });
        }

        Project.findAll()
            .success(function (allProjects) {
                console.log(" ======== related login user Projects ======== ");
                vm.projects = allProjects.slice();
                $scope.allProjectCache = [];
                for (var index = 0; index < allProjects.length; index++) {

                    // 專案名稱顯示規則 2019/07 定義
                    var nameResult = "";
                    if (allProjects[index].prjSubName != undefined && allProjects[index].prjSubName.trim() != "") {
                        nameResult = allProjects[index].prjSubName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    } else if (allProjects[index].prjName != undefined && allProjects[index].prjName.trim() != "") {
                        nameResult = allProjects[index].prjName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    } else {
                        nameResult = allProjects[index].mainName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    }

                    $scope.allProjectCache[index] = {
                        prjDID: allProjects[index]._id,
                        prjCode: allProjects[index].prjCode,
                        mainName: allProjects[index].mainName + " - "
                        + allProjects[index].prjName + " - "
                        + allProjects[index].prjSubName + " - "
                        + ProjectUtil.getTypeText(allProjects[index].type),
                        majorID: allProjects[index].majorID,
                        managerID: allProjects[index].managerID,
                        ezName: nameResult,
                        combinedID: allProjects[index].combinedID,
                    };
                }
            });

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
                        name: allUsers[i].name,
                        bossID: allUsers[i].bossID
                    };
                }
            })

        // *** Filter ***
        $scope.showPrjCodeWithCombine = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].prjCode : 'Not Set';
        };

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

        $scope.showProjectManager = function (prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID
                });
            }
            if (majorSelected == undefined) return 'Not Set';
            var managerDID = majorSelected[0].managerID;
            var selected = [];
            if (managerDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: managerDID
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].name : 'Not Set';
        };

        // Send Travel Application to Review
        $scope.approveTravelApplicationItem = function (table) {
            var workOffString = $scope.showApplier(table.creatorDID) + ", " +
                table.taStartDate + " " +
                table.start_time + " ~ " +
                table.taEndDate + " " +
                table.end_time;

            $scope.checkText = '確定同意 ' + workOffString + '：' + "  申請？";
            $scope.checkingItem = table;
            ngDialog.open({
                template: 'app/pages/myForms/travelApplication/modal/travelApplicationApproveModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //跟後臺溝通
        $scope.sendTravelApplicationApprove = function (travelApplicationItem) {
            var formData = {
                _id: travelApplicationItem._id,

                isSendReview: true,
                isManagerCheck: true,
                isBossCheck: true,

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "bossAgree"
            }
            TravelApplicationUtil.updateTravelApplicationItem(formData)
                .success(function (resp) {
                    $scope.getBossReviewData();
                })
        }

        // Send Travel Application to deny
        $scope.denyTravelApplicationItem = function (table) {
            var workOffString = $scope.showApplier(table.creatorDID) + ", " +
                table.taStartDate + " " +
                table.start_time + " ~ " +
                table.taEndDate + " " +
                table.end_time;

            $scope.checkText = '確定退回 ' + workOffString + '：' + "  申請？";
            $scope.checkingItem = table;
            ngDialog.open({
                template: 'app/pages/myForms/travelApplication/modal/travelApplicationApproveModal_Deny.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //跟後臺溝通
        $scope.sendTravelApplicationApprove_Deny = function (travelApplicationItem, rejectMsg) {
            var formData = {
                _id: travelApplicationItem._id,

                isSendReview: false,
                isManagerCheck: false,
                isManagerReject: false,
                isBossReject: true,
                bossReject_memo: rejectMsg,

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "bossReject"
            }

            TravelApplicationUtil.updateTravelApplicationItem(formData)
                .success(function (resp) {
                    $scope.getBossReviewData();
                })
        }

        $scope.showUpdateAction = function (action) {
            return UpdateActionUtil.convertAction(action);
        }

    }

})();