/**
 * @author IChen.chu
 * created on 19.08.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('subContractorPayCtrl',
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
                subContractorPayCtrl
            ])

    /** @ngInject */
    function subContractorPayCtrl($scope,
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
        $scope.displaySubContractorApplyItems_managerChecked;
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

        $scope.resetProjectData = function() {
            if (vm.prjItems) {
                vm.prjItems.selected = null;
            }
            vm.canManipulateProjects = canManipulateProjects;
        }

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
        $scope.fetchSCPayItemProject = function (prjDID) {

            $scope.scPayItemPrjDID = prjDID;

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_subContractorPay'
            });

            var formData = {
                // creatorDID: $scope.userDID,
                year: specificYear,
                isManagerCheck: true,
                prjDID: prjDID
            }

            SubContractorApplyUtil.fetchSCApplyItems(formData)
                .success(function (res) {
                    $scope.subContractorConfirmItems = res.payload;
                    $scope.fetchSCPayItemData($scope.scPayItemPrjDID);
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

        $scope.calculateNonTaxValue = function(payItem) {
            return payItem.payApply -
                parseInt(payItem.payTax) - parseInt(payItem.payOthers);
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
                    $scope.displaySubContractorApplyItems_managerChecked = res.payload;
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
        $scope.calculateSum = function () {
            var operationTarget;
            var result = 0;
            operationTarget = $scope.displaySubContractorApplyItems_managerChecked;
            if (operationTarget == undefined || operationTarget == null) {
                return result;
            }
            for (var index = 0; index < operationTarget.length; index ++) {
                if (operationTarget[index].amount != null || operationTarget[index].amount != undefined) {
                    result += parseInt(operationTarget[index].amount);
                }
            }
            return result;
        }

        $scope.addSCPayItem = function () {
            var formData = {
                creatorDID: $scope.userDID,
                year: specificYear,
                prjDID: $scope.scPayItemPrjDID
            }
            SubContractorPayItemUtil.createSCPayItem(formData)
                .success(function (res) {
                    $scope.fetchSCPayItemData($scope.scPayItemPrjDID);
                })
        }

        $scope.fetchSCPayItemData = function (prjDID) {
            var formData = {
                prjDID: prjDID
            }
            SubContractorPayItemUtil.fetchSCPayItems(formData)
                .success(function (res) {
                    $scope.subContractorPayItems = res.payload;
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
        }

        $scope.setSCPayItem = function (payItem) {
            var data = moment(payItem.payDate)
            if (payItem.payDate !== data.format('YYYY/MM/DD')) {
                toastr.error('日期格式錯誤', '請輸入 YYYY/MM/DD');
                return
            }

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
                    $scope.fetchSCPayItemData($scope.scPayItemPrjDID);
                })
        }
        
        $scope.removeSCPayItemOne = function(payItem) {
            var formData = {
                "_id": payItem._id
            }
            SubContractorPayItemUtil.removeSCPayItem(formData)
                .success(function (res) {
                    $scope.fetchSCPayItemData($scope.scPayItemPrjDID);
                })
        }

        $scope.repentSCPayItem = function(payItem) {
            $scope.checkText = '確定 退回：' +
                $scope.showSCVendorName($scope.showSCApplyItem(payItem.subContractDID).vendorDID) + ' - ' +
                $scope.showSCItemName($scope.showSCApplyItem(payItem.subContractDID).itemDID) +
                "  ？";
            $scope.checkingTable = payItem;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/subContractorPayItem_repentModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //跟後臺溝通
        $scope.sendRepent_SCPayItem = function (checkingTable) {
            var formData = {
                _id: checkingTable._id,
                isExecutiveCheck: false,
            }
            SubContractorPayItemUtil.updateSCPayItem(formData)
                .success(function (res) {
                    $scope.fetchSCPayItemData($scope.scPayItemPrjDID);
                })
        }

        $scope.changeSubContractorPayItem = function (dom) {
            if (dom.$parent.$parent.payItem != undefined) {
                dom.$parent.$parent.payItem.subContractDID = dom.subContractorPayItem._id
            }
        }

        $scope.calcActuallyPay = function (applyItem) {
            var result = 0.0;
            if ($scope.subContractorPayItems == undefined) return result;
            for (var index = 0; index < $scope.subContractorPayItems.length; index ++) {
                if (applyItem._id == $scope.subContractorPayItems[index].subContractDID &&
                    $scope.subContractorPayItems[index].isExecutiveCheck == true) {
                    result += parseInt($scope.subContractorPayItems[index].payApply);
                }
            }
            return result
        }

        $scope.checkResidual = function (applyItem) {
            var result = applyItem.contractAmount;
            if (result == undefined) result = 0;
            return result - $scope.calcActuallyPay(applyItem)
        }

        $scope.checkIsClosed = function (applyItem) {
            var result = false;
            if ($scope.subContractorPayItems == undefined) return result;
            for (var index = 0; index < $scope.subContractorPayItems.length; index ++) {
                if (applyItem._id == $scope.subContractorPayItems[index].subContractDID &&
                    $scope.subContractorPayItems[index].isClosed == true) {
                    result = true;
                }
            }
            return result;
        }

    }
})();


