(function () {
    'use strict';
    // createDate: 2023/07/12
    angular.module('BlurAdmin.pages.001.Project')
        .controller('_001_listCaseHomeCtrl', [
            '$scope',
            '$cookies',
            '$window',
            '$filter',
            'toastr',
            'User',
            '$timeout',
            '_001_Project',
            '_001_Institute',
            listCaseHome
        ])

    /** @ngInject */
    function listCaseHome($scope,
                              cookies,
                              window,
                              $filter,
                              toastr,
                              User,
                              $timeout,
                              _001_Project,
                              _001_Institute
                              ) {
        $scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        var vm = this;

        $scope.apiProxy = function (dom, targetName) {
            var targetCtrl = findNextSibling(dom.$$childHead, targetName);
            console.log(targetCtrl);
            switch (targetCtrl.vm.constructor.name) {
                case "listCase":
                    console.log(targetCtrl);
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

