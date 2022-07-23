/**
 * @author IChen.chu
 * created on 2022/07/08
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.001.api', [])
        .config(routeConfig)
        .factory('_001_Project', ['$http', function (http) { // 專案
            return {
                createProject: function (requestData) {
                    return http.post('/api/_001_post_project_create', requestData);
                },
                findAll: function (requestData) {
                    return http.post('/api/_001_post_project_find_all', requestData);
                },

                findAllCaseWithOneContract: function (requestData) {
                    return http.post('/api/_001_post_project_find_all_case_with_one_contract', requestData);
                },

                findOneCaseWithAllType: function (requestData) {
                    return http.post('/api/_001_post_project_find_one_case_with_all_type', requestData);
                },

                findOneCaseWithOneType: function (requestData) {
                    return http.post('/api/_001_post_project_find_one_case_with_specific_type', requestData);
                },

                findAllByOneContractWithOneType: function (requestData) {
                    return http.post('/api/_001_post_project_find_all_case_with_specific_type_specific_contract', requestData);
                }
            }
        }])
        .factory('_001_Institute', ['$http', function (http) { // 機關
            return {
                createInstitute: function (requestData) {
                    return http.post('/api/_001_post_institute_create', requestData);
                },
                findAll: function () {
                    return http.get('/api/_001_post_institute_find_all');
                },
            }
        }])
        .factory('_001_ProjectContract', ['$http', function (http) { // 契約
            return {
                createProjectContract: function (requestData) {
                    return http.post('/api/_001_post_project_contract_create', requestData);
                },
                findAll: function () {
                    return http.get('/api/_001_post_project_contract_find_all');
                },
                findByInstituteDID: function (requestData) {
                    return http.post('/api/_001_post_project_contract_find_by_instituteDID', requestData);
                },

            }
        }])
        .factory('_001_ProjectCase', ['$http', function (http) { //工程
            return {
                createProjectCase: function (requestData) {
                    return http.post('/api/_001_post_project_case_create', requestData);
                },
                findAll: function () {
                    return http.get('/api/_001_post_project_case_find_all');
                },
                findByContractDIDAndInstituteDID: function (requestData) {
                    return http.post('/api/_001_post_project_case_find_by_contractDID_and_instituteDID', requestData);
                },
            }
        }])
        .factory('_001_CaseTask', ['$http', function (http) { //工程
            return {
                createCaseTask: function (requestData) {
                    return http.post('/api/_001_post_case_task_create', requestData);
                },
                findAll: function () {
                    return http.get('/api/_001_post_case_task_find_all');
                },
                updateCaseTask: function (requestData) {
                    return http.post('/api/_001_post_case_task_update_one', requestData);
                }
            }
        }])
    ;


    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    }

})();
