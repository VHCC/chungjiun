/**
 * @author IChen.Chu
 * created on 09.15.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.inputs')
        .directive('cjSwitcher', cjSwitcher);

    /** @ngInject */
    function cjSwitcher() {
        console.log(this)
        return {
            templateUrl: 'app/theme/inputs/cjSwitcher/cjSwitcher.html',
            controller: 'DashboardCalendarCtrl',
            scope: {
                switcherStyle: '@',
                switcherValue: '='
                // switcherOn: '='
                // switcherOff: '='
            },
            link: function ($scope, elem, attrs) {
                $scope.switcherOff = attrs.switcherOff;
                $scope.switcherOn = attrs.switcherOn;
            },
        };
    }

})();
