/**
 * @author Ichen.chu
 * created on 15.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProject')
        .controller('listProjectTableCtrl',
            [
                '$scope',
                '$filter',
                'User',
                'editableOptions',
                'editableThemes',
                'Project',
                function (scope,
                          filter,
                          User,
                          editableOptions,
                          editableThemes,
                          Project) {
                    return new ListProjectPageCtrl(
                        scope,
                        filter,
                        User,
                        editableOptions,
                        editableThemes,
                        Project);
                }])
    ;


    /** @ngInject */
    function ListProjectPageCtrl($scope,
                                 $filter,
                                 User,
                                 editableOptions,
                                 editableThemes,
                                 Project) {
        $scope.loading = true;


        User.getAllUsers()
            .success(function (allUsers) {
                console.log('rep - GET ALL User, SUCCESS');
                $scope.majorMemebers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.majorMemebers[i] = {
                        value: allUsers[i]._id,
                        name:  allUsers[i].name
                    };
                }
                console.log($scope.majorMemebers);
                Project.findAll()
                    .success(function(allProjects) {
                        console.log('rep - GET ALL Project, SUCCESS');
                        console.log(allProjects);
                        $scope.loading = false;
                        $scope.projects = allProjects
                    });
            });

        $scope.groups = [
            {id: 1, text: 'user'},
            {id: 2, text: 'customer'},
            {id: 3, text: 'vip'},
            {id: 4, text: 'admin'}
        ];

        $scope.showMajor = function (project) {
            var selected = [];
            if (project.majorID) {
                selected = $filter('filter')($scope.majorMemebers, {
                    value: project.majorID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        editableOptions.theme = 'bs3';
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

    }

})();
