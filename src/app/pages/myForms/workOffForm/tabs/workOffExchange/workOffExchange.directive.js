/**
 * @author Ichen.chu
 * created on 01.08.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('workOffExchange',
            [
                'DateUtil',
                workOffExchange
            ]);

    /** @ngInject */
    function workOffExchange(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'workOffExchangeCtrl',
            controllerAs: 'workOffExchangeCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load workOffExchange directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/workOffForm/tabs/workOffExchange/workOffExchange.html',
        };
    }
})();