/**
 * @author Ichen.chu
 * created on 01.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms', [
        'ui.select',
        'ngSanitize',
        'BlurAdmin.pages.ui.notifications',
        'bsLoadingOverlay',
        'bsLoadingOverlaySpinJs',
    ])
        .run(function(bsLoadingOverlayService) {
            bsLoadingOverlayService.setGlobalConfig({
                templateUrl: 'components/loading-overlay-template.html'
                // templateUrl: 'bsLoadingOverlaySpinJs'
            });
        })
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('myForms',
                {
                    url: '/myForms',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '表單',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.myForms,
                    },
                })
            .state('myForms.workHours',
                {
                    url: '/workHours',
                    templateUrl: 'app/pages/myForms/workHour/workHourPage.html',
                    controller: 'workHourFormCtrl',
                    controllerAs: 'workHourFormCtrlVm',
                    title: '工時表(未完成)',
                    sidebarMeta: {
                        order: global.pages.myForms_workHour,
                    },
                })
            .state('myForms.newForm',
                {
                    url: '/newForm',
                    templateUrl: 'app/pages/myForms/newForm/newFormPage.html',
                    controller: 'newFormCtrl',
                    controllerAs: 'newFormCtrlVm',
                    title: '新表單(Sample)',
                    sidebarMeta: {
                        order: global.pages.myForms_newForm,
                    },
                })
            // .state('myForms.paymentForm',
            //     {
            //         url: '/paymentForm',
            //         templateUrl: 'app/pages/myForms/paymentForm/paymentFormPage.html',
            //         controller: 'paymentFormCtrl',
            //         controllerAs: 'paymentFormCtrlVm',
            //         title: '墊付款',
            //         sidebarMeta: {
            //             order: global.pages.myForms_paymentForm,
            //         },
            //     })
            // .state('myForms.workOffForm',
            //     {
            //         url: '/workOffForm',
            //         templateUrl: 'app/pages/myForms/workOffForm/workOffFormPage.html',
            //         controller: 'workOffFormCtrl',
            //         controllerAs: 'cC',
            //         title: '人員休假',
            //         sidebarMeta: {
            //             order: global.pages.myForms_workOff,
            //         },
            //     })
            // .state('myForms.workHourTableForm',
            //     {
            //         url: '/workHourTableForm',
            //         templateUrl: 'app/pages/myForms/workHourTableForm/workHourTableFormPage.html',
            //         controller: 'workHourTableCtrl',
            //         controllerAs: 'workHourTableCtrlVm',
            //         title: '人員工時',
            //         sidebarMeta: {
            //             order: global.pages.myForms_workHourTable,
            //         },
            //     })
    }
})();
