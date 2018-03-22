/**
 * @author Ichen.Chu
 * created on 16.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProfile')
        .controller('userEditCtrl', [
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
    function UserEditCtrl($scope,
                          cookies,
                          $http,
                          fileReader,
                          $filter,
                          $uibModal,
                          toastr,
                          User,
                          UserEditUtil) {
        $scope.username = cookies.get('username');

        var formData = {
            userDID: cookies.get('userDID'),
        }

        User.findUserByUserDID(formData)
            .success(function (user) {
                $scope.password = user.password;
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
            console.log($scope.password);
            console.log($('[id="inputConfirmPassword"]')[0].value);
            if ($('[id="inputPassword"]')[0].value !== $('[id="inputConfirmPassword"]')[0].value) {
                toastr['warning']('請確認新密碼輸入是否相同', '儲存失敗');
                return;
            }
            if ($scope.password !== $('[id="inputConfirmPassword"]')[0].value) {
                toastr['warning']('新密碼與舊密碼相同', '注意');
                return;
            }

            var formData = {
                userDID: cookies.get('userDID'),
                password: $scope.password,
            }

            User.updatePassword(formData)
                .success(function () {
                    toastr['success']('成功', '變更密碼');
                })

        }
    }

})();
