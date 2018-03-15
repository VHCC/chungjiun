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
                WorkOffFormCtrl
            ]);

    /** @ngInject */
    function WorkOffFormCtrl($scope,
                             cookies,
                             Project) {

        $scope.username = cookies.get('username');

        Project.findAll()
            .success(function (allProjects) {
                console.log(allProjects);
                cC.projects = allProjects;
            });

        var cC = this;

        cC.offTypes = [
            {label: '事假',   type: 'w01'},
            {label: '病假',   type: 'w02'},
            {label: '特休假', type: 'w03'},
            {label: '補休',   type: 'w04'},
        ];


    }
})();


