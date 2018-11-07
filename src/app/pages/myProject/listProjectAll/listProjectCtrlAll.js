(function () {
    'user strict';

    angular.module('BlurAdmin.pages.myProject')
        .controller('listProjectAllCtrl', [
            '$scope',
            '$cookies',
            function (scope,
                      cookies) {
                return new listProjectAll(
                    scope,
                    cookies
                );
            }])

    /**
     * @ngInject
     */
    function listProjectAll(scope, cookies) {
        console.log('listProjectAll');
    }

})();