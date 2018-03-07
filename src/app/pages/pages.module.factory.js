/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.factory', [
    ])
        .config(routeConfig)
        .factory('User', ['$http', function (http) {
            return {
                getAllUsers: function () {
                    return http.get('/api/getAllUsersName');
                },
            }
        }])
        .factory('Project', ['$http', function (http) {
            return {
                get: function () {
                    return http.get('/api/project');
                },
                create: function (projectData) {
                    return http.post('/api/project', projectData);
                },
                findPrjByID: function(prjID) {
                  return http.get('/api/project', prjID);
                },
            }
        }])
        .factory('Todos', ['$http',function(http) {
            return {
                get : function() {
                    return http.get('/api/todos');
                },
                create : function(todoData) {
                    return http.post('/api/todos', todoData);
                },
                delete : function(id) {
                    return http.delete('/api/todos/' + id);
                },
                deleteTest : function () {
                    return http.post('/api/todos/test');
                }
            }
        }])
    ;


    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    }

})();
