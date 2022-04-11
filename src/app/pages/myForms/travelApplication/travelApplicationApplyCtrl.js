(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgWorkManage')
        .controller('travelApplicationApplyCtrl',
            [
                '$scope',
                '$rootScope',
                '$filter',
                '$cookies',
                '$timeout',
                '$uibModal',
                'toastr',
                'ngDialog',
                'User',
                'Project',
                'ProjectUtil',
                'TravelApplicationUtil',
                'UpdateActionUtil',
                '$compile',
                'bsLoadingOverlayService',
                TravelApplicationApplyCtrl
            ]);
    /**
     * @ngInject
     */
    function TravelApplicationApplyCtrl(
                                    $scope,
                                    $rootScope,
                                    $filter,
                                    $cookies,
                                    $timeout,
                                    $uibModal,
                                    toastr,
                                    ngDialog,
                                    User,
                                    Project,
                                    ProjectUtil,
                                    TravelApplicationUtil,
                                    UpdateActionUtil,
                                    $compile,
                                    bsLoadingOverlayService) {

        $scope.userMonthSalary = $cookies.get('userMonthSalary');
        $scope.userDID = $cookies.get('userDID');

        var vm = this;
        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;
        $scope.year = thisYear;

        var formData = {
            userDID: $cookies.get('userDID'),
        }
        User.findUserByUserDID(formData)
            .success(function (user) {
                $scope.bossID = user.bossID;
            })

        $scope.listenYear = function (dom) {
            dom.$watch('myYear',function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.year = thisYear = newValue - 1911;
                    $scope.getUsersTravelApplicationData($scope.userDID, thisYear);
                }
            });
        }

        Project.findAll()
            .success(function (allProjects) {
                console.log(" ======== related login user Projects ======== ");
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

        $scope.initProject = function() {
            Project.findAll()
                .success(function (allProjects) {
                    $scope.allProject_raw = allProjects;
                    $scope.relatedProjects = [];
                    for (var i = 0; i < allProjects.length; i++) {
                        $scope.relatedProjects[i] = {
                            value: allProjects[i]._id,
                            managerID: allProjects[i].managerID
                        };
                    }
                    vm.projects = allProjects.slice();
                });
        }

        $scope.resetProjectData = function() {
            if (vm.prjItems) {
                vm.prjItems.selected = null;
            }
            vm.projects = $scope.allProject_raw.slice();
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
            })

        // Filter
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

        $scope.showBoss = function (bossID) {
            var selected = [];
            if (bossID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: bossID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

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

        $scope.showPrjName = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }

            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].mainName : 'Not Set';
        };

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        // 主要顯示
        $scope.loginUserTablesItems = [];

        $scope.addTravelApplicationItem = function (prjDID) {

            bsLoadingOverlayService.start({
                referenceId: 'travelApplication_tab_main'
            });

            var formData = {
                creatorDID: $scope.userDID,

                year: thisYear,
                month: thisMonth,

                prjDID: prjDID,

                taStartDate: moment(new Date()).format("YYYY/MM/DD"),
                start_time: "",

                taEndDate: moment(new Date()).format("YYYY/MM/DD"),
                end_time: "",

                location: "",

                //RIGHT
                isSendReview: false,
                isManagerCheck: false,
                isBossCheck: false,
                isExecutiveCheck: false,

                userMonthSalary: $scope.userMonthSalary,

                timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
            };

            TravelApplicationUtil.insertTravelApplicationItem(formData)
                .success(function (resp) {
                    $scope.getUsersTravelApplicationData($scope.userDID, thisYear);
                    $scope.resetProjectData();
                })
        }

        // $scope.removeTravelApplication = function (index) {
        //     bsLoadingOverlayService.start({
        //         referenceId: 'travelApplication_tab_main'
        //     });
        //
        //     var formData = {
        //         tableID: $scope.loginUserTablesItems[index]._id
        //     }
        //
        //     TravelApplicationUtil.removeTravelApplicationItem(formData)
        //         .success(function (res) {
        //             $scope.getUsersTravelApplicationData($scope.userDID, thisYear);
        //         })
        // };

        $scope.removeTravelApplication = function (item) {
            var workOffString = item.taStartDate;

            $scope.checkText = '確定刪除 ' + workOffString + "  ？";
            $scope.checkingItem = item;
            ngDialog.open({
                template: 'app/pages/myForms/travelApplication/modal/travelApplicationDeleteModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        };

        //跟後臺溝通
        $scope.sendTravelApplicationDelete = function (travelApplicationItem) {
            var formData = {
                tableID: travelApplicationItem._id,
            }

            TravelApplicationUtil.removeTravelApplicationItem(formData)
                .success(function (res) {
                    $scope.getUsersTravelApplicationData($scope.userDID, thisYear);
                })
        }

        $scope.getUsersTravelApplicationData = function (userDID, year) {

            bsLoadingOverlayService.start({
                referenceId: 'travelApplication_tab_main'
            });

            var formData = {
                creatorDID: userDID,
                year: year,
            };
            TravelApplicationUtil.getTravelApplicationItem(formData)
                .success(function (resp) {
                    console.log(resp);
                    $scope.loginUserTablesItems = [];
                    for (var index = 0; index < resp.payload.length; index ++) {
                        $scope.loginUserTablesItems.push(resp.payload[index]);
                    }
                    $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'travelApplication_tab_main'
                        });
                    }, 300)

                    $(document).ready(function () {
                        $('.customDate').mask('2KY0/M0/D0', {
                            translation: {
                                'K': {
                                    pattern: /[0]/,
                                },
                                'Y': {
                                    pattern: /[012]/,
                                },
                                'M': {
                                    pattern: /[01]/,
                                },
                                'D': {
                                    pattern: /[0123]/,
                                }
                            }
                        });
                    });
                })
        }

        $scope.getUsersTravelApplicationData($scope.userDID, thisYear);

        $scope.getApplyData = function() {
            $scope.getUsersTravelApplicationData($scope.userDID, thisYear);
        }

        // Send Travel Application to Review
        $scope.reviewTravelApplicationItem = function (table, button, index) {
            var workOffString = $scope.loginUserTablesItems[index].taStartDate + " " +
                $scope.loginUserTablesItems[index].start_time + " ~ " +
                $scope.loginUserTablesItems[index].taStartDate + " " +
                $scope.loginUserTablesItems[index].end_time;

            if (!moment($scope.loginUserTablesItems[index].start_time, "HH:mm", true).isValid()) {
                toastr.error('起始時間 格式錯誤', '請輸入 HH:mm');
                return
            }

            if (!moment($scope.loginUserTablesItems[index].end_time, "HH:mm", true).isValid()) {
                toastr.error('結束時間 格式錯誤', '請輸入 HH:mm');
                return
            }

            $scope.checkText = '確定提交 ' + workOffString + '：' + "  審查？";
            $scope.checkingItem = $scope.loginUserTablesItems[index];
            ngDialog.open({
                template: 'app/pages/myForms/travelApplication/modal/travelApplicationApplyModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //跟後臺溝通
        $scope.sendTravelApplication = function (travelApplicationItem) {

            bsLoadingOverlayService.start({
                referenceId: 'travelApplication_tab_main'
            });

            var formData = {
                _id: travelApplicationItem._id,

                taStartDate: travelApplicationItem.taStartDate,
                start_time: travelApplicationItem.start_time,

                taEndDate: travelApplicationItem.taEndDate,
                end_time: travelApplicationItem.end_time,

                applyHour: travelApplicationItem.applyHour,
                location: travelApplicationItem.location,

                isSendReview: true,

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "sendReview"
            }

            TravelApplicationUtil.updateTravelApplicationItem(formData)
                .success(function (resp) {
                    $scope.getUsersTravelApplicationData($scope.userDID, thisYear);
                })
        }

        $scope.initProject();

        $scope.showUpdateAction = function (action) {
            return UpdateActionUtil.convertAction(action);
        }

        $scope.showManagerName = function (item) {
            var selected = [];
            if ($scope.relatedProjects === undefined) return;
            if (item.prjDID) {
                selected = $filter('filter')($scope.relatedProjects, {
                    value: item.prjDID
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

        $scope.cancelReview = function(table) {

            var workOffString = table.taStartDate + " " +
                table.start_time + " ~ " +
                table.taStartDate + " " +
                table.end_time;

            $scope.checkText = '確定 抽回：' +
                workOffString +
                "  ？";
            $scope.checkingTable = table;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkOffTableFormCancelReview_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendCancelReview = function(checkingTable) {
            var formData = {
                _id: checkingTable._id,

                isSendReview: false,
                isManagerCheck: false,
                isManagerReject: false,
                isBossCheck: false,
                isBossReject: false,

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "cancelReview"
            }

            TravelApplicationUtil.updateTravelApplicationItem(formData)
                .success(function (resp) {
                    $scope.getUsersTravelApplicationData($scope.userDID, thisYear);
                })

        }
    }

})();