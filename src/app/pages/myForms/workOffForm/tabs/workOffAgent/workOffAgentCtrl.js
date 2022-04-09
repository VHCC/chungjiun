/**
 * @author Ichen.chu
 * created on 19.02.2020
 */
(function () {
        'user strict';

        angular.module('BlurAdmin.pages.myForms')
            .controller('workOffAgentCtrl',
                [
                    '$scope',
                    '$rootScope',
                    '$filter',
                    '$cookies',
                    '$uibModal',
                    '$timeout',
                    'ngDialog',
                    'DateUtil',
                    'User',
                    'Project',
                    'WorkOffFormUtil',
                    'UpdateActionUtil',
                    'bsLoadingOverlayService',
                    '$compile',
                    WorkOffAgentCtrl
                ]);
        /**
         * @ngInject
         */
        function WorkOffAgentCtrl($scope,
                                 $rootScope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 $timeout,
                                 ngDialog,
                                 DateUtil,
                                 User,
                                 Project,
                                 WorkOffFormUtil,
                                 UpdateActionUtil,
                                 bsLoadingOverlayService,
                                 $compile) {
            var vm = this;
            $scope.userDID = $cookies.get('userDID');

            Project.findAll()
                .success(function (relatedProjects) {
                    console.log(" ======== related login user Projects ======== ");
                    $scope.relatedProjects = [];
                    for (var i = 0; i < relatedProjects.length; i++) {
                        $scope.relatedProjects[i] = {
                            value: relatedProjects[i]._id,
                            managerID: relatedProjects[i].managerID
                        };
                    }
                });

            User.getAllUsers()
                .success(function (allUsers) {
                    $scope.allUsersCache = allUsers;
                    // 經理、主承辦
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
                })

            // *** Biz Logic ***
            $scope.showApplier = function (item) {
                var selected = [];
                if ($scope.allUsers === undefined) return;
                if (item.creatorDID) {
                    selected = $filter('filter')($scope.allUsers, {
                        value: item.creatorDID
                    });
                }
                return selected.length ? selected[0].name : 'Not Set';
            }

            $scope.showCharger = function (officialItem) {
                var selected = [];
                if ($scope.allUsers === undefined) return;
                if (officialItem.chargerDID) {
                    selected = $filter('filter')($scope.allUsers, {
                        value: officialItem.chargerDID
                    });
                }
                return selected.length ? selected[0].name : 'Not Set';
            }

            $scope.showSigner = function (officialItem) {
                var selected = [];
                if ($scope.allUsers === undefined) return;
                if (officialItem.signerDID) {
                    selected = $filter('filter')($scope.allUsers, {
                        value: officialItem.signerDID
                    });
                }
                return selected.length ? selected[0].name : 'Not Set';
            }

            $scope.showManager = function (officialItem) {
                var selected = [];
                if ($scope.relatedProjects === undefined) return;
                if (officialItem.prjDID) {
                    selected = $filter('filter')($scope.relatedProjects, {
                        value: officialItem.prjDID
                    });
                }
                var selected_manager = [];
                if (selected.length) {
                    selected_manager = $filter('filter')($scope.allUsers, {
                        value: selected[0].managerID
                    });
                }
                return selected_manager.length ? selected_manager[0].name : 'Not Set';
            }

            // *********************** 審核 ************************

            $scope.findWorkOffItemByUserDID_agent = function () {

                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_workOff'
                });

                var formData = {
                    // creatorDID: userSelected._id,
                    agentID: $scope.userDID,
                    isSendReview: true,
                    isAgentCheck: false,
                };
                $scope.agentCheckWorkOffItems = [];
                WorkOffFormUtil.findWorkOffTableItemByParameter(formData)
                    .success(function (res) {
                        for (var index = 0; index < res.payload.length; index++) {
                            if (res.payload[index].agentID == $scope.userDID) {
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
                                    // userHourSalary: res.payload[index].userHourSalary,
                                    userMonthSalary: res.payload[index].userMonthSalary,

                                    agentID: res.payload[index].agentID,
                                    fileMapNumber: res.payload[index].fileMapNumber,

                                    updateTs: res.payload[index].updateTs,
                                    updateAction: res.payload[index].updateAction,
                                };
                                $scope.agentCheckWorkOffItems.push(detail);
                            }
                        }
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_workOff'
                            });
                            $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                        },200);
                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.findWorkOffTableItemByParameter');
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_workOff'
                            });
                        },200);
                    })
            }

            $scope.findWorkOffItemByUserDID_agent();

            //代理人確認
            $scope.reviewAgentItem = function (table, index) {
                $scope.checkText = '確定 同意 [代理]：' + $scope.showApplier(table) + " " +
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
                    isAgentCheck: true,

                    updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                    updateAction: "agentAgree"
                }

                WorkOffFormUtil.updateWorkOffItem(formData)
                    .success(function (res) {
                        $scope.findWorkOffItemByUserDID_agent();
                    })
            }

            //代理人退回
            $scope.disagreeItem_agent = function (table, index) {
                $scope.checkText = '確定 退回：' + $scope.showApplier(table) + " " +
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

                    isAgentCheck: false,
                    isAgentReject: true,
                    agentReject_memo: rejectMsg,

                    isBossCheck: false,
                    isBossReject: false,

                    isExecutiveCheck: false,
                    isExecutiveReject: false,

                    updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                    updateAction: "agentReject"
                }

                WorkOffFormUtil.updateWorkOffItem(formData)
                    .success(function (res) {
                        $scope.findWorkOffItemByUserDID_agent();
                    })
            }

            $scope.showUpdateAction = function (action) {
                return UpdateActionUtil.convertAction(action);
            }
        }// End of function
    }
)();