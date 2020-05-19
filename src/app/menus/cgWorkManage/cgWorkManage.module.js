/**
 * @author Ichen.chu
 * created on 26.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.cgWorkManage', [
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('cgWorkManage',
                {
                    url: '/cgWorkManage',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '差勤管理',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.cgWorkManage,
                    },
                })
            .state('cgWorkManage.userEdit', {
                url: '/userEdit',
                title: '個人資料',
                templateUrl: 'app/pages/myProfile/userEdit/userEdit.html',
                controller: 'userEditCtrl',
                controllerAs: 'userEditCtrlVm',
                sidebarMeta: {
                    order: global.pages.cgWorkManage_userEdit,
                },
            })
            .state('cgWorkManage.workHourTableForm',
                {
                    url: '/workHourTableForm',
                    templateUrl: 'app/pages/myForms/workHourTableForm/workHourTableFormPage.html',
                    controller: 'workHourTableCtrl',
                    controllerAs: 'workHourTableCtrlVm',
                    title: '工時系統',
                    sidebarMeta: {
                        order: global.pages.cgWorkManage_workHourTable,
                    },
                })
            .state('cgWorkManage.travelApplication',
                {
                    url: '/travelApplication',
                    templateUrl: 'app/pages/myForms/travelApplication/travelApplicationHomePage.html',
                    controller: 'travelApplicationHomeCtrl',
                    controllerAs: 'travelApplicationHomeCtrlVm',
                    title: '出差公出[測試]',
                    accessLevel: [1,2,3,4,6,7,100],
                    sidebarMeta: {
                        order: global.pages.cgWorkManage_travelApplication,
                    },
                })
            .state('cgWorkManage.workOffForm',
                {
                    url: '/workOffForm',
                    templateUrl: 'app/pages/myForms/workOffForm/workOffFormPage.html',
                    controller: 'workOffFormCtrl',
                    controllerAs: 'workOffFormCtrlVm',
                    title: '人員請假',
                    accessLevel: [1,2,3,4,6,7,100],
                    sidebarMeta: {
                        order: global.pages.cgWorkManage_workOff,
                    },
                })
            .state('cgWorkManage.hrMachine',
                {
                    url: '/hrMachine',
                    templateUrl: 'app/pages/myForms/hrMachine/hrMachinePage.html',
                    controller: 'hrMachineCtrl',
                    controllerAs: 'hrMachineCtrlVm',
                    title: '差勤紀錄',
                    sidebarMeta: {
                        order: global.pages.cgWorkManage_hrMachine,
                    },
                })
            // .state('cgWorkManage.workStatistics',
            //     {
            //         url: '/workStatistics',
            //         templateUrl: 'app/pages/myForms/workStatistics/workStatistics.html',
            //         controller: 'workStatisticsCtrl',
            //         controllerAs: 'workStatisticsCtrlVm',
            //         title: '工時表統計',
            //         accessLevel: [2, 100],
            //         sidebarMeta: {
            //             order: global.pages.cgWorkManage_workStatistics,
            //         },
            //     })
            // .state('cgWorkManage.workStatisticsCJ',
            //     {
            //         url: '/workStatisticsCJ',
            //         templateUrl: 'app/pages/myForms/workStatisticsCJ/workStatisticsCJ.html',
            //         controller: 'workStatisticsCJCtrl',
            //         controllerAs: 'workStatisticsCJCtrlVm',
            //         title: '工時表統計',
            //         accessLevel: [2, 100],
            //         sidebarMeta: {
            //             order: global.pages.cgWorkManage_workStatistics_CJ,
            //         },
            //     })
    }
})();
