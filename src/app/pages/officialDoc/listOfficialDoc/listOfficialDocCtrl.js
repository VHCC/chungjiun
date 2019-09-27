(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('listOfficialDocCtrl',
            [
                '$scope',
                '$cookies',
                function (scope,
                          cookies) {
                    return new ListOfficialDocCtrl(
                        scope,
                        cookies
                    );
                }])
    ;

    /**
     * @ngInject
     */
    function ListOfficialDocCtrl(scope,
                                 cookies) {
        console.log('ListOfficialDocCtrl');
    }

})();