/**
 * @author Ichen.chu
 * created on 16.05.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('myYearPicker',
            [
                'DateUtil',
                myYearPicker
            ]);

    /** @ngInject */
    function myYearPicker(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'myYearPickerCtrl',
            link: function ($scope, elem, attrs) {
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myYear = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
            },
            templateUrl: 'app/pages/myInput/widgets/myYearPicker/myYearPicker.html',
        };
    }
})();