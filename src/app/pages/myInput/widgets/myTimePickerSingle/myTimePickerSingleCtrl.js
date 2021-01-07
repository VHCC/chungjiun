/**
 * Created by IChen.Chu
 * on 04.04.2018.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('MyTimePickerSingleCtrl', [
                '$scope',
                '$filter',
                '$cookies',
                'toastr',
                myTimePickerSingleCtrl]
            );

    /** @ngInject */
    function myTimePickerSingleCtrl($scope,
                                    $filter,
                                    $cookies,
                                    toastr) {

        $scope.options = {
            showWeeks: false
        };

        $scope.aaaa = function (event) {
            console.log(event)
            if (event.keyCode == 229) {
                toastr.error('輸入法異常', '（時間輸入格式錯誤，可能有輸入到中文、注音、英文字母、請重新整理後再次輸入）');
                return;
            }
        }

        $scope.changeTime = function (type) {
            console.log(type)
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