/**
 * @author Ichen.chu
 * created on 03.12.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('myDatePicker', myDatePicker);

    /** @ngInject */
    function myDatePicker() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'MyDatePickerCtrl',
            // template: "<div><h2>我叫{{name}}</h2></div>",
            link: function ($scope, elem, attrs) {
                $scope.format = attrs.format;
            },
            templateUrl: 'app/pages/myInput/widgets/myDatePicker/myDatePicker.html',
        };
    }
})();