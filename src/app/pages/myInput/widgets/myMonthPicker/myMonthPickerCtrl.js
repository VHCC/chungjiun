/**
 * Created by IChen.Chu
 * on 01.08.2018.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('MyMonthPickerCtrl',
            [
                '$scope',
                'DateUtil',
                myMonthPickerCtrl
            ]);

    /** @ngInject */
    function myMonthPickerCtrl($scope, DateUtil) {

        $scope.openMonthPicker = showMonthPicker;
        $scope.myDT = new Date();
        $scope.myMonth = moment(new Date()).format('YYYY/MM');
        $scope.opened = false;
        $scope.myOptions = {
            minMode: 'month',
        };
        $('.myMonthPicker').mask('M0', {
            translation: {
                'M': {
                    pattern: /[01]/,
                }
            }
        });
        function showMonthPicker() {
            $scope.opened = true;
        }

        $scope.shiftHrMachineMonth = function (dom) {
            $scope.myMonth = moment($scope.myMonth).format('YYYY/MM');
            $scope.myDT = moment(dom.myMonth);
            $scope.fetchData($scope.myMonth);
        }
    }
})();