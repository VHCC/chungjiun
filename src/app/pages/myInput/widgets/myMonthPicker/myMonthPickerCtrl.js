/**
 * Created by IChen.Chu
 * on 01.08.2018.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('myMonthPickerCtrl',
            [
                '$scope',
                'DateUtil',
                myMonthPickerCtrl
            ]);

    /** @ngInject */
    function myMonthPickerCtrl($scope, DateUtil) {
        console.log(" - myMonthPickerCtrl()");
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
            console.log(" - showMonthPicker()");
            $scope.monthPickerDom = this;
            $scope.opened = true;
        }

        $scope.shiftMonth = function (dom) {
            console.log(" - shiftMonth()");
            $scope.isShiftMonthSelect = true;
            $scope.myMonth = moment($scope.myMonth).format($scope.format);
            $scope.myDT = moment(dom.myMonth);
            // console.log($scope);
        }

        $scope.qqqqqwww = function () {
            console.log(" - qqqqqwww");
        }
    }
})();