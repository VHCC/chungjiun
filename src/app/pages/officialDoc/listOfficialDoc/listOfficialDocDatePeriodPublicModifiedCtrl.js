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
                ListOfficialDocDatePeriodPublicModifiedCtrl
            ])

    /**
     * @ngInject
     */
    function ListOfficialDocDatePeriodPublicModifiedCtrl($scope,
                                 $filter,
                                 $cookies,
                                 $uibModal,
                                 User,
                                 OfficialDocUtil,
                                 OfficialDocVendorUtil,
                                 DateUtil,
                                 $compile) {

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

                    for (var index = 0; index < resp.payload.length; index ++) {
                        if ($scope.officialDocItems[index].archiveNumber.length != 11) {
                            $scope.officialDocItems[index].archiveNumber =
                                $scope.officialDocItems[index].archiveNumber +
                                OfficialDocUtil.getDivision($scope.officialDocItems[index].docDivision);
                        }
                    }

                    document.getElementById('includeHead_public_modified').innerText = "";
                    angular.element(
                        document.getElementById('includeHead_public_modified'))
                        .append($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'發文列表 - " + resp.payload.length +
                            " ( " + $('#inputStartDay_public_modified')[0].value + "~" + $('#inputEndDay_public_modified')[0].value + " )" +
                            "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/pages/officialDoc/listOfficialDoc/table/listOfficialPublicModifiedTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                })
        }
    }

})();