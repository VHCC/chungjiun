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
            .state('myForms.createProject',
                {
                    url: '/myForms/workhours',
                    templateUrl: 'app/pages/myForms/workHour/workHourPage.html',
                    controller: 'forms_workhour_controller',
                    title: '工時表',
                    sidebarMeta: {
                        order: global.pages.myForms_workhour,
                    },
                })
    }
})();
