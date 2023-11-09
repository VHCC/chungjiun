/**
 * @author v.lugovksy
 * created on 15.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components', [
      'ngWebsocket'
  ])
      .config(toastrLibConfig);

  /** @ngInject */
  function toastrLibConfig(toastrConfig) {
      console.log("12312312313133")
      angular.extend(toastrConfig, {
          closeButton: true,
          closeHtml: '<button>&times;</button>',
          timeOut: 5000,
          autoDismiss: false,
          containerId: 'toast-container',
          maxOpened: 0,
          newestOnTop: true,
          positionClass: 'toast-top-right',
          preventDuplicates: false,
          preventOpenDuplicates: false,
          target: 'body'
      });
  }
})();