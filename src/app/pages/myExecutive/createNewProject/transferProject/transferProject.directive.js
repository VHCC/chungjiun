/**
 * @author Ichen.chu
 * created on 15.10.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('transferProject',
            [
                'DateUtil',
                transferProject
            ]);

    /** @ngInject */
    function transferProject(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'transferProjectCtrl',
            controllerAs: 'transferProjectCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load transferProject directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myExecutive/createNewProject/transferProject/transferProject.html',
        };
    }
})();