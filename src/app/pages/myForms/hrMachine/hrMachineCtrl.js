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
                    'bsLoadingOverlayService',
                    HrMachineCtrl
                ]);

        /** @ngInject */
        function HrMachineCtrl($scope,
                                 $filter,
                                 cookies,
                                 $timeout,
                                 ngDialog,
                                 HrMachineUtil,
                                 User,
                                 DateUtil,
                                 TimeUtil,
                                 toastr,
                                 bsLoadingOverlayService) {


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

            // 行政總管專屬
            if ($scope.roleType == 100 || $scope.roleType == 2) {
                // 所有人，對照資料
                User.getAllUsers()
                    .success(function (allUsers) {
                        vm.users = allUsers;
                        vm.users_month_report = allUsers;
                    });
            }

            // ***** main Tab 主要顯示 *****
            $scope.hrMachineTable = [];

            // ***** specific user 主要顯示 *****
            $scope.hrMachineTable_specific = [];

            // ***** month reports 主要顯示 *****
            $scope.hrMachineTable_month_reports = [];


            // type 0 : main tab
            // type 1 : specific user tab
            // type 2 : month reports tab
            $scope.fetchData = function(machineDID, specificDate, type) {

                bsLoadingOverlayService.start({
                    referenceId: 'overlay_hrMachine'
                });

                $scope.hrMachineTable = [];
                $scope.hrMachineTable_specific = [];
                $scope.hrMachineTable_month_reports = [];

                // var startDate = moment().format('YYYYMM') + "01";
                // var endDate = moment().format('YYYYMM') + moment().daysInMonth();
                var today = moment().format('YYYYMMDD');

                // if (month !== undefined) {
                //     startDate = moment(month).format('YYYYMM') + "01";
                //     endDate = moment(month).format('YYYYMM') + moment(month).daysInMonth();
                // }

                var formData = {
                    machineDID: machineDID == undefined ? $scope.machineDID : machineDID,
                    date: specificDate == undefined ? today : specificDate,
                }

                HrMachineUtil.fetchUserHrMachineDataOneDayByMachineDID(formData)
                    .success(function (res) {
                        res.payload = res.payload.sort(function (a, b) {
                            return a._id > b._id ? 1 : -1;
                        });

                        console.log(res.payload);

                        var arrayResult = res.payload;

                        var hrMachineTableSorted = {};
                        var lastDate = "";

                        for (var index = 0; index < arrayResult[0].length; index++) {
                            // console.log(arrayResult[0][index].date);

                            var yearString = parseInt(arrayResult[0][index].date.substr(0, 3)) + 1911;
                            var dateString = arrayResult[0][index].date.substr(3, arrayResult[0][index].date.length);
                            // console.log(yearString + dateString);
                            var newDate = yearString + dateString;

                            // console.log(moment(newDate).format('MM'));

                            if (type == 2) {
                                if (moment(newDate).format('MM') != moment(specificDate).format('MM')) {
                                    continue;
                                }
                            }


                            var hrMachineItem = {
                                date: "",
                                did: "",
                                location: "",
                                printType: "",
                                time: "",
                                workType: ""
                            }
                            // console.log(hrMachineTableSorted);
                            if (hrMachineTableSorted[arrayResult[0][index].date] === undefined) {
                                hrMachineItem.date = arrayResult[0][index].date;
                                hrMachineItem.did = arrayResult[0][index].did;
                                hrMachineItem.location = arrayResult[0][index].location;
                                hrMachineItem.printType = arrayResult[0][index].printType;
                                hrMachineItem.time = arrayResult[0][index].time;
                                hrMachineItem.workType = arrayResult[0][index].workType;

                                var hrMachineCollection = [];
                                hrMachineCollection.push(hrMachineItem);
                                // console.log(hrMachineCollection);
                                hrMachineTableSorted[arrayResult[0][index].date] = hrMachineCollection;

                                if (arrayResult[0][index].workType == 4) {
                                    var hrMachineItemTemp = {
                                        date: "",
                                        did: "",
                                        location: "",
                                        printType: "",
                                        time: "",
                                        workType: ""
                                    }
                                    hrMachineItemTemp.date = arrayResult[0][index].date;
                                    hrMachineItemTemp.did = arrayResult[0][index].did;
                                    hrMachineItemTemp.location = arrayResult[0][index].location;
                                    hrMachineItemTemp.printType = arrayResult[0][index].printType;
                                    hrMachineItemTemp.time = "0000";
                                    hrMachineItemTemp.workType = "3";
                                    hrMachineTableSorted[arrayResult[0][index].date].push(hrMachineItemTemp);

                                    // console.log(lastDate);
                                    // console.log(hrMachineTableSorted[lastDate]);

                                    if (hrMachineTableSorted[lastDate] !== undefined) {

                                        var hrMachineItemLastDate = {
                                            date: "",
                                            did: "",
                                            location: "",
                                            printType: "",
                                            time: "",
                                            workType: ""
                                        }
                                        hrMachineItemLastDate.date = arrayResult[0][index].date;
                                        hrMachineItemLastDate.did = arrayResult[0][index].did;
                                        hrMachineItemLastDate.location = arrayResult[0][index].location;
                                        hrMachineItemLastDate.printType = arrayResult[0][index].printType;
                                        hrMachineItemLastDate.time = "2400";
                                        hrMachineItemLastDate.workType = "4";
                                        hrMachineTableSorted[lastDate].push(hrMachineItemLastDate);

                                    }
                                }

                                lastDate = arrayResult[0][index].date;

                            } else {
                                hrMachineItem.date = arrayResult[0][index].date;
                                hrMachineItem.did = arrayResult[0][index].did;
                                hrMachineItem.location = arrayResult[0][index].location;
                                hrMachineItem.printType = arrayResult[0][index].printType;
                                hrMachineItem.time = arrayResult[0][index].time;
                                hrMachineItem.workType = arrayResult[0][index].workType;
                                hrMachineTableSorted[arrayResult[0][index].date].push(hrMachineItem);
                                // console.log(hrMachineTableSorted[arrayResult[0][index].date]);

                                lastDate = arrayResult[0][index].date;
                            }
                        }

                        switch(type) {
                            case 0:
                                $scope.hrMachineTable = hrMachineTableSorted;
                                break;
                            case 1:
                                $scope.hrMachineTable_specific = hrMachineTableSorted;
                                break;
                            case 2:
                                $scope.hrMachineTable_month_reports = hrMachineTableSorted;
                                break;

                        }
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'overlay_hrMachine'
                            });
                        }, 500)
                    })
                    .error(function () {
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'overlay_hrMachine'
                            });
                        }, 500)
                    })
            }

            function convertDate(mString) {
                var resultString = "";
                resultString += String(parseInt(mString.substring(0,3),10) + 1911) + "/";
                resultString += mString.substring(3, 5) + "/";
                resultString += mString.substring(5, 7);
                return resultString;
            }

            // @Deprecated
            $scope.changeHrMachineMonth = function(changeCount, dom) {
                // dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
                // dom.myDT = moment(dom.myDT).add(changeCount, 'M');
                // $scope.fetchData(dom.myMonth);
            }

            // 打卡機檔案讀取
            $scope.loadHrMachineDate = function (dom) {
                if (moment(dom.myDT).format('YYYYMMDD') === "Invalid date") {
                    toastr.error('請檢察日期', 'Error');
                    return;
                }
                var fileDate = moment(dom.myDT).format('YYYYMMDD');
                // console.log(fileDate);
                var formData = {
                    loadDate: fileDate,
                }
                HrMachineUtil.loadHrMachineDataByDate(formData)
                    .success(function () {
                        // toastr.success('讀取完成', 'Success');
                    })
                    .error(function () {
                        toastr.error('讀取失敗', '機器無該日期檔案');
                    })
            }

            // 月報表
            $scope.loadHrMachineMonth = function (dom) {
                // var fileDate = moment(dom.myDT).format('YYYYMMDD');
                var fileDate = moment(dom.myDT).endOf('month').format('YYYYMMDD')
                // console.log(fileDate);

                if (vm.users_month_report.selected == undefined) {
                    toastr.error('操作異常', '請先選取員工');
                    return;
                }

                bsLoadingOverlayService.start({
                    referenceId: 'overlay_hrMachine'
                });

                var formData = {
                    loadDate: fileDate,
                }
                HrMachineUtil.loadHrMachineDataByDate(formData)
                    .success(function (res) {
                        $scope.fetchData(vm.users_month_report.selected.machineDID, res.fileDate, 2);

                    })
                    .error(function (res) {
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'overlay_hrMachine'
                            });
                        }, 500)
                        toastr.error('讀取失敗', '機器無該日期檔案, ' + res.fileDate);
                    })
            }

            $scope.showHrMachineTime = function (datas, type) {
                switch(type) {
                    // 上班 1
                    // 連續多筆type=1，以第一筆為主
                    case 11:
                        var workOnArray = [];
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "1") {
                                workOnArray.push(datas[index]);
                                // return datas[index].time;
                            }
                        }

                        if (workOnArray.length > 0) {
                            return workOnArray[0].time;
                        }
                        break;
                    // 下班 1
                    // 連續多筆type=2，以最後一筆為主
                    // 遇到 上班 2 就停止
                    case 21:
                        var workOffArray = [];
                        var isFirstWorkOff = false;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "2") {
                                // return datas[index].time
                                workOffArray.push(datas[index]);
                                isFirstWorkOff = true;
                            }
                            if (isFirstWorkOff && datas[index].workType === "1") {
                                break;
                            }
                        }
                        if (workOffArray.length > 0) {
                            return workOffArray[workOffArray.length - 1].time;
                        }
                        break;
                    // 上班 2
                    // 一定要有 下班 1
                    //
                    case 12: //
                        var workOnArray = [];
                        var isSecondWorkOn = false;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "2") {
                                isSecondWorkOn = true;
                            }
                            if (datas[index].workType === "1") {
                                if (isSecondWorkOn) {
                                    workOnArray.push(datas[index]);
                                }
                            }
                        }
                        // console.log(workOnArray)
                        if (workOnArray.length > 0) {
                            return workOnArray[0].time;
                        }
                        break;
                    // 下班 2
                    // 一定要有 上班 2
                    case 22:
                        var workOnArray = [];
                        var isSecondWorkOn = false;
                        var workOffArray = [];
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "2") {
                                isSecondWorkOn = true;
                            }
                            if (datas[index].workType === "1") {
                                if (isSecondWorkOn) {
                                    workOnArray.push(datas[index]);
                                }
                            }
                            if (workOnArray.length > 0 && datas[index].workType === "2") {
                                workOffArray.push(datas[index]);
                            }
                        }
                        // console.log(workOffArray)
                        if (workOffArray.length > 0) {
                            return workOffArray[workOffArray.length - 1].time;
                        }
                        break;
                    // 加班簽到 1
                    // 連續多筆type=3，以第一筆為主
                    case 31:
                        var workOverOnArray = [];
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "3") {
                                workOverOnArray.push(datas[index]);
                                // return datas[index].time
                            }
                        }
                        if (workOverOnArray.length > 0) {
                            return workOverOnArray[0].time;
                        }
                        break;
                    // 加班簽退 1
                    // 連續多筆type=4，以最後一筆為主
                    // 遇到 加班簽退 2 就停止
                    case 41:
                        var workOverOffArray = [];
                        var isFirstWorkOverOff = false;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                workOverOffArray.push(datas[index]);
                                isFirstWorkOverOff = true;
                                // return datas[index].time
                            }
                            if (isFirstWorkOverOff && datas[index].workType === "3") {
                                break;
                            }
                        }
                        if (workOverOffArray.length > 0) {
                            return workOverOffArray[workOverOffArray.length - 1].time;
                        }
                        break;
                    //  加班時數1
                    // Deprecated
                    case 51:
                        var workOnHour;
                        var workOnMin;
                        var workOffHour;
                        var workOffMin;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "3") {
                                // console.log("A " + datas[index].time);
                                workOnHour = parseInt(datas[index].time.substr(0,2));
                                workOnMin = parseInt(datas[index].time.substr(2,4));
                                // console.log("AA " + workOnHour + ":" + workOnMin);
                            }
                            if (datas[index].workType === "4") {
                                // console.log("B " + datas[index].time);
                                workOffHour = parseInt(datas[index].time.substr(0,2));
                                workOffMin = parseInt(datas[index].time.substr(2,4));
                                // console.log("BB " + workOffHour + ":" + workOffMin);
                            }
                            if (workOnHour && workOffHour) {
                                // console.log("C " + workOnHour + ":" + workOnMin);
                                // console.log("D " + workOffHour + ":" + workOffMin);
                                var hour = Math.floor(((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin))/60);
                                var min = (((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin))%60) / 60 >= 0.5 ? 0.5 : 0;
                                return parseInt(hour) + min;
                                // return parseInt(hour);
                                // return min;
                            }

                            if (workOnHour == 0 && workOffHour) {
                                // console.log("CC " + workOnHour + ":" + workOnMin);
                                // console.log("DD " + workOffHour + ":" + workOffMin);
                                var hour = Math.floor(((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin))/60);
                                var min = (((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin))%60) / 60 >= 0.5 ? 0.5 : 0;
                                return parseInt(hour) + min;
                                // return parseInt(hour);
                                // return min;
                            }

                            if (workOnHour == 0 && workOffHour == 0) {
                                // console.log("CCC " + workOnHour + ":" + workOnMin);
                                // console.log("DDD " + workOffHour + ":" + workOffMin);
                                var hour = Math.floor(((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin))/60);
                                var min = (((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin))%60) / 60 >= 0.5 ? 0.5 : 0;
                                return parseInt(hour) + min;
                                // return parseInt(hour);
                                // return min;
                            }


                        }
                        break;
                    //  加班簽到2
                    // 一定要有 加班簽退 1
                    case 32:
                        var workOverOnArray = [];
                        var isSecondWorkOverOn = false;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                isSecondWorkOverOn = true;
                            }
                            if (datas[index].workType === "3" && datas[index].time != "0000") {
                                if (isSecondWorkOverOn) {
                                    workOverOnArray.push(datas[index]);
                                }
                            }
                        }
                        if (workOverOnArray.length > 0) {
                            return workOverOnArray[0].time;
                        }
                        break;
                    //  加班簽退2
                    // 一定要有 加班簽到 2
                    case 42:
                        var workOverOnArray = [];
                        var isSecondWorkOverOn = false;
                        var workOverOffArray = [];
                        var isSecondWorkOffOn = false;
                        for (var index = 0; index < datas.length; index++) {

                            if (datas[index].workType === "4") {
                                isSecondWorkOverOn = true;
                            }
                            if (datas[index].workType === "3" && datas[index].time != "0000") {
                                if (isSecondWorkOverOn) {
                                    workOverOnArray.push(datas[index]);
                                }
                                if (isSecondWorkOffOn) {
                                    break;
                                }

                            }
                            if (workOverOnArray.length > 0 && datas[index].workType === "4") {
                                workOverOffArray.push(datas[index]);
                                isSecondWorkOffOn = true;
                            }
                        }
                        if (workOverOffArray.length > 0) {
                            return workOverOffArray[workOverOffArray.length - 1].time;
                        }
                        break;
                    //  加班時數2
                    case 52:
                        var count1 = 0;
                        var count2 = 0;
                        for (var index = 0; index < datas.length; index++) {
                            // console.log(datas[index]);
                            if (datas[index].workType === "3") {
                                var overOnHour2 = parseInt(datas[index].time.substr(0,2));
                                var overOnMin2 = parseInt(datas[index].time.substr(2,4));
                                if (count1 < 2) {
                                    count1 ++
                                }
                            }
                            if (datas[index].workType === "4") {
                                var overOffHour2 = parseInt(datas[index].time.substr(0,2));
                                var overOffMin2 = parseInt(datas[index].time.substr(2,4));
                                if (count2 < 2) {
                                    count2 ++
                                }
                            }
                            if (overOnHour2 && overOffHour2) {
                                var hour2 = Math.floor(((overOffHour2 - overOnHour2) * 60 + (overOffMin2 - overOnMin2))/60);
                                var min2 = (((overOffHour2 - overOnHour2) * 60 + (overOffMin2 - overOnMin2))%60) / 60 >= 0.5 ? 0.5 : 0;
                                if (count1 == 2 && count2 == 2) {
                                    // console.log(workOnHour2 + ":" + workOffHour2);
                                    return parseInt(hour2) + min2;
                                }

                                // return min;
                                // return parseInt(hour);

                            }

                        }
                        break;
                    //  加班簽到3
                    // 一定要有 加班簽退 2
                    case 33:
                        var workOverOnArray = [];
                        var isSecondWorkOverOn = false;
                        var workOverOffArray = [];
                        var isSecondWorkOffOn = false;
                        var workOverOnThirdArray = [];
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                isSecondWorkOverOn = true;
                            }
                            if (datas[index].workType === "3" && datas[index].time != "0000") {
                                if (isSecondWorkOverOn) {
                                    workOverOnArray.push(datas[index]);
                                }
                                if (isSecondWorkOffOn) {
                                    workOverOnThirdArray.push(datas[index]);
                                }
                            }
                            if (workOverOnArray.length > 0 && datas[index].workType === "4") {
                                workOverOffArray.push(datas[index]);
                                isSecondWorkOffOn = true;
                            }
                        }
                        if (workOverOnThirdArray.length > 0) {
                            return workOverOnThirdArray[0].time;
                        }
                        break;
                    //  加班簽退3
                    case 43:
                        var workOverOnArray = [];
                        var isSecondWorkOverOn = false;
                        var workOverOffArray = [];
                        var isSecondWorkOffOn = false;
                        var workOverOnThirdArray = [];
                        var isThirdWorkOffOn = false;
                        var workOverOffThirdArray = [];
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                isSecondWorkOverOn = true;
                            }
                            if (datas[index].workType === "3" && datas[index].time != "0000") {
                                if (isSecondWorkOverOn) {
                                    workOverOnArray.push(datas[index]);
                                }
                                if (isSecondWorkOffOn) {
                                    workOverOnThirdArray.push(datas[index]);
                                }
                                if (isThirdWorkOffOn) {
                                    break;
                                }
                            }
                            if (workOverOnArray.length > 0 && datas[index].workType === "4") {
                                workOverOffArray.push(datas[index]);
                                isSecondWorkOffOn = true;
                            }
                            if (workOverOnThirdArray.length > 0 && datas[index].workType === "4") {
                                workOverOffThirdArray.push(datas[index]);
                                isThirdWorkOffOn = true;
                            }
                        }
                        if (workOverOffThirdArray.length > 0) {
                            return workOverOffThirdArray[workOverOffThirdArray.length - 1].time;
                        }
                        break;
                    //  加班時數3
                    case 53:
                        var count1 = 0;
                        var count2 = 0;
                        for (var index = 0; index < datas.length; index++) {

                            if (datas[index].workType === "3") {
                                var overOnHour3 = parseInt(datas[index].time.substr(0,2));
                                var overOnMin3 = parseInt(datas[index].time.substr(2,4));
                                if (count1 < 3) {
                                    count1 ++
                                }
                            }
                            if (datas[index].workType === "4") {
                                var overOffHour3 = parseInt(datas[index].time.substr(0,2));
                                var overOffMin3 = parseInt(datas[index].time.substr(2,4));
                                if (count2 < 3) {
                                    count2 ++
                                }
                            }
                            if (overOnHour3 && overOffHour3) {
                                var hour3 = Math.floor(((overOffHour3 - overOnHour3) * 60 + (overOffMin3 - overOnMin3))/60);
                                var min3 = (((overOffHour3 - overOnHour3) * 60 + (overOffMin3 - overOnMin3))%60) / 60 >= 0.5 ? 0.5 : 0;
                                if (count1 == 3 && count2 == 3) {
                                    // console.log(workOnHour3 + ":" + workOffHour3);
                                    return parseInt(hour3) + min3;
                                }
                                // return parseInt(hour);
                                // return min;
                                count ++
                            }

                        }
                        break;
                    //  加班簽到4
                    case 34:
                        var count = 0;
                        var OverOnTime;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "3") {
                                if (count == 3) {
                                    if (datas[index].time != OverOnTime) {
                                        return datas[index].time
                                    }
                                }
                                count ++
                                OverOnTime = datas[index].time;
                            }
                        }
                        break;
                    //  加班簽退4
                    case 44:
                        var count = 0;
                        var OverOffTime;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                if (count == 3) {
                                    if (datas[index].time != OverOffTime) {
                                        return datas[index].time
                                    }
                                }
                                count ++
                                OverOffTime = datas[index].time;
                            }
                        }
                        break;
                    //  外出
                    case 5:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "5") {
                                return datas[index].time
                            }
                        }
                        break;
                    //  返回
                    case 6:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "6") {
                                return datas[index].time
                            }
                        }
                        break;
                }
            }

            $scope.showDay = function (date) {
                // console.log(date);
                // console.log(parseInt(date.substring(0,3)) + 1911);
                // console.log(date.substring(3,7));
                // console.log(parseInt(date.substring(0,3)) + 1911 + date.substring(3,7));
                // console.log(moment(parseInt(date.substring(0,3)) + 1911 + date.substring(3,7)));
                // console.log(moment(parseInt(date.substring(0,3)) + 1911 + date.substring(3,7)).day());
                return DateUtil.getDay(moment(parseInt(date.substring(0,3)) + 1911 + date.substring(3,7)).day())
            }

            // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝ＣＨＪ ＲＵＬＥ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

            // 遲到判斷
            $scope.isLate = function (tableItem, type) {

                var operateArray = [];

                var isLate = false;

                // console.log(tableItem);

                for (var index = 0; index < tableItem.length; index++) {
                    if (tableItem[index].workType === "1") {
                        operateArray.push(tableItem[index]);
                    }
                }

                // console.log(operateArray);
                // console.log("isLate, type= " + type);

                if (operateArray.length > 0 && operateArray[type] != undefined) {
                    var workOnHour = parseInt(operateArray[type].time.substr(0,2));
                    var workOnMin = parseInt(operateArray[type].time.substr(2,4));

                    if (workOnHour <= 8) {
                        isLate = false
                    } else if (workOnHour == 9 && workOnMin == 0) {
                        isLate = false
                    } else {
                        isLate = true;
                    }
                }

                // for (var index = 0; index < tableItem.length; index++) {
                //     if (tableItem[index].workType === "1") {
                //         // console.log(tableItem[index]);
                //         var workOnHour = parseInt(tableItem[index].time.substr(0,2));
                //         var workOnMin = parseInt(tableItem[index].time.substr(2,4));
                //         if (workOnHour <= 8) {
                //             // return false;
                //         } else {}
                //
                //         if (workOnHour == 9 && workOnMin == 0) {
                //             // return false;
                //         } else {
                //             isLate = true;
                //         }
                //     }
                // }

                return isLate;
            }

            // 請假時數
            // Deprecated
            $scope.workOffHour = function (tableItem) {
                if ($scope.showWorkHour(tableItem,
                    $scope.showHrMachineTime(tableItem, 11),
                    $scope.showHrMachineTime(tableItem, 21),
                    $scope.showHrMachineTime(tableItem, 12),
                    $scope.showHrMachineTime(tableItem, 22)) != undefined) {
                    var result = 480 - $scope.showWorkHour(tableItem,
                        $scope.showHrMachineTime(tableItem, 11),
                        $scope.showHrMachineTime(tableItem, 21),
                        $scope.showHrMachineTime(tableItem, 12),
                        $scope.showHrMachineTime(tableItem, 22)) > 0 ?
                        480 - $scope.showWorkHour(tableItem,
                        $scope.showHrMachineTime(tableItem, 11),
                        $scope.showHrMachineTime(tableItem, 21),
                        $scope.showHrMachineTime(tableItem, 12),
                        $scope.showHrMachineTime(tableItem, 22)) : 0 ;
                    // console.log(result);
                    // console.log($scope.showHrMachineTime(tableItem, 12));
                    // console.log($scope.showHrMachineTime(tableItem, 22));
                    if (result == 0) {
                        return "";
                    }

                    if (result <= 60) {
                        return 1;
                    } else {
                        // console.log(result);
                        return Math.floor(result/60) + (((result % 60) / 60 > 0.5) ? 1 : (result % 60) == 0 ? 0 : 0.5);
                        // return result;
                        // return Math.floor(result/60);
                    }
                }
            }

            // 上班時數
            // Deprecated
            // $scope.workHour2 = function (tableItem) {
            //     // console.log(tableItem);
            //     var result = undefined;
            //     var isBeforeNoon = false;
            //     var isAfterNoon = false;
            //     var workOnCount = 0;
            //     var workOffCount = 0;
            //     for (var index = 0; index < tableItem.length; index++) {
            //         if (tableItem[index].workType === "1") {
            //             // console.log("上班");
            //             var workOnHour = parseInt(tableItem[index].time.substr(0,2));
            //             var workOnMin = parseInt(tableItem[index].time.substr(2,4));
            //
            //             if (workOnHour < 8) { // before 0800 => 0800, ex: 0759 => 0800
            //                 workOnHour = 8;
            //                 workOnMin = 0;
            //             }
            //
            //             //遲到規則
            //             if (workOnCount == 0) {
            //                 if (workOnHour >= 9 && workOnMin >= 1) {
            //                     if (workOnMin <= 30) {
            //                         workOnMin = 30;
            //                     } else if (workOnMin > 30) {
            //                         workOnHour += 1;
            //                         workOnMin = 0;
            //                     }
            //                 }
            //                 // 20190408設計
            //             }
            //
            //             if (workOnHour < 12) {
            //                 isBeforeNoon = true;
            //             }
            //             // console.log("index:" + index);
            //             // console.log(workOnHour + ":" + workOnMin);
            //             workOnCount ++;
            //         }
            //         if (tableItem[index].workType === "2") {
            //             // console.log("下班");
            //             var workOffHour = parseInt(tableItem[index].time.substr(0,2));
            //             var workOffMin = parseInt(tableItem[index].time.substr(2,4));
            //
            //             if ($scope.isLate(tableItem) && workOffHour >= 18) { //若是遲到
            //                 workOffHour = 17;
            //                 workOffMin = 30;
            //             } else if (workOffHour >= 18) {
            //                 workOffHour = 18;
            //                 workOffMin = 0;
            //             }
            //
            //             if (workOffHour > 13) {
            //                 isAfterNoon = true;
            //             }
            //             // console.log("index:" + index);
            //             // console.log(workOffHour + ":" + workOffMin);
            //             workOffCount++;
            //         }
            //         if (workOnHour && workOffHour) {
            //
            //             if (workOnCount == 1 && workOffCount == 1 ) {
            //                 if (isAfterNoon && isBeforeNoon) {
            //                     // console.log("A index:" + index);
            //                     // console.log("A result:" + result);
            //                     // console.log(workOffHour - workOnHour - 1);
            //                     // return (workOffHour - workOnHour - 1) * 60 + (workOffMin - workOnMin);
            //                     result =  parseInt((workOffHour - workOnHour - 1) * 60 + (workOffMin - workOnMin));
            //                 } else {
            //                     // console.log("B index:" + index);
            //                     // console.log("B result:" + result);
            //                     // console.log((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin));
            //                     // return (workOffHour - workOnHour) * 60 + (workOffMin - workOnMin);
            //                     result =  parseInt((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin));
            //                 }
            //                 isAfterNoon = false;
            //                 isBeforeNoon = false;
            //             }
            //
            //             if (workOnCount == 2 && workOffCount == 2 ) {
            //                 if (isAfterNoon && isBeforeNoon) {
            //                     // console.log("C index:" + index);
            //                     // console.log("C result:" + result);
            //                     // console.log(workOffHour - workOnHour - 1);
            //                     // return (workOffHour - workOnHour - 1) * 60 + (workOffMin - workOnMin);
            //                     result +=  parseInt((workOffHour - workOnHour - 1) * 60 + (workOffMin - workOnMin));
            //                 } else {
            //                     // console.log("D index:" + index);
            //                     // console.log("D result:" + result);
            //                     // console.log((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin));
            //                     // return (workOffHour - workOnHour) * 60 + (workOffMin - workOnMin);
            //                     result += parseInt((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin));
            //                 }
            //             }
            //         }
            //     }
            //
            //     if (result != undefined) {
            //         // console.log(result);
            //         return result;
            //     } else {
            //         return undefined;
            //     }
            //
            // }

            // 上班時數
            $scope.showWorkHour = function (tableItem, workOn1, workOff1, workOn2, workOff2) {
                var result = undefined;
                var isBeforeNoon = false;
                var isAfterNoon = false;
                if (workOn1 && workOff1) {
                    // console.log(workOn1);

                    // console.log("上班");
                    var workOnHour = parseInt(workOn1.substr(0,2));
                    var workOnMin = parseInt(workOn1.substr(2,4));

                    if (workOnHour < 8) { // before 0800 => 0800, ex: 0759 => 0800
                        workOnHour = 8;
                        workOnMin = 0;
                    }

                    //遲到規則
                    if (workOnHour >= 9 && workOnMin >= 1) {
                        if (workOnMin <= 30) {
                            workOnMin = 30;
                        } else if (workOnMin > 30) {
                            workOnHour += 1;
                            workOnMin = 0;
                        }
                        if (workOnHour == 12 ) {
                            workOnHour = 13;
                            workOnMin = 0;
                        }
                    }
                    // 20190408設計
                    if (workOnHour <= 12) {
                        isBeforeNoon = true;
                    }

                    // =======================
                    // console.log(workOff1);
                    // console.log("下班");
                    var workOffHour = parseInt(workOff1.substr(0,2));
                    var workOffMin = parseInt(workOff1.substr(2,4));

                    if ($scope.isLate(tableItem, 0) && workOffHour >= 18) { //若是遲到
                        workOffHour = 17;
                        workOffMin = 30;
                    } else if (workOffHour >= 18) {
                        workOffHour = 18;
                        workOffMin = 0;
                    } else if (workOffHour == 12) {
                        workOffHour = 12;
                        workOffMin = 0;
                    }
                    // console.log(tableItem);
                    // console.log("isLate= " + $scope.isLate(tableItem)
                    //     + ", "
                    //     + workOnHour + ":" + workOnMin
                    //     + ", "
                    //     + workOffHour + ":" + workOffMin);

                    if (workOffHour >= 13) {
                        isAfterNoon = true;
                    }

                    // console.log("Sec, "
                    //     + "isLate= " + $scope.isLate(tableItem, 0) +
                    //     + ", isBeforeNoon= " + isBeforeNoon
                    //     + ", isAfterNoon= " + isAfterNoon + ", "
                    //     + workOnHour + ":" + workOnMin
                    //     + ", "
                    //     + workOffHour + ":" + workOffMin);

                    // console.log("isAfterNoon= " + isAfterNoon + ", isBeforeNoon= " + isBeforeNoon);

                    if (isAfterNoon && isBeforeNoon) {
                        // console.log(Math.abs(parseInt(workOffHour) - parseInt(workOnHour) - 1));
                        var culc = (workOffHour - workOnHour - 1) * 60 + (workOffMin - workOnMin);
                        if (culc > 0) {
                            result =  parseInt( Math.abs((workOffHour - workOnHour - 1)) * 60 + (workOffMin - workOnMin));
                        }
                        // console.log("A result:" + result);
                    } else {
                        var culc = (workOffHour - workOnHour) * 60 + (workOffMin - workOnMin);
                        if (culc > 0) {
                            result =  parseInt( Math.abs((workOffHour - workOnHour)) * 60 + (workOffMin - workOnMin));
                        }
                        // console.log( Math.abs((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin)));
                        // console.log("B result:" + result);
                    }
                    isAfterNoon = false;
                    isBeforeNoon = false;

                }
                if (workOn2 && workOff2) {
                    // console.log("workOn2: " + workOn2);
                    // console.log("上班");
                    var workOnHour = parseInt(workOn2.substr(0,2));
                    var workOnMin = parseInt(workOn2.substr(2,4));

                    if (workOnHour < 8) { // before 0800 => 0800, ex: 0759 => 0800
                        workOnHour = 8;
                        workOnMin = 0;
                    }

                    //遲到規則 下午不適用
                    // if (workOnHour >= 9 && workOnMin >= 1) {
                    //     if (workOnMin <= 30) {
                    //         workOnMin = 30;
                    //     } else if (workOnMin > 30) {
                    //         workOnHour += 1;
                    //         workOnMin = 0;
                    //     }
                    // }

                    //遲到規則
                    if (workOnHour >= 9 && workOnMin >= 1) {
                        if (workOnMin <= 30) {
                            workOnMin = 30;
                        } else if (workOnMin > 30) {
                            workOnHour += 1;
                            workOnMin = 0;
                        }
                        if (workOnHour == 12 ) {
                            workOnHour = 13;
                            workOnMin = 0;
                        }
                    }

                    // 20190408設計
                    if (workOnHour <= 12) {
                        isBeforeNoon = true;
                    }

                    // =======================
                    // console.log("workOff2: " + workOff2);
                    // console.log("下班");
                    var workOffHour = parseInt(workOff2.substr(0,2));
                    var workOffMin = parseInt(workOff2.substr(2,4));
                    if ($scope.isLate(tableItem, 1) && workOffHour >= 18) { //若是遲到
                        workOffHour = 17;
                        workOffMin = 30;
                    } else if (workOffHour >= 18) {
                        workOffHour = 18;
                        workOffMin = 0;
                    }

                    if (workOffHour >= 13) {
                        isAfterNoon = true;
                    }

                    // console.log("Sec, "
                    //     + "isLate= " + $scope.isLate(tableItem, 1) +
                    //     + ", isBeforeNoon= " + isBeforeNoon
                    //     + ", isAfterNoon= " + isAfterNoon + ", "
                    //     + workOnHour + ":" + workOnMin
                    //     + ", "
                    //     + workOffHour + ":" + workOffMin);

                    if (isAfterNoon && isBeforeNoon) {
                        // console.log(workOffHour - workOnHour - 1);
                        // console.log(workOffMin - workOnMin);
                        // console.log("C pre_result:" + result);
                        var culc = (workOffHour - workOnHour - 1) * 60 + (workOffMin - workOnMin);
                        // console.log(culc);
                        if (culc > 0) {
                            result =  parseInt( Math.abs((workOffHour - workOnHour - 1)) * 60 + (workOffMin - workOnMin));
                        }
                        // console.log("C result:" + result);

                    } else {
                        var culc = (workOffHour - workOnHour) * 60 + (workOffMin - workOnMin);
                        // console.log(culc);
                        if (culc > 0) {
                            result =  parseInt( Math.abs((workOffHour - workOnHour)) * 60 + (workOffMin - workOnMin));
                        }
                        // console.log("D result:" + result);
                    }
                }

                if (result != undefined) {
                    // console.log(result);
                    return result;
                } else {
                    return undefined;
                }
            }

            $scope.showWorkOverMin = function (workOverOn, workOverOff) {
                var workOnHour;
                var workOnMin;
                var workOffHour;
                var workOffMin;
                if (workOverOn && workOverOff) {
                    // console.log("A " + datas[index].time);
                    workOnHour = parseInt(workOverOn.substr(0,2));
                    workOnMin = parseInt(workOverOn.substr(2,4));
                    // console.log("AA " + workOnHour + ":" + workOnMin);

                    // console.log("B " + datas[index].time);
                    workOffHour = parseInt(workOverOff.substr(0,2));
                    workOffMin = parseInt(workOverOff.substr(2,4));
                    // console.log("BB " + workOffHour + ":" + workOffMin);

                    if ((workOnHour && workOffHour) || (workOnHour == 0 && workOffHour) || (workOnHour == 0 && workOffHour == 0)) {
                        // console.log("C " + workOnHour + ":" + workOnMin);
                        // console.log("D " + workOffHour + ":" + workOffMin);
                        var min = ((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin))
                        return min;
                    }
                }
            }

            // 加班時數
            $scope.showWorkOverHourFromMin = function (workOverTotalMin) {
                // console.log(workOverTotalMin);
                if (workOverTotalMin) {
                    // console.log("C " + workOnHour + ":" + workOnMin);
                    // console.log("D " + workOffHour + ":" + workOffMin);
                    var hour = Math.floor(workOverTotalMin/60);
                    // console.log(hour);
                    if (hour == 0 ) {
                        return 0;
                    }
                    var min = ((workOverTotalMin)%60) / 60 >= 0.5 ? 0.5 : 0;
                    return parseInt(hour) + min;
                }
            }

            // 加班時數
            // Deprecated
            $scope.showWorkOverHour = function (workOverOn, workOverOff) {
                var workOnHour;
                var workOnMin;
                var workOffHour;
                var workOffMin;
                if (workOverOn && workOverOff) {
                    // console.log("A " + datas[index].time);
                    workOnHour = parseInt(workOverOn.substr(0,2));
                    workOnMin = parseInt(workOverOn.substr(2,4));
                    // console.log("AA " + workOnHour + ":" + workOnMin);

                    // console.log("B " + datas[index].time);
                    workOffHour = parseInt(workOverOff.substr(0,2));
                    workOffMin = parseInt(workOverOff.substr(2,4));
                    // console.log("BB " + workOffHour + ":" + workOffMin);

                    if ((workOnHour && workOffHour) || (workOnHour == 0 && workOffHour) || (workOnHour == 0 && workOffHour == 0)) {
                        // console.log("C " + workOnHour + ":" + workOnMin);
                        // console.log("D " + workOffHour + ":" + workOffMin);
                        var hour = Math.floor(((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin))/60);
                        if (hour == 0 ) {
                            return 0;
                        }
                        var min = (((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin))%60) / 60 >= 0.5 ? 0.5 : 0;
                        return parseInt(hour) + min;
                        // return parseInt(hour);
                        // return min;
                    }
                }
            }

            $scope.printPDF = function () {
                $("#form_main_pdf").print({
                    globalStyles: true,
                    mediaPrint: false,
                    stylesheet: null,
                    noPrintSelector: ".no-print",
                    iframe: true,
                    append: null,
                    prepend: null,
                    manuallyCopyFormValues: true,
                    deferred: $.Deferred(),
                    timeout: 750,
                    title: null,
                    doctype: '<!doctype html>'
                });
            }

            $scope.printPDF_month = function () {
                $("#form_hrmachine_month_pdf").print({
                    globalStyles: true,
                    mediaPrint: false,
                    stylesheet: null,
                    noPrintSelector: ".no-print",
                    iframe: true,
                    append: null,
                    prepend: null,
                    manuallyCopyFormValues: true,
                    deferred: $.Deferred(),
                    timeout: 750,
                    title: null,
                    doctype: '<!doctype html>'
                });
            }


        } // End of function
    }
)();


