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
                'Project',
                'ProjectUtil',
                'editableOptions',
                'editableThemes',
                WorkHourTableCtrl
            ]);

    /** @ngInject */
    function WorkHourTableCtrl($scope,
                               $filter,
                               cookies,
                               Project,
                               ProjectUtil,
                               editableOptions,
                               editableThemes) {
        var vm = this;

        Project.findAll()
            .success(function (allProjects) {
                vm.projects = allProjects;
            });


        $scope.username = cookies.get('username');


        $scope.users = [
            {
                "id": 1,
                "name": "Esther Vang",
                "status": 4,
                "group": 3,
                "a":"a",
                b:"b",
                c:"c",
                d:"d",
                e:"e",
                f:"f",
                g:"g",
                h:"h",
            },
            {
                "id": 2,
                "name": "22222",
                "status": 4,
                "group": 3,
                a:"aa",
                b:"bb",
                c:"cc",
                d:"dd",
                e:"ee",
                f:"ff",
                g:"gg",
                h:"hh",
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

        $scope.addPayment = function (prjName, prjType, prjCode, prjDID) {

            var inserted = {
                prjCode: prjCode,
                name: prjName + prjType,
            };
            $scope.projectsItems.push(inserted);
        }


    }

})();
