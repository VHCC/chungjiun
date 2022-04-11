/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('BaSidebarCtrl', [
            '$scope',
            '$rootScope',
            '$cookies',
            '$element',
            '$compile',
            'NotificationMsgUtil',
            'baSidebarService',
            BaSidebarCtrl
        ]);

    /** @ngInject */
    function BaSidebarCtrl($scope,
                           $rootScope,
                           $cookies,
                           $element,
                           $compile,
                           NotificationMsgUtil,
                           baSidebarService) {

        var roleType = $cookies.get('roletype');
        var officialDocFeature = $cookies.get('feature_official_doc');

        $scope.menuItems = baSidebarService.getMenuItems();
        $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

        $scope.hoverItem = function ($event, item) {
            $scope.showHoverElem = true;
            $scope.hoverElemHeight = $event.currentTarget.clientHeight;
            var menuTopValue = 66;
            $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
        };

        $scope.$on('$stateChangeSuccess', function () {
            if (baSidebarService.canSidebarBeHidden()) {
                baSidebarService.setMenuCollapsed(true);
            }
        });

        $scope.isMenuHaveRight = function (subitem) {

            var right_level = true;
            var right_feature = true;

            if (subitem.accessLevel !== undefined) {
                for (var index = 0; index < subitem.accessLevel.length; index ++) {
                    if (subitem.accessLevel[index] === parseInt(roleType)) {
                        right_level = true;
                        break;
                    }
                    right_level = false;
                }
            } else {
                right_level = true;
            }

            if (subitem.accessFeature !== undefined) {
                for (var index = 0; index < subitem.accessFeature.length; index ++) {

                    if ($cookies.get(subitem.accessFeature[index]) === 'true') {
                        right_feature = true;
                        break;
                    }
                    right_feature = false;
                }
            } else {
                right_feature =  true;
            }

            return (right_level && right_feature);
        }

        $scope.initWatchRelatedTask = function() {

            $scope.$watch(function() {
                return $rootScope.cgWorkManage;
            }, function() {
                if ($rootScope == undefined || $rootScope.cgWorkManage == undefined) return;
                $rootScope.cgWorkManage == 0 ? $('[id="cgWorkManage"]').css("display", "none") :
                    $('[id="cgWorkManage"]').css("display", "");
                $('[id="cgWorkManage"]')[0].innerHTML = "\xa0" + $rootScope.cgWorkManage + "\xa0";
            }, true);

            $scope.$watch(function() {
                return $rootScope.workOff_Total;
            }, function() {
                if ($rootScope == undefined || $rootScope.workOff_Total == undefined) return;
                $rootScope.workOff_Total == 0 ? $('[id="cgWorkManage.workOffForm"]').css("display", "none") :
                    $('[id="cgWorkManage.workOffForm"]').css("display", "");
                $('[id="cgWorkManage.workOffForm"]')[0].innerHTML = "\xa0" + $rootScope.workOff_Total + "\xa0";
            }, true);

            $scope.$watch(function() {
                return $rootScope.hr_Total;
            }, function() {
                if ($rootScope == undefined || $rootScope.hr_Total == undefined) return;
                $rootScope.hr_Total == 0 ? $('[id="cgWorkManage.hrMachine"]').css("display", "none") :
                    $('[id="cgWorkManage.hrMachine"]').css("display", "");
                $('[id="cgWorkManage.hrMachine"]')[0].innerHTML = "\xa0" + $rootScope.hr_Total + "\xa0";
            }, true);

            $scope.$watch(function() {
                return $rootScope.travelApply_Total;
            }, function() {
                if ($rootScope == undefined || $rootScope.travelApply_Total == undefined) return;
                $rootScope.hr_Total == 0 ? $('[id="cgWorkManage.travelApplication"]').css("display", "none") :
                    $('[id="cgWorkManage.travelApplication"]').css("display", "");
                $('[id="cgWorkManage.travelApplication"]')[0].innerHTML = "\xa0" + $rootScope.travelApply_Total + "\xa0";
            }, true);


        };

        $scope.initWatchRelatedTask();
    }
})();