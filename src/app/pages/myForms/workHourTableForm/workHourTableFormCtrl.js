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
                '$timeout',
                '$uibModal',
                'ngDialog',
                'User',
                'Project',
                'ProjectUtil',
                'DateUtil',
                'WorkHourUtil',
                'editableOptions',
                'editableThemes',
                WorkHourTableCtrl
            ]);

    /** @ngInject */
    function WorkHourTableCtrl($scope,
                               $filter,
                               cookies,
                               $timeout,
                               $uibModal,
                               ngDialog,
                               User,
                               Project,
                               ProjectUtil,
                               DateUtil,
                               WorkHourUtil,
                               editableOptions,
                               editableThemes) {
        var vm = this;

        $scope.username = cookies.get('username');
        $scope.roleType = cookies.get('roletype');

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
                //MON
                mon_hour: 0,
                mon_hour_add: 0,
                //TUE
                tue_hour: 0,
                tue_hour_add: 0,
                //WES
                wes_hour: 0,
                wes_hour_add: 0,
                //THU
                thu_hour: 0,
                thu_hour_add: 0,
                //FRI
                fri_hour: 0,
                fri_hour_add: 0,
                //SAT
                sat_hour: 0,
                sat_hour_add: 0,
                //SUN
                sun_hour: 0,
                sun_hour_add: 0,
                //RIGHT
                isSendReview: false,
                isManagerCheck: false,
                isExecutiveCheck: false,
            };
            $scope.tablesItems.push(inserted);
            $timeout(function () {
                $('button[id="btnCreate"]')[0].click();
            }, 300);
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

        $scope.removeWorkItem = function (index) {
            // console.log(index)
            $scope.tablesItems.splice(index, 1);
            console.log('removeWorkItem, Index= ' + index);
            $timeout(function () {
                $('button[id="btnCreate"]')[0].click();
            }, 300);
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
            $scope.tablesItems = [];
            var getData = {
                creatorDID: cookies.get('userDID'),
                create_formDate: $scope.firstFullDate,
            }
            // console.log($scope.firstFullDate);
            WorkHourUtil.getWorkHourForm(getData)
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
                            })
                            .error(function () {
                                console.log('ERROR Project.findPrjByIDArray');
                            })

                        formDataTable = {
                            tableIDArray: workTableIDArray,
                            isFindSendReview: null,
                            isFindManagerCheck: null,
                            isFindExecutiveCheck: null
                        }
                        // console.log(formDataTable);
                        // 取得 Table Data
                        WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                            .success(function (res) {

                                $scope.monOffTotal = 0;
                                $scope.tueOffTotal = 0;
                                $scope.wesOffTotal = 0;
                                $scope.thuOffTotal = 0;
                                $scope.friOffTotal = 0;
                                $scope.satOffTotal = 0;
                                $scope.sunOffTotal = 0;
                                // 填入表單資訊
                                $scope.tableData = {};
                                for (var index = 0; index < res.payload.length; index++) {
                                    var detail = {
                                        tableID:res.payload[index]._id,
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
                                        //RIGHT
                                        isSendReview: res.payload[index].isSendReview,
                                        isManagerCheck: res.payload[index].isManagerCheck,
                                        isExecutiveCheck: res.payload[index].isExecutiveCheck,
                                        // TOTAL
                                        hourTotal: res.payload[index].mon_hour +
                                        res.payload[index].tue_hour +
                                        res.payload[index].wes_hour +
                                        res.payload[index].thu_hour +
                                        res.payload[index].fri_hour +
                                        res.payload[index].sat_hour +
                                        res.payload[index].sun_hour,
                                        hourAddTotal: res.payload[index].mon_hour_add +
                                        res.payload[index].tue_hour_add +
                                        res.payload[index].wes_hour_add +
                                        res.payload[index].thu_hour_add +
                                        res.payload[index].fri_hour_add +
                                        res.payload[index].sat_hour_add +
                                        res.payload[index].sun_hour_add,

                                    };
                                    $scope.tablesItems.push(detail);

                                    //Off Day

                                    $scope.monOffTotal += res.payload[index].mon_hour +
                                        res.payload[index].mon_hour_add;
                                    $scope.tueOffTotal += res.payload[index].tue_hour +
                                        res.payload[index].tue_hour_add;
                                    $scope.wesOffTotal += res.payload[index].wes_hour +
                                        res.payload[index].wes_hour_add;
                                    $scope.thuOffTotal += res.payload[index].thu_hour +
                                        res.payload[index].thu_hour_add;
                                    $scope.friOffTotal += res.payload[index].fri_hour +
                                        res.payload[index].fri_hour_add;
                                    $scope.satOffTotal += res.payload[index].sat_hour +
                                        res.payload[index].sat_hour_add;
                                    $scope.sunOffTotal += res.payload[index].sun_hour +
                                        res.payload[index].sun_hour_add;
                                }
                                // console.log($scope.tablesItems);
                            })
                            .error(function () {
                                console.log('ERROR WorkHourUtil.findWorkHourTableFormByTableIDArray');
                            })

                    } else {
                        $scope.loading = false;
                    }
                })
                .error(function () {
                    console.log('ERROR WorkHourUtil.getWorkHourForm');
                })
        }

        // -------------------------------------

        $scope.hourChange = function (obj) {

            var stringtable = [
                "table.mon_hour",
                "table.tue_hour",
                "table.wes_hour",
                "table.thu_hour",
                "table.fri_hour",
                "table.sat_hour",
                "table.sun_hour",
            ]
            var targetString = obj.$parent.$editable.name
            var result = 0;
            for (var index = 0; index < stringtable.length; index ++) {
                if (targetString === stringtable[index]) {
                    continue;
                }
                var oldValueString = 'obj.$parent.$parent.' + stringtable[index];
                result += eval(oldValueString);
            }
            var newValue = obj.$parent.$data;

            obj.$parent.$parent.table.hourTotal = newValue + result;

            var updateString = 'obj.$parent.$parent.' + targetString + " = " + newValue;
            eval(updateString);

        }

        $scope.hourAddChange = function (obj) {
            var stringtable = [
                "table.mon_hour_add",
                "table.tue_hour_add",
                "table.wes_hour_add",
                "table.thu_hour_add",
                "table.fri_hour_add",
                "table.sat_hour_add",
                "table.sun_hour_add",
            ]
            var targetString = obj.$parent.$editable.name
            var result = 0;
            for (var index = 0; index < stringtable.length; index ++) {
                if (targetString === stringtable[index]) {
                    continue;
                }
                var oldValueString = 'obj.$parent.$parent.' + stringtable[index];
                result += eval(oldValueString);
            }
            var newValue = obj.$parent.$data;

            obj.$parent.$parent.table.hourAddTotal = newValue + result;

            var updateString = 'obj.$parent.$parent.' + targetString + " = " + newValue;
            eval(updateString);
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

        $scope.showCalculateHour =function(tables, type) {
            var index = 0;
            var result = 0;
            switch (type) {
                case 1: {
                    for (index = 0; index < tables.length; index++) {
                        result += tables[index].mon_hour;
                        result += tables[index].mon_hour_add;
                    }
                } break;
                case 2: {
                    for (index = 0; index < tables.length; index++) {
                        result += tables[index].tue_hour;
                        result += tables[index].tue_hour_add;
                    }
                } break;
                case 3: {
                    for (index = 0; index < tables.length; index++) {
                        result += tables[index].wes_hour;
                        result += tables[index].wes_hour_add;
                    }
                } break;
                case 4: {
                    for (index = 0; index < tables.length; index++) {
                        result += tables[index].thu_hour;
                        result += tables[index].thu_hour_add;
                    }
                } break;
                case 5: {
                    for (index = 0; index < tables.length; index++) {
                        result += tables[index].fri_hour;
                        result += tables[index].fri_hour;
                    }
                } break;
                case 6: {
                    for (index = 0; index < tables.length; index++) {
                        result += tables[index].sat_hour;
                        result += tables[index].sat_hour_add;
                    }
                } break;
                case 7: {
                    for (index = 0; index < tables.length; index++) {
                        result += tables[index].sun_hour;
                        result += tables[index].sun_hour_add;
                    }
                } break;
            }
            return result;
        }

        // -------------------- Week Methods ---------------------
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
            $scope.getTable();
        }

        // Send table to Review
        $scope.review = function (table, button) {
            $scope.checkText = '確定提交 ' + $scope.showPrjName(table.prjDID) + "  審查？";
            $scope.checkingTable = table;
            $scope.checkingButton = button;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormReviewModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendTable = function (checkingTable, checkingButton) {
            console.log(checkingTable);
            checkingButton.rowform1.$waiting = true;
            var formData = {
                tableID: checkingTable.tableID,
            }
            WorkHourUtil.updateTableSendReview(formData)
                .success(function (res) {
                    console.log(res.code);
                })
        }

        // SHOW Work Add Form
        $scope.showModal = function (item) {
            $uibModal.open({
                animation: true,
                controller: 'ProfileModalCtrl',
                templateUrl: 'app/pages/profile/profileModal.html'
            }).result.then(function (link) {
                item.href = link;
            });
        };

        // ************************ CREATE SUBMIT ***************************
        $scope.createSubmit = function () {
            return $timeout(function () {

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
                        //RIGHT
                        isSendReview: $scope.tablesItems[index].isSendReview,
                        isManagerCheck: $scope.tablesItems[index].isManagerCheck,
                        isExecutiveCheck: $scope.tablesItems[index].isExecutiveCheck,

                    }

                    workHourTableData.push(tableItem);
                }
                // console.log(formDataTable);
                var formData = {
                    creatorDID: cookies.get('userDID'),
                    create_formDate: $scope.firstFullDate,
                    formTables: workHourTableData,
                    oldTables: formDataTable,
                }
                // console.log(workHourTableData);
                WorkHourUtil.createWorkHourTableForm(formData)
                    .success(function (res) {
                        // 更新old Table ID Array
                        var workTableIDArray = [];
                        if (res.payload.length > 0) {
                            for (var index = 0; index < res.payload.length; index++) {
                                // console.log(res.payload[index]);
                                workTableIDArray[index] = res.payload[index].tableID;
                                $scope.tablesItems[index].tableID = res.payload[index].tableID;
                            }
                        }
                        formDataTable = {
                            tableIDArray: workTableIDArray,
                        };
                        // console.log(formDataTable);
                        // console.log($scope.tablesItems);
                    })
                    .error(function () {
                        console.log('ERROR WorkHourUtil.createWorkHourTableForm');
                    })
            }, 3000);
        }

        // ********************** 專案經理確認 *****************************

        // ********************** 行政確認 *****************************

        // 主要顯示
        $scope.tablesExecutiveItems = [];

        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
                vm.executiveUsers = allUsers;
                if ($scope.roleType === '100') {
                    // vm.executiveUsers = [];
                    // WorkOffFormUtil.fetchAllExecutiveItem()
                    //     .success(function (res) {
                    //         for (var outIndex = 0; outIndex < res.payload.length; outIndex++) {
                    //             // console.log(res.payload[outIndex]);
                    //             for (var index = 0; index < allUsers.length; index++) {
                    //                 if (res.payload[outIndex]._id === allUsers[index]._id) {
                    //                     allUsers[index].excutive_count = res.payload[outIndex].count;
                    //                     vm.executiveUsers.push(allUsers[index]);
                    //                 }
                    //             }
                    //         }
                    //     })
                }
            });

        // -------------------- Week Methods Excutive---------------------
        $scope.weekShift_executive = 0;
        $scope.firstFullDate_executive = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);
        $scope.firstDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
        $scope.lastDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 6));

        $scope.monDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 0));
        $scope.tueDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 1));
        $scope.wesDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 2));
        $scope.thuDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 3));
        $scope.friDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 4));
        $scope.satDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 5));
        $scope.sunDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 6));


        $scope.addWeek_executive = function () {
            $scope.weekShift_executive++;
            $scope.firstFullDate_executive = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_executive));
            $scope.firstDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_executive)));
            $scope.lastDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 6));

            $scope.monDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 0));
            $scope.tueDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 1));
            $scope.wesDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 2));
            $scope.thuDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 3));
            $scope.friDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 4));
            $scope.satDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 5));
            $scope.sunDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 6));
            $scope.getTable_executive();
        }

        $scope.decreaceWeek_executive = function () {
            $scope.weekShift_executive--;
            $scope.firstFullDate_executive = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_executive));
            $scope.firstDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_executive)));
            $scope.lastDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 6));

            $scope.monDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 0));
            $scope.tueDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 1));
            $scope.wesDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 2));
            $scope.thuDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 3));
            $scope.friDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 4));
            $scope.satDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 5));
            $scope.sunDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate($scope.firstDate_executive, 6));
            $scope.getTable_executive();
        }

        //行政取得相關人員表，以人為選取單位
        $scope.getTable_executive = function () {
            $scope.tablesExecutiveItems = [];
            var getData = {
                creatorDID: vm.executive.selected._id,
                create_formDate: $scope.firstFullDate_executive,
            }
            // console.log($scope.firstFullDate);
            WorkHourUtil.getWorkHourForm(getData)
                .success(function (res) {
                    // console.log(res.payload)
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
                            })
                            .error(function () {
                                console.log('ERROR Project.findPrjByIDArray');
                            })

                        formDataTable = {
                            tableIDArray: workTableIDArray,
                            isFindSendReview: true,
                            isFindManagerCheck: null,
                            isFindExecutiveCheck: false
                        }
                        // console.log(formDataTable);
                        // 取得 Table Data
                        WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                            .success(function (res) {

                                $scope.monOffTotal_executive = 0;
                                $scope.tueOffTotal_executive = 0;
                                $scope.wesOffTotal_executive = 0;
                                $scope.thuOffTotal_executive = 0;
                                $scope.friOffTotal_executive = 0;
                                $scope.satOffTotal_executive = 0;
                                $scope.sunOffTotal_executive = 0;
                                // 填入表單資訊
                                // console.log(res.payload)
                                for (var index = 0; index < res.payload.length; index++) {
                                    var detail = {
                                        tableID: res.payload[index]._id,
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
                                        //RIGHT
                                        isSendReview: res.payload[index].isSendReview,
                                        isManagerCheck: res.payload[index].isManagerCheck,
                                        isExecutiveCheck: res.payload[index].isExecutiveCheck,
                                        // TOTAL
                                        hourTotal: res.payload[index].mon_hour +
                                        res.payload[index].tue_hour +
                                        res.payload[index].wes_hour +
                                        res.payload[index].thu_hour +
                                        res.payload[index].fri_hour +
                                        res.payload[index].sat_hour +
                                        res.payload[index].sun_hour,
                                        hourAddTotal: res.payload[index].mon_hour_add +
                                        res.payload[index].tue_hour_add +
                                        res.payload[index].wes_hour_add +
                                        res.payload[index].thu_hour_add +
                                        res.payload[index].fri_hour_add +
                                        res.payload[index].sat_hour_add +
                                        res.payload[index].sun_hour_add,

                                    };
                                    $scope.tablesExecutiveItems.push(detail);

                                    //Off Day

                                    $scope.monOffTotal_executive += res.payload[index].mon_hour +
                                        res.payload[index].mon_hour_add;
                                    $scope.tueOffTotal_executive += res.payload[index].tue_hour +
                                        res.payload[index].tue_hour_add;
                                    $scope.wesOffTotal_executive += res.payload[index].wes_hour +
                                        res.payload[index].wes_hour_add;
                                    $scope.thuOffTotal_executive += res.payload[index].thu_hour +
                                        res.payload[index].thu_hour_add;
                                    $scope.friOffTotal_executive += res.payload[index].fri_hour +
                                        res.payload[index].fri_hour_add;
                                    $scope.satOffTotal_executive += res.payload[index].sat_hour +
                                        res.payload[index].sat_hour_add;
                                    $scope.sunOffTotal_executive += res.payload[index].sun_hour +
                                        res.payload[index].sun_hour_add;
                                }
                                // console.log($scope.tablesItems);
                            })
                            .error(function () {
                                console.log('ERROR WorkHourUtil.findWorkHourTableFormByTableIDArray');
                            })

                    } else {
                        $scope.loading = false;
                    }
                })
                .error(function () {
                    console.log('ERROR WorkHourUtil.getWorkHourForm');
                })
        }

        //行政確認
        $scope.reviewWHExecutiveItem = function (table, index) {
            $scope.checkText = '確定 同意：' + vm.executive.selected.name + " " +
                $scope.showPrjName(table.prjDID) +
                "  ？";
            $scope.checkingTable = table;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormAgree_ExecutiveModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendWHExecutiveAgree = function (checkingTable, index) {
            $scope.tablesExecutiveItems.splice(index, 1);
            var formData = {
                tableID: checkingTable.tableID,
                isSendReview: null,
                isManagerCheck: null,
                isExecutiveCheck: true,
            }
            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    console.log(res.code);
                })
        }

        //行政退回
        $scope.disagreeWHItem_executive = function (table, index) {
            $scope.checkText = '確定 退回：' + vm.executive.selected.name + " " +
                $scope.showPrjName(table.prjDID) +
                "  ？";
            $scope.checkingTable = table;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormDisAgree_ExecutiveModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendWHDisagree_executive = function (checkingTable, index) {
            $scope.tablesExecutiveItems.splice(index, 1);
            var formData = {
                tableID: checkingTable.tableID,
                isSendReview: false,
                isManagerCheck: false,
                isExecutiveCheck: false,
            }
            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    console.log(res.code);
                })
        }


    } // function End line
})();
