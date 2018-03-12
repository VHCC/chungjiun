/**
 * @author Ichen.chu
 * created on 03.12.2018
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .directive('myCalendar', myCalendar);

  /** @ngInject */
  function myCalendar() {
    return {
      restrict: 'E',
      controller: 'MyCalendarCtrl',
      templateUrl: 'app/pages/dashboard/myCalendar/myCalendar.html'
    };
  }
})();