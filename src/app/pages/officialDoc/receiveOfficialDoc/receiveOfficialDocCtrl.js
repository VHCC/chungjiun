(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('receiveOfficialDocCtrl',
            [
                '$scope',
                '$cookies',
                '$uibModal',
                'Project',
                'User',
                'toastr',
                'OfficialDocVendorUtil',
                'OfficialDocUtil',
                ReceiveOfficialDocCtrl
            ])
    ;

    /**
     * @ngInject
     */
    function ReceiveOfficialDocCtrl($scope,
                                    $cookies,
                                    $uibModal,
                                    Project,
                                    User,
                                    toastr,
                                    OfficialDocVendorUtil,
                                    OfficialDocUtil) {

        var vm = this;
        $scope.username = $cookies.get('username');

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
                    maxFilesize: 5, // MB
                    filesizeBase: 1000,
                    acceptedFiles: ".pdf, .jpg, .jpeg",
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
                                userDID: $cookies.get('userDID')
                            }

                            OfficialDocUtil.deleteOfficialDocFile(formData);
                        }
                    },

                    success: function (file) {

                        var uploadData = new FormData();
                        uploadData.append('userDID', $cookies.get('userDID'));
                        uploadData.append('file', file);

                        OfficialDocUtil.uploadOfficialDocFile(uploadData);
                    },

                    error: function (file, message) {
                        // console.log(file);
                        // console.log(message);
                        if (file.previewElement != null && file.previewElement.parentNode != null) {
                            file.previewElement.parentNode.removeChild(file.previewElement);
                            toastr.error('新增失敗', '只開放接收.pdf檔案');
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
        }

        $scope.setDateModel = function (modelName, dom) {
            var evalString = '$scope.' + modelName + "= dom.myDT";
            // console.log(evalString);
            // console.log(dom);
            eval(evalString);
        }


        $scope.pdfList = undefined;

        // pdf 檔案列表
        $scope.fetchPDFFiles = function () {

            var formData = {
                userDID: $cookies.get('userDID')
            }

            OfficialDocUtil.fetchOfficialDocFiles(formData)
                .success(function (res) {
                    console.log(res);
                    $scope.pdfList = res.payload;
                })
        }
        $scope.isAttached = function () {

            var formData = {
                userDID: $cookies.get('userDID')
            }

            OfficialDocUtil.detectOfficialDocFiles(formData)
                .success(function (res) {
                    console.log(res);
                })
        }

        // show pdf View
        $scope.showPDF = function (dom) {
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
                }
            }).result.then(function (data) {

            });
        };

        $scope.fetchVendor = function () {
            OfficialDocVendorUtil.fetchOfficialDocVendor()
                .success(function (res) {
                    console.log(res);
                    vm.officialDocVendors = res.payload;
                })
                .error(function (res) {
                    console.log(res);
                })
        }

        $scope.fetchVendor();

        // check doc detail
        $scope.checkDocDetail = function (dom) {
            console.log(dom);
            console.log($scope);
            console.log(vm);

            if (!vm.docOption) {
                toastr.error('注意', '請選擇文別');
                return
            }

            if (!vm.vendorItem) {
                toastr.error('注意', '請選擇發文機關');
                return
            }

            if (!vm.prjItems) {
                toastr.error('注意', '請選擇專案代碼');
                return
            }

            if (!vm.chargeUser) {
                toastr.error('注意', '請選擇專案承辦人');
                return
            }

            var docData = {
                _archiveNumber: dom._archiveNumber,
                _receiveType: dom._receiveType,
                _receiveNumber: dom._receiveNumber,
                _subject: dom._subject,
                _receiveDate: $scope._receiveDate,
                _dueDate: $scope._dueDate,
                vendorItem: vm.vendorItem.selected,
                prjItem: vm.prjItems.selected,
                chargeUser: vm.chargeUser.selected,
                docOption: vm.docOption.selected,
            }

            $uibModal.open({
                animation: true,
                controller: 'officialDocDetailCheckerModalCtrl',
                templateUrl: 'app/pages/officialDoc/receiveOfficialDoc/modal/officialDocDetailCheckerModal.html',
                resolve: {
                    parent: function () {
                        return $scope;
                    },
                    docData: function () {
                        return docData;
                    },
                }
            }).result.then(function (data) {
                console.log(data);
            });
        };

        // 0 : 函
        // 1 : 會勘
        // 2 : 開會
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
        ];

        vm.docOptions = options_regular;

    }

})();