/**
 * @author Ichen.chu
 * created on 04.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('myTimePickerSingle', myTimePickerSingle);

    /** @ngInject */
    function myTimePickerSingle() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                time: "@",
                timetype: "=",
            },
            controller: 'MyTimePickerSingleCtrl',
            link: function ($scope, elem, attrs) {
                // $scope.tableTimeEnd = attrs.end;
                // $scope.table.myHourDiff = "-";
                // if ($scope.workOffType) {
                //     $scope.table.myHourDiff = $scope.getHourDiffByTime($scope.tableTimeStart, $scope.tableTimeEnd, $scope.workOffType.type);
                //     // console.log("MyTimePickerCtrl, type= " + $scope.workOffType.type + ", myHourDiff= " + $scope.table.myHourDiff);
                // }

                $('.disableTimeRangesExample').mask('H0:D0', {
                    translation: {
                        'H': {
                            pattern: /[012]/,
                        },
                        'D': {
                            pattern: /[012345]/,
                        }
                    },
                    placeholder: "__ : __"
                });
            },
            templateUrl: 'app/pages/myInput/widgets/myTimePickerSingle/myTimePickerSingle.html',
        };
    }
})();