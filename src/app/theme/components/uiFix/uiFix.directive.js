/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('arrayRequired', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {

                    ngModel.$validators.arrayRequired = function (modelValue, viewValue) {
                        if (modelValue === undefined) return false;
                        return (modelValue.length > 0 ? true : false);
                    };

                }
            };
        })

})();