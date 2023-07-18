/**
 * @author Ichen.chu
 * created on 03.12.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('processStageSelector', processStageSelector);

    /** @ngInject */
    function processStageSelector() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'ProcessStageCtrl',
            link: function ($scope, elem, attrs) {
                console.log(attrs);
                // if (attrs.showtype == 1) { // 補休特休兌換
                //     $scope.loadUserWorkOffExchangeForm();
                // } else {
                //     $scope.loadUserWorkOffForm(JSON.parse(attrs.form));
                // }
                $scope.loadProcessStageSettings();
                $scope.showProcessStageName(attrs);
            },
            templateUrl: 'app/pages/myInput/widgets/processStageSelector/processStageSelector.html',
        };
    }
})();