/**
 * @author IChen.chu
 * created on 11.25.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('workHourOverTimeRemedy',
            [
                'DateUtil',
                workHourOverTimeRemedy
            ]);

    /** @ngInject */
    function workHourOverTimeRemedy(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'workHourOverTimeRemedyCtrl',
            controllerAs: 'workHourOverTimeRemedyCtrlVm',
            link: function ($scope, elem, attrs) {
                // console.log("load workHourOverTimeRemedy directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/workHourTableForm/workOverRemedy/workOverTimeRemedy_main.html',
        };
    }
})();