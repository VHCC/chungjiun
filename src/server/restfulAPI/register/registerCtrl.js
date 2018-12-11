/**
 * @author Ichen.chu
 * created on 2018/02/14
 */
angular.module('registerCtrl', ['ngCookies'])
    .controller('registerController', [
        '$scope',
        '$http',
        '$window',
        '$cookies',
        'Register', function (scope,
                              http,
                              window,
                              cookies,
                              Register) {
            return new RegisterCtrl(
                scope,
                http,
                window,
                cookies,
                Register);
        }])
    .factory('Register', ['$http', function (http) {
        return {
            create: function (userData) {
                return http.post('/api/register', userData);
            },

            findByEmail: function (userData) {
                return http.post('/api/findUserByEmail', userData);
            }
        }
    }]);

/** @ngInject */
function RegisterCtrl(scope,
                      mHttp,
                      window,
                      cookies,
                      Register) {
    scope.formData = {};
    scope.loading = false;

    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API
    scope.createUser = function () {
        console.log("createUser");
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if (scope.formData.email != undefined && scope.formData.password != undefined) {
            scope.loading = true;
            if (scope.formData.roletype === undefined) {
                scope.loading = false;
                window.errorText('請選擇員工角色');
                return;
            }

            if (!scope.checkNewUserEmail(scope)) {
                scope.loading = false;
                window.errorText('Email已存在');
                return;
            }
            return;
            // // call the create function from our service (returns a promise object)
            Register.create(scope.formData)

            // if successful creation, call our get function to get all the new todos
                .success(function (data) {
                    console.log('CREATE  SUCCESS');
                    scope.loading = false;
                    window.createSuccess('員工建立成功');
                    scope.formData = {}; // clear the form so our user is ready to enter another
                });
        }
    };


    scope.checkNewUserEmail = function (node) {
        Register.findByEmail(scope.formData)
        // if successful creation, call our get function to get all the new todos
            .success(function (data) {
                console.log(data)
                if (data.length > 0) {
                    return false;
                }
            });
        return true;
    }

    scope.initReg = function () {
        console.log("initReg.");
        scope.loading = false;
    };

}