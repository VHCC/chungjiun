/**
 * @author IChen.Chu
 * created on 2022/07/13
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.001.PersonalManage')
        .controller('_001_userInfoCtrl', [
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
            userInfoCtrl
        ]);

    /** @ngInject */
    function userInfoCtrl($compile,
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
        vm.loginUser = {};
        $scope.userDID = cookies.get('userDID');



        $scope.fetchAllUsers = function () {
            User.getAllUsersWithSignOut()
                .success(function (allUsers) {
                    vm.allUserWithSignOut = allUsers;
                    User.findUserByUserDID({
                        userDID: cookies.get('userDID'),
                    })
                        .success(function (user) {
                            console.log(user)
                            $scope.password = user.password;
                            vm.loginUser.username = user.name;
                            vm.loginUser.email = user.email;
                            // vm.loginUser.bossID = user.bossID;
                            // vm.loginUser.depType = user.depType;
                            // vm.loginUser.roleType = user.roleType;


                            vm.loginUser.userBoss = $scope.getBoss(user.bossID, vm.allUserWithSignOut);
                            vm.loginUser.userRole = $scope.getRole(user.roleType, vm.roleOptions)
                            vm.loginUser.userDep = $scope.getDep(user.depType, vm.departmentOptions)
                            console.log(vm);
                        })
                });
        }

        $scope.fetchAllUsers();

        var filename = $filter('userAvatar')(cookies.get('userDID'));
        $http.get(filename)
            .success(function (data, status) {
                $scope.picture = $filter('userAvatar')(cookies.get('userDID'));
            })
            .error(function (data, status) {
                $scope.picture = $filter('appImage')('theme/no-photo.png');
                $scope.noPicture = true;
            });

        $scope.removeAvatar = function () {
            $scope.picture = $filter('appImage')('theme/no-photo.png');
            $scope.noPicture = true;
            toastr['success']('成功', '移除照片');
        };

        $scope.selectAvatar = function () {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();
        };

        $scope.showModal = function (item) {
            $uibModal.open({
                animation: false,
                controller: 'ProfileModalCtrl',
                templateUrl: 'app/pages/profile/profileModal.html'
            }).result.then(function (link) {
                item.href = link;
            });
        };

        $scope.operateFile = function (file) {
            var uploadData = new FormData();
            uploadData.append('userDID', cookies.get('userDID'));
            uploadData.append('file', file);

            UserEditUtil.uploadAvatarImage(uploadData);

            fileReader.readAsDataUrl(file, $scope)
                .then(function (result) {
                    $scope.picture = result;
                    toastr['success']('成功', '照片上傳');
                });
        };

        // notification
        $scope.changePassword = function () {
            if ($('[id="inputPassword"]')[0].value !== $('[id="inputConfirmPassword"]')[0].value) {
                toastr['warning']('請確認新密碼輸入是否相同', '儲存失敗');
                return;
            }
            if ($scope.password === $('[id="inputConfirmPassword"]')[0].value) {
                toastr['warning']('新密碼與舊密碼相同', '注意');
                return;
            }

            var formData = {
                userDID: cookies.get('userDID'),
                userName: cookies.get('username'),
                password: $('[id="inputConfirmPassword"]')[0].value,
            }

            User.updatePassword(formData)
                .success(function () {
                    $scope.password = $('[id="inputConfirmPassword"]')[0].value
                    toastr['success']('成功', '變更密碼');
                })
        }

        // *****************
        // 總經理
        // 經理
        // 副理
        // 組長
        // 技師
        // 資深工程師
        // 高級工程師
        // 工程師
        // 助理工程師
        // 資深專員
        // 高級專員
        // 專員
        // 駐府人員
        // 工讀人員
        vm.roleOptions = [
            {name: "總經理", roleType: 1},
            {name: "經理", roleType: 2},
            {name: "副理", roleType: 3},
            {name: "組長", roleType: 4},
            {name: "技師", roleType: 5},
            {name: "資深工程師", roleType: 6},
            {name: "高級工程師", roleType: 7},
            {name: "助理工程師", roleType: 8},
            {name: "資深專員", roleType: 9},
            {name: "高級專員", roleType: 10},
            {name: "專員", roleType: 11},
            {name: "駐府人員", roleType: 12},
            {name: "工讀人員", roleType: 13},
        ];

        // 老闆
        // 主管部
        // 設計部
        // 監造部-分4群組
        // 專管部
        // 測量部
        // 管理部
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


        var emptyObject = {
            name: "Can not find",
            code: "Can not find",
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

    }

})();
