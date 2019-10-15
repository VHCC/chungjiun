/**
 * @author Ichen.chu
 * created on 10.05.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('officialVendor',
            [
                'DateUtil',
                OfficialVendor
            ]);

    /** @ngInject */
    function OfficialVendor(DateUtil) {
        return {
            replace: true,
            restrict: 'E',
            controller: 'officialDocVendorCtrl',
            controllerAs: 'officialDocVendorCtrlVm',
            link: function ($scope, elem, attrs) {
                console.log("load officialVendor directive");
                // $scope.format = attrs.formatted == undefined ? 'YYYY/MM' : attrs.formatted;
                // $scope.myMonth = attrs.default === undefined ? moment(new Date()).format($scope.format) : new Date(attrs.default);
                // $scope.qqqqqwww();
            },
            templateUrl: 'app/pages/officialDoc/receiveOfficialDoc/vendorTab/receiveOfficialDocVendor.html',
        };
    }
})();