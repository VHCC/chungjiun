/**
 * @author Ichen.chu
 * created on 26.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.com001KPI', [
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
            .state('cgKPI',
                {
                    url: '/cgKPI',
                    template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
                    abstract: true,
                    title: '績效管理',
                    sidebarMeta: {
                        icon: 'ion-compose',
                        order: global.pages.cgKPI,
                    },
                })
            .state('cgKPI.personal',
                {
                    url: '/KPIPersonal',
                    templateUrl: 'app/pages/kpi/personal/kpiPersonHomePage.html',
                    title: '個人績效',
                    controller: 'myKPIHomeCtrl',
                    controllerAs: 'myKPIHomeCtrlVM',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgKPI_personal,
                    },
                })
            .state('cgKPI.tech',
                {
                    url: '/KPITech',
                    templateUrl: 'app/pages/kpi/tech/kpiTechHomePage.html',
                    title: '技師績效',
                    controller: 'myKPIHomeCtrl',
                    controllerAs: 'myKPIHomeCtrlVM',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgKPI_tech,
                    },
                })
            .state('cgKPI.executive',
                {
                    url: '/KPIExecutive',
                    templateUrl: 'app/pages/kpi/executive/kpiExecutiveHomePage.html',
                    title: '行政績效',
                    controller: 'myKPIHomeCtrl',
                    controllerAs: 'myKPIHomeCtrlVM',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgKPI_executive,
                    },
                })
            .state('cgKPI.companyRisk',
                {
                    url: '/KPICompanyRisk',
                    templateUrl: 'app/pages/kpi/risk/kpiCompanyRiskHomePage.html',
                    title: '公司風險',
                    controller: 'myKPIHomeCtrl',
                    controllerAs: 'myKPIHomeCtrlVM',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgKPI_companyRisk,
                    },
                })
            .state('cgKPI.companyProfits',
                {
                    url: '/KPICompanyProfits',
                    templateUrl: 'app/pages/kpi/profits/kpiCompanyProfitsHomePage.html',
                    title: '公司利潤',
                    controller: 'myKPIHomeCtrl',
                    controllerAs: 'myKPIHomeCtrlVM',
                    // accessLevel: [9999],
                    sidebarMeta: {
                        order: global.pages.cgKPI_companyProfits,
                    },
                })
    }
})();
