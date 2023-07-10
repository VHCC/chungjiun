/**
 * @author IChen.Chu
 * created on 2022/07/13
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.001.PersonalManage')
        .controller('_001_userEditCtrl', [
            '$compile',
            '$scope',
            '$cookies',
            '$http',
            'fileReader',
            '$filter',
            '$uibModal',
            'toastr',
            'User',
            'UserEditUtil',
            userEditCtrl
        ]);

    /** @ngInject */
    function userEditCtrl($compile,
                          $scope,
                          cookies,
                          $http,
                          fileReader,
                          $filter,
                          $uibModal,
                          toastr,
                          User,
                          UserEditUtil) {
        var vm = this;

        // ---------------------- 人事輸入 -----------------------

        $scope.fetchAllUsers = function () {
            vm.edit = null;
            User.getAllUsersWithSignOut()
                .success(function (allUsers) {
                    vm.managersList = allUsers;
                    vm.allUserWithSignOut = allUsers;
                });
        }

        $scope.fetchAllUsers();

        var emptyObject = {
            name: "尚未設定",
            code: "尚未設定",
        }

        $scope.getBoss = function (did, options) {
            var selected = [];
            if (did) {
                selected = $filter('filter')(options, {
                    _id: did,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.getRole = function (target, options) {
            var selected = [];
            if (target) {
                selected = $filter('filter')(options, {
                    roleType: target,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.getDep = function (target, options) {
            var selected = [];
            if (target) {
                selected = $filter('filter')(options, {
                    depType: target,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

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
        vm.roleOptions = [
            {name: "總經理", roleType: 1},
            {name: "經理", roleType: 2},
            {name: "副理", roleType: 3},
            {name: "組長", roleType: 4},
            {name: "技師", roleType: 5},
            {name: "資深工程師", roleType: 6},
            {name: "高級工程師", roleType: 7},
            {name: "工程師", roleType: 8},
            {name: "助理工程師", roleType: 9},
            {name: "資深專員", roleType: 10},
            {name: "高級專員", roleType: 11},
            {name: "專員", roleType: 12},
            {name: "駐府人員", roleType: 13},
            {name: "工讀人員", roleType: 14},
        ];

        // 老闆-A
        // 主管部-B
        // 設計部-C
        // 監造部-分4群組-D
        // 專管部-E
        // 測量部-F
        // 管理部-G
        vm.departmentOptions = [
            {name: "老闆", depType: 'A'},
            {name: "主管部", depType: 'B'},
            {name: "設計部", depType: 'C'},
            {name: "監造部-1", depType: 'D1'},
            {name: "監造部-2", depType: 'D2'},
            {name: "監造部-3", depType: 'D3'},
            {name: "監造部-4", depType: 'D4'},
            {name: "專管部", depType: 'E'},
            {name: "測量部", depType: 'F'},
            {name: "管理部", depType: 'G'},
        ];

        $scope.userSelected = function (user) {
            console.log(vm);
            console.log(user);

            vm.edit.user.userBoss = $scope.getBoss(user.bossID, vm.managersList);
            vm.edit.user.userRole = $scope.getRole(user.roleType, vm.roleOptions)
            vm.edit.user.userDep = $scope.getDep(user.depType, vm.departmentOptions)
        }

        $scope.updateUser = function () {
            if (vm.edit.user.userRole === undefined) {
                toastr['warning']('請選擇員工職務', '人事資料更新');
                return;
            }

            var formData = {
                userDID: vm.edit.user._id,
                // userName: $('#userNewName')[0].value,
                userName: vm.edit.user.name,
                email: vm.edit.user.email,
                roleType: vm.edit.user.userRole.roleType,
                // userMonthSalary: $('#userMonthSalary')[0].value,
                bossID: vm.edit.user.userBoss._id,
                // machineDID: $('#userMachineDID')[0].value,
                workStatus: vm.edit.user.workStatus,
                depType: vm.edit.user.userDep.depType,
                // feature_official_doc: vm.feature_official_doc,
                updateTs: moment(new Date()).format("YYYYMMDD_HHmmss"),
            }

            User.updateUserProfile(formData)
                .success(function (res) {
                    toastr['success'](vm.edit.user.name + '人員 資料更新成功', '人事資料變更');
                    $scope.fetchAllUsers();
                })
                .error(function (res) {
                    toastr['warning'](vm.edit.user.name + '人員 資料更新失敗', '人事資料變更');
                })
        }


        $scope.showUserStatus = function (user) {
            // var isSalary = user.userMonthSalary === 0 ? " (未設定薪水)" : ""
            var isBoss = user.bossID ? "" : " (未設定直屬)"
            var isDep = user.depType ? "" : " (未設定部門)"
            // var isCJMail = user.cjMail ? "" : ""

            var workStatus = user.workStatus ? "" : " **無法登入**"
            // var feature_official_doc = user.feature_official_doc ? " (公文收發人員)" : ""

            // var userInfo = isSalary + isBoss + isCJMail + feature_official_doc + workStatus;
            var userStatus = isBoss + isDep + workStatus;

            return user.name + userStatus;
        }

    }

})();
