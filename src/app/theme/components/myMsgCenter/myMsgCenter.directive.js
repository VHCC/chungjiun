/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('myMsgCenter', myMsgCenter);

  /** @ngInject */
  function myMsgCenter() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/myMsgCenter/myMsgCenter.html',
      controller: 'MyMsgCenterCtrl'
    };
  }

})();