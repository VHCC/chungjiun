/**
 * @author IChen.chu
 * created on 08.07.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('executiveExpenditureTarget',
            [
                'DateUtil',
                executiveExpenditureTarget
            ]);

    /** @ngInject */
    function executiveExpenditureTarget(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'executiveExpenditureTargetCtrl',
            controllerAs: 'executiveExpenditureTargetCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load executiveExpenditureTarget directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/executiveExpenditure/targetTab/executiveExpenditureTarget.html',
        };
    }
})();