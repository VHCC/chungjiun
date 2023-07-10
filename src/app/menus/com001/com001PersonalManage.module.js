/**
 * @author Ichen.chu
 * created on 26.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.001.PersonalManage', [
        'ui.select',
        'ngSanitize',
        'BlurAdmin.pages.ui.notifications'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('001PersonalManage',
                {
                    url: '/personalManage',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '個人管理',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages._001_PersonalManage,
                    },
                })
            .state('001PersonalManage.caseInfo', {
                url: '/caseInfo',
                title: '專案資料',
                templateUrl: 'app/custom/com001/pages/personalManage/caseInfo/001caseInfoHome.html',
                controller: '_001_caseInfoHomeCtrl',
                controllerAs: 'vm',
                sidebarMeta: {
                    order: global.pages._001_PersonalManage_caseInfo,
                },
            })
            .state('001PersonalManage.userInfo', {
                url: '/userInfo',
                title: '個人資料',
                templateUrl: 'app/custom/com001/pages/personalManage/userInfo/001userInfoHome.html',
                controller: '_001_userInfoHomeCtrl',
                controllerAs: 'vm',
                sidebarMeta: {
                    order: global.pages._001_PersonalManage_userEdit,
                },
            })
            // .state('001PersonalManage.workHourTableForm',
            //     {
            //         url: '/workHourTableForm',
            //         templateUrl: 'app/pages/myForms/workHourTableForm/workHourTableFormPage.html',
            //         controller: 'workHourTableCtrl',
            //         controllerAs: 'workHourTableCtrlVm',
            //         title: '工時系統',
            //         sidebarMeta: {
            //             order: global.pages._001_PersonalManage_workHourTable,
            //         },
            //     })
            // .state('cgWorkManage.travelApplication',
            //     {
            //         url: '/travelApplication',
            //         templateUrl: 'app/pages/myForms/travelApplication/travelApplicationHomePage.html',
            //         controller: 'travelApplicationHomeCtrl',
            //         controllerAs: 'travelApplicationHomeCtrlVm',
            //         title: '出差公出',
            //         accessLevel: [1,2,3,4,6,7,100],
            //         sidebarMeta: {
            //             order: global.pages.cgWorkManage_travelApplication,
            //         },
            //     })
            // .state('cgWorkManage.Bulletin',
            //     {
            //         url: '/bulletin',
            //         templateUrl: 'app/pages/myForms/bulletin/bulletinPage.html',
            //         title: '請假出差公告',
            //         accessLevel: [1,2,3,4,6,7,100],
            //         sidebarMeta: {
            //             order: global.pages.cgWorkManage_bulletin,
            //         },
            //     })
            // .state('cgWorkManage.workOffForm',
            //     {
            //         url: '/workOffForm',
            //         templateUrl: 'app/pages/myForms/workOffForm/workOffFormPage.html',
            //         controller: 'workOffFormCtrl',
            //         controllerAs: 'workOffFormCtrlVm',
            //         title: '人員請假',
            //         accessLevel: [1,2,3,4,6,7,100],
            //         sidebarMeta: {
            //             order: global.pages.cgWorkManage_workOff,
            //         },
            //     })
            // .state('cgWorkManage.hrMachine',
            //     {
            //         url: '/hrMachine',
            //         templateUrl: 'app/pages/myForms/hrMachine/hrMachinePage.html',
            //         controller: 'hrMachineCtrl',
            //         controllerAs: 'hrMachineCtrlVm',
            //         title: '差勤紀錄',
            //         sidebarMeta: {
            //             order: global.pages.cgWorkManage_hrMachine,
            //         },
            //     })
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
