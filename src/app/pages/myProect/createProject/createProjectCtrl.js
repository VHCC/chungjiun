(function () {
  'use strict';

  angular.module('BlurAdmin.pages.myProject')
      // .controller('createProjectCtrl', createProject);
      .controller('createProjectCtrl', ['$scope', '$cookies', function (scope, cookies) {
          return new createProject(scope, cookies)
    }]);

  /** @ngInject */
  function createProject(scope, cookies) {
        console.log("createProject");
        console.log("cookies.username= " + cookies.username);
        console.log("cookies.username= " + cookies.get('username'));
      scope.username = cookies.get('username');
   var vm = this;

    vm.personalInfo = {};
    vm.productInfo = {};
    vm.shipment = {};

    vm.arePersonalInfoPasswordsEqual = function () {
      return vm.personalInfo.confirmPassword && vm.personalInfo.password == vm.personalInfo.confirmPassword;
    };
  }

})();

