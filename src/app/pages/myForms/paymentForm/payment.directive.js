/**
 * @author Ichen.chu
 * created on 03.12.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .directive('test', function ($compile) {
            return {
                restrict: 'E',
                scope: {
                    paymentForm: '=',
                    text:'@',
                },
                transclude: true,
                // templateUrl: 'app/pages/myForms/forms/items/paymentFormItem.html',
                template: '<p ng-click="add()">{{text}}</p>',
                controller: function ( $scope, $element ) {
                    $scope.add = function () {
                        var el = $compile( "<test text='n'></test>" )( $scope );
                        $element.parent().append( el );
                    };
                }
            };
        });
})();