/**
 * @author IChen.chu
 * created on 05.08.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('subContractorVendorSelector', targetSelector);

    /** @ngInject */
    function targetSelector() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'SubContractorVendorSelectorCtrl',
            link: function ($scope, elem, attrs) {
                $scope.subContractorVendorChange(attrs.vendorDID);
            },
            templateUrl: 'app/pages/myForms/subContractor/vendorSelector/vendorSelector.html',
        };
    }
})();