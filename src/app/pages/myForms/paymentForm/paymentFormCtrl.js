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
                '$rootScope',
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
                'GlobalConfigUtil',
                'UpdateActionUtil',
                'DateUtil',
                'bsLoadingOverlayService',
                PaymentFormCtrl
            ])

    /** @ngInject */
    function PaymentFormCtrl($scope,
                             $rootScope,
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
                             GlobalConfigUtil,
                             UpdateActionUtil,
                             DateUtil,
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

        // ***** 墊付款 history Tab 主要顯示 *****
        $scope.displayPaymentItems_history;

        // ***** 墊付款 person Tab 主要顯示 *****
        $scope.displayPaymentItems_person;

        // ***** 墊付款 executive Tab 主要顯示 *****
        $scope.displayPaymentItems_executiveAdd;

        // ***** 墊付款 manager Tab 主要顯示 *****
        $scope.usersReviewForManagers;

        // ***** 墊付款 executive Tab 主要顯示 *****
        $scope.usersReviewForExecutive;

        $scope.initWatchRelatedTask = function() {

            $scope.$watch(function() {
                return $rootScope.payment_Manager_Tasks;
            }, function() {
                $scope.payment_Manager_Tasks = $rootScope.payment_Manager_Tasks;
            }, true);

            $scope.$watch(function() {
                return $rootScope.payment_Executive_Tasks;
            }, function() {
                $scope.payment_Executive_Tasks = $rootScope.payment_Executive_Tasks;
            }, true);

            $scope.$watch(function() {
                return $rootScope.payment_Rejected;
            }, function() {
                $scope.payment_Rejected = $rootScope.payment_Rejected;
            }, true);

        }

        $scope.initWatchRelatedTask();


        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers; // 新增表單
                // vm.historyUsers = allUsers; // 歷史檢視
                // vm.executiveAddUsers = allUsers; // 行政修訂

                $scope.projectManagers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allUsers[i]._id,
                        name: allUsers[i].name
                    };
                }
            });

        User.getAllUsersWithSignOut()
            .success(function (allUsers) {

                var relatedMembers = [];

                vm.historyUsers = allUsers; // 歷史檢視
                vm.executiveAddUsers = allUsers; // 行政修訂

                for (var index = 0; index < allUsers.length; index ++) {
                    relatedMembers.push(allUsers[index]._id);
                }
                $scope.mainRelatedMembers = relatedMembers;
            });

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
            });

        $scope.getGlobalConfig = function() {

            var formData = {
                year: specificYear,
                month: specificMonth,
            }

            GlobalConfigUtil.getConfig(formData)
                .success(function (resp) {
                    if (resp.payload.length > 0 ) {
                        vm.paymentsflag = resp.payload[0].paymentsSwitch;
                    } else {
                        GlobalConfigUtil.insertConfig(formData)
                            .success(function (resp) {
                                $scope.getGlobalConfig();
                            })
                    }
                })

        }


        $scope.updatePaymentsGlobalConfig = function() {

            var formData = {
                year: specificYear,
                month: specificMonth,
                paymentsSwitch: vm.paymentsflag,
            }

            GlobalConfigUtil.updateConfig(formData)
                .success(function (resp) {
                })
        }

        $scope.initProject = function() {
            Project.findAllEnable()
                .success(function (allProjects) {
                    $scope.allProject_raw = allProjects;
                    vm.projects = allProjects.slice();
                    vm.projects_executiveAdd = allProjects.slice();
                });
        }

        $scope.resetProjectData = function() {
            if (vm.prjItems) {
                vm.prjItems.selected = null;
            }
            vm.projects = $scope.allProject_raw.slice();
            if (vm.prjItems_executiveAdd) {
                vm.prjItems_executiveAdd.selected = null;
            }
            vm.projects_executiveAdd = $scope.allProject_raw.slice();
        }

        $scope.initProject();


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

        $scope.listenMonth_person = function(dom){
            dom.$watch('myMonth',function(newValue, oldValue) {
                if (dom.isShiftMonthSelect) {
                    dom.isShiftMonthSelect = false;
                    $scope.changePaymentMonth_person(0, dom.monthPickerDom);
                }
            });
        }

        $scope.listenMonth_executiveAdd = function(dom){
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

            $scope.fetchPaymentsData(null, 0);
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

            $scope.fetchPaymentsData(vm.historyUser.selected._id, 1);
        }

        // 個人檢視
        $scope.changePaymentMonth_person = function(changeCount, dom) {
            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.fetchPaymentsData(null, 3);
        }

        // 行政修訂
        $scope.changePaymentMonth_executiveAdd = function(changeCount, dom) {

            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.fetchPaymentsData(vm.executiveAddUser.selected._id, 2);
        }

        // main tab, type = 0
        // executive_Add, type = 2
        $scope.removePaymentItem = function (item, type) {
            var formData = {
                _id: item._id,
            }
            PaymentFormsUtil.removePaymentItem(formData)
                .success(function (res) {
                    // $scope.fetchPaymentsData(null, 0);
                    $scope.fetchPaymentsData(type == 0 ? $scope.userDID : vm.executiveAddUser.selected._id, type);
                })
        }

        // main tab, type = 0
        // executive_Add, type = 2
        $scope.insertPaymentItemF = function (prjDID, type) {

            bsLoadingOverlayService.start({
                referenceId: 'payment_main'
            });

            var formData = {
                creatorDID: type == 0 ? $scope.userDID : vm.executiveAddUser.selected._id,
                year: specificYear,
                month: specificMonth,
                prjDID: prjDID,
                payDate: moment(((specificYear+1911) + "/" + specificMonth)).format('YYYY/MM'),
            }
            PaymentFormsUtil.insertPaymentItem(formData)
                .success(function (res) {
                    $scope.fetchPaymentsData(type == 0 ? $scope.userDID : vm.executiveAddUser.selected._id, type);
                    $scope.resetProjectData();
                })
        }

        var isHistoryInitDate = false;

        $scope.initDate_history = function() {
            $scope.fetchPaymentsData($scope.userDID, 1);
            if (!isHistoryInitDate) {
                isHistoryInitDate = true;
                specificYear = new Date().getFullYear() - 1911;
                specificMonth = new Date().getMonth() + 1; //January is 0!
            }
        }

        var isPersonInitDate = false;

        $scope.initDate_person = function() {

            $scope.fetchPaymentsData($scope.userDID, 3);
            if (!isPersonInitDate) {
                isPersonInitDate = true;
                specificYear = new Date().getFullYear() - 1911;
                specificMonth = new Date().getMonth() + 1; //January is 0!
            }
        }

        var isExecutiveAddInitDate = false;

        $scope.initDate_executiveAdd = function() {
            if (!isExecutiveAddInitDate) {
                isExecutiveAddInitDate = true;
                specificYear = new Date().getFullYear() - 1911;
                specificMonth = new Date().getMonth() + 1; //January is 0!
            }
        }

        // main, type = 0
        // history, type = 1
        // executiveAdd, type = 2
        // person, type = 3
        $scope.fetchPaymentsData = function (specificUserDID, type) {

            bsLoadingOverlayService.start({
                referenceId: 'payment_main'
            });

            var formData = {
                creatorDID: (specificUserDID == null || specificUserDID == undefined) ? $scope.userDID : specificUserDID,
                year: specificYear,
                month: specificMonth,
            }

            PaymentFormsUtil.fetchPaymentItems(formData)
                .success(function (res) {

                    switch (type) {
                        case 0:
                            $scope.displayPaymentItems = res.payload;
                            break;
                        case 1:
                            res.payload = res.payload.sort(function (a, b) {
                                return a.itemIndex > b.itemIndex ? 1 : -1;
                            });
                            $scope.displayPaymentItems_history = res.payload;
                            break;
                        case 2:
                            $scope.displayPaymentItems_executiveAdd = res.payload;
                            break;
                        case 3:
                            res.payload = res.payload.sort(function (a, b) {
                                return a.itemIndex > b.itemIndex ? 1 : -1;
                            });
                            $scope.displayPaymentItems_person = res.payload;
                            break;
                    }

                    $scope.getGlobalConfig();

                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'payment_main'
                        });
                    }, 500)
                    $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                })
                .error(function (res) {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'payment_main'
                        });
                    }, 500)
                })

            $('#paymentItemIndexInput').mask('DD', {
                translation: {
                    'D': {
                        pattern: /[0123456789]/,
                    }
                }
            });
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
            // if (selected[0].combinedID != undefined) {
            //     return $scope.showPrjCodeWithCombine(selected[0].combinedID);
            // }
            return selected.length > 0 ? selected[0].prjCode : 'Not Set';
        };

        $scope.showProjectManager = function (prjDID) {
            var majorSelected = [];
            if (prjDID) {
                majorSelected = $filter('filter')($scope.allProjectCache, {
                    prjDID: prjDID
                });
            }
            if (majorSelected == undefined || majorSelected.length == 0) return 'Not Set';
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

        // 行政增修
        $scope.executiveModifiedPaymentItem = function(item) {
            // $scope.saveItems(2);
            var formData = {
                _id: item._id,
            }

            var formData = {
                _id: item._id,
                isSendReview: true,
                isManagerCheck: true,
                payDate: item.payDate,
                receiptCode: item.receiptCode,
                contents: item.contents,
                amount: item.amount,
                isExecutiveAdd : true,
                isExecutiveCheck: true,
                itemIndex: item.itemIndex,
                isFrontHalfMonth: item.isFrontHalfMonth,

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "executiveEdit"
            }
            PaymentFormsUtil.updatePaymentItemByID(formData)
                .success(function (res) {
                    $scope.fetchPaymentsData(vm.executiveAddUser.selected._id, 2);
                    toastr.success('行政增修與核定完成', 'Success');
                })

        }

        // main
        // 提交審查
        $scope.sendReview = function (dom) {

            var unSendReviewCount = 0;
            var unSendReviewIds = [];

            for (var index = 0; index < $scope.displayPaymentItems.length; index ++) {
                if (!$scope.displayPaymentItems[index].isSendReview) {
                    unSendReviewCount++;
                    unSendReviewIds.push($scope.displayPaymentItems[index]._id);
                }
            }

            $scope.saveItems(0);

            $scope.checkText = "確定 提交：" + unSendReviewCount + "筆 墊付款 ?";
            $scope.unSendReviewIds = unSendReviewIds;
            ngDialog.open({
                template: 'app/pages/myForms/paymentForm//dialog/paymentReviewSend_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.checkIsNumber = function(input) {
            var re = /^[0-9] .?[0-9]*/;//判斷字串是否為數字//判斷正整數/[1−9] [0−9]∗]∗/
            if (!re.test(input)) {
                return false
            }
            return true
        }

        $scope.checkToSendReview = function(unSendReviewIds) {
            // var formData = {
            //     creatorDID: userDID,
            //     year: specificYear,
            //     month: specificMonth,
            //     isSendReview: true,
            //
            //     updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
            //     updateAction: "sendReview"
            // }
            // PaymentFormsUtil.updatePaymentItems(formData)
            //     .success(function (res) {
            //         $scope.fetchPaymentsData(null, 0);
            //     })

            var resultCount = 0;
            for (var index = 0; index < unSendReviewIds.length; index ++) {
                var formData = {
                    _id: unSendReviewIds[index],
                    isSendReview: true,

                    updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                    updateAction: "sendReview"
                }
                PaymentFormsUtil.updatePaymentItemByID(formData)
                    .success(function (res) {
                        resultCount ++
                        if (resultCount == unSendReviewIds.length) {
                            $scope.fetchPaymentsData(null, 0);
                        }
                    })
            }
        }

        // main tab, type = 0
        // executive_Add, type = 2
        $scope.saveItems = function (type) {

            var target;
            switch (type) {
                case 0:
                    target = $scope.displayPaymentItems;
                    break;
                case 2:
                    target = $scope.displayPaymentItems_executiveAdd;
                    break;
            }

            var resultCount = 0;
            for (var index = 0; index < target.length; index ++) {
                var item = target[index];
                var formData = {
                    _id: item._id,
                    payDate: item.payDate,
                    receiptCode: item.receiptCode,
                    contents: item.contents,
                    amount: item.amount,
                    itemIndex: item.itemIndex
                }
                PaymentFormsUtil.updatePaymentItemByID(formData)
                    .success(function (res) {
                        resultCount ++
                        if (resultCount == target.length) {
                            $scope.fetchPaymentsData(null, 0);
                            toastr.success('表單儲存成功', 'Success');
                        }
                    })
            }
        }

        //顯示經理審查人員
        // Fetch Manager Related Members
        $scope.fetchRelatedMembers = function () {
            var managersRelatedProjects = [];
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

        // loginUser's relatedMembers.
        $scope.mainRelatedMembers = null;

        var managersRelatedProjects = [];

        // ***** 經理審查 *****
        $scope.getPaymentReviewData_manager = function () {
            bsLoadingOverlayService.start({
                referenceId: 'payment_main'
            });

            $scope.userMap_review = [];

            $scope.tables_review = [];
            //紀錄 manager, executive review data.
            $scope.tables_review.tablesItems = [];

            managersRelatedProjects = $rootScope.managersRelatedProjects;

            var formData = {
                // relatedMembers: $scope.mainRelatedMembers,
                managersRelatedProjects: managersRelatedProjects,
                // year: specificYear,
                // month: specificMonth,
                isFindSendReview: true,
                isFindManagerCheck: false,
                isFindExecutiveCheck: null,
            }

            PaymentFormsUtil.getPaymentsMultiple(formData)
                .success(function (res) {
                    console.log(res);
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
                        }, 100)

                    } else {
                        $scope.usersReviewForManagers = [];

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'payment_main'
                            });
                        }, 100)
                    }
                    $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                })
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
        $scope.reviewPaymentManagerAll = function (userDID) {
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

                    updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                    updateAction: "managerAgree"
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
                $scope.showPrjCodeWithCombine(item.prjDID) +
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
                managerReject_memo: rejectMsg,

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "managerReject"
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
                    console.log(res);
                    var userResult = [];
                    var evalString;
                    if (res.payload.length > 0) {
                        for (var paymentsItemsIndex = 0; paymentsItemsIndex < res.payload.length; paymentsItemsIndex ++) {
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

                        // 檢查全部都核定過的物件

                        var userTemp = userResult.slice();
                        for (var index = 0; index < userTemp.length; index ++) {
                            evalString = "manipulateObject = $scope.tables_review['" + userTemp[index] + "']";
                            eval(evalString);
                            var isNeedShow = false
                            for (var itemIndex = 0; itemIndex < manipulateObject.length; itemIndex++) {
                                if (!manipulateObject[itemIndex].isExecutiveCheck) {
                                    isNeedShow = true;
                                }
                            }

                            if (!isNeedShow) {
                                var location = userResult.indexOf(userTemp[index]);
                                userResult.splice(location, 1);
                            }
                        }

                        $scope.usersReviewForExecutive = userResult;

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'payment_main'
                            });
                        }, 100)
                    } else {
                        $scope.usersReviewForExecutive = [];

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'payment_main'
                            });
                        }, 100)
                    }
                    $rootScope.$emit("ProxyFetchUserRelatedTasks", {});
                })
        }

        //行政總管單筆核定 -1
        $scope.reviewPaymentExecutiveItem = function (userDID, item) {
            $scope.checkText = '確定 核定：' +
                $scope.showUser(userDID) + ", " +
                (item.isFrontHalfMonth ? "上半月" : "下半月") + ", " +
                $scope.showPrjCodeWithCombine(item.prjDID) + ", 金額：" +
                item.amount + ", 核定編號：" +
                item.itemIndex +
                " ？";
            $scope.checkingUserDID = userDID;
            $scope.checkingItem = item;
            ngDialog.open({
                template: 'app/pages/myForms/paymentForm//dialog/paymentReviewAgree_ExecutiveItemModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        //行政總管單筆核定 -2
        $scope.sendPaymentAgree_executive = function (userDID, item) {
            var formData = {
                _id: item._id,
                isExecutiveCheck: true,
                itemIndex: item.itemIndex,

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "executiveAgree"
            }
            PaymentFormsUtil.updatePaymentItemByID(formData)
                .success(function (res) {
                    $scope.getPaymentReviewData_executive();
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

                    updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                    updateAction: "executiveAgree"
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
            $scope.checkText = '退回 給：' +
                // $scope.showProjectManager(item.prjDID) + ", " +
                $scope.showUser(userDID) + ", " +
                $scope.showPrjCodeWithCombine(item.prjDID) +
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
                isSendReview: false,

                isManagerCheck: false,
                isManagerReject: false,

                isExecutiveCheck: false,
                isExecutiveReject: true,

                executiveReject_memo: rejectMsg,

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "executiveReject"
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
                $scope.showPrjCodeWithCombine(item.prjDID) +
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

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "executiveCancel"
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

        $scope.printPDF_person = function() {
            $("#form_person_pdf").print({
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

        $scope.printPDF_history = function () {

            $("#form_history_pdf").print({
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

        // main tab, type = 0
        // history tab, type = 1
        // executive_Add, type = 2
        // search, type = 4
        $scope.calculateSum = function (type) {
            var operationTarget;
            var result = 0;
            switch(type) {
                case 0:
                    operationTarget = $scope.displayPaymentItems;
                    if (operationTarget == undefined || operationTarget == null) {
                        return;
                    }
                    for (var index = 0; index < operationTarget.length; index ++) {
                        if (operationTarget[index].amount != null || operationTarget[index].amount != undefined) {
                            result += parseInt(operationTarget[index].amount);
                        }
                    }
                    return result;
                    break;
                case 1:
                    operationTarget = $scope.displayPaymentItems_history;
                    if (operationTarget == undefined || operationTarget == null) {
                        return;
                    }
                    for (var index = 0; index < operationTarget.length; index ++) {
                        if (!operationTarget[index].isExecutiveCheck) {
                            continue;
                        }
                        if (operationTarget[index].amount != null || operationTarget[index].amount != undefined) {
                            result += parseInt(operationTarget[index].amount);
                        }
                    }
                    return result;
                    break;
                case 2:
                    operationTarget = $scope.displayPaymentItems_executiveAdd;
                    if (operationTarget == undefined || operationTarget == null) {
                        return;
                    }
                    for (var index = 0; index < operationTarget.length; index ++) {
                        if (operationTarget[index].amount != null || operationTarget[index].amount != undefined) {
                            result += parseInt(operationTarget[index].amount);
                        }
                    }
                    return result;
                    break;
                case 3:
                    operationTarget = $scope.displayPaymentItems_person;
                    if (operationTarget == undefined || operationTarget == null) {
                        return;
                    }
                    for (var index = 0; index < operationTarget.length; index ++) {
                        if (!operationTarget[index].isExecutiveCheck) {
                            continue;
                        }
                        if (operationTarget[index].amount != null || operationTarget[index].amount != undefined) {
                            result += parseInt(operationTarget[index].amount);
                        }
                    }
                    return result;
                    break;
                case 4:
                    operationTarget = $scope.searchPaymentsItems;
                    if (operationTarget == undefined || operationTarget == null) {
                        return;
                    }
                    for (var index = 0; index < operationTarget.length; index ++) {
                        if (!operationTarget[index].isExecutiveCheck) {
                            continue;
                        }
                        if (operationTarget[index].amount != null || operationTarget[index].amount != undefined) {
                            result += parseInt(operationTarget[index].amount);
                        }
                    }
                    return result;
                    break;

            }
        }

        $scope.listenMonth_search = function(dom){
            dom.$watch('myMonth',function(newValue, oldValue) {
                if (dom.isShiftMonthSelect) {
                    dom.isShiftMonthSelect = false;
                    $scope.changePaymentMonth_search(0, dom.monthPickerDom);
                }
            });
        }

        // 行政修訂
        $scope.changePaymentMonth_search = function(changeCount, dom) {

            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.searchPaymentItem($scope.searchPrjDID, specificYear, specificMonth);
        }

        $scope.isSearchFlag = false;
        $scope.searchPrjDID = false;

        $scope.searchPaymentItem = function (prjDID, specificYear, specificMonth) {

            $scope.searchPrjDID = prjDID;
            $scope.isSearchFlag = true;

            var formData = {
                prjDID: prjDID,
            }

            if (specificYear == null) {
                formData = {
                    prjDID: prjDID,
                }
            } else {
                formData = {
                    year: specificYear,
                    month: specificMonth,
                    prjDID: prjDID,
                }
            }

            bsLoadingOverlayService.start({
                referenceId: 'payment_main'
            });

            PaymentFormsUtil.fetchPaymentsItemByPrjDID(formData)
                .success(function (res) {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'payment_main'
                        });
                    }, 100)
                    $scope.searchPaymentsItems = res.payload;
                })
                .error(function (resp) {
                    $timeout(function () {
                        bsLoadingOverlayService.stop({
                            referenceId: 'payment_main'
                        });
                    }, 100)
                })
        }

        $scope.showUpdateAction = function (action) {
            return UpdateActionUtil.convertAction(action);
        }

        // 抽單
        $scope.cancelReview = function(table) {
            console.log(table)
            $scope.checkText = '確定 抽回：' +
                table.payDate + ", " + table.contents + " - " + table.amount +
                " ？";
            $scope.checkingTable = table;
            ngDialog.open({
                template: 'app/pages/myModalTemplate/myWorkOffTableFormCancelReview_Modal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.sendCancelReview = function(checkingTable) {

            var formData = {
                _id: checkingTable._id,
                isSendReview: false,
                isManagerCheck: false,
                isManagerReject: false,

                updateTs: moment(new Date()).format("YYYY/MM/DD HH:mm:ss"),
                updateAction: "cancelReview"
            }
            PaymentFormsUtil.updatePaymentItemByID(formData)
                .success(function (res) {
                    $scope.fetchPaymentsData(null, 0);
                })

        }

    }
})();


