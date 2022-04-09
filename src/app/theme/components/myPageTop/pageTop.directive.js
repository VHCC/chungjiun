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
            '$rootScope',
            '$cookies',
            'toastr',
            'User',
            'Project',
            'WorkHourUtil',
            'DateUtil',
            '$window',
            'NotificationUtil',
            'NotificationMsgUtil',
            'RelatedTasksUtil',
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
                                 $rootScope,
                                 $cookies,
                                 toastr,
                                 User,
                                 Project,
                                 WorkHourUtil,
                                 DateUtil,
                                 window,
                                 NotificationUtil,
                                 NotificationMsgUtil,
                                 RelatedTasksUtil,
                                 document) {
        console.log(" - cookies.username= " + $cookies.get('username'));
        console.log(" - cookies.userDID= " + $cookies.get('userDID'));
        console.log(" - cookies.roletype= " + $cookies.get('roletype'));
        console.log(" - cookies.bossID= " + $cookies.get('bossID'));
        console.log(" - cookies.userMonthSalary= " + $cookies.get('userMonthSalary'));

        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');

        $rootScope.workOff_Total = 0;

        // $rootScope.isNeedUpdateRelatedTask = false;

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
            User.getAllUsers()
                .success(function (allUsers) {
                    // 主觀相關
                    $scope.relatedUserDIDArray_Boss = [];
                    if ($scope.roleType === '2' || $scope.roleType === '100' || $scope.roleType === '6' || $scope.roleType === '1') {

                        for (var x = 0; x < allUsers.length; x++) {
                            if (allUsers[x].bossID === $scope.userDID) {
                                $scope.relatedUserDIDArray_Boss.push(allUsers[x]._id)
                            }
                        }
                    }

                    // 行政相關
                    $scope.relatedUserDIDArray_Executive = [];
                    if ($scope.roleType === '100' || $scope.userDID == '5d197f16a6b04756c893a162') {
                        for (var index = 0; index < allUsers.length; index++) {
                            $scope.relatedUserDIDArray_Executive.push(allUsers[index]._id)
                        }
                    }

                    $cookies.put('relatedUserDIDArray_Boss', JSON.stringify($scope.relatedUserDIDArray_Boss));
                    $cookies.put('relatedUserDIDArray_Executive', JSON.stringify($scope.relatedUserDIDArray_Executive));

                });
        };

        // var intervalID = setInterval(getUserRelatedTasks, 10000);

        function getUserRelatedTasks() {
            console.log('10 秒鐘又到了！ ===> getUserRelatedTasks...');
            $scope.fetchUserRelatedTasks();
            // $rootScope.isNeedUpdateRelatedTask = false;
        }

        $rootScope.$on("ProxyFetchUserRelatedTasks", function(){
            console.log(" === ProxyFetchUserRelatedTasks === ");
            $scope.fetchUserRelatedTasks();
        });

        $scope.fetchUserRelatedTasks = function () {
            var getData = {
                userDID: $cookies.get('userDID'),
                relatedUserDIDArray_Boss: $scope.relatedUserDIDArray_Boss,
                relatedUserDIDArray_Executive: $scope.relatedUserDIDArray_Executive,
            }
            RelatedTasksUtil.fetchRelatedTasks(getData)
                .success(function (resp) {
                    console.log(resp);

                    $rootScope.workOff_Rejected = resp.payload.workOff_Rejected;
                    $rootScope.workOff_Agent_Tasks = resp.payload.workOff_Agent_Tasks;
                    $rootScope.workOff_Boss_Tasks = resp.payload.workOff_Boss_Tasks;
                    $rootScope.workOff_Executive_Tasks = resp.payload.workOff_Executive_Tasks;
                    $rootScope.workOff_Total = ($rootScope.workOff_Rejected
                        + $rootScope.workOff_Agent_Tasks
                        + $rootScope.workOff_Boss_Tasks
                        + $rootScope.workOff_Executive_Tasks);
                })
                .error(function (err) {
                    console.log(err)
                })
        }



    }

})();