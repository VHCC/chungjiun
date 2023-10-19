(function () {
    'use strict';

    // createDate: 2022/07/13
    angular.module('BlurAdmin.pages.001.PersonalManage')
    // .controller('createProjectCtrl', createProject);
        .controller('_001_userInfoHomeCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            'toastr',
            'User',
            '$timeout',
            '_001_Project',
            '_001_Institute',
            '$document',
            userInfoHome
        ])

    /** @ngInject */
    function userInfoHome($scope,
                              cookies,
                              window,
                              $filter,
                              toastr,
                              User,
                              $timeout,
                              _001_Project,
                              _001_Institute,
                              document) {
        $scope.username = cookies.get('username');
        $scope.roleType = cookies.get('roletype');
        $scope.depType = cookies.get('depType');
        $scope.isDepG = cookies.get('isDepG') == "false" ? false : true;


        var vm = this;

        $scope.apiProxy = function (dom, targetName) {
            console.log(dom);
            var targetCtrl = findNextSibling(dom.$$childHead, targetName);
            console.log(targetCtrl);
            switch (targetCtrl.vm.constructor.name) {
                case "createInstitute":
                    targetCtrl.init();
                    break;
                case "userEditCtrl":
                    targetCtrl.fetchAllUsers();
                    break;
            }
        }

        function findNextSibling(dom, targetName) {
            if (dom.vm != undefined && dom.vm != null && dom.vm.constructor.name == targetName) {
                return dom;
            }
            if (dom.$$nextSibling != null || dom.$$nextSibling != undefined) {
                dom = dom.$$nextSibling;
            } else {
                return dom;
            }
            return findNextSibling(dom, targetName);
        }

    }
})();

