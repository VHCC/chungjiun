/**
 * @author IChen.Chu
 * created on 13.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('officialDocReadyPublicModalCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$uibModal',
                'ngDialog',
                'User',
                'Project',
                'OfficialDocUtil',
                'OfficialDocVendorUtil',
                '$uibModalInstance',
                'TimeUtil',
                'DateUtil',
                OfficialDocDetailCheckerModalCtrl
            ]);

    /** @ngInject */
    function OfficialDocDetailCheckerModalCtrl($scope,
                                               $filter,
                                               $cookies,
                                               $uibModal,
                                               ngDialog,
                                               User,
                                               Project,
                                               OfficialDocUtil,
                                               OfficialDocVendorUtil,
                                               $uibModalInstance,
                                               TimeUtil,
                                               DateUtil) {
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.docData = $scope.$resolve.docData;
        $scope.canDelete = $scope.$resolve.canDelete;

        // initial
        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');

        Project.findAll()
            .success(function (relatedProjects) {
                $scope.relatedProjects = [];
                for (var i = 0; i < relatedProjects.length; i++) {
                    $scope.relatedProjects[i] = {
                        value: relatedProjects[i]._id,
                        managerID: relatedProjects[i].managerID,
                        majorID: relatedProjects[i].majorID
                    };
                }
            });

        User.getAllUsers()
            .success(function (allUsers) {
                // console.log(allUsers);
                // 經理、主承辦
                $scope.allUsers = [];
                $scope.allUsers[0] = {
                    value: "",
                    name: "None"
                };
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.allUsers[i] = {
                        value: allUsers[i]._id,
                        name: allUsers[i].name
                    };
                }
            })

        OfficialDocVendorUtil.fetchOfficialDocVendor()
            .success(function (response) {
                // console.log(response);
                $scope.allVendors = [];
                $scope.allVendors[0] = {
                    value: "",
                    name: "None"
                };
                for (var i = 0; i < response.payload.length; i++) {
                    $scope.allVendors[i] = {
                        value: response.payload[i]._id,
                        name: response.payload[i].vendorName
                    };
                }
            })

        // *** Biz Logic ***
        $scope.showDocType = function (type) {
            return OfficialDocUtil.getDocType(type);
        }

        $scope.showDocPublicType = function (type) {
            return OfficialDocUtil.getDocPublicType(type);
        }

        $scope.showReceiver = function (officialItem) {
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (officialItem.creatorDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: officialItem.creatorDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showCharger = function (officialItem) {
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (officialItem.chargerDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: officialItem.chargerDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showMajor = function (officialItem) {
            var selected = [];
            if ($scope.relatedProjects === undefined) return;
            if (officialItem.prjDID) {
                selected = $filter('filter')($scope.relatedProjects, {
                    value: officialItem.prjDID
                });
            }
            var selected_major = [];
            if (selected.length) {
                selected_major = $filter('filter')($scope.allUsers, {
                    value: selected[0].majorID
                });
            }
            return selected_major.length ? selected_major[0].name : 'Not Set';
        }

        $scope.showVendorName = function (officialItem) {
            var selected = [];
            if ($scope.allVendors === undefined) return;
            if (officialItem.vendorDID) {
                selected = $filter('filter')($scope.allVendors, {
                    value: officialItem.vendorDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showManagerID = function (officialItem) {
            var selected = [];
            if ($scope.relatedProjects === undefined) return;
            if (officialItem.prjDID) {
                selected = $filter('filter')($scope.relatedProjects, {
                    value: officialItem.prjDID
                });
            }

            return selected.length ? selected[0].managerID : 'Not Set';
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

            if ($scope.docData.targetCopy[0] == null) {
                return ""
            }

            for (var index = 0; index < $scope.docData.targetCopy.length; index ++) {
                result += $scope.docData.targetCopy[index].vendorName + ", ";
            }
            return result;
        }


        $scope.pdfList = undefined;

        // pdf 檔案列表
        $scope.fetchPDFFilesPublic = function (type) {

            var formData = {
                userDID: $cookies.get('userDID'),
                archiveNumber: $scope.docData.archiveNumber,
                type: type,
            }

            OfficialDocUtil.fetchOfficialDocFiles_public(formData)
                .success(function (res) {
                    switch (type) {
                        case 0:
                            $scope.pdfList = res.payload;
                            break;
                        case 1:
                            $scope.pdfListCopy = res.payload;
                            break;
                    }
                })
        }

        // show pdf View
        $scope.showPDFOrigin = function (dom, docData) {
            $uibModal.open({
                animation: true,
                controller: 'officialDocPDFViewerPublicModalCtrl',
                templateUrl: 'app/pages/officialDoc/receiveOfficialDoc/modal/officialDocPDFViewerModal.html',
                resolve: {
                    parent: function () {
                        return $scope;
                    },
                    dom: function () {
                        return dom;
                    },
                    docData: function () {
                        return docData;
                    },
                    isCopy: function() {
                        return false;
                    },
                }
            }).result.then(function (data) {

            });
        };

        // show pdf View
        $scope.showPDFCopy = function (dom, docData) {
            $uibModal.open({
                animation: true,
                controller: 'officialDocPDFViewerPublicModalCtrl',
                templateUrl: 'app/pages/officialDoc/receiveOfficialDoc/modal/officialDocPDFViewerModal.html',
                resolve: {
                    parent: function () {
                        return $scope;
                    },
                    dom: function () {
                        return dom;
                    },
                    docData: function () {
                        return docData;
                    },
                    isCopy: function() {
                        return true;
                    },
                }
            }).result.then(function (data) {

            });
        };

        $scope.downloadCJFile = function (dom, isCopy) {
            var formData = {
                archiveNumber: $scope.docData.archiveNumber,
                fileName: dom.$parent.$parent.pdfItem.name,
                isCopy: isCopy
            }

            OfficialDocUtil.downloadOfficialDocFile_public(formData)
                .success(function (res) {

                    var saveByteArray = (function () {
                        var a = document.createElement("a");
                        document.body.appendChild(a);
                        a.style = "display: none";
                        return function (data, fileName) {
                            var blob = new Blob(data, {type: "octet/stream"}),
                                url = window.URL.createObjectURL(blob);
                            a.href = url;
                            a.download = fileName;
                            a.click();
                            window.URL.revokeObjectURL(url);
                        };
                    }());

                    var downloadDataBuffer = base64ToArrayBuffer(res);
                    saveByteArray([downloadDataBuffer], moment().format('YYYYMMDD_HHmmss') + "_" + dom.$parent.$parent.pdfItem.name);
                })
        }

        function base64ToArrayBuffer(base64) {
            var binaryString =  window.atob(base64);
            var binaryLen = binaryString.length;
            var bytes = new Uint8Array(binaryLen);
            for (var i = 0; i < binaryLen; i++)        {
                var ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
            }
            return bytes;
        }

        // main
        // // 提交審查
        // $scope.sendPublic = function (dom, docData) {
        //     $scope.checkText = "同意發文：" + dom.handleRecord;
        //     $scope.handleRecord = dom.handleRecord;
        //     $scope.docData = docData;
        //     ngDialog.open({
        //         template: 'app/pages/officialDoc/publicOfficialDoc/dialog/checkPublicOfficialDocReviewSend_Modal.html',
        //         className: 'ngdialog-theme-default',
        //         scope: $scope,
        //         showClose: false,
        //     });
        // }
        //
        // $scope.updateOfficialDocToServerPublic = function(docData, handleRecord) {
        //     var handleInfo = docData.stageInfo;
        //
        //     var stageInfoHandle = {
        //         timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
        //         stage: "同意發文",
        //         handleName: $scope.username,
        //         handleRecord: handleRecord
        //     }
        //
        //     handleInfo.push(stageInfoHandle);
        //
        //     var formData = {
        //         _id: docData._id,
        //         stageInfo: handleInfo,
        //         isDocCanPublic: true
        //     }
        //     OfficialDocUtil.updateOfficialDocItem(formData)
        //         .success(function (res) {
        //             $uibModalInstance.close();
        //         })
        // }

        // 提交歸檔
        $scope.sendArchive = function (dom, docData) {
            $scope.checkText = "是否歸檔：" + docData.archiveNumber;
            $scope.docData = docData;
            ngDialog.open({
                template: 'app/pages/officialDoc/handleOfficialDoc/dialog/closeOfficialDocReviewSend_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.updateOfficialDocToServer_Archive = function(docData) {

            var handleInfo = docData.stageInfo;

            var stageInfoHandle = {
                timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                stage: "發文歸檔",
                handleName: $scope.username,
            }

            handleInfo.push(stageInfoHandle);

            var formData = {
                _id: docData._id,
                stageInfo: handleInfo,
                isDocClose: true,
                isDocPublic: true,
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    $uibModalInstance.close();

                })
        }

        $scope.deletePublicDocFile = function (docData, pdfItem, type) {

            var formData = {
                archiveNumber: docData.archiveNumber,
                fileName: pdfItem.name,
                type: type,
            }

            OfficialDocUtil.deleteOfficialDocFile_public_fs(formData)
                .success(function (resp) {
                    $scope.fetchPDFFilesPublic(type);
                })
        }


    }

})();