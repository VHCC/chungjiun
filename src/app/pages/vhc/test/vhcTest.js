/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.vhcTest')
        .controller('vhcTestController',
            [
                '$scope',
                '$http',
                'VhcMigrateUtil',
                VhcTest
            ]);


    /** @ngInject */
    function VhcTest($scope,
                     mHttp,
                     VhcMigrateUtil) {

        $scope.migrateFromMySQLToMongo = function () {

            var postData = {
                aaa : "aaa"
            }

            VhcMemberUtil.connectDB(postData)
                .success(function () {
                    console.log("migrate done.");
                })
        }
    }

})();
