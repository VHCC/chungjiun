/**
 * @author Ichen.Chu
 * created on 19.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('workHourTableCtrl',
            [
                '$scope',
                '$filter',
                '$cookies',
                'User',
                'Project',
                'ProjectUtil',
                'DateUtil',
                'WorkHourForms',
                'editableOptions',
                'editableThemes',
                WorkHourTableCtrl
            ]);

    /** @ngInject */
    function WorkHourTableCtrl($scope,
                               $filter,
                               cookies,
                               User,
                               Project,
                               ProjectUtil,
                               DateUtil,
                               WorkHourForms,
                               editableOptions,
                               editableThemes) {
        var vm = this;

        Project.findAll()
            .success(function (allProjects) {
                vm.projects = allProjects;
            });

        User.findManagers()
            .success(function (allManagers) {
                console.log('rep - GET ALL Managers, SUCCESS');
                $scope.projectManagers = [];
                for (var i = 0; i < allManagers.length; i++) {
                    $scope.projectManagers[i] = {
                        value: allManagers[i]._id,
                        name: allManagers[i].name
                    };
                }
            });

        $scope.showMajor = function (prj) {
            var selected = [];
            if (prj.majorID) {
                selected = $filter('filter')($scope.projectManagers, {
                    value: prj.majorID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        };

        $scope.username = cookies.get('username');


        $scope.details = [
            {
                mon_h: "1",
                mon_memo: "memo",

                tue_h: "1",
                tue_memo: "memo",

                wes_h: "1",
                wes_memo: "memo",

                thu_h: "1",
                thu_memo: "memo",

                fri_h: "1",
                fri_memo: "memo",

                sat_h: "1",
                sat_memo: "memo",

                sun_h: "1",
                sun_memo: "memo",
            },
            {
                mon_h: "1",
                mon_memo: "memo",

                tue_h: "1",
                tue_memo: "memo",

                wes_h: "1",
                wes_memo: "memo",

                thu_h: "1",
                thu_memo: "memo",

                fri_h: "1",
                fri_memo: "memo",

                sat_h: "1",
                sat_memo: "memo",

                sun_h: "1",
                sun_memo: "memo",
            },
        ];

        $scope.ssss = [
            {value: 1, text: 'Good'},
            {value: 2, text: 'Awesome'},
            {value: 3, text: 'Excellent'},
        ];

        $scope.groups = [
            {id: 1, text: 'user'},
            {id: 2, text: 'customer'},
            {id: 3, text: 'vip'},
            {id: 4, text: 'admin'}
        ];

        $scope.showGroup = function (user) {
            if (user.group && $scope.groups.length) {
                var selected = $filter('filter')($scope.groups, {id: user.group});
                return selected.length ? selected[0].text : 'Not set';
            } else return 'Not set'
        };

        $scope.showStatus = function (user) {
            var selected = [];
            if (user.status) {
                selected = $filter('filter')($scope.ssss, {value: user.status});
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        $scope.removeWorkItem = function (index) {
            console.log(index)
            $scope.projectsItems.splice(index, 1);
            console.log('removeWorkItem=' + index);
        };

        editableOptions.theme = 'bs3';
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        $scope.projectsItems = [];

        $scope.addPayment = function (prj) {
            vm.prjItems.selected = "";
            var inserted = {
                prjDID: prj._id,
                prjCode: prj.prjCode,
                name: prj.name + " - " + ProjectUtil.getTypeText(prj.type),
                majorID: prj.majorID,
            };
            $scope.projectsItems.push(inserted);
        }
        DateUtil.getFirstDayofThisWeek(moment());

        $scope.createSubmit = function () {
            var formData = {
                creatorDID: cookies.get('userDID'),
                create_formDate: DateUtil.getFirstDayofThisWeek(moment()),
                formTable: [],
            }
            WorkHourForms.createWorkHourForm(formData)
                .success(function () {
                })
                .error(function () {
                    console.log(22222222)
                })
        }


        var getFormData = {
            creatorDID: cookies.get('userDID'),
            create_formDate: DateUtil.getFirstDayofThisWeek(moment('2018-03-13')),
        }
        WorkHourForms.getWorkHourForm(getFormData)
            .success(function (res) {
                console.log(11111);
                console.log(JSON.stringify(res.payload));
            })
            .error(function () {
                console.log(2222)
            })

    }

})();
