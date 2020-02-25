(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('listOfficialDocHomePageCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$uibModal',
                'User',
                'OfficialDocUtil',
                'OfficialDocVendorUtil',
                '$compile',
                'intiOfficialDocReceiveService',
                ListOfficialDocHomePageCtrl
            ])

    /**
     * @ngInject
     */
    function ListOfficialDocHomePageCtrl($scope,
                                        $filter,
                                        $cookies,
                                        $uibModal,
                                        User,
                                        OfficialDocUtil,
                                        OfficialDocVendorUtil,
                                        $compile,
                                        intiOfficialDocReceiveService) {

        $scope.username = $cookies.get('username');
        $scope.roleType = $cookies.get('roletype');
        $scope.officialDocRight = $cookies.get('feature_official_doc') == "true";

    }

})();