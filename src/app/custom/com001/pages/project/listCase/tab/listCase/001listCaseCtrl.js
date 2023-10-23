(function () {
    'use strict';

    // createDate: 2023/07/13
    angular.module('BlurAdmin.pages.001.Project')
        .controller('_001_listCaseCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            '$compile',
            'toastr',
            'User',
            '$timeout',
            'bsLoadingOverlayService',
            '_001_Institute',
            '_001_ProjectContract',
            '_001_ProjectCase',
            '_001_Project',
            '_001_CaseTask',
            listCase
        ])
        .filter('thousandSeparator', function() {
            return function(input) {
                if (input) {
                    // 移除非數字字元
                    input = input.replace(/\D/g, "");

                    // 格式化為千元格式
                    input = Number(input).toLocaleString("en-US");
                }
                return input;
            };
        });

    /** @ngInject */
    function listCase($scope,
                      cookies,
                      window,
                      $filter,
                      $compile,
                      toastr,
                      User,
                      $timeout,
                      bsLoadingOverlayService,
                      _001_Institute,
                      _001_ProjectContract,
                      _001_ProjectCase,
                      _001_Project,
                      _001_CaseTask) {

        $scope.username = cookies.get('username');
        $scope.isDepG = cookies.get('isDepG') == "false" ? false : true;

        var roleType = cookies.get('roletype');

        var loadingReferenceId = 'mainPage_001listCase'

        var vm = this;

        $scope.init = function() {
            console.log("init")
            // 機關
            _001_Institute.findAll()
                .success(function (resp) {
                    vm.instituteOptions = resp;
                })

            // 辦理階段項目
            _001_CaseTask.findAllEnable()
                .success(function (resp) {
                    $scope.processStages_Enable = resp;
                })

            _001_CaseTask.findAll()
                .success(function (resp) {
                    console.log(resp);
                    $scope.processStages_All = resp;
                })
        }

        $scope.changeInstitute = function(institute) {
            vm.filter.projectContract = null;
            vm.filter.projectCase = null;
            vm.filter.projectType = null;

            prjTypeOptionsCanSelect = [];
            prjTypeOptionsList = [];

            // 契約
            _001_ProjectContract.findByInstituteDID({
                instituteDID: institute._id
            })
            .success(function (resp) {
                vm.contractOptions = resp;
            })
        }

        // 單選契約
        $scope.changeContract = function(projectContract, institute) {
            vm.filter.projectCase = null;
            vm.filter.projectType = null;

            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: loadingReferenceId
                });
            }, 100);

            vm.filter.projectCase = null;
            // 工程
            _001_ProjectCase.findByContractDIDAndInstituteDID({
                contractDID: projectContract._id,
                instituteDID: institute._id
            })
            .success(function (resp) {
                vm.caseOptions = resp;
                vm.caseOptionsAll = resp;

                $scope.cachedTable = resp;
                $scope.showCaseTable(resp);
                $timeout(function () {
                    bsLoadingOverlayService.stop({
                        referenceId: loadingReferenceId
                    });
                }, 500)
            })
            .error(function (err) {
                $timeout(function () {
                    bsLoadingOverlayService.stop({
                        referenceId: loadingReferenceId
                    });
                }, 500)
            })
        }


        // 變更工程
        $scope.changeCase = function(projectCase) {
            console.log(projectCase);
            vm.filter.projectType = null;

            _001_ProjectCase.findByCaseDID({
                caseDID: projectCase._id
            })
            .success(function (resp) {
                $scope.cachedTable = resp;
                $scope.showCaseTable(resp);
            })
        }

        // 變更類型
        $scope.changeType = function(vm) {
            if (vm.filter.projectCase == null) {
                _001_Project.findAllByOneContractWithOneType({
                    contractDID: vm.filter.projectContract._id,
                    type: vm.filter.projectType.value
                })
                .success(function (resp) {
                    $scope.cachedTable = resp;
                    $scope.showCaseTable(resp, true);
                })
            } else {
                _001_Project.findOneCaseWithOneType({
                    caseDID: vm.filter.projectCase._id,
                    type: vm.filter.projectType.value
                })
                .success(function (resp) {
                    $scope.cachedTable = resp;
                    $scope.showCaseTable(resp, true);
                })
            }
        }

        $scope.init();

        $scope.showCaseTable = function (caseData, notFreshType) {
            if (!notFreshType) {
                prjTypeOptionsCanSelect = [];
                prjTypeOptionsList = [];
            }
            // caseData.forEach(function (projectCase) {
            //     $scope.checkProjectType(projectCase.type);
            //     projectCase.caseName = $scope.getProjectCase(projectCase.caseDID).name;
            //     projectCase.caseCode = $scope.getProjectCase(projectCase.caseDID).code;
            //
            //     projectCase.typeName = $scope.getProjectType(projectCase.type).label;
            // })

            vm.prjTypeOptionsAll = prjTypeOptionsCanSelect;
            $scope.tableData = caseData;
            angular.element(
                document.getElementById('includeHead_listCase'))
                .html($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'工程列表 - " + caseData.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/custom/com001/pages/project/listCase/tab/listCase/table/listCaseTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));
        }


        $scope.showCaseInformation = function (prjCase) {

            if (prjCase.needRefresh || prjCase.needRefresh == undefined) {
                _001_Project.findOneCaseWithAllType({
                    caseDID: prjCase._id
                })
                .success(function (resp) {
                    prjCase.needRefresh = false;
                    prjCase.prjUnits = resp;
                    // $scope.showTable(resp);

                    prjCase.prjUnits.forEach(function (project) {

                        // project.instituteName = $scope.getInstitute(project.instituteDID).name;
                        // project.instituteCode = $scope.getInstitute(project.instituteDID).code;

                        // project.contractName = $scope.getProjectContract(project.contractDID).name;
                        // project.contractCode = $scope.getProjectContract(project.contractDID).code;

                        // project.caseName = $scope.getProjectCase(project.caseDID).name;
                        // project.caseCode = $scope.getProjectCase(project.caseDID).code;

                        project.typeName = $scope.getProjectType(project.type).label;
                        $scope.checkRowSpan(project);
                        // project.prjManager = $scope.showPrjManager(project);

                    })
                })
            }
        }

        $scope.checkRowSpan = function(project) {
            project.rowSpan = 1;
            if (project.unitMemoByCase != undefined) {
                project.rowSpan = project.unitMemoByCase.length + 1;
                $scope.checkIsBilled(project.unitMemoByCase, project);
            }
        }

        $scope.checkIsBilled = function (memos, project) {
            var isBilled = true;
            memos.forEach(function (memo) {
                if (!memo.is_bill_count) {
                    isBilled = false;
                }
            })
            if (memos.length == 0) {
                isBilled = false;
            }
            project.canChangeEnable = isBilled;

            console.log("checkIsBilled:> " + isBilled);
            if (!isBilled) {
                try {
                    var formData = {
                        _id: project._id,
                        enable: true,
                        viewable: true,
                    }
                    _001_Project.updateOneUnit(formData)
                        .success(function (res) {
                            project.enable = true;
                            project.viewable = true;
                        })
                        .error(function () {
                        })
                } catch (err) {
                    // toastr['warning']('變更專案 !', '更新失敗');
                    return;
                }
            }


        }

        // ****** options *******
        var prjTypeOptionsCanSelect = [];
        var prjTypeOptionsList = [];

        $scope.checkProjectType = function (type) {
            if (!prjTypeOptionsList.includes(type)) {
                switch (type) {
                    case '1':
                        prjTypeOptionsCanSelect.push(
                            {label: '設計', value: '1'}
                        );
                        break;
                    case '2':
                        prjTypeOptionsCanSelect.push(
                            {label: '監造', value: '2'}
                        );
                        break;
                    case '3':
                        prjTypeOptionsCanSelect.push(
                            {label: '規劃', value: '3'}
                        );
                        break;
                    case '4':
                        prjTypeOptionsCanSelect.push(
                            {label: '專管', value: '4'}
                        );
                        break;
                    case '5':
                        prjTypeOptionsCanSelect.push(
                            {label: '管理', value: '5'}
                        );
                        break;
                    case '6':
                        prjTypeOptionsCanSelect.push(
                            {label: '投標', value: '6'}
                        );
                        break;
                    case '7':
                        prjTypeOptionsCanSelect.push(
                            {label: '其他', value: '7'}
                        );
                        break;
                }
                prjTypeOptionsList.push(type);
            }
        }

        var prjTypeOptionsAll = [
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

        var emptyObject = {
            name: "Can not find",
            code: "Can not find",
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
                selected = $filter('filter')(prjTypeOptionsAll, {
                    value: type,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        // Deprecated
        $scope.updateCase = function (prjCase) {
            console.log(prjCase);
            var ts = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

            try {
                var formData = {
                    _id: prjCase._id,
                    caseMemo: prjCase.caseMemo,

                    position: prjCase.position, // 工程地點
                    caseBoss: prjCase.caseBoss, // 承辦機關
                    approved_mount: prjCase.approved_mount, // 核定金額
                    date_1: prjCase.date_1, // date_1
                    date_2: prjCase.date_2, // 細設日期
                    date_3: prjCase.date_3, // 決標日期
                    date_3_mount: prjCase.date_3_mount, // 決標金額
                    date_4: prjCase.date_4, // 變更日期
                    date_5: prjCase.date_5, // 請款日期
                    payType_1: prjCase.payType_1,
                    payType_2: prjCase.payType_2,
                    payType_3: prjCase.payType_3,
                    payType_4: prjCase.payType_4,
                    pay_mount: prjCase.pay_mount,
                    is_bill_apply: prjCase.is_bill_apply,
                    is_bill_count: prjCase.is_bill_count,

                    userUpdateTs: ts,
                    // updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                }
                _001_ProjectCase.updateOneCaseInfo(formData)
                    .success(function (res) {
                        prjCase.userUpdateTs = ts;
                        toastr['success'](prjCase.name, '更新成功');
                    })
                    .error(function () {
                        toastr['warning']('儲存失敗 !', '更新失敗');
                    })

                // if (prjCase.prjUnits.length > 0) {
                //
                //     var formData_sub = {
                //         units: prjCase.prjUnits,
                //         userUpdateTs: ts,
                //     }
                //     _001_Project.updateMultiUnit(formData_sub)
                //         .success(function (res) {
                //             // item.userUpdateTs = ts;
                //             toastr['success'](prjCase.name, '專案更新成功');
                //         })
                //         .error(function () {
                //             // toastr['warning']('儲存失敗 !', '更新失敗');
                //         })
                // }
            } catch (err) {
                toastr['warning']('變更工程 !', '更新失敗');
                return;
            }
        }


        $scope.changePrjUnitStatus = function (prjUnit) {
            var ts = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

            var formData = {
                _id: prjUnit._id,
                enable: prjUnit.enable,
                userUpdateTs: ts,
            }

            if (prjUnit.enable) {
                formData = {
                    _id: prjUnit._id,
                    enable: prjUnit.enable,
                    viewable: true,
                    userUpdateTs: ts,
                }
            }

            _001_Project.updateOneUnit(formData)
                .success(function (res) {
                    prjUnit.userUpdateTs = ts;
                    if (prjUnit.enable) {
                        prjUnit.viewable = true;
                    }
                    // $scope.checkRowSpan(prjUnit);
                    toastr['success'](prjUnit.name, '更新成功');
                })
                .error(function () {
                    // toastr['warning']('儲存失敗 !', '更新失敗');
                })
        }

        $scope.changePrjUnitIsCanView = function (prjUnit) {
            var ts = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

            var formData = {
                _id: prjUnit._id,
                viewable: prjUnit.viewable,
                userUpdateTs: ts,
            }
            _001_Project.updateOneUnit(formData)
                .success(function (res) {
                    prjUnit.userUpdateTs = ts;
                    // $scope.checkRowSpan(prjUnit);
                    toastr['success'](prjUnit.name, '更新成功');
                })
                .error(function () {
                    // toastr['warning']('儲存失敗 !', '更新失敗');
                })
        }

        // Deprecated
        $scope.insertCaseMemo = function (prjCase) {

            if (prjCase.caseMemo == undefined) {
                prjCase.caseMemo = [{
                    // field_1: "0",
                    data3_ext: moment(new Date()).format("YYYY/MM/DD"),
                    data5_ext: moment(new Date()).format("YYYY/MM/DD"),
                    data6_ext: moment(new Date()).format("YYYY/MM/DD"),
                }];
            } else {
                prjCase.caseMemo.push({
                    data3_ext: moment(new Date()).format("YYYY/MM/DD"),
                    data5_ext: moment(new Date()).format("YYYY/MM/DD"),
                    data6_ext: moment(new Date()).format("YYYY/MM/DD"),
                })
            }

            var formData = {
                _id: prjCase._id,
                caseMemo: prjCase.caseMemo,
                userUpdateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
            }

            _001_ProjectCase.updateOneCaseInfo(formData)
                .success(function (res) {
                    toastr['success'](prjCase.name, '新增成功');
                })
                .error(function () {
                    toastr['warning']('儲存失敗 !', '更新失敗');
                })
        }

        $scope.showUnitProcessStage = function (prjUnit) {
            var resultString = "沒有辦理項目";
            if (prjUnit.unitMemo.length > 0) {
                // console.log(prjUnit.unitMemo[prjUnit.unitMemo.length - 1]);
                resultString = $scope.showProcessStageName(prjUnit.unitMemo[prjUnit.unitMemo.length - 1].processStageUUID);
            }
            return resultString;
        }


        $scope.insertPrjUnitMemoInCase = function (prjUnit, PrjCase) {
            var ts = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
            if (prjUnit.unitMemoByCase == undefined) {
                prjUnit.unitMemoByCase = [{}];
            } else {
                prjUnit.unitMemoByCase.push({});
            }

            try {
                var formData = {
                    _id: prjUnit._id,
                    enable: true,
                    viewable: true,
                    unitMemoByCase: prjUnit.unitMemoByCase,
                }
                _001_Project.updateOneUnit(formData)
                    .success(function (res) {
                        prjUnit.userUpdateTs = ts;
                        $scope.checkRowSpan(prjUnit);
                        toastr['success'](prjUnit.code, '更新成功');
                        toastr['success'](prjUnit.code + "因新增項目，故尚未入帳前，專案若已關閉，會自動變更為開啟", '專案開啟');
                    })
                    .error(function () {
                        toastr['warning']('儲存失敗 !', '更新失敗');
                    })
            } catch (err) {
                toastr['warning']('變更專案 !', '更新失敗');
                return;
            }

        }

        $scope.updatePrjUnitMemoInCase = function (prjUnit) {
            var ts = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

            try {
                var formData = {
                    _id: prjUnit._id,

                    position: prjUnit.position,
                    caseBoss: prjUnit.caseBoss,
                    approved_mount: prjUnit.approved_mount,

                    enable: prjUnit.enable,
                    viewable: prjUnit.viewable,

                    unitMemoByCase: prjUnit.unitMemoByCase,
                    userUpdateTs: ts,
                }
                _001_Project.updateOneUnit(formData)
                    .success(function (res) {
                        prjUnit.userUpdateTs = ts;
                        $scope.checkRowSpan(prjUnit);
                        toastr['success'](prjUnit.name, '更新成功');
                    })
                    .error(function () {
                        toastr['warning']('儲存失敗 !', '更新失敗');
                    })
            } catch (err) {
                toastr['warning']('變更專案 !', '更新失敗');
                return;
            }
        }

        $scope.showProcessStageName = function (processstagedid) {
            if (processstagedid == undefined || processstagedid == "") {
                return '沒有辦理項目';
            }

            var processStages_All = $scope.processStages_All;
            var selected = [];
            selected = $filter('filter')(processStages_All, {
                _id: processstagedid,
            });

            if (selected == undefined) return '沒有辦理項目';
            return selected[0].title;
        }



    }
})();

