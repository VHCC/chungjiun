/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.myNewPage')
        .controller('mainController', ['$scope','$http', 'Todos', function (scope, http, Todos) {
            return new NewPageCtrl(scope, http, Todos);
        }])
        .factory('Todos', ['$http',function(http) {
            return {
                get : function() {
                    return http.get('/api/todos');
                },
                create : function(todoData) {
                    return http.post('/api/todos', todoData);
                },
                delete : function(id) {
                    return http.delete('/api/todos/' + id);
                },
                deleteTest : function () {
                    return http.post('/api/todos/test');
                }
            }
        }]);

    /** @ngInject */
    function NewPageCtrl(scope, mHttp, Todos) {
        scope.formData = {};
        scope.loading = true;

        // GET =====================================================================
        // when landing on the page, get all todos and show them
        // use the service to get all the todos
        Todos.get()
            .success(function(data) {
                console.log('GET  SUCCESS');
                scope.todos = data;
                scope.loading = false;
            });

        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        scope.createTodo = function() {

            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            if (scope.formData.text != undefined) {
                scope.loading = true;

                // call the create function from our service (returns a promise object)
                Todos.create(scope.formData)

                // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        console.log('CREATE  SUCCESS');
                        scope.loading = false;
                        scope.formData = {}; // clear the form so our user is ready to enter another
                        scope.todos = data; // assign our new list of todos
                    });
            }
        };

        // DELETE ==================================================================
        // delete a todo after checking it
        scope.deleteTodo = function(id) {
            scope.loading = true;

            Todos.delete(id)
            // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    console.log('DELETE  SUCCESS');
                    scope.loading = false;
                    scope.todos = data; // assign our new list of todos
                });
        };

        scope.deleteAll = function() {
            scope.loading = true;

            Todos.deleteTest()
                .success(function (data) {
                    console.log('DELETE ALL  SUCCESS');
                    scope.loading = false;
                    scope.todos = data; // assign our new list of todos
                })
        };
    }

})();
