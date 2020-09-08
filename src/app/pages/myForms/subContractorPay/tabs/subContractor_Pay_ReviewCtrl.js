/**
 * @author IChen.chu
 * created on 21.08.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('subContractorPayReviewCtrl',
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
                'SubContractorPayItemUtil',
                'bsLoadingOverlayService',
                subContractorPayReviewCtrl
            ])

    /** @ngInject */
    function subContractorPayReviewCtrl($scope,
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
                             SubContractorPayItemUtil,
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

        // ***** SubContractorPay main Tab 主要顯示 *****
        $scope.subContractorConfirmItems;

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

        $scope.showSCApplyItem = function(subContractDID) {
            var selected = [];
            if ($scope.subContractorConfirmItems === undefined) return;
            if (subContractDID) {
                selected = $filter('filter')($scope.subContractorConfirmItems, {
                    _id: subContractDID,
                });
            }
            return selected.length ? selected[0] : 'Not Set';

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
                $scope.fetchSCApplyData();
            });

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
        $scope.fetchSCPayItemProject = function () {

            // $scope.scPayItemPrjDID = prjDID;

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_subContractorPay'
            });

            var formData = {
                // creatorDID: $scope.userDID,
                // year: specificYear,
                isManagerCheck: true,
            }

            SubContractorApplyUtil.fetchSCApplyItems(formData)
                .success(function (res) {
                    $scope.subContractorConfirmItems = res.payload;
                    $scope.fetchSCPayReviewItemData();
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_subContractorPay'
                        });
                    }, 500)
                })
                .error(function (res) {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_subContractorPay'
                        });
                    }, 500)
                })
        }

        var canManipulateProjects_temp = [];
        var canManipulateProjects_prjDIDs = [];

        // main, type = 0
        $scope.fetchSCApplyData = function () {
            console.log(" === fetchSCApplyData === ")
            canManipulateProjects_temp = [];
            canManipulateProjects_prjDIDs = [];
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_subContractorPay'
            });

            var formData = {
                year: specificYear,
                isManagerCheck: true,
            }
            SubContractorApplyUtil.fetchSCApplyItems(formData)
                .success(function (res) {
                    for (var index = 0; index < res.payload.length; index ++) {
                        if (!canManipulateProjects_prjDIDs.includes(res.payload[index].prjDID)) {
                            canManipulateProjects_temp.push($scope.fetchPrjInfo(res.payload[index].prjDID))
                            canManipulateProjects_prjDIDs.push(res.payload[index].prjDID)
                        }
                    }

                    vm.canManipulateProjects = canManipulateProjects_temp;
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_subContractorPay'
                        });
                    }, 500)
                })
                .error(function (res) {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_subContractorPay'
                        });
                    }, 500)
                })
        }

        $scope.changeSubContractorPayItem = function (dom) {
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

        $scope.fetchPrjInfo = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0] : 'Not Set';
        }

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

        $scope.fetchSCPayReviewItemData = function () {
            var formData = {
                isSendReview: true,
                isManagerCheck: false,
            }
            SubContractorPayItemUtil.fetchSCPayItems(formData)
                .success(function (res) {
                    $scope.subContractorPayReviewItems = res.payload;
                })
        }

        // $scope.fetchSCPayReviewItemData();
        $scope.fetchSCPayItemProject();

        $scope.setSCPayItem = function (payItem) {
            var formData = {
                "_id": payItem._id,
                "payApply": payItem.payApply,
                "payMemo": payItem.payMemo,
                "payDate": payItem.payDate,
                "receiptCode": payItem.receiptCode,
                "subContractDID": payItem.subContractDID,
                "isSendReview": true,
            }
            SubContractorPayItemUtil.updateSCPayItem(formData)
                .success(function (res) {
                    $scope.fetchSCPayReviewItemData();
                })
        }
        
        $scope.agreeSCPayItem = function (payItem) {
            var formData = {
                "_id": payItem._id,
                "isManagerCheck": true,
            }
            SubContractorPayItemUtil.updateSCPayItem(formData)
                .success(function (res) {
                    $scope.fetchSCPayReviewItemData();
                })
        }

        $scope.disagreeSCPayItem = function (payItem) {
            $scope.checkText = '確定 退回：' +
                $scope.showSCVendorName($scope.showSCApplyItem(payItem.subContractDID).vendorDID) + ' - ' +
                $scope.showSCItemName($scope.showSCApplyItem(payItem.subContractDID).itemDID) +
                "  ？";
            $scope.checkingTable = payItem;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/subContractorPayItemReview_disagreeModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //跟後臺溝通
        $scope.sendDisagree_SCPayItemReview = function (checkingTable, rejectMsg) {
            var formData = {
                _id: checkingTable._id,
                managerReject_memo: rejectMsg,
                isSendReview: false,
                isManagerReject: true,
            }
            SubContractorPayItemUtil.updateSCPayItem(formData)
                .success(function (res) {
                    $scope.fetchSCPayReviewItemData();
                })
        }



    }
})();


