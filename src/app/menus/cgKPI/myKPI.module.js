/**
 * @author Ichen.chu
 * created on 26.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.cgKPI', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('cgKPI',
                {
                    url: '/cgKPI',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '績效管理',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.cgKPI,
                    },
                })
            .state('cgKPI.100',
                {
                    url: '/empty',
                    templateUrl: 'app/pages/myNewPage/empty.html',
                    title: '個人績效',
                    accessLevel: [9999],
                    sidebarMeta: {
                        order: 100,
                    },
                })
            .state('cgKPI.200',
                {
                    url: '/empty',
                    templateUrl: 'app/pages/myNewPage/empty.html',
                    title: '技師績效',
                    accessLevel: [9999],
                    sidebarMeta: {
                        order: 200,
                    },
                })
            .state('cgKPI.300',
                {
                    url: '/empty',
                    templateUrl: 'app/pages/myNewPage/empty.html',
                    title: '行政績效',
                    accessLevel: [9999],
                    sidebarMeta: {
                        order: 300,
                    },
                })
            .state('cgKPI.400',
                {
                    url: '/empty',
                    templateUrl: 'app/pages/myNewPage/empty.html',
                    title: '公司利潤',
                    accessLevel: [9999],
                    sidebarMeta: {
                        order: 400,
                    },
                })
    }
})();
