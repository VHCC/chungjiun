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
                'HolidayDataForms',
                WorkOffFormCtrl
            ]);

    /** @ngInject */
    function WorkOffFormCtrl($scope,
                             cookies,
                             Project,
                             User,
                             HolidayDataForms) {


        $scope.username = cookies.get('username');
        $scope.roleType = cookies.get('roletype');

        Project.findAll()
            .success(function (allProjects) {
                // console.log(allProjects);
                vm.projects = allProjects;
            });

        User.getAllUsers()
            .success(function (allUsers) {
                vm.users = allUsers;
            });

        var vm = this;

        //  --------------------------  update holiday Data -----------------------
        $scope.updateUserHolidayData = function () {
            var formData = vm.holidayForm;
            console.log(vm.holidayForm);
            HolidayDataForms.updateFormByFormDID(formData)
                .success(function (res) {
                    console.log(res.code);
                })
        }

        // -------------find form ----------------------
        $scope.findHolidayFormByUserDID = function () {
            var formData = {
                year: 107,
                creatorDID: vm.user.selected._id
            };
            HolidayDataForms.findFormByUserDID(formData)
                .success(function (res) {
                    console.log(res.payload);
                    if (res.payload.length > 0) {
                        vm.holidayForm = res.payload[0];
                    } else {
                        HolidayDataForms.createForms(formData)
                            .success(function (res) {
                                console.log(res.payload);
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


