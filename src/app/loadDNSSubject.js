var fs = require('fs');
var readline = require('readline');
var moment = require('moment');

const dnsRawFolder = './dnsRaw/';

var dnsSubjectModel = require('../server/restfulAPI/dns/models/dnsSubject')();

dnsSubjectModel.remove({
    }, function (err) {
        if (err) {
            res.send(err);
        }
    })

fs.readdir(dnsRawFolder, (err, files) => {
    files.forEach(file => {
        console.log(file);

        var fileName = file;
        var fReadName = './dnsRaw/' + fileName;

        var fRead = fs.createReadStream(fReadName);


        var dnsSubjectModel = require('../server/restfulAPI/dns/models/dnsSubject')();

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
            console.log("Readline start !!!, " + fileName);

            // dnsSubjectModel.remove({
            // }, function (err) {
            //     if (err) {
            //         res.send(err);
            //     }
            // })

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
                            tempObject.difficulty = line.split(',')[lineIndex];
                            break;
                        case 1:
                            tempObject.isAdult = line.split(',')[lineIndex];
                            break;
                        case 2:
                            tempObject.content = line.split(',')[lineIndex];
                            break;
                        case 3:
                            tempObject.locale = line.split(',')[lineIndex];
                            break;
                    }
                }
                dnsSubjectModel.create({
                    difficulty: tempObject.difficulty,
                    isAdult: tempObject.isAdult,
                    content: tempObject.content,
                    locale: tempObject.locale,
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
            });

            objReadline.on('resume', function () {
                console.log('Readline resumed.');
            });

            objReadline.on('pause', function () {
                console.log('Readline paused.');
            });
        });

    });
});

