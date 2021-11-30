/**
 * @author IChen.chu
 * created on 19 Nov 2021
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.cgKPI')
        .controller('kpiTechYearlyCtrl',
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
                'WorkHourUtil',
                'DateUtil',
                'TimeUtil',
                'Project',
                'ProjectUtil',
                'ProjectFinancialRateUtil',
                'ProjectFinancialResultUtil',
                'PaymentFormsUtil',
                'ExecutiveExpenditureUtil',
                'SubContractorPayItemUtil',
                'ProjectIncomeUtil',
                'KpiUtil',
                'KpiTechDistributeUtil',
                'bsLoadingOverlayService',
                kpiTechYearlyCtrl
            ])

    /** @ngInject */
    function kpiTechYearlyCtrl($scope,
                         toastr,
                         $cookies,
                         $filter,
                         $compile,
                         $timeout,
                         window,
                         ngDialog,
                         User,
                         WorkHourUtil,
                         DateUtil,
                         TimeUtil,
                         Project,
                         ProjectUtil,
                         ProjectFinancialRateUtil,
                         ProjectFinancialResultUtil,
                         PaymentFormsUtil,
                         ExecutiveExpenditureUtil,
                         SubContractorPayItemUtil,
                         ProjectIncomeUtil,
                         KpiUtil,
                         KpiTechDistributeUtil,
                         bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        // 主要顯示

        var thisYear = new Date().getFullYear() - 1911;
        var specificYear = thisYear;
        $scope.year = specificYear;

        $scope.showUp = function() {

            $scope.mainYears = [];

            // initialize
            $scope.projectFinancialResultTable_Total = [];
            $scope.projectKPIElements_Total = [];
            for (var i = 109; i <= thisYear; i ++) {
                $scope.fetchYearlyProject(i)
            }
            // $scope.mainYears.sort((a, b) => a - b);
            // $scope.fetchYearlyProject(109)
        }

        $scope.mainYears = [];
        $scope.projectTechMembers_Total = {};
        $scope.projectFinancialResultTable_Total = [];

        $scope.fetchKpiTechDistribute = function(specificYear) {
            $scope.mainYears.push(specificYear);
            var formData = {
                year: specificYear,
            }

            KpiTechDistributeUtil.findTD(formData)
                .success(function (res) {
                    $scope.projectTechMembers_Total[specificYear] = res.payload;
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_tech_total_result'
                        });
                    }, 500)
                })
        }

        // mainly function
        $scope.fetchYearlyProject = function (specificYear) {
            var formData = {
                year: specificYear,
                type: "tech",
            }

            var projectFinancialResultTable = [];

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_kpi_tech_total_result'
            });

            KpiUtil.findKPIYear(formData)
                .success(function (res) {
                    if (res.payload.length == 0) {
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_kpi_tech_total_result'
                            });
                        }, 200)
                    } else {
                        $scope.fetchKpiTechDistribute(specificYear);
                        for (var index = 0; index < res.payload.length; index++) {
                            res.payload[index].prjCode = $scope.showPrjInfo(res.payload[index].prjDID).prjCode;
                            projectFinancialResultTable.push(res.payload[index]);
                        }
                        $scope.projectFinancialResultTable_Total[specificYear] = projectFinancialResultTable;
                        $scope.mainYears.sort((a, b) => a - b);
                        KpiUtil.findKPIElement(formData)
                            .success(function (res) {
                                // $scope.projectKPIElements = res.payload;
                                angular.element(
                                    document.getElementById('includeHead_kpi_tech_total_result'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'" + "" + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/kpi/tech/tables/kpiTech_result_total_table.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));
                            })
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_kpi_tech_total_result'
                            });
                        }, 500)
                    }
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_tech_total_result'
                        });
                    }, 200)
                })
        }

        $scope.fetchKPIValue = function (type, item) {
            switch (type) {
                case 6: // 行政
                    return item.kpi6;
                case 7: // 技師
                    return item.kpi7;
                case 8: // 風險
                    return item.kpi8;
                case 9: // 利潤
                    return item.kpi9;
            }
        }

        $scope.calResultKpiAllTotal = function (type, specificYear) {
            var result = 0.0;
            switch (type) {
                // 行政費
                case 6:
                    for (var index = 0; index < $scope.projectFinancialResultTable_Total[specificYear].length; index++) {
                        var item = $scope.projectFinancialResultTable_Total[index];
                        result += item.kpi6;
                    }
                    // for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                    //     var item = $scope.projectKPIElements[index];
                    //     result += item.amount;
                    // }
                    return result;
                // 技師費
                case 7:
                    for (var index = 0; index < $scope.projectFinancialResultTable_Total[specificYear].length; index++) {
                        var item = $scope.projectFinancialResultTable_Total[specificYear][index];
                        result += item.kpi7;
                    }
                    // for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                    //     var item = $scope.projectKPIElements[index];
                    //     result += item.amount;
                    // }
                    return result;
                // 風險 E*N
                case 8:
                    for (var index = 0; index < $scope.projectFinancialResultTable_Total.length; index++) {
                        var item = $scope.projectFinancialResultTable_Total[index];
                        result += item.kpi8;
                    }
                    // for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                    //     var item = $scope.projectKPIElements[index];
                    //     result += item.amount;
                    // }
                    return result;
                // 利潤 E*N
                case 9:
                    for (var index = 0; index < $scope.projectFinancialResultTable_Total.length; index++) {
                        var item = $scope.projectFinancialResultTable_Total[index];
                        result += item.kpi9;
                    }
                    // for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                    //     var item = $scope.projectKPIElements[index];
                    //     result += item.amount;
                    // }
                    return result;
            }
        }

        $scope.showTotalSumTotal = function(specificYear) {
            var results = 0;
            for (var index = 0 ; index < $scope.projectTechMembers_Total[specificYear].length; index ++) {
                Object.keys($scope.projectTechMembers_Total[specificYear][index]).forEach(function(key) {
                    if (key.length == 11) {
                        var value = $scope.projectTechMembers_Total[specificYear][index][key];
                        results += parseInt(value);
                    }
                });
            }
            return results;
        }





        // ========= BASIC FUNCTION ============
        //所有專案，資料比對用
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
                        technician: allProjects[index].technician,
                        ezName: nameResult,
                        combinedID: allProjects[index].combinedID,
                    };
                }
            })

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
                $scope.projectManagers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allUsers[i]._id,
                        name: allUsers[i].name
                    };
                }
            });

        //技師
        User.findTechs()
            .success(function (allTechs) {
                $scope.projectTechs = [];
                for (var i = 0; i < allTechs.length; i++) {
                    $scope.projectTechs[i] = {
                        value: allTechs[i]._id,
                        name: allTechs[i].name
                    };
                }
            });

        $scope.showPrjInfo = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0] : 'Not Set';
        };

        $scope.showPrjTech = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].technician : 'Not Set';
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

        $scope.showManager = function (project) {
            var selected = [];
            if ($scope.projectManagers === undefined) return;
            if (project.managerID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: project.managerID
                });
            }
            return selected.length ? selected[0].name : '未指派經理';
        };

        $scope.showTechs = function (techs) {
            var results = "";
            var selected = [];
            if ($scope.projectTechs === undefined) return;
            for (var index = 0; index < techs.length; index++) {
                selected = $filter('filter')($scope.projectTechs, {
                    value: techs[index],
                });
                results += selected.length ? selected[0].name + ", " : '未指定';
            }
            return results;
        }


        // END
    }
})();


