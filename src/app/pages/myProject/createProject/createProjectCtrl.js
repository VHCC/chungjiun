(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myProject')
    // .controller('createProjectCtrl', createProject);
        .controller('createProjectCtrl', [
            '$scope',
            '$cookies',
            '$window',
            'User',
            'baProgressModal',
            '$timeout',
            'Project',
            '$document',
            function (scope,
                      cookies,
                      window,
                      User,
                      baProgressModal,
                      timeout,
                      Project,
                      document) {
                return new createProject(
                    scope,
                    cookies,
                    window,
                    User,
                    baProgressModal,
                    timeout,
                    Project,
                    document)
            }])
        .factory('User', ['$http', function (http) {
            return {
                getAllUsers: function () {
                    return http.get('/api/getAllUsersName');
                },
            }
        }])
        .factory('Project', ['$http', function (http) {
            return {
                get: function () {
                    return http.get('/api/project');
                },
                create: function (projectData) {
                    return http.post('/api/project', projectData);
                },
            }
        }])
    ;

    /** @ngInject */
    function createProject(scope,
                           cookies,
                           window,
                           User,
                           baProgressModal,
                           $timeout,
                           Project,
                           document)
    {
        scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        var queryResult = document[0].getElementById('projectInName');

        // right division.
        if (roleType == 0) {
            console.log(global.timeFormat(new Date()) +
                global.log.i +
                'roleType= ' + roleType +
                'username= ' + scope.username);
            window.location.href = '/noRight.html';
        }

        var cC = this;

        cC.prj = {};
        cC.mjr = {};

        User.getAllUsers()
            .success(function (allUsers) {
                console.log(global.timeFormat(new Date()) + global.log.i + 'Rep - GET ALL USERS SUCCESS');
                scope.users = allUsers;
            });

        baProgressModal.setProgress(0);

        (function changeValue() {
            if (baProgressModal.getProgress() >= 100) {
                baProgressModal.close();
                console.log(global.timeFormat(new Date()) + global.log.i + 'progress complete!');

                var projectInfo = {
                    creator : document[0].getElementById('projectCreator').innerText,
                    majorID: document[0].getElementById('projectMajor')[document[0].getElementById('projectMajor').selectedIndex].id,
                    name : document[0].getElementById('productName').value,
                    code : document[0].getElementById('projectCode').value,
                }
                Project.create(projectInfo)
                    .success(function (data) {
                        console.log(global.timeFormat(new Date()) + global.log.i + 'create Project Success.');
                        window.location.href = '/#/myProject/listProject';
                    })

            } else {
                baProgressModal.setProgress(baProgressModal.getProgress() + 10);
                $timeout(changeValue, 300);
            }
        })();

        scope.preCreateProject = function () {
            console.log("preCreateProject.");
        };

    }
})();

