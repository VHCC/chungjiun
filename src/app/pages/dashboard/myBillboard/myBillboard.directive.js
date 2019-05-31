/**
 * @author Ichen.Chu
 * created on 10.03.2018
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .directive('myBillboard', myBillboard);

  /** @ngInject */
  function myBillboard() {
    return {
      restrict: 'EA',
      controller: 'MyBillboardCtrl',
      templateUrl: 'app/pages/dashboard/myBillboard/myBillboard.html'
    };
  }
})();