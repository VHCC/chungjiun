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
        $('.disableTimeRangesExample').mask('H0:0D', {
            translation: {
                'H': {
                    pattern: /[012]/,
                },
                'D': {
                    pattern: /[0]/,
                }
            }
        });

        $('.disableTimeRangesExample').timepicker({
            'disableTimeRanges': [
                ['1am', '2am'],
                ['3am', '4:01am']
            ],
            'timeFormat': 'H:i',
            'forceRoundTime': true
        });

    }
})();