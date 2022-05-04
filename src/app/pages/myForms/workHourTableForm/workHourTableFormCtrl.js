/**
 * @author Ichen.Chu
 * created on 19.03.2018
 */
(function () {
    angular.module('BlurAdmin.pages.myForms')
        .controller('workHourTableCtrl',
            [
                '$scope',
                '$rootScope',
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
                'WorkOverTimeUtil',
                'WorkAddConfirmFormUtil',
                'NotificationMsgUtil',
                'editableOptions',
                'editableThemes',
                'UpdateActionUtil',
                'bsLoadingOverlayService',
                WorkHourTableCtrl
            ]);

    /** @ngInject */
    function WorkHourTableCtrl($scope,
                               $rootScope,
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
                               WorkOverTimeUtil,
                               WorkAddConfirmFormUtil,
                               NotificationMsgUtil,
                               editableOptions,
                               editableThemes,
                               UpdateActionUtil,
                               bsLoadingOverlayService) {
        // console.log = function() {}
        var vm = this;

        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;
        $scope.month = thisMonth;

        $scope.username = $cookies.get('username');
        $scope.roleType = $cookies.get('roletype');
        $scope.userDID = $cookies.get('userDID');

        $scope.initWatchRelatedTask = function() {

            $scope.$watch(function() {
                return $rootScope.workHour_Rejected;
            }, function() {
                $scope.workHour_Rejected = $rootScope.workHour_Rejected;
            }, true);

            $scope.$watch(function() {
                return $rootScope.workHour_Manager_Tasks;
            }, function() {
                $scope.workHour_Manager_Tasks = $rootScope.workHour_Manager_Tasks;
            }, true);

            $scope.$watch(function() {
                return $rootScope.workHour_Executive_Tasks;
            }, function() {
                $scope.workHour_Executive_Tasks = $rootScope.workHour_Executive_Tasks;
            }, true);

            $scope.$watch(function() {
                return $rootScope.workOverTime_Manager_Tasks;
            }, function() {
                $scope.workOverTime_Manager_Tasks = $rootScope.workOverTime_Manager_Tasks;
            }, true);

            $scope.$watch(function() {
                return $rootScope.workOverTime_Rejected;
            }, function() {
                $scope.workOverTime_Rejected = $rootScope.workOverTime_Rejected;
            }, true);

        }

        $scope.initWatchRelatedTask();



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
                // console.log(" ======== related login user Projects ======== ");
                allRelatedPrjDatas = relatedProjects;
                vm.relatedProjects = relatedProjects;
            });

        //所有專案，資料比對用
        Project.findAll()
            .success(function (allProjects) {
                $scope.allProjectCache = [];
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

                    $scope.allProjectCache[index] = {
                        prjDID: allProjects[index]._id,
                        prjCode: allProjects[index].prjCode,
                        mainName: allProjects[index].mainName + " - "
                        + allProjects[index].prjName + " - "
                        + allProjects[index].prjSubName + " - "
                        + ProjectUtil.getTypeText(allProjects[index].type),
                        majorID: allProjects[index].majorID,
                        managerID: allProjects[index].managerID,
                        ezName: nameResult,
                        combinedID: allProjects[index].combinedID,
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
            var firstTableExist = false;
            var secondTableExist = false;
            var isExistInFormsCounts = 0;

            for (var outIndex = 0; outIndex < $scope.tables.length; outIndex++) {
                if ($scope.tables[outIndex].tablesItems == undefined || $scope.tables[outIndex].tablesItems.length == 0) break;
                for (var index = 0; index < $scope.tables[outIndex].tablesItems.length; index++) {
                    if ($scope.tables[outIndex].tablesItems[index].prjDID === prj._id) {
                        isExistInFormsCounts ++;
                        switch(outIndex) {
                            case 0:
                                firstTableExist = true;
                                continue;
                            case 1:
                                secondTableExist = true;
                                break;
                        }
                    }
                }

                if (isExistInFormsCounts == $scope.tables.length) {
                    toastr.warning('工時表已經存在該專案', 'warning');
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_workHour'
                        });
                    }, 0)
                    return;
                }
            }

            var insertCount = 0;

            if (!firstTableExist) {
                insertCount++;
            }
            if (!secondTableExist && $scope.tables.length > 1) {
                insertCount++;
            }

            vm.prjItems.selected = "";
            var completeCount = 0;
            if (!firstTableExist) {
                var newTableItem = {
                    creatorDID: $scope.userDID,
                    prjDID: prj._id,
                    create_formDate: $scope.firstFullDate,
                    userMonthSalary: $scope.userMonthSalary
                };

                WorkHourUtil.insertWorkHourTableItem(newTableItem)
                    .success(function (resp) {
                        completeCount ++;
                        var newItem = {
                            prjDID: resp.prjDID,
                            tableID: resp.tableID,
                        }
                        $scope.tables[0].formTables.push(newItem);
                        if (completeCount == insertCount){
                            $scope.updateWorkHourForm();
                        }
                    })
            }

            if (!secondTableExist && $scope.tables.length > 1) {
                var newTableItem = {
                    creatorDID: $scope.userDID,
                    prjDID: prj._id,
                    create_formDate: $scope.firstFullDate,
                    userMonthSalary: $scope.userMonthSalary
                };

                WorkHourUtil.insertWorkHourTableItem(newTableItem)
                    .success(function (resp) {
                        completeCount ++;
                        var newItem = {
                            prjDID: resp.prjDID,
                            tableID: resp.tableID,
                        }
                        $scope.tables[1].formTables.push(newItem);
                        if (completeCount == insertCount){
                            $scope.updateWorkHourForm();
                        }
                    })
            }
            // $scope.createSubmit(0, true);
        }

        // 暫存表單，＊＊＊使用者互動 主要儲存功能＊＊＊
        $scope.saveTemp = function (item) {
            var formData = {
                tableID: item.tableID,

                //MON
                mon_hour: item.mon_hour,
                mon_memo: item.mon_memo,
                mon_hour_add: item.mon_hour_add,
                mon_memo_add: item.mon_memo_add,
                //TUE
                tue_hour: item.tue_hour,
                tue_memo: item.tue_memo,
                tue_hour_add: item.tue_hour_add,
                tue_memo_add: item.tue_memo_add,
                //WES
                wes_hour: item.wes_hour,
                wes_memo: item.wes_memo,
                wes_hour_add: item.wes_hour_add,
                wes_memo_add: item.wes_memo_add,
                //THU
                thu_hour: item.thu_hour,
                thu_memo: item.thu_memo,
                thu_hour_add: item.thu_hour_add,
                thu_memo_add: item.thu_memo_add,
                //FRI
                fri_hour: item.fri_hour,
                fri_memo: item.fri_memo,
                fri_hour_add: item.fri_hour_add,
                fri_memo_add: item.fri_memo_add,
                //SAT
                sat_hour: item.sat_hour,
                sat_memo: item.sat_memo,
                sat_hour_add: item.sat_hour_add,
                sat_memo_add: item.sat_memo_add,
                //SUN
                sun_hour: item.sun_hour,
                sun_memo: item.sun_memo,
                sun_hour_add: item.sun_hour_add,
                sun_memo_add: item.sun_memo_add,
            }

            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    // $scope.getWorkHourTables();
                })
            // $scope.createSubmit(10, true);
        }

        // Remove Work Hour Check
        $scope.deleteCheck = function (item, formaIndex, itemIndex) {
            $scope.checkText = '確定移除 ' + $scope.showPrjName(item.prjDID) + "  ？";
            $scope.checkingItem = item;
            $scope.formIndex = formaIndex;
            $scope.itemIndex = itemIndex;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormDeleteModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 使用者確定移除工時表項目
        $scope.removeWorkItem = function (item, formIndex, itemIndex) {
            var formData = {
                _id: item.tableID,
            }
            var newFormTables = [];
            for (var index = 0; index < $scope.tables[formIndex].formTables.length; index ++) {
                if ($scope.tables[formIndex].formTables[index].tableID != item.tableID) {
                    newFormTables.push($scope.tables[formIndex].formTables[index]);
                }
            }
            $scope.tables[formIndex].formTables = newFormTables;

            WorkHourUtil.removeWorkHourTableItem(formData)
                .success(function (resp) {
                    var formData = {
                        creatorDID: $cookies.get('userDID'),
                        prjDID: item.prjDID,
                        create_formDate: item.create_formDate,
                        // month: tempMonth
                        month: $scope.tables[formIndex].month,
                    }

                    // 移除加班項目
                    WorkHourAddItemUtil.removeRelatedAddItemByProject(formData)
                        .success(function (res) {
                            $scope.updateWorkHourForm();
                        })
                        .error(function () {
                            console.log("ERROR WorkHourAddItemUtil.removeRelatedAddItemByProject");
                        })
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
                    console.log(res);
                    console.log($scope.tables);
                    $scope.workhourFormDidArray = [];
                    if (res.payload.length > 0) {
                        res.payload = res.payload.sort(function (a, b) {
                            var dateA = a.year +1911 + "/" + a.month;
                            var dateB = b.year +1911 + "/" + b.month;
                            return moment(dateA) > moment(dateB) ? 1 : -1;
                        });

                        $scope.workhourFormDidArray = [];

                        $scope.getWorkHourForms = res.payload;
                        $scope.loadWOTTotal($cookies.get('userDID'), res.payload);
                        for (var formIndex = 0; formIndex < res.payload.length; formIndex ++) {
                            console.log(res.payload[formIndex]);
                            // $scope.tables.push(res.payload[formIndex]);
                            $scope.tables[formIndex]._id = res.payload[formIndex]._id;
                            $scope.tables[formIndex].formTables = res.payload[formIndex].formTables;
                            $scope.tables[formIndex].year = res.payload[formIndex].year;
                            $scope.tables[formIndex].month = res.payload[formIndex].month;

                            $scope.workhourFormDidArray.push(res.payload[formIndex]._id);

                            var workItemCount = res.payload[formIndex].formTables.length;

                            var workTableDIDArray = [];
                            // 組成 prjID Array, TableID Array，再去Server要資料
                            for (var itemIndex = 0; itemIndex < workItemCount; itemIndex++) {
                                // needUpdateWorkTableIDArray.push(res.payload[formIndex].formTables[index].tableID);
                                workTableDIDArray.push(res.payload[formIndex].formTables[itemIndex].tableID);
                                // prjIDArray[itemIndex] = res.payload[formIndex].formTables[itemIndex].prjDID;
                            }
                            // var formData = {
                            //     prjIDArray: prjIDArray,
                            // }
                            // // 為了過濾已經存在工時表中的專案，剩下的才能被『新增項目』
                            // Project.findPrjByIDArray(formData) // 工時表中有相關的專案
                            //     .success(function (res) {
                            //         vm.relatedProjects = [];
                            //         for (var outIndex = 0; outIndex < allRelatedPrjDatas.length; outIndex++) {
                            //         //     var isExistInForms = false;
                            //         //     for (var index = 0; index < res.payload.length; index++) {
                            //         //         if (allRelatedPrjDatas[outIndex]._id === res.payload[index]._id) {
                            //         //             isExistInForms = true;
                            //         //         }
                            //         //     }
                            //         //     if (!isExistInForms) {
                            //         //         vm.relatedProjects.push(allRelatedPrjDatas[outIndex]);
                            //         //     }
                            //             vm.relatedProjects.push(allRelatedPrjDatas[outIndex]);
                            //         }
                            //     })
                            //     .error(function () {
                            //         $timeout(function () {
                            //             bsLoadingOverlayService.stop({
                            //                 referenceId: 'mainPage_workHour'
                            //             });
                            //         }, 200)
                            //         console.log('ERROR:> Project.findPrjByIDArray');
                            //         toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                            //     })

                            // needRemoveOldTable = {
                            //     tableIDArray: needUpdateWorkTableIDArray, //操作中的 table ID
                            // }

                            formDataTable = {
                                tableIDArray: workTableDIDArray, // 操作中的 table IDs
                                isFindSendReview: null,
                                isFindManagerCheck: null,
                                isFindExecutiveCheck: null,
                                isFindManagerReject: null,
                                isFindExecutiveReject: null
                            };

                            tableSort.push(workTableDIDArray);

                            // 取得 Table Data
                            WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                                .success(function (res) {
                                    // 填入表單資訊
                                    // $scope.tableData = {};
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

                                            updateTs: res.payload[index].updateTs,
                                            updateAction: res.payload[index].updateAction,
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
                                    }, 200)

                                })
                                .error(function () {
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'mainPage_workHour'
                                        });
                                    }, 200)
                                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                                })
                        }
                        loadWorkOffTable($cookies.get('userDID'), 1);
                        loadNH(1);
                        loadOT(1);
                        loadWOT();
                    } else {
                        if ($scope.checkIsCrossMonth($scope.firstFullDate) > 0) {

                            var createFormData = {
                                year: moment($scope.firstFullDate).year() - 1911,
                                // year: thisYear,
                                month: moment($scope.firstFullDate).month() + 1,
                                // month: thisMonth,
                                creatorDID: $cookies.get('userDID'),
                                create_formDate: $scope.firstFullDate,
                            };
                            // TODO 跨月
                            WorkHourUtil.createWorkHourForm(createFormData)
                                .success(function (res) {
                                    var createFormData = {
                                        year: $scope.getNextMonth($scope.firstFullDate) == 1 ? moment($scope.firstFullDate).year() - 1911 + 1 : moment($scope.firstFullDate).year() - 1911,
                                        month: $scope.getNextMonth($scope.firstFullDate),
                                        creatorDID: $cookies.get('userDID'),
                                        create_formDate: $scope.firstFullDate,
                                    };
                                    // TODO 跨月
                                    WorkHourUtil.createWorkHourForm(createFormData)
                                        .success(function (res) {
                                            $scope.getWorkHourTables();
                                        })
                                })

                        } else {
                            var createFormData = {
                                year: moment($scope.firstFullDate).year() - 1911,
                                // year: thisYear,
                                month: moment($scope.firstFullDate).month() + 1,
                                // month: thisMonth,
                                creatorDID: $cookies.get('userDID'),
                                create_formDate: $scope.firstFullDate,
                                formTables: [],
                            };


                            // TODO 跨月
                            WorkHourUtil.createWorkHourForm(createFormData)
                                .success(function (res) {
                                    $scope.getWorkHourTables();
                                })
                                .error(function () {
                                    console.log('ERROR WorkHourUtil.createWorkHourTableForm');
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'mainPage_workHour'
                                        });
                                    }, 200)
                                })
                        }
                        // 無資料
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_workHour'
                        });
                    }
                    // $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_workHour'
                        });
                    }, 200)
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
                selected = $filter('filter')($scope.allProjectCache, {
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
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }

            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].ezName : 'Not Set';
        };

        $scope.showPrjCode = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            return selected.length > 0 ? selected[0].prjCode : 'Not Set';
        };

        $scope.showProjectManager = function (prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID
                });
            }
            if (majorSelected == undefined || majorSelected.length == 0) return 'Not Set'

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
                majorSelected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID
                });
            }
            if (majorSelected == undefined) return 'Not Set';
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
                majorSelected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID
                });
            }
            if (majorSelected == undefined) return 'Not Set';
            var managerDID = majorSelected[0].managerID;
            return managerDID === $cookies.get('userDID');
        }

        // 對應行政總管
        $scope.isFitExecutive = function () {
            return ($scope.roleType == 100 || $cookies.get('userDID') == '5d197f16a6b04756c893a162')
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
                    // console.log(" ======== users National Holiday ======== ");
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

        // 加班申請單 只會有工時表填單 用的到
        function loadWOT() {
            $scope.workOverTimeAppliedTables = [];
            var formData = {
                creatorDID: $cookies.get('userDID'),
                create_formDate: $scope.firstFullDate,
            }

            WorkOverTimeUtil.fetchWOTItemFromDBByCreateFormDate(formData)
                .success(function (res) {
                    console.log(res)
                    $scope.workOverTimeAppliedTables = res.payload;
                })
        }

        $scope.loadWOTTotalMulti = function(userDID, tables) {
            var tempWorkAddTableItems = []
            // $scope.workAddConfirmTablesItems = [];
            for (var i = 0; i < tables.length; i ++) {
                var formData = {
                    creatorDID: userDID,
                    year: tables[i].year,
                    month: tables[i].month,
                    // isExecutiveConfirm: true,
                }
                WorkHourAddItemUtil.getWorkHourAddItems(formData)
                    .success(function (res) {
                        // console.log(" ===== getWorkHourAddItems ===== ");
                        // console.log(res);
                        // $$$$$ 主要顯示 $$$$$
                        tempWorkAddTableItems = tempWorkAddTableItems.concat($scope.filterData(res.payload));
                        $scope.userMap_review[userDID].tempWorkAddTableItems = tempWorkAddTableItems;
                    })
            }
        }

        // 取得加班物件
        $scope.loadWOTTotal = function(userDID, tables) {
            $scope.workAddConfirmTablesItems = [];
            for (var i = 0; i < tables.length; i ++) {
                var formData = {
                    creatorDID: userDID,
                    year: tables[i].year,
                    month: tables[i].month,
                    // isExecutiveConfirm: true,
                }
                WorkHourAddItemUtil.getWorkHourAddItems(formData)
                    .success(function (res) {
                        // console.log(" ===== getWorkHourAddItems ===== ");
                        // console.log(res);
                        // $$$$$ 主要顯示 $$$$$
                        $scope.workAddConfirmTablesItems = $scope.workAddConfirmTablesItems.concat($scope.filterData(res.payload));
                    })
            }
        }

        $scope.showWOTTotalMulti = function(userDID, tableIndex, isExecutiveConfirm, type) {
            var targetFullDate;
            switch (type) {
                case 2:
                    targetFullDate = $scope.firstFullDate_manager;
                    break;
                case 3:
                    targetFullDate = $scope.firstFullDate_executive;
                    break;
            }

            var month = 0;
            switch (tableIndex) {
                case 0:
                    month = moment(targetFullDate).month() + 1;
                    break;
                case 1:
                    month = (moment(targetFullDate).month()) === 11 ? 1
                        : (moment(targetFullDate).month() + 2);
                    break;
            }
            var results = 0.0;
            if ($scope.userMap_review[userDID].tempWorkAddTableItems == undefined) return 0.0
            for (var index = 0; index < $scope.userMap_review[userDID].tempWorkAddTableItems.length; index ++) {
                var object = $scope.userMap_review[userDID].tempWorkAddTableItems[index];
                if (object.month == month &&
                    object.isExecutiveConfirm == isExecutiveConfirm) {
                    results += $scope.showAddHour(object, 1)
                }
            }
            return results;
        }

        $scope.showWOTTotal = function(tableIndex, isExecutiveConfirm, type) {
            var targetFullDate;
            switch (type) {
                case 1:
                    targetFullDate = $scope.firstFullDate;
                    break;
                case 4:
                    targetFullDate = $scope.firstFullDate_history;
                    break;
            }

            var month = 0;
            switch (tableIndex) {
                case 0:
                    month = moment(targetFullDate).month() + 1;
                    break;
                case 1:
                    month = (moment(targetFullDate).month()) === 11 ? 1
                        : (moment(targetFullDate).month() + 2);
                    break;
            }
            var results = 0.0;
            if ($scope.workAddConfirmTablesItems == undefined) return 0.0
            for (var index = 0; index < $scope.workAddConfirmTablesItems.length; index ++) {
                var object = $scope.workAddConfirmTablesItems[index];
                if (object.month == month &&
                    object.isExecutiveConfirm == isExecutiveConfirm) {
                    results += $scope.showAddHour(object, 1)
                }
            }
            return results;
        }

        // 整理數據
        $scope.filterData = function(rawData) {
            var itemList = [];
            var workOT_date = [];

            for (var index = 0; index < rawData.length; index ++) {
                var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawData[index].create_formDate)
                    , 0) + "_" +
                    rawData[index].day + "_" +
                    rawData[index].prjDID;

                var detail = {
                    item_id: rawData[index]._id,
                    item_start_time: rawData[index].start_time,
                    item_end_time: rawData[index].end_time,
                    item_workAddType: rawData[index].workAddType,
                }

                if (workOT_date[item] != undefined) {
                    var data = workOT_date[item];
                    data.items.push(detail);

                    data.reason += ", " + rawData[index].reason
                } else {

                    itemList.push(item);
                    var items = [];
                    items.push(detail);
                    rawData[index].items = items;
                    var data = rawData[index];
                }
                eval('workOT_date[item] = data');
            }
            var result = [];
            for (var index = 0; index < itemList.length; index ++) {
                result.push(workOT_date[itemList[index]]);
            }
            return result;
        }

        // 顯示單一時數
        $scope.showAddHour = function (table_adds, type) {
            var result = 0;
            for (var index = 0; index < table_adds.items.length; index ++) {
                // if (type == table_adds.items[index].item_workAddType) {
                result += parseInt(TimeUtil.getCalculateHourDiffByTime(table_adds.items[index].item_start_time, table_adds.items[index].item_end_time));
                // }
            }

            result = result % 60 < 30 ? Math.round(result / 60) : Math.round(result / 60) - 0.5;
            if (result < 1) {
                // $scope.table.totalHourTemp = 0;
                return 0;
            }
            // $scope.table.totalHourTemp = result;
            return result;
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
                    // console.log(" ======== users work off ======== ");
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
        $scope.showCalculateHour = function(formIndex, firstFullDate, tables, day, type, tableForm) {
            if (!tables) return;
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

                            if (formIndex === 0) {
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
                        case 20011: {
                            // 加班時數
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].mon_hour_add;
                            }
                            return result;
                        }
                        case 20012: {
                            // 加班時數
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].tue_hour_add;
                            }
                            return result;
                        }
                        case 20013: {
                            // 加班時數
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].wes_hour_add;
                            }
                            return result;
                        }
                        case 20014: {
                            // 加班時數
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].thu_hour_add;
                            }
                            return result;
                        }
                        case 20015: {
                            // 加班時數
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].fri_hour_add;
                            }
                            return result;
                        }
                        case 20016: {
                            // 加班時數
                            for (index = 0; index < tables.length; index++) {
                                result += tables[index].sat_hour_add;
                            }
                            return result;
                        }
                        case 20017: {
                            // 加班時數
                            for (index = 0; index < tables.length; index++) {
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
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 1);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 1);

                        } break;
                        case 2: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].tue_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 2);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 2);

                        } break;
                        case 3: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].wes_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 3);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 3);

                        } break;
                        case 4: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].thu_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 4);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 4);

                        } break;
                        case 5: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].fri_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 5);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 5);
                        } break;
                        case 6: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].sat_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 6);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 6);

                        } break;
                        case 7: {
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].sun_hour;
                            }
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 0);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 0);

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

                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 1);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 2);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 3);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 4);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 5);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 6);
                            result += $scope.showNHCalculateHour(formIndex, firstFullDate, $scope.fetchNHTableFormDataFromScope(tableForm), 0);

                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 1);
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 2);
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 3);
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 4);
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 5);
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 6);
                            result += $scope.showWorkOffCalculateHour(formIndex, firstFullDate, $scope.fetchWorkOffTableFormDataFromScope(tableForm), 0);
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
                        case 20011: {
                            // 加班時數
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].mon_hour_add;
                            }
                            return result;
                        }
                        case 20012: {
                            // 加班時數
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].tue_hour_add;
                            }
                            return result;
                        }
                        case 20013: {
                            // 加班時數
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].wes_hour_add;
                            }
                            return result;
                        }
                        case 20014: {
                            // 加班時數
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].thu_hour_add;
                            }
                            return result;
                        }
                        case 20015: {
                            // 加班時數
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].fri_hour_add;
                            }
                            return result;
                        }
                        case 20016: {
                            // 加班時數
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
                                result += $scope.fetchFormDataFromScope(tableForm)[index].sat_hour_add;
                            }
                            return result;
                        }
                        case 20017: {
                            // 加班時數
                            for (index = 0; index < $scope.fetchFormDataFromScope(tableForm).length; index++) {
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
                    // console.log("reloadWeek main, cross day= " + $scope.checkIsCrossMonth($scope.firstFullDate));
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
                    // console.log("reloadWeek history= " + $scope.checkIsCrossMonth($scope.firstFullDate_history));
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
            // console.log("addWeek type= " + type);
            switch(type) {
                case 1: { // main page
                    $scope.firstFullDate = moment($scope.firstFullDate).day(8).format('YYYY/MM/DD');
                    $scope.reloadWeek(false, 1);
                }
                break;
                case 2: { // manager review
                    $scope.firstFullDate_manager = moment($scope.firstFullDate_manager).day(8).format('YYYY/MM/DD');
                    $scope.showRelatedMembersTableReview(TypeManager);
                }
                break;
                case 3: { // executive reviewe
                    $scope.firstFullDate_executive = moment($scope.firstFullDate_executive).day(8).format('YYYY/MM/DD');
                    $scope.showRelatedMembersTableReview(TypeExecutive);
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
            // console.log("decreaseWeek type= " + type);
            switch(type) {
                case 1: {
                    $scope.firstFullDate = moment($scope.firstFullDate).day(-6).format('YYYY/MM/DD');
                    $scope.reloadWeek(false, 1);
                }
                break;
                case 2: {
                    $scope.firstFullDate_manager = moment($scope.firstFullDate_manager).day(-6).format('YYYY/MM/DD');
                    $scope.showRelatedMembersTableReview(TypeManager);
                }
                break;
                case 3: {
                    $scope.firstFullDate_executive = moment($scope.firstFullDate_executive).day(-6).format('YYYY/MM/DD');
                    $scope.showRelatedMembersTableReview(TypeExecutive);
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
                    workAddItems: data.workAddTablesItems,
                    // formTables: data.workAddTablesItems,
                    // oldTables: data.oldTables,
                }
                // WorkHourAddItemUtil.createWorkHourAddItem(formData)
                WorkHourAddItemUtil.updateWorkHourAddItem(formData)
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
                        $scope.saveTemp(table);
                        // $scope.updateWorkHourForm();
                        // $scope.createSubmit(10, true);
                    })
                    .error(function () {
                        console.log('ERROR WorkHourAddItemUtil.createWorkHourAddItem')
                    })
            });
        };

        // ************************ CREATE SUBMIT ***************************
        // Deprecated @ 2022/0413
        $scope.createSubmit = function (delayTime, isRefreshProjectSelector) {
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_workHour'
            });
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

                        var tableItem = {
                            creatorDID: $cookies.get('userDID'),
                            prjDID: $scope.tables[majorIndex].tablesItems[itemIndex].prjDID,

                            //MON
                            mon_hour: $scope.tables[majorIndex].tablesItems[itemIndex].mon_hour,
                            mon_memo: $scope.tables[majorIndex].tablesItems[itemIndex].mon_memo,
                            mon_hour_add: $scope.tables[majorIndex].tablesItems[itemIndex].mon_hour_add,
                            mon_memo_add: $scope.tables[majorIndex].tablesItems[itemIndex].mon_memo_add,
                            //TUE
                            tue_hour: $scope.tables[majorIndex].tablesItems[itemIndex].tue_hour,
                            tue_memo: $scope.tables[majorIndex].tablesItems[itemIndex].tue_memo,
                            tue_hour_add: $scope.tables[majorIndex].tablesItems[itemIndex].tue_hour_add,
                            tue_memo_add: $scope.tables[majorIndex].tablesItems[itemIndex].tue_memo_add,
                            //WES
                            wes_hour: $scope.tables[majorIndex].tablesItems[itemIndex].wes_hour,
                            wes_memo: $scope.tables[majorIndex].tablesItems[itemIndex].wes_memo,
                            wes_hour_add: $scope.tables[majorIndex].tablesItems[itemIndex].wes_hour_add,
                            wes_memo_add: $scope.tables[majorIndex].tablesItems[itemIndex].wes_memo_add,
                            //THU
                            thu_hour: $scope.tables[majorIndex].tablesItems[itemIndex].thu_hour,
                            thu_memo: $scope.tables[majorIndex].tablesItems[itemIndex].thu_memo,
                            thu_hour_add: $scope.tables[majorIndex].tablesItems[itemIndex].thu_hour_add,
                            thu_memo_add: $scope.tables[majorIndex].tablesItems[itemIndex].thu_memo_add,
                            //FRI
                            fri_hour: $scope.tables[majorIndex].tablesItems[itemIndex].fri_hour,
                            fri_memo: $scope.tables[majorIndex].tablesItems[itemIndex].fri_memo,
                            fri_hour_add: $scope.tables[majorIndex].tablesItems[itemIndex].fri_hour_add,
                            fri_memo_add: $scope.tables[majorIndex].tablesItems[itemIndex].fri_memo_add,
                            //SAT
                            sat_hour: $scope.tables[majorIndex].tablesItems[itemIndex].sat_hour,
                            sat_memo: $scope.tables[majorIndex].tablesItems[itemIndex].sat_memo,
                            sat_hour_add: $scope.tables[majorIndex].tablesItems[itemIndex].sat_hour_add,
                            sat_memo_add: $scope.tables[majorIndex].tablesItems[itemIndex].sat_memo_add,
                            //SUN
                            sun_hour: $scope.tables[majorIndex].tablesItems[itemIndex].sun_hour,
                            sun_memo: $scope.tables[majorIndex].tablesItems[itemIndex].sun_memo,
                            sun_hour_add: $scope.tables[majorIndex].tablesItems[itemIndex].sun_hour_add,
                            sun_memo_add: $scope.tables[majorIndex].tablesItems[itemIndex].sun_memo_add,
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

                    var qqq = []
                    if ($scope.getWorkHourForms != undefined && $scope.getWorkHourForms[majorIndex] != undefined) {
                        for (var i = 0; i < $scope.getWorkHourForms[majorIndex].formTables.length; i ++) {
                            qqq.push($scope.getWorkHourForms[majorIndex].formTables[i].tableID)
                        }
                    }

                    var createFormData = {
                        year: sendYear,
                        month: sendMonth,
                        creatorDID: $cookies.get('userDID'),
                        create_formDate: $scope.firstFullDate,
                        // workHourTableData 為 []，也要送，作為更新。
                        formTables: workHourTableData,
                        oldTables: qqq,
                        // oldTables: needRemoveOldTable,
                    };

                    $scope.updateFormData = {
                        year: sendYear,
                        month: sendMonth,
                        creatorDID: $cookies.get('userDID'),
                        create_formDate: $scope.firstFullDate,
                        // workHourTableData 為 []，也要送，作為更新。
                        formTables: workHourTableData,
                        oldTables: qqq,
                        oldFormsDID: $scope.workhourFormDidArray,
                        // oldTables: needRemoveOldTable,
                    };

                    // TODO 跨月
                    WorkHourUtil.createWorkHourTableForm(createFormData)
                        .success(function (res) {
                            // var workIndex = tableIndex;

                            // // 更新old Table ID Array
                            // var workTableIDArray = [];
                            // if (res.payload.length > 0) {
                            //     for (var index = 0; index < res.payload.length; index++) {
                            //         needUpdateWorkTableIDArray.push(res.payload[index].tableID);
                            //         $scope.tables[workIndex].tablesItems[index].tableID = res.payload[index].tableID; // for send to review.
                            //     }
                            // }
                            // 移除舊有 tableID;
                            // needRemoveOldTable = {
                            //     tableIDArray: needUpdateWorkTableIDArray,
                            // }

                            WorkHourUtil.removeWorkHourTableForm($scope.updateFormData)
                                .success(function (res) {
                                    tableIndex++;
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
                                    }, 200)
                                })
                        })
                        .error(function () {
                            console.log('ERROR WorkHourUtil.createWorkHourTableForm');
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'mainPage_workHour'
                                });
                            }, 200)
                        })
                }
            }, delayTime);
        }

        $scope.updateWorkHourForm = function() {
            // 更新old Table ID Array
            var formCounts = 0;
            for (var formIndex = 0; formIndex < $scope.tables.length; formIndex ++) {

                var tableIndex = 0;
                // 工時表內的 列表數
                var updateFormData = {
                    _id: $scope.tables[formIndex]._id,
                    formTables: $scope.tables[formIndex].formTables,
                };
                WorkHourUtil.updateWorkHourForm(updateFormData)
                    .success(function (resp) {
                        formCounts++;
                        if (formCounts == $scope.tables.length) {
                            $scope.getWorkHourTables();
                        }
                    })
            }
        }

        // 提醒使用者工時表時數 Via Dialog
        $scope.reviewFormCheck = function(formIndex, table) {
            // 國定假日
            var NHCount = 0;
            var NHCount_before_cross = 0;
            var NHCount_after_cross = 0;
            for (var index = 0; index < $scope.nationalHolidayTables.length; index ++) {
                if ($scope.nationalHolidayTables[index].isEnable) {
                    NHCount++
                    if ($scope.nationalHolidayTables[index].day >= $scope.checkIsCrossMonth($scope.firstFullDate) || $scope.nationalHolidayTables[index].day === 0) {
                        NHCount_after_cross ++;
                    } else {
                        NHCount_before_cross ++;
                    }
                }
            }
            // console.log("National Holiday (國定假日) counts= " + NHCount);

            // 補班日
            var OTCount = 0;
            var OTCount_before_cross = 0;
            var OTCount_after_cross = 0;
            for (var index = 0; index < $scope.overTimeTables.length; index ++) {
                // console.log("補班日= " + $scope.overTimeTables[index].day);
                if ($scope.overTimeTables[index].isEnable) {
                    OTCount++
                    if ($scope.overTimeTables[index].day >= $scope.checkIsCrossMonth($scope.firstFullDate) || $scope.overTimeTables[index].day === 0) {
                        OTCount_after_cross ++;
                    } else {
                        OTCount_before_cross ++;
                    }
                }
            }
            // console.log("Over Time (補班日) counts= " + OTCount);

            // 每周工作天 = 5
            var weeklyWorkDay = 5;
            var reviewWorkDay = weeklyWorkDay + OTCount - NHCount;

            // 有跨週情形，跨週日
            // console.log("checkIsCrossMonth (跨週日)= " + $scope.checkIsCrossMonth($scope.firstFullDate));
            if ($scope.checkIsCrossMonth($scope.firstFullDate) > 0) {
                switch(formIndex) {
                    case 0:
                        // console.log("cross work day= " + ($scope.checkIsCrossMonth($scope.firstFullDate) > 5 ? 5 : $scope.checkIsCrossMonth($scope.firstFullDate) - 1));
                        weeklyWorkDay = ($scope.checkIsCrossMonth($scope.firstFullDate) > 5 ? 5 : $scope.checkIsCrossMonth($scope.firstFullDate) - 1);
                        // console.log("上表單，OTCount_befor_cross= " + OTCount_befor_cross);
                        // console.log("上表單，NHCount_befor_cross= " + NHCount_befor_cross);
                        reviewWorkDay = weeklyWorkDay + OTCount_before_cross - NHCount_before_cross;
                        break;
                    case 1:
                        // console.log("cross work day= " + ($scope.checkIsCrossMonth($scope.firstFullDate) > 5 ? 0 : (weeklyWorkDay - ($scope.checkIsCrossMonth($scope.firstFullDate)) + 1)));
                        weeklyWorkDay =  ($scope.checkIsCrossMonth($scope.firstFullDate) > 5 ? 0 : (weeklyWorkDay - ($scope.checkIsCrossMonth($scope.firstFullDate)) + 1));
                        // console.log("下表單，OTCount_after_cross= " + OTCount_after_cross);
                        // console.log("下表單，NHCount_after_cross= " + NHCount_after_cross);
                        reviewWorkDay = weeklyWorkDay + OTCount_after_cross - NHCount_after_cross;
                        break;
                }
            }
            // console.log("reviewWorkDay (工作日) counts= " + reviewWorkDay + ", hours= " + $scope.showCalculateHour(tableIndex, $scope.firstFullDate, $scope.tables[tableIndex].tablesItems, 1001, 1));
            // console.log(((reviewWorkDay + NHCount_after_cross - OTCount_after_cross) * 8));
            switch(formIndex) {
                case 0:
                    if ($scope.showCalculateHour(formIndex, $scope.firstFullDate, $scope.tables[formIndex].tablesItems, 1001, 1) !==
                        ((reviewWorkDay + NHCount_before_cross - OTCount_before_cross) * 8)) {
                        $scope.titleClass = 'bg-danger';
                        $scope.checkText = '該周工時表時數非 ' + ((reviewWorkDay)  * 8) + '，確定提交 審查？';
                    } else {
                        $scope.titleClass = 'bg-warning';
                        $scope.checkText = '工作時數確認正確 ' + ((reviewWorkDay)  * 8) +' ，確定提交 審查？';
                    }
                    break;
                case 1:
                    if ($scope.showCalculateHour(formIndex, $scope.firstFullDate, $scope.tables[formIndex].tablesItems, 1001, 1) !==
                        ((reviewWorkDay + NHCount_after_cross - OTCount_after_cross) * 8)) {
                        $scope.titleClass = 'bg-danger';
                        $scope.checkText = '該周工時表時數非 ' + ((reviewWorkDay)  * 8) + '，確定提交 審查？';
                    } else {
                        $scope.titleClass = 'bg-warning';
                        $scope.checkText = '工作時數確認正確 ' + ((reviewWorkDay)  * 8) +' ，確定提交 審查？';
                    }
                    break;
            }
            $scope.reviewTable = table;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormReviewModalTotal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 使用者確認提交
        $scope.reviewForm = function(table) {
            var tableList = [];
            var targetList = [];
            var msgTopicList = [];
            var msgDetailList = [];
            var memoList = [];
            for (var index = 0; index < table.tablesItems.length; index ++) {
                if (!table.tablesItems[index].isSendReview) { // 未被審查的項目 才需要通知；已經遞交審查的不通知
                    tableList[index] = table.tablesItems[index].tableID;
                    if (!targetList.includes($scope.showProjectManagerDID(table.tablesItems[index].prjDID))) { // 一張表格多個項目有相同的經理的話，只通知一次
                        targetList[index] = $scope.showProjectManagerDID(table.tablesItems[index].prjDID);
                        memoList[index] = table.tablesItems[index].create_formDate;
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
            // console.log(" ===== updateTotalTableSendReview ===== ");
            WorkHourUtil.updateTotalTableSendReview(formData)
                .success(function (res) {
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
                    $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                    $scope.getWorkHourTables();
                })
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

            var tableSort = []; // 為了做跨月排序用
            WorkHourUtil.getWorkHourForm(getData)
                .success(function (res) {

                    if (res.payload.length > 0) {
                        res.payload = res.payload.sort(function (a, b) {
                            var dateA = a.year +1911 + "/" + a.month;
                            var dateB = b.year +1911 + "/" + b.month;
                            return moment(dateA) > moment(dateB) ? 1 : -1;
                        });
                        $scope.loadWOTTotal(vm.history.selected._id, res.payload);
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

                            tableSort.push(workTableIDArray);

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

                                            updateTs: res.payload[index].updateTs,
                                            updateAction: res.payload[index].updateAction,
                                        };
                                        // $scope.tables_history[workIndex].tablesItems.push(detail);
                                        // 跨月表單用以區分
                                        if (tableSort[0].indexOf(res.payload[index]._id) >= 0) {
                                            $scope.tables_history[0].tablesItems.push(detail);
                                        } else {
                                            $scope.tables_history[1].tablesItems.push(detail);
                                        }
                                    }

                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'history_workHour'
                                        });
                                    }, 200)
                                })
                                .error(function () {
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'history_workHour'
                                        });
                                    }, 200)
                                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                                })
                        }
                        loadWorkOffTable(vm.history.selected._id, 4);
                        loadNH(4);
                        loadOT(4);
                    } else {
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
                    }, 200)
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
                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "managerAgree"
            }
            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    $scope.showTableOfItem(user, null, null, null, null, null, 1);
                })
        }

        //專案經理一鍵確認 -1
        $scope.reviewWHManagerAll = function (user, form, index) {
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
                        if ($scope.fetchFormDataFromScope(form[formIndex])[index].isSendReview && !$scope.fetchFormDataFromScope(form[formIndex])[index].isManagerCheck) { // 已經送審的才更新
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
                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "managerAgree"
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
                    // $scope.fetchRelatedMembers();
                    $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                    $scope.showRelatedMembersTableReview(1);
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

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "managerReject"
            }

            var targetList = [item.creatorDID];
            var msgTopicList = [1000];
            var msgDetailList = [1003];
            var memoList = [item.create_formDate];

            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {

                    var formData = {
                        creatorDID: $cookies.get('userDID'),
                        msgTargetArray: targetList,
                        msgMemoArray: memoList,
                        msgTopicArray: msgTopicList,
                        msgDetailArray: msgDetailList,
                    }
                    NotificationMsgUtil.createMsgItem(formData)
                        .success(function (req) {

                        })
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
                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "executiveAgree"
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
                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "executiveReject"
            }

            var targetList = [checkingTable.creatorDID];
            var msgTopicList = [1000];
            var msgDetailList = [1004];
            var memoList = [checkingTable.create_formDate];

            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {

                    var formData = {
                        creatorDID: $cookies.get('userDID'),
                        msgTargetArray: targetList,
                        msgMemoArray: memoList,
                        msgTopicArray: msgTopicList,
                        msgDetailArray: msgDetailList,
                    }
                    NotificationMsgUtil.createMsgItem(formData)
                        .success(function (req) {

                        })
                    $scope.showTableOfItem(form, null, null, null, null, null, 2);
                })
        }

        //行政總管一鍵確認 -1
        $scope.reviewWHExecutiveAll = function (user, form, clickIndex) {
            $scope.checkText = "確定 同意： 全部 ？";
            $scope.checkingForm = user;
            $scope.checkingTable = form;
            $scope.mIndex = clickIndex;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkHourTableFormAgree_ExecutiveAllModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }
        //行政總管一鍵確認 -2
        $scope.sendWHExecutiveAllAgree = function (user, form, clickIndex) {
            var updateTables = [];
            var updatePrjDID = [];
            for (var index = 0; index < $scope.fetchFormDataFromScope(form[clickIndex]).length; index++) {
                // 行政總管跟所有專案有關
                if ($scope.fetchFormDataFromScope(form[clickIndex])[index].isManagerCheck && !$scope.fetchFormDataFromScope(form[clickIndex])[index].isExecutiveCheck) { // 經理審查過的的才更新
                    updateTables.push($scope.fetchFormDataFromScope(form[clickIndex])[index].tableID);
                    updatePrjDID.push($scope.fetchFormDataFromScope(form[clickIndex])[index].prjDID);
                }
            }
            var formData = {
                tableIDs: updateTables,
                // isSendReview: null,
                // isManagerCheck: true,
                isExecutiveCheck: true,
                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "executiveAgree"
            }
            WorkHourUtil.updateWHTableArray(formData)
                .success(function (res) {
                    // $scope.fetchManagerRelatedMembers();
                    // $scope.fetchExecutiveRelatedMembers();

                    var targetList = [user.DID];
                    var msgTopicList = [1000];
                    var msgDetailList = [1005];
                    var memoList = [$scope.firstFullDate_executive];

                    $scope.showTableOfItem(user, null, null, null, null, null, 2);
                })
            formData = {
                month: form[clickIndex].month,
                prjDIDs: updatePrjDID,
                create_formDate: form[clickIndex].create_formDate,
                creatorDID: user.DID,
            }

            WorkHourAddItemUtil.updateRelatedAddItemByProject(formData)
                .success(function (res) {
                    // console.log(res);
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
                    $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                })
                .error(function () {
                })
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
                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "executiveCancel"
            }
            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
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
                if (workOffType == 4 || workOffType == 5
                    || workOffType == 7 || workOffType == 8 || workOffType == 9) {

                    resultFinal = resultFinal <= 4 ? 4 : 8;
                }
                return resultFinal;
            }
        }

        $scope.getHourDiffByTime = function (start, end) {
            // console.log("- WorkHourTableFormCtrl, start= " + start + ", end= " + end + ", type= " + type);
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
        $scope.mainRelatedMembers = [];

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
                case "1": // 技師
                case "2": // 經理
                    // Project.getProjectRelatedToManager(formData)
                    //     .success(function (relatedProjects) {
                    //         for(var index = 0; index < relatedProjects.length; index ++) {
                    //             // 相關專案
                    //             managersRelatedProjects.push(relatedProjects[index]._id);
                    //         }
                    //         // 工時表有填寫過的項目就會出現
                    //         User.getAllUsers()
                    //             .success(function (allUsers) {
                    //                 for (var index = 0; index < allUsers.length; index ++) {
                    //                     relatedMembers.push(allUsers[index]._id);
                    //                 }
                    //                 $scope.mainRelatedMembers = relatedMembers;
                    //                 $scope.showRelatedMembersTableReview(TypeManager);
                                // });
                        // })
                    break;
                case "100": //顯示行政審查人員
                    // Project.getProjectRelatedToManager(formData)
                    //     .success(function (relatedProjects) {
                    //         // console.log(" ======== Projects related to manager  ======== ");
                    //         for(var index = 0; index < relatedProjects.length; index ++) {
                    //             // 相關專案
                    //             managersRelatedProjects.push(relatedProjects[index]._id);
                    //         }
                    //
                    //         // 行政總管跟每個人都有關
                    //
                    //         // // 所有人，對照資料
                    //         User.getAllUsers()
                    //             .success(function (allUsers) {
                    //                 var relatedMembers_all = [];
                    //                 vm.executiveUsers = allUsers;
                    //
                    //                 for (var index = 0; index < vm.executiveUsers.length; index ++) {
                    //                     relatedMembers_all.push(vm.executiveUsers[index]._id);
                    //                     relatedMembers.push(vm.executiveUsers[index]._id);
                    //                 }
                    //                 $scope.mainRelatedMembers = relatedMembers;
                    //                 $scope.showRelatedMembersTableReview(TypeManager);
                    //                 $scope.mainRelatedMembers_all = relatedMembers_all;
                    //                 $scope.showRelatedMembersTableReview(TypeExecutive);
                    //             });
                    //     })
                    break;
            }

            // if ($scope.userDID  == '5d197f16a6b04756c893a162') {
            //     Project.getProjectRelatedToManager(formData)
            //         .success(function (relatedProjects) {
            //             // console.log(" ======== Projects related to manager  ======== ");
            //             for(var index = 0; index < relatedProjects.length; index ++) {
            //                 // 相關專案
            //                 managersRelatedProjects.push(relatedProjects[index]._id);
            //             }
            //             // 行政總管跟每個人都有關
            //
            //             // // 所有人，對照資料
            //             User.getAllUsers()
            //                 .success(function (allUsers) {
            //                     var relatedMembers_all = [];
            //                     vm.executiveUsers = allUsers;
            //
            //                     for (var index = 0; index < vm.executiveUsers.length; index ++) {
            //                         relatedMembers_all.push(vm.executiveUsers[index]._id);
            //                         relatedMembers.push(vm.executiveUsers[index]._id);
            //                     }
            //                     $scope.mainRelatedMembers = relatedMembers;
            //                     $scope.showRelatedMembersTableReview(TypeManager);
            //                     $scope.mainRelatedMembers_all = relatedMembers_all;
            //                     $scope.showRelatedMembersTableReview(TypeExecutive);
            //                 });
            //         })
            // }
        }

        const TypeManager = 1;
        const TypeExecutive = 2;

        // show Related Members Table Review.
        $scope.showRelatedMembersTableReview = function(type) {
            managersRelatedProjects = $rootScope.managersRelatedProjects;

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
                case TypeManager: {
                    bsLoadingOverlayService.start({
                        referenceId: 'manager_workHour'
                    });
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
                        // relatedMembers: $scope.mainRelatedMembers,
                        relatedMembers: JSON.parse($cookies.get('relatedUserDIDArray_All')),
                        create_formDate: targetFormFullDate,
                    }
                } break;
                case TypeExecutive: {

                    bsLoadingOverlayService.start({
                        referenceId: 'executive_workHour'
                    });

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
                        // relatedMembers: $scope.mainRelatedMembers_all,
                        relatedMembers: JSON.parse($cookies.get('relatedUserDIDArray_Executive')),
                        create_formDate: targetFormFullDate,
                    }
                } break;
            }
            // 為審查做準備的資料
            WorkHourUtil.getWorkHourFormMultiple(getData)
                .success(function (res) {
                    var relatedUsersAndTables = [];
                    // 一個UserDID只有一個物件
                    var existDIDArray = [];
                    if (res.payload.length > 0) {
                        res.payload = res.payload.sort(function (a, b) {
                            var dateA = a.year +1911 + "/" + a.month;
                            var dateB = b.year +1911 + "/" + b.month;
                            return moment(dateA) > moment(dateB) ? 1 : -1;
                        });
                        // users
                        for (var formIndex = 0; formIndex < res.payload.length; formIndex ++) {

                            var userObject = undefined;
                            var evalString = "userObject = {'" + res.payload[formIndex].creatorDID + "': []}";
                            eval(evalString);
                            // customized
                            userObject.DID = res.payload[formIndex].creatorDID;
                            switch (type) {
                                case TypeManager:
                                    userObject.crossDay = $scope.checkIsCrossMonth($scope.firstFullDate_manager);
                                    break;
                                case TypeExecutive:
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
                            // var isProjectIncluded = false;
                            // inter:
                            // for (var tablesIndex = 0; tablesIndex < res.payload[formIndex].formTables.length; tablesIndex ++) {
                            //     if (managersRelatedProjects.includes(res.payload[formIndex].formTables[tablesIndex].prjDID) || type == typeExecutive) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
                            //         isProjectIncluded = true;
                            //         break inter;
                            //     }
                            // }
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
                        switch (type) {
                            case TypeManager:
                                $scope.checkUserReviewStatus(relatedUsersAndTables, false, null, type);
                                break;
                            case TypeExecutive:
                                $scope.checkUserReviewStatus(relatedUsersAndTables, true, false, type);
                                break;
                        }
                    } else {
                        switch (type) {
                            case TypeManager:
                                bsLoadingOverlayService.stop({
                                    referenceId: 'manager_workHour'
                                });
                                break;
                            case TypeExecutive:
                                bsLoadingOverlayService.stop({
                                    referenceId: 'executive_workHour'
                                });
                                break;
                        }
                    }
                    // $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                })
                .error(function () {
                    switch (type) {
                        case TypeManager:
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'manager_workHour'
                                });
                            }, 200);
                            break;
                        case TypeExecutive:
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'executive_workHour'
                                });
                            }, 200);
                            break;
                    }
                    console.log('Error, WorkHourUtil.getWorkHourFormMultiple');
                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                })
        }

        // 檢查該使用者是否有提交合規則的表單
        $scope.checkUserReviewStatus = function(userTables
                                                , isFindManagerCheckFlag
                                                , isFindExecutiveCheck
                                                , type) {
            var tableTotalCounts = 0;
            const getReviewData = async (formDataTable) => {
                // 取得 Table Data
                WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                    .success(function (res) {
                        for (var index = 0; index < res.payload.length; index++) {
                            if (managersRelatedProjects.includes(res.payload[index].prjDID) || type == 2 || type == 6) {
                                var mUser = $scope.fetchReviewUserFromScope(res.payload[index].creatorDID);
                                if (!userDIDExistArray.includes(mUser.DID)) {
                                    userResult.push(mUser);
                                    userDIDExistArray.push(mUser.DID);
                                }
                            }
                        }
                        // userCount ++;
                        switch (type) {
                            case TypeManager:
                                $scope.usersReviewForManagers = userResult;
                                break;
                            case TypeExecutive:
                                $scope.usersReviewForExecutive = userResult;
                                break;
                        }
                        switch (type) {
                            case TypeManager:
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'manager_workHour'
                                    });
                                }, 200);
                                break;
                            case TypeExecutive:
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'executive_workHour'
                                    });
                                }, 200);
                                break;
                        }
                    })
                    .error(function () {
                        switch (type) {
                            case TypeManager:
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'manager_workHour'
                                    });
                                }, 200);
                                break;
                            case TypeExecutive:
                                $timeout(function () {
                                    bsLoadingOverlayService.stop({
                                        referenceId: 'executive_workHour'
                                    });
                                }, 200);
                                break;
                        }
                        toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                    })
                return 'getData sendRequest Done';
            }
            // var worker = new Worker("app/webWorkers/worker.js"); // 創建一個 worker 物件
            //
            // worker.onmessage = function(e) { // 設定 worker 的監聽事件
            //     getReviewData(e.data).then(res => {
            //         // console.log(res);
            //     })
            //     // worker.terminate(); // 結束 worker
            // }

            var userResult = []; // 審查的人員清單
            var userDIDExistArray = []; // 檢查清單不重複
            // var userCount = 0;
            var workTableIDArray = [];
            var user;
            var userDIDArray = [];
            for (var userIndex = 0; userIndex < userTables.length; userIndex ++) {
                user = userTables[userIndex];
                userDIDArray.push(user.DID);

                var tablesLength = user[user.DID].length;

                if (tablesLength > 0) {
                    tableTotalCounts += tablesLength;
                }

                for (var majorIndex = 0; majorIndex < tablesLength; majorIndex ++) {
                    var workItemCount = user[user.DID][majorIndex].formTables.length;
                    // workTableIDArray = [];
                    // 組成 prjID Array, TableID Array，再去Server要資料
                    for (var index = 0; index < workItemCount; index++) {
                        // workTableIDArray[index] = user[user.DID][majorIndex].formTables[index].tableID;
                        workTableIDArray.push(user[user.DID][majorIndex].formTables[index].tableID);
                    }
                    // formDataTable = {
                    //     creatorDID: user.DID,
                    //     tableIDArray: workTableIDArray,
                    //     isFindSendReview: true,
                    //     isFindManagerCheck: isFindManagerCheckFlag,
                    //     isFindExecutiveCheck: isFindExecutiveCheck,
                    //     isFindManagerReject: null,
                    //     isFindExecutiveReject: null
                    // }
                    // getReviewData(formDataTable).then(res => {
                    // })
                }
            }
            formDataTable = {
                // creatorDIDArray: userDIDArray,
                tableIDArray: workTableIDArray,
                isFindSendReview: true,
                isFindManagerCheck: isFindManagerCheckFlag,
                isFindExecutiveCheck: isFindExecutiveCheck,
                isFindManagerReject: null,
                isFindExecutiveReject: null
            }
            getReviewData(formDataTable).then(resp => {
            })
            if (tableTotalCounts == 0) {
                switch (type) {
                    case TypeManager:
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'manager_workHour'
                            });
                        }, 200);
                        break;
                    case TypeExecutive:
                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'executive_workHour'
                            });
                        }, 200);
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
            // console.log(" ==== showTableOfItem ===== ");
            //TODO Multiple
            var tablesLength = userData[userData.DID].length;

            var tableSort = [];
            $scope.loadWOTTotalMulti(userData.DID, userData[userData.DID]);
            userData[userData.DID] = userData[userData.DID].sort(function (a, b) {
                var dateA = a.year +1911 + "/" + a.month;
                var dateB = b.year +1911 + "/" + b.month;
                return moment(dateA) > moment(dateB) ? 1 : -1;
            });

            for (var majorIndex = 0; majorIndex < tablesLength; majorIndex ++) {
                var tableIndex = 0;
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
                WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                    .success(function (res) {
                        var isNeedToReview = false;
                        var workIndex = tableIndex;
                        tableIndex++;
                        // 填入表單資訊
                        // $scope.tableData = {};
                        var formTables = [];
                        var isFirstRaw = false;
                        for (var index = 0; index < res.payload.length; index++) {
                            if (managersRelatedProjects.includes(res.payload[index].prjDID) || type == 2 || type == 6) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
                                if(!res.payload[index].isManagerCheck || type == 2 || type == 6) {
                                    isNeedToReview = true;
                                }
                            }
                        }

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

                                    updateTs: res.payload[index].updateTs,
                                    updateAction: res.payload[index].updateAction,

                                };
                                formTables.push(detail);
                                if (tableSort[0].indexOf(res.payload[index]._id) >= 0) {
                                    isFirstRaw = true;
                                }
                                // }
                            }
                        }

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
            // $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
        }

        // get work Off tables
        // 經理審查、行政審查
        $scope.fetchWorkOffReviewTables = function(userDID, type) {
            var create_formDate;

            switch (type) {
                case TypeManager: {
                    create_formDate = $scope.firstFullDate_manager;
                } break;
                case TypeExecutive: {
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
                    // $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                })
                .error(function () {
                    console.log('ERROR WorkOffFormUtil.findWorkOffTableFormByUserDID');
                })
        }

        // get work Off Tables in scope.
        $scope.fetchWorkOffTableFormDataFromScope = function(table) {
            return $scope.workOffTablesItems[table.creatorDID] === undefined ? [] : $scope.workOffTablesItems[table.creatorDID];
        }

        // show 休假
        $scope.showWorkOffCalculateHour = function (formIndex, firstFullDate, tables, day) {
            var crossDay = $scope.checkIsCrossMonth(firstFullDate);
            switch (formIndex) {
                case 0: {
                    if (day < crossDay || crossDay == -1) {
                        var result = 0;
                        for (var index = 0; index < tables.length; index++) {
                            if (day == tables[index].day && (tables[index].isBossCheck && tables[index].isExecutiveCheck)) {
                                result += getHourDiffByTime(tables[index].start_time, tables[index].end_time, tables[index].workOffType);
                            };
                        }
                        return result;
                    }
                }
                break;
                case 1:{
                    if (day >= crossDay || day === 0) {
                        var result = 0;
                        for (var index = 0; index < tables.length; index++) {
                            if (day == tables[index].day && (tables[index].isBossCheck && tables[index].isExecutiveCheck)) {
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
                case TypeManager: {
                    fetchNationalHolidayData = {
                        create_formDate: $scope.firstFullDate_manager,
                        // year: thisYear,
                    }
                } break;
                case TypeExecutive: {
                    fetchNationalHolidayData = {
                        create_formDate: $scope.firstFullDate_executive,
                        // year: thisYear,
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
                    } else {
                    }
                    var evalString = "$scope.workNHTablesItems['" + userDID + "'] = formTables";
                    eval(evalString);
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
            if(table == undefined) return;
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
            switch (viewType) {
                case 1: {
                    $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT), 0));
                    $scope.reloadWeek(false, 1);
                } break;
                case 4: {
                    $scope.firstFullDate_history = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0);
                    $scope.reloadWeek(false, 4);
                } break;
                case 2: {
                    $scope.firstFullDate_manager = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0);
                    $scope.showRelatedMembersTableReview(TypeManager)
                } break;
                case 3: {
                    $scope.firstFullDate_executive = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0);
                    $scope.showRelatedMembersTableReview(TypeExecutive);
                } break;
                // management
                case 5: {
                    $scope.firstFullDate_management = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(datepicker.myDT)), 0);
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

            if ($scope.mainRelatedMembers.length == 0) {
                $scope.mainRelatedMembers.push($cookies.get('userDID'));
            }
            apiData = {
                users: $scope.mainRelatedMembers,
                creatorDID: $cookies.get('userDID')
                // date: $scope.firstFullDate_management
            }

            switch($scope.roleType) {
                case "1":
                case "6":
                case "2": {

                    bsLoadingOverlayService.start({
                        referenceId: 'management_workHour'
                    });

                    var fetchData = {
                        prjDIDs: $rootScope.managersRelatedProjects,
                        create_formDate: $scope.firstFullDate_management,
                    }

                    WorkHourUtil.fetchRelatedUserDIDByProjectDID(fetchData)
                        .success(function (resp) {
                            var relatedMangerUserDID = [];
                            for (var index = 0; index < resp.payload.length; index ++) {
                                relatedMangerUserDID.push(resp.payload[index]._id);
                            }

                            if (!relatedMangerUserDID.includes($cookies.get('userDID'))) {

                                relatedMangerUserDID.push($cookies.get('userDID'));
                            }

                            apiData = {
                                users: relatedMangerUserDID,
                                creatorDID: $cookies.get('userDID')
                            }

                            if ($cookies.get('userDID') == '5d197f16a6b04756c893a162') {
                                apiData = {
                                    users: JSON.parse($cookies.get('relatedUserDIDArray_Executive')),
                                    creatorDID: $cookies.get('userDID')
                                    // date: $scope.firstFullDate_management
                                }
                            }

                            WorkHourUtil.insertWorkHourTempsData(apiData)
                                .success(function (res) {
                                    var nextApiData = {
                                        date: $scope.firstFullDate_management,
                                        creatorDID: $cookies.get('userDID'),
                                    }
                                    WorkHourUtil.fetchWorkHourFormManagementList(nextApiData)
                                        .success(function (res) {
                                            $scope.workHourManagementList = res.payload;
                                            $timeout(function () {
                                                bsLoadingOverlayService.stop({
                                                    referenceId: 'management_workHour'
                                                });
                                            }, 200)
                                        })
                                        .error(function () {
                                            $timeout(function () {
                                                bsLoadingOverlayService.stop({
                                                    referenceId: 'management_workHour'
                                                });
                                            }, 200)
                                            console.log("Error, WorkHourUtil.fetchWorkHourFormManagementList");
                                        })
                                })
                                .error(function () {
                                    $timeout(function () {
                                        bsLoadingOverlayService.stop({
                                            referenceId: 'management_workHour'
                                        });
                                    }, 200)
                                    console.log('Error, WorkHourUtil.insertWorkHourFormManagementRelatedMembersTemp');
                                    toastr.error('Server忙碌中，請再次讀取表單', '錯誤');
                                })

                        })
                }
                    return;
                case "100": {
                    apiData = {
                        users: JSON.parse($cookies.get('relatedUserDIDArray_Executive')),
                        creatorDID: $cookies.get('userDID')
                        // date: $scope.firstFullDate_management
                    }
                }
                break;
            }

            if ($cookies.get('userDID') == '5d197f16a6b04756c893a162') {
                apiData = {
                    users: JSON.parse($cookies.get('relatedUserDIDArray_Executive')),
                    creatorDID: $cookies.get('userDID')
                    // date: $scope.firstFullDate_management
                }
            }

            bsLoadingOverlayService.start({
                referenceId: 'management_workHour'
            });
            WorkHourUtil.insertWorkHourTempsData(apiData)
                .success(function (res) {
                    var nextApiData = {
                        date: $scope.firstFullDate_management,
                        creatorDID: $cookies.get('userDID'),
                    }
                    WorkHourUtil.fetchWorkHourFormManagementList(nextApiData)
                        .success(function (res) {
                            $scope.workHourManagementList = res.payload;
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'management_workHour'
                                });
                            }, 200)
                        })
                        .error(function () {
                            $timeout(function () {
                                bsLoadingOverlayService.stop({
                                    referenceId: 'management_workHour'
                                });
                            }, 200)
                            console.log("Error, WorkHourUtil.fetchWorkHourFormManagementList");
                        })
                })
                .error(function () {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'management_workHour'
                        });
                    }, 200)
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
                                        if (!item.work_hour_tables[index].isManagerCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[0].formTables[index_form_tables].tableID) {
                                            $('#a_' + dom.$index).css('color', '#dfb81c');
                                            return "等待確認"
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[0].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
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
                                        if (!item.work_hour_tables[index].isSendReview
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[0].formTables[index_form_tables].tableID) {
                                            return ""
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[0].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
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
                                        if (!item.work_hour_tables[index].isManagerCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[0].formTables[index_form_tables].tableID) {
                                            return ""
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[0].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
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
                                        if (!item.work_hour_tables[index].isSendReview
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            $('#aa_' + dom.$index).css('color', '#dfb81c');
                                            return "編輯中"
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                        if (!item.work_hour_tables[index].isManagerCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            $('#aa_' + dom.$index).css('color', '#dfb81c');
                                            return "等待確認"
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
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
                                        if (!item.work_hour_tables[index].isSendReview
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            return ""
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
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
                                        if (!item.work_hour_tables[index].isManagerCheck
                                            && item.work_hour_tables[index]._id == item.work_hour_forms[1].formTables[index_form_tables].tableID) {
                                            return ""
                                        }
                                    }
                                }
                                for (var index_form_tables = 0; index_form_tables < item.work_hour_forms[1].formTables.length; index_form_tables++) {
                                    for (var index = 0; index < item.work_hour_tables.length; index ++) {
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
                                if (!item.work_hour_tables[index].isSendReview) {
                                    $('#a_' + dom.$index).css('color', '#dfb81c');
                                    return "編輯中"
                                }
                            }
                            for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                if (!item.work_hour_tables[index].isManagerCheck) {
                                    $('#a_' + dom.$index).css('color', '#dfb81c');
                                    return "等待確認"
                                }
                            }
                            for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                if (!item.work_hour_tables[index].isExecutiveCheck) {
                                    $('#a_' + dom.$index).css('color', '#dfb81c');
                                    return "等待確認"
                                }
                            }
                            $('#a_' + dom.$index).css('color', '#90b900');
                            return "審查完成"
                        }
                        case 2: { //經理/主任狀態
                                for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                    if (!item.work_hour_tables[index].isSendReview) {
                                        return ""
                                    }
                                }
                                for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                    if (!item.work_hour_tables[index].isManagerCheck) {
                                        $('#b_' + dom.$index).css('color', '#dfb81c');
                                        return "等待確認"
                                    }
                                }
                            $('#b_' + dom.$index).css('color', '#2dacd1');
                            return "審核完成"
                        }
                        case 3: { // 行政總管狀態
                            for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                if (!item.work_hour_tables[index].isManagerCheck) {
                                    return ""
                                }
                            }
                            for (var index = 0; index < item.work_hour_tables.length; index ++) {
                                if (!item.work_hour_tables[index].isExecutiveCheck) {
                                    $('#c_' + dom.$index).css('color', '#dfb81c');
                                    return "等待審核"
                                }
                            }
                            $('#c_' + dom.$index).css('color', '#2dacd1');
                            return "審核完成"
                        }
                    }
                }
            }

        }

        $scope.nextMonth = function () {
            return moment($scope.firstFullDate_management).month() == 11 ? 1 : moment($scope.firstFullDate_management).month() + 2;
        }

        $scope.getNextMonth = function (firstFullDate) {
            return moment(firstFullDate).month() == 11 ? 1 : moment(firstFullDate).month() + 2;
        }

        // 只有工時表填單用得到
        $scope.isWOTApplied = function(day, item) {
            for (var index = 0; index < $scope.workOverTimeAppliedTables.length; index ++) {
                if($scope.workOverTimeAppliedTables[index].day == day && $scope.workOverTimeAppliedTables[index].prjDID == item.prjDID) {
                    return true
                }
            }
            return false
        }

        $scope.reloadWOTReviewPage = function (dom) {
            dom.getWOTReviewData_manager();
        }

        $scope.showUpdateAction = function (action) {
            return UpdateActionUtil.convertAction(action);
        }

        $scope.cancelReview = function(table) {

            $scope.checkText = '確定 抽回：' + $scope.showPrjCode(table.prjDID) + " " +
                $scope.showPrjNameEZ(table.prjDID) +
                "  ？";
            $scope.checkingTable = table;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkOffTableFormCancelReview_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendCancelReview = function(checkingTable) {
            checkingTable.isSendReview = false;

            checkingTable.isManagerCheck = false;
            checkingTable.isManagerReject = false;

            checkingTable.isExecutiveCheck = false;
            checkingTable.isExecutiveReject = false;

            checkingTable.updateTs = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
            checkingTable.updateAction = "cancelReview";

            var formData = {
                tableID: checkingTable.tableID,
                isSendReview: false,

                isManagerCheck: false,
                isManagerReject: false,

                isExecutiveCheck: false,
                isExecutiveReject: false,

                updateTs: checkingTable.updateTs,
                updateAction: "cancelReview",
            }

            WorkHourUtil.updateWHTable(formData)
                .success(function (res) {
                    $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                    // $scope.getWorkHourTables();
                })
        }

        $scope.proxyApi = function (dom) {
            dom.fetchWorkOverTimeData();
        }

        $scope.getWorkHourTables();

    } // function End line
})();
