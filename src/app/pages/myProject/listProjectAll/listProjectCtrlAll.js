(function () {
    'user strict';

    angular.module('BlurAdmin.pages.myProject')
        .controller('listProjectAllCtrl', [
            '$scope',
            '$cookies',
            listProjectAll
        ])

    /**
     * @ngInject
     */
    function listProjectAll(scope, cookies) {
        console.log('listProjectAll');
    }

})();