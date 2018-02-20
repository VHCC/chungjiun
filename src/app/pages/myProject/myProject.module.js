/**
 * @author Ichen.chu
 * created on 14.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProject', [
        'ui.select',
        'ngSanitize',
        'BlurAdmin.pages.ui.notifications'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('myProject',
                {
                    url: '/myProject',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '專案',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.myProject,
                    },
                })
            .state('myProject.createProject',
                {
                    url: '/myProject/createProject',
                    templateUrl: 'app/pages/myProject/createProject/createProject.html',
                    controller: 'createProjectCtrl',
                    controllerAs: 'vm',
                    title: '建置專案',
                    sidebarMeta: {
                        order: global.pages.myProject_createProject,
                    },
                })
            .state('myProject.listProject',
                {
                    url: '/myProject/listProject',
                    templateUrl: 'app/pages/myProject/listProject/listProject.html',
                    controller: 'listProjectCtrl',
                    controllerAs: 'vm',
                    title: '我的專案',
                    sidebarMeta: {
                        order: global.pages.myProject_listProject,
                    },
                })
    }
})();
