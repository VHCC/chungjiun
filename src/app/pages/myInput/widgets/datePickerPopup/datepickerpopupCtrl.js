/**
 * Created by n.poltoratsky
 * on 23.06.2016.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('MyDatepickerPopupCtrl', myDatepickerPopupCtrl);

    /** @ngInject */
    function myDatepickerPopupCtrl($scope) {

        $scope.open = open;
        $scope.myDT = new Date();
        $scope.opened = false;
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];
        $scope.options = {
            showWeeks: false
        };

        function open() {
            console.log($scope.format);
            $scope.opened = true;
        }
    }
})();