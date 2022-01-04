/**
 * @author IChen.chu
 * created on 18 Nov 2021
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.cgKPI')
        .controller('kpiPersonal_011Ctrl',
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
                'ProjectFinancialDistributeUtil',
                'KpiUtil',
                'KpiTechDistributeUtil',
                'bsLoadingOverlayService',
                kpiPersonal011Ctrl
            ])

    /** @ngInject */
    function kpiPersonal011Ctrl($scope,
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
                                ProjectFinancialDistributeUtil,
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
        // $scope.year = specificYear;
        $scope.year = 109;

        $scope.listen5Years = function (dom) {
            console.log("listen5Years")
            dom.$watch('myYear', function (newValue, oldValue) {
                if (dom.isShiftYearSelect) {
                    dom.isShiftYearSelect = false;
                    $scope.year = specificYear = newValue - 1911;
                    $scope.year = (specificYear - specificYear % 5);
                    if ($scope.year <= 108) {
                        $scope.year = 109;
                        // toastr.warning("請搜尋2020年之後", 'Warn');
                    }
                    // $scope.year = 109;
                    $scope.initBonus($scope.personSelect);
                    $scope.fetchProjectFinancial0($scope.personSelect, 0);
                    $scope.fetchProjectFinancial1($scope.personSelect, 1);
                    $scope.fetchProjectFinancial2($scope.personSelect, 2);
                    $scope.fetchProjectFinancial3($scope.personSelect, 3);
                    $scope.fetchProjectFinancial4($scope.personSelect, 4);
                }
            });
        }

        $scope.saveBefore108KPI = function (userSelected) {
            console.log(userSelected);
            var formData = {
                userDID: userSelected._id,
                before108Kpi: userSelected.before108Kpi,
            }
            User.updateUserBefore108Kpi(formData)
                .success(function (res) {
                    $scope.initBonus($scope.personSelect);
                    toastr.success('儲存成功', 'Success');
                })
        }

        $scope.saveKPIBonus = function (dom) {
            var formData = {
                _id: dom._id,
                amount: dom.amount,
            }
            KpiUtil.updateKPIBonus(formData)
                .success(function (res) {
                    $scope.initBonus($scope.personSelect);
                    toastr.success('儲存成功', 'Success');
                })
        }

        $scope.initBonus = function (userSelected) {

            var formData = {
                userDID: userSelected._id
            }

            console.log(userSelected)

            KpiUtil.findKPIBonus(formData)
                .success(function (res) {
                    console.log("All Bonus list");
                    $scope.userSelectedAllBonus = 0;
                    console.log(res);
                    for (var i = 0; i < res.payload.length; i ++) {
                        $scope.userSelectedAllBonus += parseInt(res.payload[i].amount);
                    }
                })

            var formData = {
                year: $scope.year,
                userDID: userSelected._id
            }

            KpiUtil.findKPIBonus(formData)
                .success(function (res) {
                    if (res.payload.length == 0) {
                        var formData = {
                            year: $scope.year,
                            userDID: userSelected._id
                        }
                        KpiUtil.insertKPIBonus(formData)
                            .success(function (res) {
                                var evalString = "$scope.bonusData.y1 = res.payload";
                                eval(evalString);
                            })
                    } else {
                        var evalString = "$scope.bonusData.y1 = res.payload[0]";
                        eval(evalString);
                    }
                })

            var formData = {
                year: $scope.year + 1,
                userDID: userSelected._id
            }
            KpiUtil.findKPIBonus(formData)
                .success(function (res) {
                    if (res.payload.length == 0) {
                        var formData = {
                            year: $scope.year + 1,
                            userDID: userSelected._id
                        }
                        KpiUtil.insertKPIBonus(formData)
                            .success(function (res) {
                                var evalString = "$scope.bonusData.y2 = res.payload";
                                eval(evalString);
                            })
                    } else {
                        var evalString = "$scope.bonusData.y2 = res.payload[0]";
                        eval(evalString);
                    }
                })

            var formData = {
                year: $scope.year + 2,
                userDID: userSelected._id
            }
            KpiUtil.findKPIBonus(formData)
                .success(function (res) {
                    if (res.payload.length == 0) {
                        var formData = {
                            year: $scope.year + 2,
                            userDID: userSelected._id
                        }
                        KpiUtil.insertKPIBonus(formData)
                            .success(function (res) {
                                var evalString = "$scope.bonusData.y3 = res.payload";
                                eval(evalString);
                            })
                    } else {
                        var evalString = "$scope.bonusData.y3 = res.payload[0]";
                        eval(evalString);
                    }
                })

            var formData = {
                year: $scope.year + 3,
                userDID: userSelected._id
            }
            KpiUtil.findKPIBonus(formData)
                .success(function (res) {
                    if (res.payload.length == 0) {
                        var formData = {
                            year: $scope.year + 3,
                            userDID: userSelected._id
                        }
                        KpiUtil.insertKPIBonus(formData)
                            .success(function (res) {
                                var evalString = "$scope.bonusData.y4 = res.payload";
                                eval(evalString);
                            })
                    } else {
                        var evalString = "$scope.bonusData.y4 = res.payload[0]";
                        eval(evalString);
                    }
                })

            var formData = {
                year: $scope.year + 4,
                userDID: userSelected._id
            }
            KpiUtil.findKPIBonus(formData)
                .success(function (res) {
                    if (res.payload.length == 0) {
                        var formData = {
                            year: $scope.year + 4,
                            userDID: userSelected._id
                        }
                        KpiUtil.insertKPIBonus(formData)
                            .success(function (res) {
                                var evalString = "$scope.bonusData.y5 = res.payload";
                                eval(evalString);
                            })
                    } else {
                        var evalString = "$scope.bonusData.y5 = res.payload[0]";
                        eval(evalString);
                    }
                })
        }

        $scope.showKpiResidual = function() {
            if (!$scope.personSelect) return;
            return parseInt($scope.personSelect.before108Kpi) +
                parseInt($scope.userKpiDistributeTotal) +
                parseInt($scope.userTechKpiTotal) -
                parseInt($scope.userSelectedAllBonus);
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

        // $scope.calResultKpiAll = function (type) {
        //     var result = 0.0;
        //     switch (type) {
        //         // 行政費
        //         case 6:
        //             for (var index = 0; index < $scope.projectFinancialResultTable_total.length; index++) {
        //                 var item = $scope.projectFinancialResultTable_total[index];
        //                 result += item.kpi6;
        //             }
        //             for (var index = 0; index < $scope.projectKPIElements.length; index++) {
        //                 var item = $scope.projectKPIElements[index];
        //                 result += item.amount;
        //             }
        //             return result;
        //         // 風險 E*N
        //         case 8:
        //             for (var index = 0; index < $scope.projectFinancialResultTable_total.length; index++) {
        //                 var item = $scope.projectFinancialResultTable_total[index];
        //                 result += item.kpi8;
        //             }
        //             for (var index = 0; index < $scope.projectKPIElements.length; index++) {
        //                 var item = $scope.projectKPIElements[index];
        //                 result += item.amount;
        //             }
        //             return result;
        //         // 利潤 E*N
        //         case 9:
        //             for (var index = 0; index < $scope.projectFinancialResultTable_total.length; index++) {
        //                 var item = $scope.projectFinancialResultTable_total[index];
        //                 result += item.kpi9;
        //             }
        //             for (var index = 0; index < $scope.projectKPIElements.length; index++) {
        //                 var item = $scope.projectKPIElements[index];
        //                 result += item.amount;
        //             }
        //             return result;
        //     }
        // }

        // $scope.personSelect;

        $scope.personSelected = function (userSelected) {
            $scope.personSelect = userSelected;
            $scope.initBonus($scope.personSelect);
            $scope.fetchProjectFinancial0($scope.personSelect, 0);
            $scope.fetchProjectFinancial1($scope.personSelect, 1);
            $scope.fetchProjectFinancial2($scope.personSelect, 2);
            $scope.fetchProjectFinancial3($scope.personSelect, 3);
            $scope.fetchProjectFinancial4($scope.personSelect, 4);

            var getData = {
                targetUser : userSelected,
            };
            ProjectFinancialDistributeUtil.findFDByUserUUID(getData)
                .success(function (res) {
                    console.log(res);
                    $scope.userKpiDistributeTotal = 0;
                    for (var i = 0; i < res.payload.length; i ++) {
                        $scope.userKpiDistributeTotal += parseInt(res.payload[i].distributeBonus);
                    }
                    console.log($scope.userKpiDistributeTotal);
                })

            var formData = {
                userDID : $scope.personSelect._id,
            }
            KpiTechDistributeUtil.findTD(formData)
                .success(function (res) {
                    $scope.userTechKpiTotal = 0;
                    // console.log(res);
                    for (var i = 0; i < res.payload.length; i ++) {
                        var item = res.payload[i];
                        var keys = Object.keys(item);
                        // console.log(keys)
                        for (var j = 0; j < keys.length; j ++) {
                            var key = keys[j];
                            if (key.length == 11) {
                                // console.log(item[key]);
                                $scope.userTechKpiTotal += parseInt(item[key]);
                            }
                        }
                    }
                })
        }

        $scope.fetchProjectFinancial0 = function (userSelected, yearAdd) {
            var getData = {
                year: ($scope.year + yearAdd) + "",
                targetUser : userSelected,
            };

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_kpi_personal'
            });

            ProjectFinancialDistributeUtil.findFDByYear(getData)
                .success(function (res) {
                    $scope.personalFDData_y0 = res.payload;

                    angular.element(
                        document.getElementById('includeHead_kpi_personal_result_011_0y'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'列表 - " +  $scope.personalFDData_y0.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/kpi/personal/tables/kpiPersonalTable_011_y0.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)

                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)
                })

            $scope.projectTechMembers_y0 = [];
            var formData = {
                year: $scope.year + yearAdd,
                userDID : $scope.personSelect._id,
            }
            KpiTechDistributeUtil.findTD(formData)
                .success(function (res) {
                    $scope.projectTechMembers_y0 = res.payload;

                    var formDataTech = {
                        year: $scope.year + yearAdd,
                        type: "tech",
                    }

                    // initialize
                    $scope.projectFinancialResultTable_y0 = [];

                    KpiUtil.findKPIYear(formDataTech)
                        .success(function (res) {
                            if (res.payload.length == 0) {
                            } else {
                                for (var index = 0; index < res.payload.length; index++) {
                                    var prjCode = $scope.showPrjInfo(res.payload[index].prjDID).prjCode;
                                    res.payload[index].prjCode = prjCode
                                    var user = $scope.projectTechMembers_y0[0];
                                    if (user !== undefined && user[prjCode] !== undefined && user[prjCode] > 0) {
                                        $scope.projectFinancialResultTable_y0.push(res.payload[index]);
                                    }
                                }
                                angular.element(
                                    document.getElementById('includeHead_kpi_personal_result_011_tech_0y'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'" + "" + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/kpi/personal/tables/kpiTech_person_view_result_011_y0.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));
                            }
                        })
                        .error(function () {
                        })

                })
            $scope.fetchYearlyKpiPersonElements($scope.year, yearAdd);
        }

        $scope.fetchYearlyKpiPersonElements = function(year, yearAdd) {
            var formData = {
                year: (year + yearAdd),
                userDID: $scope.personSelect._id,
            }

            switch(yearAdd) {
                case 0:
                    KpiUtil.findKPIPersonElement(formData)
                        .success(function (res) {
                            console.log(res);
                            $scope.projectKPIPersonElements_y0 = res.payload;
                            angular.element(
                                document.getElementById('includeHead_kpi_person_result_elements_0y'))
                                .html($compile(
                                    "<div ba-panel ba-panel-title=" +
                                    "'" + "" + "'" +
                                    "ba-panel-class= " +
                                    "'with-scroll'" + ">" +
                                    "<div " +
                                    "ng-include=\"'app/pages/kpi/personal/tables/kpiPerson_element_result_table_y0.html'\">" +
                                    "</div>" +
                                    "</div>"
                                )($scope));
                        })
                    break;
                case 1:
                    KpiUtil.findKPIPersonElement(formData)
                        .success(function (res) {
                            console.log(res);
                            $scope.projectKPIPersonElements_y1 = res.payload;
                            angular.element(
                                document.getElementById('includeHead_kpi_person_result_elements_1y'))
                                .html($compile(
                                    "<div ba-panel ba-panel-title=" +
                                    "'" + "" + "'" +
                                    "ba-panel-class= " +
                                    "'with-scroll'" + ">" +
                                    "<div " +
                                    "ng-include=\"'app/pages/kpi/personal/tables/kpiPerson_element_result_table_y1.html'\">" +
                                    "</div>" +
                                    "</div>"
                                )($scope));
                        })
                    break;
                case 2:
                    KpiUtil.findKPIPersonElement(formData)
                        .success(function (res) {
                            console.log(res);
                            $scope.projectKPIPersonElements_y2 = res.payload;
                            angular.element(
                                document.getElementById('includeHead_kpi_person_result_elements_2y'))
                                .html($compile(
                                    "<div ba-panel ba-panel-title=" +
                                    "'" + "" + "'" +
                                    "ba-panel-class= " +
                                    "'with-scroll'" + ">" +
                                    "<div " +
                                    "ng-include=\"'app/pages/kpi/personal/tables/kpiPerson_element_result_table_y2.html'\">" +
                                    "</div>" +
                                    "</div>"
                                )($scope));
                        })
                    break;
                case 3:
                    KpiUtil.findKPIPersonElement(formData)
                        .success(function (res) {
                            console.log(res);
                            $scope.projectKPIPersonElements_y3 = res.payload;
                            angular.element(
                                document.getElementById('includeHead_kpi_person_result_elements_3y'))
                                .html($compile(
                                    "<div ba-panel ba-panel-title=" +
                                    "'" + "" + "'" +
                                    "ba-panel-class= " +
                                    "'with-scroll'" + ">" +
                                    "<div " +
                                    "ng-include=\"'app/pages/kpi/personal/tables/kpiPerson_element_result_table_y3.html'\">" +
                                    "</div>" +
                                    "</div>"
                                )($scope));
                        })
                    break;
                case 4:
                    KpiUtil.findKPIPersonElement(formData)
                        .success(function (res) {
                            console.log(res);
                            $scope.projectKPIPersonElements_y4 = res.payload;
                            angular.element(
                                document.getElementById('includeHead_kpi_person_result_elements_4y'))
                                .html($compile(
                                    "<div ba-panel ba-panel-title=" +
                                    "'" + "" + "'" +
                                    "ba-panel-class= " +
                                    "'with-scroll'" + ">" +
                                    "<div " +
                                    "ng-include=\"'app/pages/kpi/personal/tables/kpiPerson_element_result_table_y4.html'\">" +
                                    "</div>" +
                                    "</div>"
                                )($scope));
                        })
                    break;
            }
        }

        $scope.addKPIElement = function (yearAdd) {
            var formData = {
                year: $scope.year + yearAdd,
                userDID: $scope.personSelect._id,
            }
            KpiUtil.insertKPIPersonElement(formData)
                .success(function (res) {
                    $scope.fetchYearlyKpiPersonElements($scope.year, yearAdd)
                })
        }

        $scope.deleteKPIElement = function (kpi, yearAdd) {
            var formData = {
                _id: kpi._id,
            }
            KpiUtil.deleteKPIElement(formData)
                .success(function (res) {
                    $scope.fetchYearlyKpiPersonElements($scope.year, yearAdd)
                })
        }

        $scope.saveKPIElements = function (yearAdd) {
            var projectKPIElements = undefined;
            switch (yearAdd) {
                case 0:
                    projectKPIElements = $scope.projectKPIPersonElements_y0;
                    break;
                case 1:
                    projectKPIElements = $scope.projectKPIPersonElements_y1;
                    break;
                case 2:
                    projectKPIElements = $scope.projectKPIPersonElements_y2;
                    break;
                case 3:
                    projectKPIElements = $scope.projectKPIPersonElements_y3;
                    break;
                case 4:
                    projectKPIElements = $scope.projectKPIPersonElements_y4;
                    break;
            }

            for (var index = 0; index < projectKPIElements.length; index++) {
                var formData = {
                    _id: projectKPIElements[index]._id,
                    amount: projectKPIElements[index].amount,
                    memo: projectKPIElements[index].memo,
                }
                KpiUtil.updateKPIElement(formData)
                    .success(function (res) {
                    })
            }
            $scope.fetchYearlyKpiPersonElements($scope.year, yearAdd)
        }

        $scope.fetchProjectFinancial1 = function (userSelected, yearAdd) {
            var getData = {
                year: ($scope.year + yearAdd) + "",
                targetUser : userSelected,
            };

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_kpi_personal'
            });

            ProjectFinancialDistributeUtil.findFDByYear(getData)
                .success(function (res) {
                    $scope.personalFDData_y1 = res.payload;

                    angular.element(
                        document.getElementById('includeHead_kpi_personal_result_011_1y'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'列表 - " +  $scope.personalFDData_y1.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/kpi/personal/tables/kpiPersonalTable_011_y1.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)

                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)
                })


            $scope.projectTechMembers_y1 = [];
            var formData = {
                year: $scope.year + yearAdd,
                userDID : $scope.personSelect._id,
            }
            KpiTechDistributeUtil.findTD(formData)
                .success(function (res) {
                    $scope.projectTechMembers_y1 = res.payload;

                    var formDataTech = {
                        year: $scope.year + yearAdd,
                        type: "tech",
                    }

                    // initialize
                    $scope.projectFinancialResultTable_y1 = [];
                    $scope.projectKPIElements = [];

                    KpiUtil.findKPIYear(formDataTech)
                        .success(function (res) {
                            if (res.payload.length == 0) {
                            } else {
                                for (var index = 0; index < res.payload.length; index++) {
                                    var prjCode = $scope.showPrjInfo(res.payload[index].prjDID).prjCode;
                                    res.payload[index].prjCode = prjCode

                                    var user = $scope.projectTechMembers_y1[0];

                                    if (user !== undefined && user[prjCode] !== undefined && user[prjCode] > 0) {

                                        $scope.projectFinancialResultTable_y1.push(res.payload[index]);
                                    }
                                }
                                angular.element(
                                    document.getElementById('includeHead_kpi_personal_result_011_tech_1y'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'" + "" + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/kpi/personal/tables/kpiTech_person_view_result_011_y1.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));
                            }
                        })
                        .error(function () {
                        })
                })
            $scope.fetchYearlyKpiPersonElements($scope.year, yearAdd);
        }

        $scope.fetchProjectFinancial2 = function (userSelected, yearAdd) {
            var getData = {
                year: ($scope.year + yearAdd) + "",
                targetUser : userSelected,
            };

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_kpi_personal'
            });

            ProjectFinancialDistributeUtil.findFDByYear(getData)
                .success(function (res) {
                    $scope.personalFDData_y2 = res.payload;
                    angular.element(
                        document.getElementById('includeHead_kpi_personal_result_011_2y'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'列表 - " +  $scope.personalFDData_y2.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/kpi/personal/tables/kpiPersonalTable_011_y2.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)
                })

            $scope.projectTechMembers_y2 = [];
            var formData = {
                year: $scope.year + yearAdd,
                userDID : $scope.personSelect._id,
            }
            KpiTechDistributeUtil.findTD(formData)
                .success(function (res) {
                    $scope.projectTechMembers_y2 = res.payload;

                    var formDataTech = {
                        year: $scope.year + yearAdd,
                        type: "tech",
                    }

                    // initialize
                    $scope.projectFinancialResultTable_y2 = [];
                    $scope.projectKPIElements = [];

                    KpiUtil.findKPIYear(formDataTech)
                        .success(function (res) {
                            if (res.payload.length == 0) {
                            } else {
                                for (var index = 0; index < res.payload.length; index++) {
                                    var prjCode = $scope.showPrjInfo(res.payload[index].prjDID).prjCode;
                                    res.payload[index].prjCode = prjCode
                                    var user = $scope.projectTechMembers_y2[0];
                                    if (user !== undefined && user[prjCode] !== undefined && user[prjCode] > 0) {
                                        $scope.projectFinancialResultTable_y2.push(res.payload[index]);
                                    }
                                }
                                angular.element(
                                    document.getElementById('includeHead_kpi_personal_result_011_tech_2y'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'" + "" + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/kpi/personal/tables/kpiTech_person_view_result_011_y2.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));
                            }
                        })
                        .error(function () {
                        })
                })
            $scope.fetchYearlyKpiPersonElements($scope.year, yearAdd);
        }

        $scope.fetchProjectFinancial3 = function (userSelected, yearAdd) {
            var getData = {
                year: ($scope.year + yearAdd) + "",
                targetUser : userSelected,
            };
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_kpi_personal'
            });
            ProjectFinancialDistributeUtil.findFDByYear(getData)
                .success(function (res) {
                    $scope.personalFDData_y3 = res.payload;
                    angular.element(
                        document.getElementById('includeHead_kpi_personal_result_011_3y'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'列表 - " +  $scope.personalFDData_y3.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/kpi/personal/tables/kpiPersonalTable_011_y3.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)
                })

            $scope.projectTechMembers_y3 = [];
            var formData = {
                year: $scope.year + yearAdd,
                userDID : $scope.personSelect._id,
            }
            KpiTechDistributeUtil.findTD(formData)
                .success(function (res) {
                    $scope.projectTechMembers_y3 = res.payload;

                    var formDataTech = {
                        year: $scope.year + yearAdd,
                        type: "tech",
                    }

                    // initialize
                    $scope.projectFinancialResultTable_y3 = [];
                    $scope.projectKPIElements = [];

                    KpiUtil.findKPIYear(formDataTech)
                        .success(function (res) {
                            if (res.payload.length == 0) {
                            } else {
                                for (var index = 0; index < res.payload.length; index++) {
                                    var prjCode = $scope.showPrjInfo(res.payload[index].prjDID).prjCode;
                                    res.payload[index].prjCode = prjCode
                                    var user = $scope.projectTechMembers_y3[0];
                                    if (user !== undefined && user[prjCode] !== undefined && user[prjCode] > 0) {
                                        $scope.projectFinancialResultTable_y3.push(res.payload[index]);
                                    }
                                }
                                angular.element(
                                    document.getElementById('includeHead_kpi_personal_result_011_tech_3y'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'" + "" + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/kpi/personal/tables/kpiTech_person_view_result_011_y3.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));
                            }
                        })
                        .error(function () {
                        })
                })
            $scope.fetchYearlyKpiPersonElements($scope.year, yearAdd);
        }

        $scope.fetchProjectFinancial4 = function (userSelected, yearAdd) {
            var getData = {
                year: ($scope.year + yearAdd) + "",
                targetUser : userSelected,
            };

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_kpi_personal'
            });
            // console.log(getData)
            ProjectFinancialDistributeUtil.findFDByYear(getData)
                .success(function (res) {
                    // console.log(res)
                    $scope.personalFDData_y4 = res.payload;

                    angular.element(
                        document.getElementById('includeHead_kpi_personal_result_011_4y'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'列表 - " +  $scope.personalFDData_y4.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/kpi/personal/tables/kpiPersonalTable_011_y4.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_kpi_personal'
                        });
                    }, 500)
                })

            $scope.projectTechMembers_y4 = [];
            var formData = {
                year: $scope.year + yearAdd,
                userDID : $scope.personSelect._id,
            }
            // console.log(formData)
            KpiTechDistributeUtil.findTD(formData)
                .success(function (res) {
                    // console.log(res)
                    $scope.projectTechMembers_y4 = res.payload;

                    var formDataTech = {
                        year: $scope.year + yearAdd,
                        type: "tech",
                    }

                    // initialize
                    $scope.projectFinancialResultTable_y4 = [];
                    // $scope.projectKPIElements = [];

                    KpiUtil.findKPIYear(formDataTech)
                        .success(function (res) {
                            // console.log(res)
                            if (res.payload.length == 0) {
                            } else {
                                for (var index = 0; index < res.payload.length; index++) {
                                    var prjCode = $scope.showPrjInfo(res.payload[index].prjDID).prjCode;
                                    res.payload[index].prjCode = prjCode
                                    var user = $scope.projectTechMembers_y4[0];
                                    if (user !== undefined && user[prjCode] !== undefined && user[prjCode] > 0) {
                                        $scope.projectFinancialResultTable_y4.push(res.payload[index]);
                                    }
                                }
                                angular.element(
                                    document.getElementById('includeHead_kpi_personal_result_011_tech_4y'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'" + "" + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/kpi/personal/tables/kpiTech_person_view_result_011_y4.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));
                            }
                        })
                        .error(function () {
                        })
                })
            $scope.fetchYearlyKpiPersonElements($scope.year, yearAdd);
        }

        // END

        // METHODS
        // type 2, 一專案加一人名 為一筆
        $scope.filter_type2_data = function (rawTables) {
            var type2_result = [];
            for (var index = 0; index < rawTables.length; index++) {
                if (($scope.calculateHours_type2(rawTables[index]) +
                    $scope.calculateHours_type2_add(rawTables[index], 1) +
                    $scope.calculateHours_type2_add(rawTables[index], 2) != 0)) {
                    type2_result.push(rawTables[index]);
                }
            }
            // console.log(type2_result);
            return type2_result;
        }

        var cons_1 = 2.0;
        var cons_2 = 2.0; // 換休
        var cons_3 = 1.67; // 加班


        $scope.calculateHours_type2 = function (item, type) {
            if (item.iscalculate_A && item.iscalculate_B) {
                switch (type) {
                    case 1:
                        return item.hourTotal;
                        break;
                    case 2:
                        return parseInt(item.totalCost);
                        break;
                }
            }
            // console.log(item);
            var hourTotal = 0;
            var totalCost = 0.0;
            for (var index = 0; index < item.tables.length; index++) {
                if (item.tables[index].create_formDate == "2019/12/30") {
                    hourTotal += parseFloat(item.tables[index].wes_hour)
                    totalCost += parseFloat(item.tables[index].wes_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].thu_hour)
                    totalCost += parseFloat(item.tables[index].thu_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].fri_hour)
                    totalCost += parseFloat(item.tables[index].fri_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].sat_hour)
                    totalCost += parseFloat(item.tables[index].sat_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].sun_hour)
                    totalCost += parseFloat(item.tables[index].sun_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;
                } else if (moment(item.tables[index].create_formDate) > moment("2020/01/01")) {
                    hourTotal += parseFloat(item.tables[index].mon_hour)
                    totalCost += parseFloat(item.tables[index].mon_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].tue_hour)
                    totalCost += parseFloat(item.tables[index].tue_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].wes_hour)
                    totalCost += parseFloat(item.tables[index].wes_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].thu_hour)
                    totalCost += parseFloat(item.tables[index].thu_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].fri_hour)
                    totalCost += parseFloat(item.tables[index].fri_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].sat_hour)
                    totalCost += parseFloat(item.tables[index].sat_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;

                    hourTotal += parseFloat(item.tables[index].sun_hour)
                    totalCost += parseFloat(item.tables[index].sun_hour) * item.tables[index].userMonthSalary / 30 / 8 * cons_1;
                }
            }
            item.hourTotal = hourTotal;
            item.totalCost = totalCost;
            switch (type) {
                case 1:
                    return hourTotal;
                    break;
                case 2:
                    return parseInt(totalCost);
                    break;
            }
        }

        $scope.calculateHours_type2_add = function (item, type) {
            var mins = 0

            var hourTotal = 0;
            var totalCost = 0.0;

            if (item._add_tables == undefined) {
                switch (type) {
                    case 1:
                        item.iscalculate_A = true;
                        item.hourTotal_add_A = hourTotal;
                        item.hourTotal_add_cost_A = parseInt(totalCost * cons_3);
                        break;
                    case 2:
                        item.iscalculate_B = true;
                        item.hourTotal_add_B = hourTotal;
                        item.hourTotal_add_cost_B = parseInt(totalCost * cons_2);
                        break;
                }
                return hourTotal;
            }

            var type2_add_data = [];

            for (var index = 0; index < item._add_tables.length; index++) {
                var operatedFormDate = item._add_tables[index].create_formDate;
                if (moment(DateUtil.getShiftDatefromFirstDate_typeB(moment(operatedFormDate), item._add_tables[index].day - 1)) < moment("2020/01/01")) {
                    continue
                }
                if (item._add_tables[index].workAddType == type) {

                    if (!item._add_tables[index].isExecutiveConfirm) {
                        continue;
                    }

                    var date_id = DateUtil.getShiftDatefromFirstDate_typeB(moment(operatedFormDate), item._add_tables[index].day - 1) + "_" + item._add_tables[index].creatorDID;
                    var min = parseInt(TimeUtil.getCalculateHourDiffByTime(item._add_tables[index].start_time, item._add_tables[index].end_time))
                    // mins += min;
                    if (type2_add_data[date_id] != undefined) {
                        var data = type2_add_data[date_id];
                        data.min = min + type2_add_data[date_id].min;
                    } else {
                        var data = {
                            _date: DateUtil.getShiftDatefromFirstDate(moment(operatedFormDate), item._add_tables[index].day - 1),
                            min: min,
                            monthSalary: item._add_tables[index].userMonthSalary,
                            creatorDID: item._add_tables[index].creatorDID,
                        }
                        type2_add_data.push(data);
                        eval('type2_add_data[date_id] = data')
                    }
                }
            }
            // console.log(type2_add_data);
            var hour = 0
            for (var i = 0; i < type2_add_data.length; i++) {
                hour = type2_add_data[i].min % 60 < 30 ? Math.round(type2_add_data[i].min / 60) : Math.round(type2_add_data[i].min / 60) - 0.5;
                if (hour < 1) {
                    hourTotal += 0;
                } else {
                    hourTotal += hour;
                    totalCost += hour * type2_add_data[i].monthSalary / 30 / 8;
                }
            }
            switch (type) {
                case 1:
                    item.iscalculate_A = true;
                    item.hourTotal_add_A = hourTotal;
                    item.hourTotal_add_cost_A = parseInt(totalCost * cons_3);
                    break;
                case 2:
                    item.iscalculate_B = true;
                    item.hourTotal_add_B = hourTotal;
                    item.hourTotal_add_cost_B = parseInt(totalCost * cons_2);
                    break;
            }
            return hourTotal;
        }

        $scope.bonusData = {}

        $scope.getTotalCost = function (item) {
            return Math.round(item.totalCost + item.hourTotal_add_cost_A + item.hourTotal_add_cost_B);
        }


    }
})();


