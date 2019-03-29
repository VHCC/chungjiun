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
                if ($scope.workOffType) {
                    $scope.table.myHourDiff = $scope.getHourDiffByTime($scope.tableTimeStart, $scope.tableTimeEnd, $scope.workOffType.type);
                    console.log("MyTimePickerCtrl, type= " + $scope.workOffType.type + ", myHourDiff= " + $scope.table.myHourDiff);
                }
            },
            templateUrl: 'app/pages/myInput/widgets/myTimePicker/myTimePicker.html',
        };
    }
})();