(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('receiveOfficialDocCtrl',
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
                ReceiveOfficialDocCtrl
            ]);

    /**
     * @ngInject
     */
    function ReceiveOfficialDocCtrl($scope,
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
                                userDID: $cookies.get('userDID') + fileUnique,
                            }

                            OfficialDocUtil.deleteOfficialDocFile(formData);
                        }
                    },

                    success: function (file) {
                        console.log(file);
                        var uploadData = new FormData();
                        uploadData.append('userDID', $cookies.get('userDID') + fileUnique);
                        uploadData.append('fileName', file.name);
                        uploadData.append('file', file);

                        OfficialDocUtil.uploadOfficialDocFile(uploadData)
                            .success(function (res) {
                                $scope.fileList.push(file.name);
                            })
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

        // No used
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

            if (!vm.docOption) {
                toastr.error('注意', '請選擇文別');
                return
            }

            if (!vm.docAttachedType) {
                toastr.error('注意', '請選擇附件類別');
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

            var stageInfo = {
                timestamp: moment(new Date()).format("YYYY/MM/DD-HH:mm:ss"),
                stage: "收文建檔",
                handleName: $scope.username
            }

            var isAttached = $scope.fileList.length > 0 ? true : false;

            var docData = {
                _archiveNumber: dom._archiveNumber,
                _receiveType: dom._receiveType,
                _receiveNumber: dom._receiveNumber,
                _subject: dom._subject,
                _receiveDate: $scope._receiveDate,
                _lastDate: $scope._lastDate,
                _dueDate: $scope._dueDate,
                _officialPublicDate: $scope._officialPublicDate,
                vendorItem: vm.vendorItem.selected,
                prjItem: vm.prjItems.selected,
                chargeUser: vm.chargeUser.selected,
                docOption: vm.docOption.selected,
                docAttachedType: vm.docAttachedType.selected,
                timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
                stageInfo: stageInfo,
                isAttached: isAttached,
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
                    folderDir: function () {
                        return $cookies.get('userDID') + fileUnique;
                    }
                }
            }).result.then(function (data) {
                console.log(data);
                window.location.reload();
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

        // 0 : 無
        // 1 : 電子
        // 2 : 開會
        var attached_regular = [
            {
                name: "無",
                option: 0
            },
            {
                name: "電子",
                option: 1
            },
            {
                name: "紙本",
                option: 2
            },
        ];

        vm.docAttachedTypes = attached_regular;

        var originHeight;

        $scope.listenDatePicker_official = function (dom) {

            $scope.$watch('_receiveDate',function(newValue, oldValue) {

                $scope._lastDate = moment(oldValue).add(3, 'days').format('YYYY/MM/DD');
                $('#_lastDate_dom').find('#myDT')[0].value = $scope._lastDate;

                $scope._lastDate = moment(oldValue).add(6, 'days').format('YYYY/MM/DD');
                $('#_dueDate_dom').find('#myDT')[0].value = $scope._lastDate;

                dom.$watch('opened',function(newVal, oldVal){
                    if (newVal) {
                        if (!originHeight) {
                            originHeight = $('#_receiveDate_panel').find('.panel-body').height();
                            console.log(originHeight);
                        }
                        // console.log("open");
                        $('#_receiveDate_panel').find('.panel-body').height(300);
                    }
                    if(newVal != oldVal && !newVal){
                        //close event
                        // console.log("close");
                        $('#_receiveDate_panel').find('.panel-body').height(originHeight);
                    }
                })
            });

            $scope.$watch('_lastDate',function(newValue, oldValue) {

                dom.$watch('opened',function(newVal, oldVal){
                    if (newVal) {
                        if (!originHeight) {
                            originHeight = $('#_lastDate_panel').find('.panel-body').height();
                            console.log(originHeight);
                        }
                        // console.log("open");
                        $('#_lastDate_panel').find('.panel-body').height(300);
                    }
                    if(newVal != oldVal && !newVal){
                        //close event
                        // console.log("close");
                        $('#_lastDate_panel').find('.panel-body').height(originHeight);
                    }
                })
            });

            $scope.$watch('_dueDate',function(newValue, oldValue) {

                dom.$watch('opened',function(newVal, oldVal){
                    if (newVal) {
                        if (!originHeight) {
                            originHeight = $('#_dueDate_panel').find('.panel-body').height();
                            console.log(originHeight);
                        }
                        // console.log("open");
                        $('#_dueDate_panel').find('.panel-body').height(300);
                    }
                    if(newVal != oldVal && !newVal){
                        //close event
                        // console.log("close");
                        $('#_dueDate_panel').find('.panel-body').height(originHeight);
                    }
                })
            });

        }

        $scope.docProjectSelected = function (projectInfo) {
            if (projectInfo.majorID != "" && projectInfo.majorID != null && projectInfo.majorID != undefined) {
                vm.chargeUser = {};
                vm.chargeUser.selected = {
                    _id: projectInfo.majorID,
                    name: $scope.showChargerName(projectInfo.majorID)
                }
            } else {
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