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
                '$filter',
                'baConfig',
                'Project',
                'DateUtil',
                'User',
                'ngDialog',
                'WorkOffFormUtil',
                'NationalHolidayUtil',
                'WorkOffTypeUtil',
                'TravelApplicationUtil',
                'ProjectUtil',
                MyCalendarCtrl
            ]);

    /** @ngInject */
    function MyCalendarCtrl($scope,
                            $filter,
                            baConfig,
                            Project,
                            DateUtil,
                            User,
                            ngDialog,
                            WorkOffFormUtil,
                            NationalHolidayUtil,
                            WorkOffTypeUtil,
                            TravelApplicationUtil,
                            ProjectUtil) {

        var dashboardColors = baConfig.colors.dashboard;

        var date = new Date();
        var thisYear = date.getFullYear() - 1911;
        var thisMonth = date.getMonth() + 1; //January is 0!;

        var getData = {
            year: thisYear,
        }

        User.getAllUsersWithSignOut()
            .success(function (allUsers) {
                $scope.allUsers = [];
                for (var i = 0; i < allUsers.length; i++) {
                    $scope.allUsers[i] = {
                        value: allUsers[i]._id,
                        bossID: allUsers[i].bossID,
                        name: allUsers[i].name
                    };
                }
                $scope.fetchData();
            })

        // NationalHolidayUtil.fetchAllNationalHolidays(getData)
        //     .success(function (res) {
        //         console.log(" === 行事曆 === ")
        //         console.log(res.payload);
        //         if (res.payload.length > 0) {
        //             $scope.nationalHolidayTablesItems = [];
        //
        //             var totalEvent = [];
        //
        //             for (var index = 0; index < res.payload.length; index++) {
        //                 var eventItem = {
        //                     color: baConfig.colors.danger,
        //                     start: DateUtil.getShiftDatefromFirstDateCalendar(res.payload[index].create_formDate, res.payload[index].day - 1),
        //                     // title: DateUtil.getShiftDatefromFirstDate(res.payload[index].create_formDate, res.payload[index].day),
        //                     title: '放假日',
        //                     msg: 'test',
        //                 }
        //                 // console.log(eventItem);
        //                 totalEvent.push(eventItem);
        //             }
        //
        //             console.log(totalEvent);
        //
        //             // Init Calender
        //             var $element = $('#myCalendar').fullCalendar({
        //                 //height: 335,
        //                 header: {
        //                     left: 'prev, next today',
        //                     center: 'title',
        //                     right: 'month,agendaWeek,agendaDay'
        //                 },
        //                 defaultDate: new Date(),
        //                 selectable: false,
        //                 selectHelper: false,
        //                 select: function (start, end) {
        //                     var title = prompt('Event Title:');
        //                     var eventData;
        //                     if (title) {
        //                         eventData = {
        //                             title: title,
        //                             start: start
        //                             // end: end
        //                         };
        //                         $element.fullCalendar('renderEvent', eventData, true); // stick? = true
        //                     }
        //                     $element.fullCalendar('unselect');
        //                 },
        //                 editable: false,
        //                 eventLimit: true, // allow "more" link when too many events
        //                 events: totalEvent,
        //                 // dayClick: function(date, jsEvent, view) {
        //                 //
        //                 //     alert('Clicked on: ' + date.format());
        //                 //
        //                 //     // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
        //                 //     //
        //                 //     // alert('Current view: ' + view.name);
        //                 //     //
        //                 //     // // change the day's background color just for fun
        //                 //     // $(this).css('background-color', 'red');
        //                 // }
        //                 eventClick: function(calEvent, jsEvent, view) {
        //
        //                     console.log(calEvent);
        //
        //                 }
        //             });
        //         }
        //     })
        //     .error(function () {
        //         console.log('ERROR NationalHolidayUtil.fetchAllNationalHolidays');
        //     })

        $scope.fetchData = function () {
            var formData = {
                isBulletin: true,
                year: thisYear,
                isSendReview: true,
                isAgentCheck: true,
                isBossCheck: true,
            };
            $scope.bulletinItems = [];
            WorkOffFormUtil.findWorkOffTableItemByParameter(formData)
                .success(function (res) {
                    var totalEvent = [];
                    for (var index = 0; index < res.payload.length; index ++) {
                        var item = res.payload[index];
                        var date = $scope.showDate(item);
                        item.date = date;
                        var eventItem = {
                            color: baConfig.colors.success,
                            start: date,
                            // title: DateUtil.getShiftDatefromFirstDate(res.payload[index].create_formDate, res.payload[index].day),
                            title: $scope.showMan(item.creatorDID) + ", " + item.start_time + "-" + item.end_time,
                            msg: date + ", " + $scope.showDay(item.day) + ", " +
                                item.start_time + "-" + item.end_time,
                            item: item,
                        }
                        totalEvent.push(eventItem);
                    }
                    // $scope.bulletinItems = $scope.bulletinItems.sort(function (a, b) {
                    //     return a._date > b._date ? 1 : -1;
                    // });

                    var formData = {
                        isBulletin: true,
                        year: thisYear,
                        // month: 3,
                        isSendReview: true,
                        isBossCheck: true,
                    };

                    TravelApplicationUtil.getTravelApplicationItem(formData)
                        .success(function (resp) {
                            for (var index = 0; index < resp.payload.length; index ++) {
                                var item = resp.payload[index];
                                item.taStartDate = item.taStartDate.replaceAll("/", "-");
                                item.date = item.taStartDate;
                                var eventItem = {
                                    color: baConfig.colors.info,
                                    start: item.taStartDate,
                                    title: $scope.showMan(item.creatorDID) + ", " + item.start_time + "-" + item.end_time,
                                    item: item,
                                }
                                totalEvent.push(eventItem);
                            }

                            // $scope.bulletinItems_travel = $scope.bulletinItems_travel.sort(function (a, b) {
                            //     return a.taStartDate > b.taStartDate ? 1 : -1;
                            // });

                            // Init Calender
                            var $element = $('#myCalendar').fullCalendar({
                                firstDay: 1,
                                // contentHeight: 1500,
                                header: {
                                    left: 'prev, next today',
                                    center: 'title',
                                    right: 'month,agendaWeek,agendaDay'
                                },
                                locale: 'zh-tw',
                                timeZone: 'Asia/Taipei',
                                defaultDate: new Date(),
                                selectable: false,
                                selectHelper: false,
                                // select: function (start, end) {
                                //     var title = prompt('Event Title:');
                                //     var eventData;
                                //     if (title) {
                                //         eventData = {
                                //             title: title,
                                //             start: start
                                //             // end: end
                                //         };
                                //         $element.fullCalendar('renderEvent', eventData, true); // stick? = true
                                //     }
                                //     $element.fullCalendar('unselect');
                                // },
                                editable: false,
                                eventLimit: true, // allow "more" link when too many events
                                events: totalEvent,
                                eventClick: function(calEvent, jsEvent, view) {
                                    $scope.showMsg(calEvent.item);
                                    // console.log(calEvent);
                                }
                            });
                        })


                })




        }

        $scope.showDate = function (table) {
            return DateUtil.getShiftDatefromFirstDateCalendar(
                DateUtil.getFirstDayofThisWeek(moment(table.create_formDate)),
                table.day === 0 ? 6 : table.day - 1);
        }

        $scope.showMan = function (userDID) {
            var selected = [];
            if (userDID) {
                selected = $filter('filter')($scope.allUsers, {
                    value: userDID
                });
            }
            return selected.length ? selected[0].name : 'Not Set';
        }

        $scope.showMsg = function (item) {
            console.log(item);
            $scope.title = $scope.showMan(item.creatorDID);
            $scope.date = item.date;
            $scope.duration = item.start_time + "-" + item.end_time;
            $scope.location = item.location;
            if (item.workOffType == undefined) {
                $scope.type = "出差";
            } else {
                $scope.type = $scope.showWorkOffTypeString(item.workOffType);
            }
            ngDialog.open({
                template: 'app/pages/myModalTemplate/calendarMsgModal.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false,
            });
        }

        $scope.showDay = function (day) {
            return DateUtil.getDay(day)
        }

        // 顯示假期名
        $scope.showWorkOffTypeString = function (type) {
            return WorkOffTypeUtil.getWorkOffString(type);
        }
    }
})();