var moment = require('moment');

var fs = require('fs');
var readline = require('readline');

module.exports = function (app) {
    'use strict';
    // ----- define routes

    // fetch
    app.post(global.apiUrl.post_fetch_hrmachine_data_by_machine_did, function (req, res) {
        var resultArry = [];
        // console.log(req.body);
        var startDate = moment(req.body.startDate);

        var endDate = moment(req.body.endDate);

        var daysCount = endDate.diff(startDate, 'days');
        console.log("daysCount= " + (daysCount + 1) + ", startDate= " + req.body.startDate + ", endDate= " + req.body.endDate);

        var resultCount = 0;

        startDate.add(-1, 'days');
        for (var index = 0; index < daysCount + 1; index ++) {
            var workDate = startDate.add(1, 'days').format('YYYYMMDD');
            // console.log(index + ", " + workDate);

            var HrMachineForm = require('../../models/hrMachine')(workDate);

            HrMachineForm.find({
                did: req.body.machineDID,
            }, function (err, formDataResponse) {
                resultCount++;
                if (err) {
                    res.send(err);
                }
                // console.log(formDataResponse);
                // console.log(formDataResponse.length);
                if (formDataResponse.length > 0) {
                    resultArry.push(formDataResponse);
                }

                // console.log(resultCount);

                if (resultCount === daysCount + 1) {
                    // console.log(resultArry);
                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: resultArry,
                    });
                }
            })
        }
    });

    // fetch one Day
    app.post(global.apiUrl.post_fetch_hrmachine_data_one_day_by_machine_did, function (req, res) {
        var resultArry = [];
        // console.log(req.body);
        var today = req.body.today;

        console.log("today= " + today);

        var resultCount = 0;

        var HrMachineForm = require('../../models/hrMachine')(today);

        // HrMachineForm.find({
        //     did: req.body.machineDID,
        // }, function (err, formDataResponse) {
        //     resultCount++;
        //     if (err) {
        //         res.send(err);
        //     }
        //     // console.log(formDataResponse);
        //     // console.log(formDataResponse.length);
        //     if (formDataResponse.length > 0) {
        //         resultArry.push(formDataResponse);
        //     }
        //
        //     // console.log(resultCount);
        //
        //     // console.log(resultArry);
        //     res.status(200).send({
        //         code: 200,
        //         error: global.status._200,
        //         payload: resultArry,
        //     });
        // })

        HrMachineForm.find({
            did: req.body.machineDID
        })
            .sort({
                date: 1
            })
            .exec(function (err, formDataResponse) {
                resultCount++;
                if (err) {
                    res.send(err);
                }
                // console.log(formDataResponse);
                // console.log(formDataResponse.length);
                if (formDataResponse.length > 0) {
                    resultArry.push(formDataResponse);
                }

                // console.log(resultCount);

                // console.log(resultArry);
                res.status(200).send({
                    code: 200,
                    error: global.status._200,
                    payload: resultArry,
                });
            });

    });

    // Load Date File
    app.post(global.apiUrl.post_load_hrmachine_data_by_date, function (req, res) {
        var fileDate = req.body.loadDate;
        var fReadName = '../../HR/CARD/' + fileDate + '.txt';

        fs.stat(fReadName, function(err, stat) {
            if(err == null) {
                console.log('File exists');
                loadData(fileDate, fReadName, req, res);
            } else if(err.code == 'ENOENT') {
                // file does not exist
                console.log('ENOENT');
                res.status(400).send({
                    code: 200,
                    error: global.status._400,
                });
            } else {
                console.log('Some other error: ', err.code);
            }
        });

    });

    function loadData(fileDate, fReadName, req, res) {
        var fRead = fs.createReadStream(fReadName);

        var hrMAchineModel = require('../../models/hrMachine')(fileDate);

        try {
            var fileContents = fs.readFileSync(fReadName);
        } catch (err) {
            // Here you get the error when the file was not found,
            // but you also get any other error
            // 無檔案處理
            console['log'](err && err['stack'] ? err['stack'] : err);
            return;
        }
        var resultIndex = 0;

        fs.readFile(fReadName, function (err, data) {
            if (err) {
                throw err;
            }
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
                    resultIndex++;
                    if (err) {
                        res.send(err);
                    }
                    // console.log("resultIndex= " + resultIndex);
                    if (resultIndex === index - 1) {
                        res.status(200).send({
                            code: 200,
                            error: global.status._200,
                        });
                    }
                })
                // console.log(index);
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
    }
}