/**
 * @author v.lugovsky
 * created on 17.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .filter('userAvatar', profilePicture);

    /** @ngInject */
    function profilePicture(layoutPaths) {
        return function (input, ext) {
            ext = ext || 'png';
            return layoutPaths.images.userAvatar + input + '.' + ext;
        };
    }

})();
