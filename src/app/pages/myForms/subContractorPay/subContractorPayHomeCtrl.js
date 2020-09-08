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
                    SubContractorPayCtrl
                ]);

        /** @ngInject */
        function SubContractorPayCtrl($scope,
                                 $filter,
                                 cookies) {

            var vm = this;

            $scope.username = cookies.get('username');
            $scope.userDID = cookies.get('userDID');
            $scope.roleType = cookies.get('roletype');

            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;

        } // End of function
    }

)();


