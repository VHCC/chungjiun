/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('myPageTop', myPageTop)
      .controller('myPageTopController', [
          '$scope',
          '$cookies',
          '$window',
          '$document',
          function (scope,
                    cookies,
                    window,
                    document) {
              return new myPageTopController(
                  scope,
                  cookies,
                  window,
                  document)
          }]);

  /** @ngInject */
  function myPageTop() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/myPageTop/pageTop.html'
    };
  }

  function myPageTopController(scope,
                     cookies,
                     window,
                     document) {
      console.log("cookies.username= " + cookies.get('username'));
      scope.username = cookies.get('username');

      scope.initPageTop = function () {
          console.log("initPageTop.");
          var roleType = cookies.get('roletype');

          if (roleType !== '100') {
              var entrance = window.document.getElementById('registerEntrance');
              entrance.parentNode.removeChild(entrance);
          }
      };
  }

})();