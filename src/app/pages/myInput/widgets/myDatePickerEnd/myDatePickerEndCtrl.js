/**
 * Created by IChen.Chu
 * on 10.03.2018.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('MyDatePickerEndCtrl', MyDatePickerEndCtrl);

    /** @ngInject */
    function MyDatePickerEndCtrl($scope) {
        $scope.openDatePickerEnd = openDatePickerEnd;
        $scope.myDTEnd = new Date();
        $scope.end_opened = false;
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
        function openDatePickerEnd() {
            $scope.end_opened = true;
        }

        $scope.reloadDatePicker = function (type) {
            console.log("reloadDatePicker End");
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
            $scope.myDTEnd = "";
        }

    }
})();