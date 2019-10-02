// set up ======================================================================
var express = require('express');
var timeout = require('connect-timeout')
const app = express();

var database = require('./database');           // load the database config
var mongoose = require('mongoose'); 				// mongoose for mongodb

// var port = normalizePort(process.env.PORT || '8080');
var port = process.env.PORT || 16788; 				// set the port

var path = require('path');
//var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
// var http = require('http');

// 加入這兩行
// const server = require('http').Server(app);
// const io = require('socket.io')(server);
// const socketPort = 9000;

// server.listen(socketPort, function () {
//     console.log("--------- Socket Server Started. http://localhost:" + socketPort + " --------------");
// });

var util = require('util');
var events = require('events');

var EventEmitter = function() {
};

util.inherits(EventEmitter, events.EventEmitter);

EventEmitter.prototype.response = function(targetID, msg) {
    this.emit('response', targetID, msg);
};

const mainEventEmitter = new EventEmitter();
global.qqq = mainEventEmitter;

// 當發生連線事件
// io.on('connection', connection);
// 當發生離線事件

var memberSocketMap = [];

// io.on('connection', function (socket){
//     console.log('------- Socket Connect Success ------');
//     // console.log(socket);
//     // console.log('=============' + socket.handshake.headers.cookie + '=============');
//     var cookieArray = socket.handshake.headers.cookie.split(";");
//     cookieArray.forEach(function(ele) {
//         if(ele.includes("userDID")){
//             var userDID = ele.split('=');
//             evalString = "memberSocketMap[\'" + userDID[1] + "\']=socket";
//             eval(evalString);
//         }
//     })
//     mainEventEmitter.on('response', function(targetID, msg) {
//         // socket.emit("greet", msg);
//         // console.log(memberSocketMap[targetID]);
//         if (memberSocketMap[targetID] !== undefined) {
//             memberSocketMap[targetID].emit("greet", msg);
//         }
//     });
//
//     socket.on('disconnect', function () {
//         console.log('Bye~');  // 顯示 bye~
//     })
// });


// var index = require('./routes/index');
// var users = require('./routes/users');

// configuration ===============================================================
mongoose.connect(database.localUrl);

// require('../../app/load');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hogan');

// set the static files location /public/img will be /img for users
app.use(express.static('./public'));
// app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

app.use(timeout('10s'))

// view engine setup
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// app.use('/', index);
// app.use('/users', users);


/**
 * console log write config
 */
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream('log.txt', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

/**
 * Get port from environment and store in Express.
 */

// app.set('port', port);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("-------- Restful Server listening on port " + port + " --------");

// /**
//  * Create HTTP server.
//  */
//
// var server = http.createServer(app);
//
// /**
//  * Listen on provided port, on all network interfaces.
//  */
//
// server.listen(port);
app.on('error', onError);
app.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
}

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     console.log('Error= ' + res.locals.message.toString());
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;
