/**
 * Created by IChen.Chu
 * on 20.12.2021.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('My5YearlyDatePickerCtrl',
            [
                '$scope',
                'DateUtil',
                my5YearlyDatePickerCtrl
            ]);

    /** @ngInject */
    function my5YearlyDatePickerCtrl($scope, DateUtil) {

        $scope.open5YearlyDatePicker = show5YearPicker;
        // $scope.myDT = new Date(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
        $scope.myDT = new Date();
        $scope.myYear = moment(new Date()).format('YYYY');
        $scope.opened = false;
        $scope.my5YearOptions = {
            minMode: 'year',
            minDate: new Date('2020/01/01'),

            // showWeeks: false,
            // startingDay: 1,
        };
        // $('.myWeeklyDatePicker').mask('0000/M0/D0', {
        //     translation: {
        //         'M': {
        //             pattern: /[01]/,
        //         },
        //         'D': {
        //             pattern: /[0123]/,
        //         }
        //     }
        // });
        // function showWeeklyDatePicker() {
        //     $scope.opened = true;
        //     switch ($scope.viewType) {
        //         case "1":
        //             $scope.myDT = new Date($scope.$parent.$parent.$parent.firstFullDate);
        //             break;
        //         case "4":
        //             $scope.myDT = new Date($scope.$parent.$parent.$parent.$parent.$parent.firstFullDate_history);
        //             break;
        //         case "2":
        //             $scope.myDT = new Date($scope.$parent.$parent.$parent.$parent.$parent.firstFullDate_manager);
        //             break;
        //         case "3":
        //             $scope.myDT = new Date($scope.$parent.$parent.$parent.$parent.$parent.firstFullDate_executive);
        //             break;
        //         case "5":
        //             $scope.myDT = new Date($scope.$parent.$parent.$parent.$parent.$parent.firstFullDate_management);
        //             break;
        //     }
        // }

        function show5YearPicker() {
            console.log(" - showYearPicker()");
            $scope.yearPickerDom = this;
            $scope.opened = true;
        }

        $scope.shiftYear = function (dom) {
            console.log(" - shiftYear()");
            $scope.isShiftYearSelect = true;
            $scope.myYear = moment($scope.myYear).format('YYYY');
            $scope.myDT = moment(dom.myYear);
        }

    }
})();