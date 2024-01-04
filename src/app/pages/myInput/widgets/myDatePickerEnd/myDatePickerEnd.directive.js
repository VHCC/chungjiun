/**
 * @author Ichen.chu
 * created on 03.12.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('myDatePickerEnd', myDatePickerEnd);

    /** @ngInject */
    function myDatePickerEnd() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'MyDatePickerEndCtrl',
            // template: "<div><h2>我叫{{name}}</h2></div>",
            link: function ($scope, elem, attrs) {
                $scope.format = attrs.formatted;
                $scope.myDT = new Date(attrs.default);
            },
            templateUrl: 'app/pages/myInput/widgets/myDatePickerEnd/myDatePickerEnd.html',
        };
    }
})();