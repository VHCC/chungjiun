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
                mon_memo: "memo1",

                tue_h: "1",
                tue_memo: "memo2",

                wes_h: "1",
                wes_memo: "memo3",

                thu_h: "1",
                thu_memo: "memo4",

                fri_h: "1",
                fri_memo: "memo5",

                sat_h: "1",
                sat_memo: "memo6",

                sun_h: "1",
                sun_memo: "memo7",
            },
            {
                mon_h: "1",
                mon_memo: "memo11",

                tue_h: "1",
                tue_memo: "memo22",

                wes_h: "1",
                wes_memo: "memo33",

                thu_h: "1",
                thu_memo: "memo44",

                fri_h: "1",
                fri_memo: "memo55",

                sat_h: "1",
                sat_memo: "memo66",

                sun_h: "1",
                sun_memo: "memo77",
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

        $scope.addWorkItem = function (prj) {
            vm.prjItems.selected = "";
            var inserted = {
                prjDID: prj._id,
                prjCode: prj.prjCode,
                name: prj.name + " - " + ProjectUtil.getTypeText(prj.type),
                majorID: prj.majorID,
            };
            $scope.projectsItems.push(inserted);
        }

        // CREATE SUBMIT
        $scope.createSubmit = function () {

            var workItemCount = $('tbody').length;
            var workHourTableData = [];

            for (var index = 0; index < workItemCount; index++) {
                var itemPrjCode = $('tbody').find("span[id^='prjCode']")[index * 2].innerText;
                var itemPrjDID = $('tbody').find("span[id^='prjDID']")[index * 2].innerText;

                var mon_hour = $('tbody').find("span[id^='monh']")[index * 2].innerText;
                var monh_add = $('tbody').find("span[id^='monh']")[index * 2 + 1].innerText;

                var mon_memo = $('tbody').find("span[id^='monmemo']")[index * 2].innerText;
                var mon_memo_add = $('tbody').find("span[id^='monmemo']")[index * 2 + 1].innerText;

                var tableItem = {
                    creatorDID: cookies.get('userDID'),
                    prjDID: itemPrjDID,

                    mon_hour: mon_hour,
                    mon_hour_add: monh_add,

                    mon_memo: mon_memo,
                    mon_memo_add: mon_memo_add,
                }

                workHourTableData.push(tableItem);
            }

            var formData = {
                creatorDID: cookies.get('userDID'),
                create_formDate: DateUtil.getFirstDayofThisWeek(moment()),
                formTables: workHourTableData,
            }
            console.log(workHourTableData);
            WorkHourForms.createWorkHourTableForm(formData)
                .success(function () {

                })
                .error(function () {
                    console.log(33333)
                })
        }

        $scope.loading = true;
        var getData = {
            creatorDID: cookies.get('userDID'),
            create_formDate: DateUtil.getFirstDayofThisWeek(moment()),
        }
        //init
        WorkHourForms.getWorkHourForm(getData)
            .success(function (res) {
                if (res.payload.length > 0) {
                    var workItemCount = res.payload[0].formTables.length;

                    var prjIDArray = [];
                    var workTableIDArray = [];
                    for (var index = 0; index < workItemCount; index++) {
                        workTableIDArray[index] = res.payload[0].formTables[index].tableID;
                        prjIDArray[index] = res.payload[0].formTables[index].prjDID;
                    }

                    var formData = {
                        prjIDArray: prjIDArray,
                    }

                    Project.findPrjByIDArray(formData)
                        .success(function (res) {
                            $scope.loading = false;
                            // console.log(res.payload);
                            var prjCount = res.payload.length;
                            for (var index = 0; index < prjCount; index++) {
                                var inserted = {
                                    prjDID: res.payload[index]._id,
                                    prjCode: res.payload[index].prjCode,
                                    name: res.payload[index].name + " - " + ProjectUtil.getTypeText(res.payload[index].type),
                                    majorID: res.payload[index].majorID,

                                };
                                $scope.projectsItems.push(inserted);
                            }
                        })
                        .error(function () {
                            console.log(99999);
                        })

                    var formDataTable = {
                        tableIDArray: workTableIDArray,
                    }
                    // console.log(formDataTable);

                    WorkHourForms.findWorkHourTableFormByTableIDArray(formDataTable)
                        .success(function (res) {
                            console.log(res.payload)

                            var detailCount = res.payload.length;
                            // console.log(456456)
                        })
                        .error(function () {
                            console.log(789789)
                        })

                } else {
                    $scope.loading = false;
                }
            })
            .error(function () {
                console.log(2222)
            })

    }

})();
