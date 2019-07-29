/**
 * @author Ichen.chu
 * created on 01.08.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('workStatisticsCJ',
            [
                'DateUtil',
                workStatisticsCJ
            ]);

    /** @ngInject */
    function workStatisticsCJ(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'workStatisticsCJCtrl',
            controllerAs: 'workStatisticsCJCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load statistic directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/workStatisticsCJ/workStatisticsCJ.html',
        };
    }
})();