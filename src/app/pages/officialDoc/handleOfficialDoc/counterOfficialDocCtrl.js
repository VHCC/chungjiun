(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .service('intiOfficialWaitCounterService', function ($http, $cookies) {

            var formData = {
                counterDID: $cookies.get("userDID"),
                isDocClose: false,
                isDocSignStage: false,
                isCounterSign: true,
                type: 0,
            }

            var promise = $http.post('/api/post_official_doc_search_item', formData)
                .success(function (officialDocItems) {
                    return officialDocItems;
                });
            return promise;
        })
        .controller('counterOfficialDocCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$uibModal',
                'User',
                'Project',
                'OfficialDocUtil',
                'OfficialDocVendorUtil',
                '$compile',
                'intiOfficialWaitCounterService',
                CounterOfficialDocCtrl
            ]);

    /**
     * @ngInject
     */
    function CounterOfficialDocCtrl($scope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 User,
                                 Project,
                                 OfficialDocUtil,
                                 OfficialDocVendorUtil,
                                 $compile,
                                 intiOfficialWaitCounterService) {

        intiOfficialWaitCounterService.then(function (resp) {
            $scope.officialDocItems = resp.data.payload;
            $scope.officialDocItems.slice(0, resp.data.payload.length);

            for (var index = 0; index < $scope.officialDocItems.length; index ++) {
                if ($scope.officialDocItems[index].archiveNumber.length != 11) {
                    $scope.officialDocItems[index].archiveNumber =
                        OfficialDocUtil.getDivision($scope.officialDocItems[index].docDivision) +
                        $scope.officialDocItems[index].archiveNumber;
                }
            }

            angular.element(
                document.getElementById('includeHead_counter_sign'))
                .append($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'待會簽公文列表 - " + resp.data.payload.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/pages/officialDoc/handleOfficialDoc/table/counterSignOfficialTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));

            Project.findAll()
                .success(function (relatedProjects) {
                    console.log(" ======== related login user Projects ======== ");
                    $scope.relatedProjects = [];
                    for (var i = 0; i < relatedProjects.length; i++) {
                        $scope.relatedProjects[i] = {
                            value: relatedProjects[i]._id,
                            managerID: relatedProjects[i].managerID
                        };
                    }
                });

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
                    // console.log(response);
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
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (officialItem.chargerDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: officialItem.chargerDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showSigner = function (officialItem) {
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (officialItem.signerDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: officialItem.signerDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showManager = function (officialItem) {
            var selected = [];
            if ($scope.relatedProjects === undefined) return;
            if (officialItem.prjDID) {
                selected = $filter('filter')($scope.relatedProjects, {
                    value: officialItem.prjDID
                });
            }
            var selected_manager = [];
            if (selected.length) {
                selected_manager = $filter('filter')($scope.allUsers, {
                    value: selected[0].managerID
                });
            }
            return selected_manager.length ? selected_manager[0].name : 'Not Set';
        }

        $scope.showVendorName = function (officialItem) {
            var selected = [];
            if ($scope.allVendors === undefined) return;
            if (officialItem.vendorDID) {
                selected = $filter('filter')($scope.allVendors, {
                    value: officialItem.vendorDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showOfficialDocHandleInfo = function (item) {
            $uibModal.open({
                animation: true,
                controller: 'officialDocCounterSignModalCtrl',
                templateUrl: 'app/pages/officialDoc/handleOfficialDoc/modal/officialDocCounterSignModal.html',
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
                $scope.reloadDocData_counter_sign();
                // toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
            });
        }

        $scope.reloadDocData_counter_sign = function () {
            var formData = {
                counterDID: $cookies.get("userDID"),
                isDocClose: false,
                isDocSignStage: false,
                isCounterSign: true,
                type: 0,
            }

            OfficialDocUtil.searchOfficialDocItem(formData)
                .success(function (resp) {

                    $scope.officialDocItems = resp.payload;
                    $scope.officialDocItems.slice(0, resp.payload.length);

                    for (var index = 0; index < $scope.officialDocItems.length; index ++) {
                        if ($scope.officialDocItems[index].archiveNumber.length != 11) {
                            $scope.officialDocItems[index].archiveNumber =
                                OfficialDocUtil.getDivision($scope.officialDocItems[index].docDivision) +
                                $scope.officialDocItems[index].archiveNumber;
                        }
                    }

                    document.getElementById('includeHead_counter_sign').innerText = "";

                    angular.element(
                        document.getElementById('includeHead_counter_sign'))
                        .append($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'待會簽公文列表 - " + resp.payload.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/officialDoc/handleOfficialDoc/table/counterSignOfficialTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                });
        }

    }

})();