/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProject', ['ui.select', 'ngSanitize'])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('myProect', {
                url: '/myProect',
                template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true,
                title: 'Project',
                sidebarMeta: {
                    icon: 'ion-compose',
                    order: global.pages.myProject,
                },
            })
            .state('myProect.createProject',
                {
                    url: '/myProect/createProject',
                    templateUrl: 'app/pages/myProect/createProject/createProject.html',
                    controller: 'createProjectCtrl',
                    controllerAs: 'vm',
                    title: 'Create Project',
                    sidebarMeta: {
                        order: global.pages.myProject_createProject,
                    },
                });
    }
})();
