/**
 * @author IChen.Chu
 * created on 13.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('officialDocDetailModifiedModalCtrl',
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
            type: 0,
        }

        $scope.canModified = true;

        OfficialDocUtil.searchOfficialDocItem(formData)
            .success(function (resp) {
                console.log(resp);
                $scope.canModified = true;
                if (resp.payload.length > 0) {
                    $scope.canModified = false;
                } else {
                    return;
                }

                if (resp.payload[0].archiveNumber == $scope.old_docData._archiveNumber &&
                    resp.payload[0].docDivision == $scope.old_docData.docDivision.option) {
                    console.log($scope.old_docData);
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

            var _year = moment($scope.docData._receiveDate).format('YYYY') - 1911;
            console.log(_year);

            var _month = moment($scope.docData._receiveDate).format('MM');
            console.log(_month);

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
                officialPublicDate: $scope.docData._officialPublicDate,

                chargerDID: $scope.docData.chargeUser._id,
                signerDID: $scope.docData.signer._id,
                handlerDID: handlerDID,

                subject: $scope.docData._subject,
                archiveNumber: $scope.docData._archiveNumber,
                receiveType: $scope.docData._receiveType,
                receiveNumber: $scope.docData._receiveNumber,

                docType: $scope.docData.docOption.option,
                docDivision: $scope.docData.docDivision.option,
                docAttachedType: $scope.docData.docAttachedType.option,

                old_archiveNumber: $scope.old_docData._archiveNumber,
                old_docDivision: $scope.old_docData.docDivision

            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    console.log(res);
                    $uibModalInstance.close();
                })

            // OfficialDocUtil.generateReceiveNumber(formData)
            //     .success(function (res) {
            //
            //         var archiveNumber = res.payload;
            //
            //         toastr.error('收文文號', $scope.docData.docDivision.name + archiveNumber);
            //
            //
            //         var formData = {
            //             // _archiveNumber: $scope.docData._archiveNumber,
            //             _archiveNumber: $scope.docData.docDivision.name + archiveNumber,
            //             userDID: $scope.folderDir,
            //         }
            //
            //
            //         OfficialDocUtil.createPDFFolder(formData)
            //             .success(function (res) {
            //                 var formData = $scope.docData;
            //                 formData._archiveNumber = archiveNumber;
            //
            //                 OfficialDocUtil.createOfficialDocItem(formData)
            //                     .success(function (res) {
            //                         console.log(res);
            //                         $uibModalInstance.close();
            //                     })
            //                     .error(function (res) {
            //                         console.log(res);
            //                         $uibModalInstance.close();
            //                     })
            //             })
            //     })
        }

        $scope.getDocDivision = function (division) {
            return OfficialDocUtil.getDivision(division);
        }
    }

})();