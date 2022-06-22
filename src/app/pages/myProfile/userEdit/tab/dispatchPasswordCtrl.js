/**
 * @author IChen.Chu
 * created on 08.04.2022
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProfile')
        .controller('dispatchPasswordCtrl', [
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
            DispatchPasswordCtrl
        ]);

    /** @ngInject */
    function DispatchPasswordCtrl($compile,
                          $scope,
                          cookies,
                          $http,
                          fileReader,
                          $filter,
                          $uibModal,
                          toastr,
                          User,
                          UserEditUtil) {

        $scope.username = cookies.get('username');
        $scope.roleType = cookies.get('roletype');

        // notification
        $scope.dispatchPassword = function (scope) {
            console.log(vm.user.selected)
            if (scope.oldPWD !== scope.newPWD) {
                toastr['warning']('請確認新密碼輸入是否相同', '儲存失敗');
                return;
            }
            if ($scope.password === scope.newPWD) {
                toastr['warning']('新密碼與舊密碼相同', '注意');
                return;
            }

            var formData = {
                userDID: vm.user.selected._id,
                userName: cookies.get('username'),
                password: scope.newPWD,
            }

            User.updatePassword(formData)
                .success(function () {
                    toastr['success']('成功', '變更' + vm.user.selected.name + '密碼');
                })
        }

        // ---------------------- 人事輸入 -----------------------
        var vm = this;

        $scope.fetchAllUsers = function () {
            User.getAllUsersWithSignOut()
                .success(function (allUsers) {
                    vm.users = allUsers;
                });
        }

        $scope.fetchAllUsers();

        User.getAllUsers()
            .success(function (managers) {
                vm.managersList = managers;

                // user Boss
                var userBoss = [];
                if ($scope.bossID) {
                    userBoss = $filter('filter')(vm.managersList, {
                        _id: $scope.bossID,
                    });
                }
                $scope.userBoss = userBoss[0].name;
            })

        $scope.selectUserProfile = function (user) {
            vm.userMonthSalary = user.userMonthSalary;
            vm.email = user.email;
            vm.cjMail = user.cjMail;
            vm.machineDID = user.machineDID;
            vm.residualRestHour = user.residualRestHour;
            vm.isSetResidualRestHour = user.isSetResidualRestHour;

            // user Boss
            var selectedBoss = [];
            if (user.bossID) {
                selectedBoss = $filter('filter')(vm.managersList, {
                    _id: user.bossID,
                });
            }
            vm.userBoss = selectedBoss.length ? selectedBoss[0] : undefined;

            vm.workStatus = user.workStatus;

            var formData = {
                userDID: vm.user.selected._id,
            }

            User.findUserByUserDID(formData)
                .success(function (user) {
                    $scope.password = user.password;
                    $scope.userMonthSalary = user.userMonthSalary;
                    $scope.cjMail = user.cjMail;
                })

        }

        $scope.showUserStatus = function (user) {

            var isSalary = user.userMonthSalary === 0 ? " (未設定薪水)" : ""
            var isBoss = user.bossID ? "" : " (未設定主管)"
            var isCJMail = user.cjMail ? "" : ""

            var workStatus = user.workStatus ? "" : " **無法登入**"
            var feature_official_doc = user.feature_official_doc ? " (公文收發人員)" : ""

            var userInfo = isSalary + isBoss + isCJMail + feature_official_doc + workStatus;

            return user.name + userInfo;
        }


    }

})();
