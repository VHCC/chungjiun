/**
 * Created by IChen.Chu
 * on 05.08.2020.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('SubContractorVendorSelectorCtrl', [
            '$scope',
            'SubContractorVendorUtil',
            '$filter',
            subContractorVendorSelectorCtrl
        ]);

    /** @ngInject */
    function subContractorVendorSelectorCtrl($scope
                    , SubContractorVendorUtil
                    , $filter
    ) {
        var formData = {
            isEnable: true
        }

        SubContractorVendorUtil.fetchSCVendorEnabled(formData)
            .success(function (res) {
                $scope.subContractorVendorOptions = res.payload;
            })

        // dynamic function
        $scope.subContractorVendorChange = function (vendorDID) {
        }

    }
})();