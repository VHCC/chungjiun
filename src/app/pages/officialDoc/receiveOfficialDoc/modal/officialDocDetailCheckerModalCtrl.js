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
                'toastr',
                'OfficialDocUtil',
                OfficialDocDetailCheckerModalCtrl
            ]);

    /** @ngInject */
    function OfficialDocDetailCheckerModalCtrl($scope,
                                           $cookies,
                                           $uibModalInstance,
                                           TimeUtil,
                                           DateUtil,
                                           toastr,
                                           OfficialDocUtil) {
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.docData = $scope.$resolve.docData;
        $scope.folderDir = $scope.$resolve.folderDir;

        // initial
        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');

        $scope.docData._receiveDate = moment($scope.docData._receiveDate).format('YYYY/MM/DD');
        $scope.docData._lastDate = moment($scope.docData._lastDate).format('YYYY/MM/DD');
        $scope.docData._dueDate = moment($scope.docData._dueDate).format('YYYY/MM/DD');
        $scope.docData._officialPublicDate = moment($scope.docData._officialPublicDate).format('YYYY/MM/DD');

        $scope.docData.creatorDID = $scope.userDID; // 收文人

        $scope.confirmCreateDoc = function () {

            var formData = {
                docDivision: $scope.docData.docDivision.option,
                receiveDate: $scope.docData._receiveDate,
                type: 0
            }

            OfficialDocUtil.generateReceiveNumber(formData)
                .success(function (res) {

                    var archiveNumber = res.payload;

                    toastr.error('收文文號', $scope.docData.docDivision.name + archiveNumber);


                    var formData = {
                        // _archiveNumber: $scope.docData._archiveNumber,
                        _archiveNumber: $scope.docData.docDivision.name + archiveNumber,
                        userDID: $scope.folderDir,
                    }


                    OfficialDocUtil.createPDFFolder(formData)
                        .success(function (res) {
                            var formData = $scope.docData;
                            formData._archiveNumber = archiveNumber;

                            OfficialDocUtil.createOfficialDocItem(formData)
                                .success(function (res) {
                                    console.log(res);
                                    $uibModalInstance.close();
                                })
                                .error(function (res) {
                                    console.log(res);
                                    $uibModalInstance.close();
                                })
                        })

                })




        }

    }

})();