/**
 * @author Ichen.chu
 * created on 14.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myExecutive', [
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('myExecutive',
                {
                    url: '/myExecutive',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '行政專區',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.myExecutive,
                    },
                })
            .state('myExecutive.createProject',
                {
                    url: '/createProject',
                    templateUrl: 'app/pages/myProject/createProject/createProject.html',
                    controller: 'createProjectCtrl',
                    controllerAs: 'cC',
                    title: '建置新專案',
                    sidebarMeta: {
                        order: global.pages.myExecutive_createProject,
                    },
                })
    }
})();
