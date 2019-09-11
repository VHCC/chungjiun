/**
 * @author Ichen.chu
 * created on 06.09.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('combineProject',
            [
                'DateUtil',
                combineProject
            ]);

    /** @ngInject */
    function combineProject(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'combineProjectCtrl',
            controllerAs: 'combineProjectCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load combineProject directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/myExecutive/createNewProject/combineProject/combineProject.html',
        };
    }
})();