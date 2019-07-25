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

            $scope.month = this.month = undefined;
            $scope.year = this.myYear;

            $(document).ready(function () {
                console.log(" ====== initMask document ready ====== ")
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

            $scope.startDay = this.startDay;
            $scope.endDay = this.endDay;

            vm.isAllMonth = false;

            // 主要顯示
            $scope.statisticsResults = [];

            // 統計搜尋條件
            var getData = {};

            // 年度、月份
            // 總案代碼、專案代碼、子案代碼、類型代碼
            // 工時類型、相關人員
            $scope.CJTest = function () {

                console.log($scope.startDay);
                console.log($scope.endDay);

                $scope.startDay = this.startDay;
                $scope.endDay = this.endDay;

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
                getData.code = $('#prjCode')[0].value == (undefined || "") ? undefined : $('#prjCode')[0].value;
                getData.prjNumber = $('#prjNumber')[0].value == (undefined || "") ? undefined : $('#prjNumber')[0].value;
                getData.prjSubNumber = $('#prjSubNumber')[0].value == (undefined || "") ? undefined : $('#prjSubNumber')[0].value;
                getData.type = $('#prjType')[0].value == (undefined || "") ? undefined : $('#prjType')[0].value;

                console.log(getData);
                WorkHourUtil.queryStatisticsFormsCJ_type2(getData)
                    .success(function (res) {
                        console.log(res);
                        // console.log(res.payload);

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

                        $scope.statisticsResults = res.payload;

                        angular.element(
                            document.getElementById('includeHead'))
                            .html($compile(
                                "<div ba-panel ba-panel-title=" +
                                "'列表 - " + res.payload.length + "'" +
                                "ba-panel-class= " +
                                "'with-scroll'" + ">" +
                                "<div " +
                                "ng-include=\"'app/pages/myForms/workStatisticsCJ/tables/workStatisticsShowTable.html'\">" +
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
            }


            // Original
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

            // Original

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
                    // TOTAL
                    // hourTotal += parseFloat(item.tables[index].mon_hour) +
                    //     parseFloat(item.tables[index].tue_hour) +
                    //     parseFloat(item.tables[index].wes_hour) +
                    //     parseFloat(item.tables[index].thu_hour) +
                    //     parseFloat(item.tables[index].fri_hour) +
                    //     parseFloat(item.tables[index].sat_hour) +
                    //     parseFloat(item.tables[index].sun_hour);
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
                    if (moment( DateUtil.getShiftDatefromFirstDate(moment(item._add_tables[index].create_formDate), item._add_tables[index].day) )
                            .diff( moment( $scope.startDay )) >= 0 &&
                        moment( DateUtil.getShiftDatefromFirstDate(moment(item._add_tables[index].create_formDate), item._add_tables[index].day) )
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

            $scope.projectSelected = function (projectInfo) {
                // console.log(projectInfo);
                this._branch = $scope._branch = $('#prjBranch')[0].value = projectInfo.branch;
                this._year = $scope._year = $('#prjYear')[0].value = projectInfo.year;
                this._code = $scope._code = $('#prjCode')[0].value = projectInfo.code;
                this._number = $scope._number = $('#prjNumber')[0].value = projectInfo.prjNumber;
                this._subNumber = $scope._subNumber = $('#prjSubNumber')[0].value = projectInfo.prjSubNumber;
                this._type = $scope._type = $('#prjType')[0].value = projectInfo.type;
                // console.log(this);
            }

            $scope.prjTypeToName = function (type) {
                return ProjectUtil.getTypeText(type);
            }

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
                console.log(results);
                return results;
            }

        } // End of function
    }
)();
