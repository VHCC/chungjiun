/**
 * @author IChen.Chu
 * created on 16.02.2018
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('myPageTop', myPageTop)
      .controller('myPageTopController', [
          '$scope',
          '$cookies',
          'toastr',
          '$window',
          '$document',
          function (scope,
                    cookies,
                    toastr,
                    window,
                    document) {
              return new myPageTopController(
                  scope,
                  cookies,
                  toastr,
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
                     toastr,
                     window,
                     document) {
      console.log("cookies.username= " + cookies.get('username'));
      console.log("cookies.userDID= " + cookies.get('userDID'));
      console.log("cookies.bossID= " + cookies.get('bossID'));
      console.log("cookies.userMonthSalary= " + cookies.get('userMonthSalary'));

      scope.username = cookies.get('username');

      scope.initPageTop = function () {
          // console.log("initPageTop.");
          var roleType = cookies.get('roletype');

          if (cookies.get('bossID') === undefined || cookies.get('userMonthSalary') === undefined || cookies.get('userMonthSalary') === 0) {
              toastr['error']('您的系統資訊未設定完全，請聯絡 行政人員 設定 !', '系統初步設定 不完全');
          }

          if (roleType !== '100') {
              var entrance = window.document.getElementById('registerEntrance');
              entrance.parentNode.removeChild(entrance);
          }
      };
  }

})();