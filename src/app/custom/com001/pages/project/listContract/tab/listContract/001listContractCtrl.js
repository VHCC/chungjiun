(function () {
    'use strict';

    // createDate: 2022/07/13
    angular.module('BlurAdmin.pages.001.Project')
        .controller('_001_listContractCtrl', [
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
            listContract
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
    function listContract($scope,
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

        var loadingReferenceId = 'mainPage_001listContract'

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

        // 變更契約
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

        // 多選契約
        $scope.changeContractMulti = function(projectContracts, institute) {
            // vm.filter.projectCase = null;
            // vm.filter.projectType = null;

            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: loadingReferenceId
                });
            }, 100);

            // var contractDIDsArray = [];
            // for (var index = 0; index < projectContracts.length; index++) {
            //     contractDIDsArray.push(projectContracts[index]._id);
            // }

            // vm.filter.projectCase = null;

            $scope.showContractTable(projectContracts);

            $timeout(function () {
                bsLoadingOverlayService.stop({
                    referenceId: loadingReferenceId
                });
            }, 500)

            // 工程
            // _001_ProjectCase.findByContractDIDMultiAndInstituteDID({
            //     contractDIDs: contractDIDsArray,
            //     instituteDID: institute._id
            // })
            // .success(function (resp) {
            //     vm.caseOptions = resp;
            //     vm.caseOptionsAll = resp;
            //
            //     // 專案
            //     _001_Project.findAllCaseWithMultiContract({
            //         contractDIDs: contractDIDsArray
            //     })
            //     .success(function (resp) {
            //         $scope.showTable(resp);
            //     });
            //     $timeout(function () {
            //         bsLoadingOverlayService.stop({
            //             referenceId: loadingReferenceId
            //         });
            //     }, 500)
            // })
            // .error(function (err) {
            //     $timeout(function () {
            //         bsLoadingOverlayService.stop({
            //             referenceId: loadingReferenceId
            //         });
            //     }, 500)
            // })
        }

        // 變更工程
        $scope.changeCase = function(projectCase) {

            vm.filter.projectType = null;

            _001_Project.findOneCaseWithAllType({
                caseDID: projectCase._id
            })
            .success(function (resp) {
                $scope.showTable(resp);
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

        // $scope.showTable = function (caseData, notFreshType) {
        //     if (!notFreshType) {
        //         prjTypeOptionsCanSelect = [];
        //         prjTypeOptionsList = [];
        //     }
        //     caseData.forEach(function (projectCase) {
        //         $scope.checkProjectType(projectCase.type);
        //         projectCase.caseName = $scope.getProjectCase(projectCase.caseDID).name;
        //         projectCase.caseCode = $scope.getProjectCase(projectCase.caseDID).code;
        //
        //         projectCase.typeName = $scope.getProjectType(projectCase.type).label;
        //     })
        //
        //     vm.prjTypeOptionsAll = prjTypeOptionsCanSelect;
        //     $scope.tableData = caseData;
        //     angular.element(
        //         document.getElementById('includeHead_listContract'))
        //         .html($compile(
        //             "<div ba-panel ba-panel-title=" +
        //             "'專案列表 - " + caseData.length + "'" +
        //             "ba-panel-class= " +
        //             "'with-scroll'" + ">" +
        //             "<div " +
        //             "ng-include=\"'app/custom/com001/pages/project/listContract/tab/listContract/table/listContractTable.html'\">" +
        //             "</div>" +
        //             "</div>"
        //         )($scope));
        // }


        $scope.showContractTable = function (contractData) {
            $scope.tableData = contractData;
            angular.element(
                document.getElementById('includeHead_listContract'))
                .html($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'契約列表 - " + contractData.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/custom/com001/pages/project/listContract/tab/listContract/table/listContractTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));
        }

        $scope.showContractInformation = function (contract) {
            console.log(contract);
            // 工程
            _001_ProjectCase.findByContractDIDAndInstituteDID({
                contractDID: contract._id,
                instituteDID: contract.instituteDID
            })
            .success(function (resp) {
                console.log(resp);
                contract.caseOptions = resp;
            })

        }

        $scope.$watchCollection('vm.filter.projectContract', function(newItems) {
            var newItemCount = newItems.length;
            console.log("契約數量：", newItemCount);

            $scope.changeContractMulti(vm.filter.projectContract, vm.filter.institute);

        });

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

        $scope.updateContract = function (contract) {
            try {
                var formData = {
                    _id: contract._id,
                    mount: contract.mount,
                    ext_mount: contract.ext_mount,
                    contractMemo: contract.contractMemo,
                    userUpdateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                    // updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                }
                _001_ProjectContract.updateOneContractInfo(formData)
                    .success(function (res) {
                        toastr['success'](contract.name, '更新成功');
                    })
                    .error(function () {
                        toastr['warning']('儲存失敗 !', '更新失敗');
                    })
            } catch (err) {
                toastr['warning']('變更契約名稱 !', '更新失敗');
                return;
            }
        }

        $scope.changeContractStatus = function (contract) {
            var formData = {
                _id: contract._id,
                enable: contract.enable,
            }
            _001_ProjectContract.updateOneContractInfo(formData)
                .success(function (res) {
                    // console.log(res.code);
                    // toastr['success'](contract.name, '更新成功');
                })
                .error(function () {
                    // toastr['warning']('儲存失敗 !', '更新失敗');
                })
        }

        $scope.insertContractMemo = function (contract) {

            if (contract.contractMemo == undefined) {
                contract.contractMemo = [{
                    field_1: "0",
                    field_2: moment(new Date()).format("YYYY/MM/DD"),
                    field_3: moment(new Date()).format("YYYY/MM/DD"),
                    field_4: moment(new Date()).format("YYYY/MM/DD"),
                    field_5: moment(new Date()).format("YYYY/MM/DD"),
                    field_6: moment(new Date()).format("YYYY/MM/DD"),
                    field_7: moment(new Date()).format("YYYY/MM/DD"),
                    field_8: "承辦機關",
                }];
            } else {
                contract.contractMemo.push({
                    field_1: "0",
                    field_2: moment(new Date()).format("YYYY/MM/DD"),
                    field_3: moment(new Date()).format("YYYY/MM/DD"),
                    field_4: moment(new Date()).format("YYYY/MM/DD"),
                    field_5: moment(new Date()).format("YYYY/MM/DD"),
                    field_6: moment(new Date()).format("YYYY/MM/DD"),
                    field_7: moment(new Date()).format("YYYY/MM/DD"),
                    field_8: "承辦機關",
                })
            }

            var formData = {
                _id: contract._id,
                contractMemo: contract.contractMemo,
            }

            _001_ProjectContract.updateOneContractInfo(formData)
                .success(function (res) {
                    toastr['success'](contract.name, '新增成功');
                })
                .error(function () {
                    toastr['warning']('儲存失敗 !', '更新失敗');
                })
        }

    }
})();

