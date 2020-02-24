/**
 * @author IChen.Chu
 * created on 16.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('myPageTop', MyPageTop)
        .controller('myPageTopController', [
            '$scope',
            '$cookies',
            'toastr',
            'User',
            'Project',
            'WorkHourUtil',
            'DateUtil',
            '$window',
            'NotificationUtil',
            'NotificationMsgUtil',
            '$document',
            MyPageTopController]);

    /** @ngInject */
    function MyPageTop() {
        return {
            restrict: 'E',
            templateUrl: 'app/theme/components/myPageTop/pageTop.html'
        };
    }

    function MyPageTopController($scope,
                                 $cookies,
                                 toastr,
                                 User,
                                 Project,
                                 WorkHourUtil,
                                 DateUtil,
                                 window,
                                 NotificationUtil,
                                 NotificationMsgUtil,
                                 document) {
        console.log(" - cookies.username= " + $cookies.get('username'));
        console.log(" - cookies.userDID= " + $cookies.get('userDID'));
        console.log(" - cookies.roletype= " + $cookies.get('roletype'));
        console.log(" - cookies.bossID= " + $cookies.get('bossID'));
        console.log(" - cookies.userMonthSalary= " + $cookies.get('userMonthSalary'));

        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');

        $scope.initPageTop = function () {
            var roleType = $cookies.get('roletype');
            $scope.roleType = roleType;

            if ($cookies.get('bossID') === undefined || $cookies.get('userMonthSalary') === undefined || $cookies.get('userMonthSalary') === 0) {
                toastr['error']('您的系統資訊未設定完全，請聯絡 行政人員 設定 !', '系統初步設定 不完全');
            }

            // if (roleType !== '100') {
            //     var entrance = window.document.getElementById('registerEntrance');
            //     entrance.parentNode.removeChild(entrance);
            // }

            // ============== notification ==============
        };
    }

})();