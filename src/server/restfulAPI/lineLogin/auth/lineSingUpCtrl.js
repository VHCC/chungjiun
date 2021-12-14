/**
 * @author iChen.Chu
 * created on 2021/12/09
 */
    angular.module('lineSingUpCtrl', ['ngCookies'])
        .controller('lineSingUpController', [
            '$scope',
            '$http',
            '$window',
            '$cookies',
            'vhcSignUpViaLine',
            function (
                scope,
                http,
                window,
                cookies,
                vhcSignUpViaLine) {
            return new LineSingUpCtrl(
                scope,
                http,
                window,
                cookies,
                vhcSignUpViaLine);
        }])
        .factory('vhcSignUpViaLine', ['$http', function(http) {
            return {
                checkEmail : function(userData) {
                    return http.post('/api/emailCheck', userData);
                },
                insertToDB : function(userData) {
                    return http.post('/api/addVhcMemberViaLine', userData);
                }
            }
        }]);

    /** @ngInject */
    function LineSingUpCtrl($scope, mHttp, window, cookies, LineUtil) {
        $scope.formData = {};
        $scope.loading = false;

        $scope.vhcSignUp = function(lineInfo) {
            console.log(lineInfo)
            // console.log($scope.formData);
            LineUtil.checkEmail(lineInfo)
                .success(function (res) {
                    console.log(res.payload.length);
                    if (res.payload.length == 0 ) {
                        LineUtil.insertToDB(lineInfo)
                            .success(function (res) {
                                console.log(res);
                                window.signUpSuccess();
                            })
                    } else {
                        window.userExist();
                    }
                })
        }

    }