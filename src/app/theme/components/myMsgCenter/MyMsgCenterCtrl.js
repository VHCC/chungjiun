/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('MyMsgCenterCtrl',
            [
                '$scope',
                '$sce',
                '$cookies',
                'User',
                'Project',
                'WorkHourUtil',
                'DateUtil',
                MyMsgCenterCtrl
            ]);

    /** @ngInject */
    function MyMsgCenterCtrl($scope,
                             $sce,
                             $cookies,
                             User,
                             Project,
                             WorkHourUtil,
                             DateUtil) {

        var vm = this;

        $scope.roleType = $cookies.get('roletype');

        // 所有人，對照資料
        // User.getAllUsers()
        //     .success(function (allUsers) {
        //         vm.executiveUsers_bg = allUsers;
        //
        //         // var intervalID = setInterval(fetchManager, 17000);
        //         // var intervalID = setInterval(fetchExecutive, 13000);
        //         function fetchManager() {
        //
        //             if ($scope.roleType == 2) {
        //                 $scope.fetchManagerRelatedMembers_bg();
        //             }
        //
        //             if ($scope.roleType == 100) {
        //                 console.log($scope);
        //                 $scope.fetchManagerRelatedMembers_bg();
        //             }
        //
        //             console.log('5秒鐘又到了！');
        //         }
        //
        //         function fetchExecutive() {
        //
        //             if ($scope.roleType == 100) {
        //                 $scope.fetchExecutiveRelatedMembers_bg();
        //             }
        //
        //             console.log('10秒鐘又到了！');
        //         }
        //
        //     });

        $scope.managerNotification = 0;
        $scope.executiveNotification = 0;

        // ============== notification ==============

        $scope.firstFullDate_manager_bg = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);
        $scope.firstFullDate_executive_bg = DateUtil.getShiftDatefromFirstDate(DateUtil.getFirstDayofThisWeek(moment()), 0);

        var typeManager = 1;
        var typeExecutive = 2;


        // loginUser's relatedMembers.
        $scope.loginUsersRelatedMembers = null;

        var managersRelatedProjects_bg = [];

        //顯示經理審查人員
        // Fetch Manager Related Members
        $scope.fetchManagerRelatedMembers_bg = function () {
            var formData = {
                relatedID: $cookies.get('userDID'),
            }
            var relatedMembers = [];
            Project.getProjectRelatedToManager(formData)
                .success(function (relatedProjects) {
                    // console.log(relatedProjects);
                    for (var index = 0; index < relatedProjects.length; index++) {
                        // 相關專案
                        managersRelatedProjects_bg.push(relatedProjects[index]._id);
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
                    relatedMembers.push($cookies.get('userDID'));
                    $scope.loginUsersRelatedMembers_m = relatedMembers;
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
            $scope.loginUsersRelatedMembers_e = relatedMembers;
            $scope.showRelatedMembersTableReview_bg(typeExecutive);
        }

        // show Related Members Table Review.
        $scope.showRelatedMembersTableReview_bg = function (type) {

            var targetFormFullDate = undefined;

            $scope.userMap_review_bg = [];

            $scope.tables_review_bg = [];
            //紀錄 manager, executive review data.
            $scope.tables_review_bg.tablesItems = [];

            switch (type) {
                case typeManager: {
                    console.log("firstFullDate_manager_bg= " + $scope.firstFullDate_manager_bg);

                    $scope.usersReviewForManagers_bg = [];

                    targetFormFullDate = $scope.firstFullDate_manager_bg;
                }
                break;
                case typeExecutive: {
                    console.log("firstFullDate_executive_bg= " + $scope.firstFullDate_executive_bg);

                    $scope.usersReviewForExecutive_bg = [];

                    targetFormFullDate = $scope.firstFullDate_executive_bg;
                }
                break;
            }

            var getData = {
                relatedMembers: type == typeManager ? $scope.loginUsersRelatedMembers_m : $scope.loginUsersRelatedMembers_e,
                create_formDate: "2019/03/18",
                // create_formDate: targetFormFullDate,
            }

            console.log(getData);

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

                                evalString = "$scope.tables_review_bg['" + res.payload[formIndex].creatorDID + "'] = []";
                                eval(evalString);

                                evalString = "$scope.userMap_review_bg['" + res.payload[formIndex].creatorDID + "'] = []";
                                eval(evalString);

                            }
                        }
                        existDIDArray = [];
                        // push items

                        for (var formIndex = 0; formIndex < res.payload.length; formIndex++) {
                            var isProjectIncluded = false;
                            inter:
                                for (var tablesIndex = 0; tablesIndex < res.payload[formIndex].formTables.length; tablesIndex++) {
                                    if (managersRelatedProjects_bg.includes(res.payload[formIndex].formTables[tablesIndex].prjDID) || type == 2 || type == 6) { // 行政總管跟每個人都有關, 經理只跟專案掛鉤
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
                                        evalString = "manipulateObject = $scope.tables_review_bg['" + res.payload[formIndex].creatorDID + "']";
                                        eval(evalString);
                                        manipulateObject.push(res.payload[formIndex]);

                                        if (!existDIDArray.includes(res.payload[formIndex].creatorDID)) {
                                            existDIDArray.push(res.payload[formIndex].creatorDID);
                                            evalString = "$scope.userMap_review_bg['" + res.payload[formIndex].creatorDID + "'] = relatedUsersAndTables[userIndex]";
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
                                if (managersRelatedProjects_bg.includes(res.payload[index].prjDID) || type == 2) {
                                    var mUser = $scope.fetchReviewUserFromScope(res.creatorDID);
                                    if (res.payload.length > 0) {
                                        if (!userDIDExistArray.includes(mUser.DID)) {
                                            userResult.push(mUser);
                                            userDIDExistArray.push(mUser.DID);
                                        }
                                    }

                                }
                            }

                            switch (type) {
                                case typeManager:
                                    // console.log(userResult.length);
                                    $scope.managerNotification = userResult.length;
                                    switch ($scope.roleType) {
                                        case "2":
                                            $scope.messages[0].text = "經理：" + $scope.managerNotification;
                                            break;
                                        case "100":
                                            $scope.messages[0].text = "經理：" + $scope.managerNotification + ", 行政總管：" + $scope.executiveNotification;
                                            break;
                                    }
                                    // $scope.usersReviewForManagers = userResult;
                                    break;
                                case typeExecutive:
                                    $scope.executiveNotification = userResult.length;
                                    // console.log(userResult.length);
                                    $scope.messages[0].text = "經理：" + $scope.managerNotification + ", 行政總管：" + $scope.executiveNotification;
                                    // $scope.usersReviewForExecutive = userResult;
                                    break;
                            }
                        })
                }
            }
        }

        $scope.fetchReviewUserFromScope = function (userDID) {
            return $scope.userMap_review_bg[userDID] === undefined ? [] : $scope.userMap_review_bg[userDID];
        }

        $scope.getTotalMsg = function() {
            return $scope.executiveNotification + $scope.managerNotification;
        }


        // ==================== original code ====================
        $scope.users = {
            0: {
                name: 'Vlad',
            },
            1: {
                name: 'Kostya',
            },
            2: {
                name: 'Andrey',
            },
            3: {
                name: 'Nasta',
            }
        };

        // $scope.notifications = [
        //     {
        //         userId: 0,
        //         template: '&name posted a new article.',
        //         time: '1 min ago'
        //     },
        //     {
        //         userId: 1,
        //         template: '&name changed his contact information.',
        //         time: '2 hrs ago'
        //     },
        //     {
        //         image: 'assets/img/shopping-cart.svg',
        //         template: 'New orders received.',
        //         time: '5 hrs ago'
        //     },
        //     {
        //         userId: 2,
        //         template: '&name replied to your comment.',
        //         time: '1 day ago'
        //     },
        //     {
        //         userId: 3,
        //         template: 'Today is &name\'s birthday.',
        //         time: '2 days ago'
        //     },
        //     {
        //         image: 'assets/img/comments.svg',
        //         template: 'New comments on your post.',
        //         time: '3 days ago'
        //     },
        //     {
        //         userId: 1,
        //         template: '&name invited you to join the event.',
        //         time: '1 week ago'
        //     }
        // ];

        $scope.messages = [
            {
                userId: 3,
                text: "資料讀取中，請稍候",
                // time: '1 min ago',
                type: '工時表'
            },
            {
                userId: 0,
                text: "資料讀取中，請稍候",
                // time: '2 hrs ago',
                type: '人員請假'
            }
            // {
            //     userId: 1,
            //     text: 'Want to request new icons? Here\'s how. Need vectors or want to use on the...',
            //     time: '10 hrs ago',
            //     type: '工時表'
            // },
            // {
            //     userId: 2,
            //     text: 'Explore your passions and discover new ones by getting involved. Stretch your...',
            //     time: '1 day ago',
            //     type: '工時表'
            // },
            // {
            //     userId: 3,
            //     text: 'Get to know who we are - from the inside out. From our history and culture, to the...',
            //     time: '1 day ago',
            //     type: '工時表'
            // },
            // {
            //     userId: 1,
            //     text: 'Need some support to reach your goals? Apply for scholarships across a variety of...',
            //     time: '2 days ago',
            //     type: '工時表'
            // },
            // {
            //     userId: 0,
            //     text: 'Wrap the dropdown\'s trigger and the dropdown menu within .dropdown, or...',
            //     time: '1 week ago',
            //     type: '工時表'
            // }
        ];

        $scope.getMessage = function (msg) {
            var text = msg.template;
            if (msg.userId || msg.userId === 0) {
                text = text.replace('&name', '<strong>' + $scope.users[msg.userId].name + '</strong>');
            }
            return $sce.trustAsHtml(text);
        };
    }
})();