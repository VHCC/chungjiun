/**
 * @author IChen.Chu
 * created on 2023/10/19
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.001.PersonalManage')
        .controller('_001_groupMemberCtrl', [
            '$compile',
            '$scope',
            '$cookies',
            '$http',
            'fileReader',
            '$filter',
            '$uibModal',
            'toastr',
            'User',
            'UserEditUtil',
            '_001_DepBoss',
            groupMemberCtrl
        ]);

    /** @ngInject */
    function groupMemberCtrl($compile,
                           $scope,
                           cookies,
                           $http,
                           fileReader,
                           $filter,
                           $uibModal,
                           toastr,
                           User,
                           UserEditUtil,
                           _001_DepBoss) {
        var vm = this;

        $scope.username = cookies.get('username');
        $scope.userDID = cookies.get('userDID');
        $scope.depType = cookies.get('depType');

        console.log("groupMemberCtrl");

        // ---------------------- 部門成員 -----------------------

        $scope.groupMembersArray = [];

        $scope.fetchAllUserAndDep = function () {
            vm.edit = null;
            User.getAllUsersWithSignOut()
                .success(function (allUsers) {
                    vm.managersList = allUsers;
                    vm.allUserWithSignOut = allUsers;
                    for (var i = 0; i < allUsers.length; i++) {
                        console.log(allUsers[i]);
                        if (allUsers[i].depType == $scope.depType) {
                            $scope.groupMembersArray.push(allUsers[i]);
                        }
                    }
                    console.log($scope.groupMembersArray);

                    angular.element(
                        document.getElementById('includeHead_groupMembers'))
                        .html($compile(
                            "<div ba-panel ba-panel-title=" +
                            "'" + $scope.showDepType($scope.depType) + " 成員 - " + $scope.groupMembersArray.length + "'" +
                            "ba-panel-class= " +
                            "'with-scroll'" + ">" +
                            "<div " +
                            "ng-include=\"'app/custom/com001/pages/personalManage/userInfo/tab/groupMembers/table/groupMembersTable.html'\">" +
                            "</div>" +
                            "</div>"
                        )($scope));
                });

            _001_DepBoss.findAll()
                .success(function (depBoss) {
                    vm.depBossSettings = depBoss;
                })

        }

        $scope.fetchAllUserAndDep();

        var emptyObject = {
            name: "尚未設定",
            code: "尚未設定",
        }

        $scope.getBoss = function (did, options) {
            var selected = [];
            if (did) {
                selected = $filter('filter')(options, {
                    _id: did,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.getRole = function (target, options) {
            var selected = [];
            if (target) {
                selected = $filter('filter')(options, {
                    roleType: target,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.getDep = function (target, options) {
            var selected = [];
            if (target) {
                selected = $filter('filter')(options, {
                    depType: target,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            return selected[0];
        }

        $scope.findDepBoss = function (target, options) {
            var selected = [];
            if (target) {
                selected = $filter('filter')(options, {
                    depType: target,
                });
            }
            if (selected == undefined || selected.length == 0) {
                return emptyObject;
            }
            var result = $scope.getBoss(selected[0].userDID, vm.managersList);
            return result;
        }

        // *****************
        // 總經理-1
        // 經理-2
        // 副理-3
        // 組長-4
        // 技師-5
        // 資深工程師-6
        // 高級工程師-7
        // 工程師-8
        // 助理工程師-9
        // 資深專員-10
        // 高級專員-11
        // 專員-12
        // 駐府人員-13
        // 工讀人員-14
        vm.roleOptions = [
            {name: "總經理", roleType: 1},
            {name: "經理", roleType: 2},
            {name: "副理", roleType: 3},
            {name: "組長", roleType: 4},
            {name: "技師", roleType: 5},
            {name: "資深工程師", roleType: 6},
            {name: "高級工程師", roleType: 7},
            {name: "工程師", roleType: 8},
            {name: "助理工程師", roleType: 9},
            {name: "資深專員", roleType: 10},
            {name: "高級專員", roleType: 11},
            {name: "專員", roleType: 12},
            {name: "駐府人員", roleType: 13},
            {name: "工讀人員", roleType: 14},
        ];

        // 老闆-A
        // 主管部-B
        // 設計部-C
        // 監造部-分4群組-D
        // 專管部-E
        // 測量部-F
        // 管理部-G
        vm.departmentOptions = [
            // {name: "老闆", depType: 'A'},
            {name: "主管部", depType: 'B'},
            {name: "設計部", depType: 'C'},
            {name: "監造部-1", depType: 'D1'},
            {name: "監造部-2", depType: 'D2'},
            {name: "監造部-3", depType: 'D3'},
            {name: "監造部-4", depType: 'D4'},
            {name: "專管部", depType: 'E'},
            {name: "測量部", depType: 'F'},
            {name: "管理部", depType: 'G'},
        ];

        $scope.showDepStatus = function (dep) {
            var result = $scope.findDepBoss(dep.depType, vm.depBossSettings);
            return dep.name + " (" + result.name + ")";
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
