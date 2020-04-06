(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('publicOfficialDocCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$uibModal',
                'Project',
                'User',
                'toastr',
                'OfficialDocVendorUtil',
                'OfficialDocUtil',
                PublicOfficialDocCtrl
            ])
    ;

    /**
     * @ngInject
     */
    function PublicOfficialDocCtrl($scope,
                                    $filter,
                                    $cookies,
                                    $uibModal,
                                    Project,
                                    User,
                                    toastr,
                                    OfficialDocVendorUtil,
                                    OfficialDocUtil) {

        var vm = this;
        $scope.username = $cookies.get('username');
        $scope.roleType = $cookies.get('roletype');
        $scope.officialDocRight = $cookies.get('feature_official_doc') == "true";

        var fileUnique = moment().format("hhmmss");

        // 所有專案
        Project.findAll()
            .success(function (allProjects) {
                vm.allProjectData = allProjects;
            })
            .error(function () {
                console.log("Error, Project.findAll")
            })

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {
                vm.chargeUsers = allUsers;
                vm.signers = [];

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

                    switch (allUsers[i].roleType) {
                        case 2:
                        case 6:
                        case 100:
                            vm.signers.push(allUsers[i]);
                            break;
                    }
                }

            });

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
                                userDID: $cookies.get('userDID') + fileUnique,
                            }

                            OfficialDocUtil.deleteOfficialDocFile_public(formData);
                        }
                    },

                    success: function (file) {
                        // console.log(file);
                        var uploadData = new FormData();
                        uploadData.append('userDID', $cookies.get('userDID') + fileUnique);
                        uploadData.append('type', 0);
                        uploadData.append('fileName', file.name);
                        uploadData.append('file', file);

                        OfficialDocUtil.uploadOfficialDocFile_public(uploadData);
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
            //                     userDID: $cookies.get('userDID') + fileUnique,
            //                 }
            //
            //                 OfficialDocUtil.deleteOfficialDocFile_public(formData);
            //             }
            //         },
            //
            //         success: function (file) {
            //             // console.log(file);
            //             var uploadData = new FormData();
            //             uploadData.append('userDID', $cookies.get('userDID') + fileUnique);
            //             uploadData.append('type', 1);
            //             uploadData.append('fileName', file.name);
            //             uploadData.append('file', file);
            //
            //             OfficialDocUtil.uploadOfficialDocFile_public(uploadData)
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
                    totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

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
            //         totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));
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

        $scope.setDateModel = function (modelName, dom) {
            var evalString = '$scope.' + modelName + "= dom.myDT";
            // console.log(evalString);
            // console.log(dom);
            eval(evalString);
        }


        // $scope.pdfList = undefined;

        // // pdf 檔案列表
        // $scope.fetchPDFFiles = function () {
        //
        //     var formData = {
        //         userDID: $cookies.get('userDID')
        //     }
        //
        //     OfficialDocUtil.fetchOfficialDocFiles(formData)
        //         .success(function (res) {
        //             console.log(res);
        //             $scope.pdfList = res.payload;
        //         })
        // }

        // show pdf View
        // $scope.showPDF = function (dom) {
        //     $uibModal.open({
        //         animation: true,
        //         controller: 'officialDocPDFViewerModalCtrl',
        //         templateUrl: 'app/pages/officialDoc/receiveOfficialDoc/modal/officialDocPDFViewerModal.html',
        //         resolve: {
        //             parent: function () {
        //                 return $scope;
        //             },
        //             dom: function () {
        //                 return dom;
        //             },
        //         }
        //     }).result.then(function (data) {
        //
        //     });
        // };

        $scope.fetchVendor = function () {
            OfficialDocVendorUtil.fetchOfficialDocVendor()
                .success(function (res) {
                    console.log(res);
                    vm.officialDocVendors = res.payload;
                    vm.officialDocVendors_copy = res.payload;
                })
                .error(function (res) {
                    console.log(res);
                })
        }

        $scope.fetchVendor();

        // check doc detail
        $scope.checkDocDetail = function (dom) {
            // console.log(vm);
            console.log(dom);

            // if ($('#_publicDate_dom').find('#myDT')[0].value== "") {
            //     toastr.error('注意', '請選擇發文日期');
            //     return
            // }

            // if (!vm.docDivision) {
            //     toastr.error('注意', '請選擇分部');
            //     return
            // }

            // if (!vm.docOption) {
            //     toastr.error('注意', '請選擇文別');
            //     return
            // }

            if (dom._subject == "" || !dom._subject) {
                toastr.error('注意', '主旨請勿為空');
                return
            }

            // if (!vm.docType) {
            //     toastr.error('注意', '請選擇類型');
            //     return
            // }

            // if (!vm.vendorItem) {
            //     toastr.error('注意', '請選擇發文機關');
            //     return
            // }

            if (!vm.prjItems) {
                toastr.error('注意', '請選擇專案代碼');
                return
            }

            // if(vm.vendorItemCopy == undefined) {
            //     vm.vendorItemCopy = {};
            //     vm.vendorItemCopy.selected = {};
            // }

            // if (!vm.chargeUser) {
            //     toastr.error('注意', '請選擇專案承辦人');
            //     return
            // }


            // var formData = {
            //     _archiveNumber: dom._publicNumber,
            //     userDID: $cookies.get('userDID') + fileUnique,
            // }
            //
            // console.log(formData);

            // OfficialDocUtil.createPDFFolder(formData)
            //     .success(function (req) {

                    var stageInfo = {
                        timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                        stage: "發文草擬建檔",
                        handleName: $scope.username
                    }

                    var isAttached = $scope.fileList.length > 0 ? true : false;

                    var docData = {
                        // _archiveNumber: dom._publicNumber,
                        // _receiveType: dom._receiveType,
                        // _receiveNumber: dom._receiveNumber,
                        _subject: dom._subject,
                        // _publicDate: $scope._publicDate,
                        // _receiveDate: $scope._receiveDate,
                        // _lastDate: $scope._lastDate,
                        // _dueDate: $scope._dueDate,
                        // vendorItem: vm.vendorItem.selected,
                        // vendorItemCopy: vm.vendorItemCopy.selected,
                        prjItem: vm.prjItems.selected,
                        // chargeUser: vm.chargeUser.selected,
                        signer: vm.signer.selected,
                        // docOption: vm.docOption.selected,
                        // docType: vm.docType.selected,
                        // docDivision: vm.docDivision.selected,
                        timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
                        stageInfo: stageInfo,
                        isAttached: isAttached,
                    }

                    $uibModal.open({
                        animation: true,
                        controller: 'publicOfficialDocDetailCheckerModalCtrl',
                        templateUrl: 'app/pages/officialDoc/publicOfficialDoc/modal/publicOfficialDocDetailCheckerModal.html',
                        resolve: {
                            parent: function () {
                                return $scope;
                            },
                            docData: function () {
                                return docData;
                            },
                            folderDir: function () {
                                return $cookies.get('userDID') + fileUnique;
                            }
                        }
                    }).result.then(function (data) {
                        console.log(data);
                        window.location.reload();
                    });

                // })


        };

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
        var type_regular = [
            {
                name: "電子",
                option: 0
            },
            {
                name: "紙本",
                option: 1
            },
        ];

        vm.docTypes = type_regular;

        var originHeight;

        $scope.listenDatePicker_official = function (dom) {

            $scope.$watch('_publicDate',function(newValue, oldValue) {

                dom.$watch('opened',function(newVal, oldVal){
                    if (newVal) {
                        if (!originHeight) {
                            originHeight = $('#_publicDate_panel').find('.panel-body').height();
                            console.log(originHeight);
                        }
                        // console.log("open");
                        $('#_publicDate_panel').find('.panel-body').height(300);
                    }
                    if(newVal != oldVal && !newVal){
                        //close event
                        // console.log("close");
                        $('#_publicDate_panel').find('.panel-body').height(originHeight);
                    }
                })
            });
        }

        $scope.docProjectSelected = function (projectInfo) {
            console.log(projectInfo)
            if (projectInfo.majorID != "" &&
                projectInfo.majorID != null &&
                projectInfo.majorID != undefined) {

                vm.signer = {};
                vm.signer.selected = {
                    _id: projectInfo.managerID,
                    name: $scope.showChargerName(projectInfo.managerID)
                }

                vm.chargeUser = {};
                vm.chargeUser.selected = {
                    _id: projectInfo.majorID,
                    name: $scope.showChargerName(projectInfo.majorID)
                }
            } else {

                vm.signer = {};
                vm.signer.selected = {
                    _id: projectInfo.managerID,
                    name: $scope.showChargerName(projectInfo.managerID)
                }

                vm.chargeUser = {};
                vm.chargeUser.selected = {
                    _id: projectInfo.managerID,
                    name: $scope.showChargerName(projectInfo.managerID)
                }
            }
        }

        $scope.showChargerName = function (userDID) {
            // console.log(officialItem);
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (userDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: userDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

    }

})();