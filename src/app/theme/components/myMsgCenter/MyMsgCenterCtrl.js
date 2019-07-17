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
                    var msgQueue = [];
                    for (var index = 0; index < res.payload.length; index ++) {
                        var msgItem = {};
                        msgItem.creatorDID = res.payload[index].creatorDID;
                        msgItem._id = res.payload[index]._id;
                        msgItem.creatorInfo = res.payload[index]._user_info[0];
                        msgItem.topic = res.payload[index].msgActionTopic;
                        msgItem.detail = res.payload[index].msgActionDetail;
                        msgItem.msgMemo = res.payload[index].msgMemo;
                        msgItem.isRead = res.payload[index].isRead;
                        // msgItem.timestamp = new Date(res.payload[index].timestamp);
                        msgItem.timeDiff = GetDateDiff(new Date(res.payload[index].timestamp), new Date(), "minute");
                        msgItem.text = getMsgText(msgItem.topic, msgItem.detail, msgItem.msgMemo);
                        // $scope.messages.push(msgItem);
                        msgQueue.push(msgItem);
                    }

                    $scope.messages = msgQueue.slice(0);
                })
        }

        $scope.fetchNotification();
        var intervalID = setInterval(getNotificationMsg, 10000);

        function getNotificationMsg() {
            $scope.messages = [];
            $scope.fetchNotification();

            // console.log('10 秒鐘又到了！');
        }

        function getMsgText(msgTopic, msgDetail, msgMemo) {
            switch (msgTopic){
                case 1000:
                    switch (msgDetail) {
                        case 1001: {
                            return " 寄送 " + msgMemo + " 工時表給您 [經理/主任審核]"
                        }
                        case 1002: {
                            return " 的 " + msgMemo + " 工時表提交給您 [行政確認]"
                        }
                        case 1003: {
                            return " [經理/主任] 退還 " + msgMemo + " 工時表給您"
                        }
                        case 1004: {
                            return " [行政總管] 退還 " + msgMemo + " 工時表給您"
                        }
                        case 1005: {
                            return " [行政總管] 確認完成 您 " + msgMemo + " 的工時表"
                        }
                    }
                case 2000:
                    switch (msgDetail) {
                        case 2001: {
                            return " 寄送 " + msgMemo + " 請假單給您 [主管審核]"
                        }
                        case 2002: {
                            return " 的 " + msgMemo + " 請假單提交給您 [行政確認]"
                        }
                        case 2003: {
                            return " [主管] 退還 " + msgMemo + " 請假單給您"
                        }
                        case 2004: {
                            return " [行政總管] 退還 " + msgMemo + " 請假單給您"
                        }
                        case 2005: {
                            return " [行政總管] 確認完成 您 " + msgMemo + " 的請假單"
                        }
                    }
            }
        }

        $scope.unReadMsg = function () {
            var count = 0;
            for (var index = 0; index < $scope.messages.length; index ++) {
                if (!$scope.messages[index].isRead) {
                    count++;
                }
            }
            return count;
        }

        $scope.allMsgRead = function() {
            var msgIDs = [];
            for (var index = 0; index < $scope.messages.length; index ++) {
                if (!$scope.messages[index].isRead) {
                    msgIDs.push($scope.messages[index]._id)
                }
            }

            var getData = {
                msgIDs: msgIDs,
            }

            NotificationMsgUtil.updateMsgItemAll(getData)
                .success(function (req) {
                    $scope.fetchNotification();
                })
        }

        $scope.readMsg = function (dom) {
            // console.log(dom);
            dom.msg.isRead = true;
            var getData = {
                msgID: dom.msg._id,
            }
            NotificationMsgUtil.updateMsgItem(getData)
                .success(function (req) {
                    console.log(req);
                })
        }

        /*
            * 獲得時間差,時間格式為 年-月-日 小時:分鐘:秒 或者 年/月/日 小時：分鐘：秒
            * 其中，年月日為全格式，例如 ： 2010-10-12 01:00:00
            * 返回精度為：秒，分，小時，天
            */
        function GetDateDiff(startTime, endTime, diffType) {
            var timeUnits = "";
            //將xxxx-xx-xx的時間格式，轉換為 xxxx/xx/xx的格式
//             startTime = startTime.replace(/\-/g, "/");
//             endTime = endTime.replace(/\-/g, "/");
            //將計算間隔類性字元轉換為小寫
            diffType = diffType.toLowerCase();
            var sTime = new Date(startTime); //開始時間
            var eTime = new Date(endTime); //結束時間
            // console.log(sTime);
            // console.log(eTime);
            //作為除數的數字
            var divNum = 1;
            var result;
            switch (diffType) {
                case "second":
                    divNum = 1000;
                    timeUnits = " 秒前";
                    break;
                case "minute":
                    divNum = 1000 * 60;
                    timeUnits = " 分鐘前";
                    result = parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)) < 60
                        ? parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)) : GetDateDiff(startTime, endTime, "hour");
                    break;
                case "hour":
                    divNum = 1000 * 3600;
                    timeUnits = " 小時前";
                    result = parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)) < 24
                        ? parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)) : GetDateDiff(startTime, endTime, "day");
                    break;
                case "day":
                    divNum = 1000 * 3600 * 24;
                    timeUnits = " 日前";
                    result = parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
                    break;
                default:
                    break;
            }
            // console.log(sTime.getTime());
            // console.log(eTime.getTime());
            // console.log(diffType);
            // console.log(result);
            return result + timeUnits;
        }

    }
})();