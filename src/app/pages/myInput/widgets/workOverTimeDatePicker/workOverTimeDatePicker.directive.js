/**
 * @author IChen.chu
 * created on 01.07.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('workOverTimeDatePicker', workOverTimeDatePicker);

    /** @ngInject */
    function workOverTimeDatePicker() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'WorkOverTimeDatePickerCtrl',
            // template: "<div><h2>我叫{{name}}</h2></div>",
            link: function ($scope, elem, attrs) {
                console.log(attrs)
                $scope.format = attrs.formatted;
                $scope.isExecutive = attrs.isexecutive == "true";
                $scope.myDT = new Date(attrs.default);
            },
            templateUrl: 'app/pages/myInput/widgets/workOverTimeDatePicker/workOverTimeDatePicker.html',
        };
    }
})();