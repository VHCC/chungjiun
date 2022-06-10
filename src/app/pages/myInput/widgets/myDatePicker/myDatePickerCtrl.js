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
        $scope.myOptions = {
            showWeeks: false,
            startingDay: 0,
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
            // $('.aaa').find('.panel-body').height(300);
            // console.log(this);
        }

        $scope.reloadDatePicker = function (type) {

            switch (type) {
                case 0:
                case 1:
                case 2:
                    $scope.myOptions = {
                        showWeeks: false,
                        startingDay: 0,
                    };
                    break;
                case 3:
                    $scope.myOptions = {
                        showWeeks: false,
                        startingDay: 0,
                        minDate: $scope.loginUserForm.start_special,
                        maxDate: $scope.loginUserForm.end_special
                    };
                    break;
                case 1001:
                    // $scope.myDT = new Date();
                    $scope.myOptions = {
                        showWeeks: false,
                        startingDay: 0,
                        minDate: $scope.loginUserForm.start_others,
                        maxDate: $scope.loginUserForm.end_others
                    };
                    break;
                case 4:
                    $scope.myOptions = {
                        showWeeks: false,
                        startingDay: 0,
                        minDate: $scope.loginUserForm.start_married,
                        maxDate: $scope.loginUserForm.end_married
                    };
                    break;
                case 5:
                    $scope.myOptions = {
                        showWeeks: false,
                        startingDay: 0,
                        minDate: $scope.loginUserForm.start_mourning,
                        maxDate: $scope.loginUserForm.end_mourning
                    };
                    break;
                case 6:
                    $scope.myOptions = {
                        showWeeks: false,
                        startingDay: 0,
                        minDate: $scope.loginUserForm.start_official,
                        maxDate: $scope.loginUserForm.end_official
                    };
                    break;
                case 7:
                    $scope.myOptions = {
                        showWeeks: false,
                        startingDay: 0,
                        minDate: $scope.loginUserForm.start_workinjury,
                        maxDate: $scope.loginUserForm.end_workinjury
                    };
                    break;
                case 8:
                    $scope.myOptions = {
                        showWeeks: false,
                        startingDay: 0,
                        minDate: $scope.loginUserForm.start_maternity,
                        maxDate: $scope.loginUserForm.end_maternity
                    };
                    break;
                case 9:
                    $scope.myOptions = {
                        showWeeks: false,
                        startingDay: 0,
                        minDate: $scope.loginUserForm.start_paternity,
                        maxDate: $scope.loginUserForm.end_paternity
                    };
                    break;
            }
            $scope.myDT = "";
        }

    }
})();