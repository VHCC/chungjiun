/**
 * @author IChen.chu
 * created on 20.08.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('subContractorPayItemSelector', targetSelector);

    /** @ngInject */
    function targetSelector() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'SubContractorPayItemSelectorCtrl',
            link: function ($scope, elem, attrs) {
                $scope.fetchSubContractPayItem(attrs.scprjdid);
            },
            templateUrl: 'app/pages/myForms/subContractorPay/payItemSelector/payItemSelector.html',
        };
    }
})();