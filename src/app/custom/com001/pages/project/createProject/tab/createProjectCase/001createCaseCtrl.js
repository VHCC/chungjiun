(function () {
    'use strict';

    // createDate: 2022/07/08
    angular.module('BlurAdmin.pages.001.Project')
        .controller('_001_createCaseCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            '$compile',
            'editableOptions',
            'editableThemes',
            'toastr',
            'User',
            '$timeout',
            '_001_Project',
            '_001_Institute',
            '_001_ProjectCase',
            '_001_ProjectContract',
            createCase
        ])

    /** @ngInject */
    function createCase($scope,
                              cookies,
                              window,
                              $filter,
                              $compile,
                              editableOptions,
                              editableThemes,
                              toastr,
                              User,
                              $timeout,
                              _001_Project,
                              _001_Institute,
                              _001_ProjectCase,
                              _001_ProjectContract) {

        $scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        editableOptions.theme = 'bs3';

        editableThemes['bs3'].submitTpl = '<button type="submit" ng-click="updateMajor($form, $parent)" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


        var vm = this;
        var nameList = [];
        var codeList = [];

        $scope.init = function() {

            vm.new = null;
            vm.caseCode = null;
            vm.caseName = null;

            // 機關
            _001_Institute.findAll()
                .success(function (resp) {
                    vm.instituteOptions = resp;
                })

            // 契約 ALL
            _001_ProjectContract.findAll()
                .success(function (resp) {
                    vm.contractOptionsAll = resp;
                    $scope.refreshData();
                })

            $scope.refreshData = function() {

                vm.new = null;
                vm.caseCode = null;
                vm.caseName = null;

                codeList, nameList = null;
                codeList, nameList = [];
                _001_ProjectCase.findAll()
                    .success(function (resp) {

                        $scope.cases = resp;

                        $scope.cases.forEach(function(item){
                            item.instituteName = $scope.getInstitute(item.instituteDID).name;
                            item.instituteCode = $scope.getInstitute(item.instituteDID).code;

                            item.contractName = $scope.getProjectContract(item.contractDID).name;
                            item.contractCode = $scope.getProjectContract(item.contractDID).code;


                            console.log(item);
                            codeList.push(item.code);
                            nameList.push(item.name);
                        });

                        angular.element(
                            document.getElementById('includeHead_case'))
                            .html($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'工程列表 - " + resp.length + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/custom/com001/pages/project/createProject/tab/createProjectCase/table/listProjectCaseTable.html'\">" +
                                "</div>" +
                                "</div>"
                            )($scope));
                    })
            }



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

            $scope.submitProjectCase = function () {

                if (vm.new == null || vm.new.institute == null) {
                    toastr.warning('請選擇機關', '注意');
                    return;
                }

                if (vm.new.projectContract == null) {
                    toastr.warning('請選擇契約', '注意');
                    return;
                }

                if(vm.caseCode == undefined ||
                    vm.caseCode == '' ||
                    vm.caseName == '' ||
                   vm.caseName == undefined) {
                    toastr.warning('欄位為空', '注意');
                    return;
                }

                if (codeList.includes(vm.caseCode)) {
                    toastr.warning('工程編碼已經存在', '注意');
                    return;
                }

                if (nameList.includes(vm.caseName)) {
                    toastr.warning('工程名稱已經存在', '注意');
                    return;
                }

                var formData = {
                    instituteDID: vm.new.institute._id,
                    contractDID: vm.new.projectContract._id,
                    name: vm.caseName,
                    code: vm.caseCode
                }

                _001_ProjectCase.createProjectCase(formData)
                    .success(function (resp) {
                        console.log(resp);
                        $scope.refreshData();
                    })
                    .error(function (err) {
                        toastr.error(err, 'API 錯誤, 請聯繫管理員');
                    })
            }

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
        }



        // 更新工程編碼
        $scope.changeCaseCode = function (form, table) {
            try {
                var formData = {
                    _id: table.item._id,
                    code: form.$data.caseCode,
                }
                _001_ProjectCase.updateOneCaseInfo(formData)
                    .success(function (res) {
                        console.log(res.code);
                    })
                    .error(function () {

                    })
            } catch (err) {
                toastr['warning']('變更工程編碼 !', '更新失敗');
                return;
            }
        }

        // 更新工程名稱
        $scope.changeCaseName = function (form, table) {
            try {
                var formData = {
                    _id: table.item._id,
                    name: form.$data.caseName,
                }
                _001_ProjectCase.updateOneCaseInfo(formData)
                    .success(function (res) {
                        console.log(res.code);
                    })
                    .error(function () {

                    })
            } catch (err) {
                toastr['warning']('變更工程名稱 !', '更新失敗');
                return;
            }
        }

    }
})();

