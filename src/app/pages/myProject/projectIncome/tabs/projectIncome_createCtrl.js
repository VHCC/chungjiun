/**
 * @author IChen.chu
 * created on 25.09.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('projectIncomeCreateCtrl',
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
                'ProjectIncomeUtil',
                'bsLoadingOverlayService',
                projectIncomeCreateCtrl
            ])

    /** @ngInject */
    function projectIncomeCreateCtrl($scope,
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
                             ProjectIncomeUtil,
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

        $scope.fetchProjectIncomeTable = function (prjDID) {
            $scope.selectPrjDID = prjDID;

            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_project_income'
                });
            }, 100)

            var formData = {
                prjDID: prjDID
            }

            ProjectIncomeUtil.findIncome(formData)
                .success(function (res) {
                    // console.log(res)
                    $scope.projectIncomeTable = res.payload;

                    angular.element(
                        document.getElementById('includeHead_create'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'列表 - " + $scope.projectIncomeTable.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/myProject/projectIncome/tables/projectIncome_create_table.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_project_income'
                        });
                    }, 1000)
                })
        }

        $scope.projectIncomeCreate = function () {
            console.log("QQQQ")
            var formData = {
                prjDID: $scope.selectPrjDID
            }

            ProjectIncomeUtil.createIncome(formData)
                .success(function (res) {
                    $scope.fetchProjectIncomeTable($scope.selectPrjDID)
                })
        }

        $scope.removeProjectIncomeItem = function (item) {
            var formData = {
                _id: item._id
            }
            ProjectIncomeUtil.removeIncome(formData)
                .success(function (res) {
                    $scope.fetchProjectIncomeTable($scope.selectPrjDID)
                })
        }

        $scope.updateProjectIncome = function (item) {
            var formData = {
                itemID: item._id,
                payDate: item.payDate,
                expectAmount: item.expectAmount,
                payContents: item.payContents,
                realDate: item.realDate,
                realAmount: item.realAmount,
                fee: item.fee,
                fines: item.fines,
                memo: item.memo,
                isEnable: true
            }
            ProjectIncomeUtil.updateIncome(formData)
                .success(function (res) {
                    $scope.fetchProjectIncomeTable($scope.selectPrjDID)
                })
        }


    }
})();


