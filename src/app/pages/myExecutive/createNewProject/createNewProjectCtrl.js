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
                              document) {
        // Data Initial
        scope.username = cookies.get('username');
        var roleType = cookies.get('roletype');

        scope.formData = {};


        // right division.
        if (roleType !== '100') {
            console.log(
                'roleType= ' + roleType +
                'username= ' + scope.username);
            window.location.href = '/noRight.html';
        }

        Project.findAll()
            .success(function (allProjects) {
                console.log(JSON.stringify(allProjects));
                allProjects.push({name: "新總案", code: ""});
                cC.projects = allProjects;
                scope.formData.year = 107;
            });

        var cC = this;

        User.findTechs()
            .success(function (techs) {
                console.log(JSON.stringify(techs));
                cC.techsItems = techs;
            })

        cC.prjTypes = [
            {label: '服務建議書-01', type: '01'},
            {label: '規劃-02', type: '02'},
            {label: '設計-03', type: '03'},
            {label: '監造-04', type: '04'},
            {label: '服務-05', type: '05'},
            {label: '總案-06', type: '06'},
        ];

        User.getAllUsers()
            .success(function (allUsers) {
                console.log('Rep - GET ALL USERS SUCCESS');
                console.log(JSON.stringify(allUsers));
                scope.users = allUsers;
            });

        //Prj Name Check whether is new or not.
        scope.triggerChangePrjName = function () {
            console.log('triggerChangePrjName');
            if (this.formData.prj.name.selected.code === "") {
                window.document.getElementById('newPrjNameDiv').style.display = "block";
                Project.findPrjDistinctByName()
                    .success(function (prjs) {
                            console.log(JSON.stringify(prjs));
                            scope.formData.prj.code = prjs.length + 1;

                            if (scope.formData.prj.type !== undefined) {
                                var data = {
                                    year: scope.formData.year,
                                    code: scope.formData.prj.name.code,
                                    type: scope.formData.prj.type.selected.type,
                                }
                                Project.findPrjFootNumber(data)
                                    .success(function (prjs) {
                                        console.log(JSON.stringify(prjs));
                                        scope.formData.prj.footCode = prjs.length + 1;
                                    })
                            }
                        }
                    );

            } else {
                window.document.getElementById('newPrjNameDiv').style.display = "none";
                console.log(scope.formData.prj.name.selected.name);
                var data = {
                    name: scope.formData.prj.name.selected.name
                }
                Project.findPrjByName(data)
                    .success(function (prj) {
                        console.log(JSON.stringify(prj));
                        scope.formData.prj.code = prj.code;
                    })
            }
        }

        // Name Check
        scope.triggerChangePrjNewName = function () {
            console.log('triggerChangePrjNewName');
            var data = {
                name: scope.formData.prj.name.new
            }
            Project.findPrjByName(data)
                .success(function (prj) {
                    console.log(JSON.stringify(prj));
                    if (prj !== null) {
                        document[0].getElementById('prjSubmitBtn').disabled = true;
                        document[0].getElementById('prjSubmitBtn').innerText = "專案名稱已存在，請檢查！"
                    } else {
                        document[0].getElementById('prjSubmitBtn').disabled = false;
                        document[0].getElementById('prjSubmitBtn').innerText = "建立專案"
                    }
                })
        }

        // Type Check
        scope.triggerChangePrjType = function () {
        }


        scope.createSubmit = function () {
            console.log('createSubmit');
            scope.formData.prjCode = document[0].getElementById('prjCode').innerText;
            Project.create(scope.formData);
        }

    }
})();

