(function () {
    'use strict';

    // createDate: 2022/07/13
    angular.module('BlurAdmin.pages.001.PersonalManage')
    // .controller('createProjectCtrl', createProject);
        .controller('_001_editCaseInfoCtrl', [
            '$scope',
            '$cookies',
            '$window',
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
            editCaseInfo
        ])

    /** @ngInject */
    function editCaseInfo($scope,
                              cookies,
                              window,
                              $filter,
                              $compile,
                              toastr,
                              User,
                              $timeout,
                              bsLoadingOverlayService,
                              _001_Institute,
                              _001_ProjectContract,
                              _001_ProjectCase,
                              _001_Project) {

        $scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        var loadingReferenceId = 'mainPage_001caseInfo'

        var vm = this;

        $scope.init = function() {
            // 機關
            _001_Institute.findAll()
                .success(function (resp) {
                    vm.instituteOptions = resp;
                })
        }

        $scope.changeInstitute = function(institute) {

            vm.filter.projectContract = null;
            vm.filter.projectCase = null;
            vm.filter.projectType = null;

            prjTypeOptionsCanSelect = [];
            prjTypeOptionsList = [];

            // 契約
            _001_ProjectContract.findByInstituteDID({
                instituteDID: institute._id
            })
            .success(function (resp) {
                vm.contractOptions = resp;
            })
        }

        $scope.changeContract = function(projectContract, institute) {
            vm.filter.projectCase = null;
            vm.filter.projectType = null;

            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: loadingReferenceId
                });
            }, 100)

            vm.filter.projectCase = null;
            // 工程
            _001_ProjectCase.findByContractDIDAndInstituteDID({
                contractDID: projectContract._id,
                instituteDID: institute._id
            })
            .success(function (resp) {
                vm.caseOptions = resp;
                vm.caseOptionsAll = resp;

                _001_Project.findAllCaseWithOneContract({
                    contractDID: projectContract._id
                })
                .success(function (resp) {
                    $scope.showTable(resp);
                })
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

        $scope.changeCase = function(projectCase) {

            vm.filter.projectType = null;

            _001_Project.findOneCaseWithAllType({
                caseDID: projectCase._id
            })
            .success(function (resp) {
                $scope.showTable(resp);
            })
        }

        $scope.changeType = function(vm) {
            if (vm.filter.projectCase == null) {
                _001_Project.findAllByOneContractWithOneType({
                    contractDID: vm.filter.projectContract._id,
                    type: vm.filter.projectType.value
                })
                .success(function (resp) {
                    $scope.showTable(resp, true);
                })
            } else {
                _001_Project.findOneCaseWithOneType({
                    caseDID: vm.filter.projectCase._id,
                    type: vm.filter.projectType.value
                })
                .success(function (resp) {
                    $scope.showTable(resp, true);
                })
            }
        }


        $scope.init();

        $scope.showTable = function (caseData, notFreshType) {
            if (!notFreshType) {
                prjTypeOptionsCanSelect = [];
                prjTypeOptionsList = [];
            }
            caseData.forEach(function (projectCase) {
                $scope.checkProjectType(projectCase.type);
                projectCase.caseName = $scope.getProjectCase(projectCase.caseDID).name;
                projectCase.caseCode = $scope.getProjectCase(projectCase.caseDID).code;

                projectCase.typeName = $scope.getProjectType(projectCase.type).label;
            })

            vm.prjTypeOptionsAll = prjTypeOptionsCanSelect;
            $scope.tableData = caseData;
            angular.element(
                document.getElementById('includeHead_editCaseInfo'))
                .html($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'專案列表 - " + caseData.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/custom/com001/pages/personalManage/caseInfo/tab/editCaseInfo/table/editCaseInfoTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));
        }

        $scope.showCaseInformation = function (projectCase) {
            console.log(projectCase);
        }

        // ****** options *******
        var prjTypeOptionsCanSelect = [];
        var prjTypeOptionsList = [];

        $scope.checkProjectType = function (type) {
            if (!prjTypeOptionsList.includes(type)) {
                switch (type) {
                    case '1':
                        prjTypeOptionsCanSelect.push(
                            {label: '設計', value: '1'}
                        );
                        break;
                    case '2':
                        prjTypeOptionsCanSelect.push(
                            {label: '監造', value: '2'}
                        );
                        break;
                    case '3':
                        prjTypeOptionsCanSelect.push(
                            {label: '規劃', value: '3'}
                        );
                        break;
                    case '4':
                        prjTypeOptionsCanSelect.push(
                            {label: '專管', value: '4'}
                        );
                        break;
                    case '5':
                        prjTypeOptionsCanSelect.push(
                            {label: '管理', value: '5'}
                        );
                        break;
                    case '6':
                        prjTypeOptionsCanSelect.push(
                            {label: '投標', value: '6'}
                        );
                        break;
                    case '7':
                        prjTypeOptionsCanSelect.push(
                            {label: '其他', value: '7'}
                        );
                        break;
                }
                prjTypeOptionsList.push(type);
            }
        }

        var prjTypeOptionsAll = [
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

        var emptyObject = {
            name: "Can not find",
            code: "Can not find",
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
                selected = $filter('filter')(prjTypeOptionsAll, {
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

