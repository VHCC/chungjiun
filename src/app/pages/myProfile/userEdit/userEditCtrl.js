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
                          UserEditUtil) {
        var filename = $filter('userAvatar')(cookies.get('userDID'));
        $http.get(filename)
            .success(function(data, status){
                $scope.picture = $filter('userAvatar')(cookies.get('userDID'));
            })
            .error(function(data,status){
                $scope.picture = $filter('appImage')('theme/no-photo.png');
                $scope.noPicture = true;
            });

        $scope.removeAvatar = function () {
            $scope.picture = $filter('appImage')('theme/no-photo.png');
            $scope.noPicture = true;
        };

        $scope.selectAvatar = function () {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();
        };

        $scope.socialProfiles = [
            {
                name: 'Facebook',
                href: 'https://www.facebook.com/akveo/',
                icon: 'socicon-facebook'
            },
            {
                name: 'Twitter',
                href: 'https://twitter.com/akveo_inc',
                icon: 'socicon-twitter'
            },
            {
                name: 'Google',
                icon: 'socicon-google'
            },
            {
                name: 'LinkedIn',
                href: 'https://www.linkedin.com/company/akveo',
                icon: 'socicon-linkedin'
            },
            {
                name: 'GitHub',
                href: 'https://github.com/akveo',
                icon: 'socicon-github'
            },
            {
                name: 'StackOverflow',
                icon: 'socicon-stackoverflow'
            },
            {
                name: 'Dribbble',
                icon: 'socicon-dribble'
            },
            {
                name: 'Behance',
                icon: 'socicon-behace'
            }
        ];

        $scope.unconnect = function (item) {
            item.href = undefined;
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
                });
        };

        $scope.switches = [true, true, false, true, true, false];
    }

})();
