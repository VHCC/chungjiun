/**
 * @author IChen.Chu
 * created on 21.06.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.vhcTest')
        .controller('vhcOldRxModalCtrl',
            [
                '$scope',
                '$window',
                'toastr',
                '$cookies',
                'VhcMemberUtil',
                'VhcOldRxUtil',
                '$uibModalInstance',
                VhcMemberModalC
            ]);

    /** @ngInject */
    function VhcMemberModalC($scope,
                             $window,
                             toastr,
                             cookies,
                             VhcMemberUtil,
                             VhcOldRxUtil,
                             $uibModalInstance) {

        // console.log($scope.$resolve.member);
        // Main Data
        $scope.parent = $scope.$resolve.parent;
        $scope.memberOldRx = $scope.$resolve.memberOldRx;
        $scope.member = $scope.$resolve.member;
        // initial

        $scope.saveOldRx = function () {

            var postData = {
                user_number: $scope.member.user_number,

                user_rightolds: $scope.memberOldRx.user_rightolds,
                user_rightoldc: $scope.memberOldRx.user_rightoldc,
                user_rightolda: $scope.memberOldRx.user_rightolda,
                user_rightoldbc: $scope.memberOldRx.user_rightoldbc,
                user_rightoldadd: $scope.memberOldRx.user_rightoldadd,
                user_rightoldva: $scope.memberOldRx.user_rightoldva,
                user_rightoldpd: $scope.memberOldRx.user_rightoldpd,

                user_leftolds: $scope.memberOldRx.user_leftolds,
                user_leftoldc: $scope.memberOldRx.user_leftoldc,
                user_leftolda: $scope.memberOldRx.user_leftolda,
                user_leftoldbc: $scope.memberOldRx.user_leftoldbc,
                user_leftoldadd: $scope.memberOldRx.user_leftoldadd,
                user_leftoldva: $scope.memberOldRx.user_leftoldva,
                user_leftoldpd: $scope.memberOldRx.user_leftoldpd,
            }

            console.log(postData);

            VhcOldRxUtil.updateOldRxByMemberNumber(postData)
                .success(function (res) {
                    console.log(res)
                    $uibModalInstance.close();
                })

            // var postData = {
            //     member: $scope.member
            // }
            //
            // VhcMemberUtil.updateVhcMember(postData)
            //     .success(function (res) {
            //         console.log(res);
            //         $uibModalInstance.close();
            //     })
        };

        $scope.closeDialog = function () {
            $uibModalInstance.close();
        }

    }

})();