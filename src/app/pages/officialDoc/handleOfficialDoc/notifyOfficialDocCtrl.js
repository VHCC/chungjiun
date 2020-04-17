(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .service('intiOfficialWaitNotifyService', function ($http, $cookies) {
            var formData = {
                userDID: $cookies.get("userDID"),
                isDocOpened: false,
                type: 0,
            }

            console.log(formData)
            var promise = $http.post('/api/fetch_official_doc_notify', formData)
                .success(function (officialDocNotifyItems) {
                    return officialDocNotifyItems;
                });
            return promise;
        })
        .controller('notifyOfficialDocCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$uibModal',
                'User',
                'Project',
                'OfficialDocUtil',
                'OfficialDocVendorUtil',
                'OfficialDocNotifyUtil',
                '$compile',
                'intiOfficialWaitNotifyService',
                NotifyOfficialDocCtrl
            ]);

    /**
     * @ngInject
     */
    function NotifyOfficialDocCtrl($scope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 User,
                                 Project,
                                 OfficialDocUtil,
                                 OfficialDocVendorUtil,
                                 OfficialDocNotifyUtil,
                                 $compile,
                                 intiOfficialWaitNotifyService) {

        intiOfficialWaitNotifyService.then(function (resp) {
            $scope.officialDocNotifyItems = resp.data.payload;
            $scope.officialDocNotifyItems.slice(0, resp.data.payload.length);

            for (var index = 0; index < $scope.officialDocNotifyItems.length; index ++) {
                if ($scope.officialDocNotifyItems[index].archiveNumber.length != 11) {
                    $scope.officialDocNotifyItems[index]._archiveNumber =
                        OfficialDocUtil.getDivision($scope.officialDocNotifyItems[index].docDivision) +
                        $scope.officialDocNotifyItems[index].archiveNumber;
                }
            }

            angular.element(
                document.getElementById('includeHead_notify'))
                .append($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'被通知公文列表 - " + resp.data.payload.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/pages/officialDoc/handleOfficialDoc/table/notifyOfficialTable.html'\">" +
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

        $scope.showNotifier = function (officialItem) {
            var selected = [];
            if ($scope.allUsers === undefined) return;
            if (officialItem.creatorDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: officialItem.creatorDID
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

        $scope.fetchOfficialDocInstance = function(notifyItem) {

            console.log(notifyItem)

            var formData = {
                archiveNumber: notifyItem.archiveNumber,
                docDivision: notifyItem.docDivision,
                type: 0,
            }

            console.log(formData)
            OfficialDocUtil.searchOfficialDocItem(formData)
                .success(function (resp) {
                    console.log(resp)
                    $scope.showOfficialDocHandleInfo(resp.payload[0], notifyItem);
                })
        }

        $scope.showOfficialDocHandleInfo = function (docData, notifyItem) {
            $uibModal.open({
                animation: true,
                controller: 'officialDocNotifyModalCtrl',
                templateUrl: 'app/pages/officialDoc/handleOfficialDoc/modal/officialDocNotifyModal.html',
                size: 'lg',
                resolve: {
                    docData: function () {
                        return docData;
                    },
                    parent: function () {
                        return $scope;
                    },
                    notifyItem: function () {
                        return notifyItem;
                    }
                }
            }).result.then(function () {
                $scope.reloadDocData_notify();
                // toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
            });
        }

        $scope.reloadDocData_notify = function () {
            var formData = {
                userDID: $cookies.get("userDID"),
                isDocOpened: false,
                type: 0,
            }

            OfficialDocNotifyUtil.fetchOfficialDocNotify(formData)
                .success(function (resp) {

                    console.log(resp)

                    $scope.officialDocNotifyItems = resp.payload;
                    $scope.officialDocNotifyItems.slice(0, resp.payload.length);

                    for (var index = 0; index < $scope.officialDocNotifyItems.length; index ++) {
                        if ($scope.officialDocNotifyItems[index].archiveNumber.length != 11) {
                            $scope.officialDocNotifyItems[index]._archiveNumber =
                                OfficialDocUtil.getDivision($scope.officialDocNotifyItems[index].docDivision) +
                                $scope.officialDocNotifyItems[index].archiveNumber;
                        }
                    }

                    document.getElementById('includeHead_notify').innerText = "";

                    angular.element(
                        document.getElementById('includeHead_notify'))
                        .append($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'被通知公文列表 - " + resp.payload.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/officialDoc/handleOfficialDoc/table/notifyOfficialTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                });
        }

    }

})();