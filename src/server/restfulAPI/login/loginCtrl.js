/**
 * @author Ichen.chu
 * created on 2018/02/14
 */
    angular.module('loginCtrl', ['ngCookies'])
        .controller('loginController', ['$scope', '$http', '$window', '$cookies', 'Login', function (scope, http, window, cookies, Login) {
            return new LoginCtrl(scope, http, window, cookies, Login);
        }])
        .factory('Login', ['$http', function(http) {
            return {
                find : function(userData) {
                    return http.post('/api/loginfind', userData);
                }
            }
        }]);

    /** @ngInject */
    function LoginCtrl(scope, mHttp, window, cookies, Login) {
        scope.formData = {};
        scope.loading = false;

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

                        if (data.length == 0) {
                            window.userNoFind();
                            return;
                        }

                        // cookies.username = data[0].name; wrong program
                        cookies.put('username', data[0].name);
                        cookies.put('roletype', data[0].roleType);
                        
                        console.log('cookies.username= ' + cookies.username);
                        console.log('cookies.username= ' + cookies.get('username'));
                        window.location.href = 'http://localhost:3000';

                        scope.todos = data; // assign our new list of todos
                    })
                    .error(function (data) {
                        scope.loading = false;

                        console.log(data);
                        if (data.code == 400) {
                            window.userPWDWrong();
                        }  else if (data.code == 404) {
                            window.userNoFind();
                        }
                    });

            }
        };

    //    sign out
        scope.signOut = function () {
            console.log("sign Out");
            cookies.put('username', null);
            cookies.put('roletype', null);
            window.signOutSucess();
        }

        scope.initLogin = function () {
            console.log("initLogin.");
            // check if there is query in url
            // and fire search in case its value is not empty
            cookies.put('username', null);
            cookies.put('roletype', null);
        };

    }