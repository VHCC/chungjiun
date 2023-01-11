(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgWorkManage')
        .controller('bulletinMainCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$timeout',
                '$uibModal',
                'toastr',
                'ngDialog',
                'User',
                'Project',
                'ProjectUtil',
                'DateUtil',
                'TimeUtil',
                'WorkOffFormUtil',
                'WorkOffTypeUtil',
                'TravelApplicationUtil',
                '$compile',
                'bsLoadingOverlayService',
                BulletinMainCtrl
            ])
    ;

    /**
     * @ngInject
     */
    function BulletinMainCtrl(
                            $scope,
                            $filter,
                            $cookies,
                            $timeout,
                            $uibModal,
                            toastr,
                            ngDialog,
                            User,
                            Project,
                            ProjectUtil,
                            DateUtil,
                            TimeUtil,
                            WorkOffFormUtil,
                            WorkOffTypeUtil,
                            TravelApplicationUtil,
                            $compile,
                            bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');

        var vm = this;
        var date = new Date();
        var thisYear = date.getFullYear() - 1911;
        var thisMonth = date.getMonth() + 1; //January is 0!;
        var today = date.getDay();
        $scope.year = thisYear;

        User.getAllUsersWithSignOut()
            .success(function (allUsers) {
                $scope.usersBosses = [];
                vm.usersReview = allUsers;
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.usersBosses[i] = {
                        value: allUsers[i]._id,
                        bossID: allUsers[i].bossID,
                        name: allUsers[i].name
                    };
                }
            })

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

        $scope.showBoss = function (userDID) {
            var selected = [];
            if (userDID) {
                selected = $filter('filter')($scope.usersBosses, {
                    value: userDID
                });
            }
            if (selected == undefined || selected.length == 0) return 'Not Set'
            var bossDID = selected[0].bossID;
            var selectedBoss = [];
            if (bossDID) {
                selectedBoss = $filter('filter')($scope.usersBosses, {
                    value: bossDID
                });
            }
            if (!selectedBoss) return 'Not Set'

            return selectedBoss.length ? selectedBoss[0].name : 'Not Set';
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

        $scope.fetchData = function () {
            var formData = {
                isBulletin: true,
                year: thisYear,
                month: thisMonth,
                isSendReview: true,
                isAgentCheck: true,
                isBossCheck: true,
            };
            $scope.bulletinItems = [];
            WorkOffFormUtil.findWorkOffTableItemByParameter(formData)
                .success(function (res) {
                    // $scope.bulletinItems = res.payload;
                    for (var index = 0; index < res.payload.length; index ++) {
                        var date = $scope.showDate(res.payload[index]);
                        if(moment(date) >= moment(moment(new Date()).format("YYYY/MM/DD"))) {
                            res.payload[index]._date = date;
                            $scope.bulletinItems.push(res.payload[index]);
                        }

                    }
                    $scope.bulletinItems = $scope.bulletinItems.sort(function (a, b) {
                        return a._date > b._date ? 1 : -1;
                    });
                })

            var formData = {
                isBulletin: true,
                year: thisYear,
                month: thisMonth,
                isSendReview: true,
                isBossCheck: true,
            };

            console.log(formData);

            TravelApplicationUtil.getTravelApplicationItem(formData)
                .success(function (resp) {
                    console.log(resp);
                    $scope.bulletinItems_travel = [];
                    for (var index = 0; index < resp.payload.length; index ++) {
                        var date = resp.payload[index].taStartDate;
                        console.log(index)
                        console.log(date)
                        console.log(moment(date))
                        console.log(moment(moment(new Date()).format("YYYY/MM/DD")))
                        if(moment(date) >= moment(moment(new Date()).format("YYYY/MM/DD"))) {
                            $scope.bulletinItems_travel.push(resp.payload[index]);
                        }
                    }

                    $scope.bulletinItems_travel = $scope.bulletinItems_travel.sort(function (a, b) {
                        return a.taStartDate > b.taStartDate ? 1 : -1;
                    });
                })
        }

        $scope.fetchData();

        $scope.showDay = function (day) {
            return DateUtil.getDay(day)
        }

        $scope.showDate = function (table) {
            return DateUtil.getShiftDatefromFirstDate(
                DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                table.day === 0 ? 6 : table.day - 1);
        }

        // 顯示假期名
        $scope.showWorkOffTypeString = function (type) {
            return WorkOffTypeUtil.getWorkOffString(type);
        }

        $scope.showAgentName = function (item) {
            var selected = [];
            if (item.agentID) {
                selected = $filter('filter')($scope.usersBosses, {
                    value: item.agentID
                });
            }
            return selected.length ? selected[0].name : '沒有代理人';
        }

        $scope.showMan = function (userDID) {
            var selected = [];
            if (userDID) {
                selected = $filter('filter')($scope.usersBosses, {
                    value: userDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.getHourDiffByTime = function (start, end, type) {
            if (isNaN(parseInt(start)) || isNaN(parseInt(end))) {
                return "輸入格式錯誤";
            }
            if (start && end) {
                var difference = Math.abs(TimeUtil.toSeconds(start) - TimeUtil.toSeconds(end));

                // compute hours, minutes and seconds
                var result = [
                    // an hour has 3600 seconds so we have to compute how often 3600 fits
                    // into the total number of seconds
                    Math.floor(difference / 3600), // HOURS
                    // similar for minutes, but we have to "remove" the hours first;
                    // this is easy with the modulus operator
                    Math.floor((difference % 3600) / 60) // MINUTES
                    // the remainder is the number of seconds
                    // difference % 60 // SECONDS
                ];

                // formatting (0 padding and concatenation)
                // result = result.map(function (v) {
                //     return v < 10 ? '0' + v : v;
                // }).join(':');

                // result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                // return result <= 1 ? 1 : result >= 8 ? 8 : result;

                if (TimeUtil.getHour(end) == 12) {
                    result = result[0] + (result[1] > 0 ? 0.5 : 0);
                } else {
                    result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                }
                var resultFinal;
                if (TimeUtil.getHour(start) <= 12 && TimeUtil.getHour(end) >= 13) {
                    if (this.workOffType !== undefined) {
                        // 請假單
                        if (this.workOffType.type == 2) {
                            resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                        } else {
                            resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                        }

                    } else if (this.table != undefined) {
                        // 主管審核、行政審核
                        if (this.table.workOffType == 2) {
                            resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                        } else {
                            resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                        }
                    } else {
                        // 總攬
                        if (type == 2) {
                            resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                        } else {
                            resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                        }
                    }

                } else {

                    if (this.workOffType !== undefined) {
                        // 請假單
                        if (this.workOffType.type == 2) {
                            resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                        } else {
                            resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                        }

                    } else if (this.table != undefined) {
                        // 主管審核、行政審核
                        if (this.table.workOffType == 2) {
                            resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                        } else {
                            resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                        }
                    } else {
                        // 總攬
                        if (type == 2) {
                            resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                        } else {
                            resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                        }
                    }
                }

                if (this.workOffType !== undefined) {
                    // 請假單
                    if (this.workOffType.type == 4 || this.workOffType.type == 5
                        || this.workOffType.type == 7 || this.workOffType.type == 8 || this.workOffType.type == 9) {

                        resultFinal = resultFinal <= 4 ? 4 : 8;
                    }

                    return resultFinal;
                } else if (this.table != undefined) {
                    // 主管審核、行政審核
                    if (this.table.workOffType == 4 || this.table.workOffType == 5
                        || this.table.workOffType == 7 || this.table.workOffType == 8 || this.table.workOffType == 9) {
                        resultFinal = resultFinal <= 4 ? 4 : 8;
                    }
                    return resultFinal;
                } else {
                    // 總攬
                    if (type == 4 || type == 5
                        || type == 7 || type == 8 || type == 9) {
                        resultFinal = resultFinal <= 4 ? 4 : 8;
                    }
                    return resultFinal;
                }
            }
        }

        $scope.initProject();

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
                selected_manager = $filter('filter')($scope.usersBosses, {
                    value: selected[0].managerID
                });
            }
            return selected_manager.length ? selected_manager[0].name : 'Not Set';
        }

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

    }

})();