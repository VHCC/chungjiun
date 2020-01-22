(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('travelApplicationHomeCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$uibModal',
                'User',
                'Project',
                'OfficialDocUtil',
                'OfficialDocVendorUtil',
                '$compile',
                TravelApplicationHomeCtrl
            ])
    ;

    /**
     * @ngInject
     */
    function TravelApplicationHomeCtrl($scope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 User,
                                 Project,
                                 OfficialDocUtil,
                                 OfficialDocVendorUtil,
                                 $compile) {

        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');
    }

})();