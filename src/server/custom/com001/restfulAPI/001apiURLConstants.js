/**
 * @author IChen.chu
 * created on 2022/07/08
 */

global._001_apiUrl = {
    // Project
    _001_post_project_create : '/api/_001_post_project_create',
    _001_post_project_find_all : '/api/_001_post_project_find_all',
    _001_post_project_find_all_case_with_one_contract : '/api/_001_post_project_find_all_case_with_one_contract',
    _001_post_project_find_one_case_with_all_type : '/api/_001_post_project_find_one_case_with_all_type',
    _001_post_project_find_one_case_with_specific_type : '/api/_001_post_project_find_one_case_with_specific_type',
    _001_post_project_find_all_case_with_specific_type_specific_contract : '/api/_001_post_project_find_all_case_with_specific_type_specific_contract',

    // Institute
    _001_post_institute_create : '/api/_001_post_institute_create',
    _001_post_institute_find_all : '/api/_001_post_institute_find_all',

    // Project Contract
    _001_post_project_contract_create : '/api/_001_post_project_contract_create',
    _001_post_project_contract_find_all : '/api/_001_post_project_contract_find_all',
    _001_post_project_contract_find_by_instituteDID : '/api/_001_post_project_contract_find_by_instituteDID',

    // Project Case
    _001_post_project_case_create : '/api/_001_post_project_case_create',
    _001_post_project_case_find_all : '/api/_001_post_project_case_find_all',
    _001_post_project_case_find_by_contractDID_and_instituteDID : '/api/_001_post_project_case_find_by_contractDID_and_instituteDID',

    // Case Task
    _001_post_case_task_create : '/api/_001_post_case_task_create',
    _001_post_case_task_find_all : '/api/_001_post_case_task_find_all',
    _001_post_case_task_update_one : '/api/_001_post_case_task_update_one',

};