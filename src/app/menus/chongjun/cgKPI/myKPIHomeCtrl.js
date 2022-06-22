/**
 * @author IChen.Chu
 * created on 03.01.2022
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .controller('myKPIHomeCtrl',
                [
                    '$scope',
                    '$filter',
                    '$cookies',
                    myKPIHomeCtrl
                ]);

        /** @ngInject */
        function myKPIHomeCtrl($scope,
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


