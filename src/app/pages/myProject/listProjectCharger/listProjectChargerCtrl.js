// 20200403
(function () {
    'user strict';

    angular.module('BlurAdmin.pages.myProject')
        .controller('listProjectChargerCtrl', [
            '$scope',
            '$cookies',
             ListProjectCharger
        ])

    /**
     * @ngInject
     */
    function ListProjectCharger(scope, cookies) {
        console.log('ListProjectCharger');
    }

})();