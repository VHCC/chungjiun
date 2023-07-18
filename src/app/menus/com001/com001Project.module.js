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
                    // accessLevel: [9999],
                    // accessFeature: ['isDepG'],
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
                    accessLevel: [2,3,5],
                    // accessFeature: ['isDepBoss'],
                    sidebarMeta: {
                        order: global.pages._001_Project_listProjectContract,
                    },
                })
            .state('001Project.listProjectCase',
                {
                    url: '/listProjectCase',
                    templateUrl: 'app/custom/com001/pages/project/listCase/001listCaseHome.html',
                    controller: '_001_listCaseHomeCtrl',
                    controllerAs: 'vm',
                    title: '工程基本資料',
                    sidebarMeta: {
                        order: global.pages._001_Project_listProjectCase,
                    },
                })
            .state('001Project.listProcessStage',
                {
                    url: '/listProcessStage',
                    templateUrl: 'app/custom/com001/pages/project/processStage/001processStageHome.html',
                    controller: '_001_processStageHomeCtrl',
                    controllerAs: 'vm',
                    title: '辦理階段項目',
                    sidebarMeta: {
                        order: global.pages._001_Project_processStage,
                    },
                })
    }
})();
