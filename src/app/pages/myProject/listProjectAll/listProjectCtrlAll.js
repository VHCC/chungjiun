(function () {
    'user strict';

    angular.module('BlurAdmin.pages.myProject')
        .controller('listProjectAllCtrl', [
            '$scope',
            '$cookies',
            ListProjectAll
        ])

    /**
     * @ngInject
     */
    function ListProjectAll(scope, cookies) {
        console.log('listProjectAll');
    }

})();