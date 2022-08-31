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
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_fetch_hrmachine_data_by_machine_did");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    // console.log(formDataResponse);
                    // console.log(formDataResponse.length);
                    if (formDataResponse != undefined && formDataResponse.length > 0) {
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
                }

            })
        }
    });

    // fetch one Day
    app.post(global.apiUrl.post_fetch_hrmachine_data_one_day_by_machine_did, function (req, res) {
        var resultArry = [];
        console.log(req.body);
        var date = req.body.date;

        console.log("today= " + date);

        var resultCount = 0;

        var HrMachineForm = require('../../models/hrMachine')(date);

        HrMachineForm.find({
            did: req.body.machineDID
        })
            .sort({
                date: 1,
                time: 1,
                _id: 1
            })
            .exec(function (err, formDataResponse) {
                resultCount++;
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, post_fetch_hrmachine_data_one_day_by_machine_did");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                } else {
                    if (formDataResponse != undefined && formDataResponse.length > 0) {
                        resultArry.push(formDataResponse);
                    }

                    res.status(200).send({
                        code: 200,
                        error: global.status._200,
                        payload: resultArry,
                    });
                }
            });
    });

    // Load Date File for specific date
    app.post(global.apiUrl.post_load_hrmachine_data_by_date, function (req, res) {
        var fileDate = req.body.loadDate;
        var fReadName = '../../HR/CARD/' + fileDate + '.txt';

        fs.stat(fReadName, function(err, stat) {
            if(err == null) {
                console.log('File exist, fileDate= ' + fileDate);

                var fReadName_gps = '../../HR/GPS/' + fileDate + '.txt';

                fs.stat(fReadName_gps, function(err, stat) {
                    if(err == null) {
                        console.log('GPS File exist, fileDate= ' + fileDate);
                        loadData(fileDate, fReadName, req, res);
                    } else if(err.code == 'ENOENT') {
                        // file does not exist
                        console.log('GPS File not exist, fileDate= ' + fileDate);
                        res.status(400).send({
                            code: 400,
                            fileDate: fileDate + " GPS",
                            error: global.status._400,
                        });
                    } else {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, post_load_hrmachine_data_by_date");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        console.log('Some other error: ', err.code);
                    }
                });
                // loadData(fileDate, fReadName, req, res);
            } else if(err.code == 'ENOENT') {
                // file does not exist
                console.log('File not exist, fileDate= ' + fileDate);
                res.status(400).send({
                    code: 400,
                    fileDate: fileDate,
                    error: global.status._400,
                });
            } else {
                console.log(global.timeFormat(new Date()) + global.log.e + "API, post_load_hrmachine_data_by_date");
                console.log(req.body);
                console.log(" ***** ERROR ***** ");
                console.log(err);
                console.log('Some other error: ', err.code);
            }
        });
    });

    // var exec = require('child_process').exec;



    function loadData(fileDate, fReadName, req, res) {

        // var rowLength = 0;
        // exec('wc -l ' + fReadName, function (error, results) {
        //     console.log("QQQQQQ");
        //     console.log(results);
        //     rowLength = results[0];
        // });

        var fRead = fs.createReadStream(fReadName);

        var hrMachineModel = require('../../models/hrMachine')(fileDate);

        try {
            var fileContents = fs.readFileSync(fReadName);
        } catch (err) {
            // Here you get the error when the file was not found,
            // but you also get any other error
            // 無檔案處理
            console.log("File error !!!, file name= " + fReadName);
            console['log'](err && err['stack'] ? err['stack'] : err);
            return;
        }
        var resultIndex = 0;

        fs.readFile(fReadName, function (err, data) {
            if (err) {
                throw err;
            }

            console.log("Readline CARD start !!!, fileDate= " + fileDate);

            hrMachineModel.remove({
            }, function (err) {
                if (err) {
                    console.log(global.timeFormat(new Date()) + global.log.e + "API, loadData");
                    console.log(req.body);
                    console.log(" ***** ERROR ***** ");
                    console.log(err);
                    res.send(err);
                    return;
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
            var readCardDone = false;
            objReadline.on('line', function (line) {
                index ++;
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
                hrMachineModel.create({
                    location: tempObject.location,
                    did: tempObject.did,
                    date: tempObject.date,
                    time: tempObject.time,
                    workType: tempObject.workType,
                    printType: tempObject.printType,
                }, function (err) {
                    resultIndex++;
                    if (err) {
                        console.log(global.timeFormat(new Date()) + global.log.e + "API, loadData");
                        console.log(req.body);
                        console.log(" ***** ERROR ***** ");
                        console.log(err);
                        res.send(err);
                        return;
                    } else {
                        // console.log("resultIndex= " + resultIndex);
                        if (resultIndex === (index - 1) && readCardDone) {
                            console.log(" ===== $$$$$ SEND REQUEST BACK ===== , DAO counts= " + resultIndex + ", readFile index:> " + index);
                            res.status(200).send({
                                code: 200,
                                fileDate: fileDate,
                                error: global.status._200,
                            });
                            return;
                        }
                    }
                })
                // console.log(index);
            });

            objReadline.on('close', function () {
                readCardDone = true;
                console.log(' ***** READ CARD DONE ***** Readline close... CARD data rows:> ' + index);
                loadGPSData(fileDate);
            });

            objReadline.on('resume', function () {
                console.log('Readline resumed.');
            });

            objReadline.on('pause', function () {
                console.log('Readline paused.');
            });
        });
    }


    function loadGPSData(fileDate) {
        var fReadName_gps = '../../HR/GPS/' + fileDate + '.txt';

        var fRead_gps = fs.createReadStream(fReadName_gps);

        var hrMachineModel = require('../../models/hrMachine')(fileDate);

        try {
            var fileContents_gps = fs.readFileSync(fReadName_gps);

        } catch (err) {
            // Here you get the error when the file was not found,
            // but you also get any other error
            // 無檔案處理
            console.log("File error !!!, file name= " + fReadName_gps);
            console['log'](err && err['stack'] ? err['stack'] : err);
            return;
        }

        fs.readFile(fReadName_gps, function (err, data) {
            if (err) {
                throw err;
            }
            console.log("Readline GPS start !!!, " + fileDate);

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
                hrMachineModel.create({
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
                        return
                    }
                })
                index ++;
            });

            objReadLine.on('close', function () {
                console.log('Readline GPS close...GPS data rows:> ' + index);
            });

            objReadLine.on('resume', function () {
                console.log('Readline GPS resumed.');
            });

            objReadLine.on('pause', function () {
                console.log('Readline GPS paused.');
            });
        });
    }
}