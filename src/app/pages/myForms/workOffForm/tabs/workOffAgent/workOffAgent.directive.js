/**
 * @author Ichen.chu
 * created on 18.02.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('workOffAgent',
            [
                'DateUtil',
                workOffAgent
            ]);

    /** @ngInject */
    function workOffAgent(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'workOffAgentCtrl',
            controllerAs: 'vm',
            link: function ($scope, elem, attrs) {
                console.log("load workOffAgent directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/workOffForm/tabs/workOffAgent/workOffForm_AgentTab.html',
        };
    }
})();