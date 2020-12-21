/**
 * @author IChen.chu
 * created on 21.07.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('targetSelector', targetSelector);

    /** @ngInject */
    function targetSelector() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'TargetSelectorCtrl',
            link: function ($scope, elem, attrs) {
                // $scope.expenditureTargetChange(attrs.targetDID);
                $scope.expenditureTargetOptions = $scope.$parent.$parent.$parent.executiveExpenditureTargets;
            },
            templateUrl: 'app/pages/myForms/executiveExpenditure/targetSelector/targetSelector.html',
        };
    }
})();