/**
 * @author v.lugovsky
 * created on 10.12.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.inputs')
      .directive('mySwitcher', mySwitcher);

  /** @ngInject */
  function mySwitcher() {
    return {
      templateUrl: 'app/pages/myInput/widgets/mySwitcher/mySwitcher.html',
      scope: {
        switcherStyle: '@',
        switcherValue: '='
      }
    };
  }

})();
