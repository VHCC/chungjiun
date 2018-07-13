var fs = require('fs');
const readline = require('readline');

var fileDate = '20180711'

var fReadName = '../HR/CARD/' + fileDate + '.txt';
var fRead = fs.createReadStream(fReadName);

var hrMAchineModel = require('../server/restfulAPI/models/hrmachine')(fileDate);

fs.readFile(fReadName, function (err, data) {
    if (err) throw err;
    console.log("Readline start !!!");

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
                res.send(err);
            }
        })
        index ++;
    });

    objReadline.on('close', function () {
        console.log('Readline close...');
    });

    objReadline.on('resume', function () {
        console.log('Readline resumed.');
    });

    objReadline.on('pause', function () {
        console.log('Readline paused.');
    });
});