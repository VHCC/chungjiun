/**
 * @author Ichen.chu
 * created on 01.03.2018
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webSocket', [
        'ngWebsocket'
    ])
        // .run(function($websocket) {
        //     console.log($websocket);
        //     var ws = $websocket.$new('ws://localhost:5566'); // instance of ngWebsocket, handled by $websocket service
        //
        //     ws.$on('$open', function () {
        //         console.log('Oh my gosh, websocket is really open! Fukken awesome!');
        //
        //         ws.$emit('ping', 'hi listening websocket server'); // send a message to the websocket server
        //
        //         var data = {
        //             level: 1,
        //             text: 'ngWebsocket rocks!',
        //             array: ['one', 'two', 'three'],
        //             nested: {
        //                 level: 2,
        //                 deeper: [{
        //                     hell: 'yeah'
        //                 }, {
        //                     so: 'good'
        //                 }]
        //             }
        //         };
        //
        //         ws.$emit('pong', data);
        //     });
        //
        //     ws.$on('pong', function (data) {
        //         console.log('The websocket server has sent the following data:');
        //         console.log(data);
        //
        //         ws.$close();
        //     });
        //
        //     ws.$on('$close', function () {
        //         console.log('Noooooooooou, I want to have more fun with ngWebsocket, damn it!');
        //     });
        // })
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        console.log("12312312313133")
    }
})();
