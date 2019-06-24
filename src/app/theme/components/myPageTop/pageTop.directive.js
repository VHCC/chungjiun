/**
 * @author IChen.Chu
 * created on 16.02.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('myPageTop', myPageTop)
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
            '$document',
            function (scope,
                      cookies,
                      toastr,
                      User,
                      Project,
                      WorkHourUtil,
                      DateUtil,
                      window,
                      NotificationUtil,
                      document) {
                return new myPageTopController(
                    scope,
                    cookies,
                    toastr,
                    User,
                    Project,
                    WorkHourUtil,
                    DateUtil,
                    window,
                    NotificationUtil,
                    document)
            }]);

    /** @ngInject */
    function myPageTop() {
        return {
            restrict: 'E',
            templateUrl: 'app/theme/components/myPageTop/pageTopVhc.html'
        };
    }

    function myPageTopController($scope,
                                 cookies,
                                 toastr,
                                 User,
                                 Project,
                                 WorkHourUtil,
                                 DateUtil,
                                 window,
                                 NotificationUtil,
                                 document) {
        console.log(" - cookies.username= " + cookies.get('username'));
        console.log(" - cookies.userDID= " + cookies.get('userDID'));
        console.log(" - cookies.roletype= " + cookies.get('roletype'));
        console.log(" - cookies.bossID= " + cookies.get('bossID'));
        console.log(" - cookies.userMonthSalary= " + cookies.get('userMonthSalary'));

        $scope.username = cookies.get('username');
        $scope.userDID = cookies.get('userDID');

        $scope.managerNotification = 0;
        $scope.executiveNotification = 0;

        $scope.initPageTop = function () {
            // console.log("initPageTop.");
            var roleType = cookies.get('roletype');
            $scope.roleType = roleType;

            if (cookies.get('bossID') === undefined || cookies.get('userMonthSalary') === undefined || cookies.get('userMonthSalary') === 0) {
                toastr['error']('您的系統資訊未設定完全，請聯絡 行政人員 設定 !', '系統初步設定 不完全');
            }

            if (roleType !== '100') {
                var entrance = window.document.getElementById('registerEntrance');
                entrance.parentNode.removeChild(entrance);
            }

            // var socket = io('http://localhost:9000');

            // socket.on("greet", function (msg) {
            //     NotificationUtil.showMsg('Notification', msg, 2);
            //
            // });

            // NotificationUtil.showMsg('歡迎使用　崇峻系統', '瀏覽器通知系統　已啟用', 1);


            // ============== notification ==============

            $scope.firstFullDate_manager = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);

            var typeManager = 1;
            var typeExecutive = 2;


            // loginUser's relatedMembers.
            $scope.loginUsersRelatedMembers = null;

            var managersRelatedProjects = [];

            //顯示經理審查人員
            // Fetch Manager Related Members
            $scope.fetchManagerRelatedMembers_bg = function () {
                var formData = {
                    relatedID: cookies.get('userDID'),
                }
                var relatedMembers = [];
                Project.getProjectRelatedToManager(formData)
                    .success(function (relatedProjects) {
                        // console.log(relatedProjects);
                        for (var index = 0; index < relatedProjects.length; index++) {
                            // 相關專案
                            managersRelatedProjects.push(relatedProjects[index]._id);
                            //主辦
                            if (relatedProjects[index].majorID !== undefined && !relatedMembers.includes(relatedProjects[index].majorID)) {
                                relatedMembers.push(relatedProjects[index].majorID);
                            }
                            //協辦
                            if (relatedProjects[index].workers.length !== 0) {
                                for (var subIndex = 0; subIndex < relatedProjects[index].workers.length; subIndex++) {
                                    if (!relatedMembers.includes(relatedProjects[index].workers[subIndex])) {
                                        relatedMembers.push(relatedProjects[index].workers[subIndex]);
                                    }
                                }
                            }
                        }
                        relatedMembers.push(cookies.get('userDID'));
                        $scope.loginUsersRelatedMembers = relatedMembers;
                        $scope.showRelatedMembersTableReview_bg(typeManager);
                    })
            }

            //顯示行政審查人員
            // Fetch Executive Related Members
            $scope.fetchExecutiveRelatedMembers_bg = function () {
                var relatedMembers = [];
                // 行政總管跟每個人都有關
                for (var index = 0; index < vm.executiveUsers_bg.length; index++) {
                    relatedMembers.push(vm.executiveUsers_bg[index]._id);
                }
                $scope.loginUsersRelatedMembers = relatedMembers;
                $scope.showRelatedMembersTableReview_bg(typeExecutive);
            }

            // show Related Members Table Review.
            $scope.showRelatedMembersTableReview_bg = function (type) {

                var targetFormFullDate = undefined;

                $scope.userMap_review = [];

                $scope.tables_review = [];
                //紀錄 manager, executive review data.
                $scope.tables_review.tablesItems = [];

                switch (type) {
                    case typeManager: {
                        console.log("firstFullDate_manager= " + $scope.firstFullDate_manager);

                        $scope.usersReviewForManagers = [];

                        targetFormFullDate = $scope.firstFullDate_manager;
                    }
                        break;
                    case typeExecutive: {
                        console.log("firstFullDate_executive= " + $scope.firstFullDate_executive_bg);

                        $scope.usersReviewForExecutive = [];

                        targetFormFullDate = $scope.firstFullDate_executive_bg;
                    }
                        break;
                }

                var getData = {
                    relatedMembers: $scope.loginUsersRelatedMembers,
                    create_formDate: "2019/03/18",
                    // create_formDate: targetFormFullDate,
                }

                // console.log(getData);

                WorkHourUtil.getWorkHourFormMultiple(getData)
                    .success(function (res) {
                        var relatedUsersAndTables = [];
                        // 一個UserDID只有一個物件
                        var existDIDArray = [];
                        if (res.payload.length > 0) {
                            // console.log("forms= " + res.payload.length);
                            // console.log(res.payload);
                            // users
                            for (var formIndex = 0; formIndex < res.payload.length; formIndex++) {

                                var userObject = undefined;
                                var evalString = "userObject = {'" + res.payload[formIndex].creatorDID + "': []}";
                                eval(evalString);
                                // customized
                                userObject.DID = res.payload[formIndex].creatorDID;
                                // switch (type) {
                                //     case typeManager:
                                //         userObject.crossDay = $scope.checkIsCrossMonth($scope.firstFullDate_manager);
                                //         break;
                                //     case typeExecutive:
                                //         userObject.crossDay = $scope.checkIsCrossMonth($scope.firstFullDate_executive);
                                //         break;
                                // }
                                if (!existDIDArray.includes(res.payload[formIndex].creatorDID)) {
                                    relatedUsersAndTables.push(userObject);
                                    existDIDArray.push(res.payload[formIndex].creatorDID);

                                    evalString = "$scope.tables_review['" + res.payload[formIndex].creatorDID + "'] = []";
                                    eval(evalString);

                                    evalString = "$scope.userMap_review['" + res.payload[formIndex].creatorDID + "'] = []";
                                    eval(evalString);

                                }
                            }
                            existDIDArray = [];
                            // push items

                            for (var formIndex = 0; formIndex < res.payload.length; formIndex++) {
                                var isProjectIncluded = false;
                                inter:
                                    for (var tablesIndex = 0; tablesIndex < res.payload[formIndex].formTables.length; tablesIndex++) {
                                        if (managersRelatedProjects.includes(res.payload[formIndex].formTables[tablesIndex].prjDID) || type == 2 || type == 6) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
                                            isProjectIncluded = true;
                                            break inter;
                                        }
                                    }
                                if (isProjectIncluded) {
                                    for (var userIndex = 0; userIndex < relatedUsersAndTables.length; userIndex++) {
                                        if (res.payload[formIndex].creatorDID === relatedUsersAndTables[userIndex].DID) {
                                            var manipulateObject = undefined;
                                            var evalString = "manipulateObject = relatedUsersAndTables[" + userIndex + "]['" + res.payload[formIndex].creatorDID + "']";
                                            eval(evalString);
                                            manipulateObject.push(res.payload[formIndex]);
                                            evalString = "manipulateObject = $scope.tables_review['" + res.payload[formIndex].creatorDID + "']";
                                            eval(evalString);
                                            manipulateObject.push(res.payload[formIndex]);

                                            if (!existDIDArray.includes(res.payload[formIndex].creatorDID)) {
                                                existDIDArray.push(res.payload[formIndex].creatorDID);
                                                evalString = "$scope.userMap_review['" + res.payload[formIndex].creatorDID + "'] = relatedUsersAndTables[userIndex]";
                                                eval(evalString);
                                            }
                                        }
                                    }
                                }

                            }
                            switch (type) {
                                case typeManager:
                                    $scope.checkUserReviewStatus_bg(relatedUsersAndTables, false, null, type);
                                    break;
                                case typeExecutive:
                                    $scope.checkUserReviewStatus_bg(relatedUsersAndTables, true, false, type);
                                    break;
                            }

                        }
                    })
            }

            // 檢查該使用者是否有提交合規則的表單
            $scope.checkUserReviewStatus_bg = function (userTables
                , isFindManagerCheckFlag
                , isFindExecutiveCheck
                , type) {
                var userResult = [];
                var userDIDExistArray = [];
                for (var userIndex = 0; userIndex < userTables.length; userIndex++) {
                    var user = userTables[userIndex];

                    var tablesLength = user[user.DID].length;
                    for (var majorIndex = 0; majorIndex < tablesLength; majorIndex++) {

                        var workItemCount = user[user.DID][majorIndex].formTables.length;
                        var workTableIDArray = [];
                        // 組成 prjID Array, TableID Array，再去Server要資料
                        for (var index = 0; index < workItemCount; index++) {
                            workTableIDArray[index] = user[user.DID][majorIndex].formTables[index].tableID;
                        }

                        var formDataTable = {
                            creatorDID: user.DID,
                            tableIDArray: workTableIDArray,
                            isFindSendReview: true,
                            isFindManagerCheck: isFindManagerCheckFlag,
                            isFindExecutiveCheck: isFindExecutiveCheck,
                            isFindManagerReject: null,
                            isFindExecutiveReject: null
                        }
                        // console.log(formDataTable);
                        // 取得 Table Data
                        WorkHourUtil.findWorkHourTableFormByTableIDArray(formDataTable)
                            .success(function (res) {
                                // 填入表單資訊
                                // console.log(res.payload);

                                for (var index = 0; index < res.payload.length; index++) {
                                    // console.log(res.payload[index].prjDID);
                                    if (managersRelatedProjects.includes(res.payload[index].prjDID) || type == 2) {
                                        var mUser = $scope.fetchReviewUserFromScope(res.creatorDID);
                                        if (res.payload.length > 0) {
                                            if (!userDIDExistArray.includes(mUser.DID)) {
                                                userResult.push(mUser);
                                                userDIDExistArray.push(mUser.DID);
                                            }
                                        }
                                        switch (type) {
                                            case typeManager:
                                                console.log(userResult);
                                                // console.log(userResult.length);
                                                $scope.managerNotification = userResult.length;
                                                // $scope.usersReviewForManagers = userResult;
                                                break;
                                            case typeExecutive:
                                                console.log(userResult);
                                                $scope.executiveNotification = userResult.length;
                                                // $scope.usersReviewForExecutive = userResult;
                                                break;
                                        }
                                    }
                                }
                            })
                    }
                }
            }

            $scope.fetchReviewUserFromScope = function (userDID) {
                return $scope.userMap_review[userDID] === undefined ? [] : $scope.userMap_review[userDID];
            }


            // var intervalID = setInterval(myAlert, 5000);

            // function myAlert() {
            //
            //     if (roleType == 2) {
            //         $scope.fetchManagerRelatedMembers_bg();
            //     }
            //
            //     if (roleType == 100) {
            //         $scope.fetchManagerRelatedMembers_bg();
            //         $scope.fetchExecutiveRelatedMembers_bg();
            //     }
            //
            //     console.log('5秒鐘又到了！');
            // }

        };

    }

})();