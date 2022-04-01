/**
 * @author IChen.chu
 * created on 01.07.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('workHourOverTime',
            [
                'DateUtil',
                workHourOverTime
            ]);

    /** @ngInject */
    function workHourOverTime(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'workHourOverTimeCtrl',
            controllerAs: 'workHourOverTimeCtrlVm',
            link: function ($scope, elem, attrs) {
                // console.log("load workHourOverTime directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/workHourTableForm/workOver/workOverTime_main.html',
        };
    }
})();