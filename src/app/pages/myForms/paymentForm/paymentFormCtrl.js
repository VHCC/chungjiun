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
                '$compile',
                'Project',
                PaymentFormCtrl
            ]);

    /** @ngInject */
    function PaymentFormCtrl($scope,
                             cookies,
                             $compile,
                             Project) {

        $scope.username = cookies.get('username');
        var vm = this;

        Project.findAll()
            .success(function (allProjects) {
                console.log('rep - GET ALL Project, SUCCESS');
                console.log(allProjects);
                vm.projects = allProjects;
            });

        $scope.prjCodeToName = function (type) {
            switch(type) {
                case "01":
                    return "服務建議書";
                case "02":
                    return "規劃";
                case "03":
                    return "設計"
                case "04":
                    return "監造"
                case "05":
                    return "服務"
                case "06":
                    return "總案"
                default:
                    return "UNKNOWN"
            }
        }

        $scope.aaa = function () {
            $scope.count++;
            angular.element(
                document.getElementById('space-for-buttons'))
                .append($compile(
                    "<div><button class='btn btn-default' " +
                    "data-alert=" + $scope.count + ">Show alert #" +
                    $scope.count +
                    "</button></div>"
                )($scope));

        }


    }
})();


