(function () {
    'user strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc')
        .controller('listOfficialDocDatePeriodPublicModifiedCtrl',
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

        $(document).ready(function () {
            console.log(" ====== initMask document ready ====== ")

            $('#inputStartDay_public_modified')[0].value = DateUtil.getShiftDatefromFirstDate(
                DateUtil.getFirstDayofThisWeek(moment()),
                moment().day() === 0 ? 6 : moment().day() - 1);
            $('#inputEndDay_public_modified')[0].value = DateUtil.getShiftDatefromFirstDate(
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

        $scope.searchDocPeriod_public_modified = function () {
            var formData = {
                startDay: $('#inputStartDay_public_modified')[0].value,
                endDay: $('#inputEndDay_public_modified')[0].value,
            }

            OfficialDocUtil.fetchOfficialDocItemPeriod_public(formData)
                .success(function (resp) {

                    $scope.officialDocItems = resp.payload;
                    $scope.officialDocItems.slice(0, resp.payload.length);

                    document.getElementById('includeHead_public_modified').innerText = "";
                    angular.element(
                        document.getElementById('includeHead_public_modified'))
                        .append($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'公文列表 - " + resp.payload.length +
                            " ( " + $('#inputStartDay_public_modified')[0].value + "~" + $('#inputEndDay_public_modified')[0].value + " )" +
                            "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/officialDoc/listOfficialDoc/table/listOfficialPublicTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                })
        }

        // $scope.getAllDocs = function () {
        //
        //     OfficialDocUtil.fetchOfficialDocAllItem()
        //         .success(function (resp) {
        //             console.log(resp);
        //
        //             $scope.officialDocItems = resp.payload;
        //             $scope.officialDocItems.slice(0, resp.payload.length);
        //
        //             document.getElementById('includeHead_public').innerText = "";
        //             angular.element(
        //                 document.getElementById('includeHead_public'))
        //                 .append($compile(
        //                     "<div ba-panel ba-panel-title=" +
        //                     "'公文列表 - " + resp.payload.length +
        //                     " ( " + $('#inputStartDay_public')[0].value + "~" + $('#inputEndDay_public')[0].value + " )" +
        //                     "'" +
        //                     "ba-panel-class= " +
        //                     "'with-scroll'" + ">" +
        //                     "<div " +
        //                     "ng-include=\"'app/pages/officialDoc/listOfficialDoc/table/listOfficialPublicTable.html'\">" +
        //                     "</div>" +
        //                     "</div>"
        //                 )($scope));
        //         })
        // }
    }

})();