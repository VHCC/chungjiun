/**
 * @author Ichen.chu
 * created on 04.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('myTimePicker', myTimePicker);

    /** @ngInject */
    function myTimePicker() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'MyTimePickerCtrl',
            link: function ($scope, elem, attrs) {
                $scope.tableTimeStart = attrs.start;
                $scope.tableTimeEnd = attrs.end;
                $scope.table.myHourDiff = $scope.getHourDiffByTime($scope.tableTimeStart, $scope.tableTimeEnd);
            },
            templateUrl: 'app/pages/myInput/widgets/myTimePicker/myTimePicker.html',
        };
    }
})();