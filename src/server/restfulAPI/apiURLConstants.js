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
    get_project_find_all : '/api/projectFindAll',
    get_project_find_all_by_group : '/api/projectFindAllByGroup',
    post_project_find_by_name : '/api/projectFindByName',
    get_project_find_by_name_distinct : '/api/projectFindByNameDistinct',
    get_project_find_by_prjid : '/api/projectFindByPrjID',
    post_project_foot_code : '/api/projectFootCode',
    post_project_create : '/api/projectCreate',
    

    // todolist
    post_todo_create : '/api/createTodo',
    post_todo_findMyAll : '/api/findMyAllTodos',
    post_todo_checkItem : '/api/checkMySpecificTodo',
    post_todo_remove : '/api/removeMySpecificTodo',

    // payment Form
    post_payment_create : '/api/createPaymentForm',
};