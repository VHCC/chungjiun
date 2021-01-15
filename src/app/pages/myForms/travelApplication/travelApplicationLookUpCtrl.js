(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgWorkManage')
        .controller('travelApplicationLookUpCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$uibModal',
                'ngDialog',
                'User',
                'Project',
                'ProjectUtil',
                'TravelApplicationUtil',
                '$compile',
                TravelApplicationLookUpCtrl
            ])
    ;

    /**
     * @ngInject
     */
    function TravelApplicationLookUpCtrl($scope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 ngDialog,
                                 User,
                                 Project,
                                 ProjectUtil,
                                 TravelApplicationUtil,
                                 $compile) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');

        var vm = this;
        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;
        $scope.year = thisYear;

        $scope.listenYear = function (dom) {
            dom.$watch('myYear',function(newValue, oldValue) {
                console.log("newValue= " + newValue + ", oldValue= " + oldValue);
                if (newValue != oldValue) {
                    $scope.year = thisYear = newValue - 1911;
                    $scope.getUsersTravelApplicationData(vm.specificUser.selected._id, thisYear);
                }
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
                // console.log($scope);
            });

        $scope.initProject = function() {
            Project.findAllEnable()
                .success(function (allProjects) {
                    // console.log(allProjects);
                    vm.projects = allProjects.slice();
                    vm.projects_executiveAdd = allProjects.slice();
                });
        }

        User.getAllUsers()
            .success(function (allUsers) {
                // console.log(allUsers);

                vm.specificUsers = allUsers; // 歷史檢視

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
            // if (selected[0].combinedID != undefined) {
            //     return $scope.showPrjCodeWithCombine(selected[0].combinedID);
            // }
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

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        // 主要顯示
        $scope.lookUpUserTablesItems = [];

        $scope.getUsersTravelApplicationData = function (userDID, year) {

            var formData = {
                creatorDID: userDID,
                year: year,
                isSendReview: true,
            };
            TravelApplicationUtil.getTravelApplicationItem(formData)
                .success(function (resp) {
                    // console.log(resp);
                    $scope.lookUpUserTablesItems = [];
                    for (var index = 0; index < resp.payload.length; index ++) {
                        $scope.lookUpUserTablesItems.push(resp.payload[index]);
                    }

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

            var formData = {
                userDID: userDID,
            }
            User.findUserByUserDID(formData)
                .success(function (user) {
                    // $scope.userMonthSalary = user.userMonthSalary;
                    $scope.bossID = user.bossID;
                    // $scope.residualRestHour = user.residualRestHour;
                })
        }

        // $scope.getUsersTravelApplicationData($scope.userDID, thisYear);

        $scope.fetchTravelApplicationData = function (userDID) {
            vm.specificUserDID = userDID;
            $scope.getUsersTravelApplicationData(userDID, thisYear);
        }

        $scope.removeTravelApplication = function (item) {
            // console.log('removeTravelApplicationItem, Index= ' + index);

            console.log(item);

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

            console.log(formData);

            TravelApplicationUtil.removeTravelApplicationItem(formData)
                .success(function (res) {
                    $scope.getUsersTravelApplicationData(vm.specificUserDID, thisYear);
                })
        }


    }

})();