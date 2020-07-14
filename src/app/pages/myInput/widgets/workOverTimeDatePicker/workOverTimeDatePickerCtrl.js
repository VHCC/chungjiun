/**
 * Created by IChen.Chu
 * on 01.07.2020.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('WorkOverTimeDatePickerCtrl', workOverTimeDatePickerCtrl);

    /** @ngInject */
    function workOverTimeDatePickerCtrl($scope) {
        $scope.openDatePicker = openDatePicker;
        $scope.myDT = new Date();
        $scope.opened = false;
        // $scope.formats = ['dd-MMMM-yyyy', 'MM/dd', 'dd.MM.yyyy', 'shortDate'];
        // $scope.format = $scope.formats[1];
        $scope.myOptions = {
            showWeeks: false,
            startingDay: 0,
            minDate: moment().add(-3, 'days').format("YYYY/MM/DD"),
        };
        $('.workOverTimeDatePickerCtrl').mask('M0/D0', {
            translation: {
                'M': {
                    pattern: /[01]/,
                },
                'D': {
                    pattern: /[0123]/,
                }
            }
        });
        function openDatePicker() {
            console.log($scope.format);
            $scope.opened = true;
            // console.log(this);
        }
    }
})();