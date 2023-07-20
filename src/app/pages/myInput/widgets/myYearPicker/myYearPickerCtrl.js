/**
 * Created by IChen.Chu
 * on 16.05.2019
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('myYearPickerCtrl',
            [
                '$scope',
                'DateUtil',
                myYearPickerCtrl
            ]);

    /** @ngInject */
    function myYearPickerCtrl($scope, DateUtil) {
        // console.log(" - myYearPickerCtrl()");
        $scope.openYearPicker = showYearPicker;
        $scope.myDT = new Date();
        $scope.myYear = moment(new Date()).format('YYYY');
        $scope.opened = false;
        $scope.myYearOptions = {
            minMode: 'year',
        };
        // $('.myYearPicker').mask('M0', {
        //     translation: {
        //         'M': {
        //             pattern: /[01]/,
        //         }
        //     }
        // });
        function showYearPicker() {
            // console.log(" - showYearPicker()");
            $scope.yearPickerDom = this;
            $scope.opened = true;
        }

        $scope.shiftYear = function (dom) {
            // console.log(" - shiftYear()");
            $scope.isShiftYearSelect = true;
            $scope.myYear = moment($scope.myYear).format('YYYY');
            $scope.myDT = moment(dom.myYear);
            console.log($scope);
        }

    }
})();