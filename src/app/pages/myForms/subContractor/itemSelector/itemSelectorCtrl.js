/**
 * Created by IChen.Chu
 * on 05.08.2020.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('SubContractorItemSelectorCtrl', [
            '$scope',
            'SubContractorItemUtil',
            '$filter',
            subContractorItemSelectorCtrl
        ]);

    /** @ngInject */
    function subContractorItemSelectorCtrl($scope
                    , SubContractorItemUtil
                    , $filter
    ) {
        var formData = {
            isEnable: true
        }

        SubContractorItemUtil.fetchSCItemEnabled(formData)
            .success(function (res) {
                $scope.subContractorItemOptions = res.payload;
            })

        // dynamic function
        $scope.subContractorItemChange = function (itemDID) {
        }

    }
})();