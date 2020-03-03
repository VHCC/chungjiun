/**
 * @author IChen.Chu
 * created on 13.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('officialDocSignModalCtrl',
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

        Project.findAll()
            .success(function (relatedProjects) {
                $scope.relatedProjects = [];
                for (var i = 0; i < relatedProjects.length; i++) {
                    $scope.relatedProjects[i] = {
                        value: relatedProjects[i]._id,
                        managerID: relatedProjects[i].managerID
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

        $scope.showDocAttachedType = function (type) {
            return OfficialDocUtil.getDocAttachedType(type);
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

        $scope.showSigner = function (officialItem) {
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (officialItem.signerDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: officialItem.signerDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showManager = function (officialItem) {
            var selected = [];
            if ($scope.relatedProjects === undefined) return;
            if (officialItem.prjDID) {
                selected = $filter('filter')($scope.relatedProjects, {
                    value: officialItem.prjDID
                });
            }
            var selected_manager = [];
            if (selected.length) {
                selected_manager = $filter('filter')($scope.allUsers, {
                    value: selected[0].managerID
                });
            }
            return selected_manager.length ? selected_manager[0].name : 'Not Set';
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

        $scope.pdfList = undefined;

        // pdf 檔案列表
        $scope.fetchPDFFiles = function () {

            var formData = {
                userDID: $cookies.get('userDID'),
                archiveNumber: $scope.docData.archiveNumber,
            }

            OfficialDocUtil.fetchOfficialDocFiles(formData)
                .success(function (res) {
                    console.log(res);
                    $scope.pdfList = res.payload;
                })
        }

        // show pdf View
        $scope.showPDF = function (dom, docData) {
            console.log($scope);
            $uibModal.open({
                animation: true,
                controller: 'officialDocPDFViewerModalCtrl',
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
                }
            }).result.then(function (data) {

            });
        };

        $scope.downloadCJFile = function (dom) {
            var formData = {
                archiveNumber: $scope.docData.archiveNumber,
                fileName: dom.$parent.$parent.pdfItem.name
            }

            OfficialDocUtil.downloadOfficialDocFile(formData)
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

        // 提交修改
        $scope.sendModified = function (dom, docData) {

            $scope.checkText = "修改 內部處理期限：" + docData.lastDate + ", 最後期限：" +docData.dueDate ;
            $scope.modifiedMsg = "修改 內部處理期限：" + docData.lastDate + ", 最後期限：" +docData.dueDate;
            $scope.docData = docData;
            ngDialog.open({
                template: 'app/pages/officialDoc/handleOfficialDoc/dialog/signOfficialDocModifiedReviewSend_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.updateOfficialDocToServer_sign = function(docData, handleRecord) {

            var handleInfo = docData.stageInfo;

            var stageInfoHandle = {
                timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                stage: "修改",
                handleName: $scope.username,
                handleRecord: handleRecord,
            }

            handleInfo.push(stageInfoHandle);

            var formData = {
                _id: docData._id,
                stageInfo: handleInfo,
                lastDate: docData.lastDate,
                dueDate: docData.dueDate,
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    console.log(res);
                    $uibModalInstance.close();
                })
        }

        // main
        // 提交審查
        $scope.sendSign = function (dom, docData) {

            $scope.checkText = "審核情形：" + dom.handleResult;
            $scope.handleResult = dom.handleResult;
            $scope.docData = docData;
            ngDialog.open({
                template: 'app/pages/officialDoc/handleOfficialDoc/dialog/signOfficialDocReviewSend_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.updateOfficialDocToServer = function(docData,handleRecord, handleResult) {
            console.log(handleResult);
            console.log(docData);

            var handleInfo = docData.stageInfo;

            var stageInfoHandle = {
                timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                stage: "審核",
                handleName: $scope.username,
                handleResult: handleResult,
            }

            handleInfo.push(stageInfoHandle);

            var formData = {
                _id: docData._id,
                stageInfo: handleInfo,
                handlerDID: docData.chargerDID,
                isDocSignStage: false,
                isApproveDocClose: docData.isApproveDocClose
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    console.log(res);
                    // docData.isDocSignStage = false;

                    $uibModalInstance.close();

                })
        }

        var formData = {
            archiveNumber: $scope.docData.archiveNumber.substring(1, $scope.docData.archiveNumber.length),
            docDivision: $scope.docData.docDivision,
            type: 0,
        }

        $scope.canModified = true;

        console.log(formData);

        OfficialDocUtil.searchOfficialDocItem(formData)
            .success(function (resp) {
                console.log(resp);
                $scope.canModified = true;
                if (resp.payload[0].handlerDID != $scope.userDID) {
                    $scope.canModified = false;
                }

            });

        $scope.docLinkArray = [];

        $scope.fetchDocLinkData = function () {

            for (var index = 0 ;index < $scope.docData.docLink.length; index ++) {
                var formData = {
                    _id: $scope.docData.docLink[index]
                }
                OfficialDocUtil.searchOfficialDocItem(formData)
                    .success(function (resp) {

                        var docArchiveNumber = resp.payload[0].archiveNumber;
                        var linkTitle = ""

                        if (resp.payload[0].type == 0) {
                            linkTitle = OfficialDocUtil.getDivision(resp.payload[0].docDivision) + docArchiveNumber;
                        } else {
                            linkTitle = docArchiveNumber + OfficialDocUtil.getDivision(resp.payload[0].docDivision);
                        }
                        var docLinkItem = {
                            _id: resp.payload[0]._id,
                            linkTitle: linkTitle,
                            type: resp.payload[0].type
                        }
                        $scope.docLinkArray.push(docLinkItem);
                    });
            }
        }

        $scope.fetchDocLinkData();

        $scope.showDocLink = function (dom, rootDoc) {
            var formData = {
                _id: dom.docLink._id
            }
            OfficialDocUtil.searchOfficialDocItem(formData)
                .success(function (resp) {
                    console.log(resp);

                    if (resp.payload[0].type == 0) {
                        $uibModal.open({
                            animation: true,
                            controller: 'officialDocLinkInfoModalCtrl',
                            templateUrl: 'app/pages/officialDoc/handleOfficialDoc/modal/docLink/officialDocLinkInfoModal.html',
                            size: 'lg',
                            resolve: {
                                docData: function () {
                                    return resp.payload[0];
                                },
                                rootDoc: function () {
                                    return rootDoc;
                                },
                                parent: function () {
                                    return $scope;
                                },
                                canRemoveLink: function () {
                                    return false;
                                }
                            }
                        }).result.then(function () {
                            // toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
                        });
                    } else {
                        $uibModal.open({
                            animation: true,
                            controller: 'officialDocLinkInfoPublicModalCtrl',
                            templateUrl: 'app/pages/officialDoc/handleOfficialDoc/modal/docLink/officialDocLinkInfoPublicModal.html',
                            size: 'lg',
                            resolve: {
                                docData: function () {
                                    return resp.payload[0];
                                },
                                rootDoc: function () {
                                    return rootDoc;
                                },
                                parent: function () {
                                    return $scope;
                                },
                                canRemoveLink: function () {
                                    return false;
                                }
                            }
                        }).result.then(function () {
                            // toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
                        });
                    }

                });
        }

        $(document).ready(function () {

            // $('.datePicker').mask('M0/D0', {
            //     translation: {
            //         'M': {
            //             pattern: /[01]/,
            //         },
            //         'D': {
            //             pattern: /[0123]/,
            //         }
            //     }
            // });

        });
    }

})();