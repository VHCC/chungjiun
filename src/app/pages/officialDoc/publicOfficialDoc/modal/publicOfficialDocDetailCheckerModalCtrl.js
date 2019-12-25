/**
 * @author IChen.Chu
 * created on 13.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('publicOfficialDocDetailCheckerModalCtrl',
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

        // $scope.docData._receiveDate = moment($scope.docData._receiveDate).format('YYYY/MM/DD');
        // $scope.docData._lastDate = moment($scope.docData._lastDate).format('YYYY/MM/DD');
        // $scope.docData._dueDate = moment($scope.docData._dueDate).format('YYYY/MM/DD');
        $scope.docData._publicDate = moment($scope.docData._publicDate).format('YYYY/MM/DD');

        $scope.docData.creatorDID = $scope.userDID; // 收文人

        $scope.confirmCreateDocPublic = function () {

            var formData = {
                publicDate: $scope.docData._publicDate
            }


            OfficialDocUtil.generatePublicNumber_public(formData)
                .success(function (res) {
                    // console.log(res);

                    var publicNumber = res.payload;

                    toastr.error('發文文號', publicNumber);

                    var formData = {
                        _archiveNumber: publicNumber,
                        userDID: $scope.folderDir,
                    }

                    $scope.docData._archiveNumber = publicNumber;

                    console.log(formData);

                    OfficialDocUtil.createPDFFolder(formData)
                        .success(function (req) {
                            var formData = $scope.docData;

                            // console.log($scope.docData);

                            OfficialDocUtil.createOfficialDocItem_public(formData)
                                .success(function (res) {
                                    console.log(res);
                                    $uibModalInstance.close();
                                })
                                .error(function (res) {
                                    console.log(res);
                                    $uibModalInstance.close();
                                })
                        });
                })
        }

        $scope.showVendorNameList = function () {
            console.log($scope.docData.vendorItem);
            var result = "";
            for (var index = 0; index < $scope.docData.vendorItem.length; index ++) {
                result += $scope.docData.vendorItem[index].vendorName + ", ";
            }
            return result;
        }

        $scope.showVendorCopyNameList = function () {
            console.log($scope.docData.vendorItemCopy);
            var result = "";
            for (var index = 0; index < $scope.docData.vendorItemCopy.length; index ++) {
                result += $scope.docData.vendorItemCopy[index].vendorName + ", ";
            }
            return result;
        }

    }

})();