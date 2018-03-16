(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .directive('myFileSelect', ngFileSelect);

    /** @ngInject */
    function ngFileSelect() {
        return {
            link: function ($scope, el) {
                el.bind('change', function (e) {
                    var file = (e.srcElement || e.target).files[0];
                    // TODO file type fool-proof
                    console.log('Name= ' + file.name);
                    console.log('Type= ' + file.type);
                    console.log('Size= ' + (file.size / 1024) + " KB");
                    $scope.operateFile((e.srcElement || e.target).files[0]);
                })
            }
        }
    }

})();