/**
 * @author Ichen.chu
 * created on 17.06.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('hrMachineFormRemedy',
            [
                'DateUtil',
                hrMachineFormRemedy
            ]);

    /** @ngInject */
    function hrMachineFormRemedy(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'hrMachineFormRemedyCtrl',
            controllerAs: 'hrMachineFormRemedyCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load hrMachineFormRemedy directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/hrMachine/remedy/hrMachineForm_RemedyTab.html',
        };
    }
})();