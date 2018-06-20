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
          'NotificationUtil',
          '$document',
          function (scope,
                    cookies,
                    toastr,
                    window,
                    NotificationUtil,
                    document) {
              return new myPageTopController(
                  scope,
                  cookies,
                  toastr,
                  window,
                  NotificationUtil,
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
                     NotificationUtil,
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

          var socket = io('http://localhost:9000');

          socket.on("greet", function (msg) {
              NotificationUtil.showMsg('Notification', msg, 2);

          });

          NotificationUtil.showMsg('歡迎使用　崇峻系統', '瀏覽器通知系統　已啟用', 1);

      };
  }

})();