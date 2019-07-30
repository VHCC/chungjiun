/**
 * @author Ichen.chu
 * created on 26.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.cgAccountingManage', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('cgAccountingManage',
                {
                    url: '/cgAccountingManage',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '會計管理',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.cgAccountingManage,
                    },
                })
            .state('cgAccountingManage.paymentForm',
                {
                    url: '/paymentForm',
                    templateUrl: 'app/pages/myForms/paymentForm/paymentFormPage.html',
                    controller: 'paymentFormCtrl',
                    controllerAs: 'paymentFormCtrlVm',
                    title: '墊付款',
                    accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgAccountingManage_paymentForm,
                    },
                })
            .state('cgAccountingManage.200',
                {
                    url: '/empty',
                    templateUrl: 'app/pages/myNewPage/empty.html',
                    title: '申請單',
                    accessLevel: [9999],
                    sidebarMeta: {
                        order: 200,
                    },
                })
            .state('cgAccountingManage.300',
                {
                    url: '/empty',
                    templateUrl: 'app/pages/myNewPage/empty.html',
                    title: '總行政支出',
                    accessLevel: [9999],
                    sidebarMeta: {
                        order: 300,
                    },
                })
    }
})();
