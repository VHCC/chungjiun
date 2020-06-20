/**
 * @author Ichen.chu
 * created on 17.06.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('hrMachineFormRemedyConfirm',
            [
                'DateUtil',
                hrMachineFormRemedyConfirm
            ]);

    /** @ngInject */
    function hrMachineFormRemedyConfirm(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'hrMachineFormRemedyConfirmCtrl',
            controllerAs: 'hrMachineFormRemedyConfirmCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load hrMachineFormRemedyConfirm directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myForms/hrMachine/remedy/hrMachineForm_RemedyConfirmTab.html',
        };
    }
})();