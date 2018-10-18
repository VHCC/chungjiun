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
    function mySelectorCtrl($scope
                    , $filter) {
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
            {
                name: "特殊假",
                type: 1001
            },
        ];
        $scope.workOffTypeChange = function (inputType) {
            var selectedRole = [];
            selectedRole = $filter('filter')($scope.workOffTypeOptions, {
                type: inputType,
            });
            $scope.workOffType = selectedRole[0];
        }

        $scope.loadUserWorkOffForm = function (table) {
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
                {
                    name: "特殊假",
                    type: 1001
                },
            ];
            $scope.loginUserForm = table;
            if ($scope.loginUserForm.start_married !== undefined && $scope.loginUserForm.start_married !== ""
                && $scope.loginUserForm.end_married !== undefined && $scope.loginUserForm.end_married !== "") {
                $scope.workOffTypeOptions.push({
                    name: "婚假",
                    type: 4
                })
            }
            if ($scope.loginUserForm.start_mourning !== undefined && $scope.loginUserForm.start_mourning !== ""
                && $scope.loginUserForm.end_mourning !== undefined && $scope.loginUserForm.end_mourning !== "") {
                $scope.workOffTypeOptions.push({
                    name: "喪假",
                    type: 5
                })
            }
            if ($scope.loginUserForm.start_official !== undefined && $scope.loginUserForm.start_official !== ""
                && $scope.loginUserForm.end_official !== undefined && $scope.loginUserForm.end_official !== "") {
                $scope.workOffTypeOptions.push({
                    name: "公假",
                    type: 6
                })
            }
            if ($scope.loginUserForm.start_workinjury !== undefined && $scope.loginUserForm.start_workinjury !== ""
                && $scope.loginUserForm.end_workinjury !== undefined && $scope.loginUserForm.end_workinjury !== "") {
                $scope.workOffTypeOptions.push({
                    name: "公傷假",
                    type: 7
                })
            }
            if ($scope.loginUserForm.start_maternity !== undefined && $scope.loginUserForm.start_maternity !== ""
                && $scope.loginUserForm.end_maternity !== undefined && $scope.loginUserForm.end_maternity !== "") {
                $scope.workOffTypeOptions.push({
                    name: "產假",
                    type: 8
                })
            }
            if ($scope.loginUserForm.start_paternity !== undefined && $scope.loginUserForm.start_paternity !== ""
                && $scope.loginUserForm.end_paternity !== undefined && $scope.loginUserForm.end_paternity !== "") {
                $scope.workOffTypeOptions.push({
                    name: "陪產假",
                    type: 9
                })
            }
        }
    }
})();