/**
 * @author Ichen.chu
 * created on 15.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProject')
        .service('intiProjectsService', function ($http, $cookies) {

            // console.log($cookies.get('userDID'));
            var formData = {
                relatedID: $cookies.get('userDID'),
            }
            var promise = $http.post('/api/post_project_all_related_to_user_with_disabled', formData)
                .success(function (allProjects) {
                    return allProjects;
                });
            return promise;
        })
        .controller('listProjectTableCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                'User',
                '$compile',
                'editableOptions',
                'editableThemes',
                'Project',
                'ProjectUtil',
                'intiProjectsService',
                function (scope,
                          filter,
                          $cookies,
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
                        $cookies,
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
                                 $cookies,
                                 User,
                                 $compile,
                                 editableOptions,
                                 editableThemes,
                                 Project,
                                 ProjectUtil,
                                 intiProjectsService) {
        $scope.loading = true;

        intiProjectsService.then(function (resp) {
            // console.log(resp.data);
            $scope.projects = resp.data;
            $scope.projects.slice(0, resp.data.length);

            angular.element(
                document.getElementById('includeHead'))
                .append($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'專案列表 - " + resp.data.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/pages/myProject/listProject/table/listProjectTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));


            User.getAllUsers()
                .success(function (allUsers) {
                    // 協辦人員
                    $scope.allWorkers = [];
                    $scope.allWorkersID = [];
                    for (var i = 0; i < allUsers.length; i++) {
                        $scope.allWorkers[i] = {
                            value: allUsers[i]._id,
                            name: allUsers[i].name,
                        };
                        $scope.allWorkersID[i] = allUsers[i]._id;
                    }

                    // 經理、主承辦
                    $scope.projectManagers = [];
                    $scope.projectManagers[0] = {
                        value: "",
                        name: "None"
                    };
                    for (var i = 0; i < allUsers.length; i++) {
                        $scope.projectManagers[i+1] = {
                            value: allUsers[i]._id,
                            name: allUsers[i].name
                        };
                    }

                    // 顯示
                    for (var index = 0; index < $scope.projects.length; index++) {
                        var selected = [];
                        for (var subIndex = 0; subIndex < $scope.projects[index].workers.length; subIndex++) {
                            selected = $filter('filter')($scope.allWorkers, {
                                value: $scope.projects[index].workers[subIndex],
                            });
                            selected.length ? $scope.projects[index].workers[subIndex] = selected[0] : "";
                        }
                    }
                })

        })

        // User.getAllUsers()
        //     .success(function (allUsers) {
        //         $scope.allWorkers = [];
        //         $scope.allWorkersID = [];
        //         for (var i = 0; i < allUsers.length; i++) {
        //             $scope.allWorkers[i] = {
        //                 value: allUsers[i]._id,
        //                 name: allUsers[i].name,
        //             };
        //             $scope.allWorkersID[i] = allUsers[i]._id;
        //         }
        //
        //         for (var index = 0; index < $scope.projects.length; index++) {
        //             var selected = [];
        //             for (var subIndex = 0; subIndex < $scope.projects[index].workers.length; subIndex++) {
        //                 selected = $filter('filter')($scope.allWorkers, {
        //                     value: $scope.projects[index].workers[subIndex],
        //                 });
        //                 selected.length ? $scope.projects[index].workers[subIndex] = selected[0] : "";
        //             }
        //         }
        //     })

        // User.getAllUsers()
        //     .success(function (allUsers) {
        //         $scope.projectManagers = [];
        //         $scope.projectManagers[0] = {
        //             value: "",
        //             name: "None"
        //         };
        //         for (var i = 0; i < allUsers.length; i++) {
        //             $scope.projectManagers[i+1] = {
        //                 value: allUsers[i]._id,
        //                 name: allUsers[i].name
        //             };
        //         }
        //     });

        //技師
        User.findTechs()
            .success(function (allTechs) {
                $scope.projectTechs = [];
                for (var i = 0; i < allTechs.length; i++) {
                    $scope.projectTechs[i] = {
                        value: allTechs[i]._id,
                        name: allTechs[i].name
                    };
                }
            });

        $scope.showManager = function (project) {
            var selected = [];
            if ($scope.projectManagers === undefined) return;
            if (project.managerID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: project.managerID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        $scope.isFitPrjManager = function(managerDID) {
            return managerDID === $cookies.get('userDID');
        }

        $scope.showMajor = function (project) {
            var selected = [];
            if ($scope.projectManagers === undefined) return;
            if (project.majorID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: project.majorID,
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
            var selected = [];
            if ($scope.projectTechs === undefined) return;
            for (var index = 0; index < techs.length; index++) {
                selected = $filter('filter')($scope.projectTechs, {
                    value: techs[index],
                });
                resault += selected.length ? selected[0].name + ", ": 'UnKnown, ';
            }
            return resault;
        }

        editableThemes['bs3'].submitTpl = '<button type="submit" ng-click="updateMajor($form, $parent)" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

        $scope.updateMajor = function (form, table) {
            // console.log(form.$data);
            // console.log(table.$parent.prj._id);
            var formData = {
                prjID: table.$parent.prj._id,
                majorID: form.$data.majorID,
            }

            Project.updateMajorID(formData)
                .success(function (res) {
                    console.log(res.code);
                })
                .error(function () {

                })
        }

        $scope.updateWorkers = function (form, table) {
            try {
                var workers = [];
                for (var index = 0; index < form.$data.workers.length; index++) {
                    workers[index] = form.$data.workers[index].value;
                }
                var formData = {
                    prjID: table.prj._id,
                    workers: workers,
                }
                Project.updateWorkers(formData)
                    .success(function (res) {
                        console.log(res.code);
                    })
                    .error(function () {

                    })
            } catch (err) {
                toastr['warning']('資訊未完整 !', '更新失敗');
                return;
            }
        }

        $scope.showWorkersName = function (workers) {
            var resault = "";
            for (var index = 0; index < workers.length; index++) {
                resault += workers[index].name + ", ";
            }
            return resault;
        }

        $scope.changePrjStatus = function (table) {
            var formData = {
                prjID: table.prj._id,
                enable: table.prj.enable,
            }
            Project.updateStatus(formData)
                .success(function (res) {
                    console.log(res.code);
                })
                .error(function () {
                })
        }
    }

})();
