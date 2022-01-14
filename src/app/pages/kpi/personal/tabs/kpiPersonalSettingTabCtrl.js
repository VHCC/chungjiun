/**
 * @author IChen.Chu
 * created on 13 01 2022
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.cgKPI')
        .controller('kpiPersonalSettingCtrl',
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
                kpiPersonalSettingCtrl
            ])

    /** @ngInject */
    function kpiPersonalSettingCtrl($scope,
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

        // //所有專案，資料比對用
        // Project.findAll()
        //     .success(function (allProjects) {
        //         $scope.allProjectCache = [];
        //         var prjCount = allProjects.length;
        //         for (var index = 0; index < prjCount; index++) {
        //
        //             // 專案名稱顯示規則 2019/07 定義
        //             var nameResult = "";
        //             if (allProjects[index].prjSubName != undefined && allProjects[index].prjSubName.trim() != "") {
        //                 nameResult = allProjects[index].prjSubName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
        //             } else if (allProjects[index].prjName != undefined && allProjects[index].prjName.trim() != "") {
        //                 nameResult = allProjects[index].prjName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
        //             } else {
        //                 nameResult = allProjects[index].mainName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
        //             }
        //
        //             $scope.allProjectCache[index] = {
        //                 prjDID: allProjects[index]._id,
        //                 prjCode: allProjects[index].prjCode,
        //                 mainName: allProjects[index].mainName + " - "
        //                 + allProjects[index].prjName + " - "
        //                 + allProjects[index].prjSubName + " - "
        //                 + ProjectUtil.getTypeText(allProjects[index].type),
        //                 majorID: allProjects[index].majorID,
        //                 managerID: allProjects[index].managerID,
        //                 technician: allProjects[index].technician,
        //                 ezName: nameResult,
        //                 combinedID: allProjects[index].combinedID,
        //             };
        //         }
        //     })

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
                vm.targetUsers = allUsers;
            });

        $scope.userDIDArray = [];

        $scope.personSelected = function (userSelected) {
            $scope.personSelect = userSelected;

            var formData = {
                userDID : $scope.personSelect._id,
            }
            KpiUtil.findKPIPersonQuerySetting(formData)
                .success(function (res) {
                    console.log(res);
                    if (res.payload.length == 0) {
                        KpiUtil.insertKPIPersonQuerySetting(formData)
                            .success(function (res) {
                                $scope.personSelected($scope.personSelect);
                            })
                    } else {
                        $scope.userDIDArray = res.payload[0].userDIDArray;
                        angular.element(
                            document.getElementById('includeHead_setting_kpi_personal_result'))
                            .html($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'績效可查詢範圍 - " +  $scope.userDIDArray.length + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/pages/kpi/personal/tables/kpiPersonal_setting_table.html'\">" +
                                "</div>" +
                                "</div>"
                            )($scope));
                    }
                })
        }

        $scope.targetPersonSelected = function (userSelected) {
            vm.targetUsers.targetSelected = null;
            if ($scope.personSelect._id === userSelected._id) {
                toastr.warning('不需要新增自己', 'Warning');
                return;
            }
            if ($scope.userDIDArray.includes(userSelected._id)) {
                toastr.warning('該同仁已經存在', 'Warning');
                return;
            }
            $scope.userDIDArray.push(userSelected._id)
            var formData = {
                userDID : $scope.personSelect._id,
                userDIDArray: $scope.userDIDArray,
            }
            KpiUtil.updateKPIPersonQuerySetting(formData)
                .success(function (res) {
                    $scope.personSelected($scope.personSelect);
                })
        }

        $scope.showUserName = function (userDID) {
            var selected = [];
            if (vm.users === undefined) return;
            if (userDID) {
                selected = $filter('filter')(vm.users, {
                    _id: userDID,
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        $scope.removeUserFromArray = function (userDID, index) {
            console.log(userDID + ", " + index);
            $scope.userDIDArray.splice(index,1);
            console.log($scope.userDIDArray);
            var formData = {
                userDID : $scope.personSelect._id,
                userDIDArray: $scope.userDIDArray,
            }
            KpiUtil.updateKPIPersonQuerySetting(formData)
                .success(function (res) {
                    $scope.personSelected($scope.personSelect);
                })
        }

        // END
    }
})();


