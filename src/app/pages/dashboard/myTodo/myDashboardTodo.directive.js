/**
 * @author Ichen.Chu
 * created on 10.03.2018
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .directive('myDashboardTodo', myDashboardTodo);

  /** @ngInject */
  function myDashboardTodo() {
    return {
      restrict: 'EA',
      controller: 'MyDashboardTodoCtrl',
      templateUrl: 'app/pages/dashboard/myTodo/myDashboardTodo.html'
    };
  }
})();