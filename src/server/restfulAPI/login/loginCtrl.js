/**
 * @author Ichen.chu
 * created on 2018/02/14
 */
    angular.module('loginCtrl', [])
        .controller('loginController', ['$scope','$http', '$window', 'Login', function (scope, http, window, Login) {
            return new LoginCtrl(scope, http, window, Login);
        }])
        .factory('Login', ['$http', function(http) {
            return {
                get : function() {
                    return http.get('/api/login');
                },
                create : function(userData) {
                    return http.post('/api/login', userData);
                },
                find : function(userData) {
                    return http.post('/api/loginfind', userData);
                }
            }
        }]);

    /** @ngInject */
    function LoginCtrl(scope, mHttp, window, Login) {
        scope.formData = {};
        scope.loading = false;

        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        scope.createUser = function() {
            console.log("createUser");
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if (scope.formData.email != undefined) {
                scope.loading = true;

                // call the create function from our service (returns a promise object)
                Login.create(scope.formData)

                // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        console.log('CREATE  SUCCESS');
                        scope.loading = false;
                        scope.formData = {}; // clear the form so our user is ready to enter another
                        scope.todos = data; // assign our new list of todos
                    });
            }
        };

        //FIND
        scope.findUser = function() {
            console.log("find User");
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if (scope.formData.email != undefined) {
                scope.loading = true;

                // call the create function from our service (returns a promise object)
                Login.find(scope.formData)

                // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        scope.loading = false;
                        window.location.href = 'http://localhost:3000';
                        scope.formData = {}; // clear the form so our user is ready to enter another
                        scope.todos = data; // assign our new list of todos
                    });
            }
        };
    }