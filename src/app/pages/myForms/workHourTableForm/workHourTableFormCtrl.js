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
                'toastr',
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
                'WorkHourAddItemUtil',
                'WorkOffFormUtil',
                'NationalHolidayUtil',
                'WorkAddConfirmFormUtil',
                'editableOptions',
                'editableThemes',
                WorkHourTableCtrl
            ]);

    /** @ngInject */
    function WorkHourTableCtrl($scope,
                               toastr,
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
                               WorkHourAddItemUtil,
                               WorkOffFormUtil,
                               NationalHolidayUtil,
                               WorkAddConfirmFormUtil,
                               editableOptions,
                               editableThemes) {
        var vm = this;
        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;
        $scope.month = thisMonth;

        $scope.username = cookies.get('username');
        $scope.roleType = cookies.get('roletype');

        var formData = {
            userDID: cookies.get('userDID'),
        }
        User.findUserByUserDID(formData)
            .success(function (user) {
                // $scope.userHourSalary = user.userHourSalary;
                $scope.userMonthSalary = user.userMonthSalary;
            })

        // 所有與使用者關聯之專案。
        var allRelatedPrjDatas;

        // 主要顯示
        $scope.tablesItems = [];
        // 休假列表
        $scope.workOffTablesItems = [];
        // 國定假日
        $scope.workNHTablesItems = [];

        // 找跟User有關係的 Project
        var formData = {
            relatedID: cookies.get('userDID'),
        }
        Project.getProjectRelated(formData)
            .success(function (relatedProjects) {
                allRelatedPrjDatas = relatedProjects;
                vm.relatedProjects = relatedProjects;
            });

        //所有專案，資料比對用
        Project.findAll()
            .success(function (allProjects) {
                $scope.allProjectData = [];
                var prjCount = allProjects.length;
                for (var index = 0; index < prjCount; index++) {
                    $scope.allProjectData[index] = {
                        prjDID: allProjects[index]._id,
                        prjCode: allProjects[index].prjCode,
                        mainName: allProjects[index].mainName + " - "
                        + allProjects[index].prjName + " - "
                        + allProjects[index].prjSubName + " - "
                        + ProjectUtil.getTypeText(allProjects[index].type),
                        majorID: allProjects[index].majorID,
                        managerID: allProjects[index].managerID,
                    };
                }
            })

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
                vm.managerUsers = allUsers;
                vm.executiveUsers = allUsers;
                vm.historyUsers = allUsers;

                $scope.projectManagers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allUsers[i]._id,
                        name: allUsers[i].name
                    };
                }

            });
        // ＊＊＊＊＊＊＊ Manipulate ＊＊＊＊＊＊＊
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
            $scope.createSubmit(500, true);
        }

        // 暫存表單
        $scope.saveTemp = function () {
            $scope.createSubmit(500, false);
        }

        // Remove Work Hour Check
        $scope.deleteCheck = function (table, index) {
            $scope.checkText = '確定移除 ' + $scope.showPrjName(table.prjDID) + "  ？";
            $scope.checkingTable = table;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormDeleteModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.removeWorkItem = function (table, index) {
            // console.log(index)
            $scope.tablesItems.splice(index, 1);

            var formData = {
                creatorDID: cookies.get('userDID'),
                prjDID: table.prjDID,
                create_formDate: table.create_formDate,
            }

            WorkHourAddItemUtil.removeRelatedAddItemByProject(formData)
                .success(function (res) {
                    $scope.createSubmit(500, true);
                })
                .error(function () {
                    console.log("ERROR WorkHourAddItemUtil.removeRelatedAddItemByProject");
                })
        };

        editableOptions.theme = 'bs3';
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        // ＊＊＊＊＊＊＊ Sum Field ＊＊＊＊＊＊＊
        $scope.monOffTotal = 0;
        $scope.tueOffTotal = 0;
        $scope.wesOffTotal = 0;
        $scope.thuOffTotal = 0;
        $scope.friOffTotal = 0;
        $scope.satOffTotal = 0;
        $scope.sunOffTotal = 0;

        $scope.monOffTotal_executive = 0;
        $scope.tueOffTotal_executive = 0;
        $scope.wesOffTotal_executive = 0;
        $scope.thuOffTotal_executive = 0;
        $scope.friOffTotal_executive = 0;
        $scope.satOffTotal_executive = 0;
        $scope.sunOffTotal_executive = 0;

        $scope.monOffTotal_manager = 0;
        $scope.tueOffTotal_manager = 0;
        $scope.wesOffTotal_manager = 0;
        $scope.thuOffTotal_manager = 0;
        $scope.friOffTotal_manager = 0;
        $scope.satOffTotal_manager = 0;
        $scope.sunOffTotal_manager = 0;

        $scope.tueOffTotal_history = 0;
        $scope.wesOffTotal_history = 0;
        $scope.thuOffTotal_history = 0;
        $scope.friOffTotal_history = 0;
        $scope.satOffTotal_history = 0;
        $scope.sunOffTotal_history = 0;

        // ＊＊＊＊＊＊＊ National Holiday ＊＊＊＊＊＊＊
        $scope.monNH = 0;
        $scope.tueNH = 0;
        $scope.wesNH = 0;
        $scope.thuNH = 0;
        $scope.friNH = 0;
        $scope.satNH = 0;
        $scope.sunNH = 0;

        $scope.monNH_executive = 0;
        $scope.tueNH_executive = 0;
        $scope.wesNH_executive = 0;
        $scope.thuNH_executive = 0;
        $scope.friNH_executive = 0;
        $scope.satNH_executive = 0;
        $scope.sunNH_executive = 0;

        $scope.monNH_manager = 0;
        $scope.tueNH_manager = 0;
        $scope.wesNH_manager = 0;
        $scope.thuNH_manager = 0;
        $scope.friNH_manager = 0;
        $scope.satNH_manager = 0;
        $scope.sunNH_manager = 0;

        $scope.monNH_history = 0;
        $scope.tueNH_history = 0;
        $scope.wesNH_history = 0;
        $scope.thuNH_history = 0;
        $scope.friNH_history = 0;
        $scope.satNH_history = 0;
        $scope.sunNH_history = 0;

        function initialUserTable(type) {
            /**
             *  type
             *  1: user
             *
             *  ===== 2,3 Deprecated =====
             *  2: manager
             *  3: executive
             *
             *  4: history
             */
            var stringTable = [
                "$scope.monNH",
                "$scope.tueNH",
                "$scope.wesNH",
                "$scope.thuNH",
                "$scope.friNH",
                "$scope.satNH",
                "$scope.sunNH",

                "$scope.monOffTotal",
                "$scope.tueOffTotal",
                "$scope.wesOffTotal",
                "$scope.thuOffTotal",
                "$scope.friOffTotal",
                "$scope.satOffTotal",
                "$scope.sunOffTotal",
            ]
            switch (type) {
                case 1:
                    $scope.tablesItems = [];
                    for (var index = 0; index < stringTable.length; index++) {
                        eval(stringTable[index] + " = 0");
                    }
                    break;
                // case 2:
                //     $scope.tablesManagerItems = [];
                //     for (var index = 0; index < stringTable.length; index++) {
                //         eval(stringTable[index] + "_manager = 0");
                //     }
                //     break;
                // case 3:
                //     $scope.tablesExecutiveItems = [];
                //     for (var index = 0; index < stringTable.length; index++) {
                //         eval(stringTable[index] + "_executive = 0");
                //     }
                //     break;
                case 4:
                    $scope.tablesHistoryItems = [];
                    for (var index = 0; index < stringTable.length; index++) {
                        eval(stringTable[index] + "_history = 0");
                    }
                    break;
            }
        }

        var formDataTable = {};

        $scope.loading = true;

        //取得使用者個人工時表，userDID, 當周第一天日期，一個人只有一張工時表
        $scope.getTable = function () {
            initialUserTable(1);
            var getData = {
                creatorDID: cookies.get('userDID'),
                create_formDate: $scope.firstFullDate,
            }
            if (allRelatedPrjDatas !== undefined) {
                vm.relatedProjects = allRelatedPrjDatas.slice();
            }
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
                                vm.relatedProjects = [];
                                for (var outIndex = 0; outIndex < allRelatedPrjDatas.length; outIndex++) {
                                    var isExist = true;
                                    for (var index = 0; index < res.payload.length; index++) {
                                        if (allRelatedPrjDatas[outIndex]._id === res.payload[index]._id) {
                                            isExist = false;
                                        }
                                    }
                                    if (isExist) {
                                        vm.relatedProjects.push(allRelatedPrjDatas[outIndex]);
                                    }
                                }
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
                                // 填入表單資訊
                                $scope.tableData = {};
                                for (var index = 0; index < res.payload.length; index++) {
                                    var detail = {
                                        tableID: res.payload[index]._id,
                                        prjDID: res.payload[index].prjDID,
                                        creatorDID: res.payload[index].creatorDID,
                                        create_formDate: res.payload[index].create_formDate,
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

                                        // Reject
                                        isManagerReject: res.payload[index].isManagerReject,
                                        managerReject_memo: res.payload[index].managerReject_memo,

                                        isExecutiveReject: res.payload[index].isExecutiveReject,
                                        executiveReject_memo: res.payload[index].executiveReject_memo,

                                        // TOTAL
                                        hourTotal: parseInt(res.payload[index].mon_hour, 10) +
                                        parseInt(res.payload[index].tue_hour, 10) +
                                        parseInt(res.payload[index].wes_hour, 10) +
                                        parseInt(res.payload[index].thu_hour, 10) +
                                        parseInt(res.payload[index].fri_hour, 10) +
                                        parseInt(res.payload[index].sat_hour, 10) +
                                        parseInt(res.payload[index].sun_hour, 10),
                                        hourAddTotal: res.payload[index].mon_hour_add +
                                        res.payload[index].tue_hour_add +
                                        res.payload[index].wes_hour_add +
                                        res.payload[index].thu_hour_add +
                                        res.payload[index].fri_hour_add +
                                        res.payload[index].sat_hour_add +
                                        res.payload[index].sun_hour_add,
                                    };
                                    $scope.tablesItems.push(detail);
                                }
                                loadWorkOffTable(cookies.get('userDID'), 1);
                                loadNH(1);
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
        //Dynamic change
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
            var targetString = obj.$parent.$editable.name;
            var result = 0;
            // 加總非編輯欄位
            for (var index = 0; index < stringtable.length; index++) {
                if (targetString === stringtable[index]) {
                    continue;
                }
                var oldValueString = 'parseInt(obj.$parent.$parent.' + stringtable[index] + ', 10)';
                result += eval(oldValueString);
            }
            var newValue = parseInt(obj.$parent.$data, 10);

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
            for (var index = 0; index < stringtable.length; index++) {
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
                selected = $filter('filter')($scope.allProjectData, {
                    prjDID: prjDID,
                });
            }
            return selected.length ? selected[0].mainName : 'Not Set';
        };

        $scope.showPrjCode = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectData, {
                    prjDID: prjDID,
                });
            }
            return selected.length ? selected[0].prjCode : 'Not Set';
        };

        $scope.showProjectManager = function (prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.allProjectData, {
                    prjDID: prjDID
                });
            }
            var managerDID = majorSelected[0].managerID;
            var selected = [];
            if (managerDID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: managerDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        // 對應經理
        $scope.isFitManager = function(prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.allProjectData, {
                    prjDID: prjDID
                });
            }
            var managerDID = majorSelected[0].managerID;
            return managerDID === cookies.get('userDID');
        }

        //讀取國定假日
        function loadNH(type) {
            $scope.nationalHolidayTables = [];
            var fetchNationalHolidayData = {}
            switch (type) {
                case 1: {
                    fetchNationalHolidayData = {
                        create_formDate: $scope.firstFullDate,
                        year: thisYear,
                    }
                } break;
                case 4: {
                    fetchNationalHolidayData = {
                        create_formDate: $scope.firstFullDate_history,
                        year: thisYear,
                    }
                } break;
            }

            NationalHolidayUtil.fetchAllNationalHolidaysWithParameter(fetchNationalHolidayData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        // 填入表單資訊
                        for (var index = 0; index < res.payload.length; index++) {
                            var detail = {
                                tableID: res.payload[index]._id,

                                create_formDate: res.payload[index].create_formDate,
                                year: res.payload[index].year,
                                month: res.payload[index].month,
                                day: res.payload[index].day,
                                isEnable: res.payload[index].isEnable,
                            };
                            $scope.nationalHolidayTables.push(detail);
                        }

                        for (var index = 0; index < $scope.nationalHolidayTables.length; index++) {
                            if (!$scope.nationalHolidayTables[index].isEnable) continue;
                            switch ($scope.nationalHolidayTables[index].day) {
                                case 1:
                                    var evalString = "$scope.monNH" + (type === 1 ? "" : "_history");
                                    eval(evalString + " += 8");
                                    break;
                                case 2:
                                    var evalString = "$scope.tueNH" + (type === 1 ? "" : "_history");
                                    eval(evalString + " += 8");
                                    break;
                                case 3:
                                    var evalString = "$scope.wesNH" + (type === 1 ? "" : "_history");
                                    eval(evalString + " += 8");
                                    break;
                                case 4:
                                    var evalString = "$scope.thuNH" + (type === 1 ? "" : "_history");
                                    eval(evalString + " += 8");
                                    break;
                                case 5:
                                    var evalString = "$scope.friNH" + (type === 1 ? "" : "_history");
                                    eval(evalString + " += 8");
                                    break;
                                case 6:
                                    var evalString = "$scope.satNH" + (type === 1 ? "" : "_history");
                                    eval(evalString + " += 8");
                                    break;
                                case 0:
                                    var evalString = "$scope.sunNH" + (type === 1 ? "" : "_history");
                                    eval(evalString + " += 8");
                                    break;
                            }
                        }
                    } else {
                        // res.payload.length == 0
                    }
                })
        }

        // 取得休假單
        function loadWorkOffTable(userDID, type) {
            $scope.loginUserWorkOffTables = [];
            var getData = {
                creatorDID: userDID,
                year: thisYear,
                month: thisMonth,
            }
            WorkOffFormUtil.fetchUserWorkOffForm(getData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        var workItemCount = res.payload[0].formTables.length;

                        var workOffTableIDArray = [];
                        // 組成 TableID Array，再去Server要資料
                        for (var index = 0; index < workItemCount; index++) {
                            workOffTableIDArray[index] = res.payload[0].formTables[index].tableID;
                        }

                        var workOffFormDataTable = {};
                        switch (type) {
                            case 1: {
                                workOffFormDataTable = {
                                    tableIDArray: workOffTableIDArray,
                                    create_formDate: $scope.firstFullDate,
                                }
                            } break;
                            case 4: {
                                workOffFormDataTable = {
                                    tableIDArray: workOffTableIDArray,
                                    create_formDate: $scope.firstFullDate_history,
                                }
                            } break;
                        }
                        // 取得 Table Data
                        WorkOffFormUtil.findWorkOffTableFormByTableIDArrayAndParameters(workOffFormDataTable)
                            .success(function (res) {
                                // 填入表單資訊
                                $scope.tableData = {};
                                for (var index = 0; index < res.payload.length; index++) {
                                    var detail = {
                                        tableID: res.payload[index]._id,

                                        workOffType: res.payload[index].workOffType,
                                        create_formDate: res.payload[index].create_formDate,
                                        year: res.payload[index].year,
                                        month: res.payload[index].month,
                                        day: res.payload[index].day,
                                        start_time: res.payload[index].start_time,
                                        end_time: res.payload[index].end_time,

                                        //RIGHT
                                        isSendReview: res.payload[index].isSendReview,
                                        isBossCheck: res.payload[index].isBossCheck,
                                        isExecutiveCheck: res.payload[index].isExecutiveCheck,

                                        // Reject
                                        isBossReject: res.payload[index].isBossReject,
                                        bossReject_memo: res.payload[index].bossReject_memo,

                                        isExecutiveReject: res.payload[index].isExecutiveReject,
                                        executiveReject_memo: res.payload[index].executiveReject_memo,

                                        // userHourSalary: res.payload[index].userHourSalary,
                                        userMonthSalary: res.payload[index].userMonthSalary,
                                    };
                                    $scope.loginUserWorkOffTables.push(detail);

                                }

                                for (var index = 0; index < $scope.loginUserWorkOffTables.length; index++) {
                                    if (!$scope.loginUserWorkOffTables[index].isBossCheck || !$scope.loginUserWorkOffTables[index].isExecutiveCheck) continue;
                                    var evalFooter = "getHourDiff($scope.loginUserWorkOffTables[index].start_time, $scope.loginUserWorkOffTables[index].end_time)";
                                    switch ($scope.loginUserWorkOffTables[index].day) {
                                        case 1:
                                            var evalString = "$scope.monOffTotal" + (type === 1 ? "" : type === 2 ? "_manager" : type === 3 ? "_executive" : "_history");
                                            eval(evalString + " += " + evalFooter);
                                            break;
                                        case 2:
                                            var evalString = "$scope.tueOffTotal" + (type === 1 ? "" : type === 2 ? "_manager" : type === 3 ? "_executive" : "_history");
                                            eval(evalString + " += " + evalFooter);
                                            break;
                                        case 3:
                                            var evalString = "$scope.wesOffTotal" + (type === 1 ? "" : type === 2 ? "_manager" : type === 3 ? "_executive" : "_history");
                                            eval(evalString + " += " + evalFooter);
                                            break;
                                        case 4:
                                            var evalString = "$scope.thuOffTotal" + (type === 1 ? "" : type === 2 ? "_manager" : type === 3 ? "_executive" : "_history");
                                            eval(evalString + " += " + evalFooter);
                                            break;
                                        case 5:
                                            var evalString = "$scope.friOffTotal" + (type === 1 ? "" : type === 2 ? "_manager" : type === 3 ? "_executive" : "_history");
                                            eval(evalString + " += " + evalFooter);
                                            break;
                                        case 6:
                                            var evalString = "$scope.satOffTotal" + (type === 1 ? "" : type === 2 ? "_manager" : type === 3 ? "_executive" : "_history");
                                            eval(evalString + " += " + evalFooter);
                                            break;
                                        case 0:
                                            var evalString = "$scope.sunOffTotal" + (type === 1 ? "" : type === 2 ? "_manager" : type === 3 ? "_executive" : "_history");
                                            eval(evalString + " += " + evalFooter);
                                            break;
                                    }
                                }
                            })
                            .error(function () {
                                console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByTableIDArrayAndParameters');
                            })
                    } else {
                        // res.payload.length == 0
                    }
                })
                .error(function () {
                    console.log('ERROR WorkOffFormUtil.fetchUserWorkOffForm');
                })
        }

        // 計算小計
        $scope.showCalculateHour = function (tables, day, type, form) {
            var index = 0;
            var result = 0;

            switch (type) {
                case 1:
                case 4: {
                    switch (day) {
                        case 1: {
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].mon_hour;
                            }
                            var evalString = "$scope.monNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.monOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                        } break;
                        case 2: {
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].tue_hour;
                            }
                            var evalString = "$scope.tueNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.tueOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                        } break;
                        case 3: {
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].wes_hour;
                            }
                            var evalString = "$scope.wesNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.wesOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                        } break;
                        case 4: {
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].thu_hour;
                            }
                            var evalString = "$scope.thuNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.thuOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                        } break;
                        case 5: {
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].fri_hour;
                            }
                            var evalString = "$scope.friNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.friOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                        } break;
                        case 6: {
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].sat_hour;
                            }
                            var evalString = "$scope.satNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.satOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                        } break;
                        case 7: {
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].sun_hour;
                            }
                            var evalString = "$scope.sunNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.sunOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                        } break;
                        case 1001: {
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].mon_hour;
                                result += tables[index].tue_hour;
                                result += tables[index].wes_hour;
                                result += tables[index].thu_hour;
                                result += tables[index].fri_hour;
                                result += tables[index].sat_hour;
                                result += tables[index].sun_hour;
                            }
                            var evalString = "$scope.monNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.tueNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.wesNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.thuNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.friNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.satNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.sunNH" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);


                            var evalString = "$scope.monOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.tueOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.wesOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.thuOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.friOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.satOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            var evalString = "$scope.sunOffTotal" + (type === 1 ? "" : "_history");
                            eval("result += " + evalString);
                            return result;
                        }
                        case 2001: {
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].mon_hour_add;
                                result += tables[index].tue_hour_add;
                                result += tables[index].wes_hour_add;
                                result += tables[index].thu_hour_add;
                                result += tables[index].fri_hour_add;
                                result += tables[index].sat_hour_add;
                                result += tables[index].sun_hour_add;
                            }
                            return result;
                        }
                    }
                } break;
                case 2:
                case 3: {
                    switch (day) {
                        case 1: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(form).length; index++) {
                                result += $scope.fetchFormDataFromScope(form)[index].mon_hour;
                            }
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 1);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 1);

                        } break;
                        case 2: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(form).length; index++) {
                                result += $scope.fetchFormDataFromScope(form)[index].tue_hour;
                            }
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 2);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 2);

                        } break;
                        case 3: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(form).length; index++) {
                                result += $scope.fetchFormDataFromScope(form)[index].wes_hour;
                            }
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 3);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 3);

                        } break;
                        case 4: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(form).length; index++) {
                                result += $scope.fetchFormDataFromScope(form)[index].thu_hour;
                            }
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 4);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 4);

                        } break;
                        case 5: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(form).length; index++) {
                                result += $scope.fetchFormDataFromScope(form)[index].fri_hour;
                            }
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 5);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 5);

                        } break;
                        case 6: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(form).length; index++) {
                                result += $scope.fetchFormDataFromScope(form)[index].sat_hour;
                            }
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 6);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 6);

                        } break;
                        case 7: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(form).length; index++) {
                                result += $scope.fetchFormDataFromScope(form)[index].sun_hour;
                            }
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 0);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 0);

                        } break;
                        case 1001: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(form).length; index++) {
                                result += $scope.fetchFormDataFromScope(form)[index].mon_hour;
                                result += $scope.fetchFormDataFromScope(form)[index].tue_hour;
                                result += $scope.fetchFormDataFromScope(form)[index].wes_hour;
                                result += $scope.fetchFormDataFromScope(form)[index].thu_hour;
                                result += $scope.fetchFormDataFromScope(form)[index].fri_hour;
                                result += $scope.fetchFormDataFromScope(form)[index].sat_hour;
                                result += $scope.fetchFormDataFromScope(form)[index].sun_hour;
                            }

                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 1);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 2);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 3);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 4);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 5);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 6);
                            result += $scope.showNHCalculateHour($scope.fetchNHTableFormDataFromScope(form), 0);

                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 1);
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 2);
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 3);
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 4);
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 5);
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 6);
                            result += $scope.showWorkOffCalculateHour($scope.fetchWorkOffTableFormDataFromScope(form), 0);
                            return result;
                        }
                        case 2001: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(form).length; index++) {
                                result += $scope.fetchFormDataFromScope(form)[index].mon_hour_add;
                                result += $scope.fetchFormDataFromScope(form)[index].tue_hour_add;
                                result += $scope.fetchFormDataFromScope(form)[index].wes_hour_add;
                                result += $scope.fetchFormDataFromScope(form)[index].thu_hour_add;
                                result += $scope.fetchFormDataFromScope(form)[index].fri_hour_add;
                                result += $scope.fetchFormDataFromScope(form)[index].sat_hour_add;
                                result += $scope.fetchFormDataFromScope(form)[index].sun_hour_add;
                            }
                            return result;
                        }
                    }
                } break;
            }

            if (result > 8) {
                return result + " *";
            } else {
                return result;
            }
        }

        // -------------------- Week Methods ---------------------
        $scope.weekShift = 0;
        $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);
        $scope.firstDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
        $scope.lastDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 6));
        $scope.monDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 0));
        $scope.tueDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 1));
        $scope.wesDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 2));
        $scope.thuDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 3));
        $scope.friDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 4));
        $scope.satDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 5));
        $scope.sunDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 6));

        $scope.addWeek = function () {
            $scope.weekShift++;
            $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift));
            $scope.firstDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift)));
            $scope.lastDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 6));

            $scope.monDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 0));
            $scope.tueDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 1));
            $scope.wesDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 2));
            $scope.thuDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 3));
            $scope.friDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 4));
            $scope.satDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 5));
            $scope.sunDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 6));
            $scope.getTable();
        }

        $scope.decreaseWeek = function () {
            $scope.weekShift--;
            $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift));
            $scope.firstDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift)));
            $scope.lastDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 6));

            $scope.monDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 0));
            $scope.tueDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 1));
            $scope.wesDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 2));
            $scope.thuDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 3));
            $scope.friDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 4));
            $scope.satDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 5));
            $scope.sunDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 6));
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
            checkingButton.rowform1.$waiting = true;
            var formData = {
                tableID: checkingTable.tableID,
            }
            WorkHourUtil.updateTableSendReview(formData)
                .success(function (res) {
                })
        }

        $scope.showWorkAddCheck = function (hours, table, type) {
            if (hours === 0) {
                // console.log(0);
            } else {
                if (!this.rowform1.$visible) {
                    $scope.showWorkAddModal(table, type, false);
                }
            }
        }

        // SHOW Work Add Form
        $scope.showWorkAddModal = function (table, type, editable) {
            $uibModal.open({
                animation: true,
                controller: 'MyWorkHourTable_AddHourModalCtrl',
                templateUrl: 'app/pages/myModalTemplate/myWorkHourTable_AddHourModal.html',
                resolve: {
                    table: function () {
                        return table;
                    },
                    parent: function () {
                        return $scope;
                    },
                    searchType: function () {
                        return type;
                    },
                    // userHourSalary: function () {
                    //     return $scope.userHourSalary;
                    // },
                    userMonthSalary: function () {
                        return $scope.userMonthSalary;
                    },
                    editableFlag: function () {
                        return editable;
                    },
                }
            }).result.then(function (data) {
                var formData = {
                    formTables: data.formTables,
                    oldTables: data.oldTables,
                }
                WorkHourAddItemUtil.createWorkHourAddItem(formData)
                    .success(function (res) {
                        switch (type) {
                            case 1 : {
                                table.mon_hour_add = table.totalHourTemp;
                            }
                                break;
                            case 2 : {
                                table.tue_hour_add = table.totalHourTemp;
                            }
                                break;
                            case 3 : {
                                table.wes_hour_add = table.totalHourTemp;
                            }
                                break;
                            case 4 : {
                                table.thu_hour_add = table.totalHourTemp;
                            }
                                break;
                            case 5 : {
                                table.fri_hour_add = table.totalHourTemp;
                            }
                                break;
                            case 6 : {
                                table.sat_hour_add = table.totalHourTemp;
                            }
                                break;
                            case 7 : {
                                table.sun_hour_add = table.totalHourTemp;
                            }
                                break;
                        }
                        table.hourAddTotal = table.mon_hour_add +
                            table.tue_hour_add +
                            table.wes_hour_add +
                            table.thu_hour_add +
                            table.fri_hour_add +
                            table.sat_hour_add +
                            table.sun_hour_add;
                        $scope.createSubmit(500, false);
                    })
                    .error(function () {
                        console.log('ERROR WorkHourAddItemUtil.createWorkHourAddItem')
                    })
            });
        };

        // ************************ CREATE SUBMIT ***************************
        $scope.createSubmit = function (time, isRefreshProjectSelector) {
            return $timeout(function () {

                var workItemCount = $('tbody[id="majorBody"]').length;
                var workHourTableData = [];

                if (workItemCount === 0) {
                    if (isRefreshProjectSelector) {
                        $timeout(function () {
                            $scope.getTable();
                        }, 300)
                    }
                }

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

                        // Reject
                        isManagerReject: $scope.tablesItems[index].isManagerReject,
                        managerReject_memo: $scope.tablesItems[index].managerReject_memo,

                        isExecutiveReject: $scope.tablesItems[index].isExecutiveReject,
                        executiveReject_memo: $scope.tablesItems[index].executiveReject_memo,
                    }
                    workHourTableData.push(tableItem);
                }
                var formData = {
                    creatorDID: cookies.get('userDID'),
                    create_formDate: $scope.firstFullDate,
                    formTables: workHourTableData,
                    oldTables: formDataTable,
                }
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
                        if (isRefreshProjectSelector) {
                            $scope.getTable();
                        }
                    })
                    .error(function () {
                        console.log('ERROR WorkHourUtil.createWorkHourTableForm');
                    })
            }, time);
        }

        // ************************ REVIEW SUBMIT ***************************
        $scope.reviewFormCheck = function() {
            // console.log($scope.tablesItems);
            $scope.checkText = '確定提交 審查？';
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormReviewModalTotal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.reviewForm = function() {
            $timeout(function () {
                var tableList = [];
                for (var index = 0; index < $scope.tablesItems.length; index ++) {
                    tableList[index] = $scope.tablesItems[index].tableID;
                }
                var formData = {
                    msgTargetID: cookies.get('bossID'),
                    tableArray: tableList,
                }
                WorkHourUtil.updateTotalTableSendReview(formData)
                    .success(function (res) {
                        // console.log(res.code);
                        $scope.getTable();
                    })
            }, 1000);
        }

        // ********************** 專案經理確認 *****************************
        // 主要顯示
        // $scope.tablesManagerItems = [];

        // -------------------- Week Methods Manager---------------------
        $scope.weekShift_manager = 0;
        $scope.firstFullDate_manager = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);
        $scope.firstDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
        $scope.lastDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 6));

        $scope.monDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 0));
        $scope.tueDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 1));
        $scope.wesDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 2));
        $scope.thuDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 3));
        $scope.friDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 4));
        $scope.satDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 5));
        $scope.sunDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 6));

        $scope.addWeek_manager = function () {
            $scope.weekShift_manager++;
            $scope.firstFullDate_manager = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_manager));
            $scope.firstDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_manager)));
            $scope.lastDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 6));

            $scope.monDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 0));
            $scope.tueDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 1));
            $scope.wesDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 2));
            $scope.thuDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 3));
            $scope.friDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 4));
            $scope.satDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 5));
            $scope.sunDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 6));
            $scope.showRelatedMembersTableReview(typeManager);
        }

        $scope.decreaceWeek_manager = function () {
            $scope.weekShift_manager--;
            $scope.firstFullDate_manager = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_manager));
            $scope.firstDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_manager)));
            $scope.lastDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 6));

            $scope.monDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 0));
            $scope.tueDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 1));
            $scope.wesDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 2));
            $scope.thuDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 3));
            $scope.friDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 4));
            $scope.satDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 5));
            $scope.sunDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 6));
            $scope.showRelatedMembersTableReview(typeManager);
        }

        // ********************** 歷史檢視 *****************************
        // 主要顯示
        $scope.tablesHistoryItems = [];

        // -------------------- Week Methods Manager---------------------
        $scope.weekShift_history = 0;
        $scope.firstFullDate_history = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);
        $scope.firstDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
        $scope.lastDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 6));

        $scope.monDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 0));
        $scope.tueDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 1));
        $scope.wesDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 2));
        $scope.thuDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 3));
        $scope.friDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 4));
        $scope.satDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 5));
        $scope.sunDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 6));

        $scope.addWeek_history = function () {
            $scope.weekShift_history++;
            $scope.firstFullDate_history = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_history));
            $scope.firstDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_history)));
            $scope.lastDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 6));

            $scope.monDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 0));
            $scope.tueDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 1));
            $scope.wesDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 2));
            $scope.thuDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 3));
            $scope.friDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 4));
            $scope.satDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 5));
            $scope.sunDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 6));
            $scope.showHistoryTable();
        }

        $scope.decreaseWeek_history = function () {
            $scope.weekShift_history--;
            $scope.firstFullDate_history = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_history));
            $scope.firstDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_history)));
            $scope.lastDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 6));

            $scope.monDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 0));
            $scope.tueDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 1));
            $scope.wesDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 2));
            $scope.thuDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 3));
            $scope.friDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 4));
            $scope.satDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 5));
            $scope.sunDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 6));
            $scope.showHistoryTable();
        }

        //歷史檢視取得相關人員表，以人為選取單位
        $scope.showHistoryTable = function () {
            initialUserTable(4);
            var getData = {
                // managerID: cookies.get('userDID'),
                creatorDID: vm.history.selected._id,
                create_formDate: $scope.firstFullDate_history,
            }
            // WorkHourUtil.getWorkHourFormForManager(getData)
            WorkHourUtil.getWorkHourForm(getData)
                .success(function (res) {
                    // var relatedPijIDArray = res.prjIDArray;
                    if (res.payload.length > 0) {
                        var workItemCount = res.payload[0].formTables.length;

                        var prjIDArray = [];
                        var workTableIDArray = [];
                        // 組成 prjID Array, TableID Array，再去Server要資料
                        for (var index = 0; index < workItemCount; index++) {
                            workTableIDArray[index] = res.payload[0].formTables[index].tableID;
                            prjIDArray[index] = res.payload[0].formTables[index].prjDID;
                        }
                        formDataTable = {
                            tableIDArray: workTableIDArray,
                            isFindSendReview: true,
                            // isFindManagerCheck: false,
                            isFindManagerCheck: null,
                            isFindExecutiveCheck: null
                        }
                        // 取得 Table Data
                        WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                            .success(function (res) {
                                // 填入表單資訊
                                for (var index = 0; index < res.payload.length; index++) {
                                    // for (var subIndex = 0; subIndex < relatedPijIDArray.length; subIndex++) {
                                    //     if (relatedPijIDArray[subIndex] === res.payload[index].prjDID) {
                                            var detail = {
                                                tableID: res.payload[index]._id,
                                                prjDID: res.payload[index].prjDID,
                                                create_formDate: res.payload[index].create_formDate,
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

                                                // Reject
                                                isManagerReject: res.payload[index].isManagerReject,
                                                managerReject_memo: res.payload[index].managerReject_memo,

                                                isExecutiveReject: res.payload[index].isExecutiveReject,
                                                executiveReject_memo: res.payload[index].executiveReject_memo,
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
                                            $scope.tablesHistoryItems.push(detail);
                                    //     }
                                    // }
                                }
                                loadWorkOffTable(vm.history.selected._id, 4);
                                loadNH(4);
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

        //專案經理確認
        $scope.reviewWHManagerItem = function (form, table, index) {
            $scope.checkText = '確定 同意：' +
                $scope.showPrjName(table.prjDID) +
                "  ？";
            $scope.checkingForm = form;
            $scope.checkingTable = table;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormAgree_ManagerModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendWHManagerAgree = function (form, checkingTable, index) {
            var formData = {
                tableID: checkingTable.tableID,
                // isSendReview: null,
                isManagerCheck: true,
                // isExecutiveCheck: null,
            }
            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    $scope.showTableOfItem(form, true, null, null, 1);
                })
        }

        //專案經理退回
        $scope.disagreeWHItem_manager = function (form, table, index) {
            $scope.checkText = '確定 退回：' +
                $scope.showPrjName(table.prjDID) +
                "  ？";
            $scope.checkingForm = form;
            $scope.checkingTable = table;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormDisAgree_ManagerModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendWHDisagree_manager = function (form, checkingTable, index, rejectMsg) {
            var formData = {
                tableID: checkingTable.tableID,
                isSendReview: false,
                isManagerCheck: false,
                isExecutiveCheck: false,
                isManagerReject: true,
                isExecutiveReject: false,
                managerReject_memo: rejectMsg,
            }
            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    $scope.showTableOfItem(form, true, null, null, 1);
                })
        }

        // ********************** 行政確認 *****************************
        // 主要顯示
        // $scope.tablesExecutiveItems = [];

        // -------------------- Week Methods Excutive---------------------
        $scope.weekShift_executive = 0;
        $scope.firstFullDate_executive = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);
        $scope.firstDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
        $scope.lastDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 6));

        $scope.monDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 0));
        $scope.tueDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 1));
        $scope.wesDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 2));
        $scope.thuDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 3));
        $scope.friDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 4));
        $scope.satDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 5));
        $scope.sunDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 6));

        $scope.weekShift_manager = 0;

        $scope.addWeek_executive = function () {
            $scope.weekShift_executive++;
            $scope.firstFullDate_executive = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_executive));
            $scope.firstDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_executive)));
            $scope.lastDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 6));

            $scope.monDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 0));
            $scope.tueDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 1));
            $scope.wesDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 2));
            $scope.thuDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 3));
            $scope.friDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 4));
            $scope.satDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 5));
            $scope.sunDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 6));
            $scope.showRelatedMembersTableReview(typeExecutive);
        }

        $scope.decreaseWeek_executive = function () {
            $scope.weekShift_executive--;
            $scope.firstFullDate_executive = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_executive));
            $scope.firstDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift_executive)));
            $scope.lastDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 6));

            $scope.monDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 0));
            $scope.tueDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 1));
            $scope.wesDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 2));
            $scope.thuDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 3));
            $scope.friDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 4));
            $scope.satDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 5));
            $scope.sunDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 6));
            $scope.showRelatedMembersTableReview(typeExecutive);
        }

        //行政確認
        $scope.reviewWHExecutiveItem = function (form, table, index) {
            $scope.checkText = '確定 同意：' +
                $scope.showPrjName(table.prjDID) +
                "  ？";
            $scope.checkingForm = form;
            $scope.checkingTable = table;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormAgree_ExecutiveModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendWHExecutiveAgree = function (form, checkingTable, index) {
            var formData = {
                tableID: checkingTable.tableID,
                // isSendReview: null,
                // isManagerCheck: null,
                isExecutiveCheck: true,
            }
            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    //TODO 更新加班/補休單
                    var formData = {
                        creatorDID: checkingTable.creatorDID,
                        prjDID: checkingTable.prjDID,
                        create_formDate: checkingTable.create_formDate,
                    }
                    WorkHourAddItemUtil.updateRelatedAddItemByProject(formData)
                        .success(function (res) {
                            $scope.showTableOfItem(form, true, null, null, 2);
                        })
                        .error(function () {
                        })
                })
        }

        //行政退回
        $scope.disagreeWHItem_executive = function (form, table, index) {
            $scope.checkText = '確定 退回：' +
                $scope.showPrjName(table.prjDID) +
                "  ？";
            $scope.checkingForm = form;
            $scope.checkingTable = table;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormDisAgree_ExecutiveModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendWHDisagree_executive = function (form, checkingTable, index, rejectMsg) {
            var formData = {
                tableID: checkingTable.tableID,
                isSendReview: false,
                isManagerCheck: false,
                isExecutiveCheck: false,
                isManagerReject: false,
                isExecutiveReject: true,
                executiveReject_memo: rejectMsg,
            }
            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    // console.log(res.code);
                    $scope.showTableOfItem(form, true, null, null, 2);
                })
        }

        function getHourDiff(start, end) {
            if (start && end) {
                var difference = Math.abs(toSeconds(start) - toSeconds(end));
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

                // formatting (0 padding and concatenation)
                // result = result.map(function (v) {
                //     return v < 10 ? '0' + v : v;
                // }).join(':');
                result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                return result <= 1 ? 1 : result >= 8 ? 8 : result;
            }
        }

        $scope.getHourDiffByTime = function (start, end) {
            if (start && end) {
                var difference = Math.abs(toSeconds(start) - toSeconds(end));
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

                // formatting (0 padding and concatenation)
                // result = result.map(function (v) {
                //     return v < 10 ? '0' + v : v;
                // }).join(':');
                result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                return result <= 1 ? 1 : result >= 8 ? 8 : result;
            }
        }

        function toSeconds(time_str) {
            // Extract hours, minutes and seconds
            var parts = time_str.split(':');
            // compute  and return total seconds
            return parts[0] * 3600 +  // an hour has 3600 seconds
                parts[1] * 60         // a minute has 60 seconds
            // +parts[2];         // seconds
        }

        // **************** 表定假日 ****************
        // 主要顯示
        $scope.nationalHolidayTablesItems = [];

        $scope.fetchNationHolidays = function (user) {
            $scope.nationalHolidayTablesItems = [];
            var getData = {
                year: thisYear,
            }
            NationalHolidayUtil.fetchAllNationalHolidays(getData)
                .success(function (res) {
                    // console.log(res.payload);
                    if (res.payload.length > 0) {
                        // 取得 Table Data
                        for (var index = 0; index < res.payload.length; index++) {
                            var detail = {
                                tableID: res.payload[index]._id,

                                create_formDate: res.payload[index].create_formDate,
                                year: res.payload[index].year,
                                month: res.payload[index].month,
                                day: res.payload[index].day,
                                isEnable: res.payload[index].isEnable,
                            };
                            if (detail.isEnable) {
                                $scope.nationalHolidayTablesItems.push($scope.showDate(detail));
                            }
                        }
                    }
                    // console.log($scope.nationalHolidayTablesItems);
                    showWorkOffTableData(user);
                })
                .error(function () {
                    console.log('ERROR NationalHolidayUtil.fetchAllNationalHolidays');
                })
        }

        /**
         * 顯示加班單
         * @param user
         */
        function showWorkOffTableData(user) {
            var formData = {
                creatorDID: user,
                year: thisYear,
                month: thisMonth,
            }
            WorkAddConfirmFormUtil.fetchWorkAddConfirmFormByUserDID(formData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        $scope.workAddConfirmTablesFromServerOldID = res.payload[0]._id;
                        $scope.workAddConfirmTablesFromServer = JSON.parse(res.payload[0].formTables);
                    }
                    var formData = {
                        creatorDID: user._id,
                        // prjDID: null,
                        // create_formDate: null,
                        // day: null,
                        month: thisMonth,
                    }
                    WorkHourAddItemUtil.getWorkHourAddItems(formData)
                        .success(function (res) {
                            // $scope.workAddConfirmTablesItems = res.payload;
                            operateWorkHourAddArray(res.payload);
                        })
                        .error(function () {
                            console.log('ERROR  WorkHourAddItemUtil.getWorkHourAddItems')
                        })
                })
            // 主要顯示
            $scope.workAddConfirmTablesItems = [];
            $scope.workAddConfirmTablesFromServer = [];
            $scope.workAddConfirmTablesFromServerOldID = undefined;


        }

        //加班單核薪專用
        $scope.workAddTablesRawData = [];

        // 整理相同日期的加班項目
        function operateWorkHourAddArray(tables) {
            $scope.workAddTablesRawData = tables;
            var workAddTable = {};
            for (var index = 0; index < tables.length; index++) {
                if (!tables[index].isExecutiveConfirm) {
                    continue;
                }
                var workAddItem = {
                    // 首周
                    date: "",
                    // 星期
                    day: 0,
                    //加班
                    addWork: 0,
                    //換休
                    restWork: 0,
                    // Project DID
                    prjDID: "",
                    // 時薪
                    userMonthSalary: 0,
                    // userHourSalary: 0,
                    // 國定假日
                    isNH: false,

                    // 加班時數分配紀錄
                    type1_13: 0,
                    type1_23: 0,
                    type1_1: 0,
                }
                if (workAddTable[$scope.showDate(tables[index])] === undefined) {
                    workAddItem.date = $scope.showDate(tables[index]);
                    workAddItem.prjDID = tables[index].prjDID;
                    for (var subIndex = 0; subIndex < $scope.nationalHolidayTablesItems.length; subIndex++) {
                        if (workAddItem.date === $scope.nationalHolidayTablesItems[subIndex]) {
                            // console.log(workAddItem.date);
                            workAddItem.isNH = true;
                            break;
                        }
                    }
                    workAddItem.day = tables[index].day;
                    // workAddItem.userHourSalary = tables[index].userHourSalary;
                    workAddItem.userMonthSalary = tables[index].userMonthSalary;
                    switch (tables[index].workAddType) {
                        case 1:
                            workAddItem.addWork += $scope.getHourDiffByTime(
                                tables[index].start_time,
                                tables[index].end_time);
                            break;
                        case 2:
                            workAddItem.restWork += $scope.getHourDiffByTime(
                                tables[index].start_time,
                                tables[index].end_time);
                            break;
                    }

                    workAddTable[$scope.showDate(tables[index])] = workAddItem;
                } else {
                    switch (tables[index].workAddType) {
                        case 1:
                            workAddTable[$scope.showDate(tables[index])].addWork += $scope.getHourDiffByTime(
                                tables[index].start_time,
                                tables[index].end_time);
                            break;
                        case 2:
                            workAddTable[$scope.showDate(tables[index])].restWork += $scope.getHourDiffByTime(
                                tables[index].start_time,
                                tables[index].end_time);
                            break;
                    }
                }
                if ($scope.workAddConfirmTablesFromServer[$scope.showDate(tables[index])] !== undefined) {
                    workAddTable[$scope.showDate(tables[index])].type1_1 = $scope.workAddConfirmTablesFromServer[$scope.showDate(tables[index])].type1_1;
                    workAddTable[$scope.showDate(tables[index])].type1_13 = $scope.workAddConfirmTablesFromServer[$scope.showDate(tables[index])].type1_13;
                    workAddTable[$scope.showDate(tables[index])].type1_23 = $scope.workAddConfirmTablesFromServer[$scope.showDate(tables[index])].type1_23;
                }
            }

            $scope.workAddConfirmTablesItems = workAddTable;
            // console.log($scope.workAddConfirmTablesItems);
        }

        Object.size = function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

        // 加班單合計
        $scope.showCalculateWorkAddTableSum = function (tables, type) {
            var result = 0;
            if (!tables) return;
            var array = $.map(tables, function(value, index) {
                return [value];
            });
            for (var index = 0; index < array.length; index ++) {
                switch(type) {
                    case 1:
                        result += array[index].addWork;
                        result += array[index].restWork;
                        break;
                    case 2:
                        if (array[index].day < 6 && !array[index].isNH) {
                            result += array[index].addWork;
                        }
                        break;
                    case 3:
                        if (array[index].day === 6) {
                            result += array[index].addWork;
                        }
                        break;
                    case 4:
                        if (array[index].day === 7) {
                            result += array[index].addWork;
                        }
                        break;
                    case 5:
                        // 國定假日
                        if (array[index].isNH) {
                            result += array[index].addWork;
                        }
                        break;
                    case 6:
                        result += array[index].restWork;
                        break;
                    case 7:
                        result += array[index].addWork;
                        break;
                    case 8:
                        // result += (array[index].addWork * array[index].userHourSalary);
                        // result += (array[index].addWork * (array[index].userMonthSalary/240));
                        result += (((array[index].type1_13 * 1.33) + (array[index].type1_23 * 1.66) + (array[index].type1_1 * 2))
                            * (array[index].userMonthSalary/240));
                        result = $scope.formatFloat(result, 2);
                        break;
                }
            }
            return result;
        }

        //小數點2
        $scope.formatFloat = function (num, pos) {
            var size = Math.pow(10, pos);
            return Math.round(num * size) / size;
        }

        $scope.showDay = function (day) {
            return DateUtil.getDay(day)
        }

        $scope.showDate = function (table) {
            return DateUtil.getShiftDatefromFirstDate(
                DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                table.day === 0 ? 6 : table.day - 1);
        }

        // 加班單核薪
        $scope.confirmWorkAddItems = function () {
            if ($scope.workAddTablesRawData.length === 0) {
                toastr.warning('沒有任何加班單', 'Warning');
            }

            var formData = {
                formTables: $scope.workAddTablesRawData,
            }
            WorkHourAddItemUtil.executiveConfirm(formData)
                .success(function () {
                    toastr.success('確認成功', 'Success');
                })
                .error(function () {

                })
        }

        $scope.bindNumberFormat = function () {
            $('input[type="number"]').mask('H.D', {
                translation: {
                    'H': {
                        pattern: /[012345678]/,
                    },
                    'D': {
                        pattern: /[05]/,
                    }
                }
            });
        }

        $scope.showUser = function (userDID) {
            var selected = [];
            if (vm.users === undefined) return;
            if (userDID) {
                selected = $filter('filter')(vm.users, {
                    _id: userDID,
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        // loginUser's relatedMembers.
        $scope.mainRelatedMembers = null;

        //顯示經理審查人員
        // Fetch Manager Related Members
        $scope.fetchManagerRelatedMembers = function () {
            var formData = {
                relatedID: cookies.get('userDID'),
            }
            var relatedMembers = [];
            Project.getProjectRelatedToManager(formData)
                .success(function (relatedProjects) {
                    // console.log(relatedProjects);
                    for(var index = 0; index < relatedProjects.length; index ++) {
                        //主辦
                        if (relatedProjects[index].majorID !== undefined && !relatedMembers.includes(relatedProjects[index].majorID)) {
                            relatedMembers.push(relatedProjects[index].majorID);
                        }
                        //協辦
                        if (relatedProjects[index].workers.length !== 0) {
                            for (var subIndex = 0; subIndex < relatedProjects[index].workers.length; subIndex ++) {
                                if (!relatedMembers.includes(relatedProjects[index].workers[subIndex])) {
                                    relatedMembers.push(relatedProjects[index].workers[subIndex]);
                                }
                            }
                        }
                    }
                    relatedMembers.push(cookies.get('userDID'));
                    $scope.mainRelatedMembers = relatedMembers;
                    $scope.showRelatedMembersTableReview(typeManager);
                })
        }

        //顯示行政審查人員
        // Fetch Executive Related Members
        $scope.fetchExecutiveRelatedMembers = function () {
            var formData = {
                relatedID: cookies.get('userDID'),
            }
            var relatedMembers = [];
            // 行政總管跟每個人都有關
            for (var index = 0; index < vm.executiveUsers.length; index ++) {
                relatedMembers.push(vm.executiveUsers[index]._id);
            }
            $scope.mainRelatedMembers = relatedMembers;
            $scope.showRelatedMembersTableReview(typeExecutive);
        }


        var typeManager = 1;
        var typeExecutive = 2;

        // show Related Members Table Review.
        $scope.showRelatedMembersTableReview = function(type) {

            var targetFormData = null;
            var targetList = null;

            switch(type) {
                case typeManager: {
                    console.log("firstFullDate_manager= " + $scope.firstFullDate_manager);
                    $scope.workHourFormsForManagers = [];
                    targetFormData = $scope.firstFullDate_manager;
                    targetList = $scope.workHourFormsForManagers;
                } break;
                case typeExecutive: {
                    console.log("firstFullDate_executive= " + $scope.firstFullDate_executive);
                    $scope.workHourFormsForExecutive = [];
                    targetFormData = $scope.firstFullDate_executive;
                    targetList = $scope.workHourFormsForExecutive;
                } break;
            }

            var getData = {
                relatedMembers: $scope.mainRelatedMembers,
                create_formDate: targetFormData,
            }
            WorkHourUtil.getWorkHourFormMultiple(getData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        $scope.setReviewList(res.payload, 0, targetList, type);
                    }
                })
        }

        // 拿取對應的工時表
        $scope.showTableOfItem = function(form
                                          , isFindSendReviewFlag
                                          , isFindManagerCheckFlag
                                          , isFindExecutiveCheck
                                          , type) {
            var workItemCount = form.formTables.length;

            var workTableIDArray = [];
            // 組成 prjID Array, TableID Array，再去Server要資料
            for (var index = 0; index < workItemCount; index++) {
                workTableIDArray[index] = form.formTables[index].tableID;
            }

            formDataTable = {
                tableIDArray: workTableIDArray,
                isFindSendReview: isFindSendReviewFlag,
                isFindManagerCheck: isFindManagerCheckFlag,
                isFindExecutiveCheck: isFindExecutiveCheck
            }
            // 取得 Table Data
            WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                .success(function (res) {
                    // 填入表單資訊
                    $scope.tableData = {};
                    var formTables = [];
                    for (var index = 0; index < res.payload.length; index++) {
                        var detail = {
                            tableID: res.payload[index]._id,
                            prjDID: res.payload[index].prjDID,
                            creatorDID: res.payload[index].creatorDID,
                            create_formDate: res.payload[index].create_formDate,
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

                            // Reject
                            isManagerReject: res.payload[index].isManagerReject,
                            managerReject_memo: res.payload[index].managerReject_memo,

                            isExecutiveReject: res.payload[index].isExecutiveReject,
                            executiveReject_memo: res.payload[index].executiveReject_memo,

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
                        formTables.push(detail);
                    }
                    var evalString = "$scope.tablesItems['" + form.creatorDID + form._id + "'] = formTables";
                    eval(evalString);

                })
                .error(function () {
                    console.log('ERROR WorkHourUtil.findWorkHourTableFormByTableIDArray');
                })
            $scope.fetchWorkOffReviewTables(form, type);
            $scope.fetchNHReviewTables(form, type);
        }

        // get work Off tables
        $scope.fetchWorkOffReviewTables = function(form, type) {
            // console.log("fetchWorkOffReviewTables");
            var getData = {
                creatorDID: form.creatorDID,
                year: thisYear,
                month: thisMonth,
            }
            WorkOffFormUtil.fetchUserWorkOffForm(getData)
                .success(function (res) {
                    var formTables = [];
                    if (res.payload.length > 0) {
                        var workItemCount = res.payload[0].formTables.length;

                        var workOffTableIDArray = [];
                        // 組成 TableID Array，再去Server要資料
                        for (var index = 0; index < workItemCount; index++) {
                            workOffTableIDArray[index] = res.payload[0].formTables[index].tableID;
                        }

                        var workOffFormDataTable = {};

                        switch (type) {
                            case typeManager: {
                                workOffFormDataTable = {
                                    tableIDArray: workOffTableIDArray,
                                    create_formDate: $scope.firstFullDate_manager,
                                }
                            } break;
                            case typeExecutive: {
                                workOffFormDataTable = {
                                    tableIDArray: workOffTableIDArray,
                                    create_formDate: $scope.firstFullDate_executive,
                                }
                            } break;
                        }
                        // 取得 Table Data
                        WorkOffFormUtil.findWorkOffTableFormByTableIDArrayAndParameters(workOffFormDataTable)
                            .success(function (res) {
                                // 填入表單資訊
                                $scope.tableData = {};
                                for (var index = 0; index < res.payload.length; index++) {
                                    var detail = {
                                        tableID: res.payload[index]._id,

                                        workOffType: res.payload[index].workOffType,
                                        create_formDate: res.payload[index].create_formDate,
                                        year: res.payload[index].year,
                                        month: res.payload[index].month,
                                        day: res.payload[index].day,
                                        start_time: res.payload[index].start_time,
                                        end_time: res.payload[index].end_time,

                                        //RIGHT
                                        isSendReview: res.payload[index].isSendReview,
                                        isBossCheck: res.payload[index].isBossCheck,
                                        isExecutiveCheck: res.payload[index].isExecutiveCheck,

                                        // Reject
                                        isBossReject: res.payload[index].isBossReject,
                                        bossReject_memo: res.payload[index].bossReject_memo,

                                        isExecutiveReject: res.payload[index].isExecutiveReject,
                                        executiveReject_memo: res.payload[index].executiveReject_memo,

                                        // userHourSalary: res.payload[index].userHourSalary,
                                        userMonthSalary: res.payload[index].userMonthSalary,
                                    };
                                    formTables.push(detail);
                                }
                                var evalString = "$scope.workOffTablesItems['" + form.creatorDID + form._id + "'] = formTables";
                                eval(evalString);
                            })
                            .error(function () {
                                console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByTableIDArrayAndParameters');
                            })
                    } else {
                        // res.payload.length == 0
                    }
                })
                .error(function () {
                    console.log('ERROR WorkOffFormUtil.fetchUserWorkOffForm');
                })
        }

        // get work Off Tables in scope.
        $scope.fetchWorkOffTableFormDataFromScope = function(form) {
            // console.log($scope.workOffTablesItems[form.creatorDID + form._id]);
            return $scope.workOffTablesItems[form.creatorDID + form._id] === undefined ? [] : $scope.workOffTablesItems[form.creatorDID + form._id];
        }

        // show 休假
        $scope.showWorkOffCalculateHour = function (tables, day) {
            for (var index = 0; index < tables.length; index++) {
                if (day !== tables[index].day || (!tables[index].isBossCheck || !tables[index].isExecutiveCheck)) return 0;
                return getHourDiff(tables[index].start_time, tables[index].end_time);
            }
            return 0;
        }

        $scope.fetchNHReviewTables = function(form, type) {
            //讀取國定假日
            var fetchNationalHolidayData = {};

            switch (type) {
                case typeManager: {
                    fetchNationalHolidayData = {
                        create_formDate: $scope.firstFullDate_manager,
                        year: thisYear,
                    }
                } break;
                case typeExecutive: {
                    fetchNationalHolidayData = {
                        create_formDate: $scope.firstFullDate_executive,
                        year: thisYear,
                    }
                } break;
            }
            NationalHolidayUtil.fetchAllNationalHolidaysWithParameter(fetchNationalHolidayData)
                .success(function (res) {
                    var formTables = [];
                    if (res.payload.length > 0) {
                        // 填入表單資訊
                        for (var index = 0; index < res.payload.length; index++) {
                            var detail = {
                                tableID: res.payload[index]._id,

                                create_formDate: res.payload[index].create_formDate,
                                year: res.payload[index].year,
                                month: res.payload[index].month,
                                day: res.payload[index].day,
                                isEnable: res.payload[index].isEnable,
                            };
                            formTables.push(detail);
                        }
                        var evalString = "$scope.workNHTablesItems['" + form.creatorDID + form._id + "'] = formTables";
                        eval(evalString);
                    } else {
                        // res.payload.length == 0
                    }
                })
                .error(function () {
                    console.log('ERROR NationalHolidayUtil.fetchAllNationalHolidaysWithParameter');
                })
        }

        // get National Holidays Tables in scope.
        $scope.fetchNHTableFormDataFromScope = function(form) {
            // console.log($scope.workNHTablesItems[form.creatorDID + form._id]);
            return $scope.workNHTablesItems[form.creatorDID + form._id] === undefined ? [] : $scope.workNHTablesItems[form.creatorDID + form._id];
        }

        // show 國定假日
        $scope.showNHCalculateHour = function (tables, day) {
            for (var index = 0; index < tables.length; index++) {
                if (day !== tables[index].day) return 0;
                return 8;
            }
            return 0;
        }

        // 資料存取Key Point.
        $scope.fetchFormDataFromScope = function(form) {
            // console.log($scope.tablesItems[form.creatorDID + form._id]);
            return $scope.tablesItems[form.creatorDID + form._id] === undefined ? [] : $scope.tablesItems[form.creatorDID + form._id];
        }

        // 設置 Review List, recursion.
        $scope.setReviewList = function (forms, index, arrayResult, type) {
            var workItemCount = forms[index].formTables.length;

            var workTableIDArray = [];
            // 組成 TableID Array，再去Server要資料
            for (var subIndex = 0; subIndex < workItemCount; subIndex++) {
                workTableIDArray[subIndex] = forms[index].formTables[subIndex].tableID;
            }
            var formDataTable = {};
            switch(type) {
                case typeManager: {
                    formDataTable = {
                        tableIDArray: workTableIDArray,
                        isFindSendReview: true,
                        isFindManagerCheck: false,
                        isFindExecutiveCheck: null
                    }
                } break;
                case typeExecutive: {
                    formDataTable = {
                        tableIDArray: workTableIDArray,
                        isFindSendReview: true,
                        isFindManagerCheck: true,
                        isFindExecutiveCheck: false
                    }
                }break;
            }

            // 取得 Table Data
            WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                .success(function (subRes) {
                    if (subRes.payload.length > 0) {
                        arrayResult.push(forms[index]);
                    }
                    index ++;
                    if (index < forms.length) {
                        $scope.setReviewList(forms, index, arrayResult, type);
                    }
                })
        }

        // ****************  加班核准 點擊版********************

        // 加班單核薪 點擊版
        $scope.qwer = function () {
            if ($scope.workAddTablesRawData.length === 0) {
                toastr.warning('沒有任何加班單', 'Warning');
            }

            var formData = {
                creatorDID: vm.workAdd.selected._id,
                year: thisYear,
                month: thisMonth,
                formTables: $scope.workAddConfirmTablesItems,
                oldFormID: $scope.workAddConfirmTablesFromServerOldID,
            }

            WorkAddConfirmFormUtil.createWorkAddConfirmForm(formData)
                .success(function () {
                    toastr.success('成功', 'Success');
                })
                .error(function () {
                })
        }

        $scope.maskInput = function () {
            $('.inputLimited').mask('M', {
                translation: {
                    'M': {
                        pattern: /[012345678]/,
                    },
                }
            });
            return true;
        }

        // 編輯Memo
        $scope.editMemo = function (table, type, editable) {
            $scope.showMemoEditor(table, type, editable);
        }

        $scope.showMemoEditor = function (table, type, editable) {
            $uibModal.open({
                animation: true,
                controller: 'MyWorkHourTable_EditMemoModalCtrl',
                templateUrl: 'app/pages/myModalTemplate/myWorkHourTableFormEditMemo_Modal.html',
                resolve: {
                    table: function () {
                        return table;
                    },
                    parent: function () {
                        return $scope;
                    },
                    memoType: function () {
                        return type;
                    },
                    editableFlag: function () {
                        return editable;
                    },
                }
            }).result.then(function () {
                toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
            });
        }

    } // function End line
})();
