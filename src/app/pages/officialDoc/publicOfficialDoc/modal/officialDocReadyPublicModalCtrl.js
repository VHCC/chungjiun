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
                'toastr',
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
                                               toastr,
                                               Project,
                                               OfficialDocUtil,
                                               OfficialDocVendorUtil,
                                               $uibModalInstance,
                                               TimeUtil,
                                               DateUtil) {
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.docData = $scope.$resolve.docData;
        $scope.canDeleteAttachments = $scope.$resolve.canDeleteAttachments;

        // initial
        var vm = this;
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
        $scope.sendArchive = function (docData, publicNumber) {
            console.log(docData);
            $scope.checkText = "請確認 歸檔文號為：" + publicNumber + docData.docDivision.name;
            $scope.docData = docData;
            $scope.docData.archiveNumber = publicNumber;
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
                archiveNumber: docData.archiveNumber,
                _id: docData._id,
                publicDate: moment(docData.publicDate).format("YYYY/MM/DD"),
                stageInfo: handleInfo,
                targetOrigin: docData.targetOrigin,
                targetCopy: docData.targetCopy,
                docType: docData.docOption.option,
                docDivision: docData.docDivision.option,
                publicType: docData.publicType.option,
                isDocClose: true,
                isDocPublic: true,
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    $uibModalInstance.close();

                })

            formData.tempFolderName = docData.tempFolderName;
            formData._archiveNumber = docData.archiveNumber + docData.docDivision.name

            OfficialDocUtil.renamePublicFolder(formData)
                .success(function (res) {
                    console.log(res);
                    $uibModalInstance.close();
                })
                .error(function (res) {
                    console.log(res);
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

        $scope.initDropZone = function () {
            var dropzone = new Dropzone('#demo-upload',
                {
                    url: "handle-upload.php",
                    previewTemplate: document.querySelector('#preview-template').innerHTML,
                    addRemoveLinks: true,
                    dictRemoveFile: "移除",
                    parallelUploads: 2,
                    thumbnailHeight: 120,
                    thumbnailWidth: 120,
                    maxFilesize: 500, // MB
                    filesizeBase: 1000,
                    // acceptedFiles: ".pdf",
                    thumbnail: function (file, dataUrl) {
                        if (file.previewElement) {
                            file.previewElement.classList.remove("dz-file-preview");
                            var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                            for (var i = 0; i < images.length; i++) {
                                var thumbnailElement = images[i];
                                thumbnailElement.alt = file.name;
                                thumbnailElement.src = dataUrl;
                            }
                            setTimeout(function () {
                                file.previewElement.classList.add("dz-image-preview");
                            }, 1);
                        }
                    },

                    removedfile: function (file) {
                        // console.log(file);
                        if (file.previewElement != null && file.previewElement.parentNode != null) {
                            file.previewElement.parentNode.removeChild(file.previewElement);

                            var formData = {
                                fileName: file.name,
                                type: 0,
                                archiveNumber: $scope.docData.archiveNumber,
                            }

                            OfficialDocUtil.deleteOfficialDocFile_public_fs(formData);
                        }
                    },

                    success: function (file) {
                        // console.log(file);
                        var uploadData = new FormData();
                        // uploadData.append('userDID', $cookies.get('userDID') + fileUnique);
                        uploadData.append('folder', $scope.docData.archiveNumber);
                        uploadData.append('type', 0);
                        uploadData.append('fileName', file.name);
                        uploadData.append('file', file);

                        OfficialDocUtil.uploadOfficialDocFile_public_fs(uploadData);
                    },

                    error: function (file, message) {
                        // console.log(file);
                        // console.log(message);
                        if (file.previewElement != null && file.previewElement.parentNode != null) {
                            file.previewElement.parentNode.removeChild(file.previewElement);
                            // toastr.error('新增失敗', '只開放接收.pdf檔案');
                        }
                    },

                    // drop: function (event) {
                    //   console.log(event);
                    // },
                    //
                    // dragstart: function (event) {
                    //     console.log(event);
                    // },
                    //
                    // dragend: function (event) {
                    //     console.log(event);
                    // },
                    //
                    // dragenter: function (event) {
                    //     console.log(event);
                    // },
                    //
                    // dragover: function (event) { // 停留在zone
                    //     // console.log(event);
                    // },

                });

            // var dropzone_copy = new Dropzone('#demo-upload_copy',
            //     {
            //         url: "handle-upload.php",
            //         previewTemplate: document.querySelector('#preview-template').innerHTML,
            //         addRemoveLinks: true,
            //         dictRemoveFile: "移除",
            //         parallelUploads: 2,
            //         thumbnailHeight: 120,
            //         thumbnailWidth: 120,
            //         maxFilesize: 500, // MB
            //         filesizeBase: 1000,
            //         // acceptedFiles: ".pdf",
            //         thumbnail: function (file, dataUrl) {
            //             if (file.previewElement) {
            //                 file.previewElement.classList.remove("dz-file-preview");
            //                 var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
            //                 for (var i = 0; i < images.length; i++) {
            //                     var thumbnailElement = images[i];
            //                     thumbnailElement.alt = file.name;
            //                     thumbnailElement.src = dataUrl;
            //                 }
            //                 setTimeout(function () {
            //                     file.previewElement.classList.add("dz-image-preview");
            //                 }, 1);
            //             }
            //         },
            //
            //         removedfile: function (file) {
            //             // console.log(file);
            //             if (file.previewElement != null && file.previewElement.parentNode != null) {
            //                 file.previewElement.parentNode.removeChild(file.previewElement);
            //
            //                 var formData = {
            //                     fileName: file.name,
            //                     type: 1,
            //                     archiveNumber: $scope.docData.archiveNumber,
            //                 }
            //
            //                 OfficialDocUtil.deleteOfficialDocFile_public_fs(formData);
            //             }
            //         },
            //
            //         success: function (file) {
            //             // console.log(file);
            //             var uploadData = new FormData();
            //             // uploadData.append('userDID', $cookies.get('userDID') + fileUnique);
            //             uploadData.append('folder', $scope.docData.archiveNumber);
            //             uploadData.append('type', 1);
            //             uploadData.append('fileName', file.name);
            //             uploadData.append('file', file);
            //
            //             OfficialDocUtil.uploadOfficialDocFile_public_fs(uploadData)
            //                 .success(function (res) {
            //                     $scope.fileList.push(file.name);
            //                 })
            //         },
            //
            //         error: function (file, message) {
            //             // console.log(file);
            //             // console.log(message);
            //             if (file.previewElement != null && file.previewElement.parentNode != null) {
            //                 file.previewElement.parentNode.removeChild(file.previewElement);
            //                 toastr.error('新增失敗', '只開放接收.pdf檔案');
            //             }
            //         },
            //
            //         // drop: function (event) {
            //         //   console.log(event);
            //         // },
            //         //
            //         // dragstart: function (event) {
            //         //     console.log(event);
            //         // },
            //         //
            //         // dragend: function (event) {
            //         //     console.log(event);
            //         // },
            //         //
            //         // dragenter: function (event) {
            //         //     console.log(event);
            //         // },
            //         //
            //         // dragover: function (event) { // 停留在zone
            //         //     // console.log(event);
            //         // },
            //
            //     });

            $scope.fileList = [];

            // Now fake the file upload, since GitHub does not handle file uploads
            // and returns a 404

            var minSteps = 6,
                maxSteps = 60,
                timeBetweenSteps = 100,
                bytesPerStep = 100000;

            dropzone.uploadFiles = function (files) {
                var self = this;

                for (var i = 0; i < files.length; i++) {

                    var file = files[i];
                    var totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

                    for (var step = 0; step < totalSteps; step++) {
                        var duration = timeBetweenSteps * (step + 1);
                        setTimeout(function (file, totalSteps, step) {
                            return function () {
                                file.upload = {
                                    progress: 100 * (step + 1) / totalSteps,
                                    total: file.size,
                                    bytesSent: (step + 1) * file.size / totalSteps
                                };

                                self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
                                if (file.upload.progress == 100) {
                                    file.status = Dropzone.SUCCESS;
                                    self.emit("success", file, 'success', null);
                                    self.emit("complete", file);
                                    self.processQueue();
                                    // document.getElementsByClassName("dz-success-mark")[0].style.opacity = "1";
                                }
                            };
                        }(file, totalSteps, step), duration);
                    }
                }
            }

            // dropzone_copy.uploadFiles = function (files) {
            //     var self = this;
            //
            //     for (var i = 0; i < files.length; i++) {
            //
            //         var file = files[i];
            //         var totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));
            //
            //         for (var step = 0; step < totalSteps; step++) {
            //             var duration = timeBetweenSteps * (step + 1);
            //             setTimeout(function (file, totalSteps, step) {
            //                 return function () {
            //                     file.upload = {
            //                         progress: 100 * (step + 1) / totalSteps,
            //                         total: file.size,
            //                         bytesSent: (step + 1) * file.size / totalSteps
            //                     };
            //
            //                     self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
            //                     if (file.upload.progress == 100) {
            //                         file.status = Dropzone.SUCCESS;
            //                         self.emit("success", file, 'success', null);
            //                         self.emit("complete", file);
            //                         self.processQueue();
            //                         // document.getElementsByClassName("dz-success-mark")[0].style.opacity = "1";
            //                     }
            //                 };
            //             }(file, totalSteps, step), duration);
            //         }
            //     }
            // }
        }

        // 0 : 函
        // 1 : 會勘
        // 2 : 開會
        // 3 : 書函
        // 4 : 紀錄
        var options_regular = [
            {
                name: "函",
                option: 0
            },
            {
                name: "會勘",
                option: 1
            },
            {
                name: "開會",
                option: 2
            },
            {
                name: "書函",
                option: 3
            },
            {
                name: "紀錄",
                option: 4
            },
        ];

        vm.docOptions = options_regular;

        // 0 : F
        // 1 : N
        // 2 : G
        // 3 : D
        // 4 : P
        var division_regular = [
            {
                name: "F",
                option: 0
            },
            {
                name: "N",
                option: 1
            },
            {
                name: "G",
                option: 2
            },
            {
                name: "D",
                option: 3
            },
            {
                name: "P",
                option: 4
            },
        ];

        vm.docDivisions = division_regular;

        // 0 : 電子
        // 1 : 紙本
        // 發文屬性
        var publicType_regular = [
            {
                name: "電子",
                option: 0
            },
            {
                name: "紙本",
                option: 1
            },
        ];

        vm.publicTypes = publicType_regular;

        $scope.fetchVendor = function () {
            OfficialDocVendorUtil.fetchOfficialDocVendor()
                .success(function (res) {
                    vm.officialDocVendors = res.payload;
                    vm.officialDocVendors_copy = res.payload;
                })
                .error(function (res) {
                    console.log(res);
                })
        }

        $scope.fetchVendor();


        // check doc detail
        $scope.checkDocDetail = function (docData) {
            console.log(docData);
            console.log(vm);

            if (!vm._officialPublicDate || vm._officialPublicDate=="Invalid Date") {
                toastr.error('注意', '請選擇發文日期');
                return
            }

            if (!vm.docDivision) {
                toastr.error('注意', '請選擇分部');
                return
            }

            if (!vm.docOption) {
                toastr.error('注意', '請選擇文別');
                return
            }

            if (!vm.publicType) {
                toastr.error('注意', '請選擇發文類型');
                return
            }

            if (!vm.targetOrigin) {
                toastr.error('注意', '請選擇正本受文機關');
                return
            }

            // if (!vm.vendorItem) {
            //     toastr.error('注意', '請選擇發文機關');
            //     return
            // }

            // if (!vm.prjItems) {
            //     toastr.error('注意', '請選擇專案代碼');
            //     return
            // }

            // if (!vm.chargeUser) {
            //     toastr.error('注意', '請選擇專案承辦人');
            //     return
            // }

            // var stageInfo = {
            //     timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
            //     stage: "收文建檔",
            //     handleName: $scope.username
            // }

            // var isAttached = $scope.fileList.length > 0 ? true : false;


            var docData_form = {
                _id: $scope.docData._id,
                // _archiveNumber: docData._archiveNumber,
                // _receiveType: docData._receiveType,
                // _receiveNumber: docData._receiveNumber,
                // _subject: docData._subject,
                // _receiveDate: $scope._receiveDate,
                // _lastDate: $scope._lastDate,
                // _dueDate: $scope._dueDate,
                publicDate: vm._officialPublicDate,
                // vendorItem: vm.vendorItem.selected,
                // prjItem: vm.prjItems.selected,
                // chargeUser: vm.chargeUser.selected,
                // signer: vm.signer.selected,
                docOption: vm.docOption.selected,
                docDivision: vm.docDivision.selected,
                publicType: vm.publicType.selected,
                targetOrigin: vm.targetOrigin.selected,
                targetCopy: vm.targetCopy ? vm.targetCopy.selected : "",
                // docAttachedType: vm.docAttachedType.selected,
                // timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
                // isDocSignStage: $scope.docData.isDocSignStage,
                stageInfo: docData.stageInfo,
                // isAttached: isAttached,
                // publicMemo: vm.publicMemo,
                tempFolderName: $scope.docData.archiveNumber
            }

            console.log(docData_form);

            var formData = {
                docDivision: vm.docDivision.selected.option,
                publicDate: vm._officialPublicDate,
                type: 1
            }

            OfficialDocUtil.generatePublicNumber_public(formData)
                .success(function (res) {
                    console.log(res);

                    var publicNumber = res.payload;

                    $scope.sendArchive(docData_form, publicNumber);

                })
        };

        $scope.setDateModel = function (modelName, dom) {
            var evalString = 'vm.' + modelName + "= dom.myDT";
            eval(evalString);
        }
    }

})();