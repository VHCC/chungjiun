/**
 * @author IChen.chu
 * created on 08.07.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('executiveExpenditureTargetCtrl',
            [
                '$scope',
                'toastr',
                '$cookies',
                '$filter',
                '$compile',
                '$timeout',
                '$window',
                'ngDialog',
                'Project',
                'ProjectUtil',
                'ExpenditureTargetUtil',
                'bsLoadingOverlayService',
                executiveExpenditureTargetCtrl
            ])

    /** @ngInject */
    function executiveExpenditureTargetCtrl($scope,
                             toastr,
                             $cookies,
                             $filter,
                             $compile,
                             $timeout,
                             window,
                             ngDialog,
                             Project,
                             ProjectUtil,
                             ExpenditureTargetUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        // 主要顯示
        $scope.executiveExpenditureTargets = [];

        $scope.fetchAllTargets = function () {

            var formData = {
            }

            ExpenditureTargetUtil.fetchAllExpenditureTarget(formData)
                .success(function (res) {
                    $scope.executiveExpenditureTargets = res.payload;
                })
                .error(function (res) {
                })
        }

        $scope.addTargetItem = function () {
            var formData = {
                targetName: "請輸入支出項目名稱"
            };
            ExpenditureTargetUtil.createExpenditureTarget(formData)
                .success(function (res) {
                    $scope.fetchAllTargets();
                })
                .error(function (res) {
                })
        }

        $scope.setTargetName = function (item, dom) {
            var formData = {
                "_id": item._id,
                "targetName": dom.$parent.targetSetName,
                "timestamp": moment(new Date()).format("YYYYMMDD HHmmss"),
            }

            ExpenditureTargetUtil.updateExpenditureTarget(formData)
                .success(function (res) {
                    $scope.fetchAllTargets();
                })
                .error(function (res) {
                })
        }

        // Remove Check
        $scope.removeTargetItemCheck = function (item) {
            $scope.checkText = '確定移除 ' + item.targetName + "  ？";
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
            var formData = {
                "_id": item._id,
            }
            ExpenditureTargetUtil.removeExpenditureTarget(formData)
                .success(function (res) {
                    $scope.fetchAllTargets();
                })
                .error(function (res) {
                })
        }

        $scope.reloadEEPageCross = function () {
            $scope.$$childHead.$$nextSibling.$$nextSibling.reloadEEPage();
        }

    }
})();


