/**
 * @author IChen.chu
 * created on 04.08.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('subContractorVendorCtrl',
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
                'SubContractorVendorUtil',
                'bsLoadingOverlayService',
                subContractorVendorCtrl
            ])

    /** @ngInject */
    function subContractorVendorCtrl($scope,
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
                             SubContractorVendorUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        // 主要顯示
        $scope.subContractorVendors = [];

        $scope.fetchAllSubContractorVendors = function () {

            var formData = {
            }

            SubContractorVendorUtil.fetchAllSCVendor(formData)
                .success(function (res) {
                    $scope.subContractorVendors = res.payload;
                })
                .error(function (res) {
                })
        }

        $scope.addSCVendorItem = function () {
            var formData = {
                subContractorVendorName: "請輸入委外廠商名稱"
            };
            SubContractorVendorUtil.createSCVendor(formData)
                .success(function (res) {
                    $scope.fetchAllSubContractorVendors();
                })
                .error(function (res) {
                })
        }

        $scope.setSCVendorName = function (item, dom) {
            var formData = {
                "_id": item._id,
                "subContractorVendorName": dom.$parent.scVendorSetName,
                "timestamp": moment(new Date()).format("YYYYMMDD HHmmss"),
            }

            SubContractorVendorUtil.updateSCVendor(formData)
                .success(function (res) {
                    $scope.fetchAllSubContractorVendors();
                })
                .error(function (res) {
                })
        }

        // Remove Check
        $scope.removeSCVendorCheck = function (item) {
            $scope.checkText = '確定移除 ' + item.subContractorVendorName + "  ？";
            $scope.checkingItem = item;
            ngDialog.open({
                template: 'app/pages/myForms/subContractor/tabs/modal/subContractorVendorDeleteModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 使用者確定移除項目
        $scope.removeSCVendor = function (item) {
            var formData = {
                "_id": item._id,
            }
            SubContractorVendorUtil.removeSCVendor(formData)
                .success(function (res) {
                    $scope.fetchAllSubContractorVendors();
                })
                .error(function (res) {
                })
        }

        $scope.reloadEEPageCross = function () {
            $scope.$$childHead.$$nextSibling.$$nextSibling.reloadEEPage();
        }

        $scope.reloadSCApplyPage = function () {
            console.log("DDDDD")
        }
    }
})();


