/**
 * @author Ichen.chu
 * created on 02.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myForms')
        .controller('paymentFormCtrl',
            [
                '$scope',
                '$cookies',
                'Project',
                PaymentFormCtrl
            ]);

    /** @ngInject */
    function PaymentFormCtrl($scope,
                             cookies,
                             Project) {

        $scope.username = cookies.get('username');
        var vm = this;

        Project.findAll()
            .success(function (allProjects) {
                console.log('rep - GET ALL Project, SUCCESS');
                console.log(allProjects);
                vm.projects = allProjects;
            });

        $scope.prjCodeToName = function (code) {
            switch(code) {
                case "1":
                    return "服務建議書";
                case "2":
                    return "規劃";
                case "3":
                    return "設計"
                case "4":
                    return "監造"
                case "5":
                    return "服務"
                case "6":
                    return "總案"
                default:
                    return "UNKNOWN"
            }
        }

        $scope.aaa = function () {
            var htmlcontent = $('#rowBody ');
            htmlcontent.load('../forms/items/paymentFormItem.html');
            $compile(htmlcontent.contents())($scope);
            document.getElementById('rowHead').append(123);

        }


    }
})();


