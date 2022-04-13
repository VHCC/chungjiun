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
                getAllUsers: function () { // can sign in
                    return http.get('/api/getAllUsers');
                },
                getAllResignUsers: function () { // can sign in
                    return http.get('/api/get_all_resign_users');
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
                    return http.post('/api/setUserResidualRestHour', formData);
                },

                updateUserBefore108Kpi: function (formData) {
                    return http.post('/api/post_user_info_update_before_108_kpi', formData);
                }
            }
        }])
        .factory('Project', ['$http', function (http) {
            return {
                fetchGroupList: function (projectData) {
                    return http.post('/api/post_project_find_group_list', projectData);
                },

                fetchRelatedCombinedPrjArray: function(projectData) {
                    return http.post('/api/post_project_find_related_combined_array', projectData);
                },

                // 找總案
                findAllByGroup: function () {
                    return http.get('/api/projectFindAllByGroup');
                },
                findAll: function () {
                    return http.get('/api/projectFindAll');
                },
                findAllEnable: function () {
                    return http.get('/api/projectFindAllEnable');
                },
                findAllProjectClosed: function () {
                    return http.get('/api/projectFindAllClosed');
                },
                create: function (projectData) {
                    return http.post('/api/projectCreate', projectData);
                },

                // 專案轉換
                transferProject : function (projectData) {
                    return http.post('/api/projectTransfer', projectData);
                },
                // 專案合併
                combineProject : function (projectData) {
                    return http.post('/api/projectCombine', projectData);
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
                updateManagerID: function(formData) {
                    return http.post('/api/post_project_update_manager_id', formData);
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

                findByRequest: function (formData) {
                    return http.post('/api/post_project_find_by_request', formData);
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
        .factory('OfficialDocUtil', ['$http', function (http) {
            return {
                // 電子檔 pdf
                uploadOfficialDocFile: function (uploadData) {
                    return http.post('/api/post_official_doc_upload_file', uploadData, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function () {
                        console.log("success!!");
                    }).error(function () {
                        console.log("error!!");
                    });
                },

                deleteOfficialDocFile : function (formData) {
                    return http.post('/api/post_official_doc_delete_file', formData);
                },

                // Deprecated
                detectOfficialDocFiles : function (formData) {
                    return http.post('/api/post_official_doc_detect_file', formData);
                },

                fetchOfficialDocFiles : function (formData) {
                    return http.post('/api/post_official_doc_fetch_file', formData);
                },

                getOfficialDocFile : function (formData) {
                    return http.post('/api/post_official_doc_get_file', formData);
                },

                downloadOfficialDocFile : function (formData) {
                    return http.post('/api/post_official_doc_download_file', formData);
                },

                createPDFFolder : function (formData) {
                  return http.post('/api/post_official_doc_rename_and_folder', formData);
                },

                renamePublicFolder: function (formData) {
                    return http.post('/api/post_official_doc_rename_and_folder_public', formData);
                },

                generateReceiveNumber : function(formData) {
                    return http.post('/api/post_official_doc_create_item_archive_number', formData);
                },

                // 發文
                // cache
                uploadOfficialDocFile_public: function (uploadData) {
                    return http.post('/api/post_official_doc_upload_file_public', uploadData, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function () {
                        console.log("success!!");
                    }).error(function () {
                        console.log("error!!");
                    });
                },

                // fs
                uploadOfficialDocFile_public_fs: function (uploadData) {
                    return http.post('/api/post_official_doc_upload_file_public_fs', uploadData, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function () {
                        console.log("success!!");
                    }).error(function () {
                        console.log("error!!");
                    });
                },

                deleteOfficialDocFile_public : function (formData) {
                    return http.post('/api/post_official_doc_delete_file_public', formData);
                },

                deleteOfficialDocFile_public_fs : function (formData) {
                    return http.post('/api/post_official_doc_delete_file_public_from_fs', formData);
                },

                updateOfficialDocItem_public: function (formData) {
                    return http.post('/api/post_official_doc_update_item_public', formData);
                },

                deleteOfficialDocItem_public: function (formData) {
                    return http.post('/api/post_official_doc_delete_item_public', formData);
                },

                createOfficialDocItem_public_temp : function (formData) {
                    return http.post('/api/post_official_doc_create_item_public_temp', formData);
                },

                createOfficialDocItem_public : function (formData) {
                    return http.post('/api/post_official_doc_create_item_public', formData);
                },

                fetchOfficialDocFiles_public : function (formData) {
                    return http.post('/api/post_official_doc_fetch_file_public', formData);
                },

                getOfficialDocFile_public : function (formData) {
                    return http.post('/api/post_official_doc_get_file_public', formData);
                },

                downloadOfficialDocFile_public : function (formData) {
                    return http.post('/api/post_official_doc_download_file_public', formData);
                },

                fetchOfficialDocItemPeriod_public : function (formData) {
                    return http.post('/api/post_official_doc_fetch_item_period_public', formData);
                },

                generatePublicNumber_public : function(formData) {
                    return http.post('/api/post_official_doc_create_item_archive_number_public', formData);
                },

                // ----- Doc Item ----
                createOfficialDocItem : function (formData) {
                    return http.post('/api/post_official_doc_create_item', formData);
                },

                fetchOfficialDocAllItem : function (formData) {
                    return http.get('/api/get_official_doc_fetch_all_item');
                },

                fetchOfficialDocItemPeriod : function (formData) {
                    return http.post('/api/post_official_doc_fetch_item_period', formData);
                },

                searchOfficialDocItem : function (formData) {
                    return http.post('/api/post_official_doc_search_item', formData);
                },

                searchOfficialDocItemByManagerID : function (formData) {
                    return http.post('/api/post_official_doc_search_item_by_managerID', formData);
                },

                updateOfficialDocItem: function (formData) {
                    return http.post('/api/post_official_doc_update_item', formData);
                },

                deleteOfficialDocItem: function (formData) {
                    return http.post('/api/post_official_doc_delete_item', formData);
                },


                // Util
                getDocType: function (type) {
                    switch (type) {
                        case 0:
                            return "函";
                        case 1:
                            return "會勘";
                        case 2:
                            return "開會";
                        case 3:
                            return "書函";
                        case 4:
                            return "紀錄"
                    }
                },

                getDocAttachedType: function (type) {
                    switch (type) {
                        case 0:
                            return "無";
                        case 1:
                            return "電子";
                        case 2:
                            return "紙本";
                    }
                },

                getDocPublicType: function (type) {
                    switch (type) {
                        case 0:
                            return "電子";
                        case 1:
                            return "紙本";
                        case 2:
                            return "紙本";
                        case 3:
                            return "親自";
                    }
                },

                getDivision: function (type) {
                    switch (type) {
                        case 0:
                            return "F";
                        case 1:
                            return "N";
                        case 2:
                            return "G";
                        case 3:
                            return "D";
                        case 4:
                            return "P"
                    }
                },

                getDivisionNumber: function (word) {
                    switch(word) {
                        case "F":
                            return 0;
                        case "N":
                            return 1;
                        case "G":
                            return 2;
                        case "D":
                            return 3;
                        case "P":
                            return 4;
                        default:
                            return -1;
                    }
                }
            }
        }])
        .factory('OfficialDocNotifyUtil', ['$http', function (http) {
            return {
                fetchOfficialDocNotify: function (formData) {
                    return http.post('/api/fetch_official_doc_notify', formData);
                },

                createOfficialDocNotify: function (formData) {
                    return http.post('/api/post_insert_official_doc_notify', formData);
                },

                updateOfficialDocNotify: function (formData) {
                    return http.post('/api/post_update_official_doc_notify', formData);
                },

            }
        }])
        .factory('OfficialDocVendorUtil', ['$http', function (http) {
            return {
                fetchOfficialDocVendor: function () {
                    return http.get('/api/get_fetch_official_doc_vendor');
                },

                createOfficialDocVendor: function (formData) {
                    return http.post('/api/post_insert_official_doc_vendor', formData);
                },

                updateOfficialDocVendor: function (formData) {
                    return http.post('/api/post_update_official_doc_vendor', formData);
                },

                removeOfficialDocVendor: function (formData) {
                    return http.post('/api/post_remove_official_doc_vendor', formData);
                },
            }
        }])
        .factory('WageManageUtil', ['$http', function (http) {
            return {
                fetchUserWageMain: function (formData) {
                    return http.post('/api/post_wage_manage_fetch_item', formData)
                },

                createUserWageMain: function (formData) {
                    return http.post('/api/post_wage_manage_create_item', formData)
                },

                updateUserWageMain: function (formData) {
                    return http.post('/api/post_wage_manage_update_item', formData)
                },
            }
        }])
        .factory('KpiUtil', ['$http', function (http) {
            return {

                insertKPIElement: function(formData) {
                    return http.post('/api/post_get_kpi_elements_insert', formData);
                },
                updateKPIElement: function(formData) {
                    return http.post('/api/post_get_kpi_elements_update', formData);
                },
                deleteKPIElement: function(formData) {
                    return http.post('/api/post_get_kpi_elements_delete', formData);
                },

                findKPIElement : function(formData) {
                    return http.post('/api/post_get_kpi_elements_by_year', formData);
                },

                // 個人績效
                findKPIPersonElement : function(formData) {
                    return http.post('/api/post_get_kpi_person_elements_by_year', formData);
                },
                // 個人全部
                findKPIPersonElementAll : function(formData) {
                    return http.post('/api/post_get_kpi_person_elements_all', formData);
                },

                // Setting
                findKPIPersonQuerySetting : function(formData) {
                    return http.post('/api/post_find_kpi_person_setting', formData);
                },

                insertKPIPersonQuerySetting : function(formData) {
                    return http.post('/api/post_insert_kpi_person_setting', formData);
                },

                updateKPIPersonQuerySetting : function(formData) {
                    return http.post('/api/post_update_kpi_person_setting', formData);
                },

                insertKPIPersonElement: function(formData) {
                    return http.post('/api/post_kpi_person_elements_insert', formData);
                },

                findKPIYear : function (formData) {
                    return http.post('/api/post_get_kpi_financial_results_by_year', formData);
                },

                // including
                // ProjectIncomeUtil
                // PaymentFormsUtil
                // ExecutiveExpenditureUtil
                // SubContractorPayItemUtil
                fetchKpiItemsByPrjDIDArray: function (formData) {
                    return http.post('/api/post_get_kpi_elements_by_prjdid_array', formData);
                },

                // 年終獎金
                findKPIBonus: function(formData) {
                    return http.post('/api/post_get_kpi_bonus_find', formData);
                },
                insertKPIBonus: function(formData) {
                    return http.post('/api/post_get_kpi_bonus_insert', formData);
                },
                updateKPIBonus: function(formData) {
                    return http.post('/api/post_get_kpi_bonus_update', formData);
                },
            }
        }])
        .factory('PaymentFormsUtil', ['$http', function (http) {
            return {
                // createForms: function (formData) {
                //     return http.post('/api/createPaymentForm', formData);
                // }
                insertPaymentItem: function (formData) {
                    return http.post('/api/post_payment_insert_item', formData);
                },

                removePaymentItem: function (formData) {
                    return http.post('/api/post_payment_remove_item', formData);
                },

                fetchPaymentItems: function (formData) {
                    return http.post('/api/post_payment_fetch_items', formData);
                },

                fetchPaymentItemsSearchMonthly: function (formData) {
                    return http.post('/api/post_payment_fetch_items_monthly_search', formData);
                },

                createPaymentForm: function (formData) {
                    return http.post('/api/post_payment_create_form', formData);
                },

                updatePaymentItems: function (formData) {
                    return http.post('/api/post_payment_items_update', formData);
                },

                updatePaymentItemByID: function (formData) {
                    return http.post('/api/post_payment_items_update_by_id', formData);
                },

                // 多組
                getPaymentsMultiple: function(formData) {
                    return http.post('/api/post_payment_multiple_get', formData);
                },

                fetchPaymentsItemByPrjDID: function (formData) {
                    return http.post('/api/post_payment_fetch_items_by_prjdid', formData);
                },

                fetchPaymentsItemByPrjDIDArray: function (formData) {
                    return http.post('/api/post_payment_fetch_items_by_prjdid_array', formData);
                },
            }
        }])
        .factory('GlobalConfigUtil', ['$http', function (http) {
            return {

                insertConfig: function(formData) {
                    return http.post('/api/post_global_configs_insert', formData)
                },

                getConfig: function (formData) {
                    return http.post('/api/fetch_global_configs', formData)
                },

                updateConfig : function (formData) {
                    return http.post('/api/post_global_configs_update', formData)
                },
            }
        }])
        .factory('ProjectFinancialRateUtil', ['$http', function (http) {
            return {
                insertFinancialRate: function(formData) {
                    return http.post('/api/post_project_financial_rate_insert', formData)
                },
                getFinancialRate: function (formData) {
                    return http.post('/api/post_project_financial_rate_get', formData)
                },
                updateFinancialRate : function (formData) {
                    return http.post('/api/post_project_financial_rate_update', formData)
                },
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
        .factory('ProjectIncomeUtil', ['$http', function (http) {
            return {
                createIncome: function (formData) {
                    return http.post('/api/post_project_income_create', formData)
                },
                findIncome: function (formData) {
                    return http.post('/api/post_project_income_find', formData)
                },
                findIncomeByPrjDIDArray: function (formData) {
                    return http.post('/api/post_project_income_find_by_prjdid_array', formData)
                },
                updateIncome: function (formData) {
                    return http.post('/api/post_project_income_update', formData)
                },
                removeIncome: function (formData) {
                    return http.post('/api/post_project_income_remove', formData)
                }
            }
        }])
        .factory('ProjectFinancialResultUtil', ['$http', function (http) {
            return {
                createFR: function (formData) {
                    return http.post('/api/post_project_financial_result_create', formData)
                },
                findFR: function (formData) {
                    return http.post('/api/post_project_financial_result_find', formData)
                },
                updateFR: function (formData) {
                    return http.post('/api/post_project_financial_result_update', formData)
                },
                syncAllFRAndProject: function (formData) {
                    return http.post('/api/post_project_financial_result_sync_project', formData)
                },
            }
        }])
        .factory('ProjectFinancialDistributeUtil', ['$http', function (http) {
            return {
                createFD: function (formData) {
                    return http.post('/api/post_project_financial_distribute_create', formData)
                },
                findFD: function (formData) {
                    return http.post('/api/post_project_financial_distribute_find', formData)
                },
                updateFD: function (formData) {
                    return http.post('/api/post_project_financial_distribute_update', formData)
                },
                removeFD: function (formData) {
                    return http.post('/api/post_project_financial_distribute_remove', formData)
                },

                findFDByYear: function (formData) {
                    return http.post('/api/post_project_financial_distribute_find_by_year', formData)
                },

                findFDByUserUUID: function (formData) {
                    return http.post('/api/post_project_financial_distribute_find_by_user_uuid', formData)
                },

            }
        }])
        .factory('KpiTechDistributeUtil', ['$http', function (http) {
            return {
                createTD: function (formData) {
                    return http.post('/api/post_kpi_tech_distribute_create', formData)
                },
                findTD: function (formData) {
                    return http.post('/api/post_kpi_tech_distribute_find', formData)
                },
                updateTD: function (formData) {
                    return http.post('/api/post_kpi_tech_distribute_update', formData)
                },
                removeTD: function (formData) {
                    return http.post('/api/post_kpi_tech_distribute_remove', formData)
                },
            }
        }])
        .factory('WorkHourUtil', ['$http', function (http) {
            return {
                createWorkHourTableForm: function (formData) {
                    return http.post('/api/createWorkHourTableForm', formData);
                },

                removeWorkHourTableForm : function (formData) {
                    return http.post('/api/removeWorkHourTableForm', formData);
                },

                insertWorkHourTableItem : function (formData) {
                    return http.post('/api/post_work_hour_insert_table_item', formData);
                },

                removeWorkHourTableItem: function(formData) {
                    return http.post('/api/post_work_hour_remove_table_item_by_did', formData);
                },

                updateWorkHourForm: function(formData) {
                    return http.post('/api/post_work_hour_form_update', formData);
                },

                createWorkHourForm: function(formData) {
                    return http.post('/api/post_work_hour_create_form', formData);
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

                // statistics CJ
                // Deprecated
                queryStatisticsFormsCJ: function (formData) {
                    return http.post('/api/query_statistics_form_CJ', formData);
                },

                // Deprecated
                queryStatisticsFormsCJ_type1: function (formData) {
                    return http.post('/api/query_statistics_form_CJ_type1', formData);
                },

                queryStatisticsFormsCJ_type2: function (formData) {
                    return http.post('/api/query_statistics_form_CJ_type2', formData);
                },

                // Deprecated
                queryStatisticsFormsCJ_type3: function (formData) {
                    return http.post('/api/query_statistics_form_CJ_type3', formData);
                },

                // Deprecated
                queryStatisticsTables: function (formData) {
                    return http.post('/api/query_statistics_tables', formData);
                },

                // 20200703
                queryEmployeeStatistics: function (formData) {
                    return http.post('/api/query_employee_statistics', formData);
                },

                // 20211117
                queryKPIPersonalWorkHour: function (formData) {
                    return http.post('/api/query_kpi_personal_workhour', formData);
                },

                // project Income Cost
                queryStatisticsForms_projectIncome_Cost: function (formData) {
                    return http.post('/api/queryStatisticsForms_projectIncome_Cost', formData);
                },

                queryStatisticsForms_projectIncome_Cost_ByPrjDIDArray: function (formData) {
                    return http.post('/api/queryStatisticsForms_projectIncome_Cost_byPrjDIDArray', formData);
                },
            }
        }])
        .factory('WorkOffFormUtil', ['$http', function (http) {
            return {
                // Create form
                // Deprecated 20200218
                // createWorkOffTableForm: function (formData) {
                //     return http.post('/api/createWorkOffTableForm', formData);
                // },

                // Insert Work Off Item 20190515
                insertWorkOffTableItem: function (formData) {
                    return http.post('/api/post_work_off_table_insert_item', formData);
                },
                removeWorkOffTableItem: function (formData) {
                    return http.post('/api/post_work_off_table_remove_item', formData);
                },

                // get form default
                // Deprecated 20200218
                // fetchUserWorkOffForm: function (formData) {
                //     return http.post('/api/fetchUserWorkOffForm', formData);
                // },

                //@Deprecated 20200218
                findWorkOffTableItemByUserDID_executive: function (formData) {
                    return http.post('/api/post_work_off_table_item_find_by_user_did_executive', formData);
                },

                //@Deprecated 20200218
                findWorkOffTableItemByUserDID_boss: function (formData) {
                    return http.post('/api/post_work_off_table_item_find_by_user_did_boss', formData);
                },

                // integrated 20200218
                findWorkOffTableItemByParameter: function(formData) {
                    return http.post('/api/post_work_off_table_item_find_by_parameter', formData);
                },

                //@Deprecated
                // findWorkOffTableFormByTableIDArray: function (formData) {
                //     return http.post('/api/findWorkOffTableFormByTableIDArray', formData);
                // },
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
                // @Deprecated no use check 20200219
                findWorkOffTableFormByTableIDArrayAndParameters: function (formData) {
                    return http.post('/api/post_work_off_table_find_by_table_id_array_and_parameters', formData);
                },

                //get the count for agent check
                fetchAllAgentItem: function(formData) {
                    return http.post('/api/post_work_off_table_fetch_all_agent', formData);
                },

                // find specify user did form date
                findWorkOffTableFormByUserDID: function (formData) {
                    return http.post('/api/post_work_off_table_find_by_user_did', formData);
                },

                // update month salary by parameters
                updateWorkOffTableSalary: function (formData) {
                    return http.post('/api/post_work_off_table_update_salary', formData);
                },

                fetchWorkOffPDFFiles : function (formData) {
                    return http.post('/api/post_work_off_pdf_fetch_file', formData);
                },

                // 電子檔 pdf
                uploadWorkOffPDFlFile: function (uploadData) {
                    return http.post('/api/post_work_off_pdf_upload_file', uploadData, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function () {
                        console.log("success!!");
                    }).error(function () {
                        console.log("error!!");
                    });
                },

                getWorkOffPDFFile : function (formData) {
                    return http.post('/api/post_work_off_pdf_get_file', formData);
                },

                downloadWorkOffPDFFile : function (formData) {
                    return http.post('/api/post_work_off_pdf_download_file', formData);
                },

                deleteWorkOffPDFFile : function (formData) {
                    return http.post('/api/post_work_off_pdf_delete_file', formData);
                },

            }
        }])
        .factory('RemedyUtil', ['$http', function (http) {
            return {
                insertRemedyItemToDB: function (formData) {
                    return http.post('/api/post_hr_remedy_insert_item', formData);
                },

                fetchRemedyItemFromDB: function (formData) {
                    return http.post('/api/post_hr_remedy_fetch_items_by_creatorDID', formData);
                },

                fetchRemedyHistoryItemFromDB: function (formData) {
                    return http.post('/api/post_hr_remedy_fetch_history_items_by_creatorDID', formData);
                },

                removeRemedyItemFromDB: function (formData) {
                    return http.post('/api/post_hr_remedy_delete_item', formData);
                },

                updateRemedyItemFromDB: function (formData) {
                    return http.post('/api/post_hr_remedy_update_item', formData);
                },
            }
        }])
        .factory('ExecutiveExpenditureUtil', ['$http', function (http) {
            return {
                insertExecutiveExpenditureItem: function (formData) {
                    return http.post('/api/post_executive_expenditure_insert_item', formData);
                },

                removeExecutiveExpenditureItem: function (formData) {
                    return http.post('/api/post_executive_expenditure_remove_item', formData);
                },

                fetchExecutiveExpenditureItems: function (formData) {
                    return http.post('/api/post_executive_expenditure_fetch_items', formData);
                },

                fetchExecutiveExpenditureItemsByPrjDID: function (formData) {
                    return http.post('/api/post_executive_expenditure_fetch_items_by_prj_did', formData);
                },

                fetchExecutiveExpenditureItemsByPrjDIDArray: function (formData) {
                    return http.post('/api/post_executive_expenditure_fetch_items_by_prj_did_array', formData);
                },

                updateExecutiveExpenditureOne: function (formData) {
                    return http.post('/api/post_executive_expenditure_items_update_one', formData);
                },

                updateExecutiveExpenditureItems: function (formData) {
                    return http.post('/api/post_executive_expenditure_items_update_many', formData);
                },
                fetchExecutiveExpenditureItemByPrjDIDArray: function (formData) {
                    return http.post('/api/post_executive_expenditure_fetch_items_by_prjdid_array', formData);
                },

            }
        }])
        .factory('ExpenditureTargetUtil', ['$http', function (http) {
            return {
                fetchExpenditureTarget: function (formData) {
                    return http.post('/api/post_fetch_expenditure_target', formData);
                },

                fetchAllExpenditureTarget: function (formData) {
                    return http.post('/api/post_fetch_all_expenditure_target', formData);
                },

                createExpenditureTarget: function (formData) {
                    return http.post('/api/post_insert_expenditure_target', formData);
                },

                updateExpenditureTarget: function (formData) {
                    return http.post('/api/post_update_expenditure_target', formData);
                },

                removeExpenditureTarget: function (formData) {
                    return http.post('/api/post_remove_expenditure_target', formData);
                },
            }
        }])
        .factory('SubContractorApplyUtil', ['$http', function (http) {
            return {
                insertSCApplyItem: function (formData) {
                    return http.post('/api/post_sub_contractor_apply_insert_item', formData);
                },

                removeSCApplyItem: function (formData) {
                    return http.post('/api/post_sub_contractor_apply_remove_item', formData);
                },

                fetchSCApplyItems: function (formData) {
                    return http.post('/api/post_sub_contractor_apply_fetch_items', formData);
                },

                updateSCApplyOne: function (formData) {
                    return http.post('/api/post_sub_contractor_apply_items_update_one', formData);
                },

                updateSCApplyItems: function (formData) {
                    return http.post('/api/post_sub_contractor_apply_items_update_many', formData);
                },

                fetchSCApplyPeriods: function (formData) {
                    return http.post('/api/post_sub_contractor_apply_items_fetch_period', formData);
                },

            }
        }])
        .factory('SubContractorVendorUtil', ['$http', function (http) {
            return {
                fetchSCVendorEnabled: function (formData) {
                    return http.post('/api/post_fetch_sub_contractor_vendor_enabled', formData);
                },

                fetchAllSCVendor: function (formData) {
                    return http.post('/api/post_fetch_all_sub_contractor_vendor', formData);
                },

                createSCVendor: function (formData) {
                    return http.post('/api/post_insert_sub_contractor_vendor', formData);
                },

                updateSCVendor: function (formData) {
                    return http.post('/api/post_update_sub_contractor_vendor', formData);
                },

                removeSCVendor: function (formData) {
                    return http.post('/api/post_remove_sub_contractor_vendor', formData);
                },
            }
        }])
        .factory('SubContractorItemUtil', ['$http', function (http) {
            return {
                fetchSCItemEnabled: function (formData) {
                    return http.post('/api/post_fetch_sub_contractor_item_enabled', formData);
                },

                fetchAllSCItem: function (formData) {
                    return http.post('/api/post_fetch_all_sub_contractor_item', formData);
                },

                createSCItem: function (formData) {
                    return http.post('/api/post_insert_sub_contractor_item', formData);
                },

                updateSCItem: function (formData) {
                    return http.post('/api/post_update_sub_contractor_item', formData);
                },

                removeSCItem: function (formData) {
                    return http.post('/api/post_remove_sub_contractor_item', formData);
                },
            }
        }])
        .factory('SubContractorPayItemUtil', ['$http', function (http) {
            return {
                fetchSCPayItems: function (formData) {
                    return http.post('/api/post_fetch_sub_contractor_pay_item', formData);
                },

                fetchSCPayItemsByPrjDIDArray: function (formData) {
                    return http.post('/api/post_fetch_sub_contractor_pay_item_by_prj_did_array', formData);
                },


                createSCPayItem: function (formData) {
                    return http.post('/api/post_insert_sub_contractor_pay_item', formData);
                },

                updateSCPayItem: function (formData) {
                    return http.post('/api/post_update_sub_contractor_pay_item', formData);
                },

                removeSCPayItem: function (formData) {
                    return http.post('/api/post_remove_sub_contractor_pay_item', formData);
                },
            }
        }])
        .factory('SuperVisionNotifyUtil', ['$http', function (http) {
            return {
                insertSVNItemToDB: function (formData) {
                    return http.post('/api/post_supervision_notify_insert_item', formData);
                },

                fetchSVNItemFromDB: function (formData) {
                    return http.post('/api/post_supervision_notify_fetch_by_creatorDID', formData);
                },

                removeSVNItemFromDB: function (formData) {
                    return http.post('/api/post_supervision_notify_delete_item', formData);
                },

                updateSVNItemFromDB: function (formData) {
                    return http.post('/api/post_supervision_notify_update_item', formData);
                },
            }
        }])
        .factory('WorkOverTimeUtil', ['$http', function (http) {
            return {
                insertWOTItemToDB: function (formData) {
                    return http.post('/api/post_work_over_time_insert_item', formData);
                },

                fetchWOTItemFromDB: function (formData) {
                    return http.post('/api/post_work_over_time_fetch_by_creatorDID', formData);
                },

                fetchWOTItemFromDBByCreateFormDate: function (formData) {
                    return http.post('/api/post_work_over_time_fetch_by_creatorDID_create_formdate', formData);
                },

                removeWOTItemFromDB: function (formData) {
                    return http.post('/api/post_work_over_time_delete_item', formData);
                },

                updateWOTItemFromDB: function (formData) {
                    return http.post('/api/post_work_over_time_update_item', formData);
                },

                // 多組
                getWOTMultiple: function(formData) {
                    return http.post('/api/post_work_over_time_multiple_get', formData);
                },
            }
        }])
        .factory('TravelApplicationUtil', ['$http', function (http) {
            return {
                insertTravelApplicationItem: function (formData) {
                    return http.post('/api/post_travel_application_insert_item', formData);
                },

                getTravelApplicationItem: function (formData) {
                    return http.post('/api/post_travel_application_get_item', formData);
                },

                removeTravelApplicationItem: function (formData) {
                    return http.post('/api/post_travel_application_remove_item', formData);
                },

                updateTravelApplicationItem: function (formData) {
                    return http.post('/api/post_travel_application_update_item', formData);
                },

                searchTravelApplicationItem: function (formData) {
                    return http.post('/api/post_travel_application_search_item', formData);
                },

            }
        }])
        .factory('WorkOffExchangeFormUtil', ['$http', function (http) {
            return {
                // insert new Exchange item
                insertExchangeItem: function (formData) {
                    return http.post('/api/post_work_off_exchange_table_insert_item', formData);
                },

                fetchExchangeItemsByYear: function (formData) {
                    return http.post('/api/post_work_off_exchange_table_fetch_items', formData);
                },

                removeExchangeItem: function (formData) {
                    return http.post('/api/post_work_off_exchange_table_remove_item', formData);
                },

                confirmExchangeItem: function (formData) {
                    return http.post('/api/post_work_off_exchange_table_confirm_item', formData);
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

                updateWorkHourAddItem: function (formData) {
                    return http.post('/api/post_work_hour_work_add_update_item', formData);
                },

                removeWorkHourAddItem: function (formData) {
                    return http.post('/api/post_work_hour_work_add_remove_item', formData);
                },

                createWorkHourAddItemOne: function(formData) {
                    return http.post('/api/post_work_hour_work_add_create_item_one', formData);
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
                updateItemRepent: function (formData) {
                    return http.post('/api/post_work_hour_work_add_item_update_repent', formData);
                },
                updateRelatedAddItemByProject: function (formData) {
                    return http.post('/api/post_work_hour_work_update_related_work_add_items', formData);
                },

                distributeWorkAdd: function (formData) {
                    return http.post('/api/post_work_hour_work_distribution_save', formData);
                },

                updateWorkAddItemsMonthSalary: function (formData) {
                    return http.post('/api/post_work_hour_work_add_month_salary_update', formData);
                },

                updateWorkAddItemsMonthSalaryAll: function (formData) {
                    return http.post('/api/post_work_hour_work_add_month_salary_update_all', formData);
                }

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

                getShiftDatefromFirstDate_typeB: function (firstDate, offset) {
                    var firstDay = moment(firstDate).add(offset, 'days');
                    return firstDay.format('YYYY_MM_DD');
                },

                getShiftDatefromFirstDate_month: function (firstDate, offset) {
                    var firstDay = moment(firstDate).add(offset, 'days');
                    return firstDay.format('YYYY_MM');
                },
                getShiftDatefromFirstDate_month_slash: function (firstDate, offset) {
                    var firstDay = moment(firstDate).add(offset, 'days');
                    return firstDay.format('YYYY/MM');
                },

                getShiftDatefromFirstDateCalendar: function (firstDate, offset) {
                    var firstDay = moment(firstDate).add(offset, 'days');
                    return firstDay.format('YYYY-MM-DD');
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
        .factory('UpdateActionUtil', ['$http', function (http) {
            return {
                convertAction: function (actionString) {
                    switch (actionString) {
                        case "cancelReview":
                            return "抽單";
                        case "sendReview":
                            return "提交審查";
                        // 主管
                        case "bossAgree":
                            return "主管同意";
                        case "bossReject":
                            return "主管退回";
                        // 專案經理
                        case "managerAgree":
                            return "經理同意";
                        case "managerReject":
                            return "經理退回";
                        // 行政
                        case "executiveAgree":
                            return "行政同意";
                        case "executiveReject":
                            return "行政退回";
                        case "executiveCancel":
                            return "行政核定後退回";
                        case "executiveEdit":
                            return "行政增修";
                        // 代理人
                        case "agentAgree":
                            return "代理人同意"
                        case "agentReject":
                            return "代理人退回"
                        default:
                            return "Not Set";
                    }
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
                            return "陪產(檢)假"; // Day
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
                },

                sendTestMail: function (formData) {
                    return http.post('/api/post_user_send_test_mail', formData);
                }
            }
        }])
        .factory('NotificationMsgUtil', ['$http', function (http) {
            return {

                createMsgItem: function (formData) {
                    return http.post('/api/post_notification_msg_create_item', formData);
                },

                fetchMsgItemsByUserDID: function (formData) {
                    return http.post('/api/post_notification_msg_by_user_did', formData);
                },

                updateMsgItem: function (formData) {
                    return http.post('/api/post_notification_msg_update', formData);
                },

                updateMsgItemAll: function (formData) {
                    return http.post('/api/post_notification_msg_update_all', formData);
                }
            }
        }])
        .factory('RelatedTasksUtil', ['$http', function (http) {
            return {
                fetchRelatedTasks: function (formData) {
                    return http.post('/api/fetch_related_tasks', formData);
                },
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
