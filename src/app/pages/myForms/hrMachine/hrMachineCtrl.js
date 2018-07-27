/**
 * @author Ichen.chu
 * created on 26.07.2018
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .controller('hrMachineCtrl',
                [
                    '$scope',
                    '$filter',
                    '$cookies',
                    '$timeout',
                    'ngDialog',
                    'HrMachineUtil',
                    'User',
                    'DateUtil',
                    'TimeUtil',
                    'toastr',
                    ＨrMachineCtrl
                ]);

        /** @ngInject */
        function ＨrMachineCtrl($scope,
                                 $filter,
                                 cookies,
                                 $timeout,
                                 ngDialog,
                                 HrMachineUtil,
                                 User,
                                 DateUtil,
                                 TimeUtil,
                                 toastr) {


            $scope.username = cookies.get('username');
            $scope.userDID = cookies.get('userDID');
            $scope.roleType = cookies.get('roletype');
            $scope.machineDID = cookies.get('machineDID');

            var vm = this;
            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;
            $scope.year = thisYear;
            $scope.month = thisMonth;
            var thisDay = new Date().getDay();
            // ***********************  個人填寫 ************************

            console.log($scope.username);
            console.log($scope.userDID);
            console.log($scope.roleType);
            console.log($scope.machineDID);

            var formData = {
                machineDID: $scope.machineDID,
                startDate: '20180711',
                endDate: '20180727',
            }

            console.log(formData)

            HrMachineUtil.fetchUserHrMachineDataByMachineDID(formData)
                .success(function (res) {
                    console.log(res);
                })

            $scope.loadHrMachineDate = function (dom) {
                if (moment(dom.myDT).format('YYYYMMDD') === "Invalid date") {
                    toastr.error('請檢察日期', 'Error');
                    return;
                }
                var fileDate = moment(dom.myDT).format('YYYYMMDD')
                console.log(fileDate);
                var formData = {
                    loadDate: fileDate,
                }
                HrMachineUtil.loadHrMachineDataByDate(formData)
                    .success(function () {
                        toastr.success('讀取完成', 'Success');
                    })
                    .error(function () {
                        toastr.error('讀取失敗', '機器無該日期檔案');
                    })
            }

        } // End of function
    }
)();


