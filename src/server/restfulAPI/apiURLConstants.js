/**
 * @author Ichen.chu
 * created on 2018/03/08
 */

global.apiUrl = {
    //login
    post_login_user_find : '/api/loginfind',
    //register
    post_register_user : '/api/register',

    //create project
    get_all_users : '/api/getAllUsers',
    get_all_techs : '/api/getAllTechs',
    get_all_managers : '/api/getAllManagers',
    get_project_find_all : '/api/projectFindAll',
    get_project_find_all_by_group : '/api/projectFindAllByGroup',
    post_project_find_by_name : '/api/projectFindByName',
    get_project_find_by_name_distinct : '/api/projectFindByNameDistinct',
    get_project_find_by_prjid : '/api/projectFindByPrjID',
    get_project_find_by_prjid_array : '/api/projectFindByPrjIDArray',
    post_project_foot_code : '/api/projectFootCode',
    post_project_create : '/api/projectCreate',
    

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
    post_work_hour_table_find_by_tableid_array : '/api/findWorkHourTableFormByTableIDArray',
    post_work_hour_table_update_send_review : '/api/updateWorkHourTableFormSendReview',

    // holidayDataForm
    post_holiday_data_form_create : '/api/createHolidayDataForm',
    post_holiday_data_form_find_by_user_did : '/api/findHolidayDataFormByUserDID',
    post_holiday_data_form_update_by_form_id : '/api/updateHolidayDataFormByFormDID',

    //userEdit
    post_upload_user_avatatr : '/api/uploadUserAvatar',
    post_user_find_by_userdid : '/api/userFindByuserDID',
    post_user_change_password_by_userdid : '/api/userChangePasswordByuserDID',
    post_user_update_profile : '/api/userUpdateProfile',
};