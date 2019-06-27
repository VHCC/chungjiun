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
                'VhcPurchaseUtil',
                'editableOptions',
                'editableThemes',
                '$uibModalInstance',
                VhcMemberModalC
            ]);

    /** @ngInject */
    function VhcMemberModalC($scope,
                             $window,
                             toastr,
                             cookies,
                             VhcMemberUtil,
                             VhcPurchaseUtil,
                             editableOptions,
                             editableThemes,
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

        editableOptions.theme = 'bs3';
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


        $scope.savePurchase = function (purchase) {

            // var purchase_f = $('tbody').find("span[id='purchase_purchase_f']")[0].innerText;
            // var purchase_fprice = $('tbody').find("span[id='purchase_purchase_fprice']")[0].innerText;
            //
            // var item = {
            //     purchase_f: purchase_f,
            //     purchase_fprice: purchase_fprice,
            // }

            var postData = {
                purchase: purchase,
            }

            console.log(postData);

            VhcPurchaseUtil.updatePurchaseItem(postData)
                .success(function (res) {
                    console.log(res);
                })
        }

        $scope.textChange = function (dom) {
            console.log(dom);

            var domName = dom.$parent.$editable.name;
            var newValue = dom.$data;

            var parent = 'dom.$parent.$parent.' + domName;

            var updateString = parent + " = '" + newValue + "'";
            eval(updateString);
        }

        $scope.addPurchase = function (item) {

            var postData = {
                member_info: $scope.item._member_info,
            }

            VhcPurchaseUtil.addPurchaseItem(postData)
                .success(function (res) {
                    console.log(res);
                    item.purchases.push(res.payload);
                })
        }
    }

})();