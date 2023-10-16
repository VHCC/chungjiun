(function () {
    'use strict';

    // createDate: 2022/07/13
    angular.module('BlurAdmin.pages.001.PersonalManage')
        .controller('_001_editCaseInfoCtrl', [
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
            editCaseInfo
        ])

    /** @ngInject */
    function editCaseInfo($scope,
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
        $scope.userDID = cookies.get('userDID');
        var roleType = cookies.get('roletype');
        $scope.depType = cookies.get('depType');

        var loadingReferenceId = 'mainPage_001caseInfo'

        var vm = this;

        $scope.init = function() {
            // 機關
            _001_Institute.findAll()
                .success(function (resp) {
                    vm.instituteOptions = resp;
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

                _001_Project.findAllCaseWithOneContract({
                    contractDID: projectContract._id
                })
                .success(function (resp) {
                    $scope.showTable(resp);
                })
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

        $scope.changeCase = function(projectCase) {

            vm.filter.projectType = null;

            _001_Project.findOneCaseWithAllType({
                caseDID: projectCase._id
            })
            .success(function (resp) {
                $scope.showTable(resp);
            })
        }

        $scope.changeType = function(vm) {
            if (vm.filter.projectCase == null) {
                _001_Project.findAllByOneContractWithOneType({
                    contractDID: vm.filter.projectContract._id,
                    type: vm.filter.projectType.value
                })
                .success(function (resp) {
                    $scope.showTable(resp, true);
                })
            } else {
                _001_Project.findOneCaseWithOneType({
                    caseDID: vm.filter.projectCase._id,
                    type: vm.filter.projectType.value
                })
                .success(function (resp) {
                    $scope.showTable(resp, true);
                })
            }
        }


        $scope.init();

        $scope.showTable = function (caseData, notFreshType) {
            if (!notFreshType) {
                prjTypeOptionsCanSelect = [];
                prjTypeOptionsList = [];
            }
            caseData.forEach(function (projectCase) {
                $scope.checkProjectType(projectCase.type);
                projectCase.caseName = $scope.getProjectCase(projectCase.caseDID).name;
                projectCase.caseCode = $scope.getProjectCase(projectCase.caseDID).code;

                projectCase.typeName = $scope.getProjectType(projectCase.type).label;
            })

            vm.prjTypeOptionsAll = prjTypeOptionsCanSelect;
            $scope.tableData = caseData;
            angular.element(
                document.getElementById('includeHead_editCaseInfo'))
                .html($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'專案列表 - " + caseData.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/custom/com001/pages/personalManage/caseInfo/tab/editCaseInfo/table/editCaseInfoTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));
        }

        $scope.showPrjUnitInformation = function (projectUnit) {
            console.log(projectUnit);
            $scope.checkRowSpan(projectUnit);

            _001_ProjectCase.findByCaseDID({
                caseDID: projectUnit.caseDID
            })
            .success(function (resp) {
                if (resp.length > 0) {
                    projectUnit.case = resp[0];
                }
            })
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

        $scope.checkRowSpan = function(project) {
            project.rowSpan = 1;
            if (project.unitMemoByCase != undefined) {
                project.rowSpan = project.unitMemo.length + 1;
            }
        }


        $scope.insertUnitMemo = function (item) {

            if (item.unitMemo == undefined) {
                item.unitMemo = [{}];
            } else {
                item.unitMemo.push({});
            }

            var formData = {
                _id: item._id,
                unitMemo: item.unitMemo,
                userUpdateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
            }

            _001_Project.updateOneUnit(formData)
                .success(function (res) {
                    $scope.checkRowSpan(item);
                    toastr['success'](item.name, '新增成功');
                })
                .error(function () {
                    toastr['warning']('儲存失敗 !', '更新失敗');
                })
        }

        _001_CaseTask.findAll()
            .success(function (resp) {
                $scope.processStageOptionAll = resp;
            })

        $scope.showProcessStageNameByUUid = function (processstagedid) {
            if (processstagedid == undefined || processstagedid == "") {
                return '尚未選擇';
            }

            // var processStages_All = JSON.parse(attr.source);
            var selected = [];
            selected = $filter('filter')($scope.processStageOptionAll, {
                _id: processstagedid,
            });

            if (selected == undefined) return '尚未選擇';
            // console.log(selected[0])
            return selected[0];
        }


        $scope.updateUnit = function (item, dom) {
            // console.log(dom);
            // console.log(item);
            // console.log($scope);
            var ts = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

            try {
                var formData = {
                    _id: item._id,

                    drill_date: item.drill_date, // 鑽探日期
                    date_1_ext: item.date_1_ext, // 基設日期
                    date_2_ext: item.date_2_ext, // 細設日期
                    pack_date: item.pack_date, // 發包日期

                    pack_company: item.pack_company, // 施工廠商
                    start_date: item.start_date, // 開工日期
                    done_date: item.done_date, // 完工日期
                    predict_process: item.predict_process, // 預定進度
                    real_process: item.real_process, // 實際進度

                    check_date: item.check_date, // 驗收日期
                    pay_end_date: item.pay_end_date, // 結算日期
                    change_date: item.change_date, // 變更日期
                    change_amount: item.change_amount, // 變更金額

                    unitMemo: item.unitMemo,

                    userUpdateTs: ts,
                }
                _001_Project.updateOneUnit(formData)
                    .success(function (res) {
                        item.userUpdateTs = ts;
                        toastr['success'](item.name, '更新成功');
                    })
                    .error(function () {
                        toastr['warning']('儲存失敗 !', '更新失敗');
                    })
            } catch (err) {
                toastr['warning']('變更專案 !', '更新失敗');
                return;
            }
        }

        $scope.isMajor = function (unit) {
            return (unit.majorID == $scope.userDID);
        }
    }
})();

