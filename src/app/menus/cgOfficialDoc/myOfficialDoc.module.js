/**
 * @author Ichen.chu
 * created on 26.09.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.cgOfficialDoc', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('cgOfficialDoc',
                {
                    url: '/cgOfficialDoc',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '公文管理',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.cgKPI,
                    },
                })
            .state('cgOfficialDoc.100',
                {
                    url: '/officialDocList',
                    templateUrl: 'app/pages/myProject/listProjectAll/listProjectAll.html',
                    controller: 'listOfficialDocCtrl',
                    title: '公文列表',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgOfficialDoc_list,
                    },
                })
            .state('cgOfficialDoc.200',
                {
                    url: '/officialDocReceive',
                    templateUrl: 'app/pages/officialDoc/receiveOfficialDoc/receiveOfficialDoc.html',
                    controller: 'receiveOfficialDocCtrl',
                    title: '收文作業',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgOfficialDoc_receive,
                    },
                })
            .state('cgOfficialDoc.300',
                {
                    url: '/300',
                    templateUrl: 'app/pages/myNewPage/empty.html',
                    title: '公文辦理',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgOfficialDoc_300,
                    },
                })
            .state('cgOfficialDoc.400',
                {
                    url: '/400',
                    templateUrl: 'app/pages/myNewPage/empty.html',
                    title: '發文作業',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgOfficialDoc_400,
                    },
                })
    }
})();
