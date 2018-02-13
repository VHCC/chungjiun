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
                icon: 'ion-grid',
                title: 'My Calender',
                sidebarMeta: {
                    order: global.pages.myCalender,
                },
            })
    }

})();

