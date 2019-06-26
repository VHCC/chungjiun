(function () {
    'use strict';

    angular.module('BlurAdmin.pages.vhcTest', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('vhcTest',
                {
                    // url: '/cgProject',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '保健視',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.vhc,
                    },
                })
            .state('vhcTest.migrate', {
                url: '/vhcMigrate',
                templateUrl: 'app/pages/vhc/test/vhcTest.html',
                controller: 'vhcTestController',
                title: '資料庫轉移',
                accessLevel: [9999],
                sidebarMeta: {
                    icon: 'ion-grid',
                    order: global.pages.vhcMigrate,
                },
            })
            .state('vhcTest.memberList', {
                url: '/vhcMemberList',
                templateUrl: 'app/pages/vhc/memberList/vhcMemberList.html',
                controller: 'vhcMemberListController',
                title: '會員系統',
                sidebarMeta: {
                    icon: 'ion-grid',
                    order: global.pages.vhcMemberList,
                },
            })
            .state('vhcTest.purchseList', {
                url: '/purchaseList',
                templateUrl: 'app/pages/vhc/purchaseList/vhcPurchaseList.html',
                controller: 'vhcPurchaseListController',
                title: '消費',
                sidebarMeta: {
                    icon: 'ion-grid',
                    order: global.pages.vhcPurchaseList,
                },
            })
    }

})();

