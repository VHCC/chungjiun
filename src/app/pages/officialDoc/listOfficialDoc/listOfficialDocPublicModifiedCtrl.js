(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .service('intiOfficialDocPublicModifiedService', function ($http, $cookies) {

            var formData = {
                startDay: moment().format("YYYY/MM/DD"),
                endDay: moment().format("YYYY/MM/DD"),
            }

            var promise = $http.post('/api/post_official_doc_fetch_item_period_public', formData)
                .success(function (allOfficialDocItems) {
                    return allOfficialDocItems;
                });
            return promise;
        })
        .controller('listOfficialDocPublicModifiedCtrl',
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
                'intiOfficialDocPublicModifiedService',
                ListOfficialDocPublicModifiedCtrl
            ])

    /**
     * @ngInject
     */
    function ListOfficialDocPublicModifiedCtrl($scope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 User,
                                 Project,
                                 OfficialDocUtil,
                                 OfficialDocVendorUtil,
                                 $compile,
                                 intiOfficialDocPublicModifiedService) {

        intiOfficialDocPublicModifiedService.then(function (resp) {
            $scope.officialDocItems = resp.data.payload;
            $scope.officialDocItems.slice(0, resp.data.payload.length);

            for (var index = 0; index < resp.data.payload.length; index ++) {
                if ($scope.officialDocItems[index].archiveNumber.length != 11) {
                    $scope.officialDocItems[index].archiveNumber =
                        $scope.officialDocItems[index].archiveNumber +
                        OfficialDocUtil.getDivision($scope.officialDocItems[index].docDivision);
                }
            }

            angular.element(
                document.getElementById('includeHead_public_modified'))
                .append($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'發文列表 - " + resp.data.payload.length +
                    " ( " + moment().format("YYYY/MM/DD") + "~" + moment().format("YYYY/MM/DD") + " )" +
                    "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/pages/officialDoc/listOfficialDoc/table/listOfficialPublicModifiedTable.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));

            Project.findAll()
                .success(function (relatedProjects) {
                    $scope.relatedProjects = [];
                    for (var i = 0; i < relatedProjects.length; i++) {
                        $scope.relatedProjects[i] = {
                            value: relatedProjects[i]._id,
                            managerID: relatedProjects[i].managerID,
                            majorID: relatedProjects[i].majorID
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

        $scope.showMajor = function (officialItem) {
            var selected = [];
            if ($scope.relatedProjects === undefined) return;
            if (officialItem.prjDID) {
                selected = $filter('filter')($scope.relatedProjects, {
                    value: officialItem.prjDID
                });
            }
            var selected_major = [];
            if (selected.length) {
                selected_major = $filter('filter')($scope.allUsers, {
                    value: selected[0].majorID
                });
            }
            return selected_major.length ? selected_major[0].name : 'Not Set';
        }

        $scope.showSigner = function (officialItem) {
            if (officialItem.stageInfo.length == 2) {
                return officialItem.stageInfo[officialItem.stageInfo.length - 1].handleName;
            }
            return officialItem.stageInfo.length > 1 ? officialItem.stageInfo[officialItem.stageInfo.length - 2].handleName : "尚未簽核";
        }

        $scope.showPublisher = function (officialItem) {
            return officialItem.stageInfo.length > 2 ? officialItem.stageInfo[officialItem.stageInfo.length - 1].handleName : "尚未發文";
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

        $scope.showOfficialDocInfo = function (item) {
            $uibModal.open({
                animation: true,
                controller: 'publicOfficialDocModifiedCtrl',
                controllerAs: 'publicOfficialDocModifiedCtrlVm',
                templateUrl: 'app/pages/officialDoc/listOfficialDoc/modal/publicOfficialDocModifiedModal.html',
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

        $scope.showDocPublicType = function (type) {
            return OfficialDocUtil.getDocPublicType(type);
        }

    }

})();