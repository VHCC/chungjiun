/**
 * @author IChen.chu
 * created on 01.07.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('workHourOverTimeCtrl',
            [
                '$scope',
                'toastr',
                '$cookies',
                '$filter',
                '$compile',
                '$timeout',
                '$window',
                'ngDialog',
                'User',
                'Project',
                'ProjectUtil',
                'DateUtil',
                'WorkOverTimeUtil',
                'GlobalConfigUtil',
                'bsLoadingOverlayService',
                workHourOverTimeCtrl
            ])

    /** @ngInject */
    function workHourOverTimeCtrl($scope,
                             toastr,
                             $cookies,
                             $filter,
                             $compile,
                             $timeout,
                             window,
                             ngDialog,
                             User,
                             Project,
                             ProjectUtil,
                             DateUtil,
                             WorkOverTimeUtil,
                             GlobalConfigUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;
        var thisDay = new Date().getDay();

        var specificYear = thisYear;
        var specificMonth = thisMonth;

        $scope.initProject = function() {
            var formData = {
                relatedID: $cookies.get('userDID'),
            }
            Project.getProjectRelated(formData)
                .success(function (relatedProjects) {
                    vm.projects = relatedProjects;
                });
        }

        $scope.resetProjectData = function() {
            if (vm.prjItems) {
                vm.prjItems.selected = null;
            }
            vm.projects = $scope.allProject_raw.slice();
        }

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

        $scope.initProject();

        $scope.listenOTMonth = function(dom){
            dom.$watch('myMonth',function(newValue, oldValue) {
                if (dom.isShiftMonthSelect) {
                    dom.isShiftMonthSelect = false;
                    $scope.changeWorkOverTimeMonth(0, dom.monthPickerDom);
                }
            });
        }

        $scope.changeWorkOverTimeMonth = function(changeCount, dom) {
            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.fetchWorkOverTimeData();
        }


        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        $scope.workOverTimeTablesItems = [];

        $scope.fetchWorkOverTimeData = function () {

            bsLoadingOverlayService.start({
                referenceId: 'mainPage_workHour'
            });

            var formData = {
                creatorDID: $scope.userDID,
                year: specificYear,
                month: specificMonth,
            }

            WorkOverTimeUtil.fetchWOTItemFromDB(formData)
                .success(function (res) {
                    $scope.workOverTimeTablesItems = res.payload;

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_workHour'
                        });
                    }, 500)
                })
                .error(function (res) {

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'mainPage_workHour'
                        });
                    }, 500)
                })

        }

        $scope.insertWOTItemViaPrj = function (prjDID) {
            var formData = {
                prjDID: prjDID,
                creatorDID: $scope.userDID,
                create_formDate: DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0),
                year: specificYear,
                month: specificMonth,
                day: thisDay,
                timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
            }
            console.log(formData)
            WorkOverTimeUtil.insertWOTItemToDB(formData)
                .success(function (res) {
                    $scope.fetchWorkOverTimeData();
                    $scope.resetProjectData();
                })
        }

        $scope.insertWOTItem = function () {
            var formData = {
                creatorDID: $scope.userDID,
                create_formDate: DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0),
                year: specificYear,
                month: specificMonth,
                day: thisDay,
                timestamp: moment(new Date()).format("YYYYMMDD HHmmss"),
            }
            WorkOverTimeUtil.insertWOTItemToDB(formData)
                .success(function (res) {
                    $scope.fetchWorkOverTimeData();
                })
        }

        $scope.showWOTDay = function (day) {
            return DateUtil.getDay(day)
        }

        // 變更休假單日期
        $scope.changeWorkOverTimeItemDay = function (dom) {
            dom.table.create_formDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment(dom.myDT)), 0);
            dom.table.year = dom.myDT.getFullYear() - 1911;
            // dom.table.year = specificYear;
            dom.table.month = dom.myDT.getMonth() + 1;
            dom.table.day = dom.myDT.getDay();
        }

        $scope.removeWOTItem = function (index) {
            var formData = {
                tableID: $scope.workOverTimeTablesItems[index]._id
            }

            WorkOverTimeUtil.removeWOTItemFromDB(formData)
                .success(function (res) {
                    $scope.fetchWorkOverTimeData();
                })
                .error(function () {
                    console.log('ERROR WorkOffFormUtil.removeWorkOffTableItem');
                })
        };

        // Send WorkOffTable to Review
        $scope.applyWOTItem = function (table, button, index) {
            $timeout(function () {
                console.log(table)
                $scope.checkText = '確定申請 ' + '：' +
                    DateUtil.getShiftDatefromFirstDate(
                        DateUtil.getFirstDayofThisWeek(moment($scope.workOverTimeTablesItems[index].create_formDate)),
                        $scope.workOverTimeTablesItems[index].day === 0 ? 6 : $scope.workOverTimeTablesItems[index].day - 1) +
                    "  加班？";

                $scope.checkingTable = table;
                $scope.checkingButton = button;
                $scope.checkingIndex = index;
                ngDialog.open({
                    template: 'app/pages/myModalTemplate/workOverTimeApplyModal.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    showClose: false,
                });
            }, 150)
        }
        //跟後臺溝通
        $scope.sendWorkOverTimeApply = function (checkingTable, checkingButton, checkingIndex) {
            // checkingButton.rowform1.$waiting = true;
            var formData = {
                _id: checkingTable._id,
                create_formDate: checkingTable.create_formDate,
                // year: checkingTable.year,
                contents: checkingTable.contents,
                // month: checkingTable.month,
                day: checkingTable.day,
                isSendReview: true,
            }

            // var targetList = [$scope.bossID];
            // var msgTopicList = [2000];
            // var msgDetailList = [2001];
            // var memoList = [$scope.showDate(checkingTable)];

            // WorkOffFormUtil.updateWorkOffItem(formData)
            //     .success(function (res) {
            //         // $scope.specificUserTablesItems[checkingIndex].isSendReview = true;
            //         $scope.getWorkOffTable(null, thisYear);
            //     })

            WorkOverTimeUtil.updateWOTItemFromDB(formData)
                .success(function (res) {
                    $scope.fetchWorkOverTimeData();
                })
        }

        // -----------------------  Show methods --------------------------
        // Filter
        $scope.showPrjCodeWithCombine = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            // if (selected[0].combinedID != undefined) {
            //     return $scope.showPrjCodeWithCombine(selected[0].combinedID);
            // }
            return selected.length > 0 ? selected[0].prjCode : 'Not Set';
        };

    }
})();