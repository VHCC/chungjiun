/**
 * @author IChen.chu
 * created on 21.08.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('subContractorPayExecutiveCtrl',
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
                subContractorPayExecutiveCtrl
            ])

    /** @ngInject */
    function subContractorPayExecutiveCtrl($scope,
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
        console.log($scope)

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
                        combinedID: allProjects[index].combinedID,
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
        $scope.fetchSCPayItemProject_Executive = function () {

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
                    $scope.fetchSCPayExecutiveItemData();
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
            console.log(" === fetchSCApplyData Executive === ")
            canManipulateProjects_temp = [];
            canManipulateProjects_prjDIDs = [];
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_subContractorPay'
            });

            var formData = {
                // year: specificYear,
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

        // Filter
        $scope.showPrjCodeWithCombine = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            if (selected[0].combinedID != undefined) {
                return $scope.showPrjCodeWithCombine(selected[0].combinedID);
            }
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

        $scope.fetchSCPayExecutiveItemData = function () {
            var formData = {
                isSendReview: true,
                isManagerCheck: true,
                isExecutiveCheck: false,
            }
            SubContractorPayItemUtil.fetchSCPayItems(formData)
                .success(function (res) {
                    $scope.subContractorPayReviewItems = res.payload;
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

                        $('.subContractDateInputSpecial').mask('20Y0/M0', {
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

        $scope.calculateNonTaxValue = function(payItem) {
            return payItem.payApply -
                parseInt(payItem.payTax) - parseInt(payItem.payOthers);
        }

        // $scope.fetchSCPayReviewItemData();
        // $scope.fetchSCPayItemProject();

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
                    $scope.fetchSCPayExecutiveItemData();
                })
        }

        $scope.agreeSCPayItem_Executive = function (payItem) {

            var isClosedText = payItem.isClosed ? "結清" : "未結清";
            $scope.checkText = '確定 同意：' +
                $scope.showSCVendorName($scope.showSCApplyItem(payItem.subContractDID).vendorDID) + ' - ' +
                $scope.showSCItemName($scope.showSCApplyItem(payItem.subContractDID).itemDID) + " " +
                isClosedText + "  ？";
            $scope.checkingTable = payItem;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/subContractorPayItemExecutive_agreeModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendAgreeSCPayItem_Executive = function (payItem) {

            var dateTemp = moment(payItem.specialDate);

            var data = moment(payItem.specialDate)
            if (payItem.specialDate !== data.format('YYYY/MM')) {
                toastr.error('廠請年月 日期格式錯誤', '請輸入 YYYY/MM');
                return
            }

            var year = parseInt(dateTemp.year()) - 1911;
            var month = parseInt(dateTemp.month()) + 1;

            var formData = {
                "_id": payItem._id,
                "year": year,
                "month": month,
                "isExecutiveCheck": true,
                "payConfirmDate": payItem.payConfirmDate,
                "payTax": payItem.payTax,
                "payOthers": payItem.payOthers,
                "executive_memo": payItem.executive_memo,
                "specialDate": payItem.specialDate,
                "isClosed": payItem.isClosed,
            }
            SubContractorPayItemUtil.updateSCPayItem(formData)
                .success(function (res) {
                    $scope.fetchSCPayItemProject();
                })
        }

        $scope.disagreeSCPayItem_Executive = function (payItem) {
            $scope.checkText = '確定 退回：' +
                $scope.showSCVendorName($scope.showSCApplyItem(payItem.subContractDID).vendorDID) + ' - ' +
                $scope.showSCItemName($scope.showSCApplyItem(payItem.subContractDID).itemDID) +
                "  ？";
            $scope.checkingTable = payItem;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/subContractorPayItemExecutive_disagreeModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //跟後臺溝通
        $scope.sendDisagree_SCPayItemExecutive = function (checkingTable, rejectMsg) {
            var formData = {
                _id: checkingTable._id,
                executiveReject_memo: rejectMsg,
                isSendReview: false,
                isManagerCheck: false,
                isExecutiveReject: true,
            }
            SubContractorPayItemUtil.updateSCPayItem(formData)
                .success(function (res) {
                    $scope.fetchSCPayExecutiveItemData();
                })
        }
        
        $scope.changeSCItemStatus = function (dom, payItem) {
            console.log(dom)
            console.log(payItem)
        }

    }
})();


