/**
 * @author Ichen.chu
 * created on 02.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('paymentFormCtrl',
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
                'PaymentFormsUtil',
                'bsLoadingOverlayService',
                PaymentFormCtrl
            ])
        // .directive("removepayment", function () {
        //     return function (scope, element, attrs) {
        //         element.bind("click", function () {
        //             console.log(attrs);
        //             $(attrs.removepayment).remove();
        //         });
        //     };
        // });

    /** @ngInject */
    function PaymentFormCtrl($scope,
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
                             PaymentFormsUtil,
                             bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;

        var specificYear = thisYear;
        var specificMonth = thisMonth;

        // ***** 墊付款 main Tab 主要顯示 *****
        $scope.displayPaymentItems;
        $scope.displayPaymentItems_history;

        // ***** 墊付款 manager Tab 主要顯示 *****
        $scope.usersReviewForManagers;

        // ***** 墊付款 executive Tab 主要顯示 *****
        $scope.usersReviewForExecutive;

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {

                var relatedMembers = [];

                vm.users = allUsers;
                vm.historyUsers = allUsers;

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
                // console.log(allProjects);
                vm.projects = allProjects.slice();

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
                    };
                }
            });

        $scope.listenMonth = function(dom){
            dom.$watch('myMonth',function(newValue, oldValue) {
                if (dom.isShiftMonthSelect) {
                    dom.isShiftMonthSelect = false;
                    $scope.changePaymentMonth(0, dom.monthPickerDom);
                }
            });
        }

        $scope.listenMonth_manager = function(dom){
            dom.$watch('myMonth',function(newValue, oldValue) {
                if (dom.isShiftMonthSelect) {
                    dom.isShiftMonthSelect = false;
                    $scope.changePaymentMonth_manager(0, dom.monthPickerDom);
                }
            });
        }

        $scope.listenMonth_executive = function(dom){
            dom.$watch('myMonth',function(newValue, oldValue) {
                if (dom.isShiftMonthSelect) {
                    dom.isShiftMonthSelect = false;
                    $scope.changePaymentMonth_executive(0, dom.monthPickerDom);
                }
            });
        }

        $scope.listenMonth_history = function(dom){
            dom.$watch('myMonth',function(newValue, oldValue) {
                if (dom.isShiftMonthSelect) {
                    dom.isShiftMonthSelect = false;
                    $scope.changePaymentMonth_history(0, dom.monthPickerDom);
                }
            });
        }

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        $scope.changePaymentMonth = function(changeCount, dom) {

            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.fetchPaymentsData();
        }

        $scope.changePaymentMonth_manager = function(changeCount, dom) {

            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.getPaymentReviewData_manager();
        }

        $scope.changePaymentMonth_executive = function(changeCount, dom) {

            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.getPaymentReviewData_executive();
        }

        $scope.changePaymentMonth_history = function(changeCount, dom) {

            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.fetchPaymentsData(vm.historyUser.selected._id);
        }

        $scope.insertPaymentItem = function (prjDID) {
            var formData = {
                creatorDID: $scope.userDID,
                year: specificYear,
                month: specificMonth,
                prjDID: prjDID,
            }
            PaymentFormsUtil.insertPaymentItem(formData)
                .success(function (res) {
                    var formData = {
                        creatorDID: $scope.userDID,
                        year: specificYear,
                        month: specificMonth,
                    }
                    PaymentFormsUtil.fetchPaymentItems(formData)
                        .success(function (res) {

                            var formTables = [];

                            for (var index = 0; index < res.payload.length; index ++) {
                                var paymentItem = {
                                    tableID: res.payload[index]._id,
                                    prjDID: res.payload[index].prjDID,
                                }
                                formTables.push(paymentItem);
                            }

                            var formData = {
                                creatorDID: $scope.userDID,
                                year: specificYear,
                                month: specificMonth,
                                formTables: formTables,
                            }
                            PaymentFormsUtil.createPaymentForm(formData)
                                .success(function (res) {
                                    // console.log(res);
                                    $scope.fetchPaymentsData();
                                })
                        })
                })
        }

        $scope.removePaymentItem = function (item) {
            var formData = {
                _id: item._id,
            }
            PaymentFormsUtil.removePaymentItem(formData)
                .success(function (res) {
                    $scope.fetchPaymentsData();
                })
        }

        var isHistoryInitDate = false;

        $scope.initDate = function() {
            if (!isHistoryInitDate) {
                isHistoryInitDate = true;
                specificYear = new Date().getFullYear() - 1911;
                specificMonth = new Date().getMonth() + 1; //January is 0!
            }
        }

        // main, history
        $scope.fetchPaymentsData = function (specificUserDID) {

            bsLoadingOverlayService.start({
                referenceId: 'payment_main'
            });

            var formData = {
                creatorDID: (specificUserDID == null || specificUserDID == undefined) ? $scope.userDID : specificUserDID,
                year: specificYear,
                month: specificMonth,
            }
            // console.log(formData);

            PaymentFormsUtil.fetchPaymentItems(formData)
                .success(function (res) {
                    if (specificUserDID == null || specificUserDID == undefined) {
                        $scope.displayPaymentItems = res.payload;
                    } else {
                        $scope.displayPaymentItems_history = res.payload;
                    }

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'payment_main'
                        });
                    }, 500)
                })
                .error(function (res) {

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'payment_main'
                        });
                    }, 500)
                })
        }

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

        // main
        // 提交審查
        $scope.sendReview = function (dom) {

            $scope.saveItems();

            var unSendReviewCount = 0;

            for (var index = 0; index < $scope.displayPaymentItems.length; index ++) {
                if (!$scope.displayPaymentItems[index].isSendReview) {
                    unSendReviewCount++
                }
            }

            $scope.checkText = "確定 提交：" + unSendReviewCount + "筆 墊付款 ?";
            $scope.checkingUserDID = $scope.userDID;
            ngDialog.open({
                template: 'app/pages/myForms/paymentForm//dialog/paymentReviewSend_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });

            // $timeout(function () {
            //     var formData = {
            //         creatorDID: $scope.userDID,
            //         year: specificYear,
            //         month: specificMonth,
            //         isSendReview: true,
            //     }
            //     PaymentFormsUtil.updatePaymentItems(formData)
            //         .success(function (res) {
            //             $scope.fetchPaymentsData();
            //         })
            // }, 500)

        }

        $scope.checkToSendReview = function(userDID) {
            var formData = {
                creatorDID: userDID,
                year: specificYear,
                month: specificMonth,
                isSendReview: true,
            }
            PaymentFormsUtil.updatePaymentItems(formData)
                .success(function (res) {
                    $scope.fetchPaymentsData();
                })
        }

        $scope.saveItems = function () {
            var resultCount = 0;
            for (var index = 0; index < $scope.displayPaymentItems.length; index ++) {
                var item = $scope.displayPaymentItems[index];
                var formData = {
                    _id: item._id,
                    payDate: item.payDate,
                    receiptCode: item.receiptCode,
                    contents: item.contents,
                    amount: item.amount,
                }
                PaymentFormsUtil.updatePaymentItemByID(formData)
                    .success(function (res) {
                        resultCount ++
                        if (resultCount == $scope.displayPaymentItems.length) {
                            $scope.fetchPaymentsData();
                            toastr.success('表單儲存成功', 'Success');
                        }
                    })
            }
        }

        //顯示經理審查人員
        // Fetch Manager Related Members
        $scope.fetchRelatedMembers = function () {

            var formData = {
                relatedID: $cookies.get('userDID'),
            }

            Project.getProjectRelatedToManager(formData)
                .success(function (relatedProjects) {
                    // console.log(relatedProjects);
                    for(var index = 0; index < relatedProjects.length; index ++) {
                        // 相關專案
                        managersRelatedProjects.push(relatedProjects[index]._id);
                    }

                })
        }

        // loginUser's relatedMembers.
        $scope.mainRelatedMembers = null;

        var managersRelatedProjects = [];

        // ***** 經理審查 *****
        $scope.getPaymentReviewData_manager = function () {
            // console.log($scope);
            bsLoadingOverlayService.start({
                referenceId: 'payment_main'
            });

            $scope.userMap_review = [];

            $scope.tables_review = [];
            //紀錄 manager, executive review data.
            $scope.tables_review.tablesItems = [];

            var formData = {
                relatedMembers: $scope.mainRelatedMembers,
                year: specificYear,
                month: specificMonth,
                isFindSendReview: true,
                isFindManagerCheck: false,
                isFindExecutiveCheck: null,
            }

            PaymentFormsUtil.getPaymentsMultiple(formData)
                .success(function (res) {
                    // console.log(res);
                    var userResult = [];
                    var evalString;
                    if (res.payload.length > 0) {
                        for (var paymentsItemsIndex = 0; paymentsItemsIndex < res.payload.length; paymentsItemsIndex ++) {
                            var isProjectIncluded = false;
                            inter:
                            if (managersRelatedProjects.includes(res.payload[paymentsItemsIndex].prjDID)) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
                                isProjectIncluded = true;
                                break inter;
                            }
                            if (isProjectIncluded) {
                                // users
                                if (!userResult.includes(res.payload[paymentsItemsIndex].creatorDID)) {
                                    userResult.push(res.payload[paymentsItemsIndex].creatorDID);

                                    evalString = "$scope.tables_review['" + res.payload[paymentsItemsIndex].creatorDID + "'] = []";
                                    eval(evalString);

                                    var manipulateObject = undefined;
                                    evalString = "manipulateObject = $scope.tables_review['" + res.payload[paymentsItemsIndex].creatorDID + "']";
                                    eval(evalString);
                                    manipulateObject.push(res.payload[paymentsItemsIndex]);
                                } else {
                                    var manipulateObject = undefined;
                                    evalString = "manipulateObject = $scope.tables_review['" + res.payload[paymentsItemsIndex].creatorDID + "']";
                                    eval(evalString);
                                    manipulateObject.push(res.payload[paymentsItemsIndex]);
                                }
                            }
                        }
                        $scope.usersReviewForManagers = userResult;

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'payment_main'
                            });
                        }, 500)

                    } else {
                        $scope.usersReviewForManagers = [];

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'payment_main'
                            });
                        }, 500)
                    }
                })
        }

        $scope.fetchReviewItemsFromScope = function(user) {
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
            var managerDID = majorSelected[0].managerID;
            return managerDID === $cookies.get('userDID');
        }

        //專案經理一鍵確認 -1
        $scope.reviewPaymentManagerAll = function (userDID) {
            // console.log(userDID);
            $scope.checkText = "確定 同意：" + $scope.showUser(userDID) + " ?";
            $scope.checkingUserDID = userDID;
            ngDialog.open({
                template: 'app/pages/myForms/paymentForm//dialog/paymentReviewAgree_ManagerAllModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //專案經理一鍵確認 -2
        $scope.sendPaymentManagerAllAgree = function (userDID) {

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
                PaymentFormsUtil.updatePaymentItemByID(formData)
                    .success(function (res) {
                        resultCount ++
                        if (resultCount == updateTables.length) {
                            $scope.getPaymentReviewData_manager();

                        }
                    })
            }
        }

        // 經理退回 -1
        $scope.disagreePaymentItem_manager = function (userDID, item) {
            $scope.checkText = '確定 退回：' +
                $scope.showUser(userDID) + ", " +
                $scope.showPrjCode(item.prjDID) +
                " ？";
            $scope.checkingUserDID = userDID;
            $scope.checkingItem = item;
            ngDialog.open({
                template: 'app/pages/myForms/paymentForm/dialog/paymentReviewDisAgree_ManagerModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 專案經理退回 -2
        $scope.sendPaymentDisagree_manager = function (userDID, item, rejectMsg) {
            var formData = {
                _id: item._id,
                isSendReview: false,
                isManagerCheck: false,
                isManagerReject: true,
                managerReject_memo: rejectMsg
            }
            PaymentFormsUtil.updatePaymentItemByID(formData)
                .success(function (res) {
                    $scope.getPaymentReviewData_manager();
                })
        }


        // ***** 行政核定 *****
        $scope.getPaymentReviewData_executive = function () {

            bsLoadingOverlayService.start({
                referenceId: 'payment_main'
            });

            $scope.userMap_review = [];

            $scope.tables_review = [];
            //紀錄 manager, executive review data.
            $scope.tables_review.tablesItems = [];

            var formData = {
                relatedMembers: $scope.mainRelatedMembers,
                year: specificYear,
                month: specificMonth,
                isFindSendReview: true,
                isFindManagerCheck: true,
                isFindExecutiveCheck: false,
            }

            PaymentFormsUtil.getPaymentsMultiple(formData)
                .success(function (res) {
                    // console.log(res);
                    var userResult = [];
                    var evalString;
                    if (res.payload.length > 0) {
                        for (var paymentsItemsIndex = 0; paymentsItemsIndex < res.payload.length; paymentsItemsIndex ++) {
                            // var isProjectIncluded = false;
                            // inter:
                            //     if (managersRelatedProjects.includes(res.payload[paymentsItemsIndex].prjDID)) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
                            //         isProjectIncluded = true;
                            //         break inter;
                            //     }
                            // if (isProjectIncluded) {
                                // users
                                if (!userResult.includes(res.payload[paymentsItemsIndex].creatorDID)) {
                                    userResult.push(res.payload[paymentsItemsIndex].creatorDID);

                                    evalString = "$scope.tables_review['" + res.payload[paymentsItemsIndex].creatorDID + "'] = []";
                                    eval(evalString);

                                    var manipulateObject = undefined;
                                    evalString = "manipulateObject = $scope.tables_review['" + res.payload[paymentsItemsIndex].creatorDID + "']";
                                    eval(evalString);
                                    manipulateObject.push(res.payload[paymentsItemsIndex]);
                                } else {
                                    var manipulateObject = undefined;
                                    evalString = "manipulateObject = $scope.tables_review['" + res.payload[paymentsItemsIndex].creatorDID + "']";
                                    eval(evalString);
                                    manipulateObject.push(res.payload[paymentsItemsIndex]);
                                }
                            // }
                        }
                        $scope.usersReviewForExecutive = userResult;

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'payment_main'
                            });
                        }, 500)

                    } else {
                        $scope.usersReviewForExecutive = [];

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'payment_main'
                            });
                        }, 500)
                    }
                })
        }

        //行政總管一鍵核定 -1
        $scope.reviewPaymentExecutiveAll = function (userDID) {
            $scope.checkText = "確定 核定：" + $scope.showUser(userDID) + " ?";
            $scope.checkingUserDID = userDID;
            ngDialog.open({
                template: 'app/pages/myForms/paymentForm//dialog/paymentReviewAgree_ExecutiveAllModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //行政總管一鍵確認 -2
        $scope.sendPaymentExecutiveAllAgree = function (userDID) {

            var updateTables = [];
            for (var index = 0; index < $scope.fetchReviewItemsFromScope(userDID).length; index ++) {
                if ($scope.fetchReviewItemsFromScope(userDID)[index].isSendReview &&
                    $scope.fetchReviewItemsFromScope(userDID)[index].isManagerCheck) { // 已經送審 且 經理簽章過 的才更新
                    updateTables.push($scope.fetchReviewItemsFromScope(userDID)[index]._id);
                }
            }

            var resultCount = 0;
            for (var index = 0; index < updateTables.length; index ++) {
                var itemDID = updateTables[index];
                var formData = {
                    _id: itemDID,
                    isExecutiveCheck: true,
                }
                PaymentFormsUtil.updatePaymentItemByID(formData)
                    .success(function (res) {
                        resultCount ++
                        if (resultCount == updateTables.length) {
                            $scope.getPaymentReviewData_executive();

                        }
                    })
            }
        }

        // 行政退回 -1
        $scope.disagreePaymentItem_executive = function (userDID, item) {
            $scope.checkText = '退回 給經理：' +
                $scope.showProjectManager(item.prjDID) + ", " +
                $scope.showPrjCode(item.prjDID) +
                " ？";
            $scope.checkingUserDID = userDID;
            $scope.checkingItem = item;
            ngDialog.open({
                template: 'app/pages/myForms/paymentForm/dialog/paymentReviewDisAgree_ExecutiveModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        // 行政退回 -2
        $scope.sendPaymentDisagree_executive = function (userDID, item, rejectMsg) {
            var formData = {
                _id: item._id,
                isSendReview: true,
                isManagerCheck: false,
                isManagerReject: false,
            }
            PaymentFormsUtil.updatePaymentItemByID(formData)
                .success(function (res) {
                    $scope.getPaymentReviewData_executive();
                })
        }

        // 核定後退回
        $scope.repentPayment_executive = function (userDID, item) {
            $scope.checkText = '回復成 [行政核定] 前狀態：' +
                $scope.showUser(userDID) + ", " +
                $scope.showPrjCode(item.prjDID) +
                " ？";
            $scope.checkingUserDID = userDID;
            $scope.checkingItem = item;
            ngDialog.open({
                template: 'app/pages/myForms/paymentForm/dialog/paymentRepent_ExecutiveModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendPaymentRepent_executive = function (userDID, item) {
            var formData = {
                _id: item._id,
                isSendReview: true,
                isManagerCheck: true,
                isExecutiveCheck: false,
            }
            PaymentFormsUtil.updatePaymentItemByID(formData)
                .success(function (res) {
                    $scope.fetchPaymentsData(vm.historyUser.selected._id);
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

        // Deprecated 2019/08/15
        // $scope.count = 0;
        // $scope.addPayment = function (prjName, prjType, prjCode, prjDID) {
        //     vm.prjItems.selected = "";
        //     $scope.count ++;
        //     angular.element(
        //         document.getElementById('colHead'))
        //         .append($compile(
        //             "<div " +
        //             "id=payment" + $scope.count + ">" +
        //             "<label >" +
        //             $scope.count + ". - " + prjName + " - " + prjType + " - " + prjCode +
        //             "<span style='display: none'>" +
        //             prjDID +
        //             "</span>" +
        //             "<button class='btn btn-default' " +
        //             "data-removepayment=#payment" + $scope.count + ">X" +
        //             "</button>" +
        //             "</label>" +
        //             "<div " +
        //             "ng-include=\"'app/pages/myForms/forms/items/paymentFormItem.html'\">" +
        //             "</div>" +
        //             "</div>"
        //         )($scope));
        // }

        // Deprecated 2019/08/15
        // $scope.checkPayment = function () {
        //
        //     $scope.warningText = '總共新增 ' + $('#rowHead').find("div[id^='payment']").length + " 筆 墊付款";
        //     ngDialog.open({
        //         template: 'app/pages/myModalTemplate/myPaymentFormWarningModal.html',
        //         className: 'ngdialog-theme-default',
        //         scope: $scope,
        //         showClose: false,
        //     });
        // }

        // Deprecated 2019/08/15
        // $scope.submitPayment = function () {
        //     var dataForm = [];
        //
        //     var paymentCount = $('#rowHead').find("div[id^='payment']").length
        //     for (var index = 0; index < paymentCount; index++) {
        //         var itemIndex = index + 1;
        //         var payDateIndex = 0;
        //         var receiptCodeIndex = 1;
        //         var paymentIndex = 2;
        //         var amountIndex = 3;
        //         var dataIteam = {
        //             creatorDID: $cookies.get('userDID'),
        //             prjDID: $("div[id^='payment']").find('span')[0].innerText,
        //             payDate: $($('.ng-scope .row')[itemIndex]).find('input')[payDateIndex].value,
        //             receiptCode: $($('.ng-scope .row')[itemIndex]).find('input')[receiptCodeIndex].value,
        //             payment: $($('.ng-scope .row')[itemIndex]).find('input')[paymentIndex].value,
        //             amount: $($('.ng-scope .row')[itemIndex]).find('input')[amountIndex].value,
        //         };
        //         dataForm.push(dataIteam);
        //     }
        //     PaymentForms.createForms(dataForm)
        //         .success(function (data) {
        //             window.location.reload();
        //         })
        // }

    }
})();


