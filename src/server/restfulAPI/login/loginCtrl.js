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
            '$filter',
            'Login',
            '_001_DepBoss',
            function (
                scope,
                http,
                window,
                cookies,
                $filter,
                Login,
                _001_DepBoss) {
            return new LoginCtrl(
                scope,
                http,
                window,
                cookies,
                $filter,
                Login,
                _001_DepBoss);
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
        }])
        .factory('_001_DepBoss', ['$http', function (http) { //工程
            return {
                findAll: function () {
                    return http.get('/api/_001_post_dep_boss_find_all');
                },
            }
        }])
;

    /** @ngInject */
    function LoginCtrl(scope, mHttp, window, cookies, $filter, Login, _001_DepBoss) {
        scope.formData = {};
        scope.loading = false;

        //FIND
        scope.findUser = function() {
            if (scope.formData.email != undefined) {
                scope.loading = true;

                Login.find(scope.formData)
                    .success(function(data) {
                        scope.loading = false;
                        console.log(data);

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
                        cookies.put('depType', data[0].depType);
                        // cookies.put('userMonthSalary', data[0].userMonthSalary);
                        // cookies.put('machineDID', data[0].machineDID);
                        // cookies.put('feature_official_doc', data[0].feature_official_doc);
                        cookies.put('isDepG', false);
                        if (data[0].depType == 'G') {
                            cookies.put('isDepG', true);
                        }

                        console.log('cookies.username= ' + cookies.username);
                        console.log('cookies.username= ' + cookies.get('username'));
                        // window.location.href = 'http://localhost:3000';

                        _001_DepBoss.findAll()
                            .success(function (depBoss) {
                                console.log(depBoss);
                                var result = scope.findDepBoss(data[0]._id, depBoss);
                                console.log(result);
                                console.log(result != null);
                                cookies.put('isDepBoss', result != null);
                                window.location.href = 'https://yuanlong.myasustor.com:8880/';
                            });



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

        scope.findDepBoss = function (did, options) {
            var selected = [];
            if (did) {
                selected = $filter('filter')(options, {
                    userDID: did,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return null;
            }
            return selected[0];
        }

        // sign out
        scope.signOut = function () {
            console.log("sign Out");
            cookies.put('username', null);
            cookies.put('roletype', null);
            cookies.put('userDID', null);
            cookies.put('bossID', null);
            // cookies.put('userMonthSalary', null);
            // cookies.put('machineDID', null);
            cookies.put('email', null);
            cookies.put('isDepBoss', null);
            cookies.put('isDepG', null);
            // cookies.put('feature_official_doc', null);
            window.signOutSucess();
        }

        scope.initLogin = function () {
            console.log("initLogin.");
            cookies.put('username', null);
            cookies.put('roletype', null);
            cookies.put('userDID', null);
            cookies.put('bossID', null);
            // cookies.put('userMonthSalary', null);
            // cookies.put('machineDID', null);
            cookies.put('email', null);
            cookies.put('isDepBoss', null);
            cookies.put('isDepG', null);
            // cookies.put('feature_official_doc', null);
        };


        scope.forgetPWD = function () {
            if (scope.formData.email != undefined) {
                scope.loading = true;

                Login.forgetPWD(scope.formData)
                    .success(function(data) {
                        scope.loading = false;

                        if (data.responseCode == 550) {
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