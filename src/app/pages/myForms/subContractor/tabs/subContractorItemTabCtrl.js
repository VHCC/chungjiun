/**
 * @author IChen.chu
 * created on 05.08.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('subContractorItemCtrl',
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
                'SubContractorItemUtil',
                'bsLoadingOverlayService',
                subContractorItemCtrl
            ])

    /** @ngInject */
    function subContractorItemCtrl($scope,
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
                             SubContractorItemUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        // 主要顯示
        $scope.subContractorItems = [];

        $scope.fetchAllSubContractorItems = function () {

            var formData = {
            }

            SubContractorItemUtil.fetchAllSCItem(formData)
                .success(function (res) {
                    $scope.subContractorItems = res.payload;
                })
                .error(function (res) {
                })
        }

        $scope.addSCItem = function () {
            var formData = {
                subContractorItemName: "請輸入委外項目名稱"
            };
            SubContractorItemUtil.createSCItem(formData)
                .success(function (res) {
                    $scope.fetchAllSubContractorItems();
                })
                .error(function (res) {
                })
        }

        $scope.setSCItemName = function (item, dom) {
            var formData = {
                "_id": item._id,
                "subContractorItemName": dom.$parent.scItemSetName,
                "timestamp": moment(new Date()).format("YYYYMMDD HHmmss"),
            }

            SubContractorItemUtil.updateSCItem(formData)
                .success(function (res) {
                    $scope.fetchAllSubContractorItems();
                })
                .error(function (res) {
                })
        }

        // Remove Check
        $scope.removeSCItemCheck = function (item) {
            $scope.checkText = '確定移除 ' + item.subContractorItemName + "  ？";
            $scope.checkingItem = item;
            ngDialog.open({
                template: 'app/pages/myForms/subContractor/tabs/modal/subContractorItemDeleteModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 使用者確定移除項目
        $scope.removeSCItem = function (item) {
            var formData = {
                "_id": item._id,
            }
            SubContractorItemUtil.removeSCItem(formData)
                .success(function (res) {
                    $scope.fetchAllSubContractorItems();
                })
                .error(function (res) {
                })
        }

        $scope.reloadEEPageCross = function () {
            $scope.$$childHead.$$nextSibling.$$nextSibling.reloadEEPage();
        }

        $scope.reloadSCApplyPage = function () {
            console.log("AAAA")
        }
    }
})();


