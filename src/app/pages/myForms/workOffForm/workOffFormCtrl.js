/**
 * @author Ichen.chu
 * created on 14.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('workOffFormCtrl',
            [
                '$scope',
                '$cookies',
                'Project',
                'User',
                'editableOptions',
                'editableThemes',
                WorkOffFormCtrl
            ]);

    /** @ngInject */
    function WorkOffFormCtrl($scope,
                             cookies,
                             Project,
                             User,
                             editableOptions,
                             editableThemes) {

        editableOptions.theme = 'bs3';
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

        $scope.username = cookies.get('username');
        $scope.roleType = cookies.get('roletype');

        Project.findAll()
            .success(function (allProjects) {
                // console.log(allProjects);
                vm.projects = allProjects;
            });

        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
            });

        var vm = this;

        //  --------------------------  update holiday Data -----------------------
        $scope.updateUserHolidayData = function () {

        }

        $scope.holiday = {
            aaa: 1,
            bbb: 2,
        }

    }
})();


