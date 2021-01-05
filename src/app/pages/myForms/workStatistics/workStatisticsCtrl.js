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
                    vm.allProjectCache = allProjects;
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

        } // End of function
    }
)();
