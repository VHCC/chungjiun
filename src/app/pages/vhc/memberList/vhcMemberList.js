/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.vhcTest')
        .service('intVhcMemberListService', function ($http, $cookies) {

            var promise = $http.get('/api/get_vhc_member_all')
                .success(function (results) {
                    return results;
                });
            return promise;


        })
        .controller('vhcMemberListController',
            [
                '$scope',
                'toastr',
                '$http',
                '$compile',
                '$uibModal',
                'VhcMemberUtil',
                'VhcOldRxUtil',
                'intVhcMemberListService',
                VhcMemberList
            ]);


    /** @ngInject */
    function VhcMemberList(
                    $scope,
                    toastr,
                    mHttp,
                    $compile,
                    $uibModal,
                    VhcMemberUtil,
                    VhcOldRxUtil,
                    intVhcMemberListService) {

        intVhcMemberListService.then(function (resp) {
            // console.log(resp.data.payload);
            $scope.members = resp.data.payload;
            $scope.members.slice(0, resp.data.payload.length);

            angular.element(
                document.getElementById('includeHead'))
                .append($compile(
                    "<div ba-panel ba-panel-title=" +
                    "'保健視會員列表 - " + resp.data.payload.length + "'" +
                    "ba-panel-class= " +
                    "'with-scroll'" + ">" +
                    "<div " +
                    "ng-include=\"'app/pages/vhc/memberList/vhcMemberListTables.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));
        })


        $scope.editMember = function (member) {
            $uibModal.open({
                animation: true,
                controller: 'vhcMemberModalCtrl',
                templateUrl: 'app/pages/vhc/modelTemplate/vhcMemberModal.html',
                resolve: {
                    member: function () {
                        return member;
                    },
                    parent: function () {
                        return $scope;
                    },
                }
            // }).result.then(function () {
            //     toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
            // });
            }).result.then(function (selectedItem) {
                console.log(selectedItem)
            }, function () {
                toastr.warning('Modal dismissed at: ' + new Date());
            });
        }

        $scope.addMember = function () {
            $uibModal.open({
                animation: true,
                controller: 'vhcMemberModalCtrl',
                templateUrl: 'app/pages/vhc/modelTemplate/vhcMemberModal.html',
                resolve: {
                    member: function () {
                        return undefined;
                    },
                    parent: function () {
                        return $scope;
                    },
                }
            }).result.then(function () {
                // toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
            });
        }

        $scope.editRx = function (member) {

            var postData = {
                // user_number: member.user_number
                userUUID: member._id
            }
            VhcOldRxUtil.findOldRxByMemberNumber(postData)
                .success(function (res) {
                    $uibModal.open({
                        animation: true,
                        controller: 'vhcOldRxModalCtrl',
                        templateUrl: 'app/pages/vhc/modelTemplate/vhcOldRxModal.html',
                        resolve: {
                            memberOldRx: function () {
                                return res.payload;
                            },
                            member: function () {
                                return member;
                            },
                            parent: function () {
                                return $scope;
                            },
                        }
                    }).result.then(function () {
                        // toastr.warning('尚未儲存表單 請留意資料遺失', 'Warning');
                    });
                })
        }



    }

})();
