/**
 * Created by IChen.Chu
 * on 10.03.2018.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('MyDatePickerCtrl', myDatePickerCtrl);

    /** @ngInject */
    function myDatePickerCtrl($scope) {

        $scope.openDatePicker = openDatePicker;
        $scope.myDT = new Date();
        $scope.opened = false;
        // $scope.formats = ['dd-MMMM-yyyy', 'MM/dd', 'dd.MM.yyyy', 'shortDate'];
        // $scope.format = $scope.formats[1];
        $scope.options = {
            showWeeks: false
        };
        $('.myDatePicker').mask('M0/D0', {
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
        }
    }
})();