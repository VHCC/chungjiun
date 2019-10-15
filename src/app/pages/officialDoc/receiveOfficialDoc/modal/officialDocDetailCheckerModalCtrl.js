/**
 * @author IChen.Chu
 * created on 13.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('officialDocDetailCheckerModalCtrl',
            [
                '$scope',
                '$cookies',
                '$uibModalInstance',
                'TimeUtil',
                'DateUtil',
                'OfficialDocUtil',
                OfficialDocDetailCheckerModalCtrl
            ]);

    /** @ngInject */
    function OfficialDocDetailCheckerModalCtrl($scope,
                                           $cookies,
                                           $uibModalInstance,
                                           TimeUtil,
                                           DateUtil,
                                           OfficialDocUtil) {
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.docData = $scope.$resolve.docData;

        // initial
        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');

        $scope.docData._receiveDate = moment($scope.docData._receiveDate).format('YYYY/MM/DD');
        $scope.docData._dueDate = moment($scope.docData._dueDate).format('YYYY/MM/DD');
        $scope.docData.creatorDID = $scope.userDID;

        $scope.confirmCreateDoc = function () {

            var formData = $scope.docData;

            OfficialDocUtil.createOfficialDocItem(formData)
                .success(function (res) {
                    console.log(res);
                    $uibModalInstance.close();
                })
                .error(function (res) {
                    console.log(res);
                    $uibModalInstance.close();
                })



        }

    }

})();