/**
 * Created by IChen.Chu
 * on 04.04.2018.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('MyTimePickerCtrl', myTimePickerCtrl);

    /** @ngInject */
    function myTimePickerCtrl($scope) {

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

        // $('.disableTimeRangesExample').timepicker({
        //     'disableTimeRanges': [
        //         ['12:01pm', '13pm'],
        //         ['18"01pm', '19pm']
        //     ],
        //     'timeFormat': 'H:i',
        //     'forceRoundTime': true
        // });

    }
})();