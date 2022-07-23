(function () {
    'use strict';

    // createDate: 2022/07/13
    angular.module('BlurAdmin.pages.001.Project')
    // .controller('createProjectCtrl', createProject);
        .controller('_001_listContractCtrl', [
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
            listContract
        ])

    /** @ngInject */
    function listContract($scope,
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

        var loadingReferenceId = 'mainPage_001listContract'

        var vm = this;

        // 機關
        _001_Institute.findAll()
            .success(function (resp) {
                vm.instituteOptions = resp;
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
            {label: '設計-1', value: '1'},
            {label: '監造-2', value: '2'},
            {label: '規劃-3', value: '3'},
            {label: '專管-4', value: '4'},
            {label: '管理-5', value: '5'},
            {label: '投標-6', value: '6'},
            {label: '其他-7', value: '7'},
        ];

        $scope.changeInstitute = function(institute) {
            vm.filter.projectContract = null;
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
            // 工程
            _001_ProjectCase.findByContractDIDAndInstituteDID({
                contractDID: projectContract._id,
                instituteDID: institute._id
            })
                .success(function (resp) {
                    vm.caseOptions = resp;
                })
        }

    }
})();

