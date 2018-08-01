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
            controller: 'MyMonthPickerCtrl',
            // template: "<div><h2>我叫{{name}}</h2></div>",
            link: function ($scope, elem, attrs) {
                $scope.format = attrs.formatted;
                $scope.myMonth = attrs.default === undefined ? moment(new Date()).format('YYYY/MM') : new Date(attrs.default);
            },
            templateUrl: 'app/pages/myInput/widgets/myMonthPicker/myMonthPicker.html',
        };
    }
})();