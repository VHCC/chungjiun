/**
 * @author Ichen.Chu
 * created on 05.31.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('MyBillboardCtrl', [
            '$scope',
            '$window',
            '$cookies',
            'baConfig',
            'ngDialog',
            'Todos',
            MyBillboardCtrl
        ]);

    /** @ngInject */
    function MyBillboardCtrl(
        $scope,
        window,
        cookies,
        baConfig,
        ngDialog,
        Todos) {

    }
})();