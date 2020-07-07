/**
 * @author IChen.chu
 * created on 03.07.2020
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.myForms')
        .directive('employeeStatistics',
            [
                'DateUtil',
                employeeStatistics
            ]);

    /** @ngInject */
    function employeeStatistics(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'employeeStatisticsCtrl',
            controllerAs: 'employeeStatisticsCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load employeeStatistics directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/workHourTableForm/employeeStatistics/employeeStatistics.html',
        };
    }
})();