/**
 * @author IChen.Chu
 * created on 21.02.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('officialDocDetailPublicModifiedModalCtrl',
            [
                '$scope',
                '$cookies',
                '$uibModalInstance',
                'TimeUtil',
                'DateUtil',
                'toastr',
                'OfficialDocUtil',
                OfficialDocDetailPublicModifiedModalCtrl
            ]);

    /** @ngInject */
    function OfficialDocDetailPublicModifiedModalCtrl($scope,
                                           $cookies,
                                           $uibModalInstance,
                                           TimeUtil,
                                           DateUtil,
                                           toastr,
                                           OfficialDocUtil) {
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.docData = $scope.$resolve.docData;
        $scope.old_docData = $scope.$resolve.old_docData;
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

        var formData = {
            archiveNumber: $scope.docData._archiveNumber,
            docDivision: $scope.docData.docDivision.option,
            type: 1,
        }

        $scope.canModified = true;

        OfficialDocUtil.searchOfficialDocItem(formData)
            .success(function (resp) {
                // console.log(resp);
                $scope.canModified = true;
                if (resp.payload.length > 0) {
                    $scope.canModified = false;
                } else {
                    return;
                }

                if (resp.payload[0].archiveNumber == $scope.old_docData._archiveNumber &&
                    resp.payload[0].docDivision == $scope.old_docData.docDivision.option) {
                    // console.log($scope.old_docData);
                    $scope.canModified = true;
                }
            });

        console.log($scope.docData);

        var handlerDID = "";

        if ($scope.docData.isDocSignStage) {
            handlerDID = $scope.docData.signer._id
        } else {
            handlerDID = $scope.docData.chargeUser._id
        }


        $scope.confirmUpdateDoc = function () {

            var _year = moment($scope.docData._officialPublicDate).format('YYYY') - 1911;
            // console.log(_year);

            var _month = moment($scope.docData._officialPublicDate).format('MM');
            // console.log(_month);

            var formData = {
                _id: $scope.docData._id,
                year: _year,
                month: _month,

                vendorDID: $scope.docData.vendorItem._id,
                prjDID: $scope.docData.prjItem._id,
                prjCode: $scope.docData.prjItem.prjCode,

                receiveDate: $scope.docData._receiveDate,
                lastDate: $scope.docData._lastDate,
                dueDate: $scope.docData._dueDate,
                publicDate: $scope.docData._officialPublicDate,

                chargerDID: $scope.docData.chargeUser._id,
                signerDID: $scope.docData.signer._id,
                handlerDID: handlerDID,

                subject: $scope.docData._subject,
                archiveNumber: $scope.docData._archiveNumber,
                receiveType: $scope.docData._receiveType,
                receiveNumber: $scope.docData._receiveNumber,

                docType: $scope.docData.docOption.option,
                docDivision: $scope.docData.docDivision.option,
                publicType: $scope.docData.publicType.option,

                targetOrigin: $scope.docData.targetOrigin,
                targetCopy: $scope.docData.targetCopy,

                old_archiveNumber: $scope.old_docData._archiveNumber,
                old_docDivision: $scope.old_docData.docDivision,

                publicMemo: $scope.docData.publicMemo,

                type: 1
            }
            OfficialDocUtil.updateOfficialDocItem_public(formData)
                .success(function (res) {
                    $uibModalInstance.close();
                })

        }

        $scope.getDocDivision = function (division) {
            return OfficialDocUtil.getDivision(division);
        }

        $scope.showVendorNameList = function () {
            var result = "";
            for (var index = 0; index < $scope.docData.targetOrigin.length; index ++) {
                result += $scope.docData.targetOrigin[index].vendorName + ", ";
            }
            return result;
        }

        $scope.showVendorCopyNameList = function () {
            var result = "";
            for (var index = 0; index < $scope.docData.targetCopy.length; index ++) {
                result += $scope.docData.targetCopy[index].vendorName + ", ";
            }
            return result;
        }
    }

})();