/**
 * @author Ichen.chu
 * created on 08.08.2019
 */
(function () {
        'use strict';

        angular.module('BlurAdmin.pages.myForms')
            .controller('workOffExchangeCtrl',
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
                    'WorkOffTypeUtil',
                    'WorkHourAddItemUtil',
                    'WorkOffExchangeFormUtil',
                    'bsLoadingOverlayService',
                    'toastr',
                    WorkOffExchangeCtrl
                ]);

        /** @ngInject */
        function WorkOffExchangeCtrl($scope,
                               $filter,
                               cookies,
                               $timeout,
                               $compile,
                               ngDialog,
                               User,
                               DateUtil,
                               TimeUtil,
                               Project,
                               ProjectUtil,
                               WorkHourUtil,
                               WorkOffTypeUtil,
                               WorkHourAddItemUtil,
                               WorkOffExchangeFormUtil,
                               bsLoadingOverlayService,
                               toastr) {

            var vm = this;

            var thisYear = new Date().getFullYear() - 1911;
            var thisMonth = new Date().getMonth() + 1; //January is 0!;

            var specificYear = thisYear;

            // // 所有人，對照資料
            User.getAllUsers()
                .success(function (allUsers) {
                    vm.executiveUsers = allUsers;
                });

            $scope.showWorkHourAdd = function(item) {
                return DateUtil.formatDate(DateUtil.getShiftDatefromFirstDate(moment(item.create_formDate), item.day - 1));
            }

            $scope.listenYear = function (dom) {
                dom.$watch('myYear',function(newValue, oldValue) {
                    if (dom.isShiftYearSelect) {
                        dom.isShiftYearSelect = false;
                        $scope.year = specificYear = newValue - 1911;
                        $scope.fetchWorkOffExchange_form(vm.workAdd.selected._id);
                    }
                });
            }

            $scope.specificUserMonthSalary;
            $scope.workOffExchangeTablesItems = [];

            $scope.$watchCollection('exchangeForm',function(exchangeFormCallback, oldValue) {
                console.log(exchangeFormCallback);
                if (exchangeFormCallback != undefined) {

                    $scope.specialRest = (parseFloat(exchangeFormCallback.rest_special))  // 剩餘特休
                        - (parseFloat(exchangeFormCallback.calculate_special)) // 所有區間內已請特休
                        - (parseFloat(exchangeFormCallback.specificUser_exchange_special_history)); // 所有區間內已請特休

                    $scope.observedRest = parseFloat(exchangeFormCallback.person_residual_rest_hour) // 補休預設
                        + parseFloat(exchangeFormCallback.rest_observed) // 所有補休;
                        - parseFloat(exchangeFormCallback.calculate_observed) // 已請補休 (今年 + 去年);
                        - parseFloat(exchangeFormCallback.specificUser_exchange_observed_history) // 去年請的換休;
                }
            });

            $scope.$watch('workOffExchangeTablesItems',function(exchangeItems, oldValue) {
                console.log(exchangeItems);
                $scope.observedRest_exchange = 0.0;
                $scope.specialRest_exchange = 0.0;
                if (exchangeItems != undefined) {
                    for (var index = 0; index < exchangeItems.length; index ++) {
                        if (exchangeItems[index].isConfirmed) {
                            switch (exchangeItems[index].workOffType) {
                                case 2:
                                    $scope.observedRest_exchange += parseFloat(exchangeItems[index].exchangeHour);
                                    break;
                                case 3:
                                    $scope.specialRest_exchange += parseFloat(exchangeItems[index].exchangeHour);
                                    break;
                            }
                        }
                    }
                }
            });

            $scope.fetchWorkOffExchange_form = function (userID, year) {
                // console.log($scope);
                bsLoadingOverlayService.start({
                    referenceId: 'exchange_workOff'
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
                    month: year == undefined ? specificYear : year,
                    isExecutiveConfirm: true,
                }

                $('.exchangeInput').mask('AAAAAAA', {
                    translation: {
                        'A': {
                            pattern: /[0123456789]/,
                        },
                    }
                });

                $('.exchangeMonth').mask('AB', {
                    translation: {
                        'A': {
                            pattern: /[01]/,
                        },
                        'B': {
                            pattern: /[0123456789]/,
                        }
                    }
                });



                var formData = {
                    creatorDID: vm.workAdd.selected._id,
                    year: specificYear,
                }
                WorkOffExchangeFormUtil.fetchExchangeItemsByYear(formData)
                    .success(function (res) {

                        res.payload = res.payload.sort(function (a, b) {
                            return a._id > b._id ? 1 : -1;
                        });

                        $scope.workOffExchangeTablesItems = res.payload;

                        if ($scope.$parent.$parent.$parent.$parent.getWorkOffTable != undefined) {
                            $scope.$parent.$parent.$parent.$parent.getWorkOffTable(userID, null, null, $scope);
                        } else {
                            $scope.$parent.$parent.$parent.$parent.$parent.getWorkOffTable(userID, null, null, $scope);
                        }

                        $timeout(function () {
                            bsLoadingOverlayService.stop({
                                referenceId: 'exchange_workOff'
                            });
                        }, 500);
                    })


            }

            $scope.calculateExchangeMoney = function (item) {
                var result;
                result = Math.round(item.userMonthSalary / 30 / 8) * item.exchangeHour;
                return isNaN(result) ? "未核定" : Math.ceil(result);
            }

            $scope.exchangeType = function (type) {
                return WorkOffTypeUtil.getWorkOffString(type);
            }

            $scope.insertExchangeItem = function () {

                var formData = {
                    creatorDID: vm.workAdd.selected._id,
                    year: specificYear,
                }

                WorkOffExchangeFormUtil.insertExchangeItem(formData)
                    .success(function (res) {
                        var formData = {
                            creatorDID: vm.workAdd.selected._id,
                            year: specificYear,
                        }
                        WorkOffExchangeFormUtil.fetchExchangeItemsByYear(formData)
                            .success(function (res) {
                                console.log(res);

                                res.payload = res.payload.sort(function (a, b) {
                                    return a._id > b._id ? 1 : -1;
                                });

                                $scope.workOffExchangeTablesItems = res.payload;
                            })
                    })
            }

            $scope.removeExchangeItem = function (item) {
                var formData = {
                    _id: item._id,
                }

                WorkOffExchangeFormUtil.removeExchangeItem(formData)
                    .success(function (res) {
                        var formData = {
                            creatorDID: vm.workAdd.selected._id,
                            year: specificYear,
                        }
                        WorkOffExchangeFormUtil.fetchExchangeItemsByYear(formData)
                            .success(function (res) {
                                console.log(res);

                                res.payload = res.payload.sort(function (a, b) {
                                    return a._id > b._id ? 1 : -1;
                                });

                                $scope.workOffExchangeTablesItems = res.payload;
                            })
                    })
            }

            $scope.confirmExchangeItem = function (item) {
                var formData = {
                    _id: item._id,
                    creatorDID: vm.workAdd.selected._id,
                    year: specificYear,
                    month: item.month,
                    userMonthSalary: item.userMonthSalary,
                    workOffType: item.workOffType,
                    exchangeHour: item.exchangeHour,

                }
                WorkOffExchangeFormUtil.confirmExchangeItem(formData)
                    .success(function (res) {
                        WorkOffExchangeFormUtil.fetchExchangeItemsByYear(formData)
                            .success(function (res) {
                                console.log(res);

                                res.payload = res.payload.sort(function (a, b) {
                                    return a._id > b._id ? 1 : -1;
                                });

                                $scope.workOffExchangeTablesItems = res.payload;
                            })
                    })

            }

        } // End of function
    }
)();
