/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('workHourFormCtrl',
            [
                '$scope',
                '$cookies',
                'Project',
                WorkHoutCtrl
            ]);

    /** @ngInject */
    function WorkHoutCtrl($scope,
                          cookies,
                          Project) {

        $scope.username = cookies.get('username');

        Project.findAll()
            .success(function (allProjects) {
                console.log('Rep - GET ALL Project, SUCCESS');
                console.log(JSON.stringify(allProjects));
                vm.projects = allProjects;
            });

        var vm = this;
        vm.disabled = undefined;

        vm.days = [
            new Date(),
            new Date() + 1,
            new Date() + 2,
            new Date() + 3,
            new Date() + 4,
        ]

        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        vm.format = vm.formats[1];

    }

})();
