/**
 * @author IChen.chu
 * created on 17 Nov 2021
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.cgKPI')
        .controller('kpiTechCtrl',
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
                kpiTechCtrl
            ])

    /** @ngInject */
    function kpiTechCtrl($scope,
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

        $scope.listenYear = function (dom) {
            dom.$watch('myYear', function (newValue, oldValue) {
                if (dom.isShiftYearSelect) {
                    dom.isShiftYearSelect = false;
                    $scope.year = specificYear = newValue - 1911;
                    $scope.fetchYearlyProject(specificYear)
                    $scope.fetchKpiTechDistribute();
                }
            });
        }

        $scope.fetchKpiTechDistribute = function() {
            $scope.projectTechMembers = [];
            var formData = {
                year: $scope.year,
            }

            KpiTechDistributeUtil.findTD(formData)
                .success(function (res) {
                    $scope.projectTechMembers = res.payload;
                    console.log($scope.projectTechMembers);
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_tech_result'
                        });
                    }, 500)
                })
        }


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
        User.getAllUsersWithSignOut()
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

        // mainly function
        $scope.fetchYearlyProject = function (specificYear) {
            var formData = {
                year: specificYear,
                // isPrjClose: true,
                type: "tech",
            }
            // initialize
            $scope.projectFinancialResultTable = [];
            $scope.projectKPIElements = [];

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_kpi_tech_result'
            });

            KpiUtil.findKPIYear(formData)
                .success(function (res) {
                    if (res.payload.length == 0) {
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_kpi_tech_result'
                            });
                        }, 200)
                    } else {
                        for (var index = 0; index < res.payload.length; index++) {
                            res.payload[index].prjCode = $scope.showPrjInfo(res.payload[index].prjDID).prjCode;
                            $scope.projectFinancialResultTable.push(res.payload[index]);
                        }
                        $scope.projectFinancialResultTable = $scope.projectFinancialResultTable.sort(function (a, b) {
                            return a.prjCode > b.prjCode ? 1 : -1;
                        });
                        KpiUtil.findKPIElement(formData)
                            .success(function (res) {
                                $scope.projectKPIElements = res.payload
                                angular.element(
                                    document.getElementById('includeHead_kpi_tech_result'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'" + "" + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/kpi/tech/tables/kpiTech_result_table.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));
                            })
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_kpi_tech_result'
                            });
                        }, 500)
                    }
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_tech_result'
                        });
                    }, 200)
                })
        }

        $scope.saveKPITechMembers = function () {
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_kpi_tech_result'
            });
            var counts = 0;
            for (var index = 0; index < $scope.projectTechMembers.length; index ++) {
                var formData = $scope.projectTechMembers[index];
                KpiTechDistributeUtil.updateTD(formData)
                    .success(function (res) {
                        counts++;
                        if (counts == $scope.projectTechMembers.length) {
                            $scope.fetchKpiTechDistribute($scope.year);
                        }
                    })

            }
        }

        $scope.deleteKPIMember = function (item) {
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_kpi_tech_result'
            });
            var formData = {
                _id: item._id,
            }
            KpiTechDistributeUtil.removeTD(formData)
                .success(function (res) {
                    $scope.fetchKpiTechDistribute($scope.year);
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

        $scope.calResultKpiAll = function (type) {
            var result = 0.0;
            switch (type) {
                // 行政費
                case 6:
                    for (var index = 0; index < $scope.projectFinancialResultTable.length; index++) {
                        var item = $scope.projectFinancialResultTable[index];
                        result += item.kpi6;
                    }
                    for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                        var item = $scope.projectKPIElements[index];
                        result += item.amount;
                    }
                    return result;
                // 技師費
                case 7:
                    for (var index = 0; index < $scope.projectFinancialResultTable.length; index++) {
                        var item = $scope.projectFinancialResultTable[index];
                        result += item.kpi7;
                    }
                    for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                        var item = $scope.projectKPIElements[index];
                        result += item.amount;
                    }
                    return result;
                // 風險 E*N
                case 8:
                    for (var index = 0; index < $scope.projectFinancialResultTable.length; index++) {
                        var item = $scope.projectFinancialResultTable[index];
                        result += item.kpi8;
                    }
                    for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                        var item = $scope.projectKPIElements[index];
                        result += item.amount;
                    }
                    return result;
                // 利潤 E*N
                case 9:
                    for (var index = 0; index < $scope.projectFinancialResultTable.length; index++) {
                        var item = $scope.projectFinancialResultTable[index];
                        result += item.kpi9;
                    }
                    for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                        var item = $scope.projectKPIElements[index];
                        result += item.amount;
                    }
                    return result;
            }
        }

        $scope.personSelected = function (userSelected) {
            var formData = {
                userDID: userSelected._id,
                year: $scope.year,
            }

            if ($scope.projectFinancialResultTable == undefined || $scope.projectFinancialResultTable.length == 0) {
                toastr.error('錯誤', '無已結算專案');
                return;
            }

            for (var index = 0; index < $scope.projectFinancialResultTable.length; index++) {
                var item = $scope.projectFinancialResultTable[index];
                formData[$scope.showPrjInfo(item.prjDID).prjCode] = 0
            }

            KpiTechDistributeUtil.createTD(formData)
                .success(function (res) {
                    $scope.fetchKpiTechDistribute();
                })
        }

        $scope.showSum = function (item) {
            var results = 0;

            Object.keys(item).forEach(function(key) {
                var value = item[key];
                if (key.length == 11) {
                    results += parseInt(value);
                }
            });
            return results;
        }

        $scope.showTotalSum = function() {
            var results = 0;
            for (var index = 0 ; index < $scope.projectTechMembers.length; index ++) {
                Object.keys($scope.projectTechMembers[index]).forEach(function(key) {
                    if (key.length == 11) {
                        var value = $scope.projectTechMembers[index][key];
                        results += parseInt(value);
                    }
                });
            }
            return results;
        }

        $scope.showPrjSum = function (item) {
            var results = 0;
            for (var index = 0 ; index < $scope.projectTechMembers.length; index ++) {
                results += parseInt($scope.projectTechMembers[index][item.prjCode]);
            }
            return (item.kpi7 - results);
        }

        $scope.showResidualSum = function () {
            var kpi7Sum = 0;
            for (var index = 0 ; index < $scope.projectFinancialResultTable.length; index ++) {
                kpi7Sum += parseInt($scope.projectFinancialResultTable[index].kpi7);
            }

            var results = 0;
            for (var index = 0 ; index < $scope.projectTechMembers.length; index ++) {
                Object.keys($scope.projectTechMembers[index]).forEach(function(key) {
                    if (key.length == 11) {
                        var value = $scope.projectTechMembers[index][key];
                        results += parseInt(value);
                    }
                });
            }
            return kpi7Sum - results;
        }


        // END
    }
})();


