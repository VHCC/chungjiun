/**
 * @author Ichen.chu
 * created on 01.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms', [
        'ui.select',
        'ngSanitize',
        'BlurAdmin.pages.ui.notifications'
    ])
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
                    title: '工時表',
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
                    title: '新表單',
                    sidebarMeta: {
                        order: global.pages.myForms_newForm,
                    },
                })
    }
})();
