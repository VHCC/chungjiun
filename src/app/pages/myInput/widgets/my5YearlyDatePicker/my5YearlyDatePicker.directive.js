/**
 * @author IChen.chu
 * created on 20.12.2021
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('my5YearlyDatePicker',
            [
                'DateUtil',
                my5YearlyDatePicker
            ]);

    /** @ngInject */
    function my5YearlyDatePicker(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'My5YearlyDatePickerCtrl',
            link: function ($scope, elem, attrs) {
                // $scope.function1 = attrs.function1;
                // $scope.viewType = attrs.type;
                // $scope.format = attrs.formatted;
                // $scope.myDT = attrs.default === undefined ? new Date(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0)) : new Date(attrs.default);
            },
            templateUrl: 'app/pages/myInput/widgets/my5YearlyDatePicker/my5YearlyDatePicker.html',
        };
    }
})();