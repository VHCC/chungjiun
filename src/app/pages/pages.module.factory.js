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
                findTechs: function () {
                    return http.get('/api/getAllTechs');
                },
                findManagers: function () {
                    return http.get('/api/getAllManagers');
                }
            }
        }])
        .factory('Project', ['$http', function (http) {
            return {
                findAllByGroup: function () {
                    return http.get('/api/projectFindAllByGroup');
                },
                findAll: function () {
                    return http.get('/api/projectFindAll');
                },
                create: function (projectData) {
                    return http.post('/api/projectCreate', projectData);
                },
                findPrjByID: function(prjID) {
                  return http.get('/api/projectFindByPrjID', prjID);
                },
                findPrjByName: function(prjName) {
                    return http.post('/api/projectFindByName', prjName);
                },
                findPrjDistinctByName: function () {
                    return http.get('/api/projectFindByNameDistinct');
                },
                findPrjFootNumber: function (projectData) {
                    return http.post('/api/projectFootCode', projectData);
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
                },
                createMyTodo : function (todoData) {
                    return http.post('/api/createTodo', todoData);
                },
                findMyTodos : function (userData) {
                    return http.post('/api/findMyAllTodos', userData);
                },
                checkMySpecificTodo : function (todoData) {
                    return http.post('/api/checkMySpecificTodo', todoData);
                },
                removeMySpecificTodo : function (todoData) {
                    return http.post('/api/removeMySpecificTodo', todoData);
                }
            }
        }])
        .factory('PaymentForms', ['$http', function (http) {
            return {
                createForms: function (formDate) {
                    return http.post('/api/createPaymentForm', formDate);
                }
            }
        }])
        .factory('ProjectUtil', function () {
            return {
                getTypeText: function (type) {
                    switch (type) {
                        case "01":
                            return "服務建議書";
                        case "02":
                            return "規劃";
                        case "03":
                            return "設計"
                        case "04":
                            return "監造"
                        case "05":
                            return "服務"
                        case "06":
                            return "總案"
                        default:
                            return "UNKNOWN"
                    }
                },
                getManager: function (project) {

                }
            }
        })
    ;


    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    }

})();
