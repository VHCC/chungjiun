/**
 * @author Ichen.chu
 * created on 10.03.2018
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.ui.notifications')
    .controller('MyModalsPageCtrl', MyModalsPageCtrl);

  /** @ngInject */
  function MyModalsPageCtrl($scope, $uibModal, baProgressModal) {
    $scope.open = function (page, size) {
      $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    };
    $scope.openProgressDialog = baProgressModal.open;
  }


})();
