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
                                _001_CaseTask) {

        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');

        var vm = this;

        $scope.init = function() {
            console.log("init...")
            // 機關
            _001_Institute.findAll()
                .success(function (resp) {
                    vm.instituteOptions = resp;
                })
        }

        var userData = {
            userDID: $scope.userDID,
        }
        _001_Project.findAllByMajorDID(userData)
            .success(function (prjUnits) {
                console.log(prjUnits);
                $scope.prjUnits = prjUnits;

                var prjUnitDIDs = [];
                $scope.prjUnits.forEach(function (prjUnit) {
                    if (!prjUnitDIDs.includes(prjUnit.caseDID)) {
                        prjUnitDIDs.push(prjUnit.caseDID);
                    }
                });

                var formData = {
                    contractDIDs: prjUnitDIDs,
                }

                _001_ProjectCase.findByCaseDIDMulti(formData)
                    .success(function (caseList) {
                        console.log(caseList);
                        $scope.allCaseForUser = caseList;
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
            });

        $scope.init();

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

    }
})();