/**
 * @author Ichen.chu
 * created on 01.07.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('hrMachineFormRemedyHistory',
            [
                'DateUtil',
                hrMachineFormRemedyHistory
            ]);

    /** @ngInject */
    function hrMachineFormRemedyHistory(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'hrMachineFormRemedyHistoryCtrl',
            controllerAs: 'hrMachineFormRemedyHistoryCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load hrMachineFormRemedyHistory directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/hrMachine/remedy/hrMachineForm_Remedy_HistoryTab.html',
        };
    }
})();