/**
 * Created by IChen.Chu
 * on 07.17.2023.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myInput')
        .controller('ProcessStageCtrl', [
            '$scope',
            '$filter',
            '_001_CaseTask',
            processStageCtrl
        ]);

    /** @ngInject */
    function processStageCtrl($scope,
                              $filter,
                              _001_CaseTask) {

        $scope.showProcessStageName = function (attr) {
            console.log(attr);
            if (attr.processstagedid == undefined || attr.processstagedid == "") {
                return '尚未選擇';
            }

            var processStages_All = JSON.parse(attr.source);
            var selected = [];
            selected = $filter('filter')(processStages_All, {
                _id: attr.processstagedid,
            });

            if (selected == undefined) return '尚未選擇';
            $scope.processStageSelected = selected[0];
        }

        $scope.loadProcessStageSettings = function () {
            console.log("WQERQERQ");
            _001_CaseTask.findAllEnable()
                .success(function (resp) {
                    $scope.processStages_Enable = resp;
                })

            _001_CaseTask.findAll()
                .success(function (resp) {
                    $scope.processStages_All = resp;
                })
        }

        $scope.changeItem = function (dom) {
            // dom.$parent.$parent.caseTaskSelected = dom.caseTaskSelected;
            // dom.$parent.memo.processStageSelected = dom.processStageSelected;
            dom.$parent.memo.processStageUUID = dom.processStageSelected._id;
            console.log(dom);
        }
    }
})();