/**
 * @author Ichen.chu
 * created on 01.08.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('workHourOTDistribution',
            [
                'DateUtil',
                workHourOTDistribution
            ]);

    /** @ngInject */
    function workHourOTDistribution(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'workHourOTDistributionCtrl',
            controllerAs: 'workHourOTDistributionCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load workHourOTDistribution directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/workHourOTDistribution/workHourOTDistribution.html',
        };
    }
})();