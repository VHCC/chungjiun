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
                    'WorkHourUtil',
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
                               WorkHourUtil,
                               toastr) {

            var vm = this;
            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;

            $scope.mnbvcxz = function () {

                var getData = {
                    creatorDID: cookies.get('userDID'),
                    year: thisYear,
                    month: thisMonth
                }

                console.log(getData);
                WorkHourUtil.queryStatisticsForms(getData)
                    .success(function (res) {
                        console.log(res);

                        var workhourtables= [];

                        for (var index = 0; index < res.payload.length; index ++) {
                            // console.log(res.payload[index]);
                            if (res.payload[index].work_hour_forms.length > 0) {
                                var prjDID = res.payload[index]._projectString;
                                for (var subIndex = 0; subIndex < res.payload[index].work_hour_forms.length; subIndex ++) {
                                    // console.log(res.payload[index].work_hour_forms[subIndex]);

                                    // TODO 日期過濾
                                    if(false) {
                                        continue;
                                    }

                                    if (res.payload[index].work_hour_forms[subIndex].formTables.length > 0) {
                                        for (var subSubInedex = 0; subSubInedex < res.payload[index].work_hour_forms[subIndex].formTables.length; subSubInedex++) {
                                            // console.log(res.payload[index].work_hour_forms[subIndex].formTables[subSubInedex]);
                                            if (res.payload[index].work_hour_forms[subIndex].formTables[subSubInedex].prjDID == prjDID) {
                                                workhourtables.push(res.payload[index].work_hour_forms[subIndex].formTables[subSubInedex].tableID);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        console.log(workhourtables);

                        var apiData = {};

                        apiData = {
                            temps: workhourtables,
                            creatorDID: cookies.get('userDID')
                        }

                        WorkHourUtil.insertWorkHourTempsData(apiData)
                            .success(function (res) {
                                var subGetData = {
                                    tables: workhourtables,
                                    creatorDID: cookies.get('userDID')
                                }

                                WorkHourUtil.queryStatisticsTables(subGetData)
                                    .success(function (res) {
                                        console.log(res);
                                    })

                            })
                    })
                    .error(function () {

                    })
            }

        } // End of function
    }
)();
