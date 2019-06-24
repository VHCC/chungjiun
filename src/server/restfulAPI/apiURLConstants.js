/**
 * @author Ichen.chu
 * created on 2018/03/08
 */

global.apiUrl = {
    //login
    post_login_user_find : '/api/loginfind',
    //register
    post_register_user : '/api/register',
    post_find_user_by_email : '/api/findUserByEmail',

    //create project
    get_all_users : '/api/getAllUsers',
    get_all_users_with_unregister : '/api/getAllUsersWithSignOut',
    get_all_techs : '/api/getAllTechs',
    get_all_managers : '/api/getAllManagers',
    get_project_find_all : '/api/projectFindAll',
    get_project_find_all_enable : '/api/projectFindAllEnable',
    get_project_find_all_by_group : '/api/projectFindAllByGroup',
    post_project_find_by_name : '/api/projectFindByName',
    post_project_find_by_code : '/api/post_project_find_by_code',
    // 尋找總數
    get_project_find_by_code_distinct : '/api/projectFindByCodeDistinct',
    post_project_number_find_by_prj_number_distinct : '/api/post_project_number_find_by_prj_number_distinct',
    post_project_sub_number_find_by_number_distinct : '/api/post_project_sub_number_find_by_number_distinct',

    get_project_find_by_prjid : '/api/projectFindByPrjID',
    get_project_find_by_prjid_array : '/api/projectFindByPrjIDArray',
    post_project_foot_code : '/api/projectFootCode',
    // Create
    post_project_create : '/api/projectCreate',
    // search
    post_project_number_find_by_code_group_by_number: '/api/post_project_number_find_by_code_group_by_number',
    post_project_sub_number_find_by_number: '/api/post_project_sub_number_find_by_number',
    post_project_type_find_by_sub_number: '/api/post_project_type_find_by_sub_number',

    // 工時表 經理
    post_project_all_related_to_manager : '/api/post_project_all_related_to_manager',

    // ListProject
    post_project_all_related_to_user : '/api/post_project_all_related_to_user',
    post_project_all_related_to_user_with_disabled : '/api/post_project_all_related_to_user_with_disabled',
    // Update
    post_project_update_major_id: '/api/post_project_update_major_id',
    post_project_update_workers: '/api/post_project_update_workers',
    post_project_update_status: '/api/post_project_update_status',
    post_project_update_main_name: '/api/post_project_update_main_name',
    post_project_update_prj_name: '/api/post_project_update_prj_name',
    post_project_update_prj_sub_name: '/api/post_project_update_prj_sub_name',



    // todolist
    post_todo_create : '/api/createTodo',
    post_todo_findMyAll : '/api/findMyAllTodos',
    post_todo_checkItem : '/api/checkMySpecificTodo',
    post_todo_remove : '/api/removeMySpecificTodo',

    // payment Form
    post_payment_create : '/api/createPaymentForm',

    //workHourTable Form
    post_work_hour_create_table : '/api/createWorkHourTableForm',
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
        // statistics
    query_statistics_form : '/api/query_statistics_form',
    query_statistics_tables : '/api/query_statistics_tables',


    //workHourTable Form Work Add
    post_work_hour_work_add_create_item : '/api/post_work_hour_work_add_create_item',
    post_work_hour_work_add_get_items : '/api/post_work_hour_work_add_get_items',
    post_work_hour_work_remove_related_work_add_items : '/api/post_work_hour_work_remove_related_work_add_items',
    post_work_hour_work_executive_confirm : '/api/post_work_hour_work_executive_confirm',
    post_work_hour_work_update_related_work_add_items : '/api/post_work_hour_work_update_related_work_add_items',
    post_work_hour_work_add_item_update : '/api/post_work_hour_work_add_item_update',

    //workOffTable Form
    post_work_off_create_table : '/api/createWorkOffTableForm',
    post_work_off_table_insert_item : '/api/post_work_off_table_insert_item', // 20190515
    post_work_off_table_remove_item : '/api/post_work_off_table_remove_item', // 20190515
    post_work_off_table_find_by_table_id_array : '/api/findWorkOffTableFormByTableIDArray', //@Deprecated
    post_work_off_table_find_by_table_id_array_and_parameters : '/api/post_work_off_table_find_by_table_id_array_and_parameters',
    post_work_off_table_find_by_user_did : '/api/post_work_off_table_find_by_user_did',
    post_work_off_table_item_find_by_user_did_executive : '/api/post_work_off_table_item_find_by_user_did_executive',
    post_work_off_table_item_find_by_user_did_boss : '/api/post_work_off_table_item_find_by_user_did_boss',
    post_work_off_table_update_send_review : '/api/updateWorkOffTableFormSendReview', //@Deprecated
    post_work_off_table_update_executive_agree : '/api/post_work_off_table_update_executive_agree', //@Deprecated
    post_work_off_table_update_boss_agree : '/api/post_work_off_table_update_boss_agree', //@Deprecated
    post_work_off_table_update_disagree : '/api/post_work_off_table_update_disagree', //@Deprecated
    //***** 請假單更新
    post_work_off_table_update : '/api/post_work_off_table_update',
    post_work_off_table_fetch_all_user : '/api/fetchUserWorkOffForm', //@Deprecated
    post_work_off_table_fetch_all_executive : '/api/post_work_off_table_fetch_all_executive',
    post_work_off_table_fetch_all_boss : '/api/post_work_off_table_fetch_all_boss',

    //workOffExchangeTable Form
    post_work_off_exchange_table_insert_item : '/api/post_work_off_exchange_table_insert_item',
    post_work_off_exchange_table_find_by_creatorDID : '/api/post_work_off_exchange_table_find_by_creatorDID',
    post_work_off_exchange_table_remove_by_itemID : '/api/post_work_off_exchange_table_remove_by_itemID',
    post_work_off_exchange_table_update : '/api/post_work_off_exchange_table_update',

    // holidayDataForm
    post_holiday_data_form_create : '/api/createHolidayDataForm',
    post_holiday_data_form_find_by_user_did : '/api/findHolidayDataFormByUserDID',
    post_holiday_data_form_update_by_form_id : '/api/updateHolidayDataFormByFormDID',

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

    //userEdit
    post_upload_user_avatatr : '/api/uploadUserAvatar',
    post_user_find_by_userdid : '/api/userFindByuserDID',
    post_user_change_password_by_userdid : '/api/userChangePasswordByuserDID',
    post_user_update_profile : '/api/userUpdateProfile',
    post_user_set_residual_rest_hour : '/api/setUserResidualRestHour',

    // WorkAddConfirmFormUtil
    post_create_work_add_confirm_form : '/api/post_create_work_add_confirm_form',
    post_fetch_work_add_confirm_form_by_user_id : '/api/post_fetch_work_add_confirm_form_by_user_id',

    //hrMachine
    post_fetch_hrmachine_data_by_machine_did : '/api/post_fetch_hrmachine_data_by_machine_did',
    post_fetch_hrmachine_data_one_day_by_machine_did : '/api/post_fetch_hrmachine_data_one_day_by_machine_did',
    post_load_hrmachine_data_by_date : '/api/post_load_hrmachine_data_by_date',

    //Vhc
    connect_db : '/api/connect_db',

    // Vhc MemberList
    get_vhc_member_all : '/api/get_vhc_member_all',
    post_vhc_member_update : '/api/post_vhc_member_update',
    post_vhc_member_create : '/api/post_vhc_member_create',
};