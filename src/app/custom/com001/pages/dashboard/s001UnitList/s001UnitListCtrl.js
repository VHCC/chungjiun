/**
 * @author IChen.Chu
 * created on 07.31.2023
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('s001UnitListCtrl', [
            '$scope',
            '$window',
            '$cookies',
            'baConfig',
            'ngDialog',
            '$filter',
            '$compile',
            'toastr',
            'User',
            '$timeout',
            'bsLoadingOverlayService',
            '_001_Institute',
            '_001_ProjectContract',
            '_001_ProjectCase',
            '_001_Project',
            '_001_DepBoss',
            '_001_CaseTask',
            s001UnitListCtrl
        ]);

    /** @ngInject */
    function s001UnitListCtrl($scope,
                                window,
                                $cookies,
                                baConfig,
                                ngDialog,
                                $filter,
                                $compile,
                                toastr,
                                User,
                                $timeout,
                                bsLoadingOverlayService,
                                _001_Institute,
                                _001_ProjectContract,
                                _001_ProjectCase,
                                _001_Project,
                                _001_DepBoss,
                                _001_CaseTask) {

        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.depType = $cookies.get('depType');

        var isFetchAllPrj = false;
        var isDepBoss = false;

        var vm = this;

        $scope.init = function() {
            console.log("init...");
            console.log("isFetchAllPrj:> " + isFetchAllPrj);
            console.log("isDepBoss:> " + isDepBoss);

            // 所有人，對照資料
            User.getAllUsers()
                .success(function (allUsers) {
                    $scope.allUsers = [];
                    for (var i = 0; i < allUsers.length; i++) {
                        $scope.allUsers[i] = {
                            value: allUsers[i]._id,
                            name: allUsers[i].name
                        };
                    }
                });

            // 機關
            _001_Institute.findAll()
                .success(function (resp) {
                    vm.instituteOptions = resp;
                })

            if (isFetchAllPrj) {
                _001_Project.findAll()
                    .success(function (prjUnits) {
                        if (prjUnits.length > 0) {
                            $scope.showData(prjUnits);
                        }
                    })
            } else if (isDepBoss) {
                var bossDep = $scope.getMyDep($scope.userDID, vm.depBossSettings);

                console.log(bossDep);

                var userData = {
                    depType: bossDep.depType,
                    userDID: $scope.userDID,
                }

                console.log(userData);
                _001_Project.findAllByDepType(userData)
                    .success(function (prjUnits) {
                        if (prjUnits.length > 0) {
                            $scope.showData(prjUnits);
                        }
                    })

            } else {
                var userData = {
                    userDID: $scope.userDID,
                }
                _001_Project.findAllByUserDID(userData)
                    .success(function (prjUnits) {
                        if (prjUnits.length > 0) {
                            $scope.showData(prjUnits);
                        }
                    });
            }
        }

        switch($scope.roleType) { // 總經理 1、技師 5、經理 2、組長 4
            case "1":
            case "2":
            case "4":
            case "5":
                isFetchAllPrj = true;
                break;
        }

        switch($scope.depType) { // 老闆
            case "A":
                isFetchAllPrj = true;
                break;
        }

        _001_DepBoss.findAll()
            .success(function (depBoss) {
                vm.depBossSettings = depBoss;
                isDepBoss = $scope.isDepBoss($scope.userDID, vm.depBossSettings);
                $scope.init();
            });

        var emptyObject = {
            name: "Can not find",
            code: "Can not find",
        }

        $scope.getProjectCase = function (caseDID) {
            var selected = [];
            if (caseDID) {
                selected = $filter('filter')($scope.allCaseForUser, {
                    _id: caseDID,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.isDepBoss = function (targetUuid, options) {
            var selected = [];
            if (targetUuid) {
                selected = $filter('filter')(options, {
                    userDID: targetUuid,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return false;
            }
            if (selected.length > 0) {
                return true;
            }
            return false;
        }

        $scope.getMyDep = function (targetUuid, options) {
            var selected = [];
            if (targetUuid) {
                selected = $filter('filter')(options, {
                    userDID: targetUuid,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return "";
            }
            if (selected.length > 0) {
                return selected[0];
            }
        }

        $scope.showData = function (prjUnits) {
            // console.log(prjUnits);
            $scope.prjUnits = prjUnits;

            var prjUnit_ContractDIDs = [];
            $scope.prjUnits.forEach(function (prjUnit) {
                if (!prjUnit_ContractDIDs.includes(prjUnit.caseDID)) {
                    prjUnit_ContractDIDs.push(prjUnit.caseDID);
                }
            });

            var formData = {
                contractDIDs: prjUnit_ContractDIDs,
            }

            _001_ProjectCase.findByCaseDIDMulti(formData)
                .success(function (caseList) {
                    // console.log(caseList);
                    $scope.allCaseForUser = caseList;

                    $scope.prjUnits.forEach(function (prjUnit) {

                        prjUnit.caseName = $scope.getProjectCase(prjUnit.caseDID).name;
                    });
                })

            angular.element(
                document.getElementById('includeHead_s001UnitList'))
                .html($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'專案列表 - " + prjUnits.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/custom/com001/pages/dashboard/s001UnitList/table/s001UnitListTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));
        }

        $scope.checkUpdateStatus = function (prjUnit) {
            // console.log(prjUnit.userUpdateTs);
            // console.log(moment(prjUnit.userUpdateTs).isSameOrAfter(moment().startOf("week")));
            if (prjUnit.userUpdateTs === undefined) return false;
            return moment(prjUnit.userUpdateTs).isSameOrAfter(moment().startOf("week"));
        }

        $scope.showMajorName = function (project) {
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (project.majorID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: project.majorID
                });
            }
            if (selected.length == 1) {
                project.majorName = selected[0].name;
            } else if (selected.length == 0) {
                project.majorName = '未指派主承辦';
            }
            return selected.length ? selected[0].name : '未指派主承辦';
        };

    }
})();