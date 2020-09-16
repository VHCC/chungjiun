/**
 * @author IChen.chu
 * created on 05.08.2020
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .service('intiWorkOffAllService', function ($http, $cookies) {
                return "";
            })
            .controller('subContractorPayHomeCtrl',
                [
                    '$scope',
                    '$filter',
                    '$cookies',
                    subContractorPayHomeCtrl
                ]);

        /** @ngInject */
        function subContractorPayHomeCtrl($scope,
                                 $filter,
                                 cookies) {

            var vm = this;

            $scope.username = cookies.get('username');
            $scope.userDID = cookies.get('userDID');
            $scope.roleType = cookies.get('roletype');

            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;

            $scope.fetchReviewData = function (dom) {
                dom.$$childTail.$$prevSibling.fetchSCPayItemProject();
            }

            $scope.fetchExecutiveData = function (dom) {
                dom.$$childTail.fetchSCPayItemProject();
            }

        } // End of function
    }

)();


