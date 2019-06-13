/**
 * @author a.demeshko
 * created on 12/16/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.charts.chartJs')
    .controller('chartJsWaveCtrl', chartJsWaveCtrl);

  /** @ngInject */
  function chartJsWaveCtrl($scope, $interval, stopableInterval) {
    $scope.labels =["減少碳排放", "拯救樹木", "淨化水源", "減少塑膠原料", "環保影響力"];
    $scope.data = [30, 50, 100, 30, 70];

    stopableInterval.start($interval, function(){
      var tempArray = [];
      var lastElement = $scope.data[$scope.data.length-1];
      for(var i = $scope.data.length-1; i > 0; i--){
       tempArray[i] = $scope.data[i-1];
      }
      tempArray[0] = lastElement;
      $scope.data = tempArray;
    }, 5000)
  }

})();