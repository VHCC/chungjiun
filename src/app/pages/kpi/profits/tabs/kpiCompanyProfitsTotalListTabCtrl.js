/**
 * @author IChen.chu
 * created on 17 Nov 2021
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.cgKPI')
        .controller('kpiCompanyProfitsTotalListCtrl',
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
                'bsLoadingOverlayService',
                kpiCompanyProfitsTotalListCtrl
            ])

    /** @ngInject */
    function kpiCompanyProfitsTotalListCtrl($scope,
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
                                bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        // 主要顯示
        $scope.subContractorVendors = [];

        var thisYear = new Date().getFullYear() - 1911;
        var specificYear = thisYear;
        $scope.year = 109;

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
            var resault = "";
            var selected = [];
            if ($scope.projectTechs === undefined) return;
            for (var index = 0; index < techs.length; index++) {
                selected = $filter('filter')($scope.projectTechs, {
                    value: techs[index],
                });
                resault += selected.length ? selected[0].name + ", " : '未指定';
            }
            return resault;
        }

        // initialize
        $scope.projectFinancialResultTable_Total = [];
        $scope.projectKPIElements_total = [];

        // mainly function
        $scope.fetchYearlyProject = function (specificYear) {
            var formData = {
                year: specificYear,
                type: "profits",
            }
            console.log(formData);

            var projectFinancialResultTable = [];
            var projectKPIElements = [];

            var yearIndex = "_" + specificYear

            projectFinancialResultTable.year = yearIndex;
            projectFinancialResultTable.yearShow = specificYear;
            KpiUtil.findKPIYear(formData)
                .success(function (res) {
                    if (res.payload.length == 0) {

                    } else {
                        for (var index = 0; index < res.payload.length; index++) {
                            projectFinancialResultTable.push(res.payload[index]);
                        }
                        eval("$scope.projectFinancialResultTable_Total[yearIndex]=projectFinancialResultTable");
                        $scope.projectFinancialResultTable_Total.push(projectFinancialResultTable);
                        // console.log($scope.projectFinancialResultTable_Total)
                        KpiUtil.findKPIElement(formData)
                            .success(function (res) {
                                // console.log(res);
                                projectKPIElements = res.payload
                                eval("$scope.projectKPIElements_total[yearIndex]=projectKPIElements");
                                angular.element(
                                    document.getElementById('includeHead_kpi_companyProfits_result_total'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'" + "" + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/kpi/profits/tables/kpiCompanyProfits_result_total_list_table.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));
                            })
                    }
                })
        }

        $scope.showUp = function() {
            $scope.projectFinancialResultTable_Total = [];
            $scope.projectKPIElements_total = [];
            for (var i = 109; i <= thisYear; i ++) {
                $scope.fetchYearlyProject(i)
            }
            // $scope.fetchYearlyProject($scope.year)
        }

        $scope.fetchKPIValue = function(type, item) {
            switch(type) {
                case 8:
                    return item.kpi8;
                case 9:
                    return item.kpi9;
            }
        }

        $scope.calResultKpiAllTotalList = function(type, results) {
            // console.log(results);
            var result = 0.0;
            switch (type){
                // 風險 E*N
                case 8:
                    for (var index = 0; index < results.length; index++) {
                        var item = results[index];
                        result += item.kpi8;
                    }
                    var KpiElements = $scope.projectKPIElements_total[results.year];
                    for (var index = 0; index < KpiElements.length; index++) {
                        var item = KpiElements[index];
                        result += item.amount;
                    }
                    return result;
                // 利潤 E*N
                case 9:
                    for (var index = 0; index < results.length; index++) {
                        var item = results[index];
                        result += item.kpi9;
                    }
                    var KpiElements = $scope.projectKPIElements_total[results.year];
                    for (var index = 0; index < KpiElements.length; index++) {
                        var item = KpiElements[index];
                        result += item.amount;
                    }
                    return result;
            }
        }

        // END
    }

})();


