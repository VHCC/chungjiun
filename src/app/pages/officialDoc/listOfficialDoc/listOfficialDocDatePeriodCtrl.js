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

        $(document).ready(function () {
            console.log(" ====== initMask document ready ====== ")

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