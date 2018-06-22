/**
 * @author Ichen.chu
 * created on 22.06.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('myWeeklyDatePicker',
            [
                'DateUtil',
                myWeeklyDatePicker
            ]);

    /** @ngInject */
    function myWeeklyDatePicker(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'MyWeeklyDatePickerCtrl',
            // template: "<div><h2>我叫{{name}}</h2></div>",
            link: function ($scope, elem, attrs) {
                $scope.function1 = attrs.function1;
                $scope.viewType = attrs.type;
                $scope.format = attrs.formatted;
                $scope.myDT = attrs.default === undefined ? new Date(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0)) : new Date(attrs.default);
            },
            templateUrl: 'app/pages/myInput/widgets/myWeeklyDatePicker/myWeeklyDatePicker.html',
        };
    }
})();