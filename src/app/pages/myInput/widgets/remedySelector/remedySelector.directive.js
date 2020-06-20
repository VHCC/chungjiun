/**
 * @author Ichen.chu
 * created on 18.06.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('remedySelector', remedySelector);

    /** @ngInject */
    function remedySelector() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'RemedySelectorCtrl',
            link: function ($scope, elem, attrs) {
                $scope.remedyTypeChange(parseInt(attrs.type));
            },
            templateUrl: 'app/pages/myInput/widgets/remedySelector/remedySelector.html',
        };
    }
})();