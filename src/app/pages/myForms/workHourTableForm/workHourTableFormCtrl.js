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
                '$compile',
                'ngDialog',
                'User',
                'Project',
                'ProjectUtil',
                'DateUtil',
                'TimeUtil',
                'WorkHourUtil',
                'WorkHourAddItemUtil',
                'WorkOffFormUtil',
                'NationalHolidayUtil',
                'OverTimeDayUtil',
                'WorkAddConfirmFormUtil',
                'NotificationMsgUtil',
                'editableOptions',
                'editableThemes',
                'bsLoadingOverlayService',
                WorkHourTableCtrl
            ]);

    /** @ngInject */
    function WorkHourTableCtrl($scope,
                               toastr,
                               $filter,
                               $cookies,
                               $timeout,
                               $uibModal,
                               $compile,
                               ngDialog,
                               User,
                               Project,
                               ProjectUtil,
                               DateUtil,
                               TimeUtil,
                               WorkHourUtil,
                               WorkHourAddItemUtil,
                               WorkOffFormUtil,
                               NationalHolidayUtil,
                               OverTimeDayUtil,
                               WorkAddConfirmFormUtil,
                               NotificationMsgUtil,
                               editableOptions,
                               editableThemes,
                               bsLoadingOverlayService) {
        // console.log = function() {}

        var vm = this;

        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;
        $scope.month = thisMonth;

        $scope.username = $cookies.get('username');
        $scope.roleType = $cookies.get('roletype');

        var formData = {
            userDID: $cookies.get('userDID'),
        }
        User.findUserByUserDID(formData)
            .success(function (user) {
                $scope.userMonthSalary = user.userMonthSalary;
            })

        // 所有與使用者關聯之專案。
        var allRelatedPrjDatas;

        // 主要顯示 工時表單，以週為單位
        $scope.tables = [{
            tablesItems: [],
        }];
        // 休假列表
        $scope.workOffTablesItems = [];
        // 國定假日列表
        $scope.workNHTablesItems = [];

        // 找跟 Login User有關係的 Project
        var formData = {
            relatedID: $cookies.get('userDID'),
        }
        Project.getProjectRelated(formData)
            .success(function (relatedProjects) {
                console.log(" ======== related login user Projects ======== ");
                console.log(relatedProjects);
                console.log(" ======== related login user Projects ======== ");
                allRelatedPrjDatas = relatedProjects;
                vm.relatedProjects = relatedProjects;
            });

        //所有專案，資料比對用
        Project.findAll()
            .success(function (allProjects) {
                $scope.allProjectData = [];
                var prjCount = allProjects.length;
                for (var index = 0; index < prjCount; index++) {

                    // 專案名稱顯示規則 2019/07 定義
                    var nameResult = "";
                    if (allProjects[index].prjSubName != undefined && allProjects[index].prjSubName.trim() != "") {
                        nameResult = allProjects[index].prjSubName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    } else if (allProjects[index].prjName != undefined && allProjects[index].prjName.trim() != "") {
                        nameResult = allProjects[index].prjName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    } else {
                        nameResult = allProjects[index].mainName + " - " + ProjectUtil.getTypeText(allProjects[index].type);
                    }

                    $scope.allProjectData[index] = {
                        prjDID: allProjects[index]._id,
                        prjCode: allProjects[index].prjCode,
                        mainName: allProjects[index].mainName + " - "
                        + allProjects[index].prjName + " - "
                        + allProjects[index].prjSubName + " - "
                        + ProjectUtil.getTypeText(allProjects[index].type),
                        majorID: allProjects[index].majorID,
                        managerID: allProjects[index].managerID,
                        ezName: nameResult,
                    };
                }
            })

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
                vm.managerUsers = allUsers;
                // vm.executiveUsers = allUsers;
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
        // 新增項目
        $scope.addWorkItem = function (prj) {

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_workHour'
            });

            vm.prjItems.selected = "";
            var newTableItem = {
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

                userMonthSalary: $scope.userMonthSalary

            };

            for (var index = 0; index < $scope.tables.length; index ++) {
                $scope.tables[index].tablesItems.push(newTableItem);
            }
            // console.log(newTableItem);

            $scope.createSubmit(0, true);
        }

        // 暫存表單，＊＊＊使用者互動 主要儲存功能＊＊＊
        $scope.saveTemp = function () {
            $scope.createSubmit(100, false);
        }

        // Remove Work Hour Check
        $scope.deleteCheck = function (item, itemIndex) {
            $scope.checkText = '確定移除 ' + $scope.showPrjName(item.prjDID) + "  ？";
            $scope.checkingItem = item;
            $scope.itemIndex = itemIndex;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormDeleteModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 使用者確定移除工時表項目
        $scope.removeWorkItem = function (item, itemIndex) {
            for (var index = 0; index< $scope.tables.length; index ++) {
                $scope.tables[index].tablesItems.splice(itemIndex, 1);
            }

            var formData = {
                creatorDID: $cookies.get('userDID'),
                prjDID: item.prjDID,
                create_formDate: item.create_formDate,
            }

            // 移除加班項目
            WorkHourAddItemUtil.removeRelatedAddItemByProject(formData)
                .success(function (res) {
                    $scope.createSubmit(100, true);
                })
                .error(function () {
                    console.log("ERROR WorkHourAddItemUtil.removeRelatedAddItemByProject");
                })
        };

        editableOptions.theme = 'bs3';
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

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

        // 初始化數據
        function initialUserTable(type) {
            /**
             *  type
             *  1: user
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
                    // WHY reset ?
                    // 'cause it's initial function.
                    for (var index = 0; index < $scope.tables.length; index ++) {
                        $scope.tables[index].tablesItems = []; // 清空工時表項目
                    }
                    for (var index = 0; index < stringTable.length; index++) {
                        eval(stringTable[index] + " = 0"); // 歸零工時表的「國定假日」、「休假」
                    }
                    break;
                case 4:
                    for (var index = 0; index < $scope.tables_history.length; index ++) {
                        $scope.tables_history[index].tablesItems = [];
                    }
                    for (var index = 0; index < stringTable.length; index++) {
                        eval(stringTable[index] + "_history = 0");
                    }
                    break;
            }
        }

        var formDataTable = {};

        // 要刪除的舊Table
        var needRemoveOldTable = {};

        $scope.loading = true;

        // 取得使用者個人工時表，userDID,
        // 當周第一天日期，
        // 唯一碼：creatorDID, create_formDate, month, year
        // 一個人每週只有一張工時表，跨月的同一周共有「兩張」工時表
        $scope.getWorkHourTables = function () {
            initialUserTable(1);
            var getData = {
                creatorDID: $cookies.get('userDID'),
                create_formDate: $scope.firstFullDate,
            }
            if (allRelatedPrjDatas !== undefined) {
                vm.relatedProjects = allRelatedPrjDatas.slice();
            }

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_workHour'
            });

            var tableSort = []; // 為了做跨月排序用

            WorkHourUtil.getWorkHourForm(getData) // 拿工時表資料
                .success(function (res) {
                    if (res.payload.length > 0) {
                        var needUpdateWorkTableIDArray = [];
                        for (var majorIndex = 0; majorIndex < res.payload.length; majorIndex ++) {
                            var tableIndex = 0;
                            // console.log(res.payload);
                            var workItemCount = res.payload[majorIndex].formTables.length;
                            // console.log("tables= " + res.payload.length);

                            var prjIDArray = [];
                            var workTableIDArray = [];
                            // 組成 prjID Array, TableID Array，再去Server要資料
                            for (var index = 0; index < workItemCount; index++) {
                                needUpdateWorkTableIDArray.push(res.payload[majorIndex].formTables[index].tableID);
                                workTableIDArray[index] = res.payload[majorIndex].formTables[index].tableID;
                                prjIDArray[index] = res.payload[majorIndex].formTables[index].prjDID;
                            }
                            var formData = {
                                prjIDArray: prjIDArray,
                            }
                            // 為了過濾已經存在工時表中的專案，剩下的才能被『新增項目』
                            Project.findPrjByIDArray(formData) // 工時表中有相關的專案
                                .success(function (res) {
                                    $scope.loading = false;
                                    vm.relatedProjects = [];
                                    for (var outIndex = 0; outIndex < allRelatedPrjDatas.length; outIndex++) {
                                        var isExistInForms = false;
                                        for (var index = 0; index < res.payload.length; index++) {
                                            if (allRelatedPrjDatas[outIndex]._id === res.payload[index]._id) {
                                                isExistInForms = true;
                                            }
                                        }
                                        if (!isExistInForms) {
                                            vm.relatedProjects.push(allRelatedPrjDatas[outIndex]);
                                        }
                                    }
                                    console.log(" ======== Projects can add to form  ======== ");
                                    console.log(vm.relatedProjects);
                                    console.log(" ======== Projects can add to form  ======== ");
                                })
                                .error(function () {
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'mainPage_workHour'
                                        });
                                    }, 500)
                                    console.log('ERROR Project.findPrjByIDArray');
                                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                                })

                            needRemoveOldTable = {
                                tableIDArray: needUpdateWorkTableIDArray, //操作中的 table ID
                            }

                            formDataTable = {
                                tableIDArray: workTableIDArray, // 操作中的 table IDs
                                isFindSendReview: null,
                                isFindManagerCheck: null,
                                isFindExecutiveCheck: null,
                                isFindManagerReject: null,
                                isFindExecutiveReject: null
                            };

                            tableSort.push(workTableIDArray);

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

                                            userMonthSalary: res.payload[index].userMonthSalary,

                                            // TOTAL
                                            hourTotal: parseFloat(res.payload[index].mon_hour) +
                                            parseFloat(res.payload[index].tue_hour) +
                                            parseFloat(res.payload[index].wes_hour) +
                                            parseFloat(res.payload[index].thu_hour) +
                                            parseFloat(res.payload[index].fri_hour) +
                                            parseFloat(res.payload[index].sat_hour) +
                                            parseFloat(res.payload[index].sun_hour),

                                            hourAddTotal: res.payload[index].mon_hour_add +
                                            res.payload[index].tue_hour_add +
                                            res.payload[index].wes_hour_add +
                                            res.payload[index].thu_hour_add +
                                            res.payload[index].fri_hour_add +
                                            res.payload[index].sat_hour_add +
                                            res.payload[index].sun_hour_add,
                                        };

                                        // 跨月表單用以區分
                                        if (tableSort[0].indexOf(res.payload[index]._id) >= 0) {
                                            $scope.tables[0].tablesItems.push(detail);
                                        } else {
                                            $scope.tables[1].tablesItems.push(detail);
                                        }
                                    }
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'mainPage_workHour'
                                        });
                                    }, 500)

                                })
                                .error(function () {
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'mainPage_workHour'
                                        });
                                    }, 500)
                                    console.log('ERROR WorkHourUtil.findWorkHourTableFormByTableIDArray');
                                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                                })
                        }
                        loadWorkOffTable($cookies.get('userDID'), 1);
                        loadNH(1);
                        loadOT(1);
                    } else {
                        // 無資料
                        $scope.loading = false;

                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_workHour'
                        });
                    }
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_workHour'
                        });
                    }, 500)
                    console.log('ERROR WorkHourUtil.getWorkHourForm');
                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                })
        }

        $scope.fetchTableItems = function(index) {
            return $scope.tables[index].tablesItems;
        }

        $scope.fetchTableItems_history = function(index) {
            return $scope.tables_history[index].tablesItems;
        }

        // -------------------------------------
        //Dynamic change
        $scope.hourChange = function (obj) {
            var stringtable = [
                "item.mon_hour",
                "item.tue_hour",
                "item.wes_hour",
                "item.thu_hour",
                "item.fri_hour",
                "item.sat_hour",
                "item.sun_hour",
            ]
            var targetString = obj.$parent.$editable.name;
            var result = 0;
            // 加總非編輯欄位
            for (var index = 0; index < stringtable.length; index++) {
                if (targetString === stringtable[index]) {
                    continue;
                }
                var oldValueString = 'parseFloat(obj.$parent.$parent.$parent.' + stringtable[index] + ')';
                result += eval(oldValueString);
            }
            var newValue = parseFloat(obj.$parent.$data);

            obj.$parent.$parent.$parent.item.hourTotal = newValue + result;

            var updateString = 'obj.$parent.$parent.$parent.' + targetString + " = " + newValue;
            eval(updateString);
        }

        $scope.hourAddChange = function (obj) {
            var stringTable = [
                "item.mon_hour_add",
                "item.tue_hour_add",
                "item.wes_hour_add",
                "item.thu_hour_add",
                "item.fri_hour_add",
                "item.sat_hour_add",
                "item.sun_hour_add",
            ]
            var targetString = obj.$parent.$editable.name
            var result = 0;
            for (var index = 0; index < stringTable.length; index++) {
                if (targetString === stringTable[index]) {
                    continue;
                }
                var oldValueString = 'obj.$parent.$parent.' + stringTable[index];
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

            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].mainName : 'Not Set';
        };

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        // 20190711 決議
        $scope.showPrjNameEZ = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectData, {
                    prjDID: prjDID,
                });
            }

            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].ezName : 'Not Set';
        };

        $scope.showPrjCode = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectData, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].prjCode : 'Not Set';
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
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].name : 'Not Set';
        };

        $scope.showProjectManagerDID = function (prjDID) {
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
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].value : 'Not Set';
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
            return managerDID === $cookies.get('userDID');
        }

        // 對應行政總管
        $scope.isFitExecutive = function () {
            return ($scope.roleType == 100)
        }

        //讀取國定假日
        function loadNH(type) {
            $scope.nationalHolidayTables = [];
            var formData = {};
            switch (type) {
                case 1: {
                    formData = {
                        create_formDate: $scope.firstFullDate,
                        // year: thisYear,
                    }
                } break;
                case 4: {
                    formData = {
                        create_formDate: $scope.firstFullDate_history,
                        // year: thisYear,
                    }
                } break;
            }

            NationalHolidayUtil.fetchAllNationalHolidaysWithParameter(formData)
                .success(function (res) {
                    console.log(" ======== users National Holiday ======== ");
                    console.log(res.payload);
                    console.log(" ======== users National Holiday ======== ");
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

        //讀取補班日
        function loadOT(type) {
            $scope.overTimeTables = [];
            var fetchOverTimeData = {}
            switch (type) {
                case 1: {
                    fetchOverTimeData = {
                        create_formDate: $scope.firstFullDate,
                        // year: thisYear,
                    }
                } break;
                case 4: {
                    fetchOverTimeData = {
                        create_formDate: $scope.firstFullDate_history,
                        // year: thisYear,
                    }
                } break;
            }

            OverTimeDayUtil.fetchAllOverTimeDaysWithParameter(fetchOverTimeData)
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
                            $scope.overTimeTables.push(detail);
                        }
                    } else {
                        // res.payload.length == 0
                    }
                })
        }

        // 取得休假單
        // 個人、歷史
        function loadWorkOffTable(userDID, type) {

            $scope.userWorkOffTables = [];

            var create_formDate;

            switch (type) {
                case 1: {
                    create_formDate = $scope.firstFullDate;
                }
                break;
                case 4: {
                    create_formDate = $scope.firstFullDate_history;
                }
                break;
            }

            var getData = {
                creatorDID: userDID,
                year: null,
                month: null,
                isSendReview: null,
                isBossCheck: null,
                isExecutiveCheck: null,
                create_formDate: create_formDate
            }

            WorkOffFormUtil.findWorkOffTableFormByUserDID(getData)
                .success(function (res) {
                    console.log(" ======== users work off ======== ");
                    console.log(res.payload);
                    // 填入表單資訊
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
                        $scope.userWorkOffTables.push(detail);
                    }
                    for (var index = 0; index < $scope.userWorkOffTables.length; index++) {
                        if (!$scope.userWorkOffTables[index].isBossCheck || !$scope.userWorkOffTables[index].isExecutiveCheck) continue;
                        var evalFooter = "getHourDiffByTime($scope.userWorkOffTables[index].start_time, $scope.userWorkOffTables[index].end_time, " +
                            "$scope.userWorkOffTables[index].workOffType)";
                        switch ($scope.userWorkOffTables[index].day) {
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
        }

        // 計算小計
        $scope.showCalculateHour = function (tableIndex, firstFullDate, tables, day, type, tableForm) {
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
                            //正常工時表
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].mon_hour;
                                result += tables[index].tue_hour;
                                result += tables[index].wes_hour;
                                result += tables[index].thu_hour;
                                result += tables[index].fri_hour;
                                result += tables[index].sat_hour;
                                result += tables[index].sun_hour;
                            }

                            if (tableIndex === 0) {
                                //國定假日
                                if ($scope.checkIsCrossMonth(firstFullDate) > 7
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.sunNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 6
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.satNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 5
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.friNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 4
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.thuNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 3
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.wesNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 2
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.tueNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 1
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.monNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }

                                // 休假
                                if ($scope.checkIsCrossMonth(firstFullDate) > 7
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.sunOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 6
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.satOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 5
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.friOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 4
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.thuOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 3
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.wesOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 2
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.tueOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) > 1
                                    || $scope.checkIsCrossMonth(firstFullDate) < 0) {
                                    var evalString = "$scope.monOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                            } else {
                                //跨月表（下）
                                //國定假日
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 7) {
                                    var evalString = "$scope.sunNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 6) {
                                    var evalString = "$scope.satNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 5) {
                                    var evalString = "$scope.friNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 4) {
                                    var evalString = "$scope.thuNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 3) {
                                    var evalString = "$scope.wesNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 2) {
                                    var evalString = "$scope.tueNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 1) {
                                    var evalString = "$scope.monNH" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }

                                // 休假
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 7) {
                                    var evalString = "$scope.sunOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 6) {
                                    var evalString = "$scope.satOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 5) {
                                    var evalString = "$scope.friOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 4) {
                                    var evalString = "$scope.thuOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 3) {
                                    var evalString = "$scope.wesOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 2) {
                                    var evalString = "$scope.tueOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                                if ($scope.checkIsCrossMonth(firstFullDate) <= 1) {
                                    var evalString = "$scope.monOffTotal" + (type === 1 ? "" : "_history");
                                    eval("result += " + evalString);
                                }
                            }
                            return result;
                        }
                        case 2001: {
                            // 加班時數
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
                // 經理審核
                // 行政審核
                case 2:
                case 3: {
                    switch (day) {
                        case 1: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].mon_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 1);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 1);

                        } break;
                        case 2: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].tue_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 2);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 2);

                        } break;
                        case 3: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].wes_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 3);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 3);

                        } break;
                        case 4: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].thu_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 4);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 4);

                        } break;
                        case 5: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].fri_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 5);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 5);
                        } break;
                        case 6: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].sat_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 6);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 6);

                        } break;
                        case 7: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].sun_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 0);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 0);

                        } break;
                        case 1001: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].mon_hour;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].tue_hour;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].wes_hour;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].thu_hour;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].fri_hour;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].sat_hour;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].sun_hour;
                            }

                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 1);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 2);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 3);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 4);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 5);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 6);
                            result += $scope.showNHCalculateHour(tableIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 0);

                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 1);
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 2);
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 3);
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 4);
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 5);
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 6);
                            result += $scope.showWorkOffCalculateHour(tableIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 0);
                            return result;
                        }
                        case 2001: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].mon_hour_add;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].tue_hour_add;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].wes_hour_add;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].thu_hour_add;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].fri_hour_add;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].sat_hour_add;
                                result += $scope.fetchFormDataFromScope(tableForm)[index].sun_hour_add;
                            }
                            return result;
                        }
                    }
                } break;
            }
            if (result > 8) {
                return result;
            } else {
                return result;
            }
        }

        // Examine is cross Month
        $scope.checkIsCrossMonth = function (fullDate) {
            // console.log(fullDate);
            for (var index = 1; index < 7; index ++) {
                if ((moment(fullDate).day(index).month() + 1) !== (moment(fullDate).day(index + 1).month() + 1)) {
                    return index + 1;
                }
            }
            return -1;
        }

        // -------------------- Week Methods ---------------------
        $scope.weekShift = 0;
        $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);
        $scope.firstDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
        $scope.lastDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 6));

        $scope.reloadWeek = function(isInitial, type) {

            switch (type) {
                case 1: {
                    $scope.firstDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 0));
                    $scope.lastDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 6));

                    $scope.monDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 0));
                    $scope.tueDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 1));
                    $scope.wesDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 2));
                    $scope.thuDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 3));
                    $scope.friDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 4));
                    $scope.satDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 5));
                    $scope.sunDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate), 6));
                    if (!isInitial) {
                        $scope.getWorkHourTables();
                    }
                    if ($scope.checkIsCrossMonth($scope.firstFullDate) > 0) {
                        $scope.tables = [{
                            crossDay: $scope.checkIsCrossMonth($scope.firstFullDate),
                            tablesItems: [],
                        }, {
                            crossDay: $scope.checkIsCrossMonth($scope.firstFullDate),
                            tablesItems: [],
                        }];
                    } else {
                        $scope.tables = [{
                            tablesItems: [],
                        }];
                    }
                    console.log("reloadWeek main, cross day= " + $scope.checkIsCrossMonth($scope.firstFullDate));
                }
                break;
                case 4: {
                    $scope.firstDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 0));
                    $scope.lastDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 6));

                    $scope.monDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 0));
                    $scope.tueDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 1));
                    $scope.wesDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 2));
                    $scope.thuDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 3));
                    $scope.friDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 4));
                    $scope.satDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 5));
                    $scope.sunDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_history), 6));
                    if (!isInitial) {
                        $scope.showHistoryTable();
                    }
                    if ($scope.checkIsCrossMonth($scope.firstFullDate_history) > 0) {
                        $scope.tables_history = [{
                            crossDay: $scope.checkIsCrossMonth($scope.firstFullDate_history),
                            tablesItems: [],
                        }, {
                            crossDay: $scope.checkIsCrossMonth($scope.firstFullDate_history),
                            tablesItems: [],
                        }];
                    } else {
                        $scope.tables_history = [{
                            tablesItems: [],
                        }];
                    }
                    console.log("reloadWeek history= " + $scope.checkIsCrossMonth($scope.firstFullDate_history));
                }
                break;
                case 5: {
                    $scope.firstDate_management = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_management), 0));
                    $scope.lastDate_management = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_management), 6));
                    $scope.showManagementList();
                }
                break;
            }

        }
        $scope.reloadWeek(true, 1);

        $scope.addWeek = function (type) {
            // $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0 + (7 * $scope.weekShift));
            console.log("addWeek type= " + type);
            switch(type) {
                case 1: { // main page
                    $scope.firstFullDate = moment($scope.firstFullDate).day(8).format('YYYY/MM/DD');
                    $scope.reloadWeek(false, 1);
                }
                break;
                case 2: { // manager review
                    $scope.firstFullDate_manager = moment($scope.firstFullDate_manager).day(8).format('YYYY/MM/DD');
                    $scope.showRelatedMembersTableReview(typeManager);
                }
                break;
                case 3: { // executive reviewe
                    $scope.firstFullDate_executive = moment($scope.firstFullDate_executive).day(8).format('YYYY/MM/DD');
                    $scope.showRelatedMembersTableReview(typeExecutive);
                }
                break;
                case 4: { // history view
                    $scope.firstFullDate_history = moment($scope.firstFullDate_history).day(8).format('YYYY/MM/DD');
                    // $scope.reloadWeek_history(false);
                    $scope.reloadWeek(false, 4);
                }
                break;
                case 5: { // management list
                    $scope.firstFullDate_management = moment($scope.firstFullDate_management).day(8).format('YYYY/MM/DD');
                    $scope.reloadWeek(false, 5);
                }
                break;
            }
        }

        $scope.decreaseWeek = function (type) {
            console.log("decreaseWeek type= " + type);
            switch(type) {
                case 1: {
                    $scope.firstFullDate = moment($scope.firstFullDate).day(-6).format('YYYY/MM/DD');
                    $scope.reloadWeek(false, 1);
                }
                break;
                case 2: {
                    $scope.firstFullDate_manager = moment($scope.firstFullDate_manager).day(-6).format('YYYY/MM/DD');
                    $scope.showRelatedMembersTableReview(typeManager);
                }
                break;
                case 3: {
                    $scope.firstFullDate_executive = moment($scope.firstFullDate_executive).day(-6).format('YYYY/MM/DD');
                    $scope.showRelatedMembersTableReview(typeExecutive);
                }
                break;
                case 4: {
                    $scope.firstFullDate_history = moment($scope.firstFullDate_history).day(-6).format('YYYY/MM/DD');
                    // $scope.reloadWeek_history(false);
                    $scope.reloadWeek(false, 4);
                }
                break;
                case 5: {
                    $scope.firstFullDate_management = moment($scope.firstFullDate_management).day(-6).format('YYYY/MM/DD');
                    $scope.reloadWeek(false, 5);
                }
                break;
            }
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
        $scope.showWorkAddModal = function (table, specificDay, editable) {
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
                        return specificDay;
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
                        switch (specificDay) {
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
                        $scope.createSubmit(100, false);
                    })
                    .error(function () {
                        console.log('ERROR WorkHourAddItemUtil.createWorkHourAddItem')
                    })
            });
        };

        // ************************ CREATE SUBMIT ***************************
        $scope.createSubmit = function (delayTime, isRefreshProjectSelector) {
            return $timeout(function () {

                if ($cookies.get('userDID') == undefined ||
                    $cookies.get('userDID') == null ||
                    $cookies.get('userDID') == "null") {
                    window.location.reload();
                    return;
                }


                // 更新old Table ID Array
                var needUpdateWorkTableIDArray = [];
                for (var majorIndex = 0; majorIndex < $scope.tables.length; majorIndex ++) {
                    var tableIndex = 0;
                    // 工時表內的 列表數
                    var workItemCount = $("tbody[id='tableItemBody" + majorIndex + "']").length;
                    // send Data
                    var workHourTableData = [];
                    // console.log("isRefreshProjectSelector= " + isRefreshProjectSelector);
                    if (workItemCount === 0) {
                        if (isRefreshProjectSelector) {
                            $timeout(function () {
                                $scope.getWorkHourTables();
                            }, 300)
                        }
                    }

                    for (var itemIndex = 0; itemIndex < workItemCount; itemIndex++) {
                        var itemPrjCode = $('tbody').find("span[id^='prjCode" + majorIndex + "']")[itemIndex].innerText;
                        var itemPrjDID = $('tbody').find("span[id='prjDID" + majorIndex + "']")[itemIndex].innerText;
                        //MON
                        var mon_hour = $('tbody').find("span[id='mon_hour" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='mon_hour" + majorIndex + "']")[itemIndex].innerText;
                        var mon_memo = $('tbody').find("span[id='mon_memo" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='mon_memo" + majorIndex + "']")[itemIndex].innerText;
                        var mon_hour_add = $('tbody').find("span[id='mon_hour_add" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='mon_hour_add" + majorIndex + "']")[itemIndex].innerText;
                        var mon_memo_add = $('tbody').find("span[id='mon_memo_add" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='mon_memo_add" + majorIndex + "']")[itemIndex].innerText;
                        //TUE
                        var tue_hour = $('tbody').find("span[id='tue_hour" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='tue_hour" + majorIndex + "']")[itemIndex].innerText;
                        var tue_memo = $('tbody').find("span[id='tue_memo" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='tue_memo" + majorIndex + "']")[itemIndex].innerText;
                        var tue_hour_add = $('tbody').find("span[id='tue_hour_add" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='tue_hour_add" + majorIndex + "']")[itemIndex].innerText;
                        var tue_memo_add = $('tbody').find("span[id='tue_memo_add" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='tue_memo_add" + majorIndex + "']")[itemIndex].innerText;
                        //WES
                        var wes_hour = $('tbody').find("span[id='wes_hour" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='wes_hour" + majorIndex + "']")[itemIndex].innerText;
                        var wes_memo = $('tbody').find("span[id='wes_memo" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='wes_memo" + majorIndex + "']")[itemIndex].innerText;
                        var wes_hour_add = $('tbody').find("span[id='wes_hour_add" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='wes_hour_add" + majorIndex + "']")[itemIndex].innerText;
                        var wes_memo_add = $('tbody').find("span[id='wes_memo_add" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='wes_memo_add" + majorIndex + "']")[itemIndex].innerText;
                        //THU
                        var thu_hour = $('tbody').find("span[id='thu_hour" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='thu_hour" + majorIndex + "']")[itemIndex].innerText;
                        var thu_memo = $('tbody').find("span[id='thu_memo" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='thu_memo" + majorIndex + "']")[itemIndex].innerText;
                        var thu_hour_add = $('tbody').find("span[id='thu_hour_add" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='thu_hour_add" + majorIndex + "']")[itemIndex].innerText;
                        var thu_memo_add = $('tbody').find("span[id='thu_memo_add" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='thu_memo_add" + majorIndex + "']")[itemIndex].innerText;
                        //FRI
                        var fri_hour = $('tbody').find("span[id='fri_hour" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='fri_hour" + majorIndex + "']")[itemIndex].innerText;
                        var fri_memo = $('tbody').find("span[id='fri_memo" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='fri_memo" + majorIndex + "']")[itemIndex].innerText;
                        var fri_hour_add = $('tbody').find("span[id='fri_hour_add" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='fri_hour_add" + majorIndex + "']")[itemIndex].innerText;
                        var fri_memo_add = $('tbody').find("span[id='fri_memo_add" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='fri_memo_add" + majorIndex + "']")[itemIndex].innerText;
                        //SAT
                        var sat_hour = $('tbody').find("span[id='sat_hour" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='sat_hour" + majorIndex + "']")[itemIndex].innerText;
                        var sat_memo = $('tbody').find("span[id='sat_memo" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='sat_memo" + majorIndex + "']")[itemIndex].innerText;
                        var sat_hour_add = $('tbody').find("span[id='sat_hour_add" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='sat_hour_add" + majorIndex + "']")[itemIndex].innerText;
                        var sat_memo_add = $('tbody').find("span[id='sat_memo_add" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='sat_memo_add" + majorIndex + "']")[itemIndex].innerText;
                        //SUN
                        var sun_hour = $('tbody').find("span[id='sun_hour" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='sun_hour" + majorIndex + "']")[itemIndex].innerText;
                        var sun_memo = $('tbody').find("span[id='sun_memo" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='sun_memo" + majorIndex + "']")[itemIndex].innerText;
                        var sun_hour_add = $('tbody').find("span[id='sun_hour_add" + majorIndex + "']").length === 0 ? 0
                            : $('tbody').find("span[id='sun_hour_add" + majorIndex + "']")[itemIndex].innerText;
                        var sun_memo_add = $('tbody').find("span[id='sun_memo_add" + majorIndex + "']").length === 0 ? ""
                            : $('tbody').find("span[id='sun_memo_add" + majorIndex + "']")[itemIndex].innerText;

                        var tableItem = {
                            creatorDID: $cookies.get('userDID'),
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
                            isSendReview: $scope.tables[majorIndex].tablesItems[itemIndex].isSendReview,
                            isManagerCheck: $scope.tables[majorIndex].tablesItems[itemIndex].isManagerCheck,
                            isExecutiveCheck: $scope.tables[majorIndex].tablesItems[itemIndex].isExecutiveCheck,

                            // Reject
                            isManagerReject: $scope.tables[majorIndex].tablesItems[itemIndex].isManagerReject,
                            managerReject_memo: $scope.tables[majorIndex].tablesItems[itemIndex].managerReject_memo,

                            isExecutiveReject: $scope.tables[majorIndex].tablesItems[itemIndex].isExecutiveReject,
                            executiveReject_memo: $scope.tables[majorIndex].tablesItems[itemIndex].executiveReject_memo,

                            userMonthSalary: $scope.tables[majorIndex].tablesItems[itemIndex].userMonthSalary,
                        }
                        workHourTableData.push(tableItem);
                        console.log(tableItem);
                    }

                    var sendMonth = moment($scope.firstFullDate).month() + 1;
                    var sendYear = moment($scope.firstFullDate).year() - 1911;


                    switch (majorIndex) {
                        case 0:
                            sendMonth = moment($scope.firstFullDate).month() + 1;
                            sendYear = moment($scope.firstFullDate).year() - 1911;
                            break;
                        case 1:
                            sendMonth = (moment($scope.firstFullDate).month()) === 11 ? 1
                                : (moment($scope.firstFullDate).month() + 2);
                            sendYear = (moment($scope.firstFullDate).month()) === 11 ? moment($scope.firstFullDate).year() - 1911 + 1
                                : moment($scope.firstFullDate).year() - 1911
                            break;
                    }

                    var formData = {
                        year: sendYear,
                        month: sendMonth,
                        creatorDID: $cookies.get('userDID'),
                        create_formDate: $scope.firstFullDate,
                        // workHourTableData 為 []，也要送，作為更新。
                        formTables: workHourTableData,
                        oldTables: needRemoveOldTable,
                    };

                    console.log(formData);

                    WorkHourUtil.removeWorkHourTableForm(formData)
                        .success(function (res) {

                            console.log(res);

                            var createFormData = {
                                year: res.payload.year,
                                month: res.payload.month,
                                creatorDID: res.payload.creatorDID,
                                create_formDate: res.payload.create_formDate,
                                // workHourTableData 為 []，也要送，作為更新。
                                formTables: res.payload.formTables,
                                oldTables: res.payload.oldTables,
                            };

                            // TODO 跨月
                            WorkHourUtil.createWorkHourTableForm(createFormData)
                                .success(function (res) {
                                    var workIndex = tableIndex;
                                    tableIndex++;
                                    // // 更新old Table ID Array
                                    // var workTableIDArray = [];
                                    if (res.payload.length > 0) {
                                        for (var index = 0; index < res.payload.length; index++) {
                                            needUpdateWorkTableIDArray.push(res.payload[index].tableID);
                                            $scope.tables[workIndex].tablesItems[index].tableID = res.payload[index].tableID; // for send to review.
                                        }
                                    }
                                    // 移除舊有 tableID;
                                    needRemoveOldTable = {
                                        tableIDArray: needUpdateWorkTableIDArray,
                                    }
                                    sleep(500);
                                    if (isRefreshProjectSelector && tableIndex === $scope.tables.length) {
                                        $scope.getWorkHourTables();
                                    }
                                })
                                .error(function () {
                                    console.log('ERROR WorkHourUtil.createWorkHourTableForm');
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'mainPage_workHour'
                                        });
                                    }, 500)
                                })
                        })
                        .error(function () {
                            console.log('ERROR WorkHourUtil.createWorkHourTableForm');
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_workHour'
                                });
                            }, 500)
                        })

                }
            }, delayTime);
        }

        // 提醒使用者工時表時數 Via Dialog
        $scope.reviewFormCheck = function(tableIndex) {

            // 國定假日
            var NHCount = 0;
            var NHCount_befor_cross = 0;
            var NHCount_after_cross = 0;
            console.log($scope.nationalHolidayTables);
            for (var index = 0; index < $scope.nationalHolidayTables.length; index ++) {
                if ($scope.nationalHolidayTables[index].isEnable) {
                    NHCount++
                    if ($scope.nationalHolidayTables[index].day >= $scope.checkIsCrossMonth($scope.firstFullDate) || $scope.nationalHolidayTables[index].day === 0) {
                        NHCount_after_cross ++;
                    } else {
                        NHCount_befor_cross ++;
                    }
                }
            }
            console.log("National Holiday (國定假日) counts= " + NHCount);

            // 補班日
            var OTCount = 0;
            var OTCount_befor_cross = 0;
            var OTCount_after_cross = 0;
            console.log($scope.overTimeTables);
            for (var index = 0; index < $scope.overTimeTables.length; index ++) {
                console.log($scope.overTimeTables[index].day === 0);
                console.log("補班日= " + $scope.overTimeTables[index].day);
                if ($scope.overTimeTables[index].isEnable) {
                    OTCount++
                    console.log();
                    if ($scope.overTimeTables[index].day >= $scope.checkIsCrossMonth($scope.firstFullDate) || $scope.overTimeTables[index].day === 0) {
                        OTCount_after_cross ++;
                    } else {
                        OTCount_befor_cross ++;
                    }
                }
            }
            console.log("Over Time (補班日) counts= " + OTCount);

            // 每周工作天 = 5
            var weeklyWorkDay = 5;
            var reviewWorkDay = weeklyWorkDay + OTCount - NHCount;

            // 有跨週情形，跨週日
            console.log("checkIsCrossMonth (跨週日)= " + $scope.checkIsCrossMonth($scope.firstFullDate));
            if ($scope.checkIsCrossMonth($scope.firstFullDate) > 0) {
                switch(tableIndex) {
                    case 0:
                        // console.log("cross work day= " + ($scope.checkIsCrossMonth($scope.firstFullDate) > 5 ? 5 : $scope.checkIsCrossMonth($scope.firstFullDate) - 1));
                        weeklyWorkDay = ($scope.checkIsCrossMonth($scope.firstFullDate) > 5 ? 5 : $scope.checkIsCrossMonth($scope.firstFullDate) - 1);
                        console.log("上表單，OTCount_befor_cross= " + OTCount_befor_cross);
                        console.log("上表單，NHCount_befor_cross= " + NHCount_befor_cross);
                        reviewWorkDay = weeklyWorkDay + OTCount_befor_cross - NHCount_befor_cross;
                        break;
                    case 1:
                        // console.log("cross work day= " + ($scope.checkIsCrossMonth($scope.firstFullDate) > 5 ? 0 : (weeklyWorkDay - ($scope.checkIsCrossMonth($scope.firstFullDate)) + 1)));
                        weeklyWorkDay =  ($scope.checkIsCrossMonth($scope.firstFullDate) > 5 ? 0 : (weeklyWorkDay - ($scope.checkIsCrossMonth($scope.firstFullDate)) + 1));
                        console.log("下表單，OTCount_after_cross= " + OTCount_after_cross);
                        console.log("下表單，NHCount_after_cross= " + NHCount_after_cross);
                        reviewWorkDay = weeklyWorkDay + OTCount_after_cross - NHCount_after_cross;
                        break;
                }
            }
            console.log("reviewWorkDay (工作日) counts= " + reviewWorkDay + ", hours= " + $scope.showCalculateHour(tableIndex, $scope.firstFullDate, $scope.tables[tableIndex].tablesItems, 1001, 1));

            if ($scope.showCalculateHour(tableIndex, $scope.firstFullDate, $scope.tables[tableIndex].tablesItems, 1001, 1) !== ((reviewWorkDay + NHCount_after_cross - OTCount_after_cross) * 8)) {
                $scope.titleClass = 'bg-danger';
                $scope.checkText = '該周工時表時數非 ' + ((reviewWorkDay)  * 8) + '，確定提交 審查？';
            } else {
                $scope.titleClass = 'bg-warning';
                $scope.checkText = '工作時數確認正確 ' + ((reviewWorkDay)  * 8) +' ，確定提交 審查？';
            }
            $scope.reviewTableIndex = tableIndex;

            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormReviewModalTotal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 使用者確認提交
        $scope.reviewForm = function(tableIndex) {
            $timeout(function () {
                var tableList = [];
                var targetList = [];
                var msgTopicList = [];
                var msgDetailList = [];
                var memoList = [];
                for (var index = 0; index < $scope.tables[tableIndex].tablesItems.length; index ++) {
                    console.log($scope.tables[tableIndex].tablesItems[index]);
                    tableList[index] = $scope.tables[tableIndex].tablesItems[index].tableID;
                    console.log($scope.tables[tableIndex].tablesItems[index].isSendReview);
                    if (!$scope.tables[tableIndex].tablesItems[index].isSendReview) { // 未被審查的項目 才需要通知；已經遞交審查的不通知
                        if (!targetList.includes($scope.showProjectManagerDID($scope.tables[tableIndex].tablesItems[index].prjDID))) { // 一張表格多個項目有相同的經理的話，只通知一次
                            targetList[index] = $scope.showProjectManagerDID($scope.tables[tableIndex].tablesItems[index].prjDID);
                            memoList[index] = $scope.tables[tableIndex].tablesItems[index].create_formDate;
                            msgTopicList[index] = 1000;
                            msgDetailList[index] = 1001;
                        }
                    }
                }

                // 更改 table status
                var formData = {
                    creatorDID: $cookies.get('userDID'),
                    tableArray: tableList,
                }
                console.log(formData);
                WorkHourUtil.updateTotalTableSendReview(formData)
                    .success(function (res) {
                        // console.log(res.code);
                        // var formData = {
                        //     creatorDID: cookies.get('userDID'),
                        //     // msgTargetID: cookies.get('bossID'),
                        //     // tableArray: tableList,
                        //     msgTargetArray: targetList,
                        //     msgMemoArray: memoList,
                        //     msgTopicArray: msgTopicList,
                        //     msgDetailArray: msgDetailList,
                        // }
                        // NotificationMsgUtil.createMsgItem(formData)
                        //     .success(function (req) {
                        //
                        //     })
                        $scope.getWorkHourTables();
                    })
            }, 1000);
        }

        // ********************** 專案經理確認 *****************************
        // 主要顯示
        // $scope.tablesManagerItems = [];

        // -------------------- Week Methods Manager---------------------
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

        // ********************** 歷史檢視 *****************************
        // 主要顯示
        $scope.tables_history = {
            tablesItems: [],
        };
        $scope.tablesHistoryItems = [];

        // -------------------- Week Methods History---------------------
        // $scope.weekShift_history = 0; //@Deprecated
        $scope.firstFullDate_history = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);
        $scope.firstDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));

        $scope.reloadWeek(true, 4);

        //歷史檢視取得相關人員表，以人為選取單位
        $scope.showHistoryTable = function () {
            initialUserTable(4);

            bsLoadingOverlayService.start({
                referenceId: 'history_workHour'
            });

            var getData = {
                creatorDID: vm.history.selected._id,
                create_formDate: $scope.firstFullDate_history,
            }
            WorkHourUtil.getWorkHourForm(getData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        for (var majorIndex = 0; majorIndex < res.payload.length; majorIndex ++) {
                            var tableIndex = 0;
                            var workItemCount = res.payload[majorIndex].formTables.length;

                            var prjIDArray = [];
                            var workTableIDArray = [];
                            // 組成 prjID Array, TableID Array，再去Server要資料
                            for (var index = 0; index < workItemCount; index++) {
                                workTableIDArray[index] = res.payload[majorIndex].formTables[index].tableID;
                                prjIDArray[index] = res.payload[majorIndex].formTables[index].prjDID;
                            }
                            formDataTable = {
                                tableIDArray: workTableIDArray,
                                isFindSendReview: true,
                                // isFindManagerCheck: false,
                                isFindManagerCheck: null,
                                isFindExecutiveCheck: null,
                                isFindManagerReject: null,
                                isFindExecutiveReject: null
                            }

                            // 取得 Table Data
                            WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                                .success(function (res) {
                                    var workIndex = tableIndex;
                                    tableIndex++;
                                    // 填入表單資訊
                                    for (var index = 0; index < res.payload.length; index++) {
                                        var detail = {
                                            tableID: res.payload[index]._id,
                                            prjDID: res.payload[index].prjDID,
                                            create_formDate: res.payload[index].create_formDate,
                                            creatorDID: res.payload[index].creatorDID,
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
                                        // console.log("workIndex= " + workIndex);
                                        $scope.tables_history[workIndex].tablesItems.push(detail);
                                    }
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'history_workHour'
                                        });
                                    }, 500)
                                })
                                .error(function () {
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'history_workHour'
                                        });
                                    }, 500)
                                    console.log('ERROR WorkHourUtil.findWorkHourTableFormByTableIDArray');
                                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                                })
                        }
                        loadWorkOffTable(vm.history.selected._id, 4);
                        loadNH(4);
                        loadOT(4);
                    } else {
                        $scope.loading = false;

                        bsLoadingOverlayService.stop({
                            referenceId: 'history_workHour'
                        });
                    }
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'history_workHour'
                        });
                    }, 500)
                    console.log('ERROR WorkHourUtil.getWorkHourForm');
                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                })
        }

        //專案經理確認 -1
        $scope.reviewWHManagerItem = function (user, item, index) {
            $scope.checkText = '確定 同意：' +
                $scope.showPrjName(item.prjDID) +
                "  ？";
            $scope.checkingForm = user;
            $scope.checkingTable = item;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormAgree_ManagerModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }
        //專案經理確認 -2
        $scope.sendWHManagerAgree = function (user, item, index) {
            var formData = {
                tableID: item.tableID,
                // isSendReview: null,
                isManagerCheck: true,
                // isExecutiveCheck: null,
            }
            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    $scope.showTableOfItem(user, null, null, null, null, null, 1);
                })
        }

        //專案經理一鍵確認 -1
        $scope.reviewWHManagerAll = function (user, form, index) {
            console.log(user);
            console.log(form);
            // console.log(form[0]);
            // console.log($scope.fetchFormDataFromScope(form[0]));
            // $scope.checkText = '確定 同意： ' + '\n';
            for (var formIndex = 0; formIndex < form.length; formIndex ++) {
                for (var index = 0; index < $scope.fetchFormDataFromScope(form[formIndex]).length; index ++) {
                    if (managersRelatedProjects.includes($scope.fetchFormDataFromScope(form[formIndex])[index].prjDID)) { // 只跟自己有關的專案
                        // console.log($scope.fetchFormDataFromScope(form[formIndex])[index].prjDID);
                    }
                }
            }
            $scope.checkText = "確定 同意： 全部 ？";
            $scope.checkingForm = user;
            $scope.checkingTable = form;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormAgree_ManagerAllModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }
        //專案經理一鍵確認 -2
        $scope.sendWHManagerAllAgree = function (user, form, index) {
            var updateTables = [];
            for (var formIndex = 0; formIndex < form.length; formIndex ++) {
                for (var index = 0; index < $scope.fetchFormDataFromScope(form[formIndex]).length; index ++) {
                    if (managersRelatedProjects.includes($scope.fetchFormDataFromScope(form[formIndex])[index].prjDID)) { // 只跟自己有關的專案
                        // console.log($scope.fetchFormDataFromScope(form[0])[index].prjDID);
                        if ($scope.fetchFormDataFromScope(form[formIndex])[index].isSendReview) { // 已經送審的才更新
                            updateTables.push($scope.fetchFormDataFromScope(form[formIndex])[index].tableID);
                        }
                    }
                }
            }
            var formData = {
                tableIDs: updateTables,
                // isSendReview: null,
                isManagerCheck: true,
                // isExecutiveCheck: null,
            }

            var targetList = ["5b3c65903e93d2f3b0a0c582"];
            var msgTopicList = [1000];
            var msgDetailList = [1002];
            var memoList = [$scope.firstFullDate_manager];

            WorkHourUtil.updateWHTableArray(formData)
                .success(function (res) {

                    // var formData = {
                    //     creatorDID: user.DID,
                    //     msgTargetArray: targetList,
                    //     msgMemoArray: memoList,
                    //     msgTopicArray: msgTopicList,
                    //     msgDetailArray: msgDetailList,
                    // }
                    // NotificationMsgUtil.createMsgItem(formData)
                    //     .success(function (req) {
                    //
                    //     })
                    //     .error(function (req) {
                    //         $scope.fetchRelatedMembers();
                    //     })
                    $scope.fetchRelatedMembers();
                })
        }

        //專案經理退回 -1
        $scope.disagreeWHItem_manager = function (user, item, index) {
            $scope.checkText = '確定 退回：' +
                $scope.showPrjName(item.prjDID) +
                "  ？";
            $scope.checkingForm = user;
            $scope.checkingTable = item;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormDisAgree_ManagerModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 專案經理退回 -2
        $scope.sendWHDisagree_manager = function (user, item, index, rejectMsg) {
            var formData = {
                tableID: item.tableID,
                isSendReview: false,
                isManagerCheck: false,
                isExecutiveCheck: false,
                isManagerReject: true,
                isExecutiveReject: false,
                managerReject_memo: rejectMsg,
            }

            var targetList = [item.creatorDID];
            var msgTopicList = [1000];
            var msgDetailList = [1003];
            var memoList = [item.create_formDate];

            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {

                    // var formData = {
                    //     creatorDID: cookies.get('userDID'),
                    //     msgTargetArray: targetList,
                    //     msgMemoArray: memoList,
                    //     msgTopicArray: msgTopicList,
                    //     msgDetailArray: msgDetailList,
                    // }
                    // NotificationMsgUtil.createMsgItem(formData)
                    //     .success(function (req) {
                    //
                    //     })
                    $scope.showTableOfItem(user, null, null, null, null, null, 1);
                })
        }

        // ********************** 行政確認 *****************************
        // 主要顯示
        // $scope.tablesExecutiveItems = [];

        // -------------------- Week Methods Executive---------------------
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

        // Deprecated
        //行政確認 -1
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
        //行政確認 -2
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
                    $scope.showTableOfItem(form, null, null, null, null, null, 2);
                })
        }

        //行政總管退回 -1
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
        //行政總管退回 -2
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

            var targetList = [checkingTable.creatorDID];
            var msgTopicList = [1000];
            var msgDetailList = [1004];
            var memoList = [checkingTable.create_formDate];

            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {

                    // var formData = {
                    //     creatorDID: cookies.get('userDID'),
                    //     msgTargetArray: targetList,
                    //     msgMemoArray: memoList,
                    //     msgTopicArray: msgTopicList,
                    //     msgDetailArray: msgDetailList,
                    // }
                    // NotificationMsgUtil.createMsgItem(formData)
                    //     .success(function (req) {
                    //
                    //     })
                    $scope.showTableOfItem(form, null, null, null, null, null, 2);
                })
        }

        //行政總管一鍵確認 -1
        $scope.reviewWHExecutiveAll = function (user, form, index) {
            // console.log(form);
            // console.log(user);
            // console.log(workAddTableIDArray);
            for (var formIndex = 0; formIndex < form.length; formIndex ++) {
                for (var index = 0; index < $scope.fetchFormDataFromScope(form[formIndex]).length; index++) {
                    // 行政總管跟所有專案有關
                    if ($scope.fetchFormDataFromScope(form[formIndex])[index].isManagerCheck) { // 經理審查過的的才更新
                        // updateTables.push(form[0].formTables[index].tableID);
                        // console.log($scope.fetchFormDataFromScope(form[0])[index].tableID);
                    }
                }
            }
            $scope.checkText = "確定 同意： 全部 ？";
            $scope.checkingForm = user;
            $scope.checkingTable = form;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormAgree_ExecutiveAllModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }
        //行政總管一鍵確認 -2
        $scope.sendWHExecutiveAllAgree = function (user, form, index) {
            // console.log(form);
            var updateTables = [];
            for (var formIndex = 0; formIndex < form.length; formIndex ++) {
                for (var index = 0; index < $scope.fetchFormDataFromScope(form[formIndex]).length; index++) {
                    // 行政總管跟所有專案有關
                    if ($scope.fetchFormDataFromScope(form[formIndex])[index].isManagerCheck) { // 經理審查過的的才更新
                        updateTables.push($scope.fetchFormDataFromScope(form[formIndex])[index].tableID);
                    }
                }
            }
            // console.log(form[index]);
            var formData = {
                tableIDs: updateTables,
                // isSendReview: null,
                // isManagerCheck: true,
                isExecutiveCheck: true,
            }
            // console.log(formData);
            WorkHourUtil.updateWHTableArray(formData)
                .success(function (res) {
                    // $scope.fetchManagerRelatedMembers();
                    // $scope.fetchExecutiveRelatedMembers();

                    var targetList = [user.DID];
                    var msgTopicList = [1000];
                    var msgDetailList = [1005];
                    var memoList = [$scope.firstFullDate_executive];

                    WorkHourAddItemUtil.updateRelatedAddItemByProject(formData)
                        .success(function (res) {

                            // var formData = {
                            //     creatorDID: cookies.get('userDID'),
                            //     msgTargetArray: targetList,
                            //     msgMemoArray: memoList,
                            //     msgTopicArray: msgTopicList,
                            //     msgDetailArray: msgDetailList,
                            // }
                            // NotificationMsgUtil.createMsgItem(formData)
                            //     .success(function (req) {
                            //
                            //     })
                            $scope.showTableOfItem(user, null, null, null, null, null, 2);
                        })
                        .error(function () {
                        })


                })
            var formData = {
                formTables: workAddTableIDArray,
            }
            // console.log(formData);
            if (workAddTableIDArray.length != 0) {
                WorkHourAddItemUtil.executiveConfirm(formData)
                    .success(function () {
                        toastr.success('確認成功', 'Success');
                    })
                    .error(function () {

                    })
            }

        }

        // ************* 行政核定後退回 ****************
        //行政核定後退回 -1
        $scope.repentWHItem_executive = function (form, table, index) {

            $scope.checkText = '確定 恢復成行政審核前狀態：' +
                $scope.showPrjName(table.prjDID) +
                "  ？";
            $scope.checkingForm = form;
            $scope.checkingTable = table;
            $scope.mIndex = index;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormRepent_ExecutiveModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }
        //行政核定後退回 -2
        $scope.sendWHRepent_executive = function (form, checkingTable, index) {

            var formData = {
                tableID: checkingTable.tableID,
                isSendReview: true,
                isManagerCheck: true,
                isExecutiveCheck: false,
                isManagerReject: false,
                isExecutiveReject: false,
            }
            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    // console.log(res.code);
                    checkingTable.isExecutiveCheck = false;
                })

            var formData = {
                creatorDID: checkingTable.creatorDID,
                prjDID: checkingTable.prjDID,
                create_formDate: $scope.firstFullDate_history,
                // workAddType: 2 // 換休加班都 退核
            }

            WorkHourAddItemUtil.updateItemRepent(formData)
                .success(function () {
                })
                .error(function () {
                })
        }

        // function // 休假
        function getHourDiffByTime(start, end, workOffType) {
            // console.log("- function WorkHourTableFormCtrl, start= " + start + ", end= " + end + ", type= " + type);
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
                    // console.log(result[0])
                    // console.log(result[1])
                    result = result[0] + (result[1] > 0 ? 0.5 : 0);
                    // console.log(result)
                } else {
                    result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                }

                console.log(result);

                var resultFinal;
                if (TimeUtil.getHour(start) <= 12 && TimeUtil.getHour(end) >= 13) {
                    if (workOffType == 2) {
                        resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 0.5 : result -1;
                    } else {
                        resultFinal = result <= 1 ? 0 : result >= 9 ? 8 : result - 1 < 1 ? 1 : result -1;
                    }
                } else {
                    if (workOffType == 2) {
                        resultFinal = result < 1 ? 0.5 : result >= 8 ? 8 : result;
                    } else {
                        resultFinal = result < 1 ? 1 : result >= 8 ? 8 : result;
                    }
                    // resultFinal = result <= 1 ? 1 : result >= 8 ? 8 : result;
                }

                // 總攬
                if (workOffType == 3 || workOffType == 4 || workOffType == 5
                    || workOffType == 7 || workOffType == 8 || workOffType == 9) {

                    resultFinal = resultFinal <= 4 ? 4 : 8;
                }

                console.log(resultFinal);

                return resultFinal;

            }
        }

        $scope.getHourDiffByTime = function (start, end) {
            console.log("- WorkHourTableFormCtrl, start= " + start + ", end= " + end + ", type= " + type);
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

                // formatting (0 padding and concatenation)
                // result = result.map(function (v) {
                //     return v < 10 ? '0' + v : v;
                // }).join(':');

                result = result[0] + (result[1] > 30 ? 1 : result[1] === 0 ? 0 : 0.5);
                return result <= 1 ? 1 : result >= 8 ? 8 : result;

            }
        }

        Object.size = function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

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
        // Deprecated
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

        var managersRelatedProjects = [];

        //顯示經理審查人員
        // Fetch Manager Related Members
        $scope.fetchRelatedMembers = function () {

            var formData = {
                relatedID: $cookies.get('userDID'),
            }
            var relatedMembers = [];

            switch($scope.roleType) {
                case "6": // 主任
                case "2": // 經理
                    Project.getProjectRelatedToManager(formData)
                        .success(function (relatedProjects) {
                            console.log(relatedProjects);
                            for(var index = 0; index < relatedProjects.length; index ++) {
                                // 相關專案
                                managersRelatedProjects.push(relatedProjects[index]._id);
                            }

                            // 工時表有填寫過的項目就會出現
                            User.getAllUsers()
                                .success(function (allUsers) {

                                    for (var index = 0; index < allUsers.length; index ++) {
                                        relatedMembers.push(allUsers[index]._id);
                                    }
                                    $scope.mainRelatedMembers = relatedMembers;
                                    $scope.showRelatedMembersTableReview(typeManager);
                                });
                        })
                    break;
                case "100": //顯示行政審查人員
                    Project.getProjectRelatedToManager(formData)
                        .success(function (relatedProjects) {
                            console.log(" ======== Projects related to manager  ======== ");
                            console.log(relatedProjects);
                            console.log(" ======== Projects related to manager  ======== ");
                            for(var index = 0; index < relatedProjects.length; index ++) {
                                // 相關專案
                                managersRelatedProjects.push(relatedProjects[index]._id);
                            }

                            // 行政總管跟每個人都有關

                            // // 所有人，對照資料
                            User.getAllUsers()
                                .success(function (allUsers) {
                                    var relatedMembers_all = [];

                                    vm.executiveUsers = allUsers;

                                    for (var index = 0; index < vm.executiveUsers.length; index ++) {
                                        relatedMembers_all.push(vm.executiveUsers[index]._id);
                                        relatedMembers.push(vm.executiveUsers[index]._id);
                                    }
                                    $scope.mainRelatedMembers = relatedMembers;
                                    $scope.showRelatedMembersTableReview(typeManager);
                                    $scope.mainRelatedMembers_all = relatedMembers_all;
                                    $scope.showRelatedMembersTableReview(typeExecutive);
                                });
                        })
                    break;
            }
        }

        var typeManager = 1;
        var typeExecutive = 2;

        // show Related Members Table Review.
        $scope.showRelatedMembersTableReview = function(type) {

            var targetFormFullDate = undefined;

            $scope.userMap_review = [];

            $scope.tables_review = [];
            //紀錄 manager, executive review data.
            $scope.tables_review.tablesItems = [];

            var getData = {
                relatedMembers: $scope.mainRelatedMembers,
                create_formDate: targetFormFullDate,
            }

            switch(type) {
                case typeManager: {

                    bsLoadingOverlayService.start({
                        referenceId: 'manager_workHour'
                    });
                    console.log("firstFullDate_manager= " + $scope.firstFullDate_manager);

                    $scope.firstDate_manager= DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 0));
                    $scope.lastDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 6));

                    $scope.monDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 0));
                    $scope.tueDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 1));
                    $scope.wesDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 2));
                    $scope.thuDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 3));
                    $scope.friDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 4));
                    $scope.satDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 5));
                    $scope.sunDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_manager), 6));

                    $scope.usersReviewForManagers = [];

                    targetFormFullDate = $scope.firstFullDate_manager;

                    getData = {
                        relatedMembers: $scope.mainRelatedMembers,
                        create_formDate: targetFormFullDate,
                    }
                } break;
                case typeExecutive: {

                    bsLoadingOverlayService.start({
                        referenceId: 'executive_workHour'
                    });

                    console.log("firstFullDate_executive= " + $scope.firstFullDate_executive);

                    $scope.firstDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 0));
                    $scope.lastDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 6));

                    $scope.monDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 0));
                    $scope.tueDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 1));
                    $scope.wesDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 2));
                    $scope.thuDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 3));
                    $scope.friDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 4));
                    $scope.satDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 5));
                    $scope.sunDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_executive), 6));

                    $scope.usersReviewForExecutive = [];

                    targetFormFullDate = $scope.firstFullDate_executive;

                    getData = {
                        relatedMembers: $scope.mainRelatedMembers_all,
                        create_formDate: targetFormFullDate,
                    }
                } break;
            }

            console.log(getData);
            WorkHourUtil.getWorkHourFormMultiple(getData)
                .success(function (res) {
                    var relatedUsersAndTables = [];
                    // 一個UserDID只有一個物件
                    var existDIDArray = [];
                    if (res.payload.length > 0) {
                        // users
                        for (var formIndex = 0; formIndex < res.payload.length; formIndex ++) {

                            var userObject = undefined;
                            var evalString = "userObject = {'" + res.payload[formIndex].creatorDID + "': []}";
                            eval(evalString);
                            // customized
                            userObject.DID = res.payload[formIndex].creatorDID;
                            switch (type) {
                                case typeManager:
                                    userObject.crossDay = $scope.checkIsCrossMonth($scope.firstFullDate_manager);
                                    break;
                                case typeExecutive:
                                    userObject.crossDay = $scope.checkIsCrossMonth($scope.firstFullDate_executive);
                                    break;
                            }
                            if (!existDIDArray.includes(res.payload[formIndex].creatorDID)) {
                                relatedUsersAndTables.push(userObject);
                                existDIDArray.push(res.payload[formIndex].creatorDID);

                                evalString = "$scope.tables_review['" + res.payload[formIndex].creatorDID + "'] = []";
                                eval(evalString);

                                evalString = "$scope.userMap_review['" + res.payload[formIndex].creatorDID + "'] = []";
                                eval(evalString);
                            }
                        }
                        existDIDArray = [];
                        // push items
                        for (var formIndex = 0; formIndex < res.payload.length; formIndex ++) {
                            var isProjectIncluded = false;
                            inter:
                            for (var tablesIndex = 0; tablesIndex < res.payload[formIndex].formTables.length; tablesIndex ++) {
                                if (managersRelatedProjects.includes(res.payload[formIndex].formTables[tablesIndex].prjDID) || type == typeExecutive) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
                                    isProjectIncluded = true;
                                    break inter;
                                }
                            }
                            if (isProjectIncluded) {
                                for(var userIndex = 0; userIndex < relatedUsersAndTables.length; userIndex ++) {
                                    if (res.payload[formIndex].creatorDID === relatedUsersAndTables[userIndex].DID) {
                                        var manipulateObject = undefined;
                                        var evalString = "manipulateObject = relatedUsersAndTables[" + userIndex +"]['" + res.payload[formIndex].creatorDID + "']";
                                        eval(evalString);
                                        manipulateObject.push(res.payload[formIndex]);
                                        evalString = "manipulateObject = $scope.tables_review['" + res.payload[formIndex].creatorDID + "']";
                                        eval(evalString);
                                        manipulateObject.push(res.payload[formIndex]);

                                        if (!existDIDArray.includes(res.payload[formIndex].creatorDID)) {
                                            existDIDArray.push(res.payload[formIndex].creatorDID);
                                            evalString = "$scope.userMap_review['" + res.payload[formIndex].creatorDID + "'] = relatedUsersAndTables[userIndex]";
                                            eval(evalString);
                                        }
                                    }
                                }
                            }
                        }
                        switch (type) {
                            case typeManager:
                                $scope.checkUserReviewStatus(relatedUsersAndTables, false, null, type);
                                break;
                            case typeExecutive:
                                $scope.checkUserReviewStatus(relatedUsersAndTables, true, false, type);
                                break;
                        }

                    } else {
                        switch (type) {
                            case typeManager:
                                bsLoadingOverlayService.stop({
                                    referenceId: 'manager_workHour'
                                });
                                break;
                            case typeExecutive:
                                bsLoadingOverlayService.stop({
                                    referenceId: 'executive_workHour'
                                });
                                break;
                        }
                    }
                })
                .error(function () {
                    switch (type) {
                        case typeManager:
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'manager_workHour'
                                });
                            }, 500);
                            break;
                        case typeExecutive:
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'executive_workHour'
                                });
                            }, 500);
                            break;
                    }
                    console.log('Error, WorkHourUtil.getWorkHourFormMultiple');
                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                })
        }

        let runPromise = (someone, timer, success = true) => {
            console.log(`${someone} 開始跑開始`);
            return new Promise((resolve, reject) => {
                // 傳入 resolve 與 reject，表示資料成功與失敗
                if (success) {
                    setTimeout(function () {
                        // 3 秒時間後，透過 resolve 來表示完成
                        resolve(`${someone} 跑 ${timer / 1000} 秒時間(fulfilled)`);
                    }, timer);
                } else {
                    // 回傳失敗
                    reject(`${someone} 跌倒失敗(rejected)`)
                }
            });
        }

        // 檢查該使用者是否有提交合規則的表單
        $scope.checkUserReviewStatus = function(userTables
                                                , isFindManagerCheckFlag
                                                , isFindExecutiveCheck
                                                , type) {
            // console.log(userTables);

            var userTotalLength = 0;

            const getData = async (formDataTable) => {
                // console.log(formDataTable);
                // console.log(userTotalLength);
                // 取得 Table Data
                WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                    .success(function (res) {
                        // 填入表單資訊
                        // console.log(res.payload);

                        for (var index = 0; index < res.payload.length; index++) {
                            // console.log(res.payload[index].prjDID);
                            if (managersRelatedProjects.includes(res.payload[index].prjDID) || type == 2 || type == 6) {
                                var mUser = $scope.fetchReviewUserFromScope(res.creatorDID);
                                if (res.payload.length > 0) {
                                    if (!userDIDExistArray.includes(mUser.DID)) {
                                        userResult.push(mUser);
                                        userDIDExistArray.push(mUser.DID);
                                    }
                                }
                            }
                        }

                        userCount ++;
                        switch (type) {
                            case typeManager:
                                $scope.usersReviewForManagers = userResult;
                                break;
                            case typeExecutive:
                                $scope.usersReviewForExecutive = userResult;
                                break;
                        }
                        // console.log("response userTables.length= " + userTables.length);
                        // console.log("response userTotalLength= " + userTotalLength);
                        // console.log("crossDay= " + $scope.checkIsCrossMonth(type == typeManager ? $scope.firstFullDate_manager : $scope.firstFullDate_executive));
                        // console.log("response userCount= " + userCount);
                        // console.log("finalCount= " + userTotalLength);
                        if (userCount == userTotalLength) {
                            switch (type) {
                                case typeManager:
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'manager_workHour'
                                        });
                                    }, 500);
                                    break;
                                case typeExecutive:
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'executive_workHour'
                                        });
                                    }, 500);
                                    break;
                            }
                        }
                    })
                    .error(function () {
                        switch (type) {
                            case typeManager:
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'manager_workHour'
                                    });
                                }, 500);
                                break;
                            case typeExecutive:
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'executive_workHour'
                                    });
                                }, 500);
                                break;
                        }
                        console.log('Error, WorkHourUtil.findWorkHourTableFormByTableIDArray');
                        toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                    })
                return 'aaa';
            }

            var worker = new Worker("app/webWorkers/worker.js"); // 創建一個 worker 物件

            worker.onmessage = function(e) { // 設定 worker 的監聽事件
                getData(e.data).then(res => {
                    // console.log(res);
                })
                // worker.terminate(); // 結束 worker
            }

            var userResult = [];
            var userDIDExistArray = [];
            var userCount = 0;
            // console.log("userTables.length= " + userTables.length);
            // console.log(userTables);
            for (var userIndex = 0; userIndex < userTables.length; userIndex ++) {

                var user = userTables[userIndex];

                var tablesLength = user[user.DID].length;

                if (tablesLength > 0) {
                    console.log("tablesLength= " + tablesLength);
                    userTotalLength += tablesLength;
                }

                for (var majorIndex = 0; majorIndex < tablesLength; majorIndex ++) {

                    var workItemCount = user[user.DID][majorIndex].formTables.length;
                    var workTableIDArray = [];
                    // 組成 prjID Array, TableID Array，再去Server要資料
                    for (var index = 0; index < workItemCount; index++) {
                        workTableIDArray[index] = user[user.DID][majorIndex].formTables[index].tableID;
                    }

                    formDataTable = {
                        creatorDID: user.DID,
                        tableIDArray: workTableIDArray,
                        isFindSendReview: true,
                        isFindManagerCheck: isFindManagerCheckFlag,
                        isFindExecutiveCheck: isFindExecutiveCheck,
                        isFindManagerReject: null,
                        isFindExecutiveReject: null
                    }
                    getData(formDataTable).then(res => {
                        // console.log(res);
                    })
                }
            }
            if (userTotalLength == 0) {
                switch (type) {
                    case typeManager:
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'manager_workHour'
                            });
                        }, 500);
                        break;
                    case typeExecutive:
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'executive_workHour'
                            });
                        }, 500);
                        break;
                }
            }
        }

        // 拿取對應的工時表
        // 經理審查、行政審查
        $scope.showTableOfItem = function(userData
                                          , isFindSendReviewFlag
                                          , isFindManagerCheckFlag
                                          , isFindExecutiveCheck
                                          , isFindManagerReject
                                          , isFindExecutiveReject
                                          , type) {
            //TODO Multiple
            var tablesLength = userData[userData.DID].length;

            var tableSort = [];
            for (var majorIndex = 0; majorIndex < tablesLength; majorIndex ++) {
                var tableIndex = 0;
                console.log("table= " + majorIndex + ", tableItems= " + userData[userData.DID][majorIndex].formTables.length);

                var workItemCount = userData[userData.DID][majorIndex].formTables.length;
                var workTableIDArray = [];
                // 組成 prjID Array, TableID Array，再去Server要資料
                for (var index = 0; index < workItemCount; index++) {
                    workTableIDArray[index] = userData[userData.DID][majorIndex].formTables[index].tableID;
                }

                formDataTable = {
                    tableIDArray: workTableIDArray,
                    isFindSendReview: isFindSendReviewFlag,
                    isFindManagerCheck: isFindManagerCheckFlag,
                    isFindExecutiveCheck: isFindExecutiveCheck,
                    isFindManagerReject: isFindManagerReject,
                    isFindExecutiveReject: isFindExecutiveReject
                }
                // 取得 Table Data

                tableSort.push(workTableIDArray);
                // console.log(tableSort);
                WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                    .success(function (res) {
                        var isNeedToReview = false;
                        // console.log(res.payload);
                        var workIndex = tableIndex;
                        tableIndex++;
                        // 填入表單資訊
                        $scope.tableData = {};
                        var formTables = [];
                        var isFirstRaw = false;
                        for (var index = 0; index < res.payload.length; index++) {
                            if (managersRelatedProjects.includes(res.payload[index].prjDID) || type == 2 || type == 6) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
                                if(!res.payload[index].isManagerCheck || type == 2 || type == 6) {
                                    isNeedToReview = true;
                                }
                            }
                        }

                        console.log("isNeedToReview= " + isNeedToReview);

                        if (isNeedToReview) {
                            for (var index = 0; index < res.payload.length; index++) {
                                // if (managersRelatedProjects.includes(res.payload[index].prjDID) || type == 2) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
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

                                        userMonthSalary: res.payload[index].userMonthSalary,

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
                                    if (tableSort[0].indexOf(res.payload[index]._id) >= 0) {
                                        isFirstRaw = true;
                                    }
                                // }
                            }

                        }

                        // console.log(formTables);
                        if (formTables.length == 0) {
                        } else {
                            if(isFirstRaw) {
                                var evalString = "$scope.tables_review.tablesItems['" + userData[userData.DID][workIndex].creatorDID + userData[userData.DID][0]._id + "'] = formTables";
                                eval(evalString);
                            } else {
                                var evalString = "$scope.tables_review.tablesItems['" + userData[userData.DID][workIndex].creatorDID + userData[userData.DID][1]._id + "'] = formTables";
                                eval(evalString);
                            }
                        }

                    })
                    .error(function () {
                        console.log('ERROR WorkHourUtil.findWorkHourTableFormByTableIDArray');
                    })
                $scope.fetchWorkOffReviewTables(userData.DID, type);
                $scope.fetchNHReviewTables(userData.DID, type);
                $scope.fetchWorkAddReviewTables(userData.DID, $scope.firstFullDate_executive);
            }
        }

        // get work Off tables
        // 經理審查、行政審查
        $scope.fetchWorkOffReviewTables = function(userDID, type) {

            var create_formDate;

            switch (type) {
                case typeManager: {
                    create_formDate = $scope.firstFullDate_manager;
                } break;
                case typeExecutive: {
                    create_formDate = $scope.firstFullDate_executive;
                } break;
            }

            var getData = {
                creatorDID: userDID,
                year: null,
                month: null,
                isSendReview: null,
                isBossCheck: null,
                isExecutiveCheck: null,
                create_formDate: create_formDate
            }

            WorkOffFormUtil.findWorkOffTableFormByUserDID(getData)
                .success(function (res) {
                    console.log(res.payload);
                    var formTables = [];
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
                    var evalString = "$scope.workOffTablesItems['" + userDID + "'] = formTables";
                    eval(evalString);
                })
                .error(function () {
                    console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByUserDID');
                })

            // WorkOffFormUtil.findWorkOffTableFormByUserDID(getData)
            //     .success(function (res) {
            //         console.log(res.payload);
            //         var formTables = [];
            //         if (res.payload.length > 0) {
            //             var workOffTableIDArray = [];
            //             // 組成 TableID Array，再去Server要資料
            //             for (var index = 0; index < res.payload.length; index++) {
            //                 workOffTableIDArray[index] = res.payload[index]._id;
            //             }
            //
            //             var workOffFormDataTable = {};
            //
            //             switch (type) {
            //                 case typeManager: {
            //                     workOffFormDataTable = {
            //                         tableIDArray: workOffTableIDArray,
            //                         create_formDate: $scope.firstFullDate_manager,
            //                     }
            //                 } break;
            //                 case typeExecutive: {
            //                     workOffFormDataTable = {
            //                         tableIDArray: workOffTableIDArray,
            //                         create_formDate: $scope.firstFullDate_executive,
            //                     }
            //                 } break;
            //             }
            //             // 取得 Table Data
            //             WorkOffFormUtil.findWorkOffTableFormByTableIDArrayAndParameters(workOffFormDataTable)
            //                 .success(function (res) {
            //                     // 填入表單資訊
            //                     $scope.tableData = {};
            //                     for (var index = 0; index < res.payload.length; index++) {
            //                         var detail = {
            //                             tableID: res.payload[index]._id,
            //
            //                             workOffType: res.payload[index].workOffType,
            //                             create_formDate: res.payload[index].create_formDate,
            //                             year: res.payload[index].year,
            //                             month: res.payload[index].month,
            //                             day: res.payload[index].day,
            //                             start_time: res.payload[index].start_time,
            //                             end_time: res.payload[index].end_time,
            //
            //                             //RIGHT
            //                             isSendReview: res.payload[index].isSendReview,
            //                             isBossCheck: res.payload[index].isBossCheck,
            //                             isExecutiveCheck: res.payload[index].isExecutiveCheck,
            //
            //                             // Reject
            //                             isBossReject: res.payload[index].isBossReject,
            //                             bossReject_memo: res.payload[index].bossReject_memo,
            //
            //                             isExecutiveReject: res.payload[index].isExecutiveReject,
            //                             executiveReject_memo: res.payload[index].executiveReject_memo,
            //
            //                             // userHourSalary: res.payload[index].userHourSalary,
            //                             userMonthSalary: res.payload[index].userMonthSalary,
            //                         };
            //                         formTables.push(detail);
            //                     }
            //                     var evalString = "$scope.workOffTablesItems['" + userDID + "'] = formTables";
            //                     eval(evalString);
            //                 })
            //                 .error(function () {
            //                     console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByTableIDArrayAndParameters');
            //                 })
            //         } else {
            //             // res.payload.length == 0
            //         }
            //     })
            //     .error(function () {
            //         console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByUserDID');
            //     })
        }

        // get work Off Tables in scope.
        $scope.fetchWorkOffTableFormDataFromScope = function(table) {
            return $scope.workOffTablesItems[table.creatorDID] === undefined ? [] : $scope.workOffTablesItems[table.creatorDID];
        }

        // show 休假
        $scope.showWorkOffCalculateHour = function (formIndex, firstFullDate, tables, day) {
            var crossDay = $scope.checkIsCrossMonth(firstFullDate);
            // console.log("day= " + day);
            // console.log("tableIndex= " + tableIndex);
            switch (formIndex) {
                case 0: {
                    if (day < crossDay || crossDay == -1) {
                        var result = 0;
                        for (var index = 0; index < tables.length; index++) {
                            // console.log("day= " + day);
                            // console.log("index= " + index);
                            // console.log("tables[index].day= " + tables[index].day);
                            if (day == tables[index].day && (tables[index].isBossCheck && tables[index].isExecutiveCheck)) {
                                result += getHourDiffByTime(tables[index].start_time, tables[index].end_time, tables[index].workOffType);
                            };
                        }
                        return result;
                    }
                }
                break;
                case 1:{
                    // console.log(tables);
                    if (day >= crossDay || day === 0) {
                        var result = 0;
                        for (var index = 0; index < tables.length; index++) {
                            // console.log("day= " + day);
                            // console.log("index= " + index);
                            // console.log("tables[index].day= " + tables[index].day);
                            if (day == tables[index].day && (tables[index].isBossCheck && tables[index].isExecutiveCheck)) {
                                // console.log(getHourDiffByTime(tables[index].start_time, tables[index].end_time, tables[index].workOffType));
                                result += getHourDiffByTime(tables[index].start_time, tables[index].end_time, tables[index].workOffType);
                            };
                        }
                        return result;
                    }
                }
                break;
            }

            return 0;
        }

        $scope.fetchNHReviewTables = function(userDID, type) {
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
                    // console.log(fetchNationalHolidayData);
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
                        var evalString = "$scope.workNHTablesItems['" + userDID + "'] = formTables";
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
        $scope.fetchNHTableFormDataFromScope = function(table) {
            return $scope.workNHTablesItems[table.creatorDID] === undefined ? [] : $scope.workNHTablesItems[table.creatorDID];
        }

        // show 國定假日
        $scope.showNHCalculateHour = function (tableIndex, firstFullDate, tables, day) {
            var crossDay = $scope.checkIsCrossMonth(firstFullDate);
            var NHresult = 0;
            switch (tableIndex) {
                case 0: {
                    if (day < crossDay || crossDay == -1) {
                        for (var index = 0; index < tables.length; index++) {
                            if (day == tables[index].day) {
                                NHresult = 8;
                            }
                        }
                    }
                    return NHresult;
                }
                break;
                case 1:{
                    if (day >= crossDay || day === 0) {
                        for (var index = 0; index < tables.length; index++) {
                            if (day == tables[index].day) {
                                NHresult = 8;
                            }
                        }
                    }
                    return NHresult;
                }
                break;
            }
        }

        var workAddTableIDArray = [];
        // 拿換休&加班 20190725
        $scope.fetchWorkAddReviewTables = function (userDID, firstFullDate) {
            workAddTableIDArray = [];
            var formData = {
                creatorDID: userDID,
                create_formDate: firstFullDate,
                // workAddType: 2
            }

            WorkHourAddItemUtil.getWorkHourAddItems(formData)
                .success(function (res) {
                    // $scope.workAddTablesItems = res.payload;
                    workAddTableIDArray = [];
                    // 組成 prjID Array, TableID Array，再去Server要資料
                    for (var index = 0; index < res.payload.length; index++) {
                        workAddTableIDArray[index] = res.payload[index]._id;
                    }
                    console.log(workAddTableIDArray);
                })
                .error(function () {
                    console.log('ERROR  WorkHourAddItemUtil.getWorkHourAddItems')
                })
        }

        $scope.fetchReviewUserFromScope = function (userDID) {
            return $scope.userMap_review[userDID] === undefined ? [] : $scope.userMap_review[userDID];
        }

        $scope.fetchReviewTableFromScope = function(user) {
            return $scope.tables_review[user.DID] === undefined ? [] : $scope.tables_review[user.DID];
        }

        // 資料存取TableItem.
        $scope.fetchFormDataFromScope = function(table) {
            return $scope.tables_review.tablesItems[table.creatorDID + table._id] === undefined ? [] : $scope.tables_review.tablesItems[table.creatorDID + table._id];
        }

        // 資料存取TableItem.
        $scope.fetchFormDataFromScopeByDID = function(creatorDID, tableID) {
            return $scope.tables_review.tablesItems[creatorDID + tableID] === undefined ? [] : $scope.tables_review.tablesItems[table.creatorDID + table._id];
        }

        $scope.maskInput = function () {
            $('.inputLimited').mask('M.D', {
                translation: {
                    'M': {
                        pattern: /[012345678]/,
                    },
                    'D': {
                        pattern: /[05]/,
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

        // for myWeeklyDatePicker
        $scope.changeWeeklyDT = function (datepicker, viewType) {
            // console.log(viewType);
            switch (viewType) {
                case 1: {
                    $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT), 0));
                    // $scope.firstDate = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0));
                    $scope.reloadWeek(false, 1);
                } break;
                case 4: {
                    $scope.firstFullDate_history = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0);
                    // $scope.firstDate_history = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0));
                    // $scope.reloadWeek_history(false);
                    $scope.reloadWeek(false, 4);
                } break;
                case 2: {
                    $scope.firstFullDate_manager = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0);
                    // $scope.firstDate_manager = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0));
                    $scope.showRelatedMembersTableReview(typeManager)
                } break;
                case 3: {
                    $scope.firstFullDate_executive = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0);
                    // $scope.firstDate_executive = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0));
                    $scope.showRelatedMembersTableReview(typeExecutive);
                } break;
                // management
                case 5: {
                    $scope.firstFullDate_management = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0);
                    // $scope.firstDate_management = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0));
                    $scope.reloadWeek(false, 5);
                }
                break;
            }
        }

        function sleep(ms){

            var starttime= new Date().getTime();

            do{

            }while((new Date().getTime()-starttime)<ms)

        }

        // 主要顯示 『工時審核明細』
        $scope.workHourManagementList = [];

        // -------------------- Week Methods Management---------------------
        $scope.firstFullDate_management = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);
        $scope.firstDate_management = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
        $scope.lastDate_management = DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment($scope.firstFullDate_management), 6));

        $scope.showManagementList = function () {

            var apiData = {};

            apiData = {
                users: $scope.mainRelatedMembers,
                creatorDID: $cookies.get('userDID')
                // date: $scope.firstFullDate_management
            }
            // console.log(apiData);

            switch($scope.roleType) {
                case "100": {
                    apiData = {
                        users: $scope.mainRelatedMembers_all,
                        creatorDID: $cookies.get('userDID')
                        // date: $scope.firstFullDate_management
                    }
                }
                break;
            }

            bsLoadingOverlayService.start({
                referenceId: 'management_workHour'
            });

            WorkHourUtil.insertWorkHourTempsData(apiData)
                .success(function (res) {
                    apiData = {
                        date: $scope.firstFullDate_management,
                        creatorDID: $cookies.get('userDID'),
                    }
                    WorkHourUtil.fetchWorkHourFormManagementList(apiData)
                        .success(function (res) {
                            console.log(res.payload);

                            $scope.workHourManagementList = res.payload;

                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'management_workHour'
                                });
                            }, 500)
                            console.log("Success, WorkHourUtil.fetchWorkHourFormManagementList");
                        })
                        .error(function () {
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'management_workHour'
                                });
                            }, 500)
                            console.log("Error, WorkHourUtil.fetchWorkHourFormManagementList");
                        })
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'management_workHour'
                        });
                    }, 500)
                    console.log('Error, WorkHourUtil.insertWorkHourFormManagementRelatedMembersTemp');
                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                })
        }

        $scope.checkManagementStatus = function (item, type, dom, monthIndex) { // cross Month, monthIndex is upper month,

            if (item.work_hour_forms.length > 1) {
                // 有跨月
                switch (monthIndex) {
                    case 1: {
                        // 上表
                        switch (type) {
                            case 1: { // 工時表狀態
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[0].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        if (!item.work_hour_tables[index].isSendReview
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[0].formTables[index_form_tables].tableID) {
                                            $('#a_' + dom.$index).css('color', '#dfb81c');
                                            return "編輯中"
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[0].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isManagerCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[0].formTables[index_form_tables].tableID) {
                                            $('#a_' + dom.$index).css('color', '#dfb81c');
                                            return "等待確認"
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[0].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isExecutiveCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[0].formTables[index_form_tables].tableID) {
                                            $('#a_' + dom.$index).css('color', '#dfb81c');
                                            return "等待確認"
                                        }
                                    }
                                }
                                $('#a_' + dom.$index).css('color', '#90b900');
                                return "審查完成"
                            }
                                break;
                            case 2: { //經理/主任狀態
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[0].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isSendReview
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[0].formTables[index_form_tables].tableID) {
                                            return ""
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[0].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isManagerCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[0].formTables[index_form_tables].tableID) {
                                            $('#b_' + dom.$index).css('color', '#dfb81c');
                                            return "等待確認"
                                        }
                                    }
                                }
                                $('#b_' + dom.$index).css('color', '#2dacd1');
                                return "審核完成"
                            }
                                break;
                            case 3: { // 行政總管狀態
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[0].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isManagerCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[0].formTables[index_form_tables].tableID) {
                                            return ""
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[0].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isExecutiveCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[0].formTables[index_form_tables].tableID) {
                                            $('#c_' + dom.$index).css('color', '#dfb81c');
                                            return "等待審核"
                                        }
                                    }
                                }
                                $('#c_' + dom.$index).css('color', '#2dacd1');
                                return "審核完成"
                            }
                                break;
                        }
                    }
                    break;
                    case 2: {
                        // 下表
                        switch (type) {
                            case 1: { // 工時表狀態
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isSendReview
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            $('#aa_' + dom.$index).css('color', '#dfb81c');
                                            return "編輯中"
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isManagerCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            $('#aa_' + dom.$index).css('color', '#dfb81c');
                                            return "等待確認"
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isExecutiveCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            $('#aa_' + dom.$index).css('color', '#dfb81c');
                                            return "等待確認"
                                        }
                                    }
                                }
                                $('#aa_' + dom.$index).css('color', '#90b900');
                                return "審查完成"
                            }
                                break;
                            case 2: { //經理/主任狀態
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isSendReview
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            return ""
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isManagerCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            $('#bb_' + dom.$index).css('color', '#dfb81c');
                                            return "等待確認"
                                        }
                                    }
                                }
                                $('#bb_' + dom.$index).css('color', '#2dacd1');
                                return "審核完成"
                            }
                                break;
                            case 3: { // 行政總管狀態
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isManagerCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            return ""
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        // console.log(item.work_hour_tables[index]);
                                        if (!item.work_hour_tables[index].isExecutiveCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            $('#cc_' + dom.$index).css('color', '#dfb81c');
                                            return "等待審核"
                                        }
                                    }
                                }
                                $('#cc_' + dom.$index).css('color', '#2dacd1');
                                return "審核完成"
                            }
                                break;
                        }
                    }
                    break;

                }
            } else {
                // 無跨月
                if (item.work_hour_tables.length > 0) {
                    switch (type) {
                        case 1: { // 工時表狀態
                            for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                // console.log(item.work_hour_tables[index]);
                                if (!item.work_hour_tables[index].isSendReview) {
                                    $('#a_' + dom.$index).css('color', '#dfb81c');
                                    return "編輯中"
                                }
                            }
                            for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                // console.log(item.work_hour_tables[index]);
                                if (!item.work_hour_tables[index].isManagerCheck) {
                                    $('#a_' + dom.$index).css('color', '#dfb81c');
                                    return "等待確認"
                                }
                            }
                            for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                // console.log(item.work_hour_tables[index]);
                                if (!item.work_hour_tables[index].isExecutiveCheck) {
                                    $('#a_' + dom.$index).css('color', '#dfb81c');
                                    return "等待確認"
                                }
                            }
                            $('#a_' + dom.$index).css('color', '#90b900');
                            return "審查完成"
                        }
                            break;
                        case 2: { //經理/主任狀態
                                for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                    // console.log(item.work_hour_tables[index]);
                                    if (!item.work_hour_tables[index].isSendReview) {
                                        return ""
                                    }
                                }
                                for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                    // console.log(item.work_hour_tables[index]);
                                    if (!item.work_hour_tables[index].isManagerCheck) {
                                        $('#b_' + dom.$index).css('color', '#dfb81c');
                                        return "等待確認"
                                    }
                                }
                            $('#b_' + dom.$index).css('color', '#2dacd1');
                            return "審核完成"
                        }
                            break;
                        case 3: { // 行政總管狀態
                            for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                // console.log(item.work_hour_tables[index]);
                                if (!item.work_hour_tables[index].isManagerCheck) {
                                    return ""
                                }
                            }
                            for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                // console.log(item.work_hour_tables[index]);
                                if (!item.work_hour_tables[index].isExecutiveCheck) {
                                    $('#c_' + dom.$index).css('color', '#dfb81c');
                                    return "等待審核"
                                }
                            }
                            $('#c_' + dom.$index).css('color', '#2dacd1');
                            return "審核完成"
                        }
                            break;
                    }
                }
            }

        }

        $scope.nextMonth = function () {
            return moment($scope.firstFullDate_management).month() == 11 ? 1 : moment($scope.firstFullDate_management).month() + 2;
        }

    } // function End line
})();
