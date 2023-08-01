/**
 * @author IChen.Chu
 * created on 07.31.2023
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .directive('s001UnitList', s001UnitList);

  /** @ngInject */
  function s001UnitList() {
    return {
      restrict: 'EA',
      controller: 's001UnitListCtrl',
      templateUrl: 'app/custom/com001/pages/dashboard/s001UnitList/s001UnitList.html'
    };
  }
})();