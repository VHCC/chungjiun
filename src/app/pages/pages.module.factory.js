/**
 * @author Ichen.chu
 * created on 07.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.factory', [
    ])
        .config(routeConfig)
        .factory('User', ['$http', function (http) {
            return {
                getAllUsers: function () {
                    return http.get('/api/getAllUsers');
                },
            }
        }])
        .factory('Project', ['$http', function (http) {
            return {
                get: function () {
                    return http.get('/api/projectFind');
                },
                create: function (projectData) {
                    return http.post('/api/projectCreate', projectData);
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
