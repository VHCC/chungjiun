/**
 * @author IChen.chu
 * created on 03.07.2020
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .controller('employeeStatisticsCtrl',
                [
                    '$scope',
                    '$filter',
                    '$cookies',
                    '$timeout',
                    '$compile',
                    'ngDialog',
                    'User',
                    'DateUtil',
                    'TimeUtil',
                    'Project',
                    'ProjectUtil',
                    'WorkHourUtil',
                    'bsLoadingOverlayService',
                    'toastr',
                    employeeStatisticsCtrl
                ]);

        /** @ngInject */
        function employeeStatisticsCtrl($scope,
                                       $filter,
                                       cookies,
                                       $timeout,
                                       $compile,
                                       ngDialog,
                                       User,
                                       DateUtil,
                                       TimeUtil,
                                       Project,
                                       ProjectUtil,
                                       WorkHourUtil,
                                       bsLoadingOverlayService,
                                       toastr) {



            var vm = this;
            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;

            $scope.month = this.month = undefined;
            $scope.year = this.myYear;

            $(document).ready(function () {
                console.log(" ====== initMask document ready ====== ")

                $('#inputStartDay_employee')[0].value = DateUtil.getShiftDatefromFirstDate(
                    DateUtil.getFirstDayofThisWeek(moment()),
                    moment().day() === 0 ? 6 : moment().day() - 1);
                $('#inputEndDay_employee')[0].value = DateUtil.getShiftDatefromFirstDate(
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

            // 所有人，對照資料
            User.getAllUsers()
                .success(function (allUsers) {
                    vm.users = allUsers;
                    $scope.projectManagers = [];
                });

            vm.isAllMonth = false;

            // 主要顯示
            $scope.statisticsResults = [];

            // 統計搜尋條件
            var getData = {};

            // 年度、月份
            // 總案代碼、專案代碼、子案代碼、類型代碼
            // 工時類型、相關人員
            $scope.startEmployeeStatistics = function () {

                $scope.startDay = $('#inputStartDay_employee')[0].value;
                $scope.endDay = $('#inputEndDay_employee')[0].value;

                getData.form_yearArray = $scope.fetchYearArray($scope.startDay, $scope.endDay);
                getData.form_monthArray = $scope.fetchMonthArray($scope.startDay, $scope.endDay);

                getData.targerUsers = vm.users.selected == undefined ? vm.users : vm.users.selected;
                console.log(getData);

                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_employee_statistics'
                });

                if ($('#inlineRadio1_employee')[0].checked) {
                    // 第 1 類型
                    WorkHourUtil.queryEmployeeStatistics(getData)
                        .success(function (res) {
                            console.log(res);

                            res.payload = res.payload.sort(function (a, b) {
                                return a._id.prjCode > b._id.prjCode ? 1 : -1;
                            });

                            for (var index = 0; index < res.payload.length; index ++) {
                                res.payload[index].tables = $scope.checkIllegalDate(res.payload[index].tables);
                                for (var index_sub = 0; index_sub < res.payload_add.length; index_sub ++) {
                                    if( res.payload_add[index_sub]._id.prjCode == res.payload[index]._id.prjCode &&
                                        res.payload_add[index_sub]._id.userDID == res.payload[index]._id.userDID) {
                                        res.payload[index]._add_tables = res.payload_add[index_sub].add_tables;
                                    }
                                }
                            }

                            try {
                                $scope.statisticsResults = $scope.filter_type1_data(res.payload);

                                angular.element(
                                    document.getElementById('includeHead_employee'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'列表 - " + $scope.statisticsResults.length + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/myForms/workStatisticsCJ/tables/workStatisticsShowTable_type1.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));

                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'mainPage_employee_statistics'
                                    });
                                }, 500)
                            } catch (e) {
                                toastr['warning'](e.toString(), '搜尋異常');
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'mainPage_employee_statistics'
                                    });
                                }, 500)
                            }


                        })
                        .error(function () {
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_employee_statistics'
                                });
                            }, 500)
                        })

                } else if ($('#inlineRadio2_employee')[0].checked) {
                    // 第 2 類型
                    WorkHourUtil.queryEmployeeStatistics(getData)
                        .success(function (res) {
                            console.log(res);

                            res.payload = res.payload.sort(function (a, b) {
                                return a._id.userDID > b._id.userDID ? 1 : -1;
                            });

                            for (var index = 0; index < res.payload.length; index ++) {
                                res.payload[index].tables = $scope.checkIllegalDate(res.payload[index].tables);
                                for (var index_sub = 0; index_sub < res.payload_add.length; index_sub ++) {
                                    if( res.payload_add[index_sub]._id.prjCode == res.payload[index]._id.prjCode &&
                                        res.payload_add[index_sub]._id.userDID == res.payload[index]._id.userDID) {
                                        res.payload[index]._add_tables = res.payload_add[index_sub].add_tables;
                                    }
                                }
                            }

                            $scope.statisticsResults = $scope.filter_type4_data(res.payload);
                            console.log($scope.statisticsResults);

                            angular.element(
                                document.getElementById('includeHead_employee'))
                                .html($compile(
                                    "<div ba-panel ba-panel-title=" +
                                    "'列表 - " + $scope.statisticsResults.length + "'" +
                                    "ba-panel-class= " +
                                    "'with-scroll'" + ">" +
                                    "<div " +
                                    "ng-include=\"'app/pages/myForms/workHourTableForm/employeeStatistics/tables/employeeStatisticsShowTable_type4.html'\">" +
                                    "</div>" +
                                    "</div>"
                                )($scope));

                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_employee_statistics'
                                });
                            }, 500)
                        })
                        .error(function () {
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_employee_statistics'
                                });
                            }, 500)
                        })

                } else if ($('#inlineRadio3_employee')[0].checked) {
                    // 第 3 類型
                    WorkHourUtil.queryEmployeeStatistics(getData)
                        .success(function (res) {
                            // console.log(res);
                            res.payload = res.payload.sort(function (a, b) {
                                return a._id.userDID > b._id.userDID ? 1 : -1;
                            });

                            for (var index = 0; index < res.payload.length; index++) {
                                res.payload[index].tables = $scope.checkIllegalDate(res.payload[index].tables);
                                for (var index_sub = 0; index_sub < res.payload_add.length; index_sub++) {
                                    if (res.payload_add[index_sub]._id.prjCode == res.payload[index]._id.prjCode &&
                                        res.payload_add[index_sub]._id.userDID == res.payload[index]._id.userDID) {
                                        res.payload[index]._add_tables = res.payload_add[index_sub].add_tables;
                                    }
                                }
                            }
                            try {
                                $scope.statisticsResults = $scope.filter_type3_data(res.payload);

                                angular.element(
                                    document.getElementById('includeHead_employee'))
                                    .html($compile(
                                        "<div ba-panel ba-panel-title=" +
                                        "'列表 - " + $scope.statisticsResults.length + "'" +
                                        "ba-panel-class= " +
                                        "'with-scroll'" + ">" +
                                        "<div " +
                                        "ng-include=\"'app/pages/myForms/workStatisticsCJ/tables/workStatisticsShowTable_type3.html'\">" +
                                        "</div>" +
                                        "</div>"
                                    )($scope));

                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'mainPage_employee_statistics'
                                    });
                                }, 500)
                            } catch (e) {
                                toastr['warning'](e.toString(), '搜尋異常');
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'mainPage_employee_statistics'
                                    });
                                }, 500)
                            }


                        })
                        .error(function () {
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_employee_statistics'
                                });
                            }, 500)
                        })
                } else if ($('#inlineRadio4_employee')[0].checked) {
                    WorkHourUtil.queryEmployeeStatistics(getData)
                        .success(function (res) {
                            console.log(res);

                            res.payload = res.payload.sort(function (a, b) {
                                return a._id.userDID > b._id.userDID ? 1 : -1;
                            });

                            for (var index = 0; index < res.payload.length; index ++) {
                                res.payload[index].tables = $scope.checkIllegalDate(res.payload[index].tables);
                                for (var index_sub = 0; index_sub < res.payload_add.length; index_sub ++) {
                                    if( res.payload_add[index_sub]._id.prjCode == res.payload[index]._id.prjCode &&
                                        res.payload_add[index_sub]._id.userDID == res.payload[index]._id.userDID) {
                                        res.payload[index]._add_tables = res.payload_add[index_sub].add_tables;
                                    }
                                }
                            }

                            $scope.statisticsResults = $scope.filter_type4_data(res.payload);
                            console.log($scope.statisticsResults);

                            angular.element(
                                document.getElementById('includeHead_employee'))
                                .html($compile(
                                    "<div ba-panel ba-panel-title=" +
                                    "'列表 - " + $scope.statisticsResults.length + "'" +
                                    "ba-panel-class= " +
                                    "'with-scroll'" + ">" +
                                    "<div " +
                                    "ng-include=\"'app/pages/myForms/workHourTableForm/employeeStatistics/tables/employeeStatisticsShowTable_type4.html'\">" +
                                    "</div>" +
                                    "</div>"
                                )($scope));

                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_employee_statistics'
                                });
                            }, 500)
                        })
                        .error(function () {
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_employee_statistics'
                                });
                            }, 500)
                        })
                } else if ($('#inlineRadio5_employee')[0].checked) {//員工請假
                    WorkHourUtil.queryEmployeeStatisticsWorkOff(getData)
                        .success(function (res) {
                            console.log(res);
                            // res.payload = res.payload.sort(function (a, b) {
                            //     return a._id.userDID > b._id.userDID ? 1 : -1;
                            // });

                            $scope.statisticsResults = $scope.filter_type5_data(res.payload);

                            angular.element(
                                document.getElementById('includeHead_employee'))
                                .html($compile(
                                    "<div ba-panel ba-panel-title=" +
                                    "'列表 - " + $scope.statisticsResults.length + "'" +
                                    "ba-panel-class= " +
                                    "'with-scroll'" + ">" +
                                    "<div " +
                                    "ng-include=\"'app/pages/myForms/workHourTableForm/employeeStatistics/tables/employeeStatisticsShowTable_type5.html'\">" +
                                    "</div>" +
                                    "</div>"
                                )($scope));

                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_employee_statistics'
                                });
                            }, 500)
                        })
                        .error(function () {
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_employee_statistics'
                                });
                            }, 500)
                        })
                } else {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_employee_statistics'
                        });
                        toastr['warning']('請選擇搜尋類型 !', '搜尋異常');
                    }, 500)
                }
            }

            // -------------- Original --------------
            $scope.calculateHours = function (item) {
                // console.log(item.tables);
                var hourTotal = 0;
                for (var index = 0; index < item.tables.length; index ++) {
                    // TOTAL
                    hourTotal += parseFloat(item.tables[index].mon_hour) +
                        parseFloat(item.tables[index].tue_hour) +
                        parseFloat(item.tables[index].wes_hour) +
                        parseFloat(item.tables[index].thu_hour) +
                        parseFloat(item.tables[index].fri_hour) +
                        parseFloat(item.tables[index].sat_hour) +
                        parseFloat(item.tables[index].sun_hour);
                }
                return hourTotal;
            }

            $scope.calculateAddHours = function (item) {
                var hourTotal = 0;

                // 累積所有項目
                var hourTotal = 0;
                for (var index = 0; index < item.add_tables.length; index++) {
                    hourTotal += parseInt(TimeUtil.getCalculateHourDiffByTime(item.add_tables[index].start_time, item.add_tables[index].end_time));
                }
                hourTotal = hourTotal % 60 < 30 ? Math.round(hourTotal / 60) : Math.round(hourTotal / 60) - 0.5;
                if (hourTotal < 1) {
                    return 0;
                }
                return hourTotal;
            }

            // -------------- Original --------------

            // ************** CJ Biz *****************

            // type 1, 一天加一專案 為一筆
            $scope.filter_type1_data = function(rawTables) {
                console.log(rawTables);
                var itemList = [];

                var type1_data = [];

                for (var memberCount = 0; memberCount < rawTables.length; memberCount++) {
                    if (rawTables[memberCount].tables != undefined) {

                        for (var table_index = 0 ;table_index < rawTables[memberCount].tables.length; table_index ++) {
                            // mon
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 0) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 0) )
                                    .diff( moment( $scope.endDay )) <= 0  &&
                                rawTables[memberCount].tables[table_index].mon_hour > 0) {

                                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                    , 0) + "_" +
                                    rawTables[memberCount]._id.prjCode;

                                var tableData = {
                                    type_1_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                    type_1_day: 0,
                                    type_1_hour: rawTables[memberCount].tables[table_index].mon_hour,
                                    type_1_hour_memo: rawTables[memberCount].tables[table_index].mon_memo
                                }

                                if (type1_data[item] != undefined) {
                                    var data = type1_data[item];
                                    data.tables.push(tableData);
                                    if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                        data.users.push(rawTables[memberCount]._id.userDID);
                                        data.users_info.push(rawTables[memberCount]._user_info);
                                    }
                                } else {

                                    itemList.push(item);

                                    var tables = [];

                                    tables.push(tableData);

                                    var users = [];

                                    users.push(rawTables[memberCount]._id.userDID);

                                    var users_info = [];

                                    users_info.push(rawTables[memberCount]._user_info);

                                    var data = {
                                        _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 0),
                                        _date_short: DateUtil.formatDate(
                                            DateUtil.getShiftDatefromFirstDate(
                                                moment(rawTables[memberCount].tables[table_index].create_formDate), 0)),
                                        _day: 1,
                                        _day_tw: DateUtil.getDay(1),
                                        _prjCode: rawTables[memberCount]._id.prjCode,
                                        _project_info: rawTables[memberCount]._project_info,
                                        users: users,
                                        users_info: users_info,
                                        tables: tables,
                                        table_add: [],
                                    }
                                }

                                eval('type1_data[item] = data')
                            }

                            // tue
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 1) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 1) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].tue_hour > 0) {

                                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                    , 1) + "_" +
                                    rawTables[memberCount]._id.prjCode;

                                var tableData = {
                                    type_1_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                    type_1_day: 1,
                                    type_1_hour: rawTables[memberCount].tables[table_index].tue_hour,
                                    type_1_hour_memo: rawTables[memberCount].tables[table_index].tue_memo
                                }

                                if (type1_data[item] != undefined) {
                                    var data = type1_data[item];
                                    data.tables.push(tableData);
                                    if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                        data.users.push(rawTables[memberCount]._id.userDID);
                                        data.users_info.push(rawTables[memberCount]._user_info);
                                    }
                                } else {

                                    itemList.push(item);

                                    var tables = [];

                                    tables.push(tableData);

                                    var users = [];

                                    users.push(rawTables[memberCount]._id.userDID);

                                    var users_info = [];

                                    users_info.push(rawTables[memberCount]._user_info);

                                    var data = {
                                        _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 1),
                                        _date_short: DateUtil.formatDate(
                                            DateUtil.getShiftDatefromFirstDate(
                                                moment(rawTables[memberCount].tables[table_index].create_formDate), 1)),
                                        _day: 2,
                                        _day_tw: DateUtil.getDay(2),
                                        _prjCode: rawTables[memberCount]._id.prjCode,
                                        _project_info: rawTables[memberCount]._project_info,
                                        users: users,
                                        users_info: users_info,
                                        tables: tables,
                                        table_add: [],
                                    }
                                }

                                eval('type1_data[item] = data')
                            }

                            // wes
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 2) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 2) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].wes_hour > 0) {

                                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                    , 2) + "_" +
                                    rawTables[memberCount]._id.prjCode;

                                var tableData = {
                                    type_1_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                    type_1_day: 2,
                                    type_1_hour: rawTables[memberCount].tables[table_index].wes_hour,
                                    type_1_hour_memo: rawTables[memberCount].tables[table_index].wes_memo
                                }

                                if (type1_data[item] != undefined) {
                                    var data = type1_data[item];
                                    data.tables.push(tableData);
                                    if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                        data.users.push(rawTables[memberCount]._id.userDID);
                                        data.users_info.push(rawTables[memberCount]._user_info);
                                    }
                                } else {

                                    itemList.push(item);

                                    var tables = [];

                                    tables.push(tableData);

                                    var users = [];

                                    users.push(rawTables[memberCount]._id.userDID);

                                    var users_info = [];

                                    users_info.push(rawTables[memberCount]._user_info);

                                    var data = {
                                        _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 2),
                                        _date_short: DateUtil.formatDate(
                                            DateUtil.getShiftDatefromFirstDate(
                                                moment(rawTables[memberCount].tables[table_index].create_formDate), 2)),
                                        _day: 3,
                                        _day_tw: DateUtil.getDay(3),
                                        _prjCode: rawTables[memberCount]._id.prjCode,
                                        _project_info: rawTables[memberCount]._project_info,
                                        users: users,
                                        users_info: users_info,
                                        tables: tables,
                                        table_add: [],
                                    }
                                }

                                eval('type1_data[item] = data')
                            }

                            // thu
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 3) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 3) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].thu_hour > 0) {

                                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                    , 3) + "_" +
                                    rawTables[memberCount]._id.prjCode;

                                var tableData = {
                                    type_1_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                    type_1_day: 3,
                                    type_1_hour: rawTables[memberCount].tables[table_index].thu_hour,
                                    type_1_hour_memo: rawTables[memberCount].tables[table_index].thu_memo
                                }

                                if (type1_data[item] != undefined) {
                                    var data = type1_data[item];
                                    data.tables.push(tableData);
                                    if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                        data.users.push(rawTables[memberCount]._id.userDID);
                                        data.users_info.push(rawTables[memberCount]._user_info);
                                    }
                                } else {

                                    itemList.push(item);

                                    var tables = [];

                                    tables.push(tableData);

                                    var users = [];

                                    users.push(rawTables[memberCount]._id.userDID);

                                    var users_info = [];

                                    users_info.push(rawTables[memberCount]._user_info);

                                    var data = {
                                        _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 3),
                                        _date_short: DateUtil.formatDate(
                                            DateUtil.getShiftDatefromFirstDate(
                                                moment(rawTables[memberCount].tables[table_index].create_formDate), 3)),
                                        _day: 4,
                                        _day_tw: DateUtil.getDay(4),
                                        _prjCode: rawTables[memberCount]._id.prjCode,
                                        _project_info: rawTables[memberCount]._project_info,
                                        users: users,
                                        users_info: users_info,
                                        tables: tables,
                                        table_add: [],
                                    }
                                }
                                eval('type1_data[item] = data')
                            }

                            // fri
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 4) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 4) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].fri_hour > 0) {

                                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                    , 4) + "_" +
                                    rawTables[memberCount]._id.prjCode;

                                var tableData = {
                                    type_1_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                    type_1_day: 4,
                                    type_1_hour: rawTables[memberCount].tables[table_index].fri_hour,
                                    type_1_hour_memo: rawTables[memberCount].tables[table_index].fri_memo
                                }

                                if (type1_data[item] != undefined) {
                                    var data = type1_data[item];
                                    data.tables.push(tableData);
                                    if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                        data.users.push(rawTables[memberCount]._id.userDID);
                                        data.users_info.push(rawTables[memberCount]._user_info);
                                    }
                                } else {

                                    itemList.push(item);

                                    var tables = [];

                                    tables.push(tableData);

                                    var users = [];

                                    users.push(rawTables[memberCount]._id.userDID);

                                    var users_info = [];

                                    users_info.push(rawTables[memberCount]._user_info);

                                    var data = {
                                        _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 4),
                                        _date_short: DateUtil.formatDate(
                                            DateUtil.getShiftDatefromFirstDate(
                                                moment(rawTables[memberCount].tables[table_index].create_formDate), 4)),
                                        _day: 5,
                                        _day_tw: DateUtil.getDay(5),
                                        _prjCode: rawTables[memberCount]._id.prjCode,
                                        _project_info: rawTables[memberCount]._project_info,
                                        users: users,
                                        users_info: users_info,
                                        tables: tables,
                                        table_add: [],
                                    }
                                }
                                eval('type1_data[item] = data')
                            }

                            // sat
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 5) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 5) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].sat_hour > 0) {

                                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                    , 5) + "_" +
                                    rawTables[memberCount]._id.prjCode;

                                var tableData = {
                                    type_1_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                    type_1_day: 5,
                                    type_1_hour: rawTables[memberCount].tables[table_index].sat_hour,
                                    type_1_hour_memo: rawTables[memberCount].tables[table_index].sat_memo
                                }

                                if (type1_data[item] != undefined) {
                                    var data = type1_data[item];
                                    data.tables.push(tableData);
                                    if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                        data.users.push(rawTables[memberCount]._id.userDID);
                                        data.users_info.push(rawTables[memberCount]._user_info);
                                    }
                                } else {

                                    itemList.push(item);

                                    var tables = [];

                                    tables.push(tableData);

                                    var users = [];

                                    users.push(rawTables[memberCount]._id.userDID);

                                    var users_info = [];

                                    users_info.push(rawTables[memberCount]._user_info);

                                    var data = {
                                        _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 5),
                                        _date_short: DateUtil.formatDate(
                                            DateUtil.getShiftDatefromFirstDate(
                                                moment(rawTables[memberCount].tables[table_index].create_formDate), 5)),
                                        _day: 6,
                                        _day_tw: DateUtil.getDay(6),
                                        _prjCode: rawTables[memberCount]._id.prjCode,
                                        _project_info: rawTables[memberCount]._project_info,
                                        users: users,
                                        users_info: users_info,
                                        tables: tables,
                                        table_add: [],
                                    }
                                }
                                eval('type1_data[item] = data')
                            }

                            // sun
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 6) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 6) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].sun_hour > 0) {

                                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawTables[memberCount].tables[table_index].create_formDate)
                                    , 6) + "_" +
                                    rawTables[memberCount]._id.prjCode;

                                var tableData = {
                                    type_1_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                    type_1_day: 6,
                                    type_1_hour: rawTables[memberCount].tables[table_index].sun_hour,
                                    type_1_hour_memo: rawTables[memberCount].tables[table_index].sun_memo
                                }

                                if (type1_data[item] != undefined) {
                                    var data = type1_data[item];
                                    data.tables.push(tableData);
                                    if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                        data.users.push(rawTables[memberCount]._id.userDID);
                                        data.users_info.push(rawTables[memberCount]._user_info);
                                    }
                                } else {

                                    itemList.push(item);

                                    var tables = [];

                                    tables.push(tableData);

                                    var users = [];

                                    users.push(rawTables[memberCount]._id.userDID);

                                    var users_info = [];

                                    users_info.push(rawTables[memberCount]._user_info);

                                    var data = {
                                        _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 6),
                                        _date_short: DateUtil.formatDate(
                                            DateUtil.getShiftDatefromFirstDate(
                                                moment(rawTables[memberCount].tables[table_index].create_formDate), 6)),
                                        _day: 7,
                                        _day_tw: DateUtil.getDay(7),
                                        _prjCode: rawTables[memberCount]._id.prjCode,
                                        _project_info: rawTables[memberCount]._project_info,
                                        users: users,
                                        users_info: users_info,
                                        tables: tables,
                                        table_add: [],
                                    }
                                }
                                eval('type1_data[item] = data')
                            }
                        }
                    }

                    if (rawTables[memberCount]._add_tables != undefined) {
                        for (var table_add_index = 0 ;table_add_index < rawTables[memberCount]._add_tables.length; table_add_index ++) {
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate),
                                rawTables[memberCount]._add_tables[table_add_index].day - 1) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate),
                                    rawTables[memberCount]._add_tables[table_add_index].day - 1) )
                                    .diff( moment( $scope.endDay )) <= 0) {

                                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate),
                                    rawTables[memberCount]._add_tables[table_add_index].day - 1) + "_" +
                                    rawTables[memberCount]._id.prjCode;

                                var tableData_add = {
                                    type_1_create_formDate: rawTables[memberCount]._add_tables[table_add_index].create_formDate,
                                    type_1_day: rawTables[memberCount]._add_tables[table_add_index].day,
                                    type_1_workAddType: rawTables[memberCount]._add_tables[table_add_index].workAddType,
                                    type_1_start_time: rawTables[memberCount]._add_tables[table_add_index].start_time,
                                    type_1_end_time: rawTables[memberCount]._add_tables[table_add_index].end_time,
                                    type_1_reason: rawTables[memberCount]._add_tables[table_add_index].reason,
                                }

                                if (type1_data[item] != undefined) {
                                    var data = type1_data[item];
                                    data.table_add.push(tableData_add);
                                    if (!data.users.includes(rawTables[memberCount]._id.userDID)) {
                                        data.users.push(rawTables[memberCount]._id.userDID);
                                        data.users_info.push(rawTables[memberCount]._user_info);
                                    }
                                } else {

                                    itemList.push(item);

                                    var tables_add = [];

                                    tables_add.push(tableData_add);

                                    var users = [];

                                    users.push(rawTables[memberCount]._id.userDID);

                                    var users_info = [];

                                    users_info.push(rawTables[memberCount]._user_info);

                                    var data = {
                                        _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1),
                                        _date_short: DateUtil.formatDate(
                                            DateUtil.getShiftDatefromFirstDate(
                                                moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1)),
                                        _day: rawTables[memberCount]._add_tables[table_add_index].day,
                                        _day_tw: DateUtil.getDay(rawTables[memberCount]._add_tables[table_add_index].day),
                                        _prjCode: rawTables[memberCount]._id.prjCode,
                                        _project_info: rawTables[memberCount]._project_info,
                                        users: users,
                                        users_info: users_info,
                                        tables: [],
                                        table_add: tables_add,
                                    }
                                }
                                eval('type1_data[item] = data')
                            }
                        }
                    }
                }
                // console.log(itemList);
                // console.log(type1_data);

                var result = [];

                for (var index = 0; index < itemList.length; index ++) {
                    result.push(type1_data[itemList[index]]);
                }

                result = result.sort(function (a, b) {

                    if (a._date == b._date) {
                        return a._prjCode - b._prjCode;
                    }
                    return a._date > b._date ? 1 : -1;

                });
                // console.log(result);
                return result;
            }

            $scope.calculateHours_type1 = function (item) {
                var hourTotal = 0;

                if (item.tables != undefined && item.tables.length > 0) {
                    for (var index = 0; index < item.tables.length; index ++) {
                        hourTotal += parseFloat(item.tables[index].type_1_hour);
                    }
                }

                var addHourTotal = 0;

                if (item.table_add != undefined && item.table_add.length > 0) {
                    for (var index = 0; index < item.table_add.length; index ++) {
                        addHourTotal += $scope.calculateHours_type1_add(item.table_add[index]);
                    }

                    addHourTotal = addHourTotal % 60 < 30 ? Math.round(addHourTotal / 60) : Math.round(addHourTotal / 60) - 0.5;
                    if (addHourTotal < 1) {
                        addHourTotal = 0;
                    }
                }

                return hourTotal + addHourTotal;
            }

            $scope.calculateHours_type1_add = function (item) {
                var hourTotal = 0;

                hourTotal += parseInt(TimeUtil.getCalculateHourDiffByTime(item.type_1_start_time, item.type_1_end_time));

                return hourTotal;
            }

            // type 2, 一專案加一人名 為一筆
            $scope.filter_type2_data = function(rawTables) {
                var type2_result = [];

                for (var index = 0 ;index < rawTables.length; index ++) {
                    if ( ($scope.calculateHours_type2(rawTables[index]) + $scope.calculateHours_type2_add(rawTables[index], 1) + $scope.calculateHours_type2_add(rawTables[index], 2) != 0)) {
                        type2_result.push(rawTables[index]);
                    }
                }
                return type2_result;
            }

            $scope.calculateHours_type2 = function (item) {
                // console.log(item.tables);
                var hourTotal = 0;
                for (var index = 0; index < item.tables.length; index ++) {

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 0) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 0) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].mon_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 1) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 1) )
                            .diff( moment( $scope.endDay )) <= 0) {

                        hourTotal += parseFloat(item.tables[index].tue_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 2) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 2) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].wes_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 3) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 3) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].thu_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 4) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 4) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].fri_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 5) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 5) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].sat_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 6) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 6) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].sun_hour)
                    }
                }
                return hourTotal;
            }

            $scope.calculateHours_type2_add = function (item, type) {
                // console.log("===calculateHours_type2_add===");
                var type2_add_data = [];

                var mins = 0

                var hourTotal = 0;

                if (item._add_tables == undefined) {
                    return hourTotal;
                }

                for (var index = 0; index < item._add_tables.length; index ++) {
                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item._add_tables[index].create_formDate), item._add_tables[index].day - 1) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item._add_tables[index].create_formDate), item._add_tables[index].day - 1) )
                            .diff( moment( $scope.endDay )) <= 0 &&
                        item._add_tables[index].workAddType == type) {

                        var date_id = DateUtil.getShiftDatefromFirstDate_typeB(moment(item._add_tables[index].create_formDate), item._add_tables[index].day - 1) + "_"
                            + item._id.prjCode + "_"
                            + item._user_info._id;
                        // var date = DateUtil.getShiftDatefromFirstDate_typeB(moment(item._add_tables[index].create_formDate), item._add_tables[index].day - 1)

                        var min = parseInt(TimeUtil.getCalculateHourDiffByTime(item._add_tables[index].start_time, item._add_tables[index].end_time))

                        if (type2_add_data[date_id] != undefined) {
                            var data = type2_add_data[date_id];
                            data.min = min + type2_add_data[date_id].min;

                            // type2_add_data[date_id] = (min + type2_add_data[date_id])
                        } else {
                            var data = {
                                _date: DateUtil.getShiftDatefromFirstDate(moment(item._add_tables[index].create_formDate), item._add_tables[index].day - 1),
                                min: min
                            }

                            type2_add_data.push(data);

                            // type2_add_data.push(min)
                            eval('type2_add_data[date_id] = data')
                        }
                        // hourTotal += parseInt(TimeUtil.getCalculateHourDiffByTime(item._add_tables[index].start_time, item._add_tables[index].end_time));
                    }
                }

                var hour = 0
                for (var i = 0 ; i < type2_add_data.length; i ++) {
                    hour = type2_add_data[i].min % 60 < 30 ? Math.round(type2_add_data[i].min / 60) : Math.round(type2_add_data[i].min / 60) - 0.5;
                    // console.log(hour)
                    if (hour < 1) {
                        hourTotal += 0;
                    } else {
                        hourTotal += hour;
                    }
                }
                return hourTotal;
            }

            // type 3, 一天加一專案加一人名 為一筆
            $scope.filter_type3_data = function(rawTables) {
                console.log(rawTables);

                var itemList = [];

                var type3_data = [];

                for (var memberCount = 0; memberCount < rawTables.length; memberCount++) {

                    if (rawTables[memberCount].tables != undefined) {

                        for (var table_index = 0 ;table_index < rawTables[memberCount].tables.length; table_index ++) {

                            // mon
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 0) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 0) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].mon_hour > 0) {
                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 0),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 0)),
                                    _day: 1,
                                    _day_tw: DateUtil.getDay(1),
                                    _id: rawTables[memberCount]._id,
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _userDID: rawTables[memberCount]._id.userDID,
                                    _project_info: rawTables[memberCount]._project_info,
                                    _user_info: rawTables[memberCount]._user_info,
                                    table: {
                                        type_3_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                        type_3_day: 0,
                                        type_3_hour: rawTables[memberCount].tables[table_index].mon_hour,
                                        type_3_hour_memo: rawTables[memberCount].tables[table_index].mon_memo
                                    },
                                }
                                type3_data.push(data);
                            }

                            // tue
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 1) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 1) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].tue_hour > 0) {
                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 1),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 1)),
                                    _day: 2,
                                    _day_tw: DateUtil.getDay(2),
                                    _id: rawTables[memberCount]._id,
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _userDID: rawTables[memberCount]._id.userDID,
                                    _project_info: rawTables[memberCount]._project_info,
                                    _user_info: rawTables[memberCount]._user_info,
                                    table: {
                                        type_3_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                        type_3_day: 1,
                                        type_3_hour: rawTables[memberCount].tables[table_index].tue_hour,
                                        type_3_hour_memo: rawTables[memberCount].tables[table_index].tue_memo
                                    },
                                }
                                type3_data.push(data);
                            }

                            // wes
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 2) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 2) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].wes_hour > 0) {
                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 2),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 2)),
                                    _day: 3,
                                    _day_tw: DateUtil.getDay(3),
                                    _id: rawTables[memberCount]._id,
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _userDID: rawTables[memberCount]._id.userDID,
                                    _project_info: rawTables[memberCount]._project_info,
                                    _user_info: rawTables[memberCount]._user_info,
                                    table: {
                                        type_3_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                        type_3_day: 2,
                                        type_3_hour: rawTables[memberCount].tables[table_index].wes_hour,
                                        type_3_hour_memo: rawTables[memberCount].tables[table_index].wes_memo
                                    },
                                }
                                type3_data.push(data);
                            }

                            // thu
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 3) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 3) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].thu_hour > 0) {
                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 3),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 3)),
                                    _day: 4,
                                    _day_tw: DateUtil.getDay(4),
                                    _id: rawTables[memberCount]._id,
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _userDID: rawTables[memberCount]._id.userDID,
                                    _project_info: rawTables[memberCount]._project_info,
                                    _user_info: rawTables[memberCount]._user_info,
                                    table: {
                                        type_3_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                        type_3_day: 3,
                                        type_3_hour: rawTables[memberCount].tables[table_index].thu_hour,
                                        type_3_hour_memo: rawTables[memberCount].tables[table_index].thu_memo
                                    },
                                }
                                type3_data.push(data);
                            }

                            // fri
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 4) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 4) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].fri_hour > 0) {
                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 4),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 4)),
                                    _day: 5,
                                    _day_tw: DateUtil.getDay(5),
                                    _id: rawTables[memberCount]._id,
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _userDID: rawTables[memberCount]._id.userDID,
                                    _project_info: rawTables[memberCount]._project_info,
                                    _user_info: rawTables[memberCount]._user_info,
                                    table: {
                                        type_3_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                        type_3_day: 4,
                                        type_3_hour: rawTables[memberCount].tables[table_index].fri_hour,
                                        type_3_hour_memo: rawTables[memberCount].tables[table_index].fri_memo
                                    },
                                }
                                type3_data.push(data);
                            }

                            // sat
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 5) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 5) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].sat_hour > 0) {
                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 5),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 5)),
                                    _day: 6,
                                    _day_tw: DateUtil.getDay(6),
                                    _id: rawTables[memberCount]._id,
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _userDID: rawTables[memberCount]._id.userDID,
                                    _project_info: rawTables[memberCount]._project_info,
                                    _user_info: rawTables[memberCount]._user_info,
                                    table: {
                                        type_3_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                        type_3_day: 5,
                                        type_3_hour: rawTables[memberCount].tables[table_index].sat_hour,
                                        type_3_hour_memo: rawTables[memberCount].tables[table_index].sat_memo
                                    },
                                }
                                type3_data.push(data);
                            }

                            // sun
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 6) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 6) )
                                    .diff( moment( $scope.endDay )) <= 0 &&
                                rawTables[memberCount].tables[table_index].sun_hour > 0) {
                                var data = {
                                    _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount].tables[table_index].create_formDate), 6),
                                    _date_short: DateUtil.formatDate(
                                        DateUtil.getShiftDatefromFirstDate(
                                            moment(rawTables[memberCount].tables[table_index].create_formDate), 6)),
                                    _day: 7,
                                    _day_tw: DateUtil.getDay(7),
                                    _id: rawTables[memberCount]._id,
                                    _prjCode: rawTables[memberCount]._id.prjCode,
                                    _userDID: rawTables[memberCount]._id.userDID,
                                    _project_info: rawTables[memberCount]._project_info,
                                    _user_info: rawTables[memberCount]._user_info,
                                    table: {
                                        type_3_create_formDate: rawTables[memberCount].tables[table_index].create_formDate,
                                        type_3_day: 6,
                                        type_3_hour: rawTables[memberCount].tables[table_index].sun_hour,
                                        type_3_hour_memo: rawTables[memberCount].tables[table_index].sun_memo
                                    },
                                }
                                type3_data.push(data);
                            }
                        }
                    }
                    if (rawTables[memberCount]._add_tables != undefined) {

                        for (var table_add_index = 0 ;table_add_index < rawTables[memberCount]._add_tables.length; table_add_index ++) {
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1) )
                                    .diff( moment( $scope.endDay )) <= 0) {
                                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate),
                                    rawTables[memberCount]._add_tables[table_add_index].day - 1) + "_" +
                                    rawTables[memberCount]._id.prjCode + "_" +
                                    rawTables[memberCount]._user_info._id + "_" +
                                    rawTables[memberCount]._add_tables[table_add_index].workAddType;

                                var tableData_add = {
                                    type_3_create_formDate: rawTables[memberCount]._add_tables[table_add_index].create_formDate,
                                    type_3_day: rawTables[memberCount]._add_tables[table_add_index].day,
                                    type_3_workAddType: rawTables[memberCount]._add_tables[table_add_index].workAddType,
                                    type_3_start_time: rawTables[memberCount]._add_tables[table_add_index].start_time,
                                    type_3_end_time: rawTables[memberCount]._add_tables[table_add_index].end_time,
                                    type_3_reason: rawTables[memberCount]._add_tables[table_add_index].reason,
                                }

                                if (type3_data[item] != undefined) {
                                    var data = type3_data[item];
                                    data.table_add.push(tableData_add);
                                } else {

                                    itemList.push(item);

                                    var tables_add = [];

                                    tables_add.push(tableData_add);

                                    var data = {
                                        _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1),
                                        _date_short: DateUtil.formatDate(
                                            DateUtil.getShiftDatefromFirstDate(
                                                moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1)),
                                        _day: rawTables[memberCount]._add_tables[table_add_index].day,
                                        _day_tw: DateUtil.getDay(rawTables[memberCount]._add_tables[table_add_index].day),
                                        _id: rawTables[memberCount]._id,
                                        _prjCode: rawTables[memberCount]._id.prjCode,
                                        _userDID: rawTables[memberCount]._id.userDID,
                                        _project_info: rawTables[memberCount]._project_info,
                                        _user_info: rawTables[memberCount]._user_info,
                                        _workAddType: rawTables[memberCount]._add_tables[table_add_index].workAddType,
                                        table_add: tables_add
                                    }

                                    type3_data.push(data);

                                    eval('type3_data[item] = data')
                                }
                            }
                        }
                    }
                }
                type3_data = type3_data.sort(function (a, b) {
                    return a._date > b._date ? 1 : -1;
                });

                console.log(type3_data);
                return type3_data;
            }

            $scope.calculateHours_type3 = function (item) {
                var hourTotal = 0;
                hourTotal += parseFloat(item.type_3_hour);
                return hourTotal;
            }

            $scope.calculateHours_type3_add = function (addTables, type) {
                var hourTotal = 0;

                for (var index = 0; index < addTables.length; index ++) {
                    hourTotal += parseInt(TimeUtil.getCalculateHourDiffByTime(addTables[index].type_3_start_time, addTables[index].type_3_end_time));
                }
                hourTotal = hourTotal % 60 < 30 ? Math.round(hourTotal / 60) : Math.round(hourTotal / 60) - 0.5;

                if (hourTotal < 1) {
                    return 0;
                }
                return hourTotal;
            }

            $scope.show_type3_add_reason = function (addTables) {
                var reasonString = "";

                for (var index = 0; index < addTables.length; index ++) {
                    reasonString += addTables[index].type_3_reason + ", ";
                }
                return reasonString;
            }

            // type 4, 一人名 為一筆
            $scope.filter_type4_data = function(rawTables) {
                var type4_data = [];

                for (var memberCount = 0; memberCount < rawTables.length; memberCount++) {
                    if (rawTables[memberCount]._add_tables != undefined) {
                        for (var table_add_index = 0; table_add_index < rawTables[memberCount]._add_tables.length; table_add_index ++) {
                            if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1) )
                                    .diff( moment( $scope.startDay )) >= 0 &&
                                moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1) )
                                    .diff( moment( $scope.endDay )) <= 0) {
                                var item = "_" + rawTables[memberCount]._user_info._id

                                if (!rawTables[memberCount]._add_tables[table_add_index].isExecutiveConfirm) {
                                    continue;
                                }

                                var tableData_add = {
                                    _prjDID: rawTables[memberCount]._id.prjCode,
                                    create_formDate: rawTables[memberCount]._add_tables[table_add_index].create_formDate,
                                    day: rawTables[memberCount]._add_tables[table_add_index].day,
                                    workAddType: rawTables[memberCount]._add_tables[table_add_index].workAddType,
                                    start_time: rawTables[memberCount]._add_tables[table_add_index].start_time,
                                    end_time: rawTables[memberCount]._add_tables[table_add_index].end_time,
                                    reason: rawTables[memberCount]._add_tables[table_add_index].reason,
                                    creatorDID: rawTables[memberCount]._add_tables[table_add_index].creatorDID,
                                }

                                if (type4_data[item] != undefined) {
                                    var data = type4_data[item];
                                    data._add_tables.push(tableData_add);
                                } else {

                                    var tables_add = [];

                                    tables_add.push(tableData_add);

                                    var data = {
                                        _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1),
                                        _date_short: DateUtil.formatDate(
                                            DateUtil.getShiftDatefromFirstDate(
                                                moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1)),
                                        _day: rawTables[memberCount]._add_tables[table_add_index].day,
                                        _day_tw: DateUtil.getDay(rawTables[memberCount]._add_tables[table_add_index].day),
                                        _id: rawTables[memberCount]._id,
                                        _prjCode: rawTables[memberCount]._id.prjCode,
                                        _userDID: rawTables[memberCount]._id.userDID,
                                        _project_info: rawTables[memberCount]._project_info,
                                        _user_info: rawTables[memberCount]._user_info,
                                        _workAddType: rawTables[memberCount]._add_tables[table_add_index].workAddType,
                                        _add_tables: tables_add
                                    }
                                    type4_data.push(data);
                                    eval('type4_data[item] = data')
                                }
                            }
                        }
                    }
                }
                // console.log(" ==== type4_data ==== ")
                // console.log(type4_data)
                return type4_data;
            }

            $scope.calculateHours_type4 = function (item) {
                // console.log(item.tables);
                var hourTotal = 0;
                for (var index = 0; index < item.tables.length; index ++) {

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 0) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 0) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].mon_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 1) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 1) )
                            .diff( moment( $scope.endDay )) <= 0) {

                        hourTotal += parseFloat(item.tables[index].tue_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 2) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 2) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].wes_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 3) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 3) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].thu_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 4) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 4) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].fri_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 5) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 5) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].sat_hour)
                    }

                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 6) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item.tables[index].create_formDate), 6) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        hourTotal += parseFloat(item.tables[index].sun_hour)
                    }
                }
                return hourTotal;
            }

            $scope.calculateHours_type4_add = function (item, type) {
                // console.log("===calculateHours_type4_add===");
                var type4_add_data = [];

                var mins = 0

                var hourTotal = 0;

                if (item._add_tables == undefined) {
                    return hourTotal;
                }

                for (var index = 0; index < item._add_tables.length; index ++) {
                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item._add_tables[index].create_formDate), item._add_tables[index].day - 1) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item._add_tables[index].create_formDate), item._add_tables[index].day - 1) )
                            .diff( moment( $scope.endDay )) <= 0 &&
                        item._add_tables[index].workAddType == type) {

                        var date_id = DateUtil.getShiftDatefromFirstDate_typeB(moment(item._add_tables[index].create_formDate), item._add_tables[index].day - 1) + "_"
                            // + item._id.prjCode + "_"
                            + item._add_tables[index]._prjDID + "_"
                            + item._user_info._id;
                        // var date_id =  DateUtil.getShiftDatefromFirstDate_typeB(moment(item._add_tables[index].create_formDate), item._add_tables[index].day - 1) + "_" +
                        //     item._user_info._id;

                        var min = parseInt(TimeUtil.getCalculateHourDiffByTime(item._add_tables[index].start_time, item._add_tables[index].end_time))

                        if (type4_add_data[date_id] != undefined) {
                            // console.log("Q")

                            var data = type4_add_data[date_id];
                            data.min = min + data.min;

                            type4_add_data[date_id] = data;
                        } else {
                            // console.log("qqqq")

                            var data = {
                                _date: DateUtil.getShiftDatefromFirstDate(moment(item._add_tables[index].create_formDate), item._add_tables[index].day - 1),
                                min: min
                            }

                            type4_add_data.push(data);

                            // type4_add_data.push(min)
                            eval('type4_add_data[date_id] = data')
                        }
                        // hourTotal += parseInt(TimeUtil.getCalculateHourDiffByTime(item._add_tables[index].start_time, item._add_tables[index].end_time));
                    }
                }
                // console.log(" ===== type4_add_data ===== ");
                // console.log(type4_add_data)

                var hour = 0
                for (var i = 0 ; i < type4_add_data.length; i ++) {
                    hour = type4_add_data[i].min % 60 < 30 ? Math.round(type4_add_data[i].min / 60) : Math.round(type4_add_data[i].min / 60) - 0.5;
                    // console.log(hour)
                    if (hour < 1) {
                        hourTotal += 0;
                    } else {
                        hourTotal += hour;
                    }
                }
                return hourTotal;
            }

            $scope.filter_type5_data = function(rawTables) {
                // console.log(rawTables);
                var type5_data = [];

                for (var index = 0; index < rawTables.length; index++) {
                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[index]._work_off_info.create_formDate), rawTables[index]._work_off_info.day - 1) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(rawTables[index]._work_off_info.create_formDate), rawTables[index]._work_off_info.day - 1) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        var item = "_" + rawTables[index]._user_info._id;
                        var workOffType = "_" + rawTables[index]._work_off_info.workOffType;

                        if (!rawTables[index]._work_off_info.isExecutiveCheck) {
                            continue;
                        }

                        var workOffItem = {
                            create_formDate: rawTables[index]._work_off_info.create_formDate,
                            day: rawTables[index]._work_off_info.day,
                            workOffType: rawTables[index]._work_off_info.workOffType,
                            start_time: rawTables[index]._work_off_info.start_time,
                            end_time: rawTables[index]._work_off_info.end_time,
                        }

                        if (type5_data[item] != undefined) {
                            var data = type5_data[item];
                            data._workOffItems.push(workOffItem);
                            if (data[workOffType] != undefined) {
                                eval('data[workOffType].push(workOffItem)');
                            } else {
                                var temp = [];
                                temp.push(workOffItem);
                                eval('data[workOffType] = temp');
                            }
                        } else {
                            var temp = [];
                            temp.push(workOffItem);

                            var data = {
                                _userDID: rawTables[index]._user_info._id,
                                _user_info: rawTables[index]._user_info,
                                _workOffItems: [workOffItem],
                            }

                            eval('data[workOffType] = temp');
                            type5_data.push(data);
                            eval('type5_data[item] = data')
                        }
                    }
                }
                console.log(" ==== type5_data ==== ");
                console.log(type5_data);
                return type5_data;
            }

            $scope.calculateWorkOff_type5 = function (item, type) {
                var target = [];
                var tempType = "_" + type;
                eval("target = item[tempType]");
                if (target == undefined) {
                    return 0;
                }
                var results = 0;
                for (var index = 0; index < target.length; index ++) {
                    console.log(target[index]);
                    results += $scope.getHourDiffByTime(target[index].start_time, target[index].end_time, type)
                }

                switch (type) {
                    // 事
                    case 0: {
                        return results;
                    }
                    // 病
                    case 1: {
                        return results;
                    }
                    // 補休
                    case 2: {
                        return results ;
                    }
                    // 特
                    case 3: {
                        return results;
                    }
                    // 婚
                    case 4:
                        return results / 8;
                    // 喪
                    case 5:
                        return results / 8;
                    // 公
                    case 6:
                        return results;
                    // 公傷
                    case 7:
                        return results / 8;
                    // 產
                    case 8:
                        return results / 8;
                    // 陪產(檢)
                    case 9:
                        return results / 8;
                    // 其他
                    case 1001:
                        return results;
                }

            }

            $scope.getHourDiffByTime = function (start, end, type) {
                if (isNaN(parseInt(start)) || isNaN(parseInt(end))) {
                    return "輸入格式錯誤";
                }
                if (start && end) {
                    var difference = Math.abs(TimeUtil.toSeconds(start) - TimeUtil.toSeconds(end));

                    // compute hours, minutes and seconds
                    var result = [
                        // an hour has 3600 seconds so we have to compute how often 3600 fits
                        // into the total number of seconds
                        Math.floor(difference / 3600), // HOURS
                        // similar for minutes, but we have to "remove" the hours first;
                        // this is easy with the modulus operator
                        Math.floor((difference % 3600) / 60) // MINUTES
                        // the remainder is the number of seconds
                        // difference % 60 // SECONDS
                    ];

                    if (TimeUtil.getHour(end) == 12) {
                        result = result[0] + (result[1] > 0 ? 0.5 : 0);
                    } else {
                        result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                    }
                    var resultFinal;
                    if (TimeUtil.getHour(start) <= 12 && TimeUtil.getHour(end) >= 13) {

                        if (this.workOffType !== undefined) {
                            // 請假單
                            if (this.workOffType.type == 2) {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                            } else {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                            }

                        } else if (this.table != undefined) {
                            // 主管審核、行政審核
                            if (this.table.workOffType == 2) {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                            } else {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                            }
                        } else {
                            // 總攬
                            if (type == 2) {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                            } else {
                                resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                            }
                        }

                    } else {
                        if (this.workOffType !== undefined) {
                            // 請假單
                            if (this.workOffType.type == 2) {
                                resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                            } else {
                                resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                            }
                        } else if (this.table != undefined) {
                            // 主管審核、行政審核
                            if (this.table.workOffType == 2) {
                                resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                            } else {
                                resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                            }
                        } else {
                            // 總攬
                            if (type == 2) {
                                resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                            } else {
                                resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                            }
                        }
                    }

                    if (this.workOffType !== undefined) {
                        // 請假單
                        if (this.workOffType.type == 3 || this.workOffType.type == 4 || this.workOffType.type == 5
                            || this.workOffType.type == 7 || this.workOffType.type == 8 || this.workOffType.type == 9) {

                            resultFinal = resultFinal <= 4 ? 4 : 8;
                        }
                        return resultFinal;
                    } else if (this.table != undefined) {
                        // 主管審核、行政審核
                        if (this.table.workOffType == 4 || this.table.workOffType == 5
                            || this.table.workOffType == 7 || this.table.workOffType == 8 || this.table.workOffType == 9) {
                            resultFinal = resultFinal <= 4 ? 4 : 8;
                        }
                        return resultFinal;
                    } else {
                        // 總攬
                        if (type == 4 || type == 5
                            || type == 7 || type == 8 || type == 9) {
                            resultFinal = resultFinal <= 4 ? 4 : 8;
                        }
                        return resultFinal;
                    }
                }
            }


            // normalize
            $scope.projectSelected = function (projectInfo) {
                this._branch = $scope._branch = $('#prjBranch')[0].value = projectInfo.branch;
                this._year = $scope._year = $('#prjYear')[0].value = projectInfo.year;
                this._code = $scope._code = $('#prjCode_statistic')[0].value = projectInfo.code;
                this._number = $scope._number = $('#prjNumber')[0].value = projectInfo.prjNumber;
                this._subNumber = $scope._subNumber = $('#prjSubNumber')[0].value = projectInfo.prjSubNumber;
                this._type = $scope._type = $('#prjType')[0].value = projectInfo.type;
            }


            $scope.fetchYearArray = function (start, end) {
                var startYear = new Date(start).getFullYear() - 1911;
                var endYear = new Date(end).getFullYear() - 1911;

                var result = [];

                for (var index = 0; index < (endYear - startYear + 1); index ++) {
                    result.push(startYear + index);
                }

                return result;
            }

            $scope.fetchMonthArray = function (start, end) {
                var startYear = new Date(start).getFullYear() - 1911;
                var endYear = new Date(end).getFullYear() - 1911;

                if (endYear - startYear >= 1) {
                    return [1,2,3,4,5,6,7,8,9,10,11,12];
                }

                var startMonth = new Date(start).getMonth();
                var endMonth = new Date(end).getMonth();

                var result = [];

                for (var index = 0; index <= endMonth - (startMonth - 1); index ++) {
                    result.push(startMonth + index);
                }
                return result;
            }

            $scope.checkIllegalDate = function (data) {
                var results = [];

                for (var index = 0; index < data.length; index ++) {
                    // console.log(data[index]);
                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(data[index].create_formDate), 6) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(data[index].create_formDate), 0) )
                            .diff( moment( $scope.endDay )) <= 0) {
                        results.push(data[index]);
                    }
                }
                return results;
            }

            $scope.selectedUsers = function () {
                // console.log(vm)
            }

            $scope.isOverRule = function (item) {
                if ($scope.calculateHours_type4_add(item, 1) + $scope.calculateHours_type4_add(item, 2) > 46.0) {
                    return true;
                }
                return false
            }

        } // End of function
    }
)();
