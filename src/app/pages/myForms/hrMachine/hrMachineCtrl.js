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

            $scope.fetchData = function(month) {
                $scope.hrMachineTable = [];
                var startDate = moment().format('YYYYMM') + "01";
                var endDate = moment().format('YYYYMM') + moment().daysInMonth();
                var today = moment().format('YYYYMMDD');

                if (month !== undefined) {
                    startDate = moment(month).format('YYYYMM') + "01";
                    endDate = moment(month).format('YYYYMM') + moment(month).daysInMonth();
                }

                var formData = {
                    machineDID: $scope.machineDID,
                    today: today,
                }

                HrMachineUtil.fetchUserHrMachineDataOneDayByMachineDID(formData)
                    .success(function (res) {
                        var arrayResult = res.payload;

                        var hrMachineTableSorted = {};
                        var lastDate = "";
                        for (var index = 0; index < arrayResult[0].length; index++) {
                            // console.log(arrayResult[0][index]);

                            var hrMachineItem = {
                                date: "",
                                did: "",
                                location: "",
                                printType: "",
                                time: "",
                                workType: ""
                            }
                            if (hrMachineTableSorted[arrayResult[0][index].date] === undefined) {
                                hrMachineItem.date = arrayResult[0][index].date;
                                hrMachineItem.did = arrayResult[0][index].did;
                                hrMachineItem.location = arrayResult[0][index].location;
                                hrMachineItem.printType = arrayResult[0][index].printType;
                                hrMachineItem.time = arrayResult[0][index].time;
                                hrMachineItem.workType = arrayResult[0][index].workType;

                                var hrMachineCollection = [];
                                hrMachineCollection.push(hrMachineItem);
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
                        // console.log(hrMachineTableSorted);
                        $scope.hrMachineTable = hrMachineTableSorted;
                    })
            }

            function convertDate(mString) {
                var resultString = "";
                resultString += String(parseInt(mString.substring(0,3),10) + 1911) + "/";
                resultString += mString.substring(3, 5) + "/";
                resultString += mString.substring(5, 7);
                return resultString;
            }

            $scope.changeHrMachineMonth = function(changeCount, dom) {
                dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
                dom.myDT = moment(dom.myDT).add(changeCount, 'M');
                $scope.fetchData(dom.myMonth);
            }

            $scope.loadHrMachineDate = function (dom) {
                if (moment(dom.myDT).format('YYYYMMDD') === "Invalid date") {
                    toastr.error('請檢察日期', 'Error');
                    return;
                }
                var fileDate = moment(dom.myDT).format('YYYYMMDD')
                // console.log(fileDate);
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
                    // 上班 1
                    case 11:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "1") {
                                return datas[index].time
                            }
                        }
                        break;
                    // 下班 1
                    case 21:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "2") {
                                return datas[index].time
                            }
                        }
                        break;
                    // 上班 2
                    case 12:
                        var count = 0;
                        var workOnTime;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "1") {
                                if (count == 1) {
                                    if (datas[index].time != workOnTime) {
                                        return datas[index].time
                                    }
                                }
                                count ++
                                workOnTime = datas[index].time;
                            }
                        }
                        break;
                    // 下班 2
                    case 22:
                        var count = 0;
                        var workOffTime;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "2") {
                                if (count == 1) {
                                    if (datas[index].time != workOffTime) {
                                        return datas[index].time
                                    }
                                }
                                count ++
                                workOffTime = datas[index].time;
                            }
                        }
                        break;
                    //  加班簽到1
                    case 31:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "3") {
                                return datas[index].time
                            }
                        }
                        break;
                    //  加班簽退1
                    case 41:
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                return datas[index].time
                            }
                        }
                        break;
                    //  加班時數1
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
                    case 32:
                        var count = 0;
                        var OverOnTime;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "3") {
                                if (count == 1) {
                                    if (datas[index].time != OverOnTime) {
                                        return datas[index].time
                                    }
                                }
                                count ++
                                OverOnTime = datas[index].time;
                            }
                        }
                        break;
                    //  加班簽退2
                    case 42:
                        var count = 0;
                        var OverOffTime;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                if (count == 1) {
                                    if (datas[index].time != OverOffTime) {
                                        return datas[index].time
                                    }
                                }
                                count ++
                                OverOffTime = datas[index].time;
                            }
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
                    case 33:
                        var count = 0;
                        var OverOnTime;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "3") {
                                if (count == 2) {
                                    if (datas[index].time != OverOnTime) {
                                        return datas[index].time
                                    }
                                }
                                count ++
                                OverOnTime = datas[index].time;
                            }
                        }
                        break;
                    //  加班簽退3
                    case 43:
                        var count = 0;
                        var OverOffTime;
                        for (var index = 0; index < datas.length; index++) {
                            if (datas[index].workType === "4") {
                                if (count == 2) {
                                    if (datas[index].time != OverOffTime) {
                                        return datas[index].time
                                    }
                                }
                                count ++
                                OverOffTime = datas[index].time;
                            }
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
            $scope.isLate = function (tableItem) {
                for (var index = 0; index < tableItem.length; index++) {
                    if (tableItem[index].workType === "1") {
                        var workOnHour = parseInt(tableItem[index].time.substr(0,2));
                        var workOnMin = parseInt(tableItem[index].time.substr(2,4));
                        if (workOnHour <= 8) {
                            return false;
                        }

                        if (workOnHour >= 9 && workOnMin >= 1) {
                            return true;
                        } else {
                            return false;
                        }

                    }
                }
            }

            // 請假時數
            $scope.workOffHour = function (tableItem) {
                if ($scope.workHour(tableItem) != undefined) {
                    var result = 480 - $scope.workHour(tableItem) > 0 ?
                        480 - $scope.workHour(tableItem) : 0 ;
                    if (result == 0) {
                        return "";
                    }

                    if (result <= 60) {
                        return 1;
                    } else {
                        return Math.floor(result/60) + (((result%60) / 60 > 0.5) ? 1 : 0.5);
                        // return result;
                        // return Math.floor(result/60);
                    }
                }
            }

            // 上班時數
            $scope.workHour = function (tableItem) {
                // console.log(tableItem);
                var result = undefined;
                var isBeforeNoon = false;
                var isAfterNoon = false;
                var workOnCount = 0;
                var workOffCount = 0;
                for (var index = 0; index < tableItem.length; index++) {
                    if (tableItem[index].workType === "1") {
                        // console.log("上班");
                        var workOnHour = parseInt(tableItem[index].time.substr(0,2));
                        var workOnMin = parseInt(tableItem[index].time.substr(2,4));

                        if (workOnHour < 8) { // before 0800 => 0800, ex: 0759 => 0800
                            workOnHour = 8;
                            workOnMin = 0;
                        }

                        //遲到規則
                        if (workOnCount == 0) {
                            if (workOnHour >= 9 && workOnMin >= 1) {
                                if (workOnMin <= 30) {
                                    workOnMin = 30;
                                } else if (workOnMin > 30) {
                                    workOnHour += 1;
                                    workOnMin = 0;
                                }
                            }
                            // 20190408設計
                        }

                        if (workOnHour < 12) {
                            isBeforeNoon = true;
                           // console.log("中午前");
                        }
                        // console.log("index:" + index);
                        // console.log(workOnHour + ":" + workOnMin);
                        workOnCount ++;
                    }
                    if (tableItem[index].workType === "2") {
                        // console.log("下班");
                        var workOffHour = parseInt(tableItem[index].time.substr(0,2));
                        var workOffMin = parseInt(tableItem[index].time.substr(2,4));

                        if ($scope.isLate(tableItem) && workOffHour >= 18) { //若是遲到
                            workOffHour = 17;
                            workOffMin = 30;
                        } else if (workOffHour >= 18) {
                            workOffHour = 18;
                            workOffMin = 0;
                        }

                        if (workOffHour > 13) {
                            isAfterNoon = true;
                            // console.log("中午後");
                        }
                        // console.log("index:" + index);
                        // console.log(workOffHour + ":" + workOffMin);
                        workOffCount++;
                    }
                    if (workOnHour && workOffHour) {
                        // console.log("上班差異");
                        // console.log("workOnCount= " + workOnCount);
                        // console.log("workOffCount=" + workOffCount);

                        if (workOnCount == 1 && workOffCount == 1 ) {
                            if (isAfterNoon && isBeforeNoon) {
                                // console.log("A index:" + index);
                                // console.log("A result:" + result);
                                // console.log(workOffHour - workOnHour - 1);
                                // return (workOffHour - workOnHour - 1) * 60 + (workOffMin - workOnMin);
                                result =  parseInt((workOffHour - workOnHour - 1) * 60 + (workOffMin - workOnMin));
                            } else {
                                // console.log("B index:" + index);
                                // console.log("B result:" + result);
                                // console.log((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin));
                                // return (workOffHour - workOnHour) * 60 + (workOffMin - workOnMin);
                                result =  parseInt((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin));
                            }
                            isAfterNoon = false;
                            isBeforeNoon = false;
                        }

                        if (workOnCount == 2 && workOffCount == 2 ) {
                            if (isAfterNoon && isBeforeNoon) {
                                // console.log("C index:" + index);
                                // console.log("C result:" + result);
                                // console.log(workOffHour - workOnHour - 1);
                                // return (workOffHour - workOnHour - 1) * 60 + (workOffMin - workOnMin);
                                result +=  parseInt((workOffHour - workOnHour - 1) * 60 + (workOffMin - workOnMin));
                            } else {
                                // console.log("D index:" + index);
                                // console.log("D result:" + result);
                                // console.log((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin));
                                // return (workOffHour - workOnHour) * 60 + (workOffMin - workOnMin);
                                result += parseInt((workOffHour - workOnHour) * 60 + (workOffMin - workOnMin));
                            }
                        }
                    }
                }

                if (result != undefined) {
                    // console.log(result);
                    return result;
                } else {
                    return undefined;
                }

            }

        } // End of function
    }
)();


