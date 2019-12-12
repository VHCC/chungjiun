/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('BaSidebarCtrl', [
            '$scope',
            '$cookies',
            'baSidebarService',
            BaSidebarCtrl
        ]);

    /** @ngInject */
    function BaSidebarCtrl($scope,
                           cookies,
                           baSidebarService) {
        var roleType = cookies.get('roletype');
        var officialDocFeature = cookies.get('feature_official_doc');

        $scope.menuItems = baSidebarService.getMenuItems();
        $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

        $scope.hoverItem = function ($event) {
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

                    if (cookies.get(subitem.accessFeature[index]) === 'true') {
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
    }
})();