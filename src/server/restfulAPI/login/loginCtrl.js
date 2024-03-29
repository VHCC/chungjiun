/**
 * @author Ichen.chu
 * created on 2018/02/14
 */
    angular.module('loginCtrl', ['ngCookies'])
        .controller('loginController', [
            '$scope',
            '$http',
            '$window',
            '$cookies',
            'Login',
            function (
                scope,
                http,
                window,
                cookies,
                Login) {
            return new LoginCtrl(
                scope,
                http,
                window,
                cookies,
                Login);
        }])
        .factory('Login', ['$http', function(http) {
            return {
                find : function(userData) {
                    return http.post('/api/loginfind', userData);
                },

                forgetPWD : function(userData) {
                    return http.post('/api/forgetPassword', userData);
                },

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

                        if (data[0].roleType != 100 && data[0].workStatus == false) {
                            window.userNoActivate();
                            return;
                        }

                        cookies.put('username', data[0].name);
                        cookies.put('email', data[0].email);
                        cookies.put('roletype', data[0].roleType);
                        cookies.put('userDID', data[0]._id);
                        cookies.put('bossID', data[0].bossID);
                        cookies.put('userMonthSalary', data[0].userMonthSalary);
                        cookies.put('machineDID', data[0].machineDID);
                        cookies.put('feature_official_doc', data[0].feature_official_doc);

                        console.log('cookies.username= ' + cookies.username);
                        console.log('cookies.username= ' + cookies.get('username'));
                        window.location.href = 'http://localhost:3000';

                        scope.todos = data; // assign our new list of todos
                    })
                    .error(function (data) {
                        scope.loading = false;

                        console.log(data);
                        switch (data.code) {
                            case 400:
                                window.userPWDWrong();
                                break;
                            case 401:
                                window.userPWDChanged(data);
                                break;
                            case 404:
                                window.userNoFind();
                                break;
                        }
                    });

            }
        };

    //    sign out
        scope.signOut = function () {
            console.log("sign Out");
            cookies.put('username', null);
            cookies.put('roletype', null);
            cookies.put('userDID', null);
            cookies.put('bossID', null);
            cookies.put('userMonthSalary', null);
            cookies.put('machineDID', null);
            cookies.put('email', null);
            cookies.put('feature_official_doc', null);
            window.signOutSucess();
        }

        scope.initLogin = function () {
            console.log("initLogin.");
            // check if there is query in url
            // and fire search in case its value is not empty
            cookies.put('username', null);
            cookies.put('roletype', null);
            cookies.put('userDID', null);
            cookies.put('bossID', null);
            cookies.put('userMonthSalary', null);
            cookies.put('machineDID', null);
            cookies.put('email', null);
            cookies.put('feature_official_doc', null);
        };


        scope.forgetPWD = function () {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if (scope.formData.email != undefined) {
                scope.loading = true;

                // call the create function from our service (returns a promise object)
                Login.forgetPWD(scope.formData)
                // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        scope.loading = false;
                        console.log(data);

                        if (data.responseCode == 550) {
                            // window.Error(data.response);
                            console.log(data.response);
                            return;
                        }

                        if (data.length == 0) {
                            window.userNoFind();
                            return;
                        }

                        if (data[0].roleType != 100 && data[0].workStatus == false) {
                            window.userNoActivate();
                            return;
                        }

                        window.sendMailToCJMail(data[0].cjMail)
                    })
                    .error(function (data) {
                        scope.loading = false;
                        console.log(data);
                        if (data.code == 404) {
                            window.userNoFind();
                        }
                    });
            }
        };
    }