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
                'NotificationMsgUtil',
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
                             NotificationMsgUtil,
                             DateUtil) {

        var vm = this;

        $scope.roleType = $cookies.get('roletype');

        $scope.fetchNotification = function () {
            var getData = {
                creatorDID: $cookies.get('userDID'),
            }
            NotificationMsgUtil.fetchMsgItemsByUserDID(getData)
                .success(function (res) {
                    console.log(res);
                    $scope.messages = [];
                    for (var index = 0; index < res.payload.length; index ++) {
                        var msgItem = {};
                        msgItem.text = res.payload[index].creatorDID
                        msgItem.type = res.payload[index].msgActionTopic
                        $scope.messages.push(msgItem);
                    }
                })
        }


        var intervalID = setInterval(getNotificationMsg, 10000);

        function getNotificationMsg() {

            $scope.fetchNotification();

            console.log('10 秒鐘又到了！');
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