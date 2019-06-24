/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages', [
        'ui.router',
        'ngCookies',

        'BlurAdmin.pages.factory',

        'BlurAdmin.pages.dashboard',
        'BlurAdmin.pages.ui',
        'BlurAdmin.pages.components',
        'BlurAdmin.pages.form',
        'BlurAdmin.pages.tables',
        'BlurAdmin.pages.charts',
        // 'BlurAdmin.pages.maps',
        'BlurAdmin.pages.profile',
        'BlurAdmin.pages.myNewPage',
        'BlurAdmin.pages.myCalender',
        'BlurAdmin.pages.myProject',
        'BlurAdmin.pages.myInput',
        'BlurAdmin.pages.myForms',
        'BlurAdmin.pages.myExecutive',
        'BlurAdmin.pages.myProfile',

        'BlurAdmin.pages.cgWorkManage',
        'BlurAdmin.pages.cgProject',
        'BlurAdmin.pages.cgAccountingManage',
        'BlurAdmin.pages.cgKPI',
        'BlurAdmin.pages.vhcTest'
    ])
        .config(routeConfig)


    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
        $urlRouterProvider.otherwise('/dashboard');

        // baSidebarServiceProvider.addStaticItem({
        //     title: 'Pages',
        //     icon: 'ion-document',
        //     subMenu: [{
        //         title: 'Sign In',
        //         fixedHref: 'auth.html',
        //         blank: true
        //     }, {
        //         title: 'Sign Up',
        //         fixedHref: 'reg.html',
        //         blank: true
        //     }, {
        //         title: 'User Profile',
        //         stateRef: 'profile'
        //     }, {
        //         title: '404 Page',
        //         fixedHref: '404.html',
        //         blank: true
        //     }, {
        //         title: 'My Login',
        //         fixedHref: 'login.html',
        //         blank: true
        //     }]
        // });
        // baSidebarServiceProvider.addStaticItem({
        //     title: 'Menu Level 1',
        //     icon: 'ion-ios-more',
        //     subMenu: [{
        //         title: 'Menu Level 1.1',
        //         disabled: true
        //     }, {
        //         title: 'Menu Level 1.2',
        //         subMenu: [{
        //             title: 'Menu Level 1.2.1',
        //             disabled: true
        //         }]
        //     }]
        // });
    }

})();
