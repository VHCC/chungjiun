(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('receiveOfficialDocCtrl',
            [
                '$scope',
                '$cookies',
                '$uibModal',
                'toastr',
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
                                    toastr,
                                    OfficialDocUtil) {

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
                acceptedFiles: ".pdf",
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

        var pdfjsLib = window['pdfjs-dist/build/pdf'];
        // The workerSrc property shall be specified.
        // pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
        pdfjsLib.GlobalWorkerOptions.workerSrc = window['pdfjs-dist/build/pdf.worker'];

        $scope.getPDF = function (item) {

            var formData = {
                fileName: item.$parent.pdfItem.name
            }

            OfficialDocUtil.getOfficialDocFile(formData)
                .success(function (pdfBinaryData) {

                    var loadingTask = pdfjsLib.getDocument({
                        data: atob(pdfBinaryData)
                    })

                    loadingTask.promise.then(function (pdf) {
                        console.log('PDF loaded');

                        // Fetch the first page
                        var pageNumber = 1;
                        pdf.getPage(pageNumber).then(function (page) {
                            console.log('Page loaded');

                            var scale = 1.5;
                            var viewport = page.getViewport({scale: scale});

                            // Prepare canvas using PDF page dimensions
                            var canvas = document.getElementById('the-canvas');
                            var context = canvas.getContext('2d');
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            // Render PDF page into canvas context
                            var renderContext = {
                                canvasContext: context,
                                viewport: viewport
                            };
                            var renderTask = page.render(renderContext);
                            renderTask.promise.then(function () {
                                console.log('Page rendered');
                            });
                        });
                    }, function (reason) {
                        // PDF loading error
                        console.error(reason);
                    });
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

    }

})();