/**
 * @author Ichen.Chu
 * created on 19.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('workHourTableCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                'User',
                'Project',
                'ProjectUtil',
                'DateUtil',
                'WorkHourForms',
                'editableOptions',
                'editableThemes',
                WorkHourTableCtrl
            ]);

    /** @ngInject */
    function WorkHourTableCtrl($scope,
                               $filter,
                               cookies,
                               User,
                               Project,
                               ProjectUtil,
                               DateUtil,
                               WorkHourForms,
                               editableOptions,
                               editableThemes) {
        var vm = this;

        // 主要顯示
        $scope.tablesItems = [];

        // 找跟User有關係的
        Project.findAll()
            .success(function (allProjects) {
                vm.projects = allProjects;
                $scope.projectData = [];
                var prjCount = allProjects.length;
                for (var index = 0; index < prjCount; index++) {
                    $scope.projectData[index] = {
                        prjDID: allProjects[index]._id,
                        prjCode: allProjects[index].prjCode,
                        name: allProjects[index].name + " - " + ProjectUtil.getTypeText(allProjects[index].type),
                        majorID: allProjects[index].majorID,
                    };
                }
            });

        $scope.addWorkItem = function (prj) {
            vm.prjItems.selected = "";
            var inserted = {
                prjDID: prj._id,
            };
            $scope.tablesItems.push(inserted);
        }

        User.findManagers()
            .success(function (allManagers) {
                $scope.projectManagers = [];
                for (var i = 0; i < allManagers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allManagers[i]._id,
                        name: allManagers[i].name
                    };
                }
            });

        $scope.username = cookies.get('username');

        $scope.removeWorkItem = function (index) {
            console.log(index)
            $scope.tablesItems.splice(index, 1);
            console.log('removeWorkItem= ' + index);
        };

        editableOptions.theme = 'bs3';
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        var formDataTable = {};

        $scope.loading = true;

        //取得使用者個人工時表，userDID, 當周第一天日期，一個人只有一張工時表
        $scope.getTable = function () {
            var getData = {
                creatorDID: cookies.get('userDID'),
                create_formDate:  $scope.firstFullDate,
            }
            console.log($scope.firstFullDate);
            WorkHourForms.getWorkHourForm(getData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        var workItemCount = res.payload[0].formTables.length;

                        var prjIDArray = [];
                        var workTableIDArray = [];
                        // 組成 prjID Array, TableID Array，再去Server要資料
                        for (var index = 0; index < workItemCount; index++) {
                            workTableIDArray[index] = res.payload[0].formTables[index].tableID;
                            prjIDArray[index] = res.payload[0].formTables[index].prjDID;
                        }

                        var formData = {
                            prjIDArray: prjIDArray,
                        }
                        // 取得Prj Data
                        Project.findPrjByIDArray(formData)
                            .success(function (res) {
                                $scope.loading = false;
                                // console.log(res.payload);
                                // 與這位user有關的Project
                                // $scope.projectData = [];
                                // var prjCount = res.payload.length;
                                // for (var index = 0; index < prjCount; index++) {
                                //     $scope.projectData[index] = {
                                //         prjDID: res.payload[index]._id,
                                //         prjCode: res.payload[index].prjCode,
                                //         name: res.payload[index].name + " - " + ProjectUtil.getTypeText(res.payload[index].type),
                                //         majorID: res.payload[index].majorID,
                                //     };
                                // }
                            })
                            .error(function () {
                                console.log('ERROR Project.findPrjByIDArray');
                            })

                        formDataTable = {
                            tableIDArray: workTableIDArray,
                        }
                        // console.log(formDataTable);
                        // 取得 Table Data
                        WorkHourForms.findWorkHourTableFormByTableIDArray(formDataTable)
                            .success(function (res) {

                                // 填入表單資訊
                                $scope.tableData = {};
                                for (var index = 0; index < res.payload.length; index++) {
                                    var detail = {
                                        prjDID: res.payload[index].prjDID,
                                        //MON
                                        mon_hour: res.payload[index].mon_hour,
                                        mon_memo: res.payload[index].mon_memo,
                                        mon_hour_add: res.payload[index].mon_hour_add,
                                        mon_memo_add: res.payload[index].mon_memo_add,
                                        //TUE
                                        tue_hour: res.payload[index].tue_hour,
                                        tue_memo: res.payload[index].tue_memo,
                                        tue_hour_add: res.payload[index].tue_hour_add,
                                        tue_memo_add: res.payload[index].tue_memo_add,
                                        //WES
                                        wes_hour: res.payload[index].wes_hour,
                                        wes_memo: res.payload[index].wes_memo,
                                        wes_hour_add: res.payload[index].wes_hour_add,
                                        wes_memo_add: res.payload[index].wes_memo_add,
                                        //THU
                                        thu_hour: res.payload[index].thu_hour,
                                        thu_memo: res.payload[index].thu_memo,
                                        thu_hour_add: res.payload[index].thu_hour_add,
                                        thu_memo_add: res.payload[index].thu_memo_add,
                                        //FRI
                                        fri_hour: res.payload[index].fri_hour,
                                        fri_memo: res.payload[index].fri_memo,
                                        fri_hour_add: res.payload[index].fri_hour_add,
                                        fri_memo_add: res.payload[index].fri_memo_add,
                                        //SAT
                                        sat_hour: res.payload[index].sat_hour,
                                        sat_memo: res.payload[index].sat_memo,
                                        sat_hour_add: res.payload[index].sat_hour_add,
                                        sat_memo_add: res.payload[index].sat_memo_add,
                                        //SUN
                                        sun_hour: res.payload[index].sun_hour,
                                        sun_memo: res.payload[index].sun_memo,
                                        sun_hour_add: res.payload[index].sun_hour_add,
                                        sun_memo_add: res.payload[index].sun_memo_add,
                                    };
                                    $scope.tablesItems.push(detail)
                                }
                                // console.log($scope.tablesItems);
                            })
                            .error(function () {
                                console.log('ERROR WorkHourForms.findWorkHourTableFormByTableIDArray');
                            })

                    } else {
                        $scope.loading = false;
                    }
                })
                .error(function () {
                    console.log('ERROR WorkHourForms.getWorkHourForm');
                })
        }

        // -------------------------------------
        $scope.tableChange = function () {
            $("[id='btnSubmit']")[0].innerText = '更動後請儲存';
            $("[id='btnSubmit']").css('display', 'inline-block');
        }
        // -----------------------  Show methods --------------------------
        $scope.showPrjName = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.projectData, {
                    prjDID: prjDID,
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        $scope.showPrjCode = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.projectData, {
                    prjDID: prjDID,
                });
            }
            return selected.length ? selected[0].prjCode : 'Not Set';
        };

        $scope.showMajor = function (prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.projectData, {
                    prjDID: prjDID
                });
            }
            var majorDID = majorSelected[0].majorID;
            var selected = [];
            if (majorDID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: majorDID
                });
            }

            return selected.length ? selected[0].name : 'Not Set';
        };

        $scope.weekShift = 0;
        $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);
        $scope.firstDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
        $scope.lastDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 6));

        $scope.monDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 0));
        $scope.tueDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 1));
        $scope.wesDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 2));
        $scope.thuDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 3));
        $scope.friDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 4));
        $scope.satDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 5));
        $scope.sunDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 6));


        $scope.addWeek = function () {
            $scope.weekShift++;
            $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift));
            $scope.firstDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift)));
            $scope.lastDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 6));

            $scope.monDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 0));
            $scope.tueDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 1));
            $scope.wesDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 2));
            $scope.thuDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 3));
            $scope.friDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 4));
            $scope.satDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 5));
            $scope.sunDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 6));
            $("[id='btnSubmit']").css('display', 'none');
            $scope.tablesItems = [];
            $scope.getTable();
        }

        $scope.decreaceWeek = function () {
            $scope.weekShift--;
            $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift));
            $scope.firstDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift)));
            $scope.lastDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 6));

            $scope.monDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 0));
            $scope.tueDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 1));
            $scope.wesDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 2));
            $scope.thuDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 3));
            $scope.friDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 4));
            $scope.satDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 5));
            $scope.sunDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate, 6));
            $("[id='btnSubmit']").css('display', 'none');
            $scope.tablesItems = [];
            $scope.getTable();

        }

        // ************************ CREATE SUBMIT ***************************
        $scope.createSubmit = function () {

            var workItemCount = $('tbody').length;
            var workHourTableData = [];

            for (var index = 0; index < workItemCount; index++) {
                var itemPrjCode = $('tbody').find("span[id^='prjCode']")[index].innerText;
                var itemPrjDID = $('tbody').find("span[id='prjDID']")[index].innerText;
                //MON
                var mon_hour = $('tbody').find("span[id='mon_hour']")[index].innerText;
                var mon_memo = $('tbody').find("span[id='mon_memo']")[index].innerText;
                var mon_hour_add = $('tbody').find("span[id='mon_hour_add']")[index].innerText;
                var mon_memo_add = $('tbody').find("span[id='mon_memo_add']")[index].innerText;
                //TUE
                var tue_hour = $('tbody').find("span[id='tue_hour']")[index].innerText;
                var tue_memo = $('tbody').find("span[id='tue_memo']")[index].innerText;
                var tue_hour_add = $('tbody').find("span[id='tue_hour_add']")[index].innerText;
                var tue_memo_add = $('tbody').find("span[id='tue_memo_add']")[index].innerText;
                //WES
                var wes_hour = $('tbody').find("span[id='wes_hour']")[index].innerText;
                var wes_memo = $('tbody').find("span[id='wes_memo']")[index].innerText;
                var wes_hour_add = $('tbody').find("span[id='wes_hour_add']")[index].innerText;
                var wes_memo_add = $('tbody').find("span[id='wes_memo_add']")[index].innerText;
                //THU
                var thu_hour = $('tbody').find("span[id='thu_hour']")[index].innerText;
                var thu_memo = $('tbody').find("span[id='thu_memo']")[index].innerText;
                var thu_hour_add = $('tbody').find("span[id='thu_hour_add']")[index].innerText;
                var thu_memo_add = $('tbody').find("span[id='thu_memo_add']")[index].innerText;
                //FRI
                var fri_hour = $('tbody').find("span[id='fri_hour']")[index].innerText;
                var fri_memo = $('tbody').find("span[id='fri_memo']")[index].innerText;
                var fri_hour_add = $('tbody').find("span[id='fri_hour_add']")[index].innerText;
                var fri_memo_add = $('tbody').find("span[id='fri_memo_add']")[index].innerText;
                //SAT
                var sat_hour = $('tbody').find("span[id='sat_hour']")[index].innerText;
                var sat_memo = $('tbody').find("span[id='sat_memo']")[index].innerText;
                var sat_hour_add = $('tbody').find("span[id='sat_hour_add']")[index].innerText;
                var sat_memo_add = $('tbody').find("span[id='sat_memo_add']")[index].innerText;
                //SUN
                var sun_hour = $('tbody').find("span[id='sun_hour']")[index].innerText;
                var sun_memo = $('tbody').find("span[id='sun_memo']")[index].innerText;
                var sun_hour_add = $('tbody').find("span[id='sun_hour_add']")[index].innerText;
                var sun_memo_add = $('tbody').find("span[id='sun_memo_add']")[index].innerText;

                var tableItem = {
                    creatorDID: cookies.get('userDID'),
                    prjDID: itemPrjDID,

                    //MON
                    mon_hour: mon_hour,
                    mon_memo: mon_memo,
                    mon_hour_add: mon_hour_add,
                    mon_memo_add: mon_memo_add,
                    //TUE
                    tue_hour: tue_hour,
                    tue_memo: tue_memo,
                    tue_hour_add: tue_hour_add,
                    tue_memo_add: tue_memo_add,
                    //WES
                    wes_hour: wes_hour,
                    wes_memo: wes_memo,
                    wes_hour_add: wes_hour_add,
                    wes_memo_add: wes_memo_add,
                    //THU
                    thu_hour: thu_hour,
                    thu_memo: thu_memo,
                    thu_hour_add: thu_hour_add,
                    thu_memo_add: thu_memo_add,
                    //FRI
                    fri_hour: fri_hour,
                    fri_memo: fri_memo,
                    fri_hour_add: fri_hour_add,
                    fri_memo_add: fri_memo_add,
                    //SAT
                    sat_hour: sat_hour,
                    sat_memo: sat_memo,
                    sat_hour_add: sat_hour_add,
                    sat_memo_add: sat_memo_add,
                    //SUN
                    sun_hour: sun_hour,
                    sun_memo: sun_memo,
                    sun_hour_add: sun_hour_add,
                    sun_memo_add: sun_memo_add,

                }

                workHourTableData.push(tableItem);
            }
            console.log(formDataTable);
            var formData = {
                creatorDID: cookies.get('userDID'),
                create_formDate: $scope.firstFullDate,
                formTables: workHourTableData,
                oldTables: formDataTable,
            }
            // console.log(workHourTableData);
            WorkHourForms.createWorkHourTableForm(formData)
                .success(function (res) {
                    // 更新old Table ID Array
                    var workTableIDArray = [];
                    if (res.payload.length > 0) {
                        for (var index = 0; index < res.payload.length; index++) {
                            console.log(res.payload[index]);
                            workTableIDArray[index] = res.payload[index].tableID;
                        }
                    }
                    formDataTable = {
                        tableIDArray: workTableIDArray,
                    };
                    console.log(formDataTable);
                })
                .error(function () {
                    console.log('ERROR WorkHourForms.createWorkHourTableForm');
                })
        }

    }
})();
