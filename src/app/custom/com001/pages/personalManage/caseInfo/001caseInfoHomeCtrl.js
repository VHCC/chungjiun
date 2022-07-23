(function () {
    'use strict';

    // createDate: 2022/07/13
    angular.module('BlurAdmin.pages.001.PersonalManage')
    // .controller('createProjectCtrl', createProject);
        .controller('_001_caseInfoHomeCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            'toastr',
            'User',
            '$timeout',
            caseInfoHome
        ])

    /** @ngInject */
    function caseInfoHome($scope,
                          cookies,
                          window,
                          $filter,
                          toastr,
                          User,
                          $timeout) {
        $scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        var vm = this;

        $scope.apiProxy = function (dom, targetName) {
            console.log(dom);
            var targetCtrl = findNextSibling(dom.$$childHead, targetName);
            console.log(targetCtrl);
            switch (targetCtrl.vm.constructor.name) {
                case "editCaseInfo":
                    targetCtrl.init();
                    break;
                case "caseTask":
                    targetCtrl.fetchCaseTaskList();
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

