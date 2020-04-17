/**
 * @author IChen.Chu
 * created on 13.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('officialDocHandleModalCtrl',
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
                'OfficialDocNotifyUtil',
                '$uibModalInstance',
                'toastr',
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
                                               OfficialDocNotifyUtil,
                                               $uibModalInstance,
                                               toastr,
                                               TimeUtil,
                                               DateUtil) {
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.docData = $scope.$resolve.docData;

        // initial
        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');

        var vm = this;

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
                vm.counterSignUsers = allUsers.slice()
                vm.notifyUsers = allUsers.slice()
            })

        OfficialDocVendorUtil.fetchOfficialDocVendor()
            .success(function (response) {
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
            console.log(dom);

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
            var binaryString = window.atob(base64);
            var binaryLen = binaryString.length;
            var bytes = new Uint8Array(binaryLen);
            for (var i = 0; i < binaryLen; i++) {
                var ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
            }
            return bytes;
        }

        // main
        // 提交會簽
        $scope.sendProcessCounterSign = function (dom, docData, signSelected) {

            var signUsers = "empty";
            if (signSelected.length > 0) {
                signUsers = "";
            }
            for (var index = 0; index < signSelected.length; index++) {
                signUsers += signSelected[index].name + ", ";
            }

            $scope.checkText = "會簽人員：" + signUsers;
            $scope.signRecord = dom.signRecord;
            $scope.handleResult = "會簽給 " + signUsers;
            $scope.signSelected = signSelected;
            $scope.docData = docData;
            ngDialog.open({
                template: 'app/pages/officialDoc/handleOfficialDoc/dialog/handleOfficialDocReviewCounterSign_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.updateOfficialDocToServerCounterSign = function (docData, handleRecord, handleResult, signSelected) {

            var handleInfo = docData.stageInfo;
            var counterSignList = [];

            for (var index = 0; index < signSelected.length; index++) {
                var counterSign = {
                    _id: signSelected[index]._id,
                }
                counterSignList.push(counterSign);
            }

            var stageInfoHandle = {
                timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                stage: "開始會簽",
                handleName: "",
                handleRecord: handleRecord,
                handleResult: handleResult,
            }

            handleInfo.push(stageInfoHandle);

            var formData = {
                _id: docData._id,
                stageInfo: handleInfo,
                handlerDID: (docData.signerDID == undefined || docData.signerDID == null) ?
                    $scope.showManagerID(docData) : docData.signerDID,
                isDocSignStage: false,
                isCounterSign: true,
                counterSignList: counterSignList
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    $uibModalInstance.close();
                })
        }

        // main
        // 提交通知
        $scope.sendProcessNotify = function (dom, docData, notifySelected) {

            var notifyUsers = "empty";
            if (notifySelected.length > 0) {
                notifyUsers = "";
            }
            for (var index = 0; index < notifySelected.length; index++) {
                notifyUsers += notifySelected[index].name + ", ";
            }

            $scope.checkText = "通知人員：" + notifyUsers;
            $scope.notifyRecord = dom.notifyRecord;
            $scope.handleResult = "通知給 " + notifyUsers;
            $scope.notifySelected = notifySelected;
            $scope.docData = docData;
            ngDialog.open({
                template: 'app/pages/officialDoc/handleOfficialDoc/dialog/handleOfficialDocReviewNotify_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.createOfficialDocToServerNotify = function (docData,
                                                           handleRecord,
                                                           handleResult,
                                                           notifySelected) {

            var handleInfo = docData.stageInfo;
            var notifyUsersList = [];

            for (var index = 0; index < notifySelected.length; index++) {
                var counterSign = {
                    _id: notifySelected[index]._id,
                }
                notifyUsersList.push(counterSign);
            }

            var stageInfoHandle = {
                timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                stage: "發出通知",
                handleName: $scope.username,
                handleRecord: handleRecord,
                handleResult: handleResult,
            }

            handleInfo.push(stageInfoHandle);

            var formData = {
                _id: docData._id,
                stageInfo: handleInfo,
                // handlerDID: (docData.signerDID == undefined || docData.signerDID == null ) ?
                //     $scope.showManagerID(docData) : docData.signerDID,
                isDocSignStage: false,
                // isCounterSign: true,
                // counterSignList: notifyUsersList
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    var formData = {
                        creatorDID: $scope.userDID,
                        archiveNumber: docData.archiveNumber.substring(1, docData.archiveNumber.length),
                        docDivision: docData.docDivision,
                        notifyMsg: handleRecord,
                        type: 0,
                        notifyUsersList: notifyUsersList,
                    }
                    OfficialDocNotifyUtil.createOfficialDocNotify(formData)
                        .success(function (resp) {
                            console.log(resp);
                            $uibModalInstance.close();
                        })
                })
        }

        // main
        // 提交
        $scope.sendProcess = function (dom, docData) {
            $scope.checkText = "辦理情形：" + dom.handleRecord;
            $scope.handleRecord = dom.handleRecord;
            $scope.docData = docData;
            ngDialog.open({
                template: 'app/pages/officialDoc/handleOfficialDoc/dialog/handleOfficialDocReviewSend_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.updateOfficialDocToServer = function (docData, handleRecord) {
            var handleInfo = docData.stageInfo;

            var stageInfoHandle = {
                timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                stage: "辦理",
                handleName: $scope.username,
                handleRecord: handleRecord
            }

            handleInfo.push(stageInfoHandle);

            var formData = {
                _id: docData._id,
                stageInfo: handleInfo,
                // handlerDID: $scope.showManagerID(docData),
                handlerDID: (docData.signerDID == undefined || docData.signerDID == null) ?
                    $scope.showManagerID(docData) : docData.signerDID,
                isDocSignStage: true
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    console.log(res);

                    // docData.isDocSignStage = true;
                    $uibModalInstance.close();
                })
        }

        // 提交歸檔
        $scope.sendArchive = function (dom, docData) {
            $scope.checkText = "是否歸檔：" + docData.archiveNumber;
            $scope._docData = docData;
            ngDialog.open({
                template: 'app/pages/officialDoc/handleOfficialDoc/dialog/closeOfficialDocReviewSend_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.updateOfficialDocToServer_Archive = function (docData) {
            var handleInfo = docData.stageInfo;

            var stageInfoHandle = {
                timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                stage: "歸檔",
                handleName: $scope.username,
            }

            handleInfo.push(stageInfoHandle);

            var formData = {
                _id: docData._id,
                stageInfo: handleInfo,
                isDocClose: true
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    console.log(res);
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

        $scope.addDocLink = function (dom, docData) {
            console.log(docData);

            var docDivisionWord = dom.docLinkNumber.substring(0, 1);
            var docArchiveNumber = dom.docLinkNumber.substring(1, dom.docLinkNumber.length);
            var docType = 0;

            if (OfficialDocUtil.getDivisionNumber(docDivisionWord) < 0) {
                docDivisionWord = dom.docLinkNumber.substring(dom.docLinkNumber.length - 1, dom.docLinkNumber.length);
                docArchiveNumber = dom.docLinkNumber.substring(0, dom.docLinkNumber.length - 1);
                docType = 1;
            }

            var formData = {
                archiveNumber: docArchiveNumber,
                docDivision: OfficialDocUtil.getDivisionNumber(docDivisionWord),
                type: docType,
            }

            OfficialDocUtil.searchOfficialDocItem(formData)
                .success(function (resp) {
                    console.log(resp);
                    if (resp.payload.length == 0) {
                        toastr.error('注意', dom.docLinkNumber + '公文不存在！');
                    } else {

                        if (resp.payload[0]._id == docData._id) {
                            toastr.error('注意', '不可連結此公文');
                            return;
                        }

                        if (docData.docLink.includes(resp.payload[0]._id)) {
                            toastr.error('注意', '已經有此公文 ' + dom.docLinkNumber);
                            return;
                        }


                        $scope.checkText = "是否新增連結：" + dom.docLinkNumber;
                        $scope.docData = docData;
                        $scope.linkData = resp.payload[0];
                        ngDialog.open({
                            template: 'app/pages/officialDoc/handleOfficialDoc/dialog/handleOfficialDocAddDocLinkSend_Modal.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            showClose: false,
                        });
                    }
                });
        }

        $scope.addDocLinkOfficialDocToServer = function (docData, linkData) {
            // var handleInfo = docData.stageInfo;

            // var stageInfoHandle = {
            //     timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
            //     stage: "辦理",
            //     handleName: $scope.username,
            //     handleRecord: handleRecord
            // }
            //
            // handleInfo.push(stageInfoHandle);

            var docLink = docData.docLink;
            docLink.push(linkData._id)

            var formData = {
                _id: docData._id,
                docLink: docLink
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    console.log(res);
                    $uibModalInstance.close();
                })
        }

        $scope.docLinkArray = [];

        $scope.fetchDocLinkData = function () {

            for (var index = 0; index < $scope.docData.docLink.length; index++) {
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
                                    return true;
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
                                    return true;
                                }
                            }
                        }).result.then(function () {
                            // toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
                        });
                    }
                });
        }
    }

})();