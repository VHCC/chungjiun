/**
 * @author IChen.chu
 * created on 25.09.2020
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .service('intiWorkOffAllService', function ($http, $cookies) {
                return "";
            })
            .controller('projectIncomeHomeCtrl',
                [
                    '$scope',
                    '$filter',
                    '$cookies',
                    projectIncomeHomeCtrl
                ]);

        /** @ngInject */
        function projectIncomeHomeCtrl($scope,
                                 $filter,
                                 cookies) {

            var vm = this;

            $scope.username = cookies.get('username');
            $scope.userDID = cookies.get('userDID');
            $scope.roleType = cookies.get('roletype');

            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;

            $scope.checkExecutiveData = function (dom) {
                console.log("checkExecutiveData")
                // dom.$$childTail.fetchSCApplyData_Review();
            }

            $scope.reloadSCApplyData = function (dom) {
                console.log("reloadSCApplyData")
                // dom.$$childTail.$$prevSibling.$$prevSibling.$$prevSibling.fetchSCApplyData();
            }

        } // End of function
    }

)();


