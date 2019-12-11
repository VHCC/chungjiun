/**
 * @author Ichen.chu
 * created on 10.05.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('officialDocVendorCtrl',
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
                'OfficialDocVendorUtil',
                'bsLoadingOverlayService',
                OfficialDocVendorCtrl
            ])

    /** @ngInject */
    function OfficialDocVendorCtrl($scope,
                             toastr,
                             $cookies,
                             $filter,
                             $compile,
                             $timeout,
                             window,
                             ngDialog,
                             Project,
                             ProjectUtil,
                             OfficialDocVendorUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        // 主要顯示
        $scope.officialDocVendors = [];

        $scope.fetchVendor = function () {
            OfficialDocVendorUtil.fetchOfficialDocVendor()
                .success(function (res) {
                    // console.log(res);
                    $scope.officialDocVendors = res.payload;
                })
                .error(function (res) {
                    console.log(res);
                })
        }

        $scope.addVendorItem = function () {
            var inserted = {
                vendorName: "請輸入廠商名稱"
            };
            OfficialDocVendorUtil.createOfficialDocVendor(inserted)
                .success(function (res) {
                    // console.log(res);
                    $scope.fetchVendor();
                })
                .error(function (res) {
                    console.log(res);
                })
        }

        $scope.setVendorName = function (item, dom) {

            var formData = {
                "_id": item._id,
                "vendorName": dom.$parent.vendorSetName
            }

            OfficialDocVendorUtil.updateOfficialDocVendor(formData)
                .success(function (res) {
                    $scope.fetchVendor();
                })
                .error(function (res) {
                    console.log(res);
                })
        }

        // Remove Check
        $scope.removeVendorItemCheck = function (item) {
            $scope.checkText = '確定移除 ' + item.vendorName + "  ？";
            $scope.checkingItem = item;
            ngDialog.open({
                template: 'app/pages/officialDoc/receiveOfficialDoc/modal/officialDocVendorDeleteModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 使用者確定移除發文機關項目
        $scope.removeVendorItem = function (item) {
            var formData = {
                "_id": item._id,
            }

            OfficialDocVendorUtil.removeOfficialDocVendor(formData)
                .success(function (res) {
                    $scope.fetchVendor();
                })
                .error(function (res) {
                    console.log(res);
                })
        }


    }
})();


