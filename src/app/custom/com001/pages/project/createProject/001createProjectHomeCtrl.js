(function () {
    'use strict';

    // createDate: 2022/07/08

    angular.module('BlurAdmin.pages.001.Project')
    // .controller('createProjectCtrl', createProject);
        .controller('_001_createProjectHomeCtrl', [
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
            createProjectHome
        ])

    /** @ngInject */
    function createProjectHome($scope,
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
        var roleType = cookies.get('roletype');

        var vm = this;

        $scope.apiProxy = function (dom, targetName) {
            var targetCtrl = findNextSibling(dom.$$childHead, targetName);
            switch (targetCtrl.vm.constructor.name) {
                case "createProject":
                    targetCtrl.init();
                    break;
                case "createInstitute":
                    targetCtrl.init();
                    break;
                case "createContract":
                    targetCtrl.init();
                    break;
                case "createCase":
                    targetCtrl.init();
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

