(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .service('intiOfficialDocAllService', function ($http, $cookies) {

            var formData = {
                startDay: moment().format("YYYY/MM/DD"),
                endDay: moment().format("YYYY/MM/DD"),
            }

            // var promise = $http.get('/api/get_official_doc_fetch_all_item')
            //     .success(function (allOfficialDocItems) {
            //         return allOfficialDocItems;
            //     });
            // return promise;

            var promise = $http.post('/api/post_official_doc_fetch_item_period', formData)
                .success(function (allOfficialDocItems) {
                    return allOfficialDocItems;
                });
            return promise;
        })
        .controller('listOfficialDocCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$uibModal',
                'User',
                'OfficialDocUtil',
                'OfficialDocVendorUtil',
                '$compile',
                'intiOfficialDocAllService',
                function (scope,
                          filter,
                          $cookies,
                          $uibModal,
                          User,
                          OfficialDocUtil,
                          OfficialDocVendorUtil,
                          $compile,
                          intiOfficialDocAllService) {
                    return new ListOfficialDocCtrl(
                        scope,
                        filter,
                        $cookies,
                        $uibModal,
                        User,
                        OfficialDocUtil,
                        OfficialDocVendorUtil,
                        $compile,
                        intiOfficialDocAllService
                    );
                }])
    ;

    /**
     * @ngInject
     */
    function ListOfficialDocCtrl($scope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 User,
                                 OfficialDocUtil,
                                 OfficialDocVendorUtil,
                                 $compile,
                                 intiOfficialDocAllService) {

        intiOfficialDocAllService.then(function (resp) {
            console.log(resp.data);
            $scope.officialDocItems = resp.data.payload;
            $scope.officialDocItems.slice(0, resp.data.payload.length);

            angular.element(
                document.getElementById('includeHead'))
                .append($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'公文列表 - " + resp.data.payload.length +
                    " ( " + $('#inputStartDay')[0].value + "~" + $('#inputEndDay')[0].value + " )" +
                    "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/pages/officialDoc/listOfficialDoc/table/listOfficialTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));

            User.getAllUsers()
                .success(function (allUsers) {
                    // console.log(allUsers);
                    // 經理、主承辦
                    $scope.allUsers = [];
                    $scope.allUsers[0] = {
                        value: "",
                        name: "None"
                    };
                    for (var i = 0; i < allUsers.length; i++) {
                        $scope.allUsers[i] = {
                            value: allUsers[i]._id,
                            name: allUsers[i].name
                        };
                    }
                })

            OfficialDocVendorUtil.fetchOfficialDocVendor()
                .success(function (response) {
                    $scope.allVendors = [];
                    $scope.allVendors[0] = {
                        value: "",
                        name: "None"
                    };
                    for (var i = 0; i < response.payload.length; i++) {
                        $scope.allVendors[i] = {
                            value: response.payload[i]._id,
                            name: response.payload[i].vendorName
                        };
                    }
                })
        })

        // *** Biz Logic ***
        $scope.showDocType = function (type) {
            return OfficialDocUtil.getDocType(type);
        }

        $scope.showReceiver = function (officialItem) {
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (officialItem.creatorDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: officialItem.creatorDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showCharger = function (officialItem) {
            // console.log(officialItem);
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (officialItem.chargerDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: officialItem.chargerDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showHandler = function (officialItem) {
            // console.log(officialItem);
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (officialItem.handlerDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: officialItem.handlerDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showVendorName = function (officialItem) {
            // console.log(officialItem);
            // console.log($scope.allVendors);
            var selected = [];
            if ($scope.allVendors === undefined) return;
            if (officialItem.vendorDID) {
                selected = $filter('filter')($scope.allVendors, {
                    value: officialItem.vendorDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showOfficialDocInfo = function (item) {
            $uibModal.open({
                animation: true,
                controller: 'officialDocInfoModalCtrl',
                templateUrl: 'app/pages/officialDoc/listOfficialDoc/modal/officialDocInfoModal.html',
                size: 'lg',
                resolve: {
                    docData: function () {
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

    }

})();