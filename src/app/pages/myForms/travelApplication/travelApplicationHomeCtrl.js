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
                                 $compile) {

        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        $scope.getApply = function() {
            this.$$childHead.$$nextSibling.getApplyData();
        }

        $scope.getManagerReview = function() {
            this.$$childTail.getManagerReviewData();
        }

        $scope.getBossReview = function () {
            this.$$childTail.getBossReviewData();
        }
    }

})();