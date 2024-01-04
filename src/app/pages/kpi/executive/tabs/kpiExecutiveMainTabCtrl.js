/**
 * @author IChen.chu
 * created on 8 Nov 2021
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.cgKPI')
        .controller('kpiExecutiveCtrl',
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
                kpiExecutiveCtrl
            ])

    /** @ngInject */
    function kpiExecutiveCtrl($scope,
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

        var thisYear = new Date().getFullYear() - 1911;
        var specificYear = thisYear;

        $scope.listenYear = function (dom) {
            dom.$watch('myYear', function (newValue, oldValue) {
                if (dom.isShiftYearSelect) {
                    dom.isShiftYearSelect = false;
                    $scope.year = specificYear = newValue - 1911;
                    $scope.fetchYearlyProject(specificYear)
                }
            });
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

        // mainly function
        $scope.fetchYearlyProject = function (specificYear) {
            var formData = {
                year: specificYear,
                // isPrjClose: true,
                type: "executive",
            }
            // initialize
            $scope.projectFinancialResultTable = [];
            $scope.projectKPIElements = [];

            KpiUtil.findKPIYear(formData)
                .success(function (res) {
                    console.log(res);
                    if (res.payload.length == 0) {

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
                                console.log(res);
                                $scope.projectKPIElements = res.payload
                                angular.element(
                                    document.getElementById('includeHead_kpi_executive_result'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'" + "" + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/kpi/executive/tables/kpiExecutive_result_table.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));
                            })
                    }
                })
        }

        $scope.addKPIElement = function(type) {
            var formData = {
                year: $scope.year,
                type: type,
            }
            KpiUtil.insertKPIElement(formData)
                .success(function (res) {
                    $scope.fetchYearlyProject($scope.year)
                })
        }

        $scope.deleteKPIElement = function(kpi) {
            var formData = {
                _id: kpi._id,
            }
            KpiUtil.deleteKPIElement(formData)
                .success(function (res) {
                    $scope.fetchYearlyProject($scope.year)
                })
        }

        $scope.saveKPIElements = function() {
            for (var index= 0; index < $scope.projectKPIElements.length; index ++) {
                var formData = {
                    _id: $scope.projectKPIElements[index]._id,
                    amount: $scope.projectKPIElements[index].amount,
                    amount2: $scope.projectKPIElements[index].amount2,
                    memo: $scope.projectKPIElements[index].memo,
                }
                KpiUtil.updateKPIElement(formData)
                    .success(function (res) {
                    })
            }
            $scope.fetchYearlyProject($scope.year)
        }

        $scope.fetchKPIValue = function(type, item) {
            switch(type) {
                case 6: // 行政 1
                    return item.kpi6;
                case 61: // 行政 2
                    return item.kpi61;
                case 8: // 風險
                    return item.kpi8;
                case 9: // 利潤
                    return item.kpi9;
            }
        }

        $scope.calResultKpiAll = function(type) {
            var result = 0.0;
            switch (type){
                // 行政費 1
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
                // 行政費 2
                case 61:
                    for (var index = 0; index < $scope.projectFinancialResultTable.length; index++) {
                        var item = $scope.projectFinancialResultTable[index];
                        result += item.kpi61;
                    }
                    for (var index = 0; index < $scope.projectKPIElements.length; index++) {
                        var item = $scope.projectKPIElements[index];
                        result += item.amount2;
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

        // END
    }

})();


