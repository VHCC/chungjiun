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
                prjDID: prjDID
            }
            SubContractorPayItemUtil.fetchSCPayItems(formData)
                .success(function (res) {
                    console.log(res);
                    var subContractorPayItems_temp = [];
                    for (var index = 0; index < res.payload.length; index ++) {
                        if (res.payload[index].isClosed) {
                            subContractorPayItems_temp.push(res.payload[index].subContractDID);
                        }
                    }

                    console.log(subContractorPayItems_temp);
                    var formData = {
                        isManagerCheck: true,
                        prjDID: prjDID
                    }

                    $scope.subContractorPayItemOptions = [];

                    SubContractorApplyUtil.fetchSCApplyItems(formData)
                        .success(function (res) {
                            console.log(res);
                            for (var index = 0; index < res.payload.length; index ++) {
                                if (!subContractorPayItems_temp.includes(res.payload[index]._id)) {
                                    $scope.subContractorPayItemOptions.push(res.payload[index]);
                                }
                            }
                            console.log($scope.subContractorPayItemOptions);
                            // $scope.subContractorPayItemOptions = res.payload;
                        })


                })

        }

    }
})();