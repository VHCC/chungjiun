(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('personalKPIHomePageCtrl',
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
                'intiOfficialWaitHandleService',
                PersonalKPIHomePageCtrl
            ])
    ;

    /**
     * @ngInject
     */
    function PersonalKPIHomePageCtrl($scope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 User,
                                 Project,
                                 OfficialDocUtil,
                                 OfficialDocVendorUtil,
                                 $compile,
                                 intiOfficialWaitHandleService) {

        $scope.roleType = $cookies.get('roletype');
    }

})();