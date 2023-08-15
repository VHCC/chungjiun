(function () {
    'use strict';

    // createDate: 2022/07/08

    angular.module('BlurAdmin.pages.001.Project')
    // .controller('createProjectCtrl', createProject);
        .controller('_001_createProjectCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            'toastr',
            'User',
            '$timeout',
            'bsLoadingOverlayService',
            '_001_Institute',
            '_001_ProjectContract',
            '_001_ProjectCase',
            '_001_Project',
            createProject
        ])

    /** @ngInject */
    function createProject($scope,
                              cookies,
                              window,
                              $filter,
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

        var loadingReferenceId = 'mainPage_001createProject'

        $scope.formData = {};
        $scope.mainProject = {};

        var vm = this;

        // 分支主題
        vm.branchOption = [
            {label: 'P-投標', value: 'P'},
            {label: 'C-得標', value: 'C'},
            {label: 'M-管理', value: 'M'},
        ];

        // 機關
        _001_Institute.findAll()
            .success(function (resp) {
                vm.instituteOptions = resp;
            })


        // ****** options *******
        var prjTypeOptionsCanSelect = [];
        var prjTypeOptionsList = [];

        $scope.checkProjectType = function (type, prjTypeOptionsAll) {

            var index = prjTypeOptionsAll.findIndex((obj => obj.value == type));
            if (prjTypeOptionsAll[index].label.length != 2) return;
            prjTypeOptionsAll[index].label = prjTypeOptionsAll[index].label + "(已存在)";

            // if (!prjTypeOptionsList.includes(type)) {
            //     switch (type) {
            //         case '1':
            //             prjTypeOptionsCanSelect.push(
            //                 {label: '設計', value: '1'}
            //             );
            //             break;
            //         case '2':
            //             prjTypeOptionsCanSelect.push(
            //                 {label: '監造', value: '2'}
            //             );
            //             break;
            //         case '3':
            //             prjTypeOptionsCanSelect.push(
            //                 {label: '規劃', value: '3'}
            //             );
            //             break;
            //         case '4':
            //             prjTypeOptionsCanSelect.push(
            //                 {label: '專管', value: '4'}
            //             );
            //             break;
            //         case '5':
            //             prjTypeOptionsCanSelect.push(
            //                 {label: '管理', value: '5'}
            //             );
            //             break;
            //         case '6':
            //             prjTypeOptionsCanSelect.push(
            //                 {label: '投標', value: '6'}
            //             );
            //             break;
            //         case '7':
            //             prjTypeOptionsCanSelect.push(
            //                 {label: '其他', value: '7'}
            //             );
            //             break;
            //     }
            //     prjTypeOptionsList.push(type)
            // }
        }

        // vm.prjTypeOptions = [
        //     // 2022/07/09
        //     // 1-設計；2-監造；3-規劃；4-專管；5-管理；6-投標；7-其他
        //     // 1.設計
        //     // 2.監造
        //     // 3.規劃
        //     // 4.專管
        //     // 5.管理
        //     // 6.投標
        //     // 7.其他
        //     {label: '設計-1', value: '1'},
        //     {label: '監造-2', value: '2'},
        //     {label: '規劃-3', value: '3'},
        //     {label: '專管-4', value: '4'},
        //     {label: '管理-5', value: '5'},
        //     {label: '投標-6', value: '6'},
        //     {label: '其他-7', value: '7'},
        // ];

        $scope.changeInstitute = function(institute) {
            vm.new.projectContract = null;
            // 契約
            _001_ProjectContract.findByInstituteDID({
                instituteDID: institute._id
            })
                .success(function (resp) {
                    vm.contractOptions = resp;
                })
        }

        $scope.changeContract = function(projectContract, institute) {
            vm.new.projectCase = null;
            // 工程
            _001_ProjectCase.findByContractDIDAndInstituteDID({
                contractDID: projectContract._id,
                instituteDID: institute._id
            })
            .success(function (resp) {
                vm.caseOptions = resp;
            })
        }

        $scope.changeCase = function(projectCase) {
            _001_Project.findOneCaseWithAllType({
                caseDID: projectCase._id
            })
            .success(function (resp) {
                prjTypeOptionsCanSelect = [];
                prjTypeOptionsList = [];

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

                resp.forEach(function (projectCase) {
                    $scope.checkProjectType(projectCase.type, prjTypeOptionsAll);
                })
                vm.prjTypeOptions = prjTypeOptionsAll;
            })
        }

        $scope.findRoleType = function(roleType, callBack) {

            console.log(roleType);
            var formData = {
                roleType: roleType
            }
            User.findByRoleType(formData)
                .success(function (result) {
                    callBack(result);
                })
        }

        $scope.init = function() {
            $scope.findRoleType(5, function (resp) {
                // console.log(resp);
                vm.techsItems = resp;
            })
        }

        $scope.init();

        // *****************
        // 總經理-1
        // 經理-2
        // 副理-3
        // 組長-4
        // 技師-5
        // 資深工程師-6
        // 高級工程師-7
        // 工程師-8
        // 助理工程師-9
        // 資深專員-10
        // 高級專員-11
        // 專員-12
        // 駐府人員-13
        // 工讀人員-14

        User.getAllUsers()
            .success(function (managers) {
                vm.managers = managers;
            })

        User.getAllUsers()
            .success(function (allUsers) {
                $scope.users = allUsers;
            });

        // ----------------- CREATE ---------------
        $scope.submitProject = function () {

            if (vm.new.projectType.label.length != 2) {
                toastr.error('該類型已存在', '錯誤');
                return;
            }

            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: loadingReferenceId
                });
            }, 100);

            var code = vm.new.branch.value +
                vm.new.institute.code +
                vm.new.projectContract.code +
                vm.new.projectCase.code +
                vm.new.projectType.value;

            var prjTechs = [];
            for (var index = 0; index < vm.new.projectTechs.length; index++) {
                prjTechs[index] = vm.new.projectTechs[index]._id;
            }

            _001_Project.createProject({
                branch: vm.new.branch.value,
                instituteDID: vm.new.institute._id,
                contractDID: vm.new.projectContract._id,
                caseDID: vm.new.projectCase._id,
                type: vm.new.projectType.value,
                managerID: vm.new.projectManagers._id,
                code: code,
                technician: prjTechs,
            })
            .success(function (res) {
                vm.new = null;
                console.log(res);
                $timeout(function () {
                    bsLoadingOverlayService.stop({
                        referenceId: loadingReferenceId
                    });
                    toastr.info('建立 '  + code, '成功');
                }, 1000)
            })
            .error(function (err) {
                toastr.error(err, 'API 錯誤, 請聯繫管理員');
                $timeout(function () {
                    bsLoadingOverlayService.stop({
                        referenceId: loadingReferenceId
                    });
                }, 500)
            })
        }

    }
})();

