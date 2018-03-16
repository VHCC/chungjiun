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
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('myProject',
                {
                    url: '/myProject',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '專案管理',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.myProject,
                    },
                })
            // .state('myProject.createProject',
            //     {
            //         url: '/createProject',
            //         templateUrl: 'app/pages/myProject/createProject/createProject.html',
            //         controller: 'createProjectCtrl',
            //         controllerAs: 'cC',
            //         title: '建置專案',
            //         sidebarMeta: {
            //             order: global.pages.myProject_createProject,
            //         },
            //     })
            .state('myProject.listProject',
                {
                    url: '/listProject',
                    templateUrl: 'app/pages/myProject/listProject/listProject.html',
                    controller: 'listProjectCtrl',
                    title: '執行中專案',
                    sidebarMeta: {
                        order: global.pages.myProject_listProject,
                    },
                })
            .state('myProject.endProject',
                {
                    url: '/endProject',
                    templateUrl: 'app/pages/myProject/listProject/listProject.html',
                    controller: 'listProjectCtrl',
                    title: '已結案專案',
                    accessLevel: [1, 2, 3, 100],
                    sidebarMeta: {
                        order: global.pages.myProject_endProject,
                    },
                })
    }
})();
