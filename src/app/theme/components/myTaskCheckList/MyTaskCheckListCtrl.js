/**
 * @author Frank.Chu
 * created on 28.03.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('MyTaskCheckListCtrl',
            [
                '$scope',
                '$sce',
                '$cookies',
                'User',
                'Project',
                'WorkHourUtil',
                'NotificationMsgUtil',
                'TaskCheckListUtil',
                'DateUtil',
                MyTaskCheckListCtrl
            ]);

    /** @ngInject */
    function MyTaskCheckListCtrl($scope,
                             $sce,
                             $cookies,
                             User,
                             Project,
                             WorkHourUtil,
                             NotificationMsgUtil,
                             TaskCheckListUtil,
                             DateUtil) {

        var vm = this;

        $scope.roleType = $cookies.get('roletype');

        function init (){
            $scope.wh_manager = "loading..."
            $scope.wh_executive = "loading..."
        }

        init();


        $scope.fetchCheckList = function() {
            console.log("userDID= " + $cookies.get('userDID'))
            init()
            // var formData = {
            //     managerDID: $cookies.get('userDID'),
            //     isManagerCheck: true
            // }
            //
            // TaskCheckListUtil.fetchManagerWorkHourUnCheckedList(formData)
            //     .success(function (resp) {
            //         console.log(resp)
            //     })
            if ($scope.roleType == 2 || $scope.roleType == 6 || $scope.roleType == 100 || $scope.roleType == 1) {
                var formData = {
                    managerDID: $cookies.get('userDID'),
                }

                TaskCheckListUtil.fetchManagerWorkHourUnCheckedList(formData)
                    .success(function (resp) {
                        console.log(resp)
                        $scope.wh_manager = resp.payload.length
                    })
            }

            if ($scope.roleType == 100) {
                var formData = {
                    managerDID: $cookies.get('userDID'),
                }

                TaskCheckListUtil.fetchExecutiveWorkHourUnCheckedList(formData)
                    .success(function (resp) {
                        console.log(resp)
                        $scope.wh_executive = resp.payload.length
                    })
            }

        }




    }
})();