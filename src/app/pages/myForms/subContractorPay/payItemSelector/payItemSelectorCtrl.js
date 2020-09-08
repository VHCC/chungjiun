/**
 * Created by IChen.Chu
 * on 20.08.2020.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('SubContractorPayItemSelectorCtrl', [
            '$scope',
            'SubContractorApplyUtil',
            'SubContractorVendorUtil',
            'SubContractorItemUtil',
            'SubContractorPayItemUtil',
            '$filter',
            subContractorPayItemSelectorCtrl
        ]);

    /** @ngInject */
    function subContractorPayItemSelectorCtrl($scope
                    , SubContractorApplyUtil
                    , SubContractorVendorUtil
                    , SubContractorItemUtil
                    , SubContractorPayItemUtil
                    , $filter) {

        var vm = this;

        var formData = {
            isEnable: true
        }

        SubContractorVendorUtil.fetchSCVendorEnabled(formData)
            .success(function (res) {
                vm.subContractorVendors = res.payload;
            })

        SubContractorItemUtil.fetchSCItemEnabled(formData)
            .success(function (res) {
                vm.subContractorItems = res.payload;
            })

        $scope.showSCVendorName = function (vendorDID) {
            var selected = [];
            if (vm.subContractorVendors === undefined) return;
            if (vendorDID) {
                selected = $filter('filter')(vm.subContractorVendors, {
                    _id: vendorDID,
                });
            }
            return selected.length ? selected[0].subContractorVendorName : 'Not Set';
        }

        $scope.showSCItemName = function (itemDID) {
            var selected = [];
            if (vm.subContractorItems === undefined) return;
            if (itemDID) {
                selected = $filter('filter')(vm.subContractorItems, {
                    _id: itemDID,
                });
            }
            return selected.length ? selected[0].subContractorItemName : 'Not Set';
        }

        $scope.fetchSubContractPayItem = function (prjDID) {
            var formData = {
                isManagerCheck: true,
                prjDID: prjDID
            }

            SubContractorApplyUtil.fetchSCApplyItems(formData)
                .success(function (res) {
                    $scope.subContractorPayItemOptions = res.payload;
                })
        }

    }
})();