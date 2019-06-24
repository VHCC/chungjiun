/**
 * @author Ichen.chu
 * created on 01.08.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('myMonthPicker',
            [
                'DateUtil',
                myMonthPicker
            ]);

    /** @ngInject */
    function myMonthPicker(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'myMonthPickerCtrl',
            link: function ($scope, elem, attrs) {
                $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myInput/widgets/myMonthPicker/myMonthPicker.html',
        };
    }
})();