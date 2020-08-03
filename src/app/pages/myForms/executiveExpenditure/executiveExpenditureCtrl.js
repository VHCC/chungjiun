/**
 * @author IChen.chu
 * created on 08.07.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('executiveExpenditureCtrl',
            [
                '$scope',
                'toastr',
                '$cookies',
                '$filter',
                '$compile',
                '$timeout',
                '$window',
                'ngDialog',
                'User',
                'Project',
                'ProjectUtil',
                'ExecutiveExpenditureUtil',
                'ExpenditureTargetUtil',
                'bsLoadingOverlayService',
                executiveExpenditureCtrl
            ])

    /** @ngInject */
    function executiveExpenditureCtrl($scope,
                             toastr,
                             $cookies,
                             $filter,
                             $compile,
                             $timeout,
                             window,
                             ngDialog,
                             User,
                             Project,
                             ProjectUtil,
                             ExecutiveExpenditureUtil,
                             ExpenditureTargetUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;

        var specificYear = thisYear;
        var specificMonth = thisMonth;

        // ***** EE main Tab 主要顯示 *****
        $scope.displayEEItems;

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers; // 新增表單

                $scope.projectManagers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allUsers[i]._id,
                        name: allUsers[i].name
                    };
                }
            });

        var formData = {
            isEnable: true
        }

        ExpenditureTargetUtil.fetchExpenditureTarget(formData)
            .success(function (res) {
                console.log($scope)
                vm.executiveExpenditureTargets = res.payload;
            })

        $scope.showTargetName = function (targetDID) {
            var selected = [];
            if (vm.executiveExpenditureTargets === undefined) return;
            if (targetDID) {
                selected = $filter('filter')(vm.executiveExpenditureTargets, {
                    _id: targetDID,
                });
            }
            return selected.length ? selected[0].targetName : 'Not Set';
        }

        Project.findAll()
            .success(function (allProjects) {


                $scope.allProjectCache = [];
                var prjCount = allProjects.length;
                for (var index = 0; index < prjCount; index++) {

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
                    };
                }
            });

        $scope.initProject = function() {
            Project.findAllEnable()
                .success(function (allProjects) {
                    $scope.allProject_raw = allProjects;
                    vm.projects = allProjects.slice();
                });
        }

        $scope.resetProjectData = function() {
            if (vm.prjItems) {
                vm.prjItems.selected = null;
            }
            vm.projects = $scope.allProject_raw.slice();
        }

        $scope.initProject();

        $scope.listenMonth = function(dom){
            dom.$watch('myMonth',function(newValue, oldValue) {
                if (dom.isShiftMonthSelect) {
                    dom.isShiftMonthSelect = false;
                    $scope.changeExecutiveExpenditureMonth(0, dom.monthPickerDom);
                }
            });
        }

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        $scope.changeExecutiveExpenditureMonth = function(changeCount, dom) {

            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.fetchExecutiveExpenditureData();
        }

        // main tab, type = 0
        $scope.insertExecutiveExpenditureItem = function (prjDID) {
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_executiveExpenditure'
            });

            var formData = {
                creatorDID: $scope.userDID,
                year: specificYear,
                month: specificMonth,
                prjDID: prjDID,
            }
            ExecutiveExpenditureUtil.insertExecutiveExpenditureItem(formData)
                .success(function (res) {
                    $scope.fetchExecutiveExpenditureData();
                    $scope.resetProjectData();
                })
        }

        // main tab, type = 0
        $scope.removeExecutiveExpenditureItem = function (item) {
            var formData = {
                _id: item._id,
            }
            ExecutiveExpenditureUtil.removeExecutiveExpenditureItem(formData)
                .success(function (res) {
                    $scope.fetchExecutiveExpenditureData();
                })
        }

        $scope.setExecutiveExpenditureItem = function(item) {
            console.log(item);
            var formData = {
                _id: item._id,
                payDate: item.payDate,
                targetDID: item.targetDID,
                contents: item.contents,
                amount: item.amount,
                itemIndex: item.itemIndex,
                timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
                isSendReview: true,
            }
            ExecutiveExpenditureUtil.updateExecutiveExpenditureOne(formData)
                .success(function (res) {
                    $scope.fetchExecutiveExpenditureData();
                })
        }

        // main, type = 0
        $scope.fetchExecutiveExpenditureData = function () {
            console.log(" === fetchExecutiveExpenditureData === ")
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_executiveExpenditure'
            });

            var formData = {
                creatorDID: $scope.userDID,
                year: specificYear,
                month: specificMonth,
            }

            ExecutiveExpenditureUtil.fetchExecutiveExpenditureItems(formData)
                .success(function (res) {
                    $scope.displayEEItems = res.payload;

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_executiveExpenditure'
                        });

                        $('.expenditureTargetDateInput').mask('20Y0/M0/D0', {
                            translation: {
                                'Y': {
                                    pattern: /[0123]/,
                                },
                                'M': {
                                    pattern: /[01]/,
                                },
                                'D': {
                                    pattern: /[0123]/,
                                }
                            }
                        });
                    }, 500)
                })
                .error(function (res) {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_executiveExpenditure'
                        });
                    }, 500)
                })
        }

        $scope.changeExpenditureTarget = function (dom) {
            if (dom.$parent.item != undefined) {
                dom.$parent.item.targetDID = dom.expenditureTarget._id;
            }
        }

        $scope.showPrjCode = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].prjCode : 'Not Set';
        };

        $scope.showProjectManager = function (prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID
                });
            }
            var managerDID = majorSelected[0].managerID;
            var selected = [];
            if (managerDID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: managerDID
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].name : 'Not Set';
        };

        $scope.showUser = function (userDID) {
            var selected = [];
            if (vm.users === undefined) return;
            if (userDID) {
                selected = $filter('filter')(vm.users, {
                    _id: userDID,
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        // main tab, type = 0
        $scope.saveEEItems = function () {

            var target = $scope.displayEEItems;

            var resultCount = 0;
            for (var index = 0; index < target.length; index ++) {
                var item = target[index];
                var formData = {
                    _id: item._id,
                    payDate: item.payDate,
                    // receiptCode: item.receiptCode,
                    contents: item.contents,
                    amount: item.amount,
                    itemIndex: item.itemIndex
                }
                ExecutiveExpenditureUtil.updateExecutiveExpenditureItems(formData)
                    .success(function (res) {
                        resultCount ++
                        if (resultCount == target.length) {
                            $scope.fetchExecutiveExpenditureData();
                            toastr.success('表單儲存成功', 'Success');
                        }
                    })
            }
        }

        $scope.fetchReviewItemsFromScope = function(user) {
            return $scope.tables_review[user] === undefined ?
                [] : $scope.tables_review[user];
        }

        // main tab, type = 0
        $scope.calculateSum = function () {
            var operationTarget;
            var result = 0;
            operationTarget = $scope.displayEEItems;
            if (operationTarget == undefined || operationTarget == null) {
                return result;
            }
            for (var index = 0; index < operationTarget.length; index ++) {
                // console.log(operationTarget[index]);
                if (operationTarget[index].amount != null || operationTarget[index].amount != undefined) {
                    result += parseInt(operationTarget[index].amount);
                }
            }
            return result;
        }

        $scope.reloadEEPage = function () {
            console.log("reloadEEPage")
            $scope.fetchExecutiveExpenditureData();
        }

        $scope.aaaaa = function () {
            console.log("QQQQQ")
        }
    }
})();

