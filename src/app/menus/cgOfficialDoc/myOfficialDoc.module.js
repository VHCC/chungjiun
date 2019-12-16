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
                        order: global.pages.cgOfficialDoc,
                    },
                })
            .state('cgOfficialDoc.officialDocList',
                {
                    url: '/officialDocList',
                    templateUrl: 'app/pages/officialDoc/listOfficialDoc/listOfficialDocHomePage.html',
                    // controller: 'listOfficialDocCtrl',
                    title: '公文列表',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgOfficialDoc_list,
                    },
                })
            .state('cgOfficialDoc.officialDocReceive',
                {
                    url: '/officialDocReceive',
                    templateUrl: 'app/pages/officialDoc/receiveOfficialDoc/receiveOfficialDocHomePage.html',
                    controller: 'receiveOfficialDocCtrl',
                    controllerAs: 'receiveOfficialDocCtrlVm',
                    title: '收文作業',
                    // accessLevel: [9999],
                    accessFeature: ['feature_official_doc'],
                    sidebarMeta: {
                        order: global.pages.cgOfficialDoc_receive,
                    },
                })
            .state('cgOfficialDoc.officialDocHandle',
                {
                    url: '/officialDocHandle',
                    templateUrl: 'app/pages/officialDoc/handleOfficialDoc/handleOfficialDocHomePage.html',
                    controller: 'handleOfficialDocHomeCtrl',
                    title: '公文辦理',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgOfficialDoc_handle,
                    },
                })
            .state('cgOfficialDoc.cgOfficialDocPublic',
                {
                    url: '/officialDocPublic',
                    templateUrl: 'app/pages/officialDoc/publicOfficialDoc/publicOfficialDocHomePage.html',
                    title: '發文作業',
                    controller: 'publicOfficialDocCtrl',
                    controllerAs: 'publicOfficialDocCtrlVm',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgOfficialDoc_public,
                    },
                })
    }
})();
