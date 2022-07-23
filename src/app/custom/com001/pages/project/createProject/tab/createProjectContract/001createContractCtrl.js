(function () {
    'use strict';

    // createDate: 2022/07/08

    angular.module('BlurAdmin.pages.001.Project')
    // .controller('createProjectCtrl', createProject);
        .controller('_001_createContractCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            '$compile',
            'toastr',
            'User',
            '$timeout',
            '_001_Project',
            '_001_Institute',
            '_001_ProjectContract',
            createContract
        ])

    /** @ngInject */
    function createContract($scope,
                              cookies,
                              window,
                              $filter,
                              $compile,
                              toastr,
                              User,
                              $timeout,
                              _001_Project,
                              _001_Institute,
                              _001_ProjectContract) {

        $scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        var vm = this;
        var nameList = [];
        var codeList = [];

        $scope.init = function() {

            vm.new = null;
            vm.contractCode = null;
            vm.contractName = null;

            // 機關
            _001_Institute.findAll()
                .success(function (resp) {
                    vm.instituteOptions = resp;
                })

            $scope.refreshData = function() {

                vm.new = null;
                vm.contractCode = null;
                vm.contractName = null;

                codeList, nameList = null;
                codeList, nameList = [];
                _001_ProjectContract.findAll()
                    .success(function (resp) {

                        $scope.contracts = resp;

                        $scope.contracts.forEach(function(item){
                            item.instituteName = $scope.getInstitute(item.instituteDID).name;
                            item.instituteCode = $scope.getInstitute(item.instituteDID).code;

                            console.log(item);
                            codeList.push(item.code);
                            nameList.push(item.name);
                        });

                        angular.element(
                            document.getElementById('includeHead_contract'))
                            .html($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'契約列表 - " + resp.length + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/custom/com001/pages/project/createProject/tab/createProjectContract/table/listProjectContractTable.html'\">" +
                                "</div>" +
                                "</div>"
                            )($scope));
                    })
            }

            $scope.refreshData();

            $scope.createContract = function () {

                if (vm.new == null) {
                    toastr.warning('請選擇機關', '注意');
                    return;
                }

                if(vm.contractCode == undefined ||
                    vm.contractCode == '' ||
                    vm.contractName == '' ||
                   vm.contractName == undefined) {
                    toastr.warning('欄位為空', '注意');
                    return;
                }

                if (codeList.includes(vm.contractCode)) {
                    toastr.warning('契約編碼已經存在', '注意');
                    return;
                }

                if (nameList.includes(vm.contractName)) {
                    toastr.warning('契約名稱已經存在', '注意');
                    return;
                }

                var formData = {
                    instituteDID: vm.new.institute._id,
                    name: vm.contractName,
                    code: vm.contractCode
                }

                _001_ProjectContract.createProjectContract(formData)
                    .success(function (resp) {
                        $scope.refreshData();
                    })
                    .error(function (err) {
                        toastr.error(err, 'API 錯誤, 請聯繫管理員');
                    })
            }

            var emptyInstitute = {
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
                    return emptyInstitute;
                }
                return selected[0];
            }
        }



    }
})();

