/**
 * @author Ichen.chu
 * created on 14.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('workOffFormCtrl',
            [
                '$scope',
                '$cookies',
                'Project',
                'User',
                'DateUtil',
                'HolidayDataForms',
                WorkOffFormCtrl
            ]);

    /** @ngInject */
    function WorkOffFormCtrl($scope,
                             cookies,
                             Project,
                             User,
                             DateUtil,
                             HolidayDataForms) {


        $scope.username = cookies.get('username');
        $scope.userDID = cookies.get('userDID'),
        $scope.roleType = cookies.get('roletype');

        var formData = {
            userDID: cookies.get('userDID'),
        }
        User.findUserByUserDID(formData)
            .success(function (user) {
                $scope.userHourSalary = user.userHourSalary;
            })

        Project.findAll()
            .success(function (allProjects) {
                // console.log(allProjects);
                vm.projects = allProjects;
            });

        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
            });

        // 主要顯示
        $scope.loginUserTablesItems = [];

        var vm = this;
        var thisYear = new Date().getFullYear() - 1911;
        var thisMonth = new Date().getMonth() + 1; //January is 0!;
        var thisDay = new Date().getDate();
        if (thisDay < 10) {
            thisDay = '0' + thisDay;
        }
        // ***********************  個人填寫 ************************

        $scope.getUserHoliday = function () {
            var formData = {
                year: thisYear,
                creatorDID: $scope.userDID,
            };
            HolidayDataForms.findFormByUserDID(formData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        vm.loginUserHolidayForm = res.payload[0];
                    } else {
                        HolidayDataForms.createForms(formData)
                            .success(function (res) {
                                vm.loginUserHolidayForm = res.payload;
                            })
                    }
                })
        }

        $scope.firstFullDate = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);

        $scope.addHolidayItem = function () {
            var inserted = {
                creatorDID: $scope.userDID,
                workOffType: 1,
                create_formDate: $scope.firstFullDate,
                year: thisYear,
                month: thisMonth,
                day: thisDay,
                start_time: new Date(),
                end_time: new Date(),
                //RIGHT
                isSendReview: false,
                isManagerCheck: false,
                isExecutiveCheck: false,
            };
            $scope.loginUserTablesItems.push(inserted);
        }
        
        $scope.showDay = function (table) {
            var date = String(table.year + 1911) +
                "/" + String(table.month) +
                "/" + String(table.day);
            return DateUtil.getDay(moment(date).day())
        }

        // ***********************  行政確認 ************************

        // ***********************  update holiday Data ************************
        $scope.updateUserHolidayData = function () {
            var formData = vm.holidayForm;
            HolidayDataForms.updateFormByFormDID(formData)
                .success(function (res) {
                    // console.log(res.code);
                })
        }

        // -------------find form ----------------------
        $scope.findHolidayFormByUserDID = function () {
            var formData = {
                year: thisYear,
                creatorDID: vm.user.selected._id
            };
            HolidayDataForms.findFormByUserDID(formData)
                .success(function (res) {
                    if (res.payload.length > 0) {
                        vm.holidayForm = res.payload[0];
                    } else {
                        HolidayDataForms.createForms(formData)
                            .success(function (res) {
                                vm.holidayForm = res.payload;
                            })
                    }
                })
        }

        // --------------- calculator ----------------
        $scope.total = function (a, b) {
            return parseInt(a) + parseInt(b);
        }

        // --------------- document ready -----------------

        $(document).ready(function () {
            $('.workOffFormNumberInput').mask('00.Z', {
                translation: {
                    'Z': {
                        pattern: /[05]/,
                    }
                }
            });
            $('.workOffFormDateInput').mask('100/M0/D0', {
                translation: {
                    'M': {
                        pattern: /[01]/,
                    },
                    'D': {
                        pattern: /[0123]/,
                    }
                }
            });
        });
    }
})();


