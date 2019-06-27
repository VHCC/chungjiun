/**
 * @author IChen.Chu
 * created on 21.06.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.vhcTest')
        .controller('vhcPurchaseModalCtrl',
            [
                '$scope',
                '$window',
                'toastr',
                '$cookies',
                'VhcMemberUtil',
                '$uibModalInstance',
                VhcMemberModalC
            ]);

    /** @ngInject */
    function VhcMemberModalC($scope,
                             $window,
                             toastr,
                             cookies,
                             VhcMemberUtil,
                             $uibModalInstance) {

        // console.log($scope.$resolve.member);
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.item = $scope.$resolve.item;

        $scope.item.purchases = $scope.item.purchases.sort(function (a, b) {
            return a.purchase_recorddate > b.purchase_recorddate ? 1 : -1;
        });

        // console.log($scope.item);

        $scope.totalPurchase = function(item) {
            return $scope.parent.totalPurchase(item);
            // console.log(item);
            // var results = 0;
            // for (var index = 0; index < item.purchases.length; index ++) {
            //     // console.log(item.purchases[index].purchase_fprice);
            //     if (isNaN(parseInt(item.purchases[index].purchase_fprice))) {
            //         continue;
            //     }
            //     results += parseInt(item.purchases[index].purchase_fprice);
            // }
            // for (var index = 0; index < item.purchases.length; index ++) {
            //     // console.log(item.purchases[index].purchase_lprice);
            //     if (isNaN(parseInt(item.purchases[index].purchase_lprice))) {
            //         continue;
            //     }
            //     results += parseInt(item.purchases[index].purchase_lprice);
            // }
            // return results;
        }

        $scope.closeDialog = function () {
            $uibModalInstance.close();
        }

    }

})();