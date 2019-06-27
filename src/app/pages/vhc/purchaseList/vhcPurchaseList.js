/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.vhcTest')
        .service('intVhcPurchaseListService', function ($http, $cookies) {

            var promise = $http.get('/api/get_vhc_test_all')
                .success(function (results) {
                    console.log(results);
                    return results;
                });
            return promise;


        })
        .controller('vhcPurchaseListController',
            [
                '$scope',
                'toastr',
                '$http',
                '$compile',
                '$uibModal',
                'VhcMemberUtil',
                'intVhcPurchaseListService',
                VhcMemberList
            ]);


    /** @ngInject */
    function VhcMemberList(
                    $scope,
                    toastr,
                    mHttp,
                    $compile,
                    $uibModal,
                    VhcMemberUtil,
                    intVhcPurchaseListService) {

        intVhcPurchaseListService.then(function (resp) {
            // console.log(resp.data.payload);
            $scope.items = resp.data.payload;
            $scope.items.slice(0, resp.data.payload.length);

            // console.log($scope.items);

            angular.element(
                document.getElementById('includeHead'))
                .append($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'保健視會員 消費列表 - " + resp.data.payload.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/pages/vhc/purchaseList/vhcPurchaseListTables.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));
        })


        $scope.fetchPurchase = function (item) {
            $uibModal.open({
                animation: true,
                controller: 'vhcPurchaseModalCtrl',
                templateUrl: 'app/pages/vhc/modelTemplate/vhcPurchaseModal.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return item;
                    },
                    parent: function () {
                        return $scope;
                    },
                }
            }).result.then(function () {
                // toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
            });
        }

        $scope.totalPurchase = function(item) {
            // console.log(item);
            var results = 0;
            for (var index = 0; index < item.purchases.length; index ++) {
                // console.log(item.purchases[index].purchase_fprice);
                if (isNaN(parseInt(item.purchases[index].purchase_fprice))) {
                    continue;
                }
                results += parseInt(item.purchases[index].purchase_fprice);
            }
            for (var index = 0; index < item.purchases.length; index ++) {
                // console.log(item.purchases[index].purchase_lprice);
                if (isNaN(parseInt(item.purchases[index].purchase_lprice))) {
                    continue;
                }
                results += parseInt(item.purchases[index].purchase_lprice);
            }
            return results;
        }

        $scope.addPurchase = function () {
            console.log("ADD");
        }


    }

})();
