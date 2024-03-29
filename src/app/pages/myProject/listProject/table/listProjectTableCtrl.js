/**
 * @author Ichen.chu
 * created on 15.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProject')
        .service('intiProjectsService', ['$http', '$cookies', '$rootScope', function ($http, $cookies, $rootScope) {
            $rootScope.isFirstLoading = false;

            // console.log($cookies.get('userDID'));
            var formData = {
                relatedID: $cookies.get('userDID'),
            }

            if ($cookies.get('roletype') == "100") {
                var promise = $http.get('/api/projectFindAll')
                    .success(function (allProjects) {
                        return allProjects;
                    });
                return promise;
            } else {
                var promise = $http.post('/api/post_project_all_related_to_user_with_disabled', formData)
                    .success(function (allProjects) {
                        return allProjects;
                    });
                return promise;
            }


        }])
        .controller('listProjectTableCtrl',
            [
                '$rootScope',
                '$scope',
                '$filter',
                '$cookies',
                'User',
                '$compile',
                'editableOptions',
                'editableThemes',
                'Project',
                'ProjectUtil',
                '$http',
                'intiProjectsService',
                function ($rootScope,
                          scope,
                          filter,
                          $cookies,
                          User,
                          $compile,
                          editableOptions,
                          editableThemes,
                          Project,
                          ProjectUtil,
                          $http,
                          intiProjectsService) {
                    return new ListProjectPageCtrl(
                        $rootScope,
                        scope,
                        filter,
                        $cookies,
                        User,
                        $compile,
                        editableOptions,
                        editableThemes,
                        Project,
                        ProjectUtil,
                        $http,
                        intiProjectsService
                    );
                }])
    ;

    /** @ngInject */
    function ListProjectPageCtrl($rootScope,
                                 $scope,
                                 $filter,
                                 $cookies,
                                 User,
                                 $compile,
                                 editableOptions,
                                 editableThemes,
                                 Project,
                                 ProjectUtil,
                                 $http,
                                 intiProjectsService) {
        $scope.loading = true;


        intiProjectsService.then(function (resp) {
            $scope.projects = resp.data;
            $scope.projects.slice(0, resp.data.length);

            $rootScope.isFirstLoading = true;

            angular.element(
                document.getElementById('includeHead'))
                .append($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'執行專案列表 - " + resp.data.length + "'" +
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

                    // 經理
                    $scope.projectManagers = [];
                    // 2021/01/22 不能不指派經理
                    // $scope.projectManagers[0] = {
                    //     value: "",
                    //     name: "None"
                    // };
                    for (var i = 0; i < allUsers.length; i++) {
                        $scope.projectManagers[i] = {
                            value: allUsers[i]._id,
                            name: allUsers[i].name
                        };
                    }

                    // 主承辦
                    $scope.projectCharger = [];
                    // 2023/11/27 可以不指派主承辦
                    $scope.projectCharger[0] = {
                        value: "",
                        name: "None"
                    };
                    for (var i = 0; i < allUsers.length; i++) {
                        $scope.projectCharger[i+1] = {
                            value: allUsers[i]._id,
                            name: allUsers[i].name
                        };
                    }

                })

            User.getAllUsersWithSignOut() // 包含已離職
                .success(function (allUsers) {
                    $scope.allWorkersTemp = [];
                    for (var i = 0; i < allUsers.length; i++) {
                        $scope.allWorkersTemp[i] = {
                            value: allUsers[i]._id,
                            name: allUsers[i].name,
                        };
                    }
                    // 顯示 worker
                    for (var index = 0; index < $scope.projects.length; index++) {
                        var selected = [];
                        for (var subIndex = 0; subIndex < $scope.projects[index].workers.length; subIndex++) {
                            selected = $filter('filter')($scope.allWorkersTemp, {
                                value: $scope.projects[index].workers[subIndex],
                            });
                            selected.length == 1 ? $scope.projects[index].workers[subIndex] = selected[0] : $scope.projects[index].workers[subIndex];
                        }

                        selected = $filter('filter')($scope.allWorkersTemp, {
                            value: $scope.projects[index].majorID,
                        });
                        selected.length == 1 ? $scope.projects[index].majorID = selected[0] : '未指派主辦';

                        selected = $filter('filter')($scope.allWorkersTemp, {
                            value: $scope.projects[index].managerID,
                        });
                        selected.length == 1 ? $scope.projects[index].managerID = selected[0] : '未指派經理';

                    }
                })
        })

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
                    value: project.managerID.value
                });
            }
            return selected.length ? selected[0].name : '未指派經理';
        };

        $scope.isFitPrjManager = function(managerDID) {
            return managerDID.value === $cookies.get('userDID');
        }

        // 對應行政總管
        $scope.isFitExecutive = function () {
            return ($cookies.get('roletype') == "100" || $cookies.get('userDID') == "5d197f16a6b04756c893a162")
        }

        $scope.showMajor = function (project) {
            var selected = [];
            if ($scope.projectCharger === undefined) return;
            if (project.majorID) {
                selected = $filter('filter')($scope.projectCharger, {
                    value: project.majorID.value,
                });
            }
            return selected.length ? selected[0].name : '未指派主辦';
        };

        editableOptions.theme = 'bs3';

        $scope.clickChangeManager = function() {
            editableThemes['bs3'].submitTpl = '<button type="submit" ng-click="updateManager($form, $parent)" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        }

        $scope.updateManager = function (form, table) {
            var formData = {
                prjID: table.$parent.prj._id,
                managerID: form.$data.managerID,
            }

            Project.updateManagerID(formData)
                .success(function (res) {
                    console.log(res.code);
                })
                .error(function () {
                })
        }

        $scope.updateManagerEUI = function (form, table) {
            table.prj.managerID = form.$data.managerID;
            var formData = {
                prjID: table.prj._id,
                managerID: form.$data.managerID.value,
            }

            Project.updateManagerID(formData)
                .success(function (res) {
                    // console.log(res.code);
                })
                .error(function () {
                })
        }

        $scope.clickChangeMajor = function() {
            editableThemes['bs3'].submitTpl = '<button type="submit" ng-click="updateMajor($form, $parent)" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        }

        $scope.updateMajor = function (form, table) {
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

        $scope.updateMajorEUI = function (form, table) {
            table.prj.majorID = form.$data.majorID;
            var formData = {
                prjID: table.prj._id,
                majorID: form.$data.majorID.value,
            }

            Project.updateMajorID(formData)
                .success(function (res) {
                })
                .error(function () {
                })
        }

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
                resault += selected.length ? selected[0].name + ", ": '未指定';
            }
            return resault;
        }

        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

        // 更新總案名稱
        $scope.changeMainName = function (form, table) {
            try {
                var formData = {
                    prjID: table.prj._id,
                    mainName: form.$data.mainName,
                }
                Project.updateMainName(formData)
                    .success(function (res) {
                        console.log(res.code);
                    })
                    .error(function () {

                    })
            } catch (err) {
                toastr['warning']('變更總案名 !', '更新失敗');
                return;
            }
        }

        // 更新專案名稱
        $scope.changePrjName = function (form, table) {
            try {
                var formData = {
                    prjID: table.prj._id,
                    prjName: form.$data.prjName,
                }
                Project.updatePrjName(formData)
                    .success(function (res) {
                        console.log(res.code);
                    })
                    .error(function () {

                    })
            } catch (err) {
                toastr['warning']('變更專案名 !', '更新失敗');
                return;
            }
        }

        // 更新子案名稱
        $scope.changePrjSubName = function (form, table) {
            try {
                var formData = {
                    prjID: table.prj._id,
                    prjSubName: form.$data.prjSubName,
                }
                Project.updatePrjSubName(formData)
                    .success(function (res) {
                        console.log(res.code);
                    })
                    .error(function () {

                    })
            } catch (err) {
                toastr['warning']('變更子案名 !', '更新失敗');
                return;
            }
        }

        $scope.updateWorkers = function (form, table) {
            try {
                var workers = [];
                for (var index = 0; index < form.$data.workers.length; index++) {
                    // console.log(form.$data.workers[index]);
                    if (form.$data.workers[index] == null ) {
                        continue;
                    }
                    workers.push(form.$data.workers[index].value);
                }
                var formData = {
                    prjID: table.prj._id,
                    workers: workers,
                }
                // console.log(formData);
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
            var results = "";
            if (workers.length == 0) return "未指派協辦"
            for (var index = 0; index < workers.length; index++) {
                if (workers[index] == null || workers[index].name == undefined) {
                    continue;
                }
                results += workers[index].name + ", ";
            }
            return results;
        }

        $scope.changePrjStatus = function (table) {
            var formData = {
                prjID: table.prj._id,
                enable: table.prj.enable,
                update_ts: moment(new Date()).format("YYYYMMDD_HHmmss"),
                updater: $cookies.get('username')
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
