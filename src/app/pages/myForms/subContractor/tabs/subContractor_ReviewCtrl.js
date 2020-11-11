/**
 * @author IChen.chu
 * created on 17.08.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('subContractorReviewCtrl',
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
                'SubContractorApplyUtil',
                'SubContractorVendorUtil',
                'SubContractorItemUtil',
                'bsLoadingOverlayService',
                subContractorReviewCtrl
            ])

    /** @ngInject */
    function subContractorReviewCtrl($scope,
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
        $scope.displaySubContractorReviewItems;

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

        SubContractorVendorUtil.fetchSCVendorEnabled(formData)
            .success(function (res) {
                vm.subContractorVendors = res.payload;
            })

        SubContractorItemUtil.fetchSCItemEnabled(formData)
            .success(function (res) {
                vm.subContractorItems = res.payload;
            })

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
                    // $scope.fetchSCApplyData_Review();
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
                    $scope.fetchSCApplyData_Review();
                }
            });
        }

        $scope.agreeSCApplyItem = function(applyItem) {
            var formData = {
                _id: applyItem._id,
                isManagerCheck: true,
            }
            SubContractorApplyUtil.updateSCApplyOne(formData)
                .success(function (res) {
                    $scope.fetchSCApplyData_Review();
                })
        }

        $scope.rejectSCApplyItemOne = function(applyItem) {
            $scope.checkText = '確定 退回：' + $scope.showPrjCode(applyItem.prjDID) +
                "  ？";
            $scope.checkingTable = applyItem;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/subContractorReview_disagreeModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //跟後臺溝通
        $scope.sendDisagree_SCReview = function (checkingTable, rejectMsg) {
            var formData = {
                _id: checkingTable._id,
                managerReject_memo: rejectMsg,
                isSendReview: false,
                isManagerReject: true,
            }
            SubContractorApplyUtil.updateSCApplyOne(formData)
                .success(function (res) {
                    $scope.fetchSCApplyData_Review();
                })
        }

        // main, type = 0
        $scope.fetchSCApplyData_Review = function () {
            console.log(" === fetchSCApplyData_Review === ")
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_subContractor'
            });

            var formData = {
                // year: specificYear,
                isSendReview: true,
                isManagerCheck: false
            }

            SubContractorApplyUtil.fetchSCApplyItems(formData)
                .success(function (res) {
                    console.log(res.payload);
                    $scope.displaySubContractorReviewItems = [];
                    for (var index = 0; index < res.payload.length; index ++) {
                        console.log(res.payload[index])
                        if ($scope.isFitManager(res.payload[index].prjDID)) {
                            $scope.displaySubContractorReviewItems.push(res.payload[index])
                        }
                    }
                    // $scope.displaySubContractorReviewItems = res.payload;
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

        $scope.isFitManager = function (prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID
                });
            }
            if (majorSelected == undefined) return 'Not Set';
            var managerDID = majorSelected[0].managerID;
            return managerDID === $scope.userDID ? true : false;
        };

    }
})();


