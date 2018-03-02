/**
 * Created by n.poltoratsky
 * on 23.06.2016.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('mydatepickerCtrl', mydatepickerCtrl);

    /** @ngInject */
    function mydatepickerCtrl($scope) {

        $scope.dt = new Date();
        $scope.options = {
            showWeeks: false
        };

    }
})();