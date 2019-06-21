/**
 * @author Ichen.chu
 * created on 16.05.2019
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .controller('workStatisticsCtrl',
                [
                    '$scope',
                    '$filter',
                    '$cookies',
                    '$timeout',
                    'ngDialog',
                    'User',
                    'DateUtil',
                    'TimeUtil',
                    'Project',
                    'ProjectUtil',
                    'WorkHourUtil',
                    'bsLoadingOverlayService',
                    'toastr',
                    WorkStatisticsCtrl
                ]);

        /** @ngInject */
        function WorkStatisticsCtrl($scope,
                               $filter,
                               cookies,
                               $timeout,
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

            vm.isAllMonth = false;

            // 主要顯示
            $scope.statisticsResults = [];

            // 統計搜尋條件
            var getData = {};

            // 年度、月份
            // 總案代碼、專案代碼、子案代碼、類型代碼
            // 工時類型、相關人員
            $scope.mnbvcxz = function () {

                bsLoadingOverlayService.start({
                    referenceId: 'mainPage_statistics'
                });

                getData.creatorDID = cookies.get('userDID');
                getData.form_year = parseInt(this.myYear) - 1911;
                getData.form_month = $scope.month = this.month == (undefined || "") ? undefined : parseInt(this.month);
                vm.isAllMonth = this.month == (undefined || "");

                getData.branch = $('#prjBranch')[0].value == (undefined || "") ? undefined : $('#prjBranch')[0].value;
                getData.year = $('#prjYear')[0].value == (undefined || "") ? undefined : $('#prjYear')[0].value;
                getData.code = $('#prjCode')[0].value == (undefined || "") ? undefined : $('#prjCode')[0].value;
                getData.prjNumber = $('#prjNumber')[0].value == (undefined || "") ? undefined : $('#prjNumber')[0].value;
                getData.prjSubNumber = $('#prjSubNumber')[0].value == (undefined || "") ? undefined : $('#prjSubNumber')[0].value;
                getData.type = $('#prjType')[0].value == (undefined || "") ? undefined : $('#prjType')[0].value;

                // var getData = {
                //     creatorDID: cookies.get('userDID'),
                //     year: parseInt(this.myYear) - 1911,
                //     month: this.month == (undefined || "") ? undefined : parseInt(this.month)
                // }

                // console.log(this);
                console.log(getData);
                WorkHourUtil.queryStatisticsForms(getData)
                    .success(function (res) {
                        console.log(res);

                        res.payload = res.payload.sort(function (a, b) {
                            return a._id.userDID > b._id.userDID ? 1 : -1;
                        });

                        $scope.statisticsResults = res.payload;

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_statistics'
                            });
                        }, 500)
                        // var workHourTables= [];
                        //
                        // for (var index = 0; index < res.payload.length; index ++) {
                        //     // console.log(res.payload[index]);
                        //     if (res.payload[index].work_hour_forms.length > 0) {
                        //         var prjDID = res.payload[index]._projectString;
                        //         for (var subIndex = 0; subIndex < res.payload[index].work_hour_forms.length; subIndex ++) {
                        //             // console.log(res.payload[index].work_hour_forms[subIndex]);
                        //
                        //             // TODO 日期過濾
                        //             if(false) {
                        //                 continue;
                        //             }
                        //
                        //             if (res.payload[index].work_hour_forms[subIndex].formTables.length > 0) {
                        //                 for (var subSubInedex = 0; subSubInedex < res.payload[index].work_hour_forms[subIndex].formTables.length; subSubInedex++) {
                        //                     // console.log(res.payload[index].work_hour_forms[subIndex].formTables[subSubInedex]);
                        //                     if (res.payload[index].work_hour_forms[subIndex].formTables[subSubInedex].prjDID == prjDID) {
                        //                         workHourTables.push(res.payload[index].work_hour_forms[subIndex].formTables[subSubInedex].tableID);
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                        // console.log(workHourTables);
                        //
                        // var apiData = {};
                        //
                        // apiData = {
                        //     temps: workHourTables,
                        //     creatorDID: cookies.get('userDID')
                        // }
                        //
                        // WorkHourUtil.insertWorkHourTempsData(apiData)
                        //     .success(function (res) {
                        //         var subGetData = {
                        //             tables: workHourTables,
                        //             creatorDID: cookies.get('userDID')
                        //         }
                        //
                        //         WorkHourUtil.queryStatisticsTables(subGetData)
                        //             .success(function (res) {
                        //                 console.log(res);
                        //                 $scope.statisticsTableForms = res.payload;
                        //             })
                        //
                        //     })
                    })
                    .error(function () {
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_statistics'
                            });
                        }, 500)
                    })
            }

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
                    // $scope.table.totalHourTemp = 0;
                    return 0;
                }

                return hourTotal;
            }

            $scope.projectSelected = function (projectInfo) {
                // console.log(projectInfo);
                this._branch = $scope._branch = projectInfo.branch;
                this._year = $scope._year = projectInfo.year;
                this._code = $scope._code = projectInfo.code;
                this._number = $scope._number = projectInfo.prjNumber;
                this._subNumber = $scope._subNumber = projectInfo.prjSubNumber;
                this._type = $scope._type = projectInfo.type;
                // console.log(this);
            }

            $scope.showAllMonth = function (item, type) {
                console.log(item);
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

        } // End of function
    }
)();
