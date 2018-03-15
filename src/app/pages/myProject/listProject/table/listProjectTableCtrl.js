/**
 * @author Ichen.chu
 * created on 15.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProject')
        .service('intiProjectsService', function ($http, $cookies) {
            var promise = $http.get('/api/projectFindAll')
                .success(function (allProjects) {
                    return allProjects;
                });
            return promise;
        })
        .controller('listProjectTableCtrl',
            [
                '$scope',
                '$filter',
                'User',
                '$compile',
                'editableOptions',
                'editableThemes',
                'Project',
                'ProjectUtil',
                'intiProjectsService',
                function (scope,
                          filter,
                          User,
                          $compile,
                          editableOptions,
                          editableThemes,
                          Project,
                          ProjectUtil,
                          intiProjectsService) {
                    return new ListProjectPageCtrl(
                        scope,
                        filter,
                        User,
                        $compile,
                        editableOptions,
                        editableThemes,
                        Project,
                        ProjectUtil,
                        intiProjectsService
                    );
                }])
    ;

    /** @ngInject */
    function ListProjectPageCtrl($scope,
                                 $filter,
                                 User,
                                 $compile,
                                 editableOptions,
                                 editableThemes,
                                 Project,
                                 ProjectUtil,
                                 intiProjectsService ) {
        $scope.loading = true;

        intiProjectsService.then(function (resp) {
            console.log(resp.data);
            $scope.projects = resp.data;
            $scope.projects.slice(0, resp.data.length);

            angular.element(
                document.getElementById('includeHead'))
                .append($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'專案列表'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/pages/myProject/listProject/table/listProjectTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));
        })

        User.findManagers()
            .success(function (allUsers) {
                console.log('rep - GET ALL User, SUCCESS');
                $scope.projectManagers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allUsers[i]._id,
                        name: allUsers[i].name
                    };
                }
                // Project.findAll()
                //     .success(function (allProjects) {
                //         console.log('rep - GET ALL Project, SUCCESS');
                //         console.log(allProjects);
                //         $scope.loading = false;
                //         $scope.projects = allProjects
                //
                //         $scope.editableTableData = $scope.smartTableData.slice(0, 36);
                //
                //         $scope.qq = $scope.projects.slice(0, 2);
                //
                //     });
            });

        $scope.showMajor = function (project) {
            var selected = [];
            if (project.majorID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: project.majorID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        editableOptions.theme = 'bs3';

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        $scope.showTechs = function (techs) {
            var resault = "";
            for (var index = 0; index < techs.length; index ++) {
                resault += techs[index].name + " ";
            }
            return resault;
        }
    }

})();
