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
                var projectsSorted = [];
                // allProjects.push({mainName: "新總案", code: ""});
                // allProjects.push({mainName: "建立總案 (自訂編號)", code: "9999"});
                projectsSorted.push({mainName: "新總案", code: ""});
                projectsSorted.push({mainName: "建立總案 (自訂編號)", code: "9999"});
                for (var index = 0; index < allProjects.length; index ++) {
                    projectsSorted.push({
                        mainName: allProjects[index].mainName,
                        branch: allProjects[index].branch,
                        year: allProjects[index].year,
                        code: allProjects[index].code
                    });
                }
                vm.projects = projectsSorted;
                $scope.year = new Date().getFullYear() - 1911;
            });

        var vm = this;

        User.findTechs()
            .success(function (techs) {
                // console.log(JSON.stringify(techs));
                vm.techsItems = techs;
            })

        User.getAllUsers()
            .success(function (managers) {
                // console.log(JSON.stringify(managers));
                vm.managersItem = managers;
            })

        vm.prjTypes = [
            // {label: '規劃-0', type: '0'},
            // 1.設計
            // 2.監造
            // 3.規劃
            // 4.專管
            // 5.總案
            // 6.服務
            // 7.行政
            // 8.(空白)
            // 9.其他
            {label: '設計-1', value: '1'},
            {label: '監造-2', value: '2'},
            {label: '規劃-3', value: '3'},
            {label: '專管-4', value: '4'},
            {label: '總案-5', value: '5'},
            {label: '服務-6', value: '6'},
            {label: '行政-7', value: '7'},
            {label: '投標-8', value: '8'},
            {label: '其他-9', value: '9'},
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

        //Prj Name Check whether is new or not.　”總案名稱“變更
        $scope.triggerChangeMainProject = function () {
            this.mainProject.number = null;
            this.mainProject.subNumber = null;
            this.mainProject.type = null;
            window.document.getElementById('newPrjNumberDiv').style.display =  "none";
            window.document.getElementById('newPrjSubNumberDiv').style.display = "none";
            window.document.getElementById('prjCode').style.visibility = "inherit";
            // window.document.getElementById('prjCodeSet').style.display = "none";
            $scope.changeSubmitBtnStatus(false, "建立專案");
            // console.log('triggerChangePrjName');
            if (this.mainProject.selected.code === "") {
                //新總案case
                window.document.getElementById('newPrjNameDiv').style.display = "block";
                window.document.getElementById('setPrjCodeDiv').style.display = "none";
                Project.findPrjDistinctByCode()
                    .success(function (prjs) {
                            console.log(JSON.stringify(prjs));
                            console.log(prjs.length);
                            // 總案編號自動跳號 +1
                            $scope.mainProject.code = prjs.length >= 10 ? prjs.length + 1 : "0" + (prjs.length);
                            $scope.mainProject.new = "";
                            $scope.year = new Date().getFullYear() - 1911;
                        }
                    );
                $scope.resetPrjNumber();
                //    自訂總案編號
            } else if (this.mainProject.selected.code === "9999") {
                window.document.getElementById('newPrjNameDiv').style.display = "block";
                window.document.getElementById('setPrjCodeDiv').style.display = "block";
                window.document.getElementById('prjCode').style.visibility  = "hidden";
                // window.document.getElementById('prjCodeSet').style.display = "block";
                $scope.mainProject.setCode = "";
                $scope.mainProject.new = "";
                $scope.resetPrjNumber();
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
                            console.log(JSON.stringify(prj));

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
                        $scope.triggerChangePrjCode();
                    }
                })
        }

        // Code Check　自訂編號
        $scope.triggerChangePrjCode = function () {
            // console.log('triggerChangePrjNewName');

            if (this.mainProject.selected.code === "9999") {
                if ($scope.mainProject.setCode.length !== 10) {
                    $scope.changeSubmitBtnStatus(true, "請確認 自訂總案編號為 10 碼！");
                    return;
                } else {
                    $scope.changeSubmitBtnStatus(false, "建立專案");
                }

                console.log(vm.branch);
                if (vm.branch === undefined) {
                    $scope.changeSubmitBtnStatus(true, "請確認 分支主題，再次輸入總案編號！");
                    return;
                }

                var formData = {
                    prjCode: vm.branch.value + String($scope.mainProject.setCode.substring(0,10))
                }
                console.log(formData);
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

        }

        // Number Check 專案
        $scope.triggerChangePrjNumber = function() {
            this.mainProject.subNumber = null;
            this.mainProject.type = null;
            window.document.getElementById('newPrjNumberDiv').style.display = "none";
            window.document.getElementById('newPrjSubNumberDiv').style.display = "none";
            $scope.changeSubmitBtnStatus(false, "建立專案");
            $scope.triggerChangePrjCode();
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
                Project.findPrjNumberDistinctByPrjNumber(data)
                    .success(function (prjs) {
                            console.log(JSON.stringify(prjs));
                            // 專案案編號自動跳號 +1
                            $scope.mainProject.number.code = prjs.length >= 10 ? prjs.length +1 : "0" + (prjs.length);
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
            $scope.triggerChangePrjCode();
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
                            $scope.mainProject.subNumber.code = prjs.length >= 10 ? prjs.length + 1 : "0" + (prjs.length);
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
            console.log(data);
            Project.findPrjTypeBySubNumber(data)
                .success(function (projects) {
                        if (projects.length !== 0) {
                            $scope.changeSubmitBtnStatus(true, "此類型子案已存在，請檢察！");
                        } else {
                            $scope.changeSubmitBtnStatus(false, "建立專案");
                            $scope.triggerChangePrjCode();
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
                    //自訂專案
                    totalCode = $scope.mainProject.setCode;
                    var createData = {
                        branch: vm.branch.value,
                        year: String(totalCode.substring(0,3)),
                        code: String(totalCode.substring(3,5)),
                        type: String(totalCode.substring(9,10)),
                        mainName: $scope.mainProject.new,
                        // majorID: $scope.mainProject.manager._id,
                        managerID: $scope.mainProject.manager._id,
                        prjCode: vm.branch.value + String(totalCode.substring(0,10)),
                        technician: prjTechs,
                        // endDate: req.body.prjEndDate,
                        prjNumber: String(totalCode.substring(5,7)),
                        prjName: $scope.mainProject.numberNew,
                        prjSubNumber: String(totalCode.substring(7,9)),
                        prjSubName: $scope.mainProject.subNumberNew,
                    }
                } else {
                    totalCode = vm.branch.value +
                        String($scope.year) +
                        String($scope.mainProject.code) +
                        String($scope.mainProject.number.code) +
                        String($scope.mainProject.subNumber.code) +
                        $scope.mainProject.type.selected.value;

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
                }
            } catch (err) {
                toastr['warning']('輸入資訊未完整 !', '建立失敗');
                return;
            }
            $scope.changeSubmitBtnStatus(true, "建立專案中，請稍待！");
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

