/**
 * @author IChen.Chu
 * created on 13.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('officialDocInfoPublicModalCtrl',
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

        // initial
        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.officialDocRight = $cookies.get('feature_official_doc') == "true";

        Project.findAll()
            .success(function (relatedProjects) {
                $scope.relatedProjects = [];
                for (var i = 0; i < relatedProjects.length; i++) {
                    $scope.relatedProjects[i] = {
                        value: relatedProjects[i]._id,
                        managerID: relatedProjects[i].managerID
                    };
                }
                // console.log($scope);
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

        $scope.showVendorName = function (officialItem) {
            // console.log(officialItem);
            // console.log($scope.allVendors);
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
                    console.log(res);
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
            // console.log($scope);
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
            console.log($scope);
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
            // console.log(dom);

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

        $scope.deleteDocItem = function (item, docData) {
            $scope.checkText = "是否刪除：" + docData.archiveNumber;
            $scope.docData = docData;
            ngDialog.open({
                template: 'app/pages/officialDoc/listOfficialDoc/dialog/deleteOfficialDocReviewSend_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.updateOfficialDocToServer_Delete = function(docData) {

            var formData = {
                _id: docData._id,
                folder: docData.archiveNumber
            }
            OfficialDocUtil.deleteOfficialDocItem_public(formData)
                .success(function (res) {
                    console.log(res);
                    window.location.reload();
                })
        }

    }

})();