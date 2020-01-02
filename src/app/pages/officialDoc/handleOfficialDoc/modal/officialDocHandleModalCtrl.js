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
        // 提交審查
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

        $scope.updateOfficialDocToServer = function(docData, handleRecord) {
            console.log(handleRecord);
            console.log(docData);

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
                handlerDID: docData.signerDID,
                isDocSignStage: true
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    console.log(res);

                    // docData.isDocSignStage = true;
                    $uibModalInstance.close();
                    // $scope.reloadDocData_handle();
                    //
                    // var formData = {
                    //     _id: docData._id,
                    //     isDocClose: false,
                    // }
                    //
                    // OfficialDocUtil.searchOfficialDocItem(formData)
                    //     .success(function (res) {
                    //         console.log(res.payload);
                    //         docData = res.payload[0];
                    //     })

                })
        }

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
                    // $scope.reloadDocData_handle();


                    // docData.isDocClose = true;
                    //
                    // var formData = {
                    //     _id: docData._id,
                    //     isDocClose: false,
                    // }
                    //
                    // OfficialDocUtil.searchOfficialDocItem(formData)
                    //     .success(function (res) {
                    //         console.log(res.payload);
                    //         docData = res.payload[0];
                    //     })

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
    }

})();