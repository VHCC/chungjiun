(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .service('intiOfficialCheckPublicService', function ($http, $cookies) {

            var formData = {
                type: 1, // receive = 0, public = 1
                isDocCanPublic: false,
            }

            var promise = $http.post('/api/post_official_doc_search_item', formData)
                .success(function (officialDocItems) {
                    return officialDocItems;
                });
            return promise;
        })
        .controller('checkPublicOfficialDocCtrl',
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
                'intiOfficialCheckPublicService',
                 CheckPublicOfficialDocCtrl
            ])

    /**
     * @ngInject
     */
    function CheckPublicOfficialDocCtrl($scope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 User,
                                 Project,
                                 OfficialDocUtil,
                                 OfficialDocVendorUtil,
                                 $compile,
                                 intiOfficialCheckPublicService) {

        intiOfficialCheckPublicService.then(function (resp) {
            $scope.officialDocItems = resp.data.payload;
            $scope.officialDocItems.slice(0, resp.data.payload.length);

            for (var index = 0; index < resp.data.payload.length; index ++) {
                if ($scope.officialDocItems[index].archiveNumber.length != 11) {
                    $scope.officialDocItems[index].archiveNumber =
                        $scope.officialDocItems[index].archiveNumber +
                        (($scope.officialDocItems[index].docDivision != undefined ||
                            $scope.officialDocItems[index].docDivision != null) ?
                            OfficialDocUtil.getDivision($scope.officialDocItems[index].docDivision) : "");
                }
            }

            angular.element(
                document.getElementById('includeHead'))
                .append($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'代理審核列表 - " + resp.data.payload.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/pages/officialDoc/publicOfficialDoc/table/checkPublicOfficialTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));

            Project.findAll()
                .success(function (relatedProjects) {
                    console.log(" ======== related login user Projects ======== ");
                    // console.log(relatedProjects);
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

        $scope.showOfficialDocHandleInfo = function (item) {
            $uibModal.open({
                animation: true,
                controller: 'officialDocCheckPublicModalCtrl',
                templateUrl: 'app/pages/officialDoc/publicOfficialDoc/modal/officialDocCheckPublicModal.html',
                size: 'lg',
                resolve: {
                    docData: function () {
                        return item;
                    },
                    parent: function () {
                        return $scope;
                    },
                    canDeleteAttachments: function () {
                        return true;
                    },
                    isCharger: function () {
                        return false;
                    },
                    canApproveDoc: function () {
                        return true;
                    }
                }
            }).result.then(function () {
                $scope.reloadDocData_check();
                // toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
            });

            $scope.readOfficialDoc(item);
        }

        // read doc
        $scope.readOfficialDoc = function (item) {
            var formData = {
                _id: item._id,
                isDocOpened: true,
            }
            OfficialDocUtil.updateOfficialDocItem(formData)
                .success(function (res) {
                    item.isDocOpened = true;
                })
        }

        $scope.reloadDocData_check = function () {
            var formData = {
                type: 1, // receive = 0, public = 1
                isDocCanPublic: false,
            }

            OfficialDocUtil.searchOfficialDocItem(formData)
                .success(function (resp) {

                    $scope.officialDocItems = resp.payload;
                    $scope.officialDocItems.slice(0, resp.payload.length);

                    document.getElementById('includeHead').innerText = "";

                    angular.element(
                        document.getElementById('includeHead'))
                        .append($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'代理審核列表 - " + resp.payload.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/officialDoc/publicOfficialDoc/table/checkPublicOfficialTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                });
        }

    }

})();