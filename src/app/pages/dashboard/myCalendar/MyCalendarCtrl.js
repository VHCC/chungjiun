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
                'NationalHolidayUtil',
                'ProjectUtil',
                MyCalendarCtrl
            ]);

    /** @ngInject */
    function MyCalendarCtrl($scope,
                            baConfig,
                            Project,
                            DateUtil,
                            NationalHolidayUtil,
                            ProjectUtil) {

        var dashboardColors = baConfig.colors.dashboard;

        var thisYear = new Date().getFullYear() - 1911;

        var getData = {
            year: thisYear,
        }

        NationalHolidayUtil.fetchAllNationalHolidays(getData)
            .success(function (res) {
                console.log(res.payload);
                if (res.payload.length > 0) {
                    $scope.nationalHolidayTablesItems = [];

                    var totalEvent = [];

                    for (var index = 0; index < res.payload.length; index++) {
                        var eventItem = {
                            color: baConfig.colors.warning,
                            start: DateUtil.getShiftDatefromFirstDate(res.payload[index].create_formDate, res.payload[index].day - 1),
                            // title: DateUtil.getShiftDatefromFirstDate(res.payload[index].create_formDate, res.payload[index].day),
                            title: ''
                        }
                        console.log(eventItem);
                        totalEvent.push(eventItem);
                    }

                    console.log(totalEvent);


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
                                    start: start
                                    // end: end
                                };
                                $element.fullCalendar('renderEvent', eventData, true); // stick? = true
                            }
                            $element.fullCalendar('unselect');
                        },
                        editable: false,
                        eventLimit: true, // allow "more" link when too many events
                        events: totalEvent,
                    });
                }
            })
            .error(function () {
                console.log('ERROR NationalHolidayUtil.fetchAllNationalHolidays');
            })

        // Project.findAll()
        //     .success(function (allProjects) {
        //         console.log('rep - GET ALL Project, SUCCESS');
        //         console.log(allProjects);
        //         $scope.loading = false;
        //         $scope.projects = allProjects
        //
        //         var totalEvent = [];
        //
        //         for (var index = 0; index < $scope.projects.length; index++) {
        //             var eventItem = {
        //                 title: $scope.projects[index].name + " - " + ProjectUtil.getTypeText($scope.projects[index].type),
        //                 start: DateUtil.formatDate($scope.projects[index].endDate),
        //                 color: baConfig.colors.warning,
        //             }
        //             console.log(eventItem);
        //             totalEvent.push(eventItem);
        //         }
        //
        //         // Init Calender
        //         var $element = $('#calendar').fullCalendar({
        //             //height: 335,
        //             header: {
        //                 left: 'prev, next today',
        //                 center: 'title',
        //                 right: 'month,agendaWeek,agendaDay'
        //             },
        //             defaultDate: new Date(),
        //             selectable: true,
        //             selectHelper: true,
        //             select: function (start, end) {
        //                 var title = prompt('建立事件:');
        //                 var eventData;
        //                 if (title) {
        //                     eventData = {
        //                         title: title,
        //                         start: start,
        //                         end: end
        //                     };
        //                     $element.fullCalendar('renderEvent', eventData, true); // stick? = true
        //                 }
        //                 $element.fullCalendar('unselect');
        //             },
        //             editable: true,
        //             eventLimit: true, // allow "more" link when too many events
        //             events: totalEvent,
        //         });
        //
        //     });
    }
})();