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
                'Project',
                WorkOffFormCtrl
            ]);

    /** @ngInject */
    function WorkOffFormCtrl($scope,
                         Project) {

        Project.findAll()
            .success(function (allProjects) {
                console.log(JSON.stringify(allProjects));
                vm.projects = allProjects;
            });

        var vm = this;

    }
})();


