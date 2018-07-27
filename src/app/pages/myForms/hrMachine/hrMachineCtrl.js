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
                startDate: '20180712',
                endDate: '20180713',
            }

            console.log(formData)

            HrMachineUtil.fetchUserHrMachineDataByMachineDID(formData)
                .success(function (res) {
                    console.log(res);
                })


        } // End of function
    }
)();


