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
                findUserByUserDID: function (formData) {
                    return http.post('/api/userFindByuserDID', formData);
                },
                updatePassword: function (formData) {
                    return http.post('/api/userChangePasswordByuserDID', formData);
                },
                updateUserProfile: function (formData) {
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
        .factory('HolidayDataForms', ['$http', function (http) {
            return {
                createForms: function (formData) {
                    return http.post('/api/createHolidayDataForm', formData)
                },
                findFormByUserDID: function (formData) {
                    return http.post('/api/findHolidayDataFormByUserDID', formData)
                },
                updateFormByFormDID: function (formData) {
                    return http.post('/api/updateHolidayDataFormByFormDID', formData)
                }
            }
        }])
        .factory('WorkHourUtil', ['$http', function (http) {
            return {
                createWorkHourTableForm: function (formData) {
                    return http.post('/api/createWorkHourTableForm', formData);
                },
                getWorkHourForm: function (formData) {
                    return http.post('/api/getWorkHourForm', formData);
                },
                findWorkHourTableFormByTableIDArray: function (formData) {
                    return http.post('/api/post_work_hour_table_find_by_tableid_array', formData);
                },
                updateTableSendReview: function (formData) {
                    return http.post('/api/updateWorkHourTableFormSendReview', formData);
                },
                updateWHTable: function(formData) {
                    return http.post('/api/post_work_hour_table_update', formData);
                },
            }
        }])
        .factory('WorkOffFormUtil', ['$http', function (http) {
            return {
                createWrokOffTableForm: function (formData) {
                    return http.post('/api/createWorkOffTableForm', formData);
                },
                getWorkOffForm: function (formData) {
                    return http.post('/api/getWorkOffForm', formData);
                },
                findWorkOffTableFormByTableIDArray: function (formData) {
                    return http.post('/api/findWorkOffTableFormByTableIDArray', formData);
                },
                updateWorkOffTableSendReview: function (formData) {
                    return http.post('/api/updateWorkOffTableFormSendReview', formData);
                },
                updateExecutiveAgree: function(formData) {
                    return http.post('/api/post_work_off_table_update_executive_agree', formData);
                },
                updateBossAgree: function(formData) {
                    return http.post('/api/post_work_off_table_update_boss_agree', formData);
                },
                updateDisAgree: function(formData) {
                    return http.post('/api/post_work_off_table_update_disagree', formData);
                },
                findWorkOffTableItemByUserDID_executive: function (formData) {
                    return http.post('/api/post_work_off_table_item_find_by_user_did_executive', formData);
                },
                findWorkOffTableItemByUserDID_boss: function (formData) {
                    return http.post('/api/post_work_off_table_item_find_by_user_did_boss', formData);
                },
                fetchAllExecutiveItem: function (formData) {
                    return http.post('/api/post_work_off_table_fetch_all_executive', formData);
                },
                fetchAllBossItem: function (formData) {
                    return http.post('/api/post_work_off_table_fetch_all_boss', formData);
                },
            }
        }])
        .factory('WorkHourAddItemUtil', ['$http', function (http) {
            return {
                createWorkHourAddItem: function (formData) {
                    return http.post('/api/post_work_hour_work_add_create_item', formData);
                },
                getWorkHourAddItems: function (formData) {
                    return http.post('/api/post_work_hour_work_add_get_items', formData);
                },
                removeRelatedAddItemByProject: function (formData) {
                    return http.post('/api/post_work_hour_work_remove_related_work_add_items', formData);
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
                },
                getDay: function (day) {
                    switch (day) {
                        case 0:
                            return "日";
                        case 1:
                            return "一";
                        case 2:
                            return "二"
                        case 3:
                            return "三"
                        case 4:
                            return "四"
                        case 5:
                            return "五"
                        case 6:
                            return "六"
                    }
                }
            }
        })
        .factory('WorkOffTypeUtil', ['$http', function (http) {
            return {
                getWorkOffString: function (type) {
                    switch (type) {
                        case 0:
                            return "事假";
                        case 1:
                            return "病假";
                        case 2:
                            return "補休";
                        case 3:
                            return "特休";
                    }
                }
            }
        }])
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
