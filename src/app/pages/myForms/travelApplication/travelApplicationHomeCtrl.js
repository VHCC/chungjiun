(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('travelApplicationHomeCtrl',
            [
                '$scope',
                '$rootScope',
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
                                       $rootScope,
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
            this.$$childHead.$$nextSibling.getManagerReviewData();
        }

        $scope.getBossReview = function () {
            this.$$childHead.$$nextSibling.getBossReviewData();
        }

        $scope.initWatchRelatedTask = function() {

            $scope.$watch(function() {
                return $rootScope.travelApply_Manager_Tasks;
            }, function() {
                $scope.travelApply_Manager_Tasks = $rootScope.travelApply_Manager_Tasks;
            }, true);

            $scope.$watch(function() {
                return $rootScope.travelApply_Boss_Tasks;
            }, function() {
                $scope.travelApply_Boss_Tasks = $rootScope.travelApply_Boss_Tasks;
            }, true);

        }

        $scope.initWatchRelatedTask();
    }

})();