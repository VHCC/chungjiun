/**
 * @author IChen.chu
 * created on 06.07.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('workHourOverTimeReview',
            [
                'DateUtil',
                workHourOverTimeReview
            ]);

    /** @ngInject */
    function workHourOverTimeReview(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'workHourOverTimeReviewCtrl',
            controllerAs: 'workHourOverTimeReviewCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load workHourOverTimeReview directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/workHourTableForm/workOverReview/workOverTime_managerTab.html',
        };
    }
})();