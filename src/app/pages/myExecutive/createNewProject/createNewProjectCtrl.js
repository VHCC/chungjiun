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
                console.log(allProjects);
                allProjects.push({mainName: "新總案", code: ""});
                allProjects.push({mainName: "建立總案 (自訂編號)", code: "9999"});
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

        vm.prjNumbers = [
            {label: "新專案", value: ""},
        ];

        vm.prjSubNumbers = [
            {label: '新子案', value: ""},
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
        $scope.triggerChangeMainProject = function () {
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
                $scope.mainProject.new = $scope.mainProject.selected.mainName;
                window.document.getElementById('newPrjNameDiv').style.display = "none";
                window.document.getElementById('setPrjCodeDiv').style.display = "none";
                // console.log(scope.mainProject.selected.name);
                var data = {
                    name: $scope.mainProject.selected.mainName
                }
                Project.findPrjByName(data)
                    .success(function (prj) {
                            // console.log(JSON.stringify(prj));
                            $scope.mainProject.code = prj.code;
                            $scope.year = prj.year;
                            vm.branch = $scope.showPrjBranch(prj.branch);

                            var data = {
                                code: $scope.mainProject.code,
                            }

                            //TODO
                            //loadProjectNumberByCode
                            Project.findPrjNumberByCode(data)
                                .success(function (prj) {
                                    // console.log(prj);
                                    var allNumberProject = [];
                                    for (var index = 0; index < prj.length; index ++) {
                                        allNumberProject.push({label: prj[index].prjName, value: prj[index].prjNumber});
                                    }
                                    allNumberProject.push({label: "新專案", value: ""});
                                    vm.prjNumbers = allNumberProject;
                                })


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

        // Name Check　新總案名稱
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

        // TODO
        // Number Check 專案
        $scope.triggerChangePrjNumber = function() {
            if (this.mainProject.selected.code === "") {
                window.document.getElementById('newPrjNumberDiv').style.display = "block";
                //新總案，必新專案 00
                $scope.mainProject.number.code = "00";
                $scope.mainProject.numberNew = "";
                return;
            }
            if (this.mainProject.number.selected.value === "") {
                //既有總案，新專案case
                window.document.getElementById('newPrjNumberDiv').style.display = "block";
                var data = {
                    code: $scope.mainProject.code
                }
                Project.findPrjNumberDistinctByCode(data)
                    .success(function (prjs) {
                            console.log(JSON.stringify(prjs));
                            // 專案案編號自動跳號 +1
                            $scope.mainProject.number.code = prjs.length + 1 > 10 ? prjs.length : "0" + (prjs.length);
                            $scope.mainProject.numberNew = "";
                        }
                    );
            } else {
                // 既有專案
                window.document.getElementById('newPrjNumberDiv').style.display = "none";
                $scope.mainProject.number.code = this.mainProject.number.selected.value;
                $scope.mainProject.numberNew = this.mainProject.number.selected.label;
            }
        }


        // TODO
        // SubNumber Check 子案
        $scope.triggerChangePrjSubNumber = function() {
            if (this.mainProject.number.selected.value === "") {
                window.document.getElementById('newPrjSubNumberDiv').style.display = "block";
                //新專案，必新子案 00
                $scope.mainProject.subNumber.code = "00";
                $scope.mainProject.subNumberNew = "";
                return;
            }
            if (this.mainProject.subNumber.selected.value === "") {
                //既有專案，新子案case
                window.document.getElementById('newPrjSubNumberDiv').style.display = "block";
            }
        }

        // Type Check　類型
        $scope.triggerChangePrjType = function () {
            // console.log('triggerChangePrjType');

            if ($scope.mainProject.selected.mainName !== undefined) {
                var data = {
                    name: $scope.mainProject.selected.mainName
                }
                Project.findPrjByName(data)
                    .success(function (prj) {
                            // console.log(JSON.stringify(prj));
                            // 專案已存在 case
                            if ($scope.mainProject.selected.code !== "") {
                                //若專案名稱已選
                                $scope.mainProject.new = $scope.mainProject.selected.mainName;
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
                for (var index = 0; index < $scope.mainProject.techs.length; index++) {
                    prjTechs[index] = $scope.mainProject.techs[index]._id;
                }
                var createData = {
                    branch: vm.branch.value,
                    year: String($scope.year),
                    code: String($scope.mainProject.code),
                    type: $scope.mainProject.type.selected.value,
                    mainName: $scope.mainProject.new,
                    // majorID: $scope.mainProject.manager._id,
                    managerID: $scope.mainProject.manager._id,
                    prjCode:
                        vm.branch.value +
                        String($scope.year) +
                        String($scope.mainProject.code) +
                        String($scope.mainProject.number.code) +
                        String($scope.mainProject.subNumber.code) +
                        $scope.mainProject.type.selected.value,
                    technician: prjTechs,
                    // endDate: req.body.prjEndDate,
                    prjNumber: $scope.mainProject.number.code,
                    prjName: $scope.mainProject.numberNew,
                    prjSubNumber: $scope.mainProject.subNumber.code,
                    prjSubName: $scope.mainProject.subNumberNew,

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

