(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myExecutive')
    // .controller('createProjectCtrl', createProject);
        .controller('createNewProjectCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            'toastr',
            'User',
            '$timeout',
            'Project',
            '$document',
            createNewProject
        ])

    /** @ngInject */
    function createNewProject($scope,
                              cookies,
                              window,
                              $filter,
                              toastr,
                              User,
                              $timeout,
                              Project,
                              document) {
        // Data Initial
        $scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        $scope.formData = {};
        $scope.mainProject = {};

        // right division.
        if (roleType !== '100') {
            console.log(
                'roleType= ' + roleType +
                'username= ' + $scope.username);
            window.location.href = '/noRight.html';
        }

        Project.findAllByGroup()
            .success(function (allProjects) {
                allProjects.push({name: "新總案", code: ""});
                allProjects.push({name: "建立總案 (自訂編號)", code: "9999"});
                vm.projects = allProjects;
                $scope.year = new Date().getFullYear() - 1911;
            });

        var vm = this;

        User.findTechs()
            .success(function (techs) {
                // console.log(JSON.stringify(techs));
                vm.techsItems = techs;
            })

        User.findManagers()
            .success(function (managers) {
                // console.log(JSON.stringify(managers));
                vm.managersItem = managers;
            })

        vm.prjTypes = [
            // {label: '規劃-0', type: '0'},
            {label: '設計-1', value: '1'},
            {label: '監造-2', value: '2'},
            {label: '規劃-3', value: '3'},
            {label: '服務-4', value: '4'},
            {label: '總案-5', value: '5'},
            {label: '專案管理-6', value: '6'},
            {label: '其他-7', value: '7'},
        ];

        vm.prjBranch = [
            {label: 'P-投標-服務建議書', value: 'P'},
            {label: 'C-已成案', value: 'C'},
        ];

        $scope.showPrjBranch = function (branch) {

            var selected = [];
            if (branch) {
                selected = $filter('filter')(vm.prjBranch, {
                    value: branch,
                });
            }
            return selected[0];
        }

        User.getAllUsers()
            .success(function (allUsers) {
                $scope.users = allUsers;
            });

        //Prj Name Check whether is new or not.　總案名稱變更
        $scope.triggerChangePrjName = function () {
            // console.log('triggerChangePrjName');
            if (this.mainProject.selected.code === "") {
                //新總案case
                window.document.getElementById('newPrjNameDiv').style.display = "block";
                window.document.getElementById('setPrjCodeDiv').style.display = "none";
                Project.findPrjDistinctByName()
                    .success(function (prjs) {
                            // console.log(JSON.stringify(prjs));
                            // 總案編號自動跳號 +1
                            $scope.mainProject.code = prjs.length + 1 > 10 ? prjs.length : "0" + (prjs.length);
                            $scope.mainProject.new = "";
                            $scope.year = new Date().getFullYear() - 1911;
                            if ($scope.mainProject.type !== undefined) {
                                var data = {
                                    year: $scope.year,
                                    code: $scope.mainProject.code,
                                    type: $scope.mainProject.type.selected.value,
                                }
                                Project.findPrjFootNumber(data)
                                    .success(function (prjs) {
                                        // console.log(JSON.stringify(prjs));
                                        $scope.mainProject.footCode = prjs.length + 1 > 10 ? prjs.length + 1 : "0" + (prjs.length + 1);
                                    })
                            }
                        }
                    );
            //    自訂總案編號
            } else if (this.mainProject.selected.code === "9999") {
                window.document.getElementById('newPrjNameDiv').style.display = "block";
                window.document.getElementById('setPrjCodeDiv').style.display = "block";
                $scope.mainProject.setCode = "";
            } else {
                // 專案已存在
                $scope.mainProject.new = $scope.mainProject.selected.name;
                window.document.getElementById('newPrjNameDiv').style.display = "none";
                window.document.getElementById('setPrjCodeDiv').style.display = "none";
                // console.log(scope.mainProject.selected.name);
                var data = {
                    name: $scope.mainProject.selected.name
                }
                Project.findPrjByName(data)
                    .success(function (prj) {
                            // console.log(JSON.stringify(prj));
                            $scope.mainProject.code = prj.code;
                            $scope.year = prj.year;
                            vm.branch = $scope.showPrjBranch(prj.branch);
                            if ($scope.mainProject.type !== undefined) {
                                //若類型已選
                                var formData = {
                                    year: $scope.year,
                                    code: $scope.mainProject.code,
                                    type: $scope.mainProject.type.selected.value,
                                }
                                Project.findPrjFootNumber(formData)
                                    .success(function (prjs) {
                                        // console.log(JSON.stringify(prjs));
                                        // console.log(prjs.length);
                                        $scope.mainProject.footCode = prjs.length + 1 > 10 ? prjs.length + 1 : "0" + (prjs.length + 1);
                                    })
                            }
                        }
                    );
            }
        }

        // Name Check　總案名稱
        $scope.triggerChangePrjNewName = function () {
            // console.log('triggerChangePrjNewName');
            var data = {
                name: $scope.mainProject.new
            }
            Project.findPrjByName(data)
                .success(function (prj) {
                    // console.log(JSON.stringify(prj));
                    if (prj !== null) {
                        document[0].getElementById('prjSubmitBtn').disabled = true;
                        document[0].getElementById('prjSubmitBtn').innerText = "專案名稱已存在，請檢查！"
                    } else {
                        document[0].getElementById('prjSubmitBtn').disabled = false;
                        document[0].getElementById('prjSubmitBtn').innerText = "建立專案"
                    }
                })
        }

        // Code Check　自訂編號
        $scope.triggerChangePrjCode = function () {
            // console.log('triggerChangePrjNewName');
            if ($scope.mainProject.setCode.length !== 2) {
                document[0].getElementById('prjSubmitBtn').disabled = true;
                document[0].getElementById('prjSubmitBtn').innerText = "請確認 自訂總案編號為 2 位數字！"
                return;
            } else {
                document[0].getElementById('prjSubmitBtn').disabled = false;
                document[0].getElementById('prjSubmitBtn').innerText = "建立專案"
            }

            var formData = {
                code: $scope.mainProject.setCode
            }
            Project.findPrjByCode(formData)
                .success(function (prj) {
                    // console.log(JSON.stringify(prj));
                    if (prj !== null) {
                        document[0].getElementById('prjSubmitBtn').disabled = true;
                        document[0].getElementById('prjSubmitBtn').innerText = "專案編號已存在，請檢查！"
                    } else {
                        $scope.mainProject.code = $scope.mainProject.setCode;

                        document[0].getElementById('prjSubmitBtn').disabled = false;
                        document[0].getElementById('prjSubmitBtn').innerText = "建立專案"
                    }
                })
        }

        // Type Check　類型
        $scope.triggerChangePrjType = function () {
            // console.log('triggerChangePrjType');

            if ($scope.mainProject.selected.name !== undefined) {
                var data = {
                    name: $scope.mainProject.selected.name
                }
                Project.findPrjByName(data)
                    .success(function (prj) {
                            // console.log(JSON.stringify(prj));
                            // 專案已存在 case
                            if ($scope.mainProject.selected.code !== "") {
                                //若專案名稱已選
                                $scope.mainProject.new = $scope.mainProject.selected.name;
                                $scope.mainProject.code = prj.code;
                                var data = {
                                    year: $scope.year,
                                    code: $scope.mainProject.code,
                                    type: $scope.mainProject.type.selected.value,
                                }
                                Project.findPrjFootNumber(data)
                                    .success(function (prjs) {
                                        // console.log(JSON.stringify(prjs));
                                        // console.log(prjs.length);
                                        $scope.mainProject.footCode = prjs.length + 1 > 10 ? prjs.length + 1 : "0" + (prjs.length + 1);
                                    })
                            } else {
                                $scope.mainProject.footCode = "00";
                            }
                        }
                    );
            }
        }

        $scope.triggerChangePrjTechs = function () {
            console.log('triggerChangePrjTechs');
            if (this.mainProject.techs === undefined) {
                this.mainProject.techs = null;
            }
        }

        // ----------------- CREATE ---------------

        $scope.createSubmit = function () {
            // console.log('createSubmit');
            // $scope.formData.prjCode = document[0].getElementById('prjCode').innerText;
            // $scope.formData.prjEndDate = document[0].getElementById('myDT').value;

            try {
                var prjTechs = [];
                for (var index = 0; index < $scope.mainProject.techs.length; index ++) {
                    prjTechs[index] = $scope.mainProject.techs[index]._id;
                }
                var createData = {
                    branch: vm.branch.value,
                    year: String($scope.year),
                    code: String($scope.mainProject.code),
                    type: $scope.mainProject.type.selected.value,
                    name: $scope.mainProject.new,
                    // majorID: $scope.mainProject.manager._id,
                    managerID: $scope.mainProject.manager._id,
                    prjCode:
                    vm.branch.value +
                    String($scope.year) +
                    String($scope.mainProject.code) +
                    $scope.mainProject.type.selected.value +
                    $scope.mainProject.footCode,
                    technician: prjTechs,
                    // endDate: req.body.prjEndDate,
                }
            } catch (err) {
                toastr['warning']('輸入資訊未完整 !', '建立失敗');
                return;
            }
            console.log(createData);

            Project.create(createData)
                .success(function (res) {
                    // console.log('createSubmit 2');
                    console.log('Error Code= ' + res.code);
                    if (res.code == 200) {
                        $scope.formData = [];
                        window.location.reload();
                    }
                })
                .error(function (res) {
                    console.log('createSubmit  error');
                    // toastr['warning']('輸入資訊未完整 !', '建立失敗');
                    // window.formNotFullFill();
                })
        }

    }
})();

