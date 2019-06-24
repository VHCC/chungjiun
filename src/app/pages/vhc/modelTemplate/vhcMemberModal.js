/**
 * @author IChen.Chu
 * created on 21.06.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.vhcTest')
        .controller('vhcMemberModalCtrl',
            [
                '$scope',
                '$window',
                'toastr',
                '$cookies',
                'VhcMemberUtil',
                '$uibModalInstance',
                VhcMemberModalC
            ]);

    /** @ngInject */
    function VhcMemberModalC($scope,
                             $window,
                             toastr,
                             cookies,
                             VhcMemberUtil,
                             $uibModalInstance) {

        // console.log($scope.$resolve.member);
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.member = $scope.$resolve.member;
        $scope.isAddMember = false;

        if ($scope.member == undefined) {
            console.log("QQQQQ");
            $scope.isAddMember = true;
        }
        // initial

        $scope.checkUserNumber = function (dom) {
            console.log(dom.member.user_number);
            var postData = {
                user_number: dom.member.user_number
            }
            VhcMemberUtil.findIfExistNumber(postData)
                .success(function (res) {
                    console.log(res);
                    console.log(res.payload);
                    console.log(res.payload == null);
                    if (res.payload == null) {
                        // can add
                        $('#addBtn').html("新增");
                        $('#addBtn').attr("disabled", false);
                    } else {
                        $('#addBtn').html("號碼已經存在！！");
                        $('#addBtn').attr("disabled", true);
                        // exist member
                    }
                })

        }

        $scope.saveVhcMember = function () {
            console.log($scope.member);

            var postData = {
                member: $scope.member
            }

            VhcMemberUtil.updateVhcMember(postData)
                .success(function (res) {
                    console.log(res);
                    $uibModalInstance.close();
                })
        };

        $scope.addVhcMember = function () {

            console.log($scope);

            if ($scope.member == undefined
                || (!$scope.member.user_number || $scope.member.user_number.trim() == "")
                || (!$scope.member.user_name || $scope.member.user_name.trim() == "")
                || (!$scope.member.user_mobile || $scope.member.user_mobile.trim() == "") ) {
                toastr.warning('新增失敗！客戶的名稱、手機、會員號碼為必填。', 'Warning');
                return;
            }

            var postData = {
                member: $scope.member
            }

            // VhcMemberUtil.createVhcMember(postData)
            //     .success(function (res) {
            //         console.log(res);
            //         $window.location.reload();
            //     })



        };

        $scope.closeDialog = function () {
            $uibModalInstance.close();
        }

    }

})();