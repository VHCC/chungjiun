/**
 * @author Ichen.Chu
 * created on 16.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProfile')
        .controller('userEditCtrl', [
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
            UserEditCtrl
        ]);

    /** @ngInject */
    function UserEditCtrl($compile,
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
        $scope.userDID = cookies.get('userDID');
        $scope.roleType = cookies.get('roletype');
        $scope.email = cookies.get('email');
        $scope.machineDID = cookies.get('machineDID');
        $scope.bossID = cookies.get('bossID');
        $scope.userMonthSalary = cookies.get('userMonthSalary');


        var formData = {
            userDID: cookies.get('userDID'),
        }

        User.findUserByUserDID(formData)
            .success(function (user) {
                $scope.password = user.password;
                $scope.userMonthSalary = user.userMonthSalary;
                $scope.cjMail = user.cjMail;
            })

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
            // console.log("old= " + $scope.password);
            // console.log("new= " + $('[id="inputConfirmPassword"]')[0].value);
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

        // ---------------------- 人事輸入 -----------------------
        var vm = this;


        $scope.fetchAllUsers = function () {
            console.log("fetchAllUsersfetchAllUsersfetchAllUsers")
            User.getAllUsersWithSignOutExecutive()
                .success(function (allUsers) {
                    vm.users = allUsers;

                });
        }

        // $scope.fetchAllUsers();

        User.getAllUsers()
            .success(function (managers) {
                // console.log(JSON.stringify(managers));
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

        $scope.updateUser = function () {
            if (vm.userRole === undefined) {
                toastr['warning']('請選擇員工角色', '人事資料更新');
                return;
            }

            var formData = {
                userDID: vm.user.selected._id,
                userName: $('#userNewName')[0].value,
                email: vm.email,
                cjMail: vm.cjMail,
                roleType: vm.userRole.roleType,
                userMonthSalary: $('#userMonthSalary')[0].value,
                bossID: vm.userBoss._id,
                machineDID: $('#userMachineDID')[0].value,
                workStatus: vm.workStatus,
                feature_official_doc: vm.feature_official_doc,
            }

            // console.log(formData);
            User.updateUserProfile(formData)
                .success(function (res) {
                    toastr['success'](vm.user.selected.name + '人員 資料更新成功', '人事資料變更');
                    $scope.fetchAllUsers();
                })
                .error(function (res) {
                    toastr['warning'](vm.user.selected.name + '人員 資料更新失敗', '人事資料變更');
                })
        }

        var options_ragular = [
            {
                name: "技師",
                roleType: 1
            },
            {
                name: "經理",
                roleType: 2
            },
            {
                name: "工程師",
                roleType: 3
            },
            {
                name: "行政",
                roleType: 4
            },
            {
                name: "工讀生",
                roleType: 5
            },
            {
                name: "主任",
                roleType: 6
            },
            {
                name: "專案管理",
                roleType: 7
            },
        ];

        vm.roleOptions = options_ragular;

        vm.roleOptions_executive = [
            {
                name: "行政總管",
                roleType: 100
            },
        ];

        $scope.selectUserProfile = function (user) {
            vm.userMonthSalary = user.userMonthSalary;
            vm.email = user.email;
            vm.cjMail = user.cjMail;
            vm.machineDID = user.machineDID;
            vm.residualRestHour = user.residualRestHour;
            vm.isSetResidualRestHour = user.isSetResidualRestHour;

            // user Role
            var selectedRole = [];
            if (user.roleType !== 100) {
                vm.roleOptions = options_ragular;
                selectedRole = $filter('filter')(vm.roleOptions, {
                    roleType: user.roleType,
                });
            } else if (user.roleType === 100) {
                console.log(vm.roleOptions_executive);
                vm.roleOptions = vm.roleOptions_executive;
                selectedRole = $filter('filter')(vm.roleOptions_executive, {
                    roleType: user.roleType,
                });
            }
            console.log(selectedRole[0]);
            vm.userRole = selectedRole[0];

            // user Boss
            var selectedBoss = [];
            if (user.bossID) {
                selectedBoss = $filter('filter')(vm.managersList, {
                    _id: user.bossID,
                });
            }
            vm.userBoss = selectedBoss.length ? selectedBoss[0] : undefined;

            vm.workStatus = user.workStatus;

            // 公文收發模組
            vm.feature_official_doc = user.feature_official_doc;

            $('.workOffFormNumberInput').mask('00.Z', {
                translation: {
                    'Z': {
                        pattern: /[05]/,
                    }
                }
            });

        }

        $scope.showUserStatus = function (user) {

            var isSalary = user.userMonthSalary === 0 ? " (未設定薪水)" : ""
            var isBoss = user.bossID ? "" : " (未設定主管)"
            var isCJMail = user.cjMail ? "" : " (未設定崇峻信箱)"

            var workStatus = user.workStatus ? "" : " **無法登入**"
            var feature_official_doc = user.feature_official_doc ? " (公文收發人員)" : ""

            var userInfo = isSalary + isBoss + isCJMail + feature_official_doc + workStatus;

            return user.name + userInfo;
        }

        $scope.setUserResidualRestHour = function () {
            var formData = {
                userDID: vm.user.selected._id,
                residualRestHour: vm.residualRestHour,
                isSetResidualRestHour: true,
            }

            User.setUserResidualRestHour(formData)
                .success(function (res) {
                    toastr['success'](vm.user.selected.name + '人員 補休設定完成', '人事資料變更');
                    vm.isSetResidualRestHour = true;
                    $scope.fetchAllUsers();
                })
        }


        // 個人檔案
        // user Role
        var userRole = [];
        console.log($scope.roleType);
        if ($scope.roleType != 100) {
            $scope.roleOptions = options_ragular;
            userRole = $filter('filter')(vm.roleOptions, {
                roleType: $scope.roleType,
            });
        } else if ($scope.roleType == 100) {
            $scope.roleOptions = vm.roleOptions_executive;
            userRole = $filter('filter')(vm.roleOptions_executive, {
                roleType: $scope.roleType,
            });
        }
        $scope.userRole = userRole[0].name;

        $scope.sendTestMail = function () {

            if (!vm.cjMail) {
                toastr['error']('測試信發信錯誤', '尚未設定崇峻信箱');
                return;
            }

            var formData = {
                name: $('#userNewName')[0].value,
                cjMail: vm.cjMail
            }

            UserEditUtil.sendTestMail(formData)
                .success(function (resp) {
                    console.log(resp);
                    if (resp.code == 200) {
                        toastr['success']('測試信，發信成功');
                    } else {
                        toastr['error']('測試信發信錯誤', resp.response);
                    }
                })
        }

    }

})();
