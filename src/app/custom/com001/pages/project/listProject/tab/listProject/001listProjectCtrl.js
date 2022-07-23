(function () {
    'use strict';

    // createDate: 2022/07/08

    angular.module('BlurAdmin.pages.001.Project')
    // .controller('createProjectCtrl', createProject);
        .controller('_001_listProjectCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            '$compile',
            'toastr',
            'User',
            '$timeout',
            'bsLoadingOverlayService',
            '_001_Project',
            '_001_Institute',
            '_001_ProjectCase',
            '_001_ProjectContract',
            listProject
        ])

    /** @ngInject */
    function listProject($scope,
                              cookies,
                              window,
                              $filter,
                              $compile,
                              toastr,
                              User,
                              $timeout,
                              bsLoadingOverlayService,
                              _001_Project,
                              _001_Institute,
                              _001_ProjectCase,
                              _001_ProjectContract) {

        $scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        var loadingReferenceId = 'mainPage_001listProject'

        var vm = this;

        // 機關
        _001_Institute.findAll()
            .success(function (resp) {
                vm.instituteOptions = resp;
            })

        // 契約 ALL
        _001_ProjectContract.findAll()
            .success(function (resp) {
                vm.contractOptionsAll = resp;
            })

        // 工程 All
        _001_ProjectCase.findAll()
            .success(function (resp) {
                vm.caseOptionsAll = resp;
            })

        vm.prjTypeOptions = [
            // 2022/07/09
            // 1-設計；2-監造；3-規劃；4-專管；5-管理；6-投標；7-其他
            // 1.設計
            // 2.監造
            // 3.規劃
            // 4.專管
            // 5.管理
            // 6.投標
            // 7.其他
            {label: '設計', value: '1'},
            {label: '監造', value: '2'},
            {label: '規劃', value: '3'},
            {label: '專管', value: '4'},
            {label: '管理', value: '5'},
            {label: '投標', value: '6'},
            {label: '其他', value: '7'},
        ];

        $scope.refreshData = function() {

            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: loadingReferenceId
                });
            }, 100)

            _001_Project.findAll()
                .success(function (resp) {

                    $scope.projects = resp;

                    $scope.projects.forEach(function (project) {

                        project.instituteName = $scope.getInstitute(project.instituteDID).name;
                        project.instituteCode = $scope.getInstitute(project.instituteDID).code;

                        project.contractName = $scope.getProjectContract(project.contractDID).name;
                        project.contractCode = $scope.getProjectContract(project.contractDID).code;

                        project.caseName = $scope.getProjectCase(project.caseDID).name;
                        project.caseCode = $scope.getProjectCase(project.caseDID).code;

                        project.typeName = $scope.getProjectType(project.type).label;

                        console.log(project);
                    })

                    angular.element(
                        document.getElementById('includeHead_listProject'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'專案列表 - " + resp.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/custom/com001/pages/project/listProject/tab/listProject/table/listProjectTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: loadingReferenceId
                        });
                    }, 500)
                })
                .error(function (err) {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: loadingReferenceId
                        });
                    }, 500)
                })
        }

        $timeout(function () {
            $scope.refreshData();
        }, 100)




        var emptyObject = {
            name: "Can not find",
            code: "Can not find",
        }

        $scope.getInstitute = function (did) {
            var selected = [];
            if (did) {
                selected = $filter('filter')(vm.instituteOptions, {
                    _id: did,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.getProjectContract = function (did) {
            var selected = [];
            if (did) {
                selected = $filter('filter')(vm.contractOptionsAll, {
                    _id: did,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.getProjectCase = function (did) {
            var selected = [];
            if (did) {
                selected = $filter('filter')(vm.caseOptionsAll, {
                    _id: did,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.getProjectType = function (type) {
            var selected = [];
            if (type) {
                selected = $filter('filter')(vm.prjTypeOptions, {
                    value: type,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }



    }
})();

