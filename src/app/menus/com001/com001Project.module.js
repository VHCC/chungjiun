/**
 * @author Ichen.chu
 * created on 14.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.001.Project', [
        'ui.select',
        'ngSanitize',
        'BlurAdmin.pages.ui.notifications'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('001Project',
                {
                    url: '/project',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '專案管理',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages._001_Project,
                    },
                })
            .state('001Project.createProject',
                {
                    url: '/createProject',
                    templateUrl: 'app/custom/com001/pages/project/createProject/001createProjectHome.html',
                    title: '建立專案',
                    controller: '_001_createProjectHomeCtrl',
                    controllerAs: 'vm',
                    // accessLevel: [100],
                    sidebarMeta: {
                        order: global.pages._001_Project_createProject,
                    },
                })
            .state('001Project.listProject',
            {
                url: '/listProject',
                templateUrl: 'app/custom/com001/pages/project/listProject/001listProjectHome.html',
                controller: '_001_listProjectHomeCtrl',
                controllerAs: 'vm',
                title: '執行專案',
                // accessLevel: [100],
                sidebarMeta: {
                    order: global.pages._001_Project_listProject,
                },
            })
            .state('001Project.listProjectContract',
                {
                    url: '/listProjectContract',
                    templateUrl: 'app/custom/com001/pages/project/listContract/001listContractHome.html',
                    controller: '_001_listContractHomeCtrl',
                    controllerAs: 'vm',
                    title: '契約基本資料',
                    sidebarMeta: {
                        order: global.pages._001_Project_listProjectContract,
                    },
                })
            .state('001Project.listProjectCase',
                {
                    url: '/listProjectCase',
                    templateUrl: 'app/pages/myProject/listProject/listProject.html',
                    controller: 'listProjectCtrl',
                    title: '工程基本資料',
                    sidebarMeta: {
                        order: global.pages._001_Project_listProjectCase,
                    },
                })
    }
})();
