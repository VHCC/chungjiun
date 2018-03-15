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
                '$window',
                'ngDialog',
                'Project',
                'ProjectUtil',
                'PaymentForms',
                PaymentFormCtrl
            ])
        .directive("removepayment", function () {
            return function (scope, element, attrs) {
                element.bind("click", function () {
                    console.log(attrs);
                    $(attrs.removepayment).remove();
                });
            };
        });

    /** @ngInject */
    function PaymentFormCtrl($scope,
                             cookies,
                             $compile,
                             window,
                             ngDialog,
                             Project,
                             ProjectUtil,
                             PaymentForms) {

        $scope.username = cookies.get('username');
        var vm = this;

        Project.findAll()
            .success(function (allProjects) {
                console.log('rep - GET ALL Project, SUCCESS');
                console.log(allProjects);
                vm.projects = allProjects;
            });

        $scope.prjTypeToName = function (type) {
            return ProjectUtil.getTypeText(type);
        }

        $scope.count = 0;
        $scope.addPayment = function (prjName, prjType, prjCode, prjDID) {
            vm.prjItems.selected = "";
            $scope.count ++;
            angular.element(
                document.getElementById('colHead'))
            // .append($compile(
            //     "<div><button class='btn btn-default' " +
            //     "data-alert=" + $scope.count + ">Show alert #" +
            //     $scope.count +
            //     "</button></div>"
            // )($scope))
                .append($compile(
                    "<div " +
                    "id=payment" + $scope.count + ">" +
                    "<label >" +
                    $scope.count + ". - " + prjName + " - " + prjType + " - " + prjCode +
                    "<span style='display: none'>" +
                    prjDID +
                    "</span>" +
                    "<button class='btn btn-default' " +
                    "data-removepayment=#payment" + $scope.count + ">X" +
                    "</button>" +
                    "</label>" +
                    "<div " +
                    "ng-include=\"'app/pages/myForms/forms/items/paymentFormItem.html'\">" +
                    "</div>" +
                    "</div>"
                )($scope));
        }

        $scope.submitPayment = function () {

            $scope.warningText = '總共新增 ' + $('#rowHead').find("div[id^='payment']").length + " 筆 墊付款";
            ngDialog.open({
                template: 'app/pages/ui/modals/modalTemplates/myPaymentFormWarningModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.submitPatment = function () {
            var dataForm = [];

            var paymentCount = $('#rowHead').find("div[id^='payment']").length
            for (var index = 0; index < paymentCount; index++) {
                var itemIndex = index + 1;
                var payDateIndex = 0;
                var receiptCodeIndex = 1;
                var paymentIndex = 2;
                var amountIndex = 3;
                var dataIteam = {
                    creatorDID: cookies.get('userDID'),
                    prjDID: $("div[id^='payment']").find('span')[0].innerText,
                    payDate: $($('.ng-scope .row')[itemIndex]).find('input')[payDateIndex].value,
                    receiptCode: $($('.ng-scope .row')[itemIndex]).find('input')[receiptCodeIndex].value,
                    payment: $($('.ng-scope .row')[itemIndex]).find('input')[paymentIndex].value,
                    amount: $($('.ng-scope .row')[itemIndex]).find('input')[amountIndex].value,
                };
                dataForm.push(dataIteam);
            }
            PaymentForms.createForms(dataForm)
                .success(function (data) {
                    window.location.reload();
                })
            console.log(JSON.stringify(dataForm));
        }

    }
})();


