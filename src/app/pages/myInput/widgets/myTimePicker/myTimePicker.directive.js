/**
 * @author Ichen.chu
 * created on 04.04.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .directive('myTimePicker', myTimePicker);

    /** @ngInject */
    function myTimePicker() {
        return {
            replace: true,
            restrict: 'E',
            controller: 'MyTimePickerCtrl',
            link: function ($scope, elem, attrs) {
                // console.log(" ==== MyTimePickerCtrl ==== ");
                // console.log($scope);
                // console.log(attrs.start);
                // console.log(attrs.end);
                // $scope.tableTimeStart = attrs.start;
                $scope.tableTimeStart = $scope.table.start_time;
                // $scope.tableTimeEnd = attrs.end;
                $scope.tableTimeEnd = $scope.table.end_time;
                $scope.table.myHourDiff = "-";
                if ($scope.workOffType) {
                    $scope.table.myHourDiff = $scope.getHourDiffByTime($scope.tableTimeStart, $scope.tableTimeEnd, $scope.workOffType.type);
                    // console.log("MyTimePickerCtrl, type= " + $scope.workOffType.type + ", myHourDiff= " + $scope.table.myHourDiff);
                }
                $scope.pickerIndex = "picker_" + $scope.$index;

                // Restricts input for the given textbox to the given inputFilter.
                // function setInputFilter(textbox, inputFilter, errMsg) {
                //     console.log(textbox);
                //     ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function(event) {
                //         textbox.addEventListener(event, function(e) {
                //             console.log("QQQQQ");
                //             if (inputFilter(this.value)) {
                //                 // Accepted value
                //                 if (["keydown","mousedown","focusout"].indexOf(e.type) >= 0){
                //                     this.classList.remove("input-error");
                //                     this.setCustomValidity("");
                //                 }
                //                 this.oldValue = this.value;
                //                 this.oldSelectionStart = this.selectionStart;
                //                 this.oldSelectionEnd = this.selectionEnd;
                //             } else if (this.hasOwnProperty("oldValue")) {
                //                 // Rejected value - restore the previous one
                //                 this.classList.add("input-error");
                //                 this.setCustomValidity(errMsg);
                //                 this.reportValidity();
                //                 this.value = this.oldValue;
                //                 this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                //             } else {
                //                 // Rejected value - nothing to restore
                //                 this.value = "";
                //             }
                //         });
                //     });
                // }

                // Install input filters.

                // console.log(document);
                // if ($scope.pickerIndex != null) {
                //     console.log("2222");
                //     var targetId = $scope.pickerIndex;
                //     console.log(targetId);
                //     setInputFilter(document.getElementById("intTextBox"), function(value) {
                //         return /^-?\d*$/.test(value); }, "Must be an integer");
                //
                //     setInputFilter(document.getElementById("intTextBox2"), function(value) {
                //         return /^-?\d*$/.test(value); }, "Must be an integer");
                // } else {
                //     console.log("11111");
                // }


            },
            templateUrl: 'app/pages/myInput/widgets/myTimePicker/myTimePicker.html',
        };
    }
})();