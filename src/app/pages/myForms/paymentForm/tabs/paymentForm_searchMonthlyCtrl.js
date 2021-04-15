/**
 * @author IChen.Chu
 * created on 07.04.2021
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('paymentFormSearchMonthlyCtrl',
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
                paymentFormSearchMonthlyCtrl
            ])

    /** @ngInject */
    function paymentFormSearchMonthlyCtrl($scope,
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

        $scope.listenMonth_searchMonthly = function(dom){
            dom.$watch('myMonth',function(newValue, oldValue) {
                if (dom.isShiftMonthSelect) {
                    dom.isShiftMonthSelect = false;
                    $scope.changePaymentMonth_search(0, dom.monthPickerDom);
                }
            });
        }

        // 行政修訂
        $scope.changePaymentMonth_searchMonthly = function(changeCount, dom) {

            $scope.monthPicker = dom;

            dom.myMonth = moment(dom.myDT).add(changeCount, 'M').format('YYYY/MM');
            dom.myDT = moment(dom.myDT).add(changeCount, 'M');

            var year = parseInt(dom.myDT.year()) - 1911;
            var month = parseInt(dom.myDT.month()) + 1;

            specificYear = year;
            specificMonth = month;

            $scope.searchPaymentItemSearchMonthly(specificYear, specificMonth);
        }

        $scope.isSearchFlag = false;
        $scope.searchPrjDID = false;

        $scope.monthlyData = null;
        $scope.monthlyTotalData = null;

        $scope.searchPaymentItemSearchMonthly = function (specificYear, specificMonth) {

            $scope.isSearchFlag = true;

            var formData = {
                year: specificYear,
                month: specificMonth,
            }

            bsLoadingOverlayService.start({
                referenceId: 'payment_main'
            });

            // console.log(formData);

            PaymentFormsUtil.fetchPaymentItemsSearchMonthly(formData)
                .success(function (res) {
                    // console.log(res);
                    $scope.monthlyTotalData = res.payload;
                    $scope.monthlyData = $scope.calculatePaymentsSearchMonthly(res.payload);
                    // console.log($scope.monthlyData);
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

            $scope.calculatePaymentsSearchMonthly = function (data) {
                var userData = [];
                for (var index = 0; index < data.length; index ++) {
                    if (userData[data[index].creatorDID] != undefined) {
                        var subData = userData[data[index].creatorDID];
                        subData.amount += parseInt(data[index].amount);
                        if(data[index].isFrontHalfMonth) subData.first_half += parseInt(data[index].amount);
                        if(!data[index].isFrontHalfMonth) subData.second_half += parseInt(data[index].amount);
                    } else {
                        var subData = {
                            amount:  parseInt(data[index].amount),
                            first_half: data[index].isFrontHalfMonth ? parseInt(data[index].amount): 0,
                            second_half: data[index].isFrontHalfMonth ? 0 : parseInt(data[index].amount),
                        }
                        eval('userData[data[index].creatorDID] = subData')
                    }
                }
                return userData;
            }
        }

        $scope.showMonthlyData = function (userDID, type) {
            switch (type) {
                case 0:
                    return $scope.monthlyData[userDID].amount;
                case 1:
                    return $scope.monthlyData[userDID].first_half;
                case 2:
                    return $scope.monthlyData[userDID].second_half;
            }
        }

        $scope.checkDataShow = function (index, userDID) {
            if (index+1 == $scope.monthlyTotalData.length) return true;
            return ($scope.monthlyTotalData[index+1].creatorDID != userDID)
        }

        $scope.printPDF_person = function() {
            $("#form_monthly_search_pdf").print({
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
    }
})();


