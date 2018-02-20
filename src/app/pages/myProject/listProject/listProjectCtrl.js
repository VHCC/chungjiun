(function () {
    'user strict';

    angular.module('BlurAdmin.pages.myProject')
        .controller('listProjectCtrl', ['$scope', '$cookies', function (scope, cookies) {
            return new listProject(scope, cookies);
        }])

    /**
     * @ngInject
     */
    function listProject(scope, cookies, $filter, editableOptions, editableThemes) {
        console.log('listProject');

    }

})();