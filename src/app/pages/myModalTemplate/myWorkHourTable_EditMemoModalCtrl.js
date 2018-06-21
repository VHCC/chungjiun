/**
 * @author IChen.Chu
 * created on 13.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('MyWorkHourTable_EditMemoModalCtrl',
            [
                '$scope',
                '$cookies',
                '$uibModalInstance',
                MyWorkHourTableEditMemoModalCtrl
            ]);

    /** @ngInject */
    function MyWorkHourTableEditMemoModalCtrl($scope,
                                             cookies,
                                             $uibModalInstance) {
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.table = $scope.$resolve.table;
        $scope.memoType = $scope.$resolve.memoType;
        $scope.editableFlag = $scope.$resolve.editableFlag;
        switch ($scope.memoType) {
            case 1:
                $scope.originMemo = $scope.table.mon_memo;
                break;
            case 2:
                $scope.originMemo = $scope.table.tue_memo;
                break;
            case 3:
                $scope.originMemo = $scope.table.wes_memo;
                break;
            case 4:
                $scope.originMemo = $scope.table.thu_memo;
                break;
            case 5:
                $scope.originMemo = $scope.table.fri_memo;
                break;
            case 6:
                $scope.originMemo = $scope.table.sat_memo;
                break;
            case 7:
                $scope.originMemo = $scope.table.sun_memo;
                break;
            case 11:
                $scope.originMemo = $scope.table.mon_memo_add;
                break;
            case 12:
                $scope.originMemo = $scope.table.tue_memo_add;
                break;
            case 13:
                $scope.originMemo = $scope.table.wes_memo_add;
                break;
            case 14:
                $scope.originMemo = $scope.table.thu_memo_add;
                break;
            case 15:
                $scope.originMemo = $scope.table.fri_memo_add;
                break;
            case 16:
                $scope.originMemo = $scope.table.sat_memo_add;
                break;
            case 17:
                $scope.originMemo = $scope.table.sun_memo_add;
                break;
        }
        // initial
        $scope.username = cookies.get('username');
        $scope.userDID = cookies.get('userDID');
        $scope.roleType = cookies.get('roletype');

        $scope.saveMemo = function () {
            switch ($scope.memoType) {
                case 1:
                    $scope.table.mon_memo = $scope.originMemo;
                    break;
                case 2:
                    $scope.table.tue_memo = $scope.originMemo;
                    break;
                case 3:
                    $scope.table.wes_memo = $scope.originMemo;
                    break;
                case 4:
                    $scope.table.thu_memo = $scope.originMemo;
                    break;
                case 5:
                    $scope.table.fri_memo = $scope.originMemo;
                    break;
                case 6:
                    $scope.table.sat_memo = $scope.originMemo;
                    break;
                case 7:
                    $scope.table.sun_memo = $scope.originMemo;
                    break;
                case 11:
                    $scope.table.mon_memo_add = $scope.originMemo;
                    break;
                case 12:
                    $scope.table.tue_memo_add = $scope.originMemo;
                    break;
                case 13:
                    $scope.table.wes_memo_add = $scope.originMemo;
                    break;
                case 14:
                    $scope.table.thu_memo_add = $scope.originMemo;
                    break;
                case 15:
                    $scope.table.fri_memo_add = $scope.originMemo;
                    break;
                case 16:
                    $scope.table.sat_memo_add = $scope.originMemo;
                    break;
                case 17:
                    $scope.table.sun_memo_add = $scope.originMemo;
                    break;
            }
            $uibModalInstance.close();
        };

        $scope.closeDialog = function () {
            $uibModalInstance.close();
        }
    }

})();