/**
 * @author IChen.chu
 * created on 05.08.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('subContractorApplyCtrl',
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
                'SubContractorApplyUtil',
                'SubContractorVendorUtil',
                'SubContractorItemUtil',
                'bsLoadingOverlayService',
                subContractorApplyCtrl
            ])

    /** @ngInject */
    function subContractorApplyCtrl($scope,
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
                             SubContractorApplyUtil,
                             SubContractorVendorUtil,
                             SubContractorItemUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;
        $scope.year = thisYear;

        var specificYear = thisYear;
        var specificMonth = thisMonth;

        // ***** SubContractorApply main Tab 主要顯示 *****
        $scope.displaySubContractorApplyItems;

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

        // ExpenditureTargetUtil.fetchExpenditureTarget(formData)
        //     .success(function (res) {
        //         console.log($scope);
        //         vm.executiveExpenditureTargets = res.payload;
        //     })

        SubContractorVendorUtil.fetchSCVendorEnabled(formData)
            .success(function (res) {
                vm.subContractorVendors = res.payload;
            })

        SubContractorItemUtil.fetchSCItemEnabled(formData)
            .success(function (res) {
                vm.subContractorItems = res.payload;
            })

        // $scope.showTargetName = function (targetDID) {
        //     var selected = [];
        //     if (vm.executiveExpenditureTargets === undefined) return;
        //     if (targetDID) {
        //         selected = $filter('filter')(vm.executiveExpenditureTargets, {
        //             _id: targetDID,
        //         });
        //     }
        //     return selected.length ? selected[0].targetName : 'Not Set';
        // }

        $scope.showSCVendorName = function (vendorDID) {
            var selected = [];
            if (vm.subContractorVendors === undefined) return;
            if (vendorDID) {
                selected = $filter('filter')(vm.subContractorVendors, {
                    _id: vendorDID,
                });
            }
            return selected.length ? selected[0].subContractorVendorName : 'Not Set';
        }

        $scope.showSCItemName = function (itemDID) {
            var selected = [];
            if (vm.subContractorItems === undefined) return;
            if (itemDID) {
                selected = $filter('filter')(vm.subContractorItems, {
                    _id: itemDID,
                });
            }
            return selected.length ? selected[0].subContractorItemName : 'Not Set';
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

        $scope.listenYear = function (dom) {
            dom.$watch('myYear',function(newValue, oldValue) {
                if (dom.isShiftYearSelect) {
                    dom.isShiftYearSelect = false;
                    $scope.year = specificYear = newValue - 1911;
                    $scope.fetchSCApplyData();
                }
            });
        }

        // main tab, type = 0
        $scope.insertSCApplyItem = function (prjDID) {
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_subContractor'
            });

            var formData = {
                creatorDID: $scope.userDID,
                year: specificYear,
                // month: specificMonth,
                prjDID: prjDID,
            }
            SubContractorApplyUtil.insertSCApplyItem(formData)
                .success(function (res) {
                    $scope.fetchSCApplyData();
                    $scope.resetProjectData();
                })
        }

        // main tab, type = 0
        $scope.removeSCApplyItemOne = function (item) {
            var formData = {
                _id: item._id,
            }
            SubContractorApplyUtil.removeSCApplyItem(formData)
                .success(function (res) {
                    $scope.fetchSCApplyData();
                })
        }

        $scope.setSCApplyItem = function(applyItem) {
            var formData = {
                _id: applyItem._id,
                vendorDID: applyItem.vendorDID,
                itemDID: applyItem.itemDID,
                contractDate: applyItem.contractDate,
                contractAmount: applyItem.contractAmount,
                itemIndex: applyItem.itemIndex,
                timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
                isSendReview: true,
            }
            SubContractorApplyUtil.updateSCApplyOne(formData)
                .success(function (res) {
                    $scope.fetchSCApplyData();
                })
        }

        // main, type = 0
        $scope.fetchSCApplyData = function () {
            console.log(" === fetchSCApplyData === ")
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_subContractor'
            });

            var formData = {
                creatorDID: $scope.userDID,
                year: specificYear,
                // month: specificMonth,
            }

            SubContractorApplyUtil.fetchSCApplyItems(formData)
                .success(function (res) {
                    $scope.displaySubContractorApplyItems = res.payload;

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_subContractor'
                        });

                        $('.subContractDateInput').mask('20Y0/M0/D0', {
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
                            referenceId: 'mainPage_subContractor'
                        });
                    }, 500)
                })
        }

        $scope.changeSubContractorVendor = function (dom) {
            if (dom.$parent.applyItem != undefined) {
                dom.$parent.applyItem.vendorDID = dom.subContractorVendor._id;
            }
        }

        $scope.changeSubContractorItem = function (dom) {
            if (dom.$parent.applyItem != undefined) {
                dom.$parent.applyItem.itemDID = dom.subContractorItem._id;
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
            if (majorSelected == undefined) return 'Not Set';
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

            var target = $scope.displaySubContractorApplyItems;

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
                            $scope.fetchSCApplyData();
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
            operationTarget = $scope.displaySubContractorApplyItems;
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

    }
})();


