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
                    '$filter',
                    '$cookies',
                    '$uibModal',
                    'ngDialog',
                    'DateUtil',
                    'User',
                    'Project',
                    'WorkOffFormUtil',
                    '$compile',
                    WorkOffAgentCtrl
                ]);

        /**
         * @ngInject
         */
        function WorkOffAgentCtrl($scope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 ngDialog,
                                 DateUtil,
                                 User,
                                 Project,
                                 WorkOffFormUtil,
                                 $compile) {
            var vm = this;

            $scope.userDID = $cookies.get('userDID');

            var formData = {
                userDID: $scope.userDID
            }

            $scope.agentUsers = [];

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
                    // console.log(allUsers);
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

                    WorkOffFormUtil.fetchAllAgentItem(formData)
                        .success(function (resp) {
                            $scope.agentUsers = [];
                            for (var index = 0; index < resp.payload.length; index ++) {
                                var selected = [];
                                selected = $filter('filter')($scope.allUsers, {
                                    value: resp.payload[index]._id
                                });
                                if (selected.length) {
                                    var user = {
                                        _id: selected[0].value,
                                        name: selected[0].name,
                                        count: resp.payload[index].count
                                    }
                                    $scope.agentUsers.push(user);
                                }
                            }
                        })
                })

            $scope.fetchAllAgentItems = function () {
                WorkOffFormUtil.fetchAllAgentItem(formData)
                    .success(function (resp) {
                        console.log(resp);
                        $scope.agentUsers = [];
                        for (var index = 0; index < resp.payload.length; index ++) {
                            var selected = [];
                            selected = $filter('filter')($scope.allUsers, {
                                value: resp.payload[index]._id
                            });
                            if (selected.length) {
                                var user = {
                                    _id: selected[0].value,
                                    name: selected[0].name,
                                    count: resp.payload[index].count
                                }
                                $scope.agentUsers.push(user);
                            }
                        }
                    })
            }


            // *** Biz Logic ***

            $scope.showReceiver = function (officialItem) {
                var selected = [];
                if ($scope.allUsers === undefined) return;
                if (officialItem.creatorDID) {
                    selected = $filter('filter')($scope.allUsers, {
                        value: officialItem.creatorDID
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

            $scope.findWorkOffItemByUserDID_agent = function (userSelected) {

                console.log(userSelected);

                var formData = {
                    creatorDID: userSelected._id,
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

                                };
                                $scope.agentCheckWorkOffItems.push(detail);
                            }

                        }
                    })
                    .error(function () {
                        console.log('ERROR WorkOffFormUtil.findWorkOffTableItemByParameter');
                    })
            }

            //代理人確認
            $scope.reviewAgentItem = function (table, index) {
                $scope.checkText = '確定 同意 [代理]：' + vm.agentItem.selected.name + " " +
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
                }

                WorkOffFormUtil.updateWorkOffItem(formData)
                    .success(function (res) {
                        $scope.findWorkOffItemByUserDID_agent(vm.agentItem.selected);
                    })
            }

            //代理人退回
            $scope.disagreeItem_agent = function (table, index) {
                console.log(table);
                $scope.checkText = '確定 退回：' + vm.agentItem.selected.name + " " +
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
                }

                WorkOffFormUtil.updateWorkOffItem(formData)
                    .success(function (res) {
                        $scope.findWorkOffItemByUserDID_agent(vm.agentItem.selected);
                    })
            }
        }// End of function
    }
)();