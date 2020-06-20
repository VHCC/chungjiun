/**
 * Created by IChen.Chu
 * on 18.06.2020.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('RemedyTimePickerCtrl', remedyTimePickerCtrl);

    /** @ngInject */
    function remedyTimePickerCtrl($scope) {

        $scope.options = {
            showWeeks: false
        };
        $('.disableTimeRangesExample').mask('H0:D0', {
            translation: {
                'H': {
                    pattern: /[012]/,
                },
                'D': {
                    pattern: /[012345]/,
                }
            },
            placeholder: "__ : __"
        });

    }
})();