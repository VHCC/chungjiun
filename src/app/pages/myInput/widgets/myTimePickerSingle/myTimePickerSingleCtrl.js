/**
 * Created by IChen.Chu
 * on 04.04.2018.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('MyTimePickerSingleCtrl', myTimePickerSingleCtrl);

    /** @ngInject */
    function myTimePickerSingleCtrl($scope) {

        $scope.options = {
            showWeeks: false
        };

        $scope.changeTime = function (type) {
            switch(type) {
                case 0:
                    $scope.$parent.item.start_time = $scope.time;
                    break;
                case 1:
                    $scope.$parent.item.end_time = $scope.time;
                    break;
            }
            console.log($scope.$parent.item);
            console.log($scope);
        }

    }
})();