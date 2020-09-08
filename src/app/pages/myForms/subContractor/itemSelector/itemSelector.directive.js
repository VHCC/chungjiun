/**
 * @author IChen.chu
 * created on 05.08.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('subContractorItemSelector', itemSelector);

    /** @ngInject */
    function itemSelector() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'SubContractorItemSelectorCtrl',
            link: function ($scope, elem, attrs) {
                $scope.subContractorItemChange(attrs.itemDID);
            },
            templateUrl: 'app/pages/myForms/subContractor/itemSelector/itemSelector.html',
        };
    }
})();