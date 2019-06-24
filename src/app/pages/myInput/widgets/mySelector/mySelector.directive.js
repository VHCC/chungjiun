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
                if (attrs.showtype == 1) { // 補休特休兌換
                    $scope.loadUserWorkOffExchangeForm();
                } else {
                    $scope.loadUserWorkOffForm(JSON.parse(attrs.form));
                }
                $scope.workOffTypeChange(parseInt(attrs.type));
            },
            templateUrl: 'app/pages/myInput/widgets/mySelector/mySelector.html',
        };
    }
})();