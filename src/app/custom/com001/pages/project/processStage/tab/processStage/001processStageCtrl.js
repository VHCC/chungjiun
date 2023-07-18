(function () {
    'use strict';

    // createDate: 2023/07/17
    angular.module('BlurAdmin.pages.001.Project')
        .controller('_001_processStageCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            '$compile',
            'toastr',
            'User',
            '$timeout',
            'bsLoadingOverlayService',
            'editableOptions',
            'editableThemes',
            '_001_Institute',
            '_001_ProjectContract',
            '_001_ProjectCase',
            '_001_Project',
            '_001_CaseTask',
            processStage
        ])

    /** @ngInject */
    function processStage($scope,
                      cookies,
                      window,
                      $filter,
                      $compile,
                      toastr,
                      User,
                      $timeout,
                      bsLoadingOverlayService,
                      editableOptions,
                      editableThemes,
                      _001_Institute,
                      _001_ProjectContract,
                      _001_ProjectCase,
                      _001_Project,
                      _001_CaseTask) {

        // editableOptions.theme = 'bs3';
        // editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        // editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

        $scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        var loadingReferenceId = 'mainPage_001processStage';

        var vm = this;
        vm.userDID = cookies.get("userDID");

        $scope.fetchProcessStageList = function() {
            //fetchCaseTaskList
            $timeout(function () {
                bsLoadingOverlayService.start({
                    referenceId: loadingReferenceId
                });
            }, 200);

            _001_CaseTask.findAll()
                .success(function (resp) {
                    console.log(resp);
                    $scope.caseTasks = resp;

                    angular.element(
                        document.getElementById('includeHead_processStage'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'辦理階段項目選單列表 - " + resp.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/custom/com001/pages/project/processStage/tab/processStage/table/processStageTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));

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

        $scope.addCaseTask = function () {
            _001_CaseTask.createCaseTask({
                creatorDID: vm.userDID
            })
            .success(function (resp) {
                $scope.fetchProcessStageList();
            })
        }

        $scope.updateCaseTask = function (item) {
            _001_CaseTask.updateCaseTask({
                _id: item._id,
                title: item.title,
                updateTs: moment(new Date()).format("YYYYMMDD_HHmmss"),
            })
            .success(function (resp) {
                $scope.fetchProcessStageList();
            })
        }

        $scope.setItemTitle = function (item) {
            console.log(item);
            _001_CaseTask.updateCaseTask({
                _id: item._id,
                title: item.title,
                isSet: true,
                enable: true,
                updateTs: moment(new Date()).format("YYYYMMDD_HHmmss"),
            })
            .success(function (resp) {
                $scope.fetchProcessStageList();
            })
        }

        // Remove Check
        $scope.removeTargetItemCheck = function (item) {
            $scope.checkText = '確定移除 ' + item.title + "  ？";
            $scope.checkingItem = item;
            ngDialog.open({
                template: 'app/pages/myForms/executiveExpenditure/targetTab/modal/expenditureTargetDeleteModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 使用者確定移除項目
        $scope.removeTargetItem = function (item) {
            console.log(item);
            // var formData = {
            //     "_id": item._id,
            // }
            // ExpenditureTargetUtil.removeExpenditureTarget(formData)
            //     .success(function (res) {
            //         $scope.fetchAllTargets();
            //     })
            //     .error(function (res) {
            //     })
        }

        $scope.init = function () {
            console.log(" *** Initialize");
            $timeout(function () {
                $scope.fetchProcessStageList();
            }, 200);

        }

        $scope.init();

        $scope.switchItem = function (item) {
            _001_CaseTask.updateCaseTask({
                _id: item._id,
                enable: item.enable,
                updateTs: moment(new Date()).format("YYYYMMDD_HHmmss"),
            })
            .success(function (resp) {
                // $scope.fetchProcessStageList();
            })
        }

    }
})();

