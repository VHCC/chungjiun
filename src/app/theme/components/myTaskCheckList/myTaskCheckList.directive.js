/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('myTaskCheckList', myTaskCheckList);

  /** @ngInject */
  function myTaskCheckList() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/myTaskCheckList/myTaskCheckList.html',
      controller: 'MyTaskCheckListCtrl'
    };
  }

})();