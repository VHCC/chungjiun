/**
 * Created by IChen.Chu
 * on 21.07.2020.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('TargetSelectorCtrl', [
            '$scope',
            'ExpenditureTargetUtil',
            '$filter',
            targetSelectorCtrl
        ]);

    /** @ngInject */
    function targetSelectorCtrl($scope
                    , ExpenditureTargetUtil
                    , $filter
    ) {
        var formData = {
            isEnable: true
        }

        ExpenditureTargetUtil.fetchExpenditureTarget(formData)
            .success(function (res) {
                $scope.expenditureTargetOptions = res.payload;
            })

        // dynamic function
        $scope.expenditureTargetChange = function (targetDID) {
            console.log(targetDID)
        }

    }
})();