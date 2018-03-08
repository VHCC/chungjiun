(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myExecutive')
    // .controller('createProjectCtrl', createProject);
        .controller('createNewProjectCtrl', [
            '$scope',
            '$cookies',
            '$window',
            'User',
            '$timeout',
            'Project',
            '$document',
            function (scope,
                      cookies,
                      window,
                      User,
                      timeout,
                      Project,
                      document) {
                return new createNewProject(
                    scope,
                    cookies,
                    window,
                    User,
                    timeout,
                    Project,
                    document)
            }])
    ;

    /** @ngInject */
    function createNewProject(scope,
                           cookies,
                           window,
                           User,
                           $timeout,
                           Project,
                           document)
    {
        scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');


        // right division.
        if (roleType !== '100') {
            console.log(
                'roleType= ' + roleType +
                'username= ' + scope.username);
            window.location.href = '/noRight.html';
        }

        Project.get()
            .success(function (allProjects) {
                console.log('Rep - GET ALL Project, SUCCESS');
                console.log(JSON.stringify(allProjects));
                allProjects.push({name:"新總案", code: ""});
                cC.projects = allProjects;
                cC.thisYear = 107;
            });

        var cC = this;

        cC.prj = {};
        
        cC.mjr = {};

        User.getAllUsers()
            .success(function (allUsers) {
                console.log('Rep - GET ALL USERS SUCCESS');
                scope.users = allUsers;
            });

        scope.triggerChangeField = function () {
            console.log('triggerChangeField');
        }

    }
})();

