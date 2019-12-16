(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('handleOfficialDocHomeCtrl',
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
                HandleOfficialDocCtrl
            ])
    ;

    /**
     * @ngInject
     */
    function HandleOfficialDocCtrl($scope,
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