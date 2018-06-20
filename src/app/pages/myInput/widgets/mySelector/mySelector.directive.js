/**
 * @author Ichen.chu
 * created on 03.12.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('mySelector', mySelector);

    /** @ngInject */
    function mySelector() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'MySelectorCtrl',
            link: function ($scope, elem, attrs) {
                $scope.workOffTypeChange(parseInt(attrs.type));
                $scope.loadUserWorkOffForm(JSON.parse(attrs.form));
            },
            templateUrl: 'app/pages/myInput/widgets/mySelector/mySelector.html',
        };
    }
})();