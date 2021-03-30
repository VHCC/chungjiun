/**
 * Created by IChen.Chu
 * on 18.06.2020.
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.myInput')
        .controller('RemedySelectorCtrl', [
            '$scope',
            '$filter',
            remedySelectorCtrl
        ]);

    /** @ngInject */
    function remedySelectorCtrl($scope
                    , $filter) {

        $scope.remedyTypeOptions = [
            {
                name: "補登上班",
                type: "1"
            },
            {
                name: "補登下班",
                type: "2"
            },
        ];

        // dynamic function
        $scope.remedyTypeChange = function (inputType) {
            var selectedRole = [];
            selectedRole = $filter('filter')($scope.remedyTypeOptions, {
                type: inputType,
            });
            $scope.workType = selectedRole[0];
        }


    }
})();