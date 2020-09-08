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
                    sidebarMeta: {
                        order: global.pages.cgAccountingManage_paymentForm,
                    },
                })
            .state('cgAccountingManage.wageManagement',
                {
                    url: '/wageManagement',
                    templateUrl: 'app/pages/myForms/wageManage/wageManageHomePage.html',
                    title: '薪資',
                    controller: 'wageManageCtrl',
                    controllerAs: 'wageManageCtrlVm',
                    sidebarMeta: {
                        order: global.pages.cgAccountingManage_wageManage,
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
            .state('cgAccountingManage.executiveExpenditure',
                {
                    url: '/executiveExpenditure',
                    templateUrl: 'app/pages/myForms/executiveExpenditure/executiveExpenditureHomePage.html',
                    title: '其他支出',
                    accessLevel: [100],
                    sidebarMeta: {
                        order: global.pages.cgAccountingManage_executiveExpenditure,
                    },
                })
    }
})();
