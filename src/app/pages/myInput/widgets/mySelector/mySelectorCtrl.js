/**
 * Created by IChen.Chu
 * on 10.03.2018.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('MySelectorCtrl', [
            '$scope',
            '$filter',
            mySelectorCtrl
        ]);

    /** @ngInject */
    function mySelectorCtrl($scope,
                            $filter) {
        $scope.workOffTypeOptions = [
            {
                name: "事假",
                type: 0
            },
            {
                name: "病假",
                type: 1
            },
            {
                name: "補休",
                type: 2
            },
            {
                name: "特休",
                type: 3
            },
        ];

        $scope.workOffTypeChange = function (inputType) {
            var selectedRole = [];
            selectedRole = $filter('filter')($scope.workOffTypeOptions, {
                type: inputType,
            });
            $scope.workOffType = selectedRole[0];
        }
    }
})();