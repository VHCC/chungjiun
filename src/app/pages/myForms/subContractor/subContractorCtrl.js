/**
 * @author IChen.chu
 * created on 04.08.2020
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .service('intiWorkOffAllService', function ($http, $cookies) {
                return "";
            })
            .controller('subContractorHomeCtrl',
                [
                    '$scope',
                    '$filter',
                    '$cookies',
                    SubContractorCtrl
                ]);

        /** @ngInject */
        function SubContractorCtrl($scope,
                                 $filter,
                                 cookies) {

            var vm = this;

            $scope.username = cookies.get('username');
            $scope.userDID = cookies.get('userDID');
            $scope.roleType = cookies.get('roletype');

            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;

            $scope.checkExecutiveData = function (dom) {
                dom.$$childTail.fetchSCApplyData_Review();
            }

            $scope.reloadSCApplyData = function (dom) {
                dom.$$childTail.$$prevSibling.$$prevSibling.$$prevSibling.$$prevSibling.fetchSCApplyData();
            }

        } // End of function
    }

)();


