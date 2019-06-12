/**
 * Created by IChen.Chu
 * on 22.06.2018.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('MyWeeklyDatePickerCtrl',
            [
                '$scope',
                'DateUtil',
                myWeeklyDatePickerCtrl
            ]);

    /** @ngInject */
    function myWeeklyDatePickerCtrl($scope, DateUtil) {

        $scope.openWeeklyDatePicker = showWeeklyDatePicker;
        $scope.myDT = new Date(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
        $scope.opened = false;
        $scope.myOptions = {
            showWeeks: false,
            startingDay: 1,
        };
        $('.myWeeklyDatePicker').mask('0000/M0/D0', {
            translation: {
                'M': {
                    pattern: /[01]/,
                },
                'D': {
                    pattern: /[0123]/,
                }
            }
        });
        function showWeeklyDatePicker() {
            $scope.opened = true;
            switch ($scope.viewType) {
                case "1":
                    $scope.myDT = new Date($scope.$parent.$parent.$parent.firstFullDate);
                    break;
                case "4":
                    $scope.myDT = new Date($scope.$parent.$parent.$parent.$parent.$parent.firstFullDate_history);
                    break;
                case "2":
                    $scope.myDT = new Date($scope.$parent.$parent.$parent.$parent.$parent.firstFullDate_manager);
                    break;
                case "3":
                    $scope.myDT = new Date($scope.$parent.$parent.$parent.$parent.$parent.firstFullDate_executive);
                    break;
                case "5":
                    $scope.myDT = new Date($scope.$parent.$parent.$parent.$parent.$parent.firstFullDate_management);
                    break;
            }
        }

        $scope.shiftToFirstDayOfWeek = function (dom) {
            console.log(dom);
            $scope.myDT = new Date(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(dom.myDT)), 0));
        }

        $scope.x = {} ; // better would be to have module create an object
        $scope.x.f1 = function() {
            console.log('Call me as a string!');
        }

        $scope.callAttrFunction = function (methods, para1) {
            var evalString = "$scope." + methods + "(this, " + para1 + ")";
            eval(evalString);
        }
    }
})();