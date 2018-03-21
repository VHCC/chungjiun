/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('MyCalendarCtrl',
            [
                '$scope',
                'baConfig',
                'Project',
                'DateUtil',
                'ProjectUtil',
                MyCalendarCtrl
            ]);

    /** @ngInject */
    function MyCalendarCtrl($scope,
                            baConfig,
                            Project,
                            DateUtil,
                            ProjectUtil) {
        var dashboardColors = baConfig.colors.dashboard;
        console.log(11111111111)

        Project.findAll()
            .success(function (allProjects) {
                console.log('rep - GET ALL Project, SUCCESS');
                console.log(allProjects);
                $scope.loading = false;
                $scope.projects = allProjects

                var totalEvent = [];

                for (var index = 0; index < $scope.projects.length; index++) {
                    var eventItem = {
                        title: $scope.projects[index].name + " - " + ProjectUtil.getTypeText($scope.projects[index].type),
                        start: DateUtil.formatDate($scope.projects[index].endDate),
                        color: baConfig.colors.warning,
                    }
                    totalEvent.push(eventItem);
                }

                // Init Calender
                var $element = $('#calendar').fullCalendar({
                    //height: 335,
                    header: {
                        left: 'prev, next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    defaultDate: new Date(),
                    selectable: false,
                    selectHelper: false,
                    select: function (start, end) {
                        var title = prompt('Event Title:');
                        var eventData;
                        if (title) {
                            eventData = {
                                title: title,
                                start: start,
                                end: end
                            };
                            $element.fullCalendar('renderEvent', eventData, true); // stick? = true
                        }
                        $element.fullCalendar('unselect');
                    },
                    editable: false,
                    eventLimit: true, // allow "more" link when too many events
                    events: totalEvent,
                });

            });
    }
})();