/**
 * @author IChen.Chu
 * created on 13.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('officialDocPDFViewerModalCtrl',
            [
                '$scope',
                '$cookies',
                '$uibModalInstance',
                'TimeUtil',
                'DateUtil',
                'OfficialDocUtil',
                OfficialDocPDFViewerModalCtrl
            ]);

    /** @ngInject */
    function OfficialDocPDFViewerModalCtrl($scope,
                                           $cookies,
                                           $uibModalInstance,
                                           TimeUtil,
                                           DateUtil,
                                           OfficialDocUtil) {
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.dom = $scope.$resolve.dom;

        // initial
        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');

        var pdfjsLib = window['pdfjs-dist/build/pdf'];
        // The workerSrc property shall be specified.
        // pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
        pdfjsLib.GlobalWorkerOptions.workerSrc = window['pdfjs-dist/build/pdf.worker'];

        $scope.getPDF = function (dom) {

            var formData = {
                fileName: dom.$parent.pdfItem.name
            }

            $scope.viewPage = 1;

            $scope.pdfFile = undefined;

            OfficialDocUtil.getOfficialDocFile(formData)
                .success(function (pdfBinaryData) {

                    var loadingTask = pdfjsLib.getDocument({
                        data: atob(pdfBinaryData)
                    })

                    loadingTask.promise.then(function (pdf) {
                        // console.log('PDF loaded');

                        $scope.pdfFile = pdf;

                        $scope.totalPage = pdf._pdfInfo.numPages;

                        $scope.showPage(1);
                    }, function (reason) {
                        // PDF loading error
                        console.error(reason);
                    });
                })
        }

        // init page view
        $scope.getPDF($scope.dom);

        $scope.showPage = function (pageIndex) {
            $scope.pdfFile.getPage(pageIndex)
                .then(function (page) {
                    console.log('Page loaded, page= ' + pageIndex);

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
                        // console.log('Page rendered');
                    });
                });
        }

        $scope.changePage = function (type) {

            switch (type) {
                case 0: // preview
                    if ($scope.viewPage == 1) {
                        return;
                    }
                    $scope.viewPage --;
                    break;
                case 1: // next
                    if ($scope.viewPage == $scope.totalPage) {
                        return;
                    }
                    $scope.viewPage ++;
                    break;
            }
            $scope.showPage($scope.viewPage)
        }

        $scope.downloadPDF = function (dom) {
            // console.log(dom);

            var formData = {
                fileName: dom.dom.$parent.pdfItem.name
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

                    saveByteArray([downloadDataBuffer], moment().format('YYYYMMDD_HHmmss') + "_" + dom.dom.$parent.pdfItem.name);

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


    }

})();