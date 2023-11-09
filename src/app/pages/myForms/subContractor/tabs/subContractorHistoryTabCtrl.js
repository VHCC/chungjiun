/**
 * @author IChen.chu
 * created on 10.11.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('subContractorHistoryCtrl',
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
                'SubContractorVendorUtil',
                'SubContractorItemUtil',
                'SubContractorApplyUtil',
                'bsLoadingOverlayService',
                subContractorHistoryCtrl
            ])

    /** @ngInject */
    function subContractorHistoryCtrl($scope,
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
                             SubContractorVendorUtil,
                             SubContractorItemUtil,
                             SubContractorApplyUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        // 主要顯示
        $scope.subContractorItems = [];

        $scope.fetchAllSubContractorItems = function () {

            var formData = {
            }

            SubContractorItemUtil.fetchAllSCItem(formData)
                .success(function (res) {
                    $scope.subContractorItems = res.payload;
                })
                .error(function (res) {
                })
        }

        $scope.searchSubcontractorApply = function () {
            var formData = {
                startDay: $('#inputStartDay')[0].value,
                endDay: $('#inputEndDay')[0].value,
            }

            SubContractorApplyUtil.fetchSCApplyPeriods(formData)
                .success(function (res) {
                    $scope.subContractorApplyPeriods = res.payload;

                    for (var index = 0; index < $scope.subContractorApplyPeriods.length; index ++) {
                        $scope.subContractorApplyPeriods[index].prjCode = $scope.showPrjCodeWithCombine($scope.subContractorApplyPeriods[index].prjDID)
                        $scope.subContractorApplyPeriods[index].mainName = $scope.showPrjMainName($scope.showPrjDIDWithCombine($scope.subContractorApplyPeriods[index].prjDID))
                        $scope.subContractorApplyPeriods[index].managerName = $scope.showProjectManager($scope.showPrjDIDWithCombine($scope.subContractorApplyPeriods[index].prjDID))
                        $scope.subContractorApplyPeriods[index].applierName = $scope.showApplier($scope.subContractorApplyPeriods[index].creatorDID)
                    }

                    document.getElementById('includeHead_subContractor_history').innerText = "";
                    angular.element(
                        document.getElementById('includeHead_subContractor_history'))
                        .append($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'訂約列表 - " + res.payload.length +
                            " ( " + $('#inputStartDay')[0].value + "~" + $('#inputEndDay')[0].value + " )" +
                            "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/myForms/subContractor/tables/subContractor_applyHistoryTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                })
        }

        $scope.recoverSCApplyItemOne = function (item) {
            console.log("QQQ")
            var formData = {
                _id: item._id,
            }
            var formData = {
                _id: item._id,
                isClosed: false,
                isSendReview: false,
                isManagerCheck: false,
            }
            SubContractorApplyUtil.updateSCApplyOne(formData)
                .success(function (res) {
                    $scope.searchSubcontractorApply();
                })
        }

        // 所有人，對照資料
        User.getAllUsersWithSignOut()
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
            });

        $scope.initProject = function() {
            Project.findAllEnable()
                .success(function (allProjects) {
                    $scope.allProject_raw = allProjects;
                    vm.projects = allProjects.slice();
                });
        }

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

        // Filter
        $scope.showPrjDIDWithCombine = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            // if (selected[0].combinedID != undefined) {
            //     return $scope.showPrjDIDWithCombine(selected[0].combinedID);
            // }
            return selected.length > 0 ? selected[0].prjDID : 'Not Set';
        };

        $scope.showPrjMainName = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].mainName : 'Not Set';
        };

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

        $scope.showApplier = function (userDID) {
            var selected = [];
            if (userDID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: userDID
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].name : 'Not Set';
        }

        $scope.printPDF = function () {
            $("#form_main_pdf").print({
                globalStyles: true,
                mediaPrint: false,
                stylesheet: null,
                noPrintSelector: ".no-print",
                iframe: true,
                append: null,
                prepend: null,
                manuallyCopyFormValues: true,
                deferred: $.Deferred(),
                timeout: 750,
                title: "訂約紀錄查詢",
                doctype: '<!doctype html>'
            });
        }

    }
})();


