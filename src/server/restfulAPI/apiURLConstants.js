/**
 * @author Ichen.chu
 * created on 2018/03/08
 */

global.apiUrl = {
    //login
    post_login_user_find : '/api/loginfind',
    post_login_user_find_forget_password : '/api/forgetPassword',
    //register
    post_register_user : '/api/register',
    post_find_user_by_email : '/api/findUserByEmail',

    //create project
    get_all_users : '/api/getAllUsers',
    get_all_users_Executive : '/api/getAllUsersExecutive',
    get_all_resign_users : '/api/get_all_resign_users',
    get_all_users_with_unregister : '/api/getAllUsersWithSignOut',
    get_all_users_with_unregister_executive : '/api/get_all_users_with_unregister_executive',
    get_all_techs : '/api/getAllTechs',
    get_all_managers : '/api/getAllManagers',
    get_project_find_all : '/api/projectFindAll',
    get_project_find_all_enable : '/api/projectFindAllEnable',
    get_project_find_all_closed : '/api/projectFindAllClosed',
    get_project_find_all_by_group : '/api/projectFindAllByGroup',
    post_project_find_by_name : '/api/projectFindByName',
    post_project_find_by_code : '/api/post_project_find_by_code',
    post_project_find_group_list : '/api/post_project_find_group_list',
    post_project_find_related_combined_array: '/api/post_project_find_related_combined_array',
    // 尋找總數
    get_project_find_by_code_distinct : '/api/projectFindByCodeDistinct',
    post_project_number_find_by_prj_number_distinct : '/api/post_project_number_find_by_prj_number_distinct',
    post_project_sub_number_find_by_number_distinct : '/api/post_project_sub_number_find_by_number_distinct',

    get_project_find_by_prjid : '/api/projectFindByPrjID',
    get_project_find_by_prjid_array : '/api/projectFindByPrjIDArray',
    post_project_foot_code : '/api/projectFootCode',
    // Create
    post_project_create : '/api/projectCreate',

    // Transfer Project
    post_project_transfer : '/api/projectTransfer',
    // Combine Project
    post_project_combine : '/api/projectCombine',
    // search
    post_project_number_find_by_code_group_by_number: '/api/post_project_number_find_by_code_group_by_number',
    post_project_sub_number_find_by_number: '/api/post_project_sub_number_find_by_number',
    post_project_type_find_by_sub_number: '/api/post_project_type_find_by_sub_number',

    // 工時表 經理
    post_project_all_related_to_manager : '/api/post_project_all_related_to_manager',

    // ListProject
    post_project_all_related_to_user : '/api/post_project_all_related_to_user',
    post_project_all_related_to_user_with_disabled : '/api/post_project_all_related_to_user_with_disabled',
    post_project_all_related_to_major_with_disabled : '/api/post_project_all_related_to_major_with_disabled', // only charger related

    // Update
    post_project_update_manager_id: '/api/post_project_update_manager_id',
    post_project_update_major_id: '/api/post_project_update_major_id',
    post_project_update_workers: '/api/post_project_update_workers',
    post_project_update_status: '/api/post_project_update_status',
    post_project_update_main_name: '/api/post_project_update_main_name',
    post_project_update_prj_name: '/api/post_project_update_prj_name',
    post_project_update_prj_sub_name: '/api/post_project_update_prj_sub_name',
    post_project_find_by_request: '/api/post_project_find_by_request',

    // todolist
    post_todo_create : '/api/createTodo',
    post_todo_findMyAll : '/api/findMyAllTodos',
    post_todo_checkItem : '/api/checkMySpecificTodo',
    post_todo_remove : '/api/removeMySpecificTodo',

    // payment Form
    // post_payment_create : '/api/createPaymentForm', // Deprecated
    post_payment_insert_item : '/api/post_payment_insert_item',
    post_payment_remove_item : '/api/post_payment_remove_item',
    post_payment_fetch_items : '/api/post_payment_fetch_items',
    post_payment_fetch_items_monthly_search : '/api/post_payment_fetch_items_monthly_search',
    post_payment_create_form : '/api/post_payment_create_form',
    post_payment_send_review : '/api/post_payment_send_review',
    post_payment_items_update : '/api/post_payment_items_update',
    post_payment_items_update_by_id : '/api/post_payment_items_update_by_id',
    post_payment_multiple_get : '/api/post_payment_multiple_get',
    post_payment_fetch_items_by_prjdid : '/api/post_payment_fetch_items_by_prjdid',
    post_payment_fetch_items_by_prjdid_array : '/api/post_payment_fetch_items_by_prjdid_array',

    // kpi
    post_get_kpi_elements_by_prjdid_array : '/api/post_get_kpi_elements_by_prjdid_array',
    post_get_kpi_financial_results_by_year : '/api/post_get_kpi_financial_results_by_year',
    post_get_kpi_financial_results_by_year_and_user_uuid : '/api/post_get_kpi_financial_results_by_year_and_user_uuid',
    post_get_kpi_elements_by_year : '/api/post_get_kpi_elements_by_year',

    post_get_kpi_person_elements_by_year : '/api/post_get_kpi_person_elements_by_year',
    post_get_kpi_person_elements_all : '/api/post_get_kpi_person_elements_all',
    post_kpi_person_elements_insert : '/api/post_kpi_person_elements_insert',

    post_get_kpi_elements_insert : '/api/post_get_kpi_elements_insert',
    post_get_kpi_elements_update : '/api/post_get_kpi_elements_update',
    post_get_kpi_elements_delete : '/api/post_get_kpi_elements_delete',

    // Setting
    post_find_kpi_person_setting : '/api/post_find_kpi_person_setting',
    post_insert_kpi_person_setting : '/api/post_insert_kpi_person_setting',
    post_update_kpi_person_setting : '/api/post_update_kpi_person_setting',

    // BONUS
    post_get_kpi_bonus_find : '/api/post_get_kpi_bonus_find',
    post_get_kpi_bonus_insert : '/api/post_get_kpi_bonus_insert',
    post_get_kpi_bonus_update : '/api/post_get_kpi_bonus_update',




    // global configs
    fetch_global_configs: '/api/fetch_global_configs',
    post_global_configs_update: '/api/post_global_configs_update',
    post_global_configs_insert: '/api/post_global_configs_insert',

    // FinancialRate
    post_project_financial_rate_get: '/api/post_project_financial_rate_get',
    post_project_financial_rate_insert: '/api/post_project_financial_rate_insert',
    post_project_financial_rate_update: '/api/post_project_financial_rate_update',

    // wageManage
    post_wage_manage_fetch_item : '/api/post_wage_manage_fetch_item',
    post_wage_manage_create_item : '/api/post_wage_manage_create_item',
    post_wage_manage_update_item : '/api/post_wage_manage_update_item',

    //workHourTable Form
    post_work_hour_create_table : '/api/createWorkHourTableForm',
    post_work_hour_remove_table : '/api/removeWorkHourTableForm',

    post_work_hour_insert_table_item : '/api/post_work_hour_insert_table_item',
    post_work_hour_remove_table_item_by_did : '/api/post_work_hour_remove_table_item_by_did',
    post_work_hour_form_update: '/api/post_work_hour_form_update',
    post_work_hour_create_form: '/api/post_work_hour_create_form',
    post_work_hour_create_form_cross: '/api/post_work_hour_create_form_cross',

    post_work_hour_get : '/api/getWorkHourForm',
    post_work_hour_multiple_get : '/api/post_work_hour_multiple_get',
    post_work_hour_get_for_manager : '/api/post_work_hour_get_for_manager',
    post_work_hour_table_find_by_tableid_array : '/api/post_work_hour_table_find_by_tableid_array',
    post_work_hour_table_update_send_review : '/api/updateWorkHourTableFormSendReview',
    post_work_hour_table_total_update_send_review : '/api/post_work_hour_table_total_update_send_review',
    post_work_hour_table_update : '/api/post_work_hour_table_update',
    post_work_hour_table_update_array : '/api/post_work_hour_table_update_array',
        // management
    get_work_hour_table_management_list : '/api/get_work_hour_table_management_list',
    insert_work_hour_table_temp : '/api/insert_work_hour_table_temp',
    fetch_work_hour_table_related_userDID_by_pro_did : '/api/fetch_work_hour_table_related_userDID_by_pro_did',
        // statistics
    query_statistics_form : '/api/query_statistics_form',
    query_statistics_form_CJ : '/api/query_statistics_form_CJ',
    query_statistics_form_CJ_type1 : '/api/query_statistics_form_CJ_type1',
    query_statistics_form_CJ_type2 : '/api/query_statistics_form_CJ_type2',
    query_statistics_form_CJ_type3 : '/api/query_statistics_form_CJ_type3',
    query_statistics_tables : '/api/query_statistics_tables',
    queryStatisticsForms_projectIncome_Cost : '/api/queryStatisticsForms_projectIncome_Cost',
    queryStatisticsForms_projectIncome_Cost_byPrjDIDArray : '/api/queryStatisticsForms_projectIncome_Cost_byPrjDIDArray',

    // employeeStatistics
    query_employee_statistics : '/api/query_employee_statistics',
    query_employee_statistics_workOff : '/api/query_employee_statistics_workOff',
    query_kpi_personal_workhour : '/api/query_kpi_personal_workhour',


    //workHourTable Form Work Add
    post_work_hour_work_add_create_item : '/api/post_work_hour_work_add_create_item',
    post_work_hour_work_add_update_item : '/api/post_work_hour_work_add_update_item',
    post_work_hour_work_add_remove_item : '/api/post_work_hour_work_add_remove_item',
    post_work_hour_work_add_create_item_one : '/api/post_work_hour_work_add_create_item_one',

    post_work_hour_work_add_get_items : '/api/post_work_hour_work_add_get_items',
    post_work_hour_work_remove_related_work_add_items : '/api/post_work_hour_work_remove_related_work_add_items',
    post_work_hour_work_executive_confirm : '/api/post_work_hour_work_executive_confirm',
    post_work_hour_work_update_related_work_add_items : '/api/post_work_hour_work_update_related_work_add_items',
    post_work_hour_work_distribution_save : '/api/post_work_hour_work_distribution_save',
    post_work_hour_work_add_item_update_repent : '/api/post_work_hour_work_add_item_update_repent',
    post_work_hour_work_add_month_salary_update : '/api/post_work_hour_work_add_month_salary_update',
    post_work_hour_work_add_month_salary_update_all : '/api/post_work_hour_work_add_month_salary_update_all',

    //workOffTable Form
    post_work_off_create_table : '/api/createWorkOffTableForm',
    post_work_off_table_insert_item : '/api/post_work_off_table_insert_item', // 20190515
    post_work_off_table_remove_item : '/api/post_work_off_table_remove_item', // 20190515
    post_work_off_table_find_by_table_id_array : '/api/findWorkOffTableFormByTableIDArray', //@Deprecated
    post_work_off_table_find_by_table_id_array_and_parameters : '/api/post_work_off_table_find_by_table_id_array_and_parameters', // Deprecated
    post_work_off_table_find_by_user_did : '/api/post_work_off_table_find_by_user_did',
    post_work_off_table_update_salary : '/api/post_work_off_table_update_salary',
    post_work_off_table_update_send_review : '/api/updateWorkOffTableFormSendReview', //@Deprecated
    post_work_off_table_update_executive_agree : '/api/post_work_off_table_update_executive_agree', //@Deprecated
    post_work_off_table_update_boss_agree : '/api/post_work_off_table_update_boss_agree', //@Deprecated
    post_work_off_table_update_disagree : '/api/post_work_off_table_update_disagree', //@Deprecated
    //***** 請假單更新
    post_work_off_table_update : '/api/post_work_off_table_update',
    post_work_off_table_fetch_all_user : '/api/fetchUserWorkOffForm', //@Deprecated
    post_work_off_table_fetch_all_executive : '/api/post_work_off_table_fetch_all_executive',
    post_work_off_table_fetch_all_boss : '/api/post_work_off_table_fetch_all_boss',
    post_work_off_table_fetch_all_agent : '/api/post_work_off_table_fetch_all_agent',
    post_work_off_table_item_find_by_user_did_boss : '/api/post_work_off_table_item_find_by_user_did_boss', //@Deprecated 20200218
    post_work_off_table_item_find_by_user_did_executive : '/api/post_work_off_table_item_find_by_user_did_executive', //@Deprecated 20200218
    // integrate
    post_work_off_table_item_find_by_parameter : '/api/post_work_off_table_item_find_by_parameter',
    // PDF
    post_work_off_pdf_fetch_file : '/api/post_work_off_pdf_fetch_file',
    post_work_off_pdf_upload_file : '/api/post_work_off_pdf_upload_file',
    post_work_off_pdf_get_file : '/api/post_work_off_pdf_get_file',
    post_work_off_pdf_download_file : '/api/post_work_off_pdf_download_file',
    post_work_off_pdf_delete_file : '/api/post_work_off_pdf_delete_file',

    //workOffExchangeTable Form
    post_work_off_exchange_table_insert_item : '/api/post_work_off_exchange_table_insert_item',
    post_work_off_exchange_table_fetch_items : '/api/post_work_off_exchange_table_fetch_items',
    post_work_off_exchange_table_confirm_item : '/api/post_work_off_exchange_table_confirm_item',
    post_work_off_exchange_table_remove_item : '/api/post_work_off_exchange_table_remove_item',

    // holidayDataForm
    post_holiday_data_form_create : '/api/createHolidayDataForm',
    post_holiday_data_form_find_by_user_did : '/api/findHolidayDataFormByUserDID',
    post_holiday_data_form_update_by_form_id : '/api/updateHolidayDataFormByFormDID',

    // projectIncome
    post_project_income_create : '/api/post_project_income_create',
    post_project_income_find : '/api/post_project_income_find',
    post_project_income_find_by_prjdid_array : '/api/post_project_income_find_by_prjdid_array',
    post_project_income_update : '/api/post_project_income_update',
    post_project_income_remove : '/api/post_project_income_remove',

    // projectFinancialResult
    post_project_financial_result_find : '/api/post_project_financial_result_find',
    post_project_financial_result_create : '/api/post_project_financial_result_create',
    post_project_financial_result_update : '/api/post_project_financial_result_update',
    post_project_financial_result_sync_project : '/api/post_project_financial_result_sync_project',
    post_project_financial_result_find_by_request : '/api/post_project_financial_result_find_by_request',

    // projectFinanlcialDistribute
    post_project_financial_distribute_create : '/api/post_project_financial_distribute_create',
    post_project_financial_distribute_find : '/api/post_project_financial_distribute_find',
    post_project_financial_distribute_update : '/api/post_project_financial_distribute_update',
    post_project_financial_distribute_remove : '/api/post_project_financial_distribute_remove',
    post_project_financial_distribute_find_by_year : '/api/post_project_financial_distribute_find_by_year',
    post_project_financial_distribute_find_by_user_uuid : '/api/post_project_financial_distribute_find_by_user_uuid',

    // KpiTechDistributeUtil
    post_kpi_tech_distribute_create : '/api/post_kpi_tech_distribute_create',
    post_kpi_tech_distribute_find : '/api/post_kpi_tech_distribute_find',
    post_kpi_tech_distribute_update : '/api/post_kpi_tech_distribute_update',
    post_kpi_tech_distribute_remove : '/api/post_kpi_tech_distribute_remove',

    // nationalHolidayForm
    post_national_holiday_data_form_create : '/api/post_national_holiday_data_form_create',
    post_national_holiday_data_form_fetch_all : '/api/post_national_holiday_data_form_fetch_all',
    post_national_holiday_data_form_update : '/api/post_national_holiday_data_form_update',
    post_national_holiday_data_form_remove : '/api/post_national_holiday_data_form_remove',
    post_national_holiday_data_form_fetch_with_parameters : '/api/post_national_holiday_data_form_fetch_with_parameters',

    //　overTimeDayForm
    post_over_time_day_data_form_create : '/api/post_over_time_day_data_form_create',
    post_over_time_day_data_form_fetch_all : '/api/post_over_time_day_data_form_fetch_all',
    post_over_time_day_data_form_update : '/api/post_over_time_day_data_form_update',
    post_over_time_day_data_form_remove : '/api/post_over_time_day_data_form_remove',
    post_over_time_day_data_form_fetch_with_parameters : '/api/post_over_time_day_data_form_fetch_with_parameters',

    // Official Doc file
    post_official_doc_upload_file : '/api/post_official_doc_upload_file',
    post_official_doc_delete_file : '/api/post_official_doc_delete_file',
    post_official_doc_detect_file : '/api/post_official_doc_detect_file',
    post_official_doc_get_file : '/api/post_official_doc_get_file',
    post_official_doc_fetch_file : '/api/post_official_doc_fetch_file',
    post_official_doc_download_file : '/api/post_official_doc_download_file',
    post_official_doc_rename_and_folder : '/api/post_official_doc_rename_and_folder',
    post_official_doc_rename_and_folder_public : '/api/post_official_doc_rename_and_folder_public',

    // public
    post_official_doc_upload_file_public : '/api/post_official_doc_upload_file_public',
    post_official_doc_upload_file_public_fs : '/api/post_official_doc_upload_file_public_fs',
    post_official_doc_delete_file_public : '/api/post_official_doc_delete_file_public',
    post_official_doc_update_item_public : '/api/post_official_doc_update_item_public',
    post_official_doc_delete_item_public : '/api/post_official_doc_delete_item_public',
    post_official_doc_delete_file_public_from_fs : '/api/post_official_doc_delete_file_public_from_fs',
    post_official_doc_create_item_public : '/api/post_official_doc_create_item_public',
    post_official_doc_create_item_public_temp : '/api/post_official_doc_create_item_public_temp',

    post_official_doc_fetch_file_public : '/api/post_official_doc_fetch_file_public',
    post_official_doc_get_file_public : '/api/post_official_doc_get_file_public',
    post_official_doc_download_file_public : '/api/post_official_doc_download_file_public',
    post_official_doc_fetch_item_period_public : '/api/post_official_doc_fetch_item_period_public',
    post_official_doc_create_item_archive_number_public : '/api/post_official_doc_create_item_archive_number_public',
    post_official_doc_get_archive_number_public : '/api/post_official_doc_get_archive_number_public',

    // Official Doc item
    post_official_doc_create_item : '/api/post_official_doc_create_item',
    get_official_doc_fetch_all_item : '/api/get_official_doc_fetch_all_item',
    post_official_doc_fetch_item_period : '/api/post_official_doc_fetch_item_period',
    post_official_doc_search_item : '/api/post_official_doc_search_item',
    post_official_doc_search_item_by_managerID : '/api/post_official_doc_search_item_by_managerID',
    post_official_doc_search_item_by_signerDID : '/api/post_official_doc_search_item_by_signerDID', // 20200406
    post_official_doc_update_item : '/api/post_official_doc_update_item',
    post_official_doc_delete_item : '/api/post_official_doc_delete_item',
    post_official_doc_create_item_archive_number : '/api/post_official_doc_create_item_archive_number',

    // OfficialDocVendorUtil
    get_fetch_official_doc_vendor : '/api/get_fetch_official_doc_vendor',
    post_insert_official_doc_vendor : '/api/post_insert_official_doc_vendor',
    post_update_official_doc_vendor : '/api/post_update_official_doc_vendor',
    post_remove_official_doc_vendor : '/api/post_remove_official_doc_vendor',

    // OfficialDocNotifyUtil
    fetch_official_doc_notify : '/api/fetch_official_doc_notify',
    post_insert_official_doc_notify : '/api/post_insert_official_doc_notify',
    post_update_official_doc_notify : '/api/post_update_official_doc_notify',

    // task check list
    fetch_task_check_list_work_hour_table_manager: '/api/fetch_task_check_list_work_hour_table_manager',
    fetch_task_check_list_work_hour_table_executive: '/api/fetch_task_check_list_work_hour_table_executive',

    //userEdit
    post_upload_user_avatar : '/api/uploadUserAvatar',
    post_user_find_by_userdid : '/api/userFindByuserDID',
    post_user_change_password_by_userdid : '/api/userChangePasswordByuserDID',
    post_user_update_profile : '/api/userUpdateProfile',
    post_user_set_residual_rest_hour : '/api/setUserResidualRestHour',
    post_user_send_test_mail : '/api/post_user_send_test_mail',
    post_user_info_update_before_108_kpi : '/api/post_user_info_update_before_108_kpi',


    // WorkAddConfirmFormUtil
    post_create_work_add_confirm_form : '/api/post_create_work_add_confirm_form',
    post_fetch_work_add_confirm_form_by_user_id : '/api/post_fetch_work_add_confirm_form_by_user_id',

    //hrMachine
    post_fetch_hrmachine_data_by_machine_did : '/api/post_fetch_hrmachine_data_by_machine_did',
    post_fetch_hrmachine_data_one_day_by_machine_did : '/api/post_fetch_hrmachine_data_one_day_by_machine_did',
    post_load_hrmachine_data_by_date : '/api/post_load_hrmachine_data_by_date',

    // line notify
    get_line_notify_auth_register : '/api/post_line_notify_auth_register',

    // notification Msg
    post_notification_msg_create_item : '/api/post_notification_msg_create_item',
    post_notification_msg_by_user_did : '/api/post_notification_msg_by_user_did',
    post_notification_msg_update : '/api/post_notification_msg_update',
    post_notification_msg_update_all : '/api/post_notification_msg_update_all',

    // RelatedTasksUtil
    fetch_related_tasks : '/api/fetch_related_tasks',

    // travel Application
    post_travel_application_insert_item : '/api/post_travel_application_insert_item', // 20200120
    post_travel_application_get_item : '/api/post_travel_application_get_item', // 20200120
    post_travel_application_remove_item : '/api/post_travel_application_remove_item', // 20200120
    post_travel_application_update_item : '/api/post_travel_application_update_item', // 20200120
    post_travel_application_search_item : '/api/post_travel_application_search_item', // 20200120
    post_travel_application_search_item_2 : '/api/post_travel_application_search_item_2', // 20200205
    post_travel_application_search_item_by_prjDID : '/api/post_travel_application_search_item_by_prjDID', // 20220406

    // remedy
    post_hr_remedy_insert_item : '/api/post_hr_remedy_insert_item', // 20200618
    post_hr_remedy_fetch_items_by_creatorDID : '/api/post_hr_remedy_fetch_items_by_creatorDID', // 20200618
    post_hr_remedy_fetch_history_items_by_creatorDID : '/api/post_hr_remedy_fetch_history_items_by_creatorDID', // 20200701
    post_hr_remedy_delete_item : '/api/post_hr_remedy_delete_item', // 20200618
    post_hr_remedy_update_item : '/api/post_hr_remedy_update_item', // 20200618
    post_hr_remedy_search_item_review : '/api/post_hr_remedy_search_item_review', // 20200619
    post_hr_remedy_search_item_confirm : '/api/post_hr_remedy_search_item_confirm', // 20200620

    // SupervisionNotify
    post_supervision_notify_insert_item : '/api/post_supervision_notify_insert_item', // 20200629
    post_supervision_notify_fetch_by_creatorDID : '/api/post_supervision_notify_fetch_by_creatorDID', // 20200629
    post_supervision_notify_delete_item : '/api/post_supervision_notify_delete_item', // 20200629
    post_supervision_notify_update_item : '/api/post_supervision_notify_update_item', // 20200629

    // workOverTimeItem
    post_work_over_time_insert_item : '/api/post_work_over_time_insert_item', // 20200701
    post_work_over_time_fetch_by_creatorDID : '/api/post_work_over_time_fetch_by_creatorDID', // 20200701
    post_work_over_time_fetch_by_creatorDID_create_formdate : '/api/post_work_over_time_fetch_by_creatorDID_create_formdate', // 20200701
    post_work_over_time_delete_item : '/api/post_work_over_time_delete_item', // 20200701
    post_work_over_time_update_item : '/api/post_work_over_time_update_item', // 20200701
    post_work_over_time_multiple_get : '/api/post_work_over_time_multiple_get', // 20200706

    // executive expenditure
    post_executive_expenditure_insert_item : '/api/post_executive_expenditure_insert_item',
    post_executive_expenditure_remove_item : '/api/post_executive_expenditure_remove_item',
    post_executive_expenditure_fetch_items : '/api/post_executive_expenditure_fetch_items',
    post_executive_expenditure_fetch_items_by_prj_did : '/api/post_executive_expenditure_fetch_items_by_prj_did',
    post_executive_expenditure_fetch_items_by_prj_did_array : '/api/post_executive_expenditure_fetch_items_by_prj_did_array',
    post_executive_expenditure_items_update_one : '/api/post_executive_expenditure_items_update_one',
    post_executive_expenditure_items_update_many : '/api/post_executive_expenditure_items_update_many',
    post_executive_expenditure_fetch_items_by_prjdid_array : '/api/post_executive_expenditure_fetch_items_by_prjdid_array',

    // expenditure target
    post_fetch_expenditure_target : '/api/post_fetch_expenditure_target',
    post_fetch_all_expenditure_target : '/api/post_fetch_all_expenditure_target',
    post_insert_expenditure_target : '/api/post_insert_expenditure_target',
    post_update_expenditure_target : '/api/post_update_expenditure_target',
    post_remove_expenditure_target : '/api/post_remove_expenditure_target',

    // sub Contractor Apply
    post_sub_contractor_apply_insert_item : '/api/post_sub_contractor_apply_insert_item',
    post_sub_contractor_apply_remove_item : '/api/post_sub_contractor_apply_remove_item',
    post_sub_contractor_apply_fetch_items : '/api/post_sub_contractor_apply_fetch_items',
    post_sub_contractor_apply_items_update_one : '/api/post_sub_contractor_apply_items_update_one',
    post_sub_contractor_apply_items_update_many : '/api/post_sub_contractor_apply_items_update_many',
    post_sub_contractor_apply_items_fetch_period : '/api/post_sub_contractor_apply_items_fetch_period',

    // subContractorVendor
    post_fetch_sub_contractor_vendor_enabled : '/api/post_fetch_sub_contractor_vendor_enabled',
    post_fetch_all_sub_contractor_vendor : '/api/post_fetch_all_sub_contractor_vendor',
    post_insert_sub_contractor_vendor : '/api/post_insert_sub_contractor_vendor',
    post_update_sub_contractor_vendor : '/api/post_update_sub_contractor_vendor',
    post_remove_sub_contractor_vendor : '/api/post_remove_sub_contractor_vendor',

    // subContractorItem
    post_fetch_sub_contractor_item_enabled : '/api/post_fetch_sub_contractor_item_enabled',
    post_fetch_all_sub_contractor_item : '/api/post_fetch_all_sub_contractor_item',
    post_insert_sub_contractor_item : '/api/post_insert_sub_contractor_item',
    post_update_sub_contractor_item : '/api/post_update_sub_contractor_item',
    post_remove_sub_contractor_item : '/api/post_remove_sub_contractor_item',

    // subContractorPayItem
    post_fetch_sub_contractor_pay_item : '/api/post_fetch_sub_contractor_pay_item',
    post_fetch_sub_contractor_pay_item_by_prj_did_array : '/api/post_fetch_sub_contractor_pay_item_by_prj_did_array',
    post_insert_sub_contractor_pay_item : '/api/post_insert_sub_contractor_pay_item',
    post_update_sub_contractor_pay_item : '/api/post_update_sub_contractor_pay_item',
    post_remove_sub_contractor_pay_item : '/api/post_remove_sub_contractor_pay_item',

};