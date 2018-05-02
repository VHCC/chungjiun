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
                $scope.formData.year = new Date().getFullYear() - 1911;
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
            {label: '規劃-0', type: '0'},
            {label: '設計-1', type: '1'},
            {label: '監造-2', type: '2'},
            {label: '服務-3', type: '3'},
            {label: '行政-4', type: '4'},
            {label: '投標-5', type: '5'},
            {label: '總案-6', type: '6'},
            {label: '其他-7', type: '7'},
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

        //Prj Name Check whether is new or not.
        $scope.triggerChangePrjName = function () {
            // console.log('triggerChangePrjName');
            if (this.formData.prj.name.selected.code === "") {
                //新總案case
                window.document.getElementById('newPrjNameDiv').style.display = "block";
                window.document.getElementById('setPrjCodeDiv').style.display = "none";
                Project.findPrjDistinctByName()
                    .success(function (prjs) {
                            // console.log(JSON.stringify(prjs));
                            // 總案編號自動跳號 +1
                            $scope.formData.prj.code = prjs.length + 1 > 10 ? prjs.length : "0" + (prjs.length);
                            $scope.formData.prj.name.new = "";
                            $scope.formData.year = new Date().getFullYear() - 1911;
                            if ($scope.formData.prj.type !== undefined) {
                                var data = {
                                    year: $scope.formData.year,
                                    code: $scope.formData.prj.code,
                                    type: $scope.formData.prj.type.selected.type,
                                }
                                Project.findPrjFootNumber(data)
                                    .success(function (prjs) {
                                        // console.log(JSON.stringify(prjs));
                                        $scope.formData.prj.footCode = prjs.length + 1 > 10 ? prjs.length + 1 : "0" + (prjs.length + 1);
                                    })
                            }
                        }
                    );
            //    自訂總案編號
            } else if (this.formData.prj.name.selected.code === "9999") {
                $scope.formData.prj.set.code = "";
                window.document.getElementById('newPrjNameDiv').style.display = "block";
                window.document.getElementById('setPrjCodeDiv').style.display = "block";


            } else {
                // 專案已存在
                $scope.formData.prj.name.new = $scope.formData.prj.name.selected.name;
                window.document.getElementById('newPrjNameDiv').style.display = "none";
                window.document.getElementById('setPrjCodeDiv').style.display = "none";
                // console.log(scope.formData.prj.name.selected.name);
                var data = {
                    name: $scope.formData.prj.name.selected.name
                }
                Project.findPrjByName(data)
                    .success(function (prj) {
                            // console.log(JSON.stringify(prj));
                            $scope.formData.prj.code = prj.code;
                            $scope.formData.year = prj.year;
                            vm.branch = $scope.showPrjBranch(prj.branch);
                            if ($scope.formData.prj.type !== undefined) {
                                var formData = {
                                    year: $scope.formData.year,
                                    code: $scope.formData.prj.code,
                                    type: $scope.formData.prj.type.selected.type,
                                }
                                Project.findPrjFootNumber(formData)
                                    .success(function (prjs) {
                                        // console.log(JSON.stringify(prjs));
                                        // console.log(prjs.length);
                                        $scope.formData.prj.footCode = prjs.length + 1 > 10 ? prjs.length + 1 : "0" + (prjs.length + 1);
                                    })
                            }
                        }
                    );
            }
        }

        // Name Check
        $scope.triggerChangePrjNewName = function () {
            // console.log('triggerChangePrjNewName');
            var data = {
                name: $scope.formData.prj.name.new
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

        // Code Check
        $scope.triggerChangePrjCode = function () {
            // console.log('triggerChangePrjNewName');
            if ($scope.formData.prj.set.code.length !== 2) {
                document[0].getElementById('prjSubmitBtn').disabled = true;
                document[0].getElementById('prjSubmitBtn').innerText = "請確認 自訂總案編號為 2 位數字！"
                return;
            } else {
                document[0].getElementById('prjSubmitBtn').disabled = false;
                document[0].getElementById('prjSubmitBtn').innerText = "建立專案"
            }

            var formData = {
                code: $scope.formData.prj.set.code
            }
            Project.findPrjByCode(formData)
                .success(function (prj) {
                    // console.log(JSON.stringify(prj));
                    if (prj !== null) {
                        document[0].getElementById('prjSubmitBtn').disabled = true;
                        document[0].getElementById('prjSubmitBtn').innerText = "專案編號已存在，請檢查！"
                    } else {
                        $scope.formData.prj.code = $scope.formData.prj.set.code;

                        document[0].getElementById('prjSubmitBtn').disabled = false;
                        document[0].getElementById('prjSubmitBtn').innerText = "建立專案"
                    }
                })
        }

        // Type Check
        $scope.triggerChangePrjType = function () {
            // console.log('triggerChangePrjType');

            if ($scope.formData.prj.name !== undefined) {
                var data = {
                    name: $scope.formData.prj.name.selected.name
                }
                Project.findPrjByName(data)
                    .success(function (prj) {
                            // console.log(JSON.stringify(prj));
                            // 專案已存在 case
                            if ($scope.formData.prj.name.selected.code !== "") {
                                $scope.formData.prj.name.new = $scope.formData.prj.name.selected.name;
                                $scope.formData.prj.code = prj.code;
                                var data = {
                                    year: $scope.formData.year,
                                    code: $scope.formData.prj.code,
                                    type: $scope.formData.prj.type.selected.type,
                                }
                                Project.findPrjFootNumber(data)
                                    .success(function (prjs) {
                                        // console.log(JSON.stringify(prjs));
                                        // console.log(prjs.length);
                                        $scope.formData.prj.footCode = prjs.length + 1 > 10 ? prjs.length + 1 : "0" + (prjs.length + 1);
                                    })
                            } else {
                                $scope.formData.prj.footCode = "01";
                            }
                        }
                    );
            }
        }

        $scope.triggerChangePrjTechs = function () {
            console.log('triggerChangePrjTechs');
            if (this.formData.techs.selected === undefined) {
                this.formData.techs = null;
            }
        }

        // ----------------- CREATE ---------------

        $scope.createSubmit = function () {
            console.log('createSubmit');
            $scope.formData.prjCode = document[0].getElementById('prjCode').innerText;
            // $scope.formData.prjEndDate = document[0].getElementById('myDT').value;

            try {
                var prjTechs = [];
                for (var index = 0; index < $scope.formData.techs.selected.length; index ++) {
                    prjTechs[index] = $scope.formData.techs.selected[index]._id;
                }
                var createData = {
                    branch: vm.branch.value,
                    year: String($scope.formData.year),
                    code: String($scope.formData.prj.code),
                    type: $scope.formData.prj.type.selected.type,
                    name: $scope.formData.prj.name.new,
                    // majorID: $scope.formData.manager.selected._id,
                    managerID: $scope.formData.manager.selected._id,
                    prjCode:
                    vm.branch.value +
                    String($scope.formData.year) +
                    String($scope.formData.prj.code) +
                    $scope.formData.prj.type.selected.type +
                    $scope.formData.prj.footCode,
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

