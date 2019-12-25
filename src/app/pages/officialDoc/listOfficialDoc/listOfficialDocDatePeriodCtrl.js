(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('listOfficialDocDatePeriodCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                '$uibModal',
                'User',
                'OfficialDocUtil',
                'OfficialDocVendorUtil',
                'DateUtil',
                '$compile',
                function (scope,
                          filter,
                          $cookies,
                          $uibModal,
                          User,
                          OfficialDocUtil,
                          OfficialDocVendorUtil,
                          DateUtil,
                          $compile) {
                    return new ListOfficialDocCtrl(
                        scope,
                        filter,
                        $cookies,
                        $uibModal,
                        User,
                        OfficialDocUtil,
                        OfficialDocVendorUtil,
                        DateUtil,
                        $compile
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
                                 DateUtil,
                                 $compile) {

        // var thisYear = new Date().getFullYear() - 1911;
        // var thisMonth = new Date().getMonth() + 1; //January is 0!;
        //
        // $scope.month = this.month = undefined;
        // $scope.year = this.myYear;

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

        $(document).ready(function () {
            $('#inputStartDay')[0].value = DateUtil.getShiftDatefromFirstDate(
                DateUtil.getFirstDayofThisWeek(moment()),
                moment().day() === 0 ? 6 : moment().day() - 1);
            $('#inputEndDay')[0].value = DateUtil.getShiftDatefromFirstDate(
                DateUtil.getFirstDayofThisWeek(moment()),
                moment().day() === 0 ? 6 : moment().day() - 1);

            $('.statisticsDate').mask('2KY0/M0/D0', {
                translation: {
                    'K': {
                        pattern: /[0]/,
                    },
                    'Y': {
                        pattern: /[012]/,
                    },
                    'M': {
                        pattern: /[01]/,
                    },
                    'D': {
                        pattern: /[0123]/,
                    }
                }
            });
        });

        $scope.searchDocPeriod = function () {
            var formData = {
                startDay: $('#inputStartDay')[0].value,
                endDay: $('#inputEndDay')[0].value,
            }

            OfficialDocUtil.fetchOfficialDocItemPeriod(formData)
                .success(function (resp) {

                    console.log(resp);
                    $scope.officialDocItems = resp.payload;
                    $scope.officialDocItems.slice(0, resp.payload.length);

                    for (var index = 0; index < resp.payload.length; index ++) {
                        $scope.officialDocItems[index].chargerName = $scope.showCharger($scope.officialDocItems[index]);
                        $scope.officialDocItems[index].handlerName = $scope.showHandler($scope.officialDocItems[index]);
                    }

                    document.getElementById('includeHead').innerText = "";
                    angular.element(
                        document.getElementById('includeHead'))
                        .append($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'公文列表 - " + resp.payload.length +
                            " ( " + $('#inputStartDay')[0].value + "~" + $('#inputEndDay')[0].value + " )" +
                            "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/officialDoc/listOfficialDoc/table/listOfficialTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                })
        }

        $scope.getAllDocs = function () {

            OfficialDocUtil.fetchOfficialDocAllItem()
                .success(function (resp) {
                    console.log(resp);

                    $scope.officialDocItems = resp.payload;
                    $scope.officialDocItems.slice(0, resp.payload.length);

                    document.getElementById('includeHead').innerText = "";
                    angular.element(
                        document.getElementById('includeHead'))
                        .append($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'公文列表 - " + resp.payload.length +
                            " ( " + $('#inputStartDay')[0].value + "~" + $('#inputEndDay')[0].value + " )" +
                            "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/officialDoc/listOfficialDoc/table/listOfficialTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                })
        }
    }

})();