var fs = require('fs');
var readline = require('readline');
var moment = require('moment');

var fileDate = moment().format('YYYYMMDD').toString();
var fReadName = '../../HR/CARD/' + fileDate + '.txt';
var fReadName_gps = '../../HR/GPS/' + fileDate + '.txt';

var fRead = fs.createReadStream(fReadName);


var hrMAchineModel = require('../server/restfulAPI/models/hrMachine')(fileDate);

try {
    var fileContents = fs.readFileSync(fReadName);
} catch (err) {
    // Here you get the error when the file was not found,
    // but you also get any other error
    // 無檔案處理
    console['log'](err && err['stack'] ? err['stack'] : err);
}

fs.readFile(fReadName, function (err, data) {
    if (err) {
        throw err;
    }
    console.log("Readline start !!!, fileDate= " + fileDate);

    hrMAchineModel.remove({
    }, function (err) {
        if (err) {
            res.send(err);
        }
    })

    var objReadline = readline.createInterface({
        input: fRead,
        // 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用
        // 但文件末尾会多算一次index计数   sodino.com
        //  output: fWrite,
        //  terminal: true
    });

    var index = 1;
    objReadline.on('line', function (line) {
        var tempObject = [];
        for (var lineIndex = 0; lineIndex < line.split(',').length; lineIndex ++) {
            switch (lineIndex) {
                case 0:
                    tempObject.location = line.split(',')[lineIndex];
                    break;
                case 1:
                    tempObject.did = line.split(',')[lineIndex];
                    break;
                case 2:
                    tempObject.date = line.split(',')[lineIndex];
                    break;
                case 3:
                    tempObject.time = line.split(',')[lineIndex];
                    break;
                case 4:
                    tempObject.workType = line.split(',')[lineIndex];
                    break;
                case 5:
                    tempObject.printType = line.split(',')[lineIndex];
                    break;
            }
        }
        hrMAchineModel.create({
            location: tempObject.location,
            did: tempObject.did,
            date: tempObject.date,
            time: tempObject.time,
            workType: tempObject.workType,
            printType: tempObject.printType,
        }, function (err) {
            if (err) {
                console.log("err= " + err);
                res.send(err);
            }
        })
        index ++;
    });

    objReadline.on('close', function () {
        console.log('Readline close...index= ' + index);
        readGPSFile();
    });

    objReadline.on('resume', function () {
        console.log('Readline resumed.');
    });

    objReadline.on('pause', function () {
        console.log('Readline paused.');
    });
});

function readGPSFile() {

    try {
        var fileContents_gps = fs.readFileSync(fReadName_gps);
        var fRead_gps = fs.createReadStream(fReadName_gps);
    } catch (err) {
        // Here you get the error when the file was not found,
        // but you also get any other error
        // 無檔案處理
        console['log'](err && err['stack'] ? err['stack'] : err);
        return;
    }


    fs.readFile(fReadName_gps, function (err, data) {
        if (err) {
            throw err;
        }
        console.log("Readline GPS start !!!, " + fileDate);

        // hrMAchineModel.remove({
        // }, function (err) {
        //     if (err) {
        //         res.send(err);
        //     }
        // })

        var objReadLine = readline.createInterface({
            input: fRead_gps,
            // 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用
            // 但文件末尾会多算一次index计数   sodino.com
            //  output: fWrite,
            //  terminal: true
        });

        var index = 1;
        objReadLine.on('line', function (line) {
            var tempObject = [];
            for (var lineIndex = 0; lineIndex < line.split(',').length; lineIndex ++) {
                switch (lineIndex) {
                    case 0:
                        tempObject.location = line.split(',')[lineIndex];
                        break;
                    case 1:
                        tempObject.did = line.split(',')[lineIndex];
                        break;
                    case 2:
                        tempObject.date = line.split(',')[lineIndex];
                        break;
                    case 3:
                        tempObject.time = line.split(',')[lineIndex];
                        break;
                    case 4:
                        tempObject.workType = line.split(',')[lineIndex];
                        break;
                    case 5:
                        tempObject.printType = line.split(',')[lineIndex];
                        break;
                    case 6:
                        tempObject.gps_location = line.split(',')[lineIndex];
                        break;
                    case 7:
                        tempObject.gps_location += ", " + line.split(',')[lineIndex];
                        break;
                    case 8:
                        tempObject.gps_type = line.split(',')[lineIndex];
                        break;
                    case 9:
                        tempObject.gps_status = line.split(',')[lineIndex];
                        break;
                }
            }
            hrMAchineModel.create({
                location: tempObject.location,
                did: tempObject.did,
                date: tempObject.date,
                time: tempObject.time,
                workType: tempObject.workType,
                printType: tempObject.printType,
                gps_location: tempObject.gps_location,
                gps_type: tempObject.gps_type,
                gps_status: tempObject.gps_status,
            }, function (err) {
                if (err) {
                    console.log("err= " + err);
                    res.send(err);
                }
            })
            index ++;
        });

        objReadLine.on('close', function () {
            console.log('Readline GPS close...index= ' + index);
        });

        objReadLine.on('resume', function () {
            console.log('Readline GPS resumed.');
        });

        objReadLine.on('pause', function () {
            console.log('Readline GPS paused.');
        });
    });
}