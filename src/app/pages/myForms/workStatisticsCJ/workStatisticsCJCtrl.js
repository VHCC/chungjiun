/**
 * @author Ichen.chu
 * created on 16.05.2019
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .controller('workStatisticsCJCtrl',
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
                    WorkStatisticsCJCtrl
                ]);

        /** @ngInject */
        function WorkStatisticsCJCtrl($scope,
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

            //所有專案
            Project.findAll()
                .success(function (allProjects) {
                    // console.log(allProjects);
                    vm.allProjectData = allProjects;
                })
                .error(function () {
                    console.log("Error, Project.findAll")
                })

            $scope.prjTypeToName = function (type) {
                return ProjectUtil.getTypeText(type);
            }

            $scope.month = this.month = undefined;
            $scope.year = this.myYear;

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

            // $scope.startDay = new Date().getFullYear() + "/" + "06/10";
            // $scope.endDay = new Date().getFullYear() + "/" + "06/13";

            // $scope.startDay = this.startDay;
            // $scope.endDay = this.endDay;

            vm.isAllMonth = false;

            // 主要顯示
            $scope.statisticsResults = [];

            // 統計搜尋條件
            var getData = {};

            // 年度、月份
            // 總案代碼、專案代碼、子案代碼、類型代碼
            // 工時類型、相關人員
            $scope.CJTest = function () {

                // $scope.startDay = this.startDay;
                $scope.startDay = $('#inputStartDay')[0].value;
                // $scope.endDay = this.endDay;
                $scope.endDay = $('#inputEndDay')[0].value;

                // console.log($scope.startDay);
                // console.log($scope.endDay);

                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_statistics'
                });

                getData.creatorDID = cookies.get('userDID');
                getData.form_year = parseInt(this.myYear) - 1911;
                getData.form_yearArray = $scope.fetchYearArray($scope.startDay, $scope.endDay);
                // getData.form_month = $scope.month = this.month == (undefined || "") ? undefined : parseInt(this.month);
                // vm.isAllMonth = this.month == (undefined || "");
                getData.form_monthArray = $scope.fetchMonthArray($scope.startDay, $scope.endDay);

                getData.branch = $('#prjBranch')[0].value == (undefined || "") ? undefined : $('#prjBranch')[0].value;
                getData.year = $('#prjYear')[0].value == (undefined || "") ? undefined : $('#prjYear')[0].value;
                getData.code = $('#prjCode_statistic')[0].value == (undefined || "") ? undefined : $('#prjCode_statistic')[0].value;
                getData.prjNumber = $('#prjNumber')[0].value == (undefined || "") ? undefined : $('#prjNumber')[0].value;
                getData.prjSubNumber = $('#prjSubNumber')[0].value == (undefined || "") ? undefined : $('#prjSubNumber')[0].value;
                getData.type = $('#prjType')[0].value == (undefined || "") ? undefined : $('#prjType')[0].value;

                console.log(getData);

                if ($('#inlineRadio1')[0].checked) {
                    // 第 1 類型

                    WorkHourUtil.queryStatisticsFormsCJ_type2(getData)
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
                                    document.getElementById('includeHead'))
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
                                        referenceId: 'mainPage_statistics'
                                    });
                                }, 500)
                            } catch (e) {
                                toastr['warning'](e.toString(), '搜尋異常');
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'mainPage_statistics'
                                    });
                                }, 500)
                            }


                        })
                        .error(function () {
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_statistics'
                                });
                            }, 500)
                        })

                } else if ($('#inlineRadio2')[0].checked) {
                    // 第 2 類型
                    WorkHourUtil.queryStatisticsFormsCJ_type2(getData)
                        .success(function (res) {
                            // console.log(res);

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

                            $scope.statisticsResults = $scope.filter_type2_data(res.payload);

                            angular.element(
                                document.getElementById('includeHead'))
                                .html($compile(
                                    "<div ba-panel ba-panel-title=" +
                                    "'列表 - " + $scope.statisticsResults.length + "'" +
                                    "ba-panel-class= " +
                                    "'with-scroll'" + ">" +
                                    "<div " +
                                    "ng-include=\"'app/pages/myForms/workStatisticsCJ/tables/workStatisticsShowTable_type2.html'\">" +
                                    "</div>" +
                                    "</div>"
                                )($scope));

                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_statistics'
                                });
                            }, 500)
                        })
                        .error(function () {
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_statistics'
                                });
                            }, 500)
                        })

                } else if ($('#inlineRadio3')[0].checked) {
                    // 第 3 類型

                    WorkHourUtil.queryStatisticsFormsCJ_type2(getData)
                        .success(function (res) {
                            // console.log(res);

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

                            try {
                                // console.log(res.payload);

                                $scope.statisticsResults = $scope.filter_type3_data(res.payload);

                                angular.element(
                                    document.getElementById('includeHead'))
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
                                        referenceId: 'mainPage_statistics'
                                    });
                                }, 500)
                            } catch (e) {
                                toastr['warning'](e.toString(), '搜尋異常');
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'mainPage_statistics'
                                    });
                                }, 500)
                            }


                        })
                        .error(function () {
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_statistics'
                                });
                            }, 500)
                        })

                } else {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_statistics'
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

                // type1_data = type1_data.sort(function (a, b) {
                //     return a._date > b._date ? 1 : -1;
                // });

                console.log(itemList);

                console.log(type1_data);

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

                console.log(result);

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
                console.log(rawTables);

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
                // console.log(item._add_tables);
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
                        hourTotal += parseInt(TimeUtil.getCalculateHourDiffByTime(item._add_tables[index].start_time, item._add_tables[index].end_time));
                    }
                }

                hourTotal = hourTotal % 60 < 30 ? Math.round(hourTotal / 60) : Math.round(hourTotal / 60) - 0.5;
                if (hourTotal < 1) {
                    return 0;
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
                                // var data = {
                                //     _date: DateUtil.getShiftDatefromFirstDate(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1),
                                //     _date_short: DateUtil.formatDate(
                                //         DateUtil.getShiftDatefromFirstDate(
                                //             moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate), rawTables[memberCount]._add_tables[table_add_index].day - 1)),
                                //     _day: rawTables[memberCount]._add_tables[table_add_index].day,
                                //     _day_tw: DateUtil.getDay(rawTables[memberCount]._add_tables[table_add_index].day),
                                //     _id: rawTables[memberCount]._id,
                                //     _prjCode: rawTables[memberCount]._id.prjCode,
                                //     _userDID: rawTables[memberCount]._id.userDID,
                                //     _project_info: rawTables[memberCount]._project_info,
                                //     _user_info: rawTables[memberCount]._user_info,
                                //     table_add: {
                                //         type_3_create_formDate: rawTables[memberCount]._add_tables[table_add_index].create_formDate,
                                //         type_3_day: rawTables[memberCount]._add_tables[table_add_index].day,
                                //         type_3_workAddType: rawTables[memberCount]._add_tables[table_add_index].workAddType,
                                //         type_3_start_time: rawTables[memberCount]._add_tables[table_add_index].start_time,
                                //         type_3_end_time: rawTables[memberCount]._add_tables[table_add_index].end_time,
                                //         type_3_reason: rawTables[memberCount]._add_tables[table_add_index].reason,
                                //     },
                                // }
                                // type3_data.push(data);




                                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawTables[memberCount]._add_tables[table_add_index].create_formDate),
                                    rawTables[memberCount]._add_tables[table_add_index].day - 1) + "_" +
                                    rawTables[memberCount]._id.prjCode + "_" + rawTables[memberCount]._add_tables[table_add_index].workAddType;

                                var tableData_add = {
                                    type_3_create_formDate: rawTables[memberCount]._add_tables[table_add_index].create_formDate,
                                    type_3_day: rawTables[memberCount]._add_tables[table_add_index].day,
                                    type_3_workAddType: rawTables[memberCount]._add_tables[table_add_index].workAddType,
                                    type_3_start_time: rawTables[memberCount]._add_tables[table_add_index].start_time,
                                    type_3_end_time: rawTables[memberCount]._add_tables[table_add_index].end_time,
                                    type_3_reason: rawTables[memberCount]._add_tables[table_add_index].reason,
                                }

                                console.log(item);

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


            // normalize

            $scope.projectSelected = function (projectInfo) {
                // console.log(projectInfo);
                this._branch = $scope._branch = $('#prjBranch')[0].value = projectInfo.branch;
                this._year = $scope._year = $('#prjYear')[0].value = projectInfo.year;
                this._code = $scope._code = $('#prjCode_statistic')[0].value = projectInfo.code;
                this._number = $scope._number = $('#prjNumber')[0].value = projectInfo.prjNumber;
                this._subNumber = $scope._subNumber = $('#prjSubNumber')[0].value = projectInfo.prjSubNumber;
                this._type = $scope._type = $('#prjType')[0].value = projectInfo.type;
                // console.log(this);
            }

            // Deprecated
            $scope.showAllMonth = function (item, type) {
                // console.log(item);
                var months = [];
                switch (type) {
                    case 1: {
                        for (var index = 0; index < item.forms.length; index ++) {
                            if(!months.includes(item.forms[index].month)){
                                months.push(item.forms[index].month);
                            }
                        }
                    }
                    break;
                    case 2: {
                        for (var index = 0; index < item.add_tables.length; index ++) {
                            if(!months.includes(item.add_tables[index].month)){
                                months.push(item.add_tables[index].month);
                            }
                        }
                    }
                    break;
                }
                return months;
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
                // console.log(data);

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
                // console.log(data);
                // console.log(results);
                return results;
            }

        } // End of function
    }
)();
