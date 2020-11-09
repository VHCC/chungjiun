/**
 * @author Ichen.chu
 * created on 14.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.cgProject', [
        'ui.select',
        'ngSanitize',
        'BlurAdmin.pages.ui.notifications'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('cgProject',
                {
                    url: '/cgProject',
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
            .state('cgProject.createNewProject',
                {
                    url: '/createNewProject',
                    templateUrl: 'app/pages/myExecutive/createNewProject/createProjectHomePage.html',
                    controller: 'createNewProjectCtrl',
                    controllerAs: 'createNewProjectCtrlVm',
                    title: '建立專案',
                    accessLevel: [100],
                    <!--20200518 check right-->
                    sidebarMeta: {
                        order: global.pages.myProject_createProject,
                    },
                })
            .state('cgProject.listProject',
            {
                url: '/listProject',
                templateUrl: 'app/pages/myProject/listProject/listProject.html',
                controller: 'listProjectCtrl',
                title: '執行專案',
                accessLevel: [2,6, 100],
                <!--20200518 check right-->
                sidebarMeta: {
                    order: global.pages.myProject_listProject,
                },
            })
            .state('cgProject.listProjectCharger',
                {
                    url: '/listProjectCharger',
                    templateUrl: 'app/pages/myProject/listProjectCharger/listProjectCharger.html',
                    controller: 'listProjectChargerCtrl',
                    title: '主辦專案',
                    accessLevel: [1,2,3,4,6,7,100],
                    <!--20200518 check right-->
                    sidebarMeta: {
                        order: global.pages.myProject_listProject_charger,
                    },
                })
            .state('cgProject.listProjectAll',
                {
                    url: '/listProjectAll',
                    templateUrl: 'app/pages/myProject/listProjectAll/listProjectAll.html',
                    controller: 'listProjectAllCtrl',
                    title: '專案總表',
                    <!--20200518 check right-->
                    // accessLevel: [1,2,3,6,100],
                    sidebarMeta: {
                        order: global.pages.myProject_listProjectAll,
                    },
                })
            // .state('myProject.endProject',
            //     {
            //         url: '/endProject',
            //         templateUrl: 'app/pages/myProject/listProject/listProject.html',
            //         controller: 'listProjectCtrl',
            //         title: '已結案專案',
            //         accessLevel: [1, 2, 3, 100],
            //         sidebarMeta: {
            //             order: global.pages.myProject_endProject,
            //         },
            //     })
            .state('cgProject.projectIncome',
                {
                    url: '/projectIncome',
                    templateUrl: 'app/pages/myProject/projectIncome/projectIncomeHomePage.html',
                    title: '專案收支',
                    controller: 'projectIncomeHomeCtrl',
                    controllerAs: 'projectIncomeHomeCtrlVm',
                    accessLevel: [1,2,3,4,6,7,100],
                    sidebarMeta: {
                        order: global.pages.myProject_projectIncome,
                    },
                })
            .state('cgProject.projectFinancial',
                {
                    url: '/projectFinancial',
                    templateUrl: 'app/pages/myProject/projectFinancial/projectFinancialHomePage.html',
                    title: '專案結算',
                    controller: 'projectFinancialHomeCtrl',
                    controllerAs: 'projectFinancialHomeCtrlVm',
                    accessLevel: [1,100],
                    sidebarMeta: {
                        order: global.pages.myProject_projectFinancial,
                    },
                })
    }
})();
