(function () {
  'use strict';

  angular.module('BlurAdmin.pages.myProject')
      // .controller('createProjectCtrl', createProject);
      .controller('createProjectCtrl', ['$scope', function (scope) {
          return new createProject(scope)
    }]);

  /** @ngInject */
  function createProject(scope) {

   var vm = this;

    vm.personalInfo = {};
    vm.productInfo = {};
    vm.shipment = {};

    vm.arePersonalInfoPasswordsEqual = function () {
      return vm.personalInfo.confirmPassword && vm.personalInfo.password == vm.personalInfo.confirmPassword;
    };
  }

})();

