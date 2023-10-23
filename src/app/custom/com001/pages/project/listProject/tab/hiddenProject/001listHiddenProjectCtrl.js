(function () {
    'use strict';

    // createDate: 2022/10/20
    angular.module('BlurAdmin.pages.001.Project')
    // .controller('createProjectCtrl', createProject);
        .controller('_001_listHiddenProjectCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            '$compile',
            'toastr',
            'User',
            '$timeout',
            'bsLoadingOverlayService',
            '_001_Project',
            '_001_Institute',
            '_001_ProjectCase',
            '_001_ProjectContract',
            '_001_DepBoss',
            listhiddenProject
        ])

    /** @ngInject */
    function listhiddenProject($scope,
                              cookies,
                              window,
                              $filter,
                              $compile,
                              toastr,
                              User,
                              $timeout,
                              bsLoadingOverlayService,
                              _001_Project,
                              _001_Institute,
                              _001_ProjectCase,
                              _001_ProjectContract,
                              _001_DepBoss) {

        $scope.username = cookies.get('username');
        $scope.userDID = cookies.get('userDID');
        $scope.roleType = cookies.get('roletype');
        $scope.depType = cookies.get('depType');
        $scope.isDepG = cookies.get('isDepG') == "false" ? false : true;

        var isFetchAllPrj = false;
        var isDepBoss = false;

        var loadingReferenceId = 'mainPage_001listProject'

        var vm = this;

        // 機關
        _001_Institute.findAll()
            .success(function (resp) {
                vm.instituteOptions = resp;
            })

        // 契約 ALL
        _001_ProjectContract.findAll()
            .success(function (resp) {
                vm.contractOptionsAll = resp;
            })

        // 工程 All
        _001_ProjectCase.findAll()
            .success(function (resp) {
                vm.caseOptionsAll = resp;
            })

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
            })

        vm.prjTypeOptions = [
            // 2022/07/09
            // 1-設計；2-監造；3-規劃；4-專管；5-管理；6-投標；7-其他
            // 1.設計
            // 2.監造
            // 3.規劃
            // 4.專管
            // 5.管理
            // 6.投標
            // 7.其他
            {label: '設計', value: '1'},
            {label: '監造', value: '2'},
            {label: '規劃', value: '3'},
            {label: '專管', value: '4'},
            {label: '管理', value: '5'},
            {label: '投標', value: '6'},
            {label: '其他', value: '7'},
        ];

        $scope.findRoleType = function(roleType, callBack) {
            var formData = {
                roleType: roleType
            }
            User.findByRoleType(formData)
                .success(function (result) {
                    callBack(result);
                })
        }

        // *****************
        // 總經理-1
        // 經理-2
        // 副理-3
        // 組長-4
        // 技師-5
        // 資深工程師-6
        // 高級工程師-7
        // 工程師-8
        // 助理工程師-9
        // 資深專員-10
        // 高級專員-11
        // 專員-12
        // 駐府人員-13
        // 工讀人員-14

        $scope.init = function() {
            console.log("init...");
            console.log("isFetchAllPrj:> " + isFetchAllPrj);
            console.log("isDepBoss:> " + isDepBoss);

            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: loadingReferenceId
                });
            }, 100)

            _001_Project.findAllHidden()
                .success(function (prjUnits) {
                    if (prjUnits.length > 0) {
                        // $scope.showData(prjUnits);
                    }
                    $scope.showData(prjUnits);
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: loadingReferenceId
                        });
                    }, 500)
                })

            // if (isFetchAllPrj) {
            //     _001_Project.findAll()
            //         .success(function (prjUnits) {
            //             if (prjUnits.length > 0) {
            //                 // $scope.showData(prjUnits);
            //             }
            //             $scope.showData(prjUnits);
            //         })
            //         .error(function () {
            //             $timeout(function () {
            //                 bsLoadingOverlayService.stop({
            //                     referenceId: loadingReferenceId
            //                 });
            //             }, 500)
            //         })
            // } else if (isDepBoss) {
            //     var bossDep = $scope.getMyDep($scope.userDID, vm.depBossSettings);
            //
            //     var userData = {
            //         depType: bossDep.depType,
            //         userDID: $scope.userDID,
            //     }
            //
            //     _001_Project.findAllByDepType(userData)
            //         .success(function (prjUnits) {
            //             if (prjUnits.length > 0) {
            //                 // $scope.showData(prjUnits);
            //             }
            //             $scope.showData(prjUnits);
            //         })
            //         .error(function () {
            //             $timeout(function () {
            //                 bsLoadingOverlayService.stop({
            //                     referenceId: loadingReferenceId
            //                 });
            //             }, 500)
            //         })
            //
            // } else {
            //     var userData = {
            //         userDID: $scope.userDID,
            //     }
            //     _001_Project.findAllByUserDID(userData)
            //         .success(function (prjUnits) {
            //             if (prjUnits.length > 0) {
            //                 // $scope.showData(prjUnits);
            //             }
            //             $scope.showData(prjUnits);
            //         })
            //         .error(function () {
            //             $timeout(function () {
            //                 bsLoadingOverlayService.stop({
            //                     referenceId: loadingReferenceId
            //                 });
            //             }, 500)
            //         })
            // }

        }

        $scope.showData = function (prjUnits) {
            console.log(" >>> showData")
            prjUnits.forEach(function (project) {
                project.instituteName = $scope.getInstitute(project.instituteDID).name;
                project.instituteCode = $scope.getInstitute(project.instituteDID).code;

                project.contractName = $scope.getProjectContract(project.contractDID).name;
                project.contractCode = $scope.getProjectContract(project.contractDID).code;

                project.caseName = $scope.getProjectCase(project.caseDID).name;
                project.caseCode = $scope.getProjectCase(project.caseDID).code;

                project.typeName = $scope.getProjectType(project.type).label;

                project.prjManager = $scope.showPrjManager(project);
            })

            $scope.setWorkersInfo(prjUnits);

            $scope.projects = prjUnits;

            angular.element(
                document.getElementById('includeHead_listHiddenProject'))
                .html($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'專案列表 - " + prjUnits.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/custom/com001/pages/project/listProject/tab/hiddenProject/table/listHiddenProjectTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));
            $timeout(function () {
                bsLoadingOverlayService.stop({
                    referenceId: loadingReferenceId
                });
            }, 500)
        }

        $scope.setWorkersInfo = function (projects) {
            // 顯示
            for (var index = 0; index < projects.length; index++) {
                var selected = [];
                for (var subIndex = 0; subIndex < projects[index].workers.length; subIndex++) {
                    selected = $filter('filter')($scope.allWorkers, {
                        value: projects[index].workers[subIndex],
                    });
                    selected.length == 1 ? projects[index].workers[subIndex] = selected[0] : projects[index].workers[subIndex];
                }

                for (var subIndex = 0; subIndex < projects[index].technician.length; subIndex++) {
                    selected = $filter('filter')($scope.allWorkers, {
                        value: projects[index].technician[subIndex],
                    });
                    selected.length == 1 ? projects[index].technician[subIndex] = selected[0] : projects[index].technician[subIndex];
                }

                selected = $filter('filter')($scope.allWorkers, {
                    value: projects[index].majorID,
                });
                selected.length == 1 ? projects[index].majorID = selected[0] : '未指派主辦';
            }
        }

        switch($scope.roleType) { // 總經理 1、技師 5、經理 2、組長 4
            case "1":
            case "2":
            case "4":
            case "5":
                isFetchAllPrj = true;
                break;
        }

        switch($scope.depType) { // 老闆
            case "A":
                isFetchAllPrj = true;
                break;
        }

        _001_DepBoss.findAll()
            .success(function (depBoss) {
                vm.depBossSettings = depBoss;
                isDepBoss = $scope.isDepBoss($scope.userDID, vm.depBossSettings);
                $scope.init();
            });

        $scope.findRoleType(5, function (resp) { // 技師
            $scope.techsItems = resp;
        })

        var emptyObject = {
            name: "Can not find",
            code: "Can not find",
        }

        $scope.getInstitute = function (did) {
            var selected = [];
            if (did) {
                selected = $filter('filter')(vm.instituteOptions, {
                    _id: did,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.getProjectContract = function (did) {
            var selected = [];
            if (did) {
                selected = $filter('filter')(vm.contractOptionsAll, {
                    _id: did,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.getProjectCase = function (did) {
            var selected = [];
            if (did) {
                selected = $filter('filter')(vm.caseOptionsAll, {
                    _id: did,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.getProjectType = function (type) {
            var selected = [];
            if (type) {
                selected = $filter('filter')(vm.prjTypeOptions, {
                    value: type,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.isDepBoss = function (targetUuid, options) {
            var selected = [];
            if (targetUuid) {
                selected = $filter('filter')(options, {
                    userDID: targetUuid,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return false;
            }
            if (selected.length > 0) {
                return true;
            }
            return false;
        }


        $scope.showUserNameByDID = function (userDID) {
            var selected = [];
            if ($scope.projectManagers === undefined) return;
            selected = $filter('filter')($scope.projectManagers, {
                value: userDID
            });
            return selected.length ? selected[0].name : 'Not Set';
        };

        $scope.showPrjManager = function (project) {
            var selected = [];
            if ($scope.projectManagers === undefined) return;
            if (project.managerID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: project.managerID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        $scope.showPrjMajor = function (project) {
            var selected = [];
            if ($scope.projectManagers === undefined) return;
            if (project.majorID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: project.majorID.value,
                });
            }
            if (selected.length == 1) {
                project.majorName = selected[0].name;
            } else if (selected.length == 0) {
                project.majorName = '未指派主承辦';
            }
            return selected.length ? selected[0].name : '未指派主承辦';
        };

        $scope.updateMajorEUI = function (form, table) {
            table.prjUnit.majorID = form.$data.majorID;
            var formData = {
                _id: table.prjUnit._id,
                majorID: form.$data.majorID.value,
            }
            _001_Project.updateOneUnit(formData)
                .success(function (res) {
                })
                .error(function () {
                })
        }

        $scope.updateWorkers = function (form, table) {
            try {
                var workers = [];
                for (var index = 0; index < form.$data.workers.length; index++) {
                    if (form.$data.workers[index] == null ) {
                        continue;
                    }
                    workers.push(form.$data.workers[index].value);
                }
                var formData = {
                    _id: table.prjUnit._id,
                    workers: workers,
                }
                _001_Project.updateOneUnit(formData)
                    .success(function (res) {
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
            for (var index = 0; index < workers.length; index++) {
                if (workers[index] == null || workers[index].name == undefined) {
                    continue;
                }
                results += workers[index].name + ", ";
            }
            return results;
        }

        $scope.showMembersName = function (members) {
            var results = "";
            for (var index = 0; index < members.length; index++) {
                if (members[index] == null || members[index].name == undefined) {
                    continue;
                }
                results += members[index].name + ", ";
            }
            return results;
        }

        $scope.updateTechs = function (form, table) {
            // console.log(form)
            // console.log(table)
            try {
                var techs = [];
                for (var index = 0; index < form.$data.techs.length; index++) {
                    if (form.$data.techs[index] == null ) {
                        continue;
                    }
                    techs.push(form.$data.techs[index]._id);
                }
                var formData = {
                    _id: table.prjUnit._id,
                    technician: techs,
                }
                _001_Project.updateOneUnit(formData)
                    .success(function (res) {
                    })
                    .error(function () {
                    })
            } catch (err) {
                toastr['warning']('資訊未完整 !', '更新失敗');
                return;
            }
        }

        $scope.getMyDep = function (targetUuid, options) {
            var selected = [];
            if (targetUuid) {
                selected = $filter('filter')(options, {
                    userDID: targetUuid,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return "";
            }
            if (selected.length > 0) {
                return selected[0];
            }
        }

    }
})();

