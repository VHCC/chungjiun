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

            // 主要顯示
            $scope.hrMachineTable = [];

            $scope.fetchData = function() {
                var formData = {
                    machineDID: $scope.machineDID,
                    startDate: '20180701',
                    endDate: '20180731',
                }

                console.log(formData)

                HrMachineUtil.fetchUserHrMachineDataByMachineDID(formData)
                    .success(function (res) {
                        var arrayResult = res.payload;
                        arrayResult.sort(sortFunction);
                        $scope.hrMachineTable = arrayResult;
                        console.log(arrayResult);
                    })
            }

            function sortFunction(a, b){
                var dateA = new Date(convertDate(a[0].date)).getTime();
                var dateB = new Date(convertDate(b[0].date)).getTime();
                return dateA > dateB ? 1 : -1;
            };

            function convertDate(mString) {
                var resultString = "";
                resultString += String(parseInt(mString.substring(0,3),10) + 1911) + "/";
                resultString += mString.substring(3, 5) + "/";
                resultString += mString.substring(5, 7);
                return resultString;
            }

            $scope.changeHrMachineMonth = function(changeCount, dom) {
                console.log(changeCount);
                console.log(dom);
                dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
                dom.myDT = moment(dom.myDT).add(changeCount, 'M');
            }

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

            $scope.showHrMachineTime = function (datas, type) {
                switch(type) {
                    // 上班
                    case 1:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "1") {
                                return datas[index].time
                            }
                        }
                        break;
                    //    下班
                    case 2:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "2") {
                                return datas[index].time
                            }
                        }
                        break;
                    //    加班簽到
                    case 31:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "3") {
                                return datas[index].time
                            }
                        }
                        break;
                    //    加班簽退
                    case 41:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                return datas[index].time
                            }
                        }
                        break;
                    //    加班簽到
                    case 32:
                        var count = 0;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "3") {
                                if (count == 1) {
                                    return datas[index].time
                                }
                                count ++
                            }
                        }
                        break;
                    //    加班簽退
                    case 42:
                        var count = 0;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                if (count == 1) {
                                    return datas[index].time
                                }
                                count ++
                            }
                        }
                        break;
                    //    加班簽到
                    case 33:
                        var count = 0;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "3") {
                                if (count == 2) {
                                    return datas[index].time
                                }
                                count ++
                            }
                        }
                        break;
                    //    加班簽退
                    case 43:
                        var count = 0;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                if (count == 2) {
                                    return datas[index].time
                                }
                                count ++
                            }
                        }
                        break;
                    //    加班簽到
                    case 34:
                        var count = 0;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "3") {
                                if (count == 3) {
                                    return datas[index].time
                                }
                                count ++
                            }
                        }
                        break;
                    //    加班簽退
                    case 44:
                        var count = 0;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                if (count == 3) {
                                    return datas[index].time
                                }
                                count ++
                            }
                        }
                        break;
                    //    外出
                    case 5:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "5") {
                                return datas[index].time
                            }
                        }
                        break;
                    //    返回
                    case 6:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "6") {
                                return datas[index].time
                            }
                        }
                        break;
                }
            }

        } // End of function
    }
)();


