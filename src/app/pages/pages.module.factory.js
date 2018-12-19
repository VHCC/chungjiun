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
                findAllEnable: function () {
                    return http.get('/api/projectFindAllEnable');
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
                findPrjByCode: function (prjCode) {
                    return http.post('/api/post_project_find_by_code', prjCode);
                },
                findPrjDistinctByCode: function () { // 以總案代碼為區隔，尋找總案數
                    return http.get('/api/projectFindByCodeDistinct');
                },
                findPrjNumberDistinctByPrjNumber: function (formData) { // 以專案代碼為區隔，尋找專案數
                    return http.post('/api/post_project_number_find_by_prj_number_distinct', formData);
                },
                findPrjSubNumberDistinctByNumber: function (formData) { // 以子案代碼為區隔，尋找子案數
                    return http.post('/api/post_project_sub_number_find_by_number_distinct', formData);
                },
                findPrjFootNumber: function (projectData) {
                    return http.post('/api/projectFootCode', projectData);
                },
                findPrjByIDArray: function (prjIDData) {
                    return http.post('/api/projectFindByPrjIDArray', prjIDData);
                },
                findPrjNumberByCodeGroupByNumber: function (formData) { // 用總案代碼找專案
                    return http.post('/api/post_project_number_find_by_code_group_by_number', formData);
                },
                findPrjSubNumberByNumber: function (formData) { // 用專案找子案
                    return http.post('/api/post_project_sub_number_find_by_number', formData);
                },
                findPrjTypeBySubNumber: function (formData) { // 用子案找類型
                    return http.post('/api/post_project_type_find_by_sub_number', formData);
                },

                // 工時表，經理審查
                getProjectRelatedToManager: function(formData) {
                    return http.post('/api/post_project_all_related_to_manager', formData);
                },

                //ListProject
                getProjectRelated: function(formData) {
                    return http.post('/api/post_project_all_related_to_user', formData);
                },
                updateMajorID: function(formData) {
                    return http.post('/api/post_project_update_major_id', formData);
                },
                updateWorkers: function(formData) {
                    return http.post('/api/post_project_update_workers', formData);
                },
                updateStatus: function(formData) {
                    return http.post('/api/post_project_update_status', formData);
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
                // 多組
                getWorkHourFormMultiple: function(formData) {
                    return http.post('/api/post_work_hour_multiple_get', formData);
                },
                getWorkHourFormForManager: function (formData) {
                    return http.post('/api/post_work_hour_get_for_manager', formData);
                },
                findWorkHourTableFormByTableIDArray: function (formData) {
                    return http.post('/api/post_work_hour_table_find_by_tableid_array', formData);
                },
                // update one
                updateTableSendReview: function (formData) {
                    return http.post('/api/updateWorkHourTableFormSendReview', formData);
                },
                // update all
                updateTotalTableSendReview: function (formData) {
                    return http.post('/api/post_work_hour_table_total_update_send_review', formData);
                },
                updateWHTable: function(formData) {
                    return http.post('/api/post_work_hour_table_update', formData);
                },
            }
        }])
        .factory('WorkOffFormUtil', ['$http', function (http) {
            return {
                // Create form
                createWorkOffTableForm: function (formData) {
                    return http.post('/api/createWorkOffTableForm', formData);
                },
                // get form default
                fetchUserWorkOffForm: function (formData) {
                    return http.post('/api/fetchUserWorkOffForm', formData);
                },
                findWorkOffTableItemByUserDID_executive: function (formData) {
                    return http.post('/api/post_work_off_table_item_find_by_user_did_executive', formData);
                },
                findWorkOffTableItemByUserDID_boss: function (formData) {
                    return http.post('/api/post_work_off_table_item_find_by_user_did_boss', formData);
                },

                findWorkOffTableFormByTableIDArray: function (formData) {
                    return http.post('/api/findWorkOffTableFormByTableIDArray', formData);
                },
                /**
                                         * @Deprecated
                                         */
                updateWorkOffTableSendReview: function (formData) {
                    return http.post('/api/updateWorkOffTableFormSendReview', formData);
                },
                /**
                                         * @Deprecated
                                         */
                updateExecutiveAgree: function(formData) {
                    return http.post('/api/post_work_off_table_update_executive_agree', formData);
                },
                /**
                                         * @Deprecated
                                         */
                updateBossAgree: function(formData) {
                    return http.post('/api/post_work_off_table_update_boss_agree', formData);
                },
                /**
                                         * @Deprecated
                                         */
                updateDisAgree: function(formData) {
                    return http.post('/api/post_work_off_table_update_disagree', formData);
                },

                // ***** workOff Item Update *****
                updateWorkOffItem: function(formData) {
                    return http.post('/api/post_work_off_table_update', formData);
                },
                //get the count for executive check
                fetchAllExecutiveItem: function (formData) {
                    return http.post('/api/post_work_off_table_fetch_all_executive', formData);
                },
                //get the count for boss check
                fetchAllBossItem: function (formData) {
                    return http.post('/api/post_work_off_table_fetch_all_boss', formData);
                },

                // find specify create form date
                findWorkOffTableFormByTableIDArrayAndParameters: function (formData) {
                    return http.post('/api/post_work_off_table_find_by_table_id_array_and_parameters', formData);
                },
            }
        }])
        .factory('NationalHolidayUtil', ['$http', function (http) {
            return {
                createNationalHoliday: function (formData) {
                    return http.post('/api/post_national_holiday_data_form_create', formData);
                },
                fetchAllNationalHolidays: function (formData) {
                    return http.post('/api/post_national_holiday_data_form_fetch_all', formData);
                },
                updateNationalHoliday: function (formData) {
                    return http.post('/api/post_national_holiday_data_form_update', formData);
                },
                removeNationalHoliday: function (formData) {
                    return http.post('/api/post_national_holiday_data_form_remove', formData);
                },
                fetchAllNationalHolidaysWithParameter: function (formData) {
                    return http.post('/api/post_national_holiday_data_form_fetch_with_parameters', formData);
                },
            }
        }])
        .factory('OverTimeDayUtil', ['$http', function (http) {
            return {
                createOverTimeDay: function (formData) {
                    return http.post('/api/post_over_time_day_data_form_create', formData);
                },
                fetchAllOverTimeDays: function (formData) {
                    return http.post('/api/post_over_time_day_data_form_fetch_all', formData);
                },
                updateOverTimeDay: function (formData) {
                    return http.post('/api/post_over_time_day_data_form_update', formData);
                },
                removeOverTimeDay: function (formData) {
                    return http.post('/api/post_over_time_day_data_form_remove', formData);
                },
                fetchAllOverTimeDaysWithParameter: function (formData) {
                    return http.post('/api/post_over_time_day_data_form_fetch_with_parameters', formData);
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
                },
                executiveConfirm: function (formData) {
                    return http.post('/api/post_work_hour_work_executive_confirm', formData);
                },
                updateRelatedAddItemByProject: function (formData) {
                    return http.post('/api/post_work_hour_work_update_related_work_add_items', formData);
                },
            }
        }])
        .factory('WorkAddConfirmFormUtil', ['$http', function (http) {
            return {
                createWorkAddConfirmForm: function (formData) {
                    return http.post('/api/post_create_work_add_confirm_form', formData);
                },
                fetchWorkAddConfirmFormByUserDID: function (formData) {
                    return http.post('/api/post_fetch_work_add_confirm_form_by_user_id', formData);
                }
            }
        }])
        .factory('HrMachineUtil', ['$http', function (http) {
            return {
                fetchUserHrMachineDataByMachineDID: function (formData) {
                    return http.post('/api/post_fetch_hrmachine_data_by_machine_did', formData);
                },
                fetchUserHrMachineDataOneDayByMachineDID: function (formData) {
                    return http.post('/api/post_fetch_hrmachine_data_one_day_by_machine_did', formData);
                },
                loadHrMachineDataByDate: function (formData) {
                    return http.post('/api/post_load_hrmachine_data_by_date', formData);
                },
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
                            return "規劃"
                        case "4":
                            return "服務"
                        case "5":
                            return "總案"
                        case "6":
                            return "專案管理"
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
                        case 7:
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
        .factory('TimeUtil', ['$http', function (http) {
            return {
                toSeconds: function (time_str) {
                    // Extract hours, minutes and seconds
                    var parts = time_str.split(':');
                    // compute  and return total seconds
                    return parts[0] * 3600 +  // an hour has 3600 seconds
                        parts[1] * 60         // a minute has 60 seconds
                    // +parts[2];         // seconds
                },
                // 加班累積規則
                getCalculateHourDiffByTime: function (start, end) {
                    if (start && end) {
                        var difference = Math.abs(this.toSeconds(start) - this.toSeconds(end));
                        // compute hours, minutes and seconds
                        var result = [
                            Math.floor(difference / 60), // MINS
                        ];
                        return result;
                    }
                },
                getHour: function (timeFormatted) {
                    // Extract hours, minutes and seconds
                    var parts = timeFormatted.split(':');
                    // compute  and return total seconds
                    return parts[0]
                }


            }
        }])
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
                        case 4:
                            return "婚假";
                        case 5:
                            return "喪假";
                        case 6:
                            return "公假";
                        case 7:
                            return "公傷假";
                        case 8:
                            return "產假";
                        case 9:
                            return "陪產假";
                        case 1001:
                            return "特殊假";
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
        .factory('NotificationUtil', ['$http', function (http) {
            return {
                showMsg: function (title, msg, level) {
                    var iconPath = "";
                    var tagLevel = "";
                    switch (level) {
                        case 1:
                            iconPath = '/assets/img/Custom-Icon-Design-Pretty-Office-2-Success.ico'; // 設定 icon
                            tagLevel = "info";
                            break;
                        case 2:
                            iconPath = '/assets/img/Paomedia-Small-N-Flat-Sign-warning.ico'; // 設定 icon
                            tagLevel = "notice";
                            break;
                        case 3:
                            break;
                    }

                    var notifyConfig = {
                        body: msg, // 設定內容
                        icon: iconPath, // 設定 icon
                        tag: tagLevel // 設定標籤
                    };

                    if (Notification.permission === 'default' || Notification.permission === 'undefined') {
                        Notification.requestPermission(function (permission) {
                            // permission 可為「granted」（同意）、「denied」（拒絕）和「default」（未授權）
                            // 在這裡可針對使用者的授權做處理
                            if (permission === 'granted') { // 使用者同意授權
                                new Notification(title, notifyConfig); // 建立通知
                            }
                        });
                    } else {
                        new Notification(title, notifyConfig); // 建立通知
                    }
                }
            }
        }])
    ;


    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    }

})();
