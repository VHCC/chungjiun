(function () {
    'use strict';

    // createDate: 2022/07/08

    angular.module('BlurAdmin.pages.001.Project')
    // .controller('createProjectCtrl', createProject);
        .controller('_001_createInstituteCtrl', [
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
            createInstitute
        ])

    /** @ngInject */
    function createInstitute($scope,
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
                              _001_Institute) {

        $scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        editableOptions.theme = 'bs3';

        editableThemes['bs3'].submitTpl = '<button type="submit" ng-click="updateMajor($form, $parent)" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


        var vm = this;
        var nameList = [];
        var codeList = [];

        $scope.init = function() {

            $scope.refreshData = function() {

                vm.instituteCode = null;
                vm.instituteName = null;

                codeList, nameList = null;
                codeList, nameList = [];
                _001_Institute.findAll()
                    .success(function (resp) {
                        resp.forEach(function(item){
                            console.log(item);
                            codeList.push(item.code);
                            nameList.push(item.name);
                        });
                        console.log(resp);
                        console.log($scope);
                        console.log(vm);

                        $scope.institutes = resp;

                        angular.element(
                            document.getElementById('includeHead'))
                            .html($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'機關列表 - " + resp.length + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/custom/com001/pages/project/createProject/tab/createInstitute/table/listInstituteTable.html'\">" +
                                "</div>" +
                                "</div>"
                            )($scope));
                    })
            }

            $scope.refreshData();

            $scope.createInstitute = function () {
                if(vm.instituteCode == undefined ||
                    vm.instituteCode == '' ||
                    vm.instituteName == '' ||
                   vm.instituteName == undefined) {
                    toastr.warning('欄位為空', '注意');
                    return;
                }

                if (vm.instituteCode.length != 10) {
                    toastr.warning('機關代碼需為10碼', '注意');
                    return;
                }

                if (codeList.includes(vm.instituteCode)) {
                    toastr.warning('機關代碼已經存在', '注意');
                    return;
                }

                if (nameList.includes(vm.instituteName)) {
                    toastr.warning('機關名稱已經存在', '注意');
                    return;
                }

                var formData = {
                    name: vm.instituteName,
                    code: vm.instituteCode
                }

                _001_Institute.createInstitute(formData)
                    .success(function (resp) {
                        console.log(resp);
                        $scope.refreshData();
                    })
                    .error(function (err) {
                        toastr.error(err, 'API 錯誤, 請聯繫管理員');
                    })
            }
        }


        // 更新機關代碼
        $scope.changeInstituteCode = function (form, table) {
            try {
                var formData = {
                    _id: table.item._id,
                    code: form.$data.instituteCode,
                }
                _001_Institute.updateOneInstituteInfo(formData)
                    .success(function (res) {
                        console.log(res.code);
                    })
                    .error(function () {

                    })
            } catch (err) {
                toastr['warning']('變更機關代碼 !', '更新失敗');
                return;
            }
        }


        // 更新機關名稱
        $scope.changeInstituteName = function (form, table) {
            try {
                var formData = {
                    _id: table.item._id,
                    name: form.$data.instituteName,
                }
                _001_Institute.updateOneInstituteInfo(formData)
                    .success(function (res) {
                        console.log(res.code);
                    })
                    .error(function () {

                    })
            } catch (err) {
                toastr['warning']('變更機關名稱 !', '更新失敗');
                return;
            }
        }


    }
})();

