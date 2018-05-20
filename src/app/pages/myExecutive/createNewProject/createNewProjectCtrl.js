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

        $scope.resetPrjNumber = function() {
            vm.prjNumbers = [
                {label: "新專案", value: ""},
            ];
        }

        $scope.resetPrjNumber();

        $scope.resetPrjSubNumber = function() {
            vm.prjSubNumbers = [
                {label: '新子案', value: ""},
            ];
        }

        $scope.resetPrjSubNumber();

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
            this.mainProject.number = null;
            this.mainProject.subNumber = null;
            this.mainProject.type = null;
            window.document.getElementById('newPrjNumberDiv').style.display = "none";
            window.document.getElementById('newPrjSubNumberDiv').style.display = "none";
            window.document.getElementById('prjCode').style.display = "block";
            // window.document.getElementById('prjCodeSet').style.display = "none";
            $scope.changeSubmitBtnStatus(false, "建立專案");
            // console.log('triggerChangePrjName');
            if (this.mainProject.selected.code === "") {
                //新總案case
                window.document.getElementById('newPrjNameDiv').style.display = "block";
                window.document.getElementById('setPrjCodeDiv').style.display = "none";
                Project.findPrjDistinctByName()
                    .success(function (prjs) {
                            console.log(JSON.stringify(prjs));
                            // 總案編號自動跳號 +1
                            $scope.mainProject.code = prjs.length + 1 > 10 ? prjs.length : "0" + (prjs.length);
                            $scope.mainProject.new = "";
                            $scope.year = new Date().getFullYear() - 1911;
                        }
                    );
                $scope.resetPrjNumber();
                //    自訂總案編號
            } else if (this.mainProject.selected.code === "9999") {
                window.document.getElementById('newPrjNameDiv').style.display = "block";
                window.document.getElementById('setPrjCodeDiv').style.display = "block";
                window.document.getElementById('prjCode').style.display = "none";
                // window.document.getElementById('prjCodeSet').style.display = "block";
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
                                year: $scope.year,
                                code: $scope.mainProject.code,
                            }

                            // *******撈專案*******
                            //loadProjectNumberByCode
                            Project.findPrjNumberByCodeGroupByNumber(data)
                                .success(function (prj) {
                                    // console.log(prj);
                                    var allNumberProject = [];
                                    for (var index = 0; index < prj.length; index ++) {
                                        allNumberProject.push({label: prj[index].prjName, value: prj[index].prjNumber});
                                    }
                                    allNumberProject.push({label: "新專案", value: ""});
                                    vm.prjNumbers = allNumberProject;
                                })
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
                        $scope.changeSubmitBtnStatus(true, "專案名稱已存在，請檢查！");
                    } else {
                        $scope.changeSubmitBtnStatus(false, "建立專案");
                    }
                })
        }

        // Code Check　自訂編號
        $scope.triggerChangePrjCode = function () {
            // console.log('triggerChangePrjNewName');
            if ($scope.mainProject.setCode.length !== 11) {
                $scope.changeSubmitBtnStatus(true, "請確認 自訂總案編號為 11 碼！");
                return;
            } else {
                $scope.changeSubmitBtnStatus(false, "建立專案");
            }

            var formData = {
                prjCode: $scope.mainProject.setCode,
            }
            Project.findPrjByCode(formData)
                .success(function (prj) {
                    // console.log(JSON.stringify(prj));
                    if (prj !== null) {
                        $scope.changeSubmitBtnStatus(true, "專案編號已存在，請檢查！");
                    } else {
                        // $scope.mainProject.code = $scope.mainProject.setCode;
                        $scope.changeSubmitBtnStatus(false, "建立專案");
                    }
                })
        }

        // Number Check 專案
        $scope.triggerChangePrjNumber = function() {
            this.mainProject.subNumber = null;
            this.mainProject.type = null;
            window.document.getElementById('newPrjNumberDiv').style.display = "none";
            window.document.getElementById('newPrjSubNumberDiv').style.display = "none";
            $scope.changeSubmitBtnStatus(false, "建立專案");
            if (this.mainProject.selected.code === "") {
                window.document.getElementById('newPrjNumberDiv').style.display = "block";
                //新總案，必新專案 00
                $scope.mainProject.number.code = "00";
                $scope.mainProject.numberNew = "";
                $scope.resetPrjSubNumber();
                return;
            }
            if (this.mainProject.number.selected.value === "") {
                //既有總案，新專案case
                window.document.getElementById('newPrjNumberDiv').style.display = "block";
                var data = {
                    year: $scope.year,
                    code: $scope.mainProject.code
                }
                console.log(data)
                Project.findPrjNumberDistinctByCode(data)
                    .success(function (prjs) {
                            console.log(JSON.stringify(prjs));
                            // 專案案編號自動跳號 +1
                            $scope.mainProject.number.code = prjs.length + 1 > 10 ? prjs.length : "0" + (prjs.length);
                            $scope.mainProject.numberNew = "";
                        }
                    );
                $scope.resetPrjSubNumber();
            } else {
                // 既有專案
                window.document.getElementById('newPrjNumberDiv').style.display = "none";
                $scope.mainProject.number.code = this.mainProject.number.selected.value;
                $scope.mainProject.numberNew = this.mainProject.number.selected.label;

                var data = {
                    year: $scope.year,
                    code: $scope.mainProject.code,
                    prjNumber: $scope.mainProject.number.code,
                }

                // *******撈子案*******
                //loadProjectSubNumberByNumber
                Project.findPrjSubNumberByNumber(data)
                    .success(function (prjs) {
                        // console.log(prjs);
                        var allSubNumberProject = [];
                        for (var index = 0; index < prjs.length; index ++) {
                            allSubNumberProject.push({label: prjs[index].prjSubName, value: prjs[index].prjSubNumber});
                        }
                        allSubNumberProject.push({label: "新子案", value: ""});
                        vm.prjSubNumbers = allSubNumberProject;
                    })
            }
        }

        // SubNumber Check 子案
        $scope.triggerChangePrjSubNumber = function() {
            this.mainProject.type = null;
            $scope.changeSubmitBtnStatus(false, "建立專案");
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
                var data = {
                    year: $scope.year,
                    code: $scope.mainProject.code,
                    prjNumber: $scope.mainProject.number.code,
                }
                Project.findPrjSubNumberDistinctByNumber(data)
                    .success(function (prjs) {
                            // console.log(JSON.stringify(prjs));
                            // 子案案編號自動跳號 +1
                            $scope.mainProject.subNumber.code = prjs.length + 1 > 10 ? prjs.length : "0" + (prjs.length);
                            $scope.mainProject.subNumberNew = "";
                        }
                    );
            } else {
                // 既有子案
                window.document.getElementById('newPrjSubNumberDiv').style.display = "none";
                $scope.mainProject.subNumber.code = this.mainProject.subNumber.selected.value;
                $scope.mainProject.subNumberNew = this.mainProject.subNumber.selected.label;
            }
        }

        // Type Check　類型
        $scope.triggerChangePrjType = function () {
            this.mainProject.techs = null;
            this.mainProject.manager = null;
            var data = {
                year: $scope.year,
                code: $scope.mainProject.code,
                prjNumber: $scope.mainProject.number.code,
                prjSubNumber: $scope.mainProject.subNumber.code,
                type: $scope.mainProject.type.selected.value,
            }
            Project.findPrjTypeBySubNumber(data)
                .success(function (projects) {
                        if (projects.length !== 0) {
                            $scope.changeSubmitBtnStatus(true, "此類型子案已存在，請檢察！");
                        } else {
                            $scope.changeSubmitBtnStatus(false, "建立專案");
                        }
                    }
                );
        }

        $scope.triggerChangePrjTechs = function () {
            if (this.mainProject.techs === undefined) {
                this.mainProject.techs = null;
            }
        }

        $scope.changeSubmitBtnStatus = function(isEnable, showText) {
            document[0].getElementById('prjSubmitBtn').disabled = isEnable;
            document[0].getElementById('prjSubmitBtn').innerText = showText;
        }

        // ----------------- CREATE ---------------

        $scope.createSubmit = function () {
            try {
                var prjTechs = [];
                for (var index = 0; index < $scope.mainProject.techs.length; index++) {
                    prjTechs[index] = $scope.mainProject.techs[index]._id;
                }
                var totalCode = "";
                if (window.document.getElementById('setPrjCodeDiv').style.display === 'block') {
                    console.log(123);
                    totalCode = $scope.mainProject.setCode;
                } else {
                    totalCode = vm.branch.value +
                        String($scope.year) +
                        String($scope.mainProject.code) +
                        String($scope.mainProject.number.code) +
                        String($scope.mainProject.subNumber.code) +
                        $scope.mainProject.type.selected.value;
                }
                var createData = {
                    branch: vm.branch.value,
                    year: String($scope.year),
                    code: String($scope.mainProject.code),
                    type: $scope.mainProject.type.selected.value,
                    mainName: $scope.mainProject.new,
                    // majorID: $scope.mainProject.manager._id,
                    managerID: $scope.mainProject.manager._id,
                    prjCode: totalCode,
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

