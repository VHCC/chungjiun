/**
 * @author Ichen.chu
 * created on 18.06.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('remedyTimePicker', remedyTimePicker);

    /** @ngInject */
    function remedyTimePicker() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'RemedyTimePickerCtrl',
            link: function ($scope, elem, attrs) {
                $scope.tableTimeStart = attrs.start;
                $scope.tableTimeEnd = attrs.end;
            },
            templateUrl: 'app/pages/myInput/widgets/remedyTimePicker/remedyTimePicker.html',
        };
    }
})();