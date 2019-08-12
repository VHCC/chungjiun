/**
 * @author Ichen.chu
 * created on 30.07.2019
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .controller('workHourOTDistributionPersonCtrl',
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
                    'WorkHourAddItemUtil',
                    'bsLoadingOverlayService',
                    'toastr',
                    WorkHourOTDistributionPersonCtrl
                ]);

        /** @ngInject */
        function WorkHourOTDistributionPersonCtrl($scope,
                               $filter,
                               $cookies,
                               $timeout,
                               $compile,
                               ngDialog,
                               User,
                               DateUtil,
                               TimeUtil,
                               Project,
                               ProjectUtil,
                               WorkHourUtil,
                               WorkHourAddItemUtil,
                               bsLoadingOverlayService,
                               toastr) {

            var vm = this;

            $scope.username = $cookies.get('username');
            $scope.userDID = $cookies.get('userDID');
            $scope.roleType = $cookies.get('roletype');

            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;

            var specificMonth = thisMonth;

            // // 所有人，對照資料
            User.getAllUsers()
                .success(function (allUsers) {
                    vm.executiveUsers = allUsers;
                });

            $scope.showWorkHourAdd = function(item) {
                return DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment(item.create_formDate), item.day - 1));
            }

            $scope.changeWorkOffHistoryMonth = function(changeCount, dom) {

                $scope.monthPicker = dom;

                // document.getElementById('includeHead').innerHTML = "";

                dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
                dom.myDT = moment(dom.myDT).add(changeCount, 'M');
                console.log("dom.myMonth= " + dom.myMonth);

                var year = parseInt(dom.myDT.year()) - 1911;
                var month = parseInt(dom.myDT.month()) + 1;

                // console.log(vm);

                specificMonth = month;

                $scope.fetchWorkHourAdd_confirmed($scope.userDID, month);

            }

            $scope.listenMonth = function(dom){
                // console.log($scope);
                // console.log(dom);
                dom.$watch('myMonth',function(newValue, oldValue) {
                    console.log(oldValue);
                    console.log(newValue);
                    if (dom.isShiftMonthSelect) {
                        dom.isShiftMonthSelect = false;
                        $scope.changeWorkOffHistoryMonth(0, dom.monthPickerDom);
                    }
                });
            }

            $scope.specificUserMonthSalary;

            $scope.fetchWorkHourAdd_confirmed = function (userID, month) {
                // console.log($scope);
                bsLoadingOverlayService.start({
                    referenceId: 'addConfirm_workHour'
                });

                var formData = {
                    userDID: userID,
                }

                User.findUserByUserDID(formData)
                    .success(function (user) {
                        $scope.specificUserMonthSalary = user.userMonthSalary;
                    })

                var formData = {
                    creatorDID: userID,
                    month: month == undefined ? specificMonth : month,
                    isExecutiveConfirm: true,
                }

                // console.log(formData);
                WorkHourAddItemUtil.getWorkHourAddItems(formData)
                    .success(function (res) {
                        // console.log(res);
                        // $$$$$ 主要顯示 $$$$$
                        $scope.workAddConfirmTablesItems = $scope.filterData(res.payload);

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'addConfirm_workHour'
                            });
                        }, 500);
                    })
                    .error(function () {
                        console.log('ERROR  WorkHourAddItemUtil.getWorkHourAddItems');

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'addConfirm_workHour'
                            });
                        }, 500);
                    })

                $('.workOffFormNumberInput').mask('A.Z', {
                    translation: {
                        'A': {
                            pattern: /[012345678]/,
                        },
                        'Z': {
                            pattern: /[05]/,
                        }
                    }
                });

            }

            // 整理數據
            $scope.filterData = function(rawData) {
                console.log(rawData);

                var itemList = [];

                var workOT_date = [];

                for (var index = 0; index < rawData.length; index ++) {
                    var item = "_" + DateUtil.getShiftDatefromFirstDate_typeB(moment(rawData[index].create_formDate)
                        , 0) + "_" +
                        rawData[index].day + "_" +
                        rawData[index].prjDID;

                    // console.log(item);

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

                // console.log(workOT_date);

                var result = [];

                for (var index = 0; index < itemList.length; index ++) {
                    result.push(workOT_date[itemList[index]]);
                }

                return result;
            }

            // 顯示單一時數
            $scope.showAddHour = function (table_adds, type) {
                // console.log(table_adds);
                var result = 0;

                for (var index = 0; index < table_adds.items.length; index ++) {
                    if (type == table_adds.items[index].item_workAddType) {
                        result += parseInt(TimeUtil.getCalculateHourDiffByTime(table_adds.items[index].item_start_time, table_adds.items[index].item_end_time));
                    }
                }

                result = result % 60 < 30 ? Math.round(result / 60) : Math.round(result / 60) - 0.5;
                if (result < 1) {
                    // $scope.table.totalHourTemp = 0;
                    return 0;
                }
                // $scope.table.totalHourTemp = result;
                return result;
            }

            // 顯示合計時數
            $scope.showTotalAddHour = function (tables, type) {
                if (tables == undefined) return;

                var final_result = 0.0;

                for (var index = 0; index < tables.length; index++) {
                    var result = 0.0;
                    for (var index_item = 0; index_item < tables[index].items.length; index_item++) {
                        if (type == tables[index].items[index_item].item_workAddType) {
                            result += parseInt(TimeUtil.getCalculateHourDiffByTime(tables[index].items[index_item].item_start_time, tables[index].items[index_item].item_end_time));
                        }
                    }
                    result = result % 60 < 30 ? Math.round(result / 60) : Math.round(result / 60) - 0.5;
                    if (result < 1) {
                        // $scope.table.totalHourTemp = 0;
                        result = 0;
                    }
                    final_result += result;
                }
                // $scope.table.totalHourTemp = result;
                return final_result;
            }

            // 顯示合計加班費
            $scope.showTotalOTMoney = function () {
                if ($scope.workAddConfirmTablesItems == undefined || $scope.workAddConfirmTablesItems.length === 0) {
                    return;
                }

                var result = 0.0;

                var result_1_0 = 0.0;
                var result_1_13 = 0.0;
                var result_1_23 = 0.0;
                var result_1_1 = 0.0;

                for (var index = 0; index < $scope.workAddConfirmTablesItems.length; index ++) {
                    var salaryBase =  Math.round($scope.workAddConfirmTablesItems[index].userMonthSalary / 30 / 8);
                    // console.log(salaryBase);
                    result_1_0 += $scope.workAddConfirmTablesItems[index].dis_1_0 * salaryBase * 1;
                    result_1_13 += $scope.workAddConfirmTablesItems[index].dis_1_13 * salaryBase * (4/3);
                    result_1_23 += $scope.workAddConfirmTablesItems[index].dis_1_23 * salaryBase * (5/3);
                    result_1_1 += $scope.workAddConfirmTablesItems[index].dis_1_1 * salaryBase * (2);
                }

                result = Math.ceil(result_1_0) + Math.ceil(result_1_13) + Math.ceil(result_1_23) + Math.ceil(result_1_1);


                return $scope.formatFloat(result, 0);
            }

            // 顯示分配
            $scope.showTotalDisHour = function (tables, type) {

                if (tables == undefined) return;
                var result = 0.0;
                var temp;
                for (var index = 0; index < tables.length; index++) {
                    switch (type) {
                        case 1:
                            temp = tables[index].dis_1_0 == (undefined || "" )? parseFloat(0) : parseFloat(tables[index].dis_1_0);
                            break;
                        case 2:
                            temp = tables[index].dis_1_13 == (undefined || "" ) ? parseFloat(0) : parseFloat(tables[index].dis_1_13);
                            break;
                        case 3:
                            temp = tables[index].dis_1_23 == (undefined || "" ) ? parseFloat(0) : parseFloat(tables[index].dis_1_23);
                            break;
                        case 4:
                            temp = tables[index].dis_1_1 == (undefined || "" ) ? parseFloat(0) : parseFloat(tables[index].dis_1_1);
                            break;
                    }
                    result += temp;
                }
                return result;
            }


            // 加班單核薪 分配點數
            $scope.saveAddWorkDisFormToServer = function () {
                if ($scope.workAddConfirmTablesItems.length === 0) {
                    toastr.warning('沒有任何加班單', 'Warning');
                }

                // console.log($scope.workAddConfirmTablesItems);

                var formData = {
                    data: $scope.workAddConfirmTablesItems,
                }

                WorkHourAddItemUtil.distributeWorkAdd(formData)
                    .success(function (res) {
                        console.log(res);
                    })
            }

            $scope.changeSalary = function (tables) {
                console.log(tables);
                var formData = {
                    items: tables.items,
                    salary: $scope.specificUserMonthSalary,
                }
                WorkHourAddItemUtil.updateWorkAddItemsMonthSalary(formData)
                    .success(function (res) {

                        console.log(res);
                        $scope.fetchWorkHourAdd_confirmed($scope.userDID, specificMonth)
                    })
            }

            $scope.printPDF = function () {
                $("#form_main_pdf").print({
                    globalStyles: true,
                    mediaPrint: false,
                    stylesheet: null,
                    noPrintSelector: ".no-print",
                    iframe: true,
                    append: null,
                    prepend: null,
                    manuallyCopyFormValues: true,
                    deferred: $.Deferred(),
                    timeout: 750,
                    title: null,
                    doctype: '<!doctype html>'
                });
            }

        } // End of function
    }
)();
