/**
 * @author Ichen.chu
 * created on 15.10.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('transferProjectCtrl',
            [
                '$scope',
                'toastr',
                '$cookies',
                '$filter',
                '$compile',
                '$timeout',
                '$window',
                'ngDialog',
                'User',
                'Project',
                'ProjectUtil',
                'PaymentFormsUtil',
                'bsLoadingOverlayService',
                TransferProjectCtrl
            ])

    /** @ngInject */
    function TransferProjectCtrl($scope,
                             toastr,
                             $cookies,
                             $filter,
                             $compile,
                             $timeout,
                             window,
                             ngDialog,
                             User,
                             Project,
                             ProjectUtil,
                             PaymentFormsUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;

        Project.findAllEnable()
            .success(function (allProjects) {

                console.log(allProjects);

                $scope.allProject_raw = allProjects;

                $scope.allProjectCache = [];
                var prjCount = allProjects.length;
                for (var index = 0; index < prjCount; index++) {

                    // 專案名稱顯示規則 2019/07 定義
                    var nameResult = "";
                    if (allProjects[index].prjSubName != undefined && allProjects[index].prjSubName.trim() != "") {
                        nameResult = allProjects[index].prjSubName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    } else if (allProjects[index].prjName != undefined && allProjects[index].prjName.trim() != "") {
                        nameResult = allProjects[index].prjName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    } else {
                        nameResult = allProjects[index].mainName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    }

                    $scope.allProjectCache[index] = {
                        prjDID: allProjects[index]._id,
                        prjCode: allProjects[index].prjCode,
                        mainName: allProjects[index].mainName + " - "
                        + allProjects[index].prjName + " - "
                        + allProjects[index].prjSubName + " - "
                        + ProjectUtil.getTypeText(allProjects[index].type),
                        majorID: allProjects[index].majorID,
                        managerID: allProjects[index].managerID,
                        ezName: nameResult,
                        combinedID: allProjects[index].combinedID,
                    };
                }
            });

        Project.findAllByGroup()
            .success(function (allProjectsByGroup) {
                console.log(allProjectsByGroup);
                var projectsSorted = [];
                // allProjects.push({mainName: "新總案", code: ""});
                // allProjects.push({mainName: "建立總案 (自訂編號)", code: "9999"});
                projectsSorted.push({mainName: "新總案", code: ""});
                projectsSorted.push({mainName: "建立總案 (自訂編號)", code: "9999"});
                for (var index = 0; index < allProjectsByGroup.length; index ++) {
                    projectsSorted.push({
                        mainName: allProjectsByGroup[index].mainName,
                        branch: allProjectsByGroup[index].branch,
                        year: allProjectsByGroup[index].year,
                        code: allProjectsByGroup[index].code
                    });
                }
                vm.projectsByGroup = projectsSorted;
                $scope.year = new Date().getFullYear() - 1911;
            });

        $scope.initProject = function() {
            Project.findAllEnable()
                .success(function (allProjects) {
                    // console.log(allProjects);
                    vm.projects = allProjects.slice();
                });
        }

        $scope.resetProjectData = function() {
            vm.projects = $scope.allProject_raw.slice();
        }

        $scope.initProject();

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        $scope.showPrjCode = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].prjCode : 'Not Set';
        };

        $scope.showProjectManager = function (prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID
                });
            }
            if (majorSelected == undefined) return 'Not Set';
            var managerDID = majorSelected[0].managerID;
            var selected = [];
            if (managerDID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: managerDID
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].name : 'Not Set';
        };

        $scope.showUser = function (userDID) {
            var selected = [];
            if (vm.users === undefined) return;
            if (userDID) {
                selected = $filter('filter')(vm.users, {
                    _id: userDID,
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        $scope.isSamePrj = false;

        var A_prjID = "";
        var B_prjID = "";

        $scope.checkProject_transfer = function (prj_id, index) {

            switch (index) {
                case 1:
                    A_prjID = prj_id;
                    break;
                case 2:
                    B_prjID = prj_id;
                    break;
            }

            if (A_prjID == B_prjID) {
                $scope.isSamePrj = true;
            } else {
                $scope.isSamePrj = false;
            }

        }


        // =========== 合併專案設定 ============

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

        $scope.resetPrjNumber_transfer = function() {
            vm.prjNumbers = [
                {label: "新專案", value: ""},
            ];
        }

        $scope.resetPrjNumber_transfer();

        $scope.resetPrjSubNumber_transfer = function() {
            vm.prjSubNumbers = [
                {label: '新子案', value: ""},
            ];
        }

        $scope.resetPrjSubNumber_transfer();

        vm.prjBranch = [
            {label: 'P-投標-服務建議書', value: 'P'},
            {label: 'C-已成案', value: 'C'},
        ];

        $scope.showPrjBranch_transfer = function (branch) {

            var selected = [];
            if (branch) {
                selected = $filter('filter')(vm.prjBranch, {
                    value: branch,
                });
            }
            return selected[0];
        }

        // ********* Logic Biz **********

        //Prj Name Check whether is new or not.　”總案名稱“變更
        $scope.triggerChangeMainProject_transfer = function () {
            vm.mainProject.number = null;
            vm.mainProject.subNumber = null;
            vm.mainProject.type = null;
            $('.tab-pane').find('#newPrjNumberDiv')[1].style.display =  "none";
            $('.tab-pane').find('#newPrjSubNumberDiv')[1].style.display =  "none";
            $('.tab-pane').find('#prjCode')[1].style.visibility =  "inherit";
            $scope.changeSubmitBtnStatus_transfer(false, "專案轉換");
            // console.log('triggerChangePrjName');
            if (vm.mainProject.selected.code === "") {
                //新總案case
                $('.tab-pane').find('#newPrjNameDiv')[1].style.display =  "block";
                $('.tab-pane').find('#setPrjCodeDiv')[1].style.display =  "none";
                Project.findPrjDistinctByCode()
                    .success(function (prjs) {
                            console.log(JSON.stringify(prjs));
                            console.log(prjs.length);
                            // 總案編號自動跳號 +1
                            vm.mainProject.code = prjs.length >= 10 ? prjs.length + 1 : "0" + (prjs.length);
                            vm.mainProject.newProjectName = "";
                            $scope.year = new Date().getFullYear() - 1911;
                        }
                    );
                $scope.resetPrjNumber_transfer();
                //    自訂總案編號
            } else if (vm.mainProject.selected.code === "9999") {
                $('.tab-pane').find('#newPrjNameDiv')[1].style.display =  "block";
                $('.tab-pane').find('#setPrjCodeDiv')[1].style.display =  "block";
                $('.tab-pane').find('#prjCode')[1].style.visibility =  "hidden";
                vm.mainProject.setCode = "";
                vm.mainProject.newProjectName = "";
                $scope.resetPrjNumber_transfer();
            } else {
                // 專案已存在
                vm.mainProject.newProjectName = vm.mainProject.selected.mainName;
                $('.tab-pane').find('#newPrjNameDiv')[1].style.display =  "none";
                $('.tab-pane').find('#setPrjCodeDiv')[1].style.display =  "none";
                var data = {
                    name: vm.mainProject.selected.mainName
                }
                Project.findPrjByName(data)
                    .success(function (prj) {
                            // console.log(JSON.stringify(prj));
                            console.log(prj);
                            vm.mainProject.code = prj.code;
                            $scope.year = prj.year;
                            vm.branch = $scope.showPrjBranch_transfer(prj.branch);

                            var data = {
                                year: $scope.year,
                                code: vm.mainProject.code,
                            }

                            // *******撈專案*******
                            //loadProjectNumberByCode
                            Project.findPrjNumberByCodeGroupByNumber(data)
                                .success(function (subProject) {
                                    console.log(subProject);
                                    var allNumberProject = [];
                                    for (var index = 0; index < subProject.length; index ++) {
                                        allNumberProject.push({
                                            label: subProject[index].prjName,
                                            value: subProject[index].prjNumber
                                        });
                                    }
                                    allNumberProject.push({label: "新專案", value: ""});
                                    vm.prjNumbers = allNumberProject;
                                })
                        }
                    );
            }
        }

        // Name Check　新總案名稱
        $scope.triggerChangePrjNewName_transfer = function (name) {
            // console.log('triggerChangePrjNewName');
            var data = {
                name: vm.mainProject.newProjectName
            }
            Project.findPrjByName(data)
                .success(function (prj) {
                    // console.log(JSON.stringify(prj));
                    if (prj !== null) {
                        $scope.changeSubmitBtnStatus_transfer(true, "專案名稱已存在，請檢查！");
                    } else {
                        $scope.changeSubmitBtnStatus_transfer(false, "專案轉換");
                        $scope.triggerChangePrjCode_transfer();
                    }
                })
        }

        // Code Check　自訂編號
        $scope.triggerChangePrjCode_transfer = function () {
            // console.log('triggerChangePrjNewName');

            if (vm.mainProject.selected.code === "9999") {
                if (vm.mainProject.setCode.length !== 10) {
                    $scope.changeSubmitBtnStatus_transfer(true, "請確認 自訂總案編號為 10 碼！");
                    return;
                } else {
                    $scope.changeSubmitBtnStatus_transfer(false, "專案轉換");
                }

                if (vm.branch === undefined) {
                    $scope.changeSubmitBtnStatus_transfer(true, "請確認 分支主題，再次輸入總案編號！");
                    return;
                }

                var formData = {
                    prjCode: vm.branch.value + String(vm.mainProject.setCode.substring(0,10))
                }
                console.log(formData);
                Project.findPrjByCode(formData)
                    .success(function (prj) {
                        // console.log(JSON.stringify(prj));
                        if (prj !== null) {
                            $scope.changeSubmitBtnStatus_transfer(true, "專案編號已存在，請檢查！");
                        } else {
                            $scope.changeSubmitBtnStatus_transfer(false, "專案轉換");
                        }
                    })
            }

        }

        // Number Check 專案
        $scope.triggerChangePrjNumber_transfer = function() {
            console.log(vm);
            vm.mainProject.subNumber = null;
            vm.mainProject.type = null;
            $('.tab-pane').find('#newPrjNumberDiv')[1].style.display =  "none";
            $('.tab-pane').find('#newPrjSubNumberDiv')[1].style.display =  "none";
            $scope.changeSubmitBtnStatus_transfer(false, "專案轉換");
            $scope.triggerChangePrjCode_transfer();
            if (vm.mainProject.selected.code === "") {
                $('.tab-pane').find('#newPrjNumberDiv')[1].style.display =  "block";
                //新總案，必新專案 00
                vm.mainProject.number.code = "00";
                vm.mainProject.numberNew = "";
                $scope.resetPrjSubNumber_transfer();
                return;
            }
            if (vm.mainProject.number.selected.value === "") {
                //既有總案，新專案case
                $('.tab-pane').find('#newPrjNumberDiv')[1].style.display =  "block";
                var data = {
                    year: $scope.year,
                    code: vm.mainProject.selected.code
                }
                console.log(data);
                Project.findPrjNumberDistinctByPrjNumber(data)
                    .success(function (prjs) {
                            console.log(JSON.stringify(prjs));
                            // 專案案編號自動跳號 +1
                            vm.mainProject.number.code = prjs.length > 10 ? prjs.length + 1  : "0" + (prjs.length);
                            vm.mainProject.numberNew = "";
                        }
                    );
                $scope.resetPrjSubNumber_transfer();
            } else {
                // 既有專案
                $('.tab-pane').find('#newPrjNumberDiv')[1].style.display =  "none";

                vm.mainProject.number.code = vm.mainProject.number.selected.value;
                vm.mainProject.numberNew = vm.mainProject.number.selected.label;

                var data = {
                    year: $scope.year,
                    code: vm.mainProject.selected.code,
                    prjNumber: vm.mainProject.number.selected.value,
                }

                // *******撈子案*******
                //loadProjectSubNumberByNumber
                Project.findPrjSubNumberByNumber(data)
                    .success(function (subPrjs) {
                        console.log(subPrjs);
                        var allSubNumberProject = [];
                        for (var index = 0; index < subPrjs.length; index ++) {
                            allSubNumberProject.push({
                                label: subPrjs[index].prjSubName,
                                value: subPrjs[index].prjSubNumber
                            });
                        }
                        allSubNumberProject.push({label: "新子案", value: ""});
                        vm.prjSubNumbers = allSubNumberProject;
                    })
            }
        }

        // SubNumber Check 子案
        $scope.triggerChangePrjSubNumber_transfer = function() {
            vm.mainProject.type = null;
            $scope.changeSubmitBtnStatus_transfer(false, "專案轉換");
            $scope.triggerChangePrjCode_transfer();
            if (vm.mainProject.number.selected.value === "") {
                $('.tab-pane').find('#newPrjSubNumberDiv')[1].style.display =  "block";
                //新專案，必新子案 00
                vm.mainProject.subNumber.code = "00";
                vm.mainProject.subNumberNew = "";
                return;
            }
            if (vm.mainProject.subNumber.selected.value === "") {
                //既有專案，新子案case
                $('.tab-pane').find('#newPrjSubNumberDiv')[1].style.display =  "block";
                var data = {
                    year: $scope.year,
                    code: vm.mainProject.selected.code,
                    prjNumber: vm.mainProject.number.code,
                }
                Project.findPrjSubNumberDistinctByNumber(data)
                    .success(function (prjs) {
                            // console.log(JSON.stringify(prjs));
                            // 子案案編號自動跳號 +1
                            vm.mainProject.subNumber.code = prjs.length >= 10 ? prjs.length + 1 : "0" + (prjs.length);
                            vm.mainProject.subNumberNew = "";
                        }
                    );
            } else {
                // 既有子案
                $('.tab-pane').find('#newPrjSubNumberDiv')[1].style.display =  "none";
                vm.mainProject.subNumber.code = vm.mainProject.subNumber.selected.value;
                vm.mainProject.subNumberNew = vm.mainProject.subNumber.selected.label;
            }
        }

        // Type Check　類型
        $scope.triggerChangePrjType_transfer = function () {
            vm.mainProject.techs = null;
            vm.mainProject.manager = null;
            var data = {
                year: $scope.year,
                code: vm.mainProject.selected.code,
                prjNumber: vm.mainProject.number.code,
                prjSubNumber: vm.mainProject.subNumber.code,
                type: vm.mainProject.type.selected.value,
            }
            Project.findPrjTypeBySubNumber(data)
                .success(function (projects) {
                        if (projects.length !== 0) {
                            $scope.changeSubmitBtnStatus_transfer(true, "此類型子案已存在，請檢察！");
                        } else {
                            $scope.changeSubmitBtnStatus_transfer(false, "專案轉換");
                            $scope.triggerChangePrjCode_transfer();
                        }
                    }
                );
        }

        $scope.triggerChangePrjTechs_transfer = function () {
            if (vm.mainProject.techs === undefined) {
                vm.mainProject.techs = null;
            }
        }

        $scope.changeSubmitBtnStatus_transfer = function(isDisable, showText) {
            $('.tab-pane').find('#prjSubmitBtn')[1].disabled = isDisable;
            $('.tab-pane').find('#prjSubmitBtn')[1].innerText = showText;
        }

        // ----------------- CREATE ---------------

        $scope.transferSubmit = function () {
            try {
                var prjTechs = [];
                for (var index = 0; index < vm.mainProject.techs.length; index++) {
                    prjTechs[index] = vm.mainProject.techs[index]._id;
                }
                var totalCode = "";
                if ($('.tab-pane').find('#setPrjCodeDiv')[1].style.display === 'block') {
                    //自訂專案
                    totalCode = vm.mainProject.setCode;
                    var transferData = {
                        prjA: A_prjID,
                        // prjB: B_prjID,

                        branch: vm.branch.value,
                        year: String(totalCode.substring(0,3)),
                        code: String(totalCode.substring(3,5)),
                        type: String(totalCode.substring(9,10)),
                        mainName: vm.mainProject.newProjectName,
                        managerID: vm.mainProject.manager._id,
                        prjCode: vm.branch.value + String(totalCode.substring(0,10)),
                        technician: prjTechs,
                        prjNumber: String(totalCode.substring(5,7)),
                        prjName: vm.mainProject.numberNew,
                        prjSubNumber: String(totalCode.substring(7,9)),
                        prjSubName: vm.mainProject.subNumberNew,
                    }
                } else {
                    totalCode = vm.branch.value +
                        String($scope.year) +
                        String(vm.mainProject.code) +
                        String(vm.mainProject.number.code) +
                        String(vm.mainProject.subNumber.code) +
                        vm.mainProject.type.selected.value;

                    var transferData = {
                        prjA: A_prjID,
                        // prjB: B_prjID,

                        branch: vm.branch.value,
                        year: String($scope.year),
                        code: String(vm.mainProject.code),
                        type: vm.mainProject.type.selected.value,
                        mainName: vm.mainProject.newProjectName,
                        managerID: vm.mainProject.manager._id,
                        prjCode: totalCode,
                        technician: prjTechs,
                        prjNumber: vm.mainProject.number.code,
                        prjName: vm.mainProject.numberNew,
                        prjSubNumber: vm.mainProject.subNumber.code,
                        prjSubName: vm.mainProject.subNumberNew,
                    }
                }
            } catch (err) {
                toastr['warning']('輸入資訊未完整 !', '建立失敗');
                return;
            }
            console.log(transferData);
            $scope.changeSubmitBtnStatus_transfer(true, "專案轉換中，請稍待！");
            Project.transferProject(transferData)
                .success(function (res) {
                    if (res.code == 200) {
                        window.location.reload();
                    }
                })
                .error(function (res) {
                    console.log('createSubmit  error');
                    // toastr['warning']('輸入資訊未完整 !', '建立失敗');
                })
        }

    }
})();


