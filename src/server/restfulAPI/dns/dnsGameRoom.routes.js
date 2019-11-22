var fs = require('fs');
var DNSPlayRoom = require('../dns/models/dnsPlayRoom');
var moment = require('moment');

module.exports = function (app) {

    // check server status
    app.get(global.apiUrl.get_dns_check_server_status, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, get_dns_check_server_status");
        res.status(200).send({
            code: 200,
            error: global.status._200,
        });
    });

    // create room
    app.post(global.apiUrl.post_dns_create_game_room, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_create_game_room");
        console.log(req.body);

        req.body.roomOwner.status = 1;

        var participants = [req.body.roomOwner];
        var owner = [req.body.roomOwner];
        DNSPlayRoom.create(
            {
                roomOwner: owner,
                playTime: req.body.playTime,
                difficulty: req.body.difficulty,
                isAdult: req.body.isAdult,
                joinNumber: Math.floor(100000 + Math.random() * 900000),
                participants: participants,
                timestamp: moment(new Date()).format("YYYYMMDD_HHmmss"),
            },
            function (err, room) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_create_game_room");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: room
                    });
                }
            })
    })


    // get room info
    app.post(global.apiUrl.post_dns_fetch_room_info, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_fetch_room_info");

        DNSPlayRoom.find(
            {
                joinNumber: req.body.joinNumber,
            }, function (err, roomInfo) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_fetch_room_info");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: roomInfo
                    });
                }
            })
    })

    // check is Owner
    app.post(global.apiUrl.post_dns_check_room_owner, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_check_room_owner");

        DNSPlayRoom.find(
            {
                joinNumber: req.body.joinNumber,
                roomOwner: {
                    $in : req.body.player
                }
            }, function (err, room) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_join_game_room");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: room
                    });
                }
            })
    })

    // ready game Room
    app.post(global.apiUrl.post_dns_ready_game_room, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_ready_game_room");
        console.log(req.body);

        DNSPlayRoom.updateOne(
            {
                joinNumber: req.body.joinNumber,
                "participants.email": req.body.player.email,
            }, {
                $set: {
                    "participants.$.status": 2,
                }
            }, function (err, result) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_ready_game_room");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    console.log(result);
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: result
                    });
                }
            })
    })

    // join room
    app.post(global.apiUrl.post_dns_join_game_room, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_join_game_room");
        console.log(req.body);

        DNSPlayRoom.updateOne(
            {
                joinNumber: req.body.joinNumber,
                participants: {
                    $nin: req.body.player
                }
            }, {
                $push: {
                    participants: req.body.player,
                }
            }, function (err, result) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_join_game_room");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    console.log(result);
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: result
                    });
                }
            })
    })

    // quit room
    app.post(global.apiUrl.post_dns_quit_game_room, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_quit_game_room");

        DNSPlayRoom.updateOne(
            {
                joinNumber: req.body.joinNumber
            }, {
                $pull: {
                    participants: req.body.player,
                }
            }, function (err, room) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_quit_game_room");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: room
                    });
                }
            })

    })

    // update room status
    app.post(global.apiUrl.post_dns_update_room_status, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_update_room_status");
        console.log(req.body);

        DNSPlayRoom.update(
            {
                joinNumber: req.body.joinNumber
            }, {
                $set: {
                    roomStatus: req.body.roomStatus,
                }
            }, function (err, room) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_update_room_status");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: req.body.roomStatus
                    });
                }
            })
    })

    // make random orders of participants
    app.post(global.apiUrl.post_dns_make_random_orders_participants, function (req, res) {
        console.log(global.timeFormat(new Date()) + global.log.i + "API, post_dns_make_random_orders_participants");
        console.log(req.body);

        DNSPlayRoom.findOne(
            {
                joinNumber: req.body.joinNumber
            }, function (err, room) {
                var results = shuffle(room.participants);

                DNSPlayRoom.updateOne(
                    {
                        joinNumber: req.body.joinNumber
                    }, {
                        $set: {
                            playOrders: results,
                        }
                    }, function (err) {
                        if (err) {
                            console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_make_random_orders_participants");
                            console.log(req.body);
                            console.log(" ***** ERROR ***** ");
                            console.log(err);
                            res.send(err);
                        } else {
                            DNSPlayRoom.findOne(
                                {
                                    joinNumber: req.body.joinNumber
                                }, function (err, room) {
                                    if (err) {
                                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_dns_make_random_orders_participants");
                                        console.log(req.body);
                                        console.log(" ***** ERROR ***** ");
                                        console.log(err);
                                        res.send(err);
                                    } else {
                                        res.status(200).send({
                                            code: 200,
                                            error: global.status._200,
                                            payload: room
                                        });
                                    }
                                })
                        }
                    })
            })
    })

}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
