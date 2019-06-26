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
                getAllUsersWithSignOut: function () {
                    return http.get('/api/getAllUsersWithSignOut');
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
                },

                setUserResidualRestHour: function (formData) {
                    return http.post('/api/setUserResidualRestHour', formData)
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
                updateMainName: function(formData) {
                    return http.post('/api/post_project_update_main_name', formData);
                },
                updatePrjName: function(formData) {
                    return http.post('/api/post_project_update_prj_name', formData);
                },
                updatePrjSubName: function(formData) {
                    return http.post('/api/post_project_update_prj_sub_name', formData);
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
                updateWHTable: function(formData) { // 單筆
                    return http.post('/api/post_work_hour_table_update', formData);
                },
                updateWHTableArray: function(formData) { // 一鍵完成
                    return http.post('/api/post_work_hour_table_update_array', formData);
                },

                // management
                insertWorkHourTempsData: function (formData) {
                    return http.post('/api/insert_work_hour_table_temp', formData);
                },

                fetchWorkHourFormManagementList: function (formData) {
                    return http.post('/api/get_work_hour_table_management_list', formData);
                },

                // statistics
                queryStatisticsForms: function (formData) {
                    return http.post('/api/query_statistics_form', formData);
                },

                queryStatisticsTables: function (formData) {
                    return http.post('/api/query_statistics_tables', formData);
                }
            }
        }])
        .factory('WorkOffFormUtil', ['$http', function (http) {
            return {
                // Create form
                createWorkOffTableForm: function (formData) {
                    return http.post('/api/createWorkOffTableForm', formData);
                },
                // Insert Work Off Item 20190515
                insertWorkOffTableItem: function (formData) {
                    return http.post('/api/post_work_off_table_insert_item', formData);
                },
                removeWorkOffTableItem: function (formData) {
                    return http.post('/api/post_work_off_table_remove_item', formData);
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

                //@Deprecated
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

                // find specify user did form date
                findWorkOffTableFormByUserDID: function (formData) {
                    return http.post('/api/post_work_off_table_find_by_user_did', formData);
                },
            }
        }])
        .factory('WorkOffExchangeFormUtil', ['$http', function (http) {
            return {
                // insert new Exchange item
                insertWorkOffExchangeTableForm: function (formData) {
                    return http.post('/api/post_work_off_exchange_table_insert_item', formData);
                },
                findWorkOffExchangeTableFormByUserDID: function (formData) {
                    return http.post('/api/post_work_off_exchange_table_find_by_creatorDID', formData);
                },
                removeWorkOffExchangeTableFormByItemID: function (formData) {
                    return http.post('/api/post_work_off_exchange_table_remove_by_itemID', formData);
                },
                // ***** workOffExchange Item Update *****
                updateWorkOffExchangeItem: function(formData) {
                    return http.post('/api/post_work_off_exchange_table_update', formData);
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
                updateItem: function (formData) {
                    return http.post('/api/post_work_hour_work_add_item_update', formData);
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
                        // 1.設計
                        // 2.監造
                        // 3.規劃
                        // 4.專管
                        // 5.總案
                        // 6.服務
                        // 7.行政
                        // 8.投標
                        // 9.其他

                        // case "0":
                        //     return "規劃";
                        case "1":
                            return "設計";
                        case "2":
                            return "監造"
                        case "3":
                            return "規劃"
                        case "4":
                            return "專管"
                        case "5":
                            return "總案"
                        case "6":
                            return "服務"
                        case "7":
                            return "行政"
                        case "8":
                            return "投標"
                        case "9":
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
                            return "事假"; // Hour
                        case 1:
                            return "病假"; // Hour
                        case 2:
                            return "補休"; // Hour
                        case 3:
                            return "特休"; // Day
                        case 4:
                            return "婚假"; // Day
                        case 5:
                            return "喪假"; // Day
                        case 6:
                            return "公假"; // Hour
                        case 7:
                            return "公傷假"; // Day
                        case 8:
                            return "產假"; // Day
                        case 9:
                            return "陪產假"; // Day
                        case 1001:
                            return "其他"; // Hour as 公假 20190208
                        case -1:
                            return "[假別沒選擇]"
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
        .factory('VhcMigrateUtil', ['$http', function (http) {
            return {
                connectDB: function (formData) {
                    return http.post('/api/connect_db', formData);
                }
            }
        }])
        .factory('VhcMemberUtil', ['$http', function (http) {
            return {
                findAllMembers: function () {
                    return http.get('/api/get_vhc_member_all');
                },

                findIfExistNumber: function (formData) {
                    return http.post('/api/post_vhc_member_find_exist_number', formData);
                },

                updateVhcMember: function (formData) {
                    return http.post('/api/post_vhc_member_update', formData);
                },

                createVhcMember: function (formData) {
                    return http.post('/api/post_vhc_member_create', formData);
                }


            }
        }])
        .factory('VhcOldRxUtil', ['$http', function (http) {
            return {
                findOldRxByMemberNumber: function(formData) {
                    return http.post('/api/post_vhc_member_old_rx_by_number', formData);
                },

                updateOldRxByMemberNumber: function (formData) {
                    return http.post('/api/post_vhc_member_old_rx_update', formData);
                },

            }
        }])
    ;


    /** @ngInject */
    function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    }

})();
