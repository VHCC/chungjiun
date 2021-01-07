/**
 * @author IChen.chu
 * created on 06.07.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('workHourOverTimeReviewCtrl',
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
                'PaymentFormsUtil',
                'WorkOverTimeUtil',
                'GlobalConfigUtil',
                'bsLoadingOverlayService',
                workHourOverTimeReviewCtrl
            ])

    /** @ngInject */
    function workHourOverTimeReviewCtrl($scope,
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
                             PaymentFormsUtil,
                             WorkOverTimeUtil,
                             GlobalConfigUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;

        var specificYear = thisYear;
        var specificMonth = thisMonth;

        // ***** 墊付款 manager Tab 主要顯示 *****
        $scope.usersReviewForManagers;

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {

                var relatedMembers = [];

                vm.users = allUsers; // 新增表單
                vm.historyUsers = allUsers; // 歷史檢視

                $scope.projectManagers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allUsers[i]._id,
                        name: allUsers[i].name
                    };
                }

                for (var index = 0; index < allUsers.length; index ++) {
                    relatedMembers.push(allUsers[index]._id);
                }
                $scope.mainRelatedMembers = relatedMembers;

            });

        Project.findAll()
            .success(function (allProjects) {

                $scope.allProject_raw = allProjects;

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
            });

        $scope.listenMonth_manager = function(dom){
            dom.$watch('myMonth',function(newValue, oldValue) {
                if (dom.isShiftMonthSelect) {
                    dom.isShiftMonthSelect = false;
                    $scope.changePaymentMonth_manager(0, dom.monthPickerDom);
                }
            });
        }

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        $scope.changePaymentMonth_manager = function(changeCount, dom) {

            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.getWOTReviewData_manager();
        }

        // Filter
        $scope.showPrjCodeWithCombine = function (prjDID) {
            var selected = [];
            if (prjDID) {
                selected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID,
                });
            }
            if (!selected) return 'Not Set'
            if (selected[0].combinedID != undefined) {
                return $scope.showPrjCodeWithCombine(selected[0].combinedID);
            }
            return selected.length > 0 ? selected[0].prjCode : 'Not Set';
        };

        $scope.showProjectManager = function (prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID
                });
            }
            if (majorSelected == undefined) return 'Not Set'
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

        $scope.showDate = function (table) {
            return DateUtil.getShiftDatefromFirstDate(
                DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                table.day === 0 ? 6 : table.day - 1);
        }

        // loginUser's relatedMembers.
        $scope.mainRelatedMembers = null;

        var managersRelatedProjects = [];

        //顯示經理審查人員
        // Fetch Manager Related Members
        $scope.fetchRelatedProjects = function () {

            var formData = {
                relatedID: $cookies.get('userDID'),
            }

            Project.getProjectRelatedToManager(formData)
                .success(function (relatedProjects) {
                    console.log(relatedProjects);
                    for(var index = 0; index < relatedProjects.length; index ++) {
                        // 相關專案
                        managersRelatedProjects.push(relatedProjects[index]._id);
                    }
                })
        }

        // ***** 經理審查 *****
        $scope.getWOTReviewData_manager = function () {
            console.log("getWOTReviewData_manager")
            bsLoadingOverlayService.start({
                referenceId: 'mainPage_workHour'
            });

            $scope.userMap_review = [];

            $scope.tables_review = [];
            //紀錄 manager, executive review data.
            $scope.tables_review.tablesItems = [];

            var formData = {
                // relatedMembers: $scope.mainRelatedMembers,
                relatedProjects: managersRelatedProjects,
                year: specificYear,
                month: specificMonth,
                isFindSendReview: true,
                isFindManagerCheck: false,
                isFindExecutiveSet: false,
            }


            WorkOverTimeUtil.getWOTMultiple(formData)
                .success(function (res) {
                    var userResult = [];
                    var evalString;

                    if (res.payload.length > 0) {
                        for (var itemIndex = 0; itemIndex < res.payload.length; itemIndex ++) {
                            var isProjectIncluded = false;
                            inter:
                                if (managersRelatedProjects.includes(res.payload[itemIndex].prjDID)) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
                                    isProjectIncluded = true;
                                    break inter;
                                }
                            if (isProjectIncluded) {
                                // users
                                if (!userResult.includes(res.payload[itemIndex].creatorDID)) {
                                    userResult.push(res.payload[itemIndex].creatorDID);

                                    evalString = "$scope.tables_review['" + res.payload[itemIndex].creatorDID + "'] = []";
                                    eval(evalString);

                                    var manipulateObject = undefined;
                                    evalString = "manipulateObject = $scope.tables_review['" + res.payload[itemIndex].creatorDID + "']";
                                    eval(evalString);
                                    manipulateObject.push(res.payload[itemIndex]);
                                } else {
                                    var manipulateObject = undefined;
                                    evalString = "manipulateObject = $scope.tables_review['" + res.payload[itemIndex].creatorDID + "']";
                                    eval(evalString);
                                    manipulateObject.push(res.payload[itemIndex]);
                                }
                            }
                        }
                        $scope.usersReviewForManagers = userResult;

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_workHour'
                            });
                        }, 500)

                    } else {
                        $scope.usersReviewForManagers = [];

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'mainPage_workHour'
                            });
                        }, 500)
                    }
                })

            // PaymentFormsUtil.getPaymentsMultiple(formData)
            //     .success(function (res) {
            //         // console.log(res);
            //         var userResult = [];
            //         var evalString;
            //
            //         if (res.payload.length > 0) {
            //             for (var paymentsItemsIndex = 0; paymentsItemsIndex < res.payload.length; paymentsItemsIndex ++) {
            //                 var isProjectIncluded = false;
            //                 inter:
            //                 if (managersRelatedProjects.includes(res.payload[paymentsItemsIndex].prjDID)) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
            //                     // console.log(paymentsItemsIndex);
            //                     // console.log(res.payload[paymentsItemsIndex].prjDID);
            //                     isProjectIncluded = true;
            //                     break inter;
            //                 }
            //                 if (isProjectIncluded) {
            //                     // users
            //                     if (!userResult.includes(res.payload[paymentsItemsIndex].creatorDID)) {
            //                         userResult.push(res.payload[paymentsItemsIndex].creatorDID);
            //
            //                         evalString = "$scope.tables_review['" + res.payload[paymentsItemsIndex].creatorDID + "'] = []";
            //                         eval(evalString);
            //
            //                         var manipulateObject = undefined;
            //                         evalString = "manipulateObject = $scope.tables_review['" + res.payload[paymentsItemsIndex].creatorDID + "']";
            //                         eval(evalString);
            //                         manipulateObject.push(res.payload[paymentsItemsIndex]);
            //                     } else {
            //                         var manipulateObject = undefined;
            //                         evalString = "manipulateObject = $scope.tables_review['" + res.payload[paymentsItemsIndex].creatorDID + "']";
            //                         eval(evalString);
            //                         manipulateObject.push(res.payload[paymentsItemsIndex]);
            //                     }
            //                 }
            //             }
            //             $scope.usersReviewForManagers = userResult;
            //
            //             $timeout(function () {
            //                 bsLoadingOverlayService.stop({
            //                     referenceId: 'mainPage_workHour'
            //                 });
            //             }, 500)
            //
            //         } else {
            //             $scope.usersReviewForManagers = [];
            //
            //             $timeout(function () {
            //                 bsLoadingOverlayService.stop({
            //                     referenceId: 'mainPage_workHour'
            //                 });
            //             }, 500)
            //         }
            //     })
        }

        $scope.fetchReviewItemsFromScope = function(user) {

            $('#paymentItemIndexInput').mask('DD', {
                translation: {
                    'D': {
                        pattern: /[0123456789]/,
                    }
                }
            });

            return $scope.tables_review[user] === undefined ?
                [] : $scope.tables_review[user];
        }

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

        //專案經理一鍵確認 -1
        $scope.reviewWOTManagerAll = function (userDID) {
            $scope.checkText = "確定 同意：" + $scope.showUser(userDID) + " ?";
            $scope.checkingUserDID = userDID;
            ngDialog.open({
                template: 'app/pages/myForms/workHourTableForm/workOverReview/dialog/workOverTimeReviewAgree_ManagerAllModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //專案經理一鍵確認 -2
        $scope.sendWOTManagerAllAgree = function (userDID) {

            var updateTables = [];
            for (var index = 0; index < $scope.fetchReviewItemsFromScope(userDID).length; index ++) {
                if (managersRelatedProjects.includes($scope.fetchReviewItemsFromScope(userDID)[index].prjDID)) { // 只跟自己有關的專案
                    if ($scope.fetchReviewItemsFromScope(userDID)[index].isSendReview) { // 已經送審的才更新
                        updateTables.push($scope.fetchReviewItemsFromScope(userDID)[index]._id);
                    }
                }
            }
            var resultCount = 0;
            for (var index = 0; index < updateTables.length; index ++) {
                var itemDID = updateTables[index];
                var formData = {
                    _id: itemDID,
                    isManagerCheck: true,
                }
                WorkOverTimeUtil.updateWOTItemFromDB(formData)
                    .success(function (res) {
                        resultCount ++;
                        if (resultCount == updateTables.length) {
                            $scope.getWOTReviewData_manager();
                        }
                    })
            }
        }

        // 經理退回 -1
        $scope.disagreeWOTItem_manager = function (userDID, item) {
            $scope.checkText = '確定 退回：' +
                $scope.showUser(userDID) + ", " +
                $scope.showPrjCodeWithCombine(item.prjDID) +
                " ？";
            $scope.checkingUserDID = userDID;
            $scope.checkingItem = item;
            ngDialog.open({
                template: 'app/pages/myForms/workHourTableForm/workOverReview/dialog/workOverTimeReviewDisAgree_ManagerModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 專案經理退回 -2
        $scope.sendWOTDisagree_manager = function (userDID, item, rejectMsg) {
            var formData = {
                _id: item._id,
                isSendReview: false,
                isManagerCheck: false,
                isManagerReject: true,
                managerReject_memo: rejectMsg
            }
            WorkOverTimeUtil.updateWOTItemFromDB(formData)
                .success(function (res) {
                    console.log(res);
                    $scope.getWOTReviewData_manager();
                })
        }


    }
})();


