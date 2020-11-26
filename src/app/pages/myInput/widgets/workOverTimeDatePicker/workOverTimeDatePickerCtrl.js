/**
 * Created by IChen.Chu
 * on 01.07.2020.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('WorkOverTimeDatePickerCtrl', [
            '$scope',
            '$cookies',
            workOverTimeDatePickerCtrl
        ]);

    /** @ngInject */
    function workOverTimeDatePickerCtrl($scope,
                                        $cookies) {
        $scope.userDID = $cookies.get('userDID');
        console.log($scope);
        $scope.openDatePicker = openDatePicker;
        $scope.myDT = new Date();
        $scope.opened = false;
        // $scope.formats = ['dd-MMMM-yyyy', 'MM/dd', 'dd.MM.yyyy', 'shortDate'];
        // $scope.format = $scope.formats[1];
        console.log($scope.isExecutive);
        $scope.myOptions = {
            showWeeks: false,
            startingDay: 0,
            minDate: moment().add(-3, 'days').format("YYYY/MM/DD"),
        };

        if ( $scope.userDID == "5ba4af019bdd2a0ef86dc5ec" || $scope.isExecutive) {
            $scope.myOptions = {
                showWeeks: false,
                startingDay: 0,
            };
        }
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
            if ( $scope.userDID == "5ba4af019bdd2a0ef86dc5ec" || $scope.isExecutive) {
                $scope.myOptions = {
                    showWeeks: false,
                    startingDay: 0,
                };
            }
            // console.log(this);
        }
    }
})();