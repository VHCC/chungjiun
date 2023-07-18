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
                      _001_Project) {

        $scope.username = cookies.get('username');
        $scope.isDepG = cookies.get('isDepG') == "false" ? false : true;

        var roleType = cookies.get('roletype');

        var loadingReferenceId = 'mainPage_001listCase'

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

                console.log(resp);
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
                    $scope.showCaseTable(resp, true);
                })
            } else {
                _001_Project.findOneCaseWithOneType({
                    caseDID: vm.filter.projectCase._id,
                    type: vm.filter.projectType.value
                })
                .success(function (resp) {
                    $scope.showCaseTable(resp, true);
                })
            }
        }

        $scope.init();

        $scope.showCaseTable = function (caseData, notFreshType) {
            console.log(caseData);
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
            console.log(vm);
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
            console.log(prjCase);



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
            {label: '設計-1', value: '1'},
            {label: '監造-2', value: '2'},
            {label: '規劃-3', value: '3'},
            {label: '專管-4', value: '4'},
            {label: '管理-5', value: '5'},
            {label: '投標-6', value: '6'},
            {label: '其他-7', value: '7'},
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

        $scope.updateCase = function (prjCase) {
            var ts = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

            try {
                var formData = {
                    _id: prjCase._id,
                    caseMemo: prjCase.caseMemo,

                    position: prjCase.position,
                    caseBoss: prjCase.caseBoss,
                    approved_mount: prjCase.approved_mount,
                    date_1: prjCase.date_1,
                    date_2: prjCase.date_2,
                    date_3: prjCase.date_3,
                    date_3_mount: prjCase.date_3_mount,
                    date_4: prjCase.date_4,
                    date_5: prjCase.date_5,
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
            } catch (err) {
                toastr['warning']('變更工程 !', '更新失敗');
                return;
            }
        }


        $scope.changeCaseStatus = function (prjCase) {
            var ts = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

            var formData = {
                _id: prjCase._id,
                enable: prjCase.enable,
                userUpdateTs: ts,
            }
            _001_ProjectCase.updateOneCaseInfo(formData)
                .success(function (res) {
                    prjCase.userUpdateTs = ts;
                    // toastr['success'](contract.name, '更新成功');
                })
                .error(function () {
                    // toastr['warning']('儲存失敗 !', '更新失敗');
                })
        }

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


    }
})();

