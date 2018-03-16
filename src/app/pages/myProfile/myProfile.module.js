/**
 * @author Ichen.chu
 * created on 16.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProfile', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('myProfile',
                {
                    url: '/myProfile',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '個人專區',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.myProfile,
                    },
                })
            .state('myProfile.userEdit', {
                url: '/userEdit',
                title: '個人資料',
                templateUrl: 'app/pages/myProfile/userEdit/userEdit.html',
                controller: 'userEditCtrl',
                sidebarMeta: {
                    order: global.pages.myProfile_userEdit,
                },
            });
    }
})();
