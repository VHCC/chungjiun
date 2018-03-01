(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myCalender', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('myCalender', {
                url: '/myCalender',
                templateUrl: 'app/pages/myCalender/myCalenderPage.html',
                controller: 'mainController',
                title: '行事曆',
                sidebarMeta: {
                    icon: 'ion-grid',
                    order: global.pages.myCalender,
                },
            })
    }

})();

