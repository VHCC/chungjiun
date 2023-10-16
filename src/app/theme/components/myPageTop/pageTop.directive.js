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
            '$filter',
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
            '_001_DepBoss',
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
                                 $filter,
                                 toastr,
                                 User,
                                 Project,
                                 WorkHourUtil,
                                 DateUtil,
                                 window,
                                 NotificationUtil,
                                 NotificationMsgUtil,
                                 RelatedTasksUtil,
                                 document,
                                 _001_DepBoss) {
        console.log(" - cookies.username= " + $cookies.get('username'));
        console.log(" - cookies.userDID= " + $cookies.get('userDID'));
        console.log(" - cookies.roletype= " + $cookies.get('roletype'));
        console.log(" - cookies.bossID= " + $cookies.get('bossID'));
        console.log(" - cookies.depType= " + $cookies.get('depType'));
        console.log(" - cookies.isDepBoss= " + $cookies.get('isDepBoss'));
        console.log(" - cookies.isDepG= " + $cookies.get('isDepG'));
        // console.log(" - cookies.userMonthSalary= " + $cookies.get('userMonthSalary'));

        $scope.username = $cookies.get('username');
        $scope.userDID = $cookies.get('userDID');
        $scope.depType = $cookies.get('depType');




        // 差勤管理
        $rootScope.cgWorkManage = 0;
        $rootScope.workOff_Total = 0;
        $rootScope.hr_Total = 0;
        $rootScope.travelApply_Total = 0;
        $rootScope.workHour_Total = 0;

        // 會計管理
        $rootScope.cgAccountingManage = 0;
        $rootScope.payment_Total = 0;

        // $rootScope.isNeedUpdateRelatedTask = false;

        $scope.initPageTop = function () {
            $scope.roleType = $cookies.get('roletype');

            // if ($cookies.get('bossID') === undefined || $cookies.get('userMonthSalary') === undefined || $cookies.get('userMonthSalary') === 0) {
            //     toastr['error']('您的系統資訊未設定完全，請聯絡 行政人員 設定 !', '系統初步設定 不完全');
            // }

            if ($cookies.get('bossID') === undefined || $cookies.get('depType') === undefined) {
                toastr['error']('您的系統資訊未設定完全，請聯絡 行政人員 設定 !', '系統初步設定 不完全');
            }

            // ============== notification ==============
            User.getAllUsers()
                .success(function (allUsers) {
                    // 主觀相關
                    $scope.relatedUserDIDArray_Boss = [];
                    $scope.relatedUserDIDArray_All = [];
                    if ($scope.roleType === '2' || $scope.roleType === '100' || $scope.roleType === '6' || $scope.roleType === '1') {

                        for (var x = 0; x < allUsers.length; x++) {
                            $scope.relatedUserDIDArray_All.push(allUsers[x]._id)
                            if (allUsers[x].bossID === $scope.userDID) {
                                $scope.relatedUserDIDArray_Boss.push(allUsers[x]._id);
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
                    $cookies.put('relatedUserDIDArray_All', JSON.stringify($scope.relatedUserDIDArray_All));

                    // 工時表
                    $scope.create_formDate_array = [];
                    $scope.create_formDate_array.push(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0));
                    $scope.create_formDate_array.push(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), -7));
                    $scope.create_formDate_array.push(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), -14));
                    $scope.create_formDate_array.push(DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), -21));


                    $scope.managersRelatedProjects = [];
                    var formData = {
                        relatedID: $scope.userDID,
                    }
                    Project.getProjectRelatedToManager(formData)
                        .success(function (relatedProjects) {
                            for(var index = 0; index < relatedProjects.length; index ++) {
                                // 相關專案
                                $scope.managersRelatedProjects.push(relatedProjects[index]._id);
                            }
                            // $cookies.put('managersRelatedProjects', JSON.stringify($scope.managersRelatedProjects));
                            $rootScope.managersRelatedProjects = $scope.managersRelatedProjects;
                            $scope.fetchUserRelatedTasks();
                        })
                });
        };

        // var intervalID = setInterval(getUserRelatedTasks, 180000);
        // var checkUserUUID = setInterval(checkUserUUID, 10000);

        function checkUserUUID() {
            console.log('10 秒鐘又到了！ ===> checkUserUUID...');
            if (decodeURI(readCookie('username')) == '' ||
                decodeURI(readCookie('username')) == 'null' ||
                decodeURI(readCookie('userDID')) == 'null') {
                console.log("checkUserUUID ERROR")
                window.location.href = 'http://localhost:3000/login.html';
            }
        }

        function getUserRelatedTasks() {
            console.log('180 秒鐘又到了！ ===> getUserRelatedTasks...');
            $scope.fetchUserRelatedTasks();
            // $rootScope.isNeedUpdateRelatedTask = false;
        }

        $rootScope.$on("ProxyFetchUserRelatedTasks", function(){
            if (!canFetchFlag) return;
            console.log(" === ProxyFetchUserRelatedTasks === ");
            $scope.fetchUserRelatedTasks();
        });

        var canFetchFlag = false;

        var getData ={};

        $scope.fetchUserRelatedTasks = function () {
            canFetchFlag = false;
            getData = {
                userDID: $cookies.get('userDID'),
                relatedUserDIDArray_Boss: $scope.relatedUserDIDArray_Boss,
                relatedUserDIDArray_Executive: $scope.relatedUserDIDArray_Executive,
                managersRelatedProjects: $scope.managersRelatedProjects,
                create_formDate_array: $scope.create_formDate_array,
            }
            console.log(getData);
            RelatedTasksUtil.fetchRelatedTasks(getData)
                .success(function (resp) {
                    console.log(" ### fetchRelatedTasks ### ");
                    console.log(resp);
                    canFetchFlag = true;
                    // 人員請假
                    $rootScope.workOff_Rejected = resp.payload.workOff_Rejected;
                    $rootScope.workOff_Agent_Tasks = resp.payload.workOff_Agent_Tasks;
                    $rootScope.workOff_Boss_Tasks = resp.payload.workOff_Boss_Tasks;
                    $rootScope.workOff_Executive_Tasks = resp.payload.workOff_Executive_Tasks;
                    $rootScope.workOff_Total = ($rootScope.workOff_Rejected
                        + $rootScope.workOff_Agent_Tasks
                        + $rootScope.workOff_Boss_Tasks
                        + $rootScope.workOff_Executive_Tasks);

                    // 差勤紀錄
                    $rootScope.hrRemedy_Boss_Tasks = resp.payload.hrRemedy_Boss_Tasks;
                    $rootScope.hrRemedy_Rejected = resp.payload.hrRemedy_Rejected;
                    $rootScope.hr_Total = ($rootScope.hrRemedy_Boss_Tasks
                        + $rootScope.hrRemedy_Rejected);

                    // 公差公出
                    $rootScope.travelApply_Rejected = resp.payload.travelApply_Rejected;
                    $rootScope.travelApply_Manager_Tasks = resp.payload.travelApply_Manager_Tasks;
                    $rootScope.travelApply_Boss_Tasks = resp.payload.travelApply_Boss_Tasks;
                    $rootScope.travelApply_Total = ($rootScope.travelApply_Manager_Tasks
                        + $rootScope.travelApply_Rejected
                        + $rootScope.travelApply_Boss_Tasks);

                    // 工時系統
                    $rootScope.workHour_Rejected = resp.payload.workHour_Rejected;
                    $rootScope.workHour_Manager_Tasks = resp.payload.workHour_Manager_Tasks;
                    $rootScope.workHour_Executive_Tasks = resp.payload.workHour_Executive_Tasks;

                    // 工時系統 - 加班申請
                    $rootScope.workOverTime_Manager_Tasks = resp.payload.workOverTime_Manager_Tasks;
                    $rootScope.workOverTime_Rejected = resp.payload.workOverTime_Rejected;

                    $rootScope.workHour_Total = $rootScope.workHour_Rejected
                        + $rootScope.workHour_Manager_Tasks
                        + $rootScope.workHour_Executive_Tasks
                        + $rootScope.workOverTime_Manager_Tasks
                        + $rootScope.workOverTime_Rejected;

                    // $$ 差勤管理
                    $rootScope.cgWorkManage = $rootScope.workOff_Total
                        + $rootScope.hr_Total
                        + $rootScope.travelApply_Total
                        + $rootScope.workHour_Total;


                    // 墊付款
                    $rootScope.payment_Manager_Tasks = resp.payload.payment_Manager_Tasks;
                    $rootScope.payment_Executive_Tasks = resp.payload.payment_Executive_Tasks;
                    if ($scope.userDID === '5d197f16a6b04756c893a162') {
                        $rootScope.payment_Executive_Tasks = 0;
                    }
                    $rootScope.payment_Rejected = resp.payload.payment_Rejected;
                    $rootScope.payment_Total = $rootScope.payment_Manager_Tasks
                        + $rootScope.payment_Executive_Tasks
                        + $rootScope.payment_Rejected;

                    // $$ 會計管理
                    $rootScope.cgAccountingManage = $rootScope.payment_Total;

                })
                .error(function (err) {
                    console.log(err)
                })
        }

        $scope.showDepType = function (depType) {
            switch (depType) {
                case "A":
                    return "老闆";
                case "B":
                    return "主管部";
                case "C":
                    return "設計部";
                case "D1":
                    return "監造部-1";
                case "D2":
                    return "監造部-2";
                case "D3":
                    return "監造部-3";
                case "D4":
                    return "監造部-4";
                case "E":
                    return "專管部";
                case "F":
                    return "測量部";
                case "G":
                    return "管理部";
                default:
                    return "尚未設定"
            }
        }

    }

})();