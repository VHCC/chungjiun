/**
 * @author IChen.chu
 * created on 17.09.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('paymentFormSearchCtrl',
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
                'GlobalConfigUtil',
                'bsLoadingOverlayService',
                paymentFormSearchCtrl
            ])

    /** @ngInject */
    function paymentFormSearchCtrl($scope,
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
                                   bsLoadingOverlayService) {

        $scope.userDID = $cookies.get('userDID');
        $scope.roleType = $cookies.get('roletype');
        $scope.username = $cookies.get('username');

        var vm = this;

        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;

        var specificYear = thisYear;
        var specificMonth = thisMonth;

        // 所有人，對照資料
        User.getAllUsers()
            .success(function (allUsers) {

                var relatedMembers = [];

                vm.users = allUsers; // 新增表單
                vm.historyUsers = allUsers; // 歷史檢視
                vm.executiveAddUsers = allUsers; // 行政修訂

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

        $scope.initProject = function() {
            Project.findAll()
                .success(function (allProjects) {
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

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
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
                            console.log(res.payload);
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
            if (majorSelected == undefined) false;
            var managerDID = majorSelected[0].managerID;
            return managerDID === $cookies.get('userDID');
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
                        // console.log(operationTarget[index]);
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
                        // console.log(operationTarget[index]);
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

            $scope.searchPaymentItemSearch($scope.searchPrjDID, specificYear, specificMonth);
        }

        $scope.isSearchFlag = false;
        $scope.searchPrjDID = false;

        $scope.searchPaymentItemSearch = function (prjDID, specificYear, specificMonth) {

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

            var formData = {
                rootPrjDID: prjDID
            }

            Project.fetchRelatedCombinedPrjArray(formData)
                .success(function (res) {
                    console.log(" --- 相關專案 ---");
                    console.log(res);
                    $scope.selectPrjArray = res;

                    var subFormData = {
                        prjDIDArray: $scope.selectPrjArray
                    }

                    // PaymentFormsUtil.fetchPaymentsItemByPrjDID(formData)
                    PaymentFormsUtil.fetchPaymentsItemByPrjDIDArray(subFormData)
                        .success(function (res) {
                            console.log(res)
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
                })

            $scope.showPrjCode= function (prjDID) {
                var selected = [];
                if (prjDID) {
                    selected = $filter('filter')($scope.allProjectCache, {
                        prjDID: prjDID,
                    });
                }
                if (!selected) return 'Not Set'
                return selected.length > 0 ? selected[0].prjCode : 'Not Set';
            };

            $scope.showCombinedPrjCode = function () {
                var results = "[ ";

                for (var index = 0; index < $scope.selectPrjArray.length; index ++) {
                    // console.log($scope.selectPrjArray[index])
                    results += $scope.showPrjCode($scope.selectPrjArray[index])
                    if (index < $scope.selectPrjArray.length - 1) {
                        results += ", "
                    }
                }
                results += " ]"
                return results
            }

        }

    }
})();


