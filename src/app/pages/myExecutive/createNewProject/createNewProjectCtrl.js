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

        Project.findAllByGroup()
            .success(function (allProjects) {
                console.log(JSON.stringify(allProjects));
                allProjects.push({name: "新總案", code: ""});
                cC.projects = allProjects;
                scope.formData.year = 107;
            });

        var cC = this;

        User.findTechs()
            .success(function (techs) {
                // console.log(JSON.stringify(techs));
                cC.techsItems = techs;
            })

        User.findManagers()
            .success(function (managers) {
                console.log(JSON.stringify(managers));
                cC.managersItem = managers;
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
                // console.log(JSON.stringify(allUsers));
                scope.users = allUsers;
            });

        //Prj Name Check whether is new or not.
        scope.triggerChangePrjName = function () {
            // console.log('triggerChangePrjName');
            if (this.formData.prj.name.selected.code === "") {
                //新總案case
                window.document.getElementById('newPrjNameDiv').style.display = "block";
                Project.findPrjDistinctByName()
                    .success(function (prjs) {
                            console.log(JSON.stringify(prjs));
                            scope.formData.prj.code = prjs.length + 1;
                            scope.formData.prj.name.new = "";
                            if (scope.formData.prj.type !== undefined) {
                                var data = {
                                    year: scope.formData.year,
                                    code: scope.formData.prj.code,
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
                // 專案已存在
                scope.formData.prj.name.new = scope.formData.prj.name.selected.name;
                window.document.getElementById('newPrjNameDiv').style.display = "none";
                // console.log(scope.formData.prj.name.selected.name);
                var data = {
                    name: scope.formData.prj.name.selected.name
                }
                Project.findPrjByName(data)
                    .success(function (prj) {
                            // console.log(JSON.stringify(prj));
                            scope.formData.prj.code = prj.code;
                            if (scope.formData.prj.type !== undefined) {
                                var data = {
                                    year: scope.formData.year,
                                    code: scope.formData.prj.code,
                                    type: scope.formData.prj.type.selected.type,
                                }
                                Project.findPrjFootNumber(data)
                                    .success(function (prjs) {
                                        // console.log(JSON.stringify(prjs));
                                        // console.log(prjs.length);
                                        scope.formData.prj.footCode = prjs.length + 1;
                                    })
                            }
                        }
                    );
            }
        }

        // Name Check
        scope.triggerChangePrjNewName = function () {
            // console.log('triggerChangePrjNewName');
            var data = {
                name: scope.formData.prj.name.new
            }
            Project.findPrjByName(data)
                .success(function (prj) {
                    // console.log(JSON.stringify(prj));
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
            // console.log('triggerChangePrjType');

            if (scope.formData.prj.name !== undefined) {
                var data = {
                    name: scope.formData.prj.name.selected.name
                }
                Project.findPrjByName(data)
                    .success(function (prj) {
                            // console.log(JSON.stringify(prj));
                            // 專案已存在 case
                            if (scope.formData.prj.name.selected.code !== "") {
                                scope.formData.prj.name.new = scope.formData.prj.name.selected.name;
                                scope.formData.prj.code = prj.code;
                                var data = {
                                    year: scope.formData.year,
                                    code: scope.formData.prj.code,
                                    type: scope.formData.prj.type.selected.type,
                                }
                                Project.findPrjFootNumber(data)
                                    .success(function (prjs) {
                                        // console.log(JSON.stringify(prjs));
                                        // console.log(prjs.length);
                                        scope.formData.prj.footCode = prjs.length + 1;
                                    })
                            } else {
                                scope.formData.prj.footCode = 1;
                            }
                        }
                    );
            }
        }

        scope.triggerChangePrjTechs = function () {
            console.log('triggerChangePrjTechs');
            if (this.formData.techs.selected === undefined) {
                this.formData.techs = null;
            }
        }

        scope.createSubmit = function () {
            console.log('createSubmit');
            scope.formData.prjCode = document[0].getElementById('prjCode').innerText;
            scope.formData.prjEndDate = document[0].getElementById('myDT').value;

            Project.create(scope.formData)
                .success(function (data) {
                    console.log('createSubmit 2');
                    console.log('Error Code= ' + data.code);
                    if (data.code == 200) {
                        scope.formData = [];
                        window.location.reload();
                    }
                })
                .error(function (data) {
                    console.log('createSubmit  error');
                    window.formNotFullFill();
                })
        }

    }
})();

