/**
 * @author Ichen.Chu
 * created on 10.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('MyDashboardTodoCtrl', [
            '$scope',
            '$window',
            '$cookies',
            'baConfig',
            'ngDialog',
            'Todos',
            MyDashboardTodoCtrl
        ]);

    /** @ngInject */
    function MyDashboardTodoCtrl(
        $scope,
        window,
        cookies,
        baConfig,
        ngDialog,
        Todos) {

        $scope.transparent = baConfig.theme.blur;
        var dashboardColors = baConfig.colors.dashboard;
        var colors = [];
        for (var key in dashboardColors) {
            colors.push(dashboardColors[key]);
        }

        function getRandomColor() {
            var i = Math.floor(Math.random() * (colors.length - 1));
            return colors[i];
        }

        var userData = {
            userDID: cookies.get('userDID'),
        }
        Todos.findMyTodos(userData)
            .success(function (todos) {
                $scope.todoList = todos.payload;
                $scope.todoList.forEach(function (todoItem) {
                    todoItem.color = getRandomColor();
                });
            });

        $scope.newTodoText = '';

        $scope.addToDoItem = function (event) {
            if (event.which === 13) {
                if ($scope.newTodoText === "") {
                    window.globalNoty(
                        'warning', '待辦事項為空白'
                    );
                    return;
                }
                var data = {
                    text : $scope.newTodoText,
                    userDID: cookies.get('userDID'),
                    isEnable: true,
                }
                Todos.createMyTodo(data)
                    .success(function (res) {
                        $scope.todoList.unshift({
                            _id: res.payload._id,
                            userDID: res.payload.userDID,
                            isEnable: res.payload.isEnable,
                            isChecked: res.payload.isChecked,
                            text: res.payload.text,
                            color: getRandomColor(),
                        });
                        $scope.newTodoText = '';
                    });
            }
        };

        $scope.checkTodo = function (todoDID, isChecked) {
            var data = {
                todoDID: todoDID,
                isChecked: isChecked,
            }
            Todos.checkMySpecificTodo(data)
                .success(function (res) {
                    console.log(JSON.stringify(res));
                });
        }

        $scope.removeTodo = function (todoData) {
            todoData.deleted = true;
            var data = {
                todoDID: todoData._id,
            }
            Todos.removeMySpecificTodo(data)
                .success(function (res) {
                    console.log(JSON.stringify(res));
                });
        }

        $scope.value = true;

        $scope.noCheckConfirm = function (data, isChecked) {
            if (isChecked) {
                $scope.removeTodo(data);
                return;
            }
            $scope.confirmData = data;
            $scope.warningText = '待辦未完成，確定要刪除 ';
            ngDialog.open({
                template: 'app/pages/ui/modals/modalTemplates/myTodoWarningModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }
    }
})();