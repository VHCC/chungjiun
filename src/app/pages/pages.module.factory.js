/**
 * @author Ichen.chu
 * created on 07.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.factory', [])
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
                },
                findUserByUserDID : function (formData) {
                    return http.post('/api/userFindByuserDID', formData);
                },
                updatePassword : function (formData) {
                    return http.post('/api/userChangePasswordByuserDID', formData);
                },
                updateUserProfile : function (formData) {
                    return http.post('/api/userUpdateProfile', formData);
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
                findPrjByID: function (prjID) {
                    return http.get('/api/projectFindByPrjID', prjID);
                },
                findPrjByName: function (prjName) {
                    return http.post('/api/projectFindByName', prjName);
                },
                findPrjDistinctByName: function () {
                    return http.get('/api/projectFindByNameDistinct');
                },
                findPrjFootNumber: function (projectData) {
                    return http.post('/api/projectFootCode', projectData);
                },

                findPrjByIDArray: function (prjIDData) {
                    return http.post('/api/projectFindByPrjIDArray', prjIDData);
                },
            }
        }])
        .factory('Todos', ['$http', function (http) {
            return {
                get: function () {
                    return http.get('/api/todos');
                },
                create: function (todoData) {
                    return http.post('/api/todos', todoData);
                },
                delete: function (id) {
                    return http.delete('/api/todos/' + id);
                },
                deleteTest: function () {
                    return http.post('/api/todos/test');
                },
                createMyTodo: function (todoData) {
                    return http.post('/api/createTodo', todoData);
                },
                findMyTodos: function (userData) {
                    return http.post('/api/findMyAllTodos', userData);
                },
                checkMySpecificTodo: function (todoData) {
                    return http.post('/api/checkMySpecificTodo', todoData);
                },
                removeMySpecificTodo: function (todoData) {
                    return http.post('/api/removeMySpecificTodo', todoData);
                }
            }
        }])
        .factory('PaymentForms', ['$http', function (http) {
            return {
                createForms: function (formData) {
                    return http.post('/api/createPaymentForm', formData);
                }
            }
        }])
        .factory('WorkHourUtil', ['$http', function (http) {
            return {
                createWorkHourTableForm: function (formData) {
                    return http.post('/api/createWorkHourTableForm', formData);
                },
                getWorkHourForm : function (formData) {
                    return http.post('/api/getWorkHourForm', formData);
                },
                findWorkHourTableFormByTableIDArray : function (formData) {
                    return http.post('/api/findWorkHourTableFormByTableIDArray', formData);
                },
                updateTableSendReview : function (formData) {
                    return http.post('/api/updateWorkHourTableFormSendReview', formData);
                }
            }
        }])
        .factory('ProjectUtil', function () {
            return {
                getTypeText: function (type) {
                    switch (type) {
                        case "0":
                            return "規劃";
                        case "1":
                            return "設計";
                        case "2":
                            return "監造"
                        case "3":
                            return "服務"
                        case "4":
                            return "行政"
                        case "5":
                            return "投標"
                        case "6":
                            return "總案"
                        case "7":
                            return "其他"
                        default:
                            return "UNKNOWN"
                    }
                },
                getManager: function (project) {

                }
            }
        })
        .factory('DateUtil', function () {
            return {
                getFirstDayofThisWeek: function (today) {
                    var offset = (1 - today.day()) === 1 ? -6 : 1 - today.day();
                    var firstDay = moment(today).add(offset, 'days');
                    return firstDay.format('YYYY/MM/DD');
                },
                formatDate: function (date) {
                    var d = new Date(date),
                        month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear();

                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;
                    return [month, day].join('/');
                    // return [year, month, day].join('-');
                },
                getShiftDatefromFirstDate: function (firstDate, offset) {
                    var firstDay = moment(firstDate).add(offset, 'days');
                    return firstDay.format('YYYY/MM/DD');
                }
            }
        })
        .factory('UserEditUtil', ['$http', function (http) {
            return {
                uploadAvatarImage: function (uploadData) {
                    return http.post('/api/uploadUserAvatar', uploadData, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function () {
                        console.log("success!!");
                    }).error(function () {
                        console.log("error!!");
                    });
                }
            }
        }])
    ;


    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    }

})();
